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
const random        = require('../random');
const serial        = require('./serialize');
const util          = require('../util');

module.exports = Version;

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
    if (discriminator && value.hasOwnProperty(discriminator)) return value[discriminator];
};

/**
 * Get the discriminator schema.
 * @param {object} schema
 * @param {object} value
 * @returns {object}
 */
Version.prototype.getDiscriminatorSchema = function(schema, value) {
    const key = this.getDiscriminatorKey(schema, value);
    if (key) return this.definition.definitions[key];
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

    if (schema.schema) result.schema = schema.schema;

    const match = produces ? util.findMediaMatch(result.accept, produces)[0] : null;
    if (match) result.contentType = match;

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
    const examples = options.responseSchema.examples;
    const schema = options.responseSchema.schema;
    let contentType = options.contentType;

    // produces did not match accept type, maybe one of the examples does
    if (examples && !contentType) {
        contentType = util.findMediaMatch(options.accept, Object.keys(examples))[0];
        options.contentType = contentType;
    }

    if (examples && examples[contentType]) {
        return util.copy(examples[contentType]);

    } else if (schema && schema.example) {
        return util.copy(schema.example);
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
 * @returns {{ exception: OpenAPIException|null, value: null|{ body: string|object, cookie: object, header: object, path: object, query: object }}}
 */
Version.prototype.parseRequestParameters = function(schema, exception, req) {
    const mSchema  = schema[req.method];
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
        formData: {},
        header: {},
        path: {},
        query: {}
    };
    [schema, mSchema].forEach(schema => {
        if (schema.parameters) {
            schema.parameters.forEach(param => {
                if (param.in === 'body') {
                    paramMap.body = param;
                } else {
                    const store = paramMap[param.in];
                    if (store) store[param.name] = param;
                }
            });
        }
    });

    const deserializeValidate = (schema, value, at, name) => {
        const deserializeException = exception.nest('Invalid value for ' + at + ' parameter "' + name + '"');
        const result = serial.deserialize(deserializeException, schema, value);
        if (!Exception.hasException(deserializeException)) {
            const errors = this.enforcer.errors(schema, result);
            if (errors) errors.forEach(error => deserializeException.push(error))
        }
        return result;
    };

    // body already parsed, need to deserialize and check for errors
    if (paramMap.body) {
        if (paramMap.body.required && req.body === undefined) {
            exception.push('Missing required body parameter "' + paramMap.body.name + '"');

        } else if (paramMap.body.schema && req.body !== undefined) {
            const schema = paramMap.body.schema;
            const paramException = exception.nest('Invalid request body');
            const value = serial.deserialize(paramException, schema, req.body);
            if (!Exception.hasException(paramException)) {
                const errors = this.enforcer.errors(schema, value);
                if (errors) {
                    errors.forEach(error => paramException.push(error));
                } else {
                    result.body = value;
                }
            }
        } else if (req.body !== undefined) {
            result.body = req.body;
        }
    }

    // path and header parameters
    ['header', 'path'].forEach(paramType => {
        const schemas = paramMap[paramType];
        const values = req[paramType];

        Object.keys(schemas).forEach(name => {
            const definition = schemas[name];
            const at = definition.in;

            if (values.hasOwnProperty(name)) {
                let value = values[name];

                if (util.schemaType(definition) === 'array') {
                    if (definition.collectionFormat === 'multi') {
                        throw Error('The collection format "multi" only works with query and formData parameters. Error at ' + at + ' parameter "' + name + '"');
                    } else {
                        value = collectionFormatSplit(definition.collectionFormat, value);
                    }
                    result[at][name] = value.map(v => deserializeValidate(definition.items, v, at, name));

                } else {
                    result[at][name] = deserializeValidate(definition, value, at, name);
                }

            } else if (definition.default) {
                result[at][name] = deserializeValidate(definition, definition.default, at, name);

            } else if (definition.required) {
                exception.push('Missing required ' + at + ' parameter "' + name + '"');
            }
        });
    });

    // TODO: add support for multipart/form-data

    // query parameters
    Object.keys(paramMap.query).forEach(name => {
        const definition = paramMap.query[name];
        const values = util.queryParamsByName(name, req.query);
        const store = result.query;

        if (values) {
            if (util.schemaType(definition) === 'array') {
                const value = definition.collectionFormat === 'multi'
                    ? values
                    : collectionFormatSplit(definition.collectionFormat, values[values.length - 1]);
                store[name] = value.map(v => deserializeValidate(definition.items, v, 'query', name));
            } else {
                store[name] = deserializeValidate(definition, values[values.length - 1], 'query', name);
            }

        } else if (definition.default) {
            store[name] = deserializeValidate(definition, definition.default, 'query', name);

        } else if (definition.required) {
            exception.push('Missing required query parameter "' + name + '"');
        }
    });

    // look for any query parameters that are not allowed
    util.queryParamNames(req.query).forEach(name => {
        if (!paramMap.query.hasOwnProperty(name)) {
            exception.push('Unexpected query parameter "' + name + '" not permitted');
        }
    });

    const hasErrors = Exception.hasException(exception);
    return {
        exception: hasErrors ? exception : null,
        value: hasErrors ? null : result
    };
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
            switch (schema.schema.collectionFormat) {
                case 'ssv': return value.join(' ');
                case 'tsv': return value.join('\t');
                case 'pipes': return value.join('|');
                case 'csv':
                default:
                    return value.join(',');
            }

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
        discriminator: true,
        maxProperties: true,
        minProperties: true,
        object: true,
        properties: true,
        required: true,

        // general
        enum: true
    }

};

function collectionFormatSplit(collectionFormat, value) {
    switch (collectionFormat) {
        case undefined:
        case 'csv': return value.split(',');
        case 'ssv': return value.split(' ');
        case 'tsv': return value.split('\t');
        case 'pipes': return value.split('|');
        default:
            throw Error('Invalid collection format');
    }
}