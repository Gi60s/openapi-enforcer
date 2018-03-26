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
const params        = require('./param-style');
const Random        = require('../random');
const util          = require('../util');

module.exports = Version;

function Version(enforcer, definition) {
    this.enforcer = enforcer;
    this.definition = definition;


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

    this.random = function(schema) {
        return random.byType(schema);
    };
}

Version.prototype.getDiscriminatorKey = function(schema, value) {
    const discriminator = schema.discriminator;
    if (discriminator && value.hasOwnProperty(discriminator.propertyName)) return value[discriminator.propertyName];
};

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
 * Deserialize the request parameters.
 * @param {object} schema The path schema object.
 * @param {object} req
 * @param {object|string} req.body
 * @param {Object<string>} req.cookie
 * @param {Object<string>} req.header
 * @param {string} req.method
 * @param {object<string>} req.path
 * @param {string} req.query
 * @returns {{ error: Array<string>|null, value: null|{ body: string|object, cookie: object, header: object, path: object, query: object, responses: object }}}
 */
Version.prototype.parseRequestParameters = function(schema, req) {
    const errors = [];
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
    if (mSchema.requestBody && req.body !== undefined) {
        const contentType = req.header['content-type'] || '*/*';
        const content = mSchema.requestBody.content;
        const key = util.findMediaMatch(contentType, Object.keys(content))[0];
        if (key) {
            const schema = content[key].schema;
            const typed = this.enforcer.deserialize(schema, req.body);
            if (typed.errors) {
                errors.push('Invalid request body:\n\t' + typed.errors.join('\n\t'));
            } else {
                const validationErrors = this.enforcer.errors(schema, typed.value);
                if (validationErrors) {
                    errors.push('Invalid request body":\n\t' + validationErrors.join('\n\t'));
                } else {
                    result.body = typed.value;
                }
            }
        }
    }

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
            if (values.hasOwnProperty(name) || at === 'query') {
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
                        if (at !== 'query') throw Error('The deepObject style only works with query parameters. Error at ' + at + ' parameter "' + name + '"');
                        if (type !== 'object') throw Error('The deepObject style only works with objects but the parameter schema type is ' + type);
                        parsed = params.deepObject(name, req.query);
                        break;

                    case 'form':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'cookie' && at !== 'query') throw Error('The form style only works with cookie and query parameters. Error at ' + at + ' parameter "' + name + '"');
                        if (at === 'query') {
                            const results = queryParams(name, req.query);
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
                        parsed = params.form(type, explode, name, value);
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
                        if (at !== 'query' || (type !== 'object' && type !== 'array')) throw Error('The pipeDelimited style only works with query parameters for the schema type array or object. Error at ' + at + ' parameter "' + name + '"');
                        queryValue = queryParams(name, req.query);
                        if (!queryValue) return;
                        parsed = params.pipeDelimited(type, queryValue.pop());
                        break;

                    case 'simple':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'path' && at !== 'header') throw Error('The simple style only works with path and header parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.simple(type, explode, value);
                        break;

                    case 'spaceDelimited':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'query' || (type !== 'object' && type !== 'array')) throw Error('The spaceDelimited style only works with query parameters for the schema type array or object. Error at ' + at + ' parameter "' + name + '"');
                        queryValue = queryParams(name, req.query);
                        if (!queryValue) return;
                        parsed = params.spaceDelimited(type, queryValue.pop());
                        break;

                    default:
                        throw Error('Invalid parameter style: ' + style);
                }

                // parse was successful, now convert type, then validate data
                if (parsed.match) {
                    const typed = this.enforcer.deserialize(schema, parsed.value);
                    if (typed.errors) {
                        errors.push('Invalid type for ' + at + ' parameter "' + name + '":\n\t' + typed.errors.join('\n\t'));
                    } else {
                        const validationErrors = this.enforcer.errors(schema, typed.value);
                        if (validationErrors) {
                            errors.push('Invalid value for ' + at + ' parameter "' + name + '":\n\t' + validationErrors.join('\n\t'));
                        }
                    }

                    // store typed value
                    result[paramType][name] = typed.value;
                } else {
                    errors.push('Expected ' + at + ' parameter "' + name + '" to be formatted in ' +
                        (explode ? 'exploded ' : '') + style + ' style');
                }

            // value not provided - check if required
            } else if (definition.required) {
                errors.push('Missing required ' + at + ' parameter "' + name + '"');
            }
        });
    });

    // check for errors
    const hasErrors = errors.length;
    return {
        errors: hasErrors ? errors : null,
        value: hasErrors ? null : result
    }
};

/**
 * @returns {function}
 */
Version.prototype.random = function() {}; // implemented in constructor

Version.prototype.getResponseBodySchema = function(pathSchema, code, type) {
    if (!pathSchema.responses) return;

    const schema = pathSchema.responses[code] || pathSchema.responses.default;
    if (!schema) return;

    if (!type && schema.content) type = Object.keys(schema.content)[0];

    return schema.content && schema.content[type];
};

Version.prototype.getResponseExamples = function(responseSchema, accepts, name) {
    const content = responseSchema.content;
    if (!content) return;

    const matches = util.findMediaMatch(accepts || '*/*', Object.keys(content));
    const results = {};
    matches.forEach(contentType => {
        const schema = content[contentType];
        results.contentType = contentType;
        results.schema = schema.schema;
        results.examples = [];
        if (schema.example) {
            results.examples.push({ body: util.copy(schema.example) });
        } else if (schema.examples) {
            Object.keys(schema.examples).forEach(name => {
                results.examples.push({ name: name, body: schema.examples[name] });
            });
        }
    });

    return results;
};


Version.defaults = {

    populate: {
        autoFormat: false,          // setting this value to true may hide some errors as values are auto formatted to their correct type
        copy: false,                // mode can be either copy or mutate. Mutate is faster but copy preserves the original object
        defaults: true,
        ignoreMissingRequired: true,
        oneOf: true,
        replacement: 'handlebar',
        templateDefaults: true,
        templates: true,
        variables: true
    },

    request: {
        purge: true,                // any provided request data (in query or form data) that is not specified in the open api will be ignored
        strict: true                // the request can only supply data (in query or form data) in the spec or an error is thrown
    },

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

function queryParams(name, value) {
    const rx = RegExp('(?:^|&)' + name + '=([^&]*)', 'g');
    const results = [];
    let match;
    while (match = rx.exec(value)) results.push(match[1]);
    return results.length ? results : null;
}