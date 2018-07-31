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
const serial        = require('./serialize');
const util          = require('../util');

/**
 * Get the discriminator value that is used to determine the discriminator schema.
 * @param {Schema} schema
 * @param value
 * @returns {string}
 */
exports.getDiscriminatorKey = function(schema, value) {
    const discriminator = schema.discriminator;
    if (discriminator && value && value.hasOwnProperty(discriminator.propertyName)) return value[discriminator.propertyName];
};

/**
 * Get the discriminator schema.
 * @param {Schema} schema
 * @param {object} value
 * @returns {object}
 */
exports.getDiscriminatorSchema = function(schema, value) {
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
exports.getResponseData = function(produces, responses, options) {
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
exports.getResponseExample = function(options) {
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
exports.parseRequestParameters = function(schema, exception, req) {
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

                if (!bodyException.hasException) {
                    const errors = this.enforcer.errors(schema, value);
                    if (errors) {
                        errors.forEach(error => bodyException(error));
                    } else {
                        result.body = value;
                    }
                }
            }

        } else if (mSchema.requestBody.required && req.body === undefined) {
            exception('Missing required request body');
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

                    if (!paramException.hasException) {
                        const errors = this.enforcer.errors(schema, value);
                        if (errors) errors.forEach(error => paramException(error));
                    }

                    // store deserialized value
                    result[paramType][name] = value;

                } else {
                    exception('Expected ' + at + ' parameter "' + name + '" to be formatted in ' +
                        (explode ? 'exploded ' : '') + style + ' style');
                }

            // value not provided - check if required
            } else if (definition.required) {
                exception('Missing required ' + at + ' parameter "' + name + '"');
            }
        });
    });

    // look for any query parameters that are not allowed
    Object.keys(definedQueryParams)
        .forEach(name => {
            if (!definedQueryParams[name]) {
                exception('Unexpected query parameter "' + name + '" not permitted');
            }
        });

    // check for errors
    const hasErrors = exception.hasException;
    return {
        exception: hasErrors ? exception : null,
        value: hasErrors ? null : result
    }
};

/**
 * Serialize a response header value.
 * @param {object} schema
 * @param {*} value
 * @returns {*}
 */
exports.serializeResponseHeader = function(schema, value) {
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

exports.serial = serial;

exports.value = 3;

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