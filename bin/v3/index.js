/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';
const Exception     = require('../exception');
const params        = require('./param-style');
const Random        = require('../random');
const serial        = require('./serialize');
const util          = require('../util');

module.exports = Version;


// modify the random object
const random = (() => {
    const random = Object.create(Random);
    random._object = random.object;
    random.object = function(schema) {
        if (schema.oneOf) {
            const index = Math.floor(Math.random() * schema.oneOf.length);
            return this._object(schema.oneOf[index]);

        } else if (schema.anyOf) {
            const index = Math.floor(Math.random() * schema.anyOf.length);
            return this._object(schema.anyOf[index]);

        } else if (schema.not) {
            throw Error('Cannot generate example object using "not"');

        } else {
            return this._object(schema);
        }
    };
    return random;
})();


function Version(enforcer, definition) {
    this.enforcer = enforcer;
    this.definition = definition;
    this.serial = serial;
}

/**
 * Get the discriminator key.
 * @param {object} schema
 * @param {object} value
 * @returns {string}
 */
Version.prototype.getDiscriminatorKey = function(schema, value) {
    const discriminator = schema.discriminator;
    if (discriminator && value.hasOwnProperty(discriminator.propertyName)) return value[discriminator.propertyName];
};

/**
 * Get the discriminator schema.
 * @param {object} schema
 * @param {object} value
 * @returns {object}
 */
Version.prototype.getDiscriminatorSchema = function(schema, value) {
    const key = this.getDiscriminatorKey(schema, value);
    if (key) {
        const discriminator = schema.discriminator;
        const mapping = discriminator.mapping;
        if (mapping && mapping[key]) return mapping[key];

        const schemas = this.definition.components.schemas;
        if (schemas && schemas[key]) return schemas[key];
    }
};

/**
 * Get general data about the response.
 * @param {string[]} produces
 * @param {object} responses
 * @param {{ code: string, contentType: string }} options
 * @returns {{ accept?: string, code?: string, contentType?: string, error?: string, headers?: object, schema?: object }}
 */
Version.prototype.getResponseData = function(produces, responses, options) {
    if (!responses) return { error: 'No response definitions exists' };

    let code = options.hasOwnProperty('code')
        ? '' + options.code
        : responses.hasOwnProperty('default') ? 'default' : Object.keys(responses)[0];
    if (!responses.hasOwnProperty(code)) {
        if (responses.hasOwnProperty('default')) {
            code = 'default';
        } else {
            return { error: 'Response code not valid' };
        }
    }
    const schema = responses[code];

    const result = {
        accept: options.contentType || '*/*',
        code: code,
        headers: schema.headers || {}
    };
    if (!schema.content) return result;

    const match = util.findMediaMatch(result.accept, Object.keys(schema.content))[0];
    if (!match) return result;

    const content = schema.content[match];
    result.contentType = match;
    result.schema = content.schema;
    return result;
};

/**
 * Get an existing response example.
 * @param {object} options
 * @param {string} [options.accept]
 * @param {string} [options.contentType]
 * @param {string} [options.name]
 * @param {object} options.responseSchema
 * @returns {*}
 */
Version.prototype.getResponseExample = function(options) {
    const content = options.responseSchema.content;
    const contentType = options.contentType;
    const name = options.name;
    if (!content || !content[contentType]) return;

    const data = content[contentType];

    if (data.example) {
        return util.copy(data.example);

    } else if (data.examples) {
        if (name && data.examples.hasOwnProperty(name)) return util.copy(data.examples[name]);
        const names = Object.keys(data.examples);
        if (names.length > 0) {
            const index = Math.floor(Math.random() * names.length);
            return util.copy(data.examples[names[index]]);
        }

    } else if (data.schema && data.schema.example) {
        return util.copy(data.schema.example);
    }
};

/**
 * Deserialize the request parameters.
 * @param {object} schema The path schema object.
 * @param {OpenAPIException} exception
 * @param {object} req
 * @param {object|string} req.body
 * @param {Object<string>} req.cookie
 * @param {Object<string>} req.header
 * @param {string} req.method
 * @param {object<string>} req.path
 * @param {string} req.query
 * @returns {{ exception: OpenAPIException|null, value: null|{ body: string|object, cookie: object, header: object, path: object, query: object, responses: object }}}
 */
Version.prototype.parseRequestParameters = function(schema, exception, req) {
    const mSchema  = schema[req.method];
    const paramTypes = ['cookie', 'header', 'path', 'query'];
    const result = {
        cookie: {},
        header: {},
        path: {},
        query: {},
        responses: {}
    };

    // build a parameter map
    const paramMap = {
        cookie: {},
        header: {},
        path: {},
        query: {}
    };
    [schema, mSchema].forEach(schema => {
        if (schema.parameters) {
            schema.parameters.forEach(param => {
                const store = paramMap[param.in];
                if (store) store[param.name] = param;
            });
        }
    });

    // body already parsed, need to deserialize and check for errors
    if (mSchema.requestBody) {
        if (req.body !== undefined) {
            const contentType = req.header['content-type'] || '*/*';
            const content = mSchema.requestBody.content;
            const key = util.findMediaMatch(contentType, Object.keys(content))[0];
            if (key && content[key].schema) {
                const schema = content[key].schema;
                const bodyException = exception.nest('Invalid request body');
                const value = serial.deserialize(exception, schema, req.body);

                if (!Exception.hasException(bodyException)) {
                    const errors = this.enforcer.errors(schema, value);
                    if (errors) {
                        errors.forEach(error => bodyException.push(error));
                    } else {
                        result.body = value;
                    }
                }
            }

        } else if (mSchema.requestBody.required && req.body === undefined) {
            exception.push('Missing required request body');
        }
    }

    // look for any query parameters that are not allowed
    const definedQueryParams = util.queryParamNames(req.query, false);

    // parse and validate cookie, headers, path, and query
    paramTypes.forEach(paramType => {
        const schemas = paramMap[paramType];
        const values = req[paramType];

        Object.keys(schemas).forEach(name => {
            const definition = schemas[name];
            if (!definition.schema && !definition.content) return;
            const schema = definition.schema || definition.content[Object.keys(definition.content)[0]];
            if (!schema) return;

            const at = definition.in;
            const inQuery = at === 'query';
            if (definedQueryParams.hasOwnProperty(name)) definedQueryParams[name] = true;

            if (values.hasOwnProperty(name) || inQuery) {
                const at = definition.in;
                const style = definition.style || defaultStyle(at);
                const explode = definition.hasOwnProperty('explode') ? definition.explode : style === 'form';
                const type = util.schemaType(schema);
                let parsed;
                let queryValue;
                let value = values[name];

                switch (style) {
                    case 'deepObject':
                        // throw Error because it's a problem with the swagger
                        if (!inQuery) throw Error('The deepObject style only works with query parameters. Error at ' + at + ' parameter "' + name + '"');
                        if (type !== 'object') throw Error('The deepObject style only works with objects but the parameter schema type is ' + type);
                        parsed = params.deepObject(name, req.query, definedQueryParams);
                        if (parsed.value) {
                            Object.keys(parsed.value)
                                .forEach(key => definedQueryParams[name + '[' + key + ']'] = true);
                        }
                        break;

                    case 'form':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'cookie' && !inQuery) throw Error('The form style only works with cookie and query parameters. Error at ' + at + ' parameter "' + name + '"');
                        if (inQuery) {
                            const results = util.queryParamsByName(name, req.query);
                            if (!results) return;
                            if (type === 'array') {
                                value = explode
                                    ? name + '=' + results.join('&' + name + '=')
                                    : name + '=' + results.pop();

                            } else if (type === 'object') {
                                value = explode
                                    ? decodeURIComponent(results.pop())
                                    : 'color=' + results.pop();

                            } else {
                                value = name + '=' + results.pop();
                            }
                        }
                        parsed = params.form(type, explode, name, value, inQuery && definedQueryParams);
                        break;

                    case 'label':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'path') throw Error('The label style only works with path parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.label(type, explode, value);
                        break;

                    case 'matrix':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'path') throw Error('The matrix style only works with path parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.matrix(type, explode, name, value);
                        break;

                    case 'pipeDelimited':
                        // throw Error because it's a problem with the swagger
                        if (!inQuery || (type !== 'object' && type !== 'array')) throw Error('The pipeDelimited style only works with query parameters for the schema type array or object. Error at ' + at + ' parameter "' + name + '"');
                        queryValue = util.queryParamsByName(name, req.query);
                        if (!queryValue) return;
                        parsed = params.pipeDelimited(type, queryValue.pop(), inQuery && definedQueryParams);
                        break;

                    case 'simple':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'path' && at !== 'header') throw Error('The simple style only works with path and header parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.simple(type, explode, value);
                        break;

                    case 'spaceDelimited':
                        // throw Error because it's a problem with the swagger
                        if (!inQuery || (type !== 'object' && type !== 'array')) throw Error('The spaceDelimited style only works with query parameters for the schema type array or object. Error at ' + at + ' parameter "' + name + '"');
                        queryValue = util.queryParamsByName(name, req.query);
                        if (!queryValue) return;
                        parsed = params.spaceDelimited(type, queryValue.pop(), inQuery && definedQueryParams);
                        break;

                    default:
                        throw Error('Invalid parameter style: ' + style);
                }

                // parse was successful, now convert type, then validate data
                if (parsed.match) {
                    const paramException = exception.nest('Invalid type for ' + at + ' parameter "' + name + '"');
                    const value = serial.deserialize(paramException, schema, parsed.value);

                    if (!Exception.hasException(paramException)) {
                        const errors = this.enforcer.errors(schema, value);
                        if (errors) errors.forEach(error => paramException.push(error));
                    }

                    // store deserialized value
                    result[paramType][name] = value;

                } else {
                    exception.push('Expected ' + at + ' parameter "' + name + '" to be formatted in ' +
                        (explode ? 'exploded ' : '') + style + ' style');
                }

            // value not provided - check if required
            } else if (definition.required) {
                exception.push('Missing required ' + at + ' parameter "' + name + '"');
            }
        });
    });

    // look for any query parameters that are not allowed
    Object.keys(definedQueryParams)
        .forEach(name => {
            if (!definedQueryParams[name]) {
                exception.push('Unexpected query parameter "' + name + '" not permitted');
            }
        });

    // check for errors
    const hasErrors = Exception.hasException(exception);
    return {
        exception: hasErrors ? exception : null,
        value: hasErrors ? null : result
    }
};

/**
 * Generate a random value that matches the schema.
 * @param {object} schema
 * @returns {*}
 */
Version.prototype.random = function(schema) {
    return random.byType(schema);
};

/**
 * Serialize a response header value.
 * @param {object} schema
 * @param {*} value
 * @returns {*}
 */
Version.prototype.serializeResponseHeader = function(schema, value) {
    const type = schema && schema.schema && util.schemaType(schema.schema);
    switch (type) {
        case 'array':
            return value.join(',');

        case 'object':
            return Object.keys(value)
                .map(key => key + (schema.explode ? '=' : ',') + value[key])
                .join(',');

        default:
            return value;
    }
};

Version.defaults = {

    validate: {
        depth: Number.MAX_VALUE,    // validate to full depth

        boolean: true,

        // numbers
        integer: true,
        number: true,
        multipleOf: true,
        maximum: true,
        minimum: true,

        // strings
        binary: true,
        byte: true,
        date: true,
        dateExists: true,
        dateTime: true,
        maxLength: true,
        minLength: true,
        pattern: true,
        string: true,
        timeExists: true,

        // arrays
        array: true,
        items: true,
        maxItems: true,
        minItems: true,
        uniqueItems: true,

        // objects
        additionalProperties: true,
        allOf: true,
        anyOf: true,
        discriminator: true,
        maxProperties: true,
        minProperties: true,
        not: true,
        object: true,
        oneOf: true,
        properties: true,
        required: true,

        // general
        enum: true
    }

};

function defaultStyle(paramType) {
    switch (paramType) {
        case 'cookie':
        case 'query':
            return 'form';
        case 'header':
        case 'path':
            return 'simple';
    }
}