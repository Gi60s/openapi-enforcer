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
const format        = require('./format');
const parse         = require('./parse');
const populate      = require('./populate');
const util          = require('./util');
const validate      = require('./validate');

module.exports = OpenApiEnforcer;

const store = new WeakMap();
const rxPathParam = /{([^}]+)}/;

/**
 * Produce an open api enforcer instance.
 * @param {object, string} definition The open api definition object or a string representing the version to use.
 * @constructor
 */
function OpenApiEnforcer(definition) {

    // make sure that this is called as a new instance
    if (!(this instanceof OpenApiEnforcer)) return new OpenApiEnforcer(definition);

    // if the definition was passed in as a version number then rebuild the definition object
    if (definition === '2.0') {
        definition = { swagger: '2.0' };
    } else if (/^3\.\d+\.\d+$/.test(definition)) {
        definition = { openapi: definition };
    }

    // get the version number from the definition
    const v = definition.openapi || definition.swagger;
    const match = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(v);
    if (!match) throw Error('Unsupported Open API version specified: ' + v);

    // attempt to load the version specific settings and functions
    const major = match[1];
    const Version = util.tryRequire('./v' + major + '/index');
    if (!Version) throw Error('The Open API definition version is either invalid or not supported: ' + v);
    const version = new Version(this, definition);

    // normalize defaults
    const defaults = Version.defaults;

    // build path parser functions
    const pathParsers = {};
    if (!definition.paths || typeof definition.paths !== 'object') definition.paths = {};
    Object.keys(definition.paths)
        .forEach(path => {
            const parser = {
                definition: definition.paths[path],
                path: path
            };
            const pathLength = path.split('/').length - 1;
            let match;

            // figure out path parameter names
            const parameterNames = [];
            const rxParamNames = new RegExp(rxPathParam, 'g');
            while (match = rxParamNames.exec(path)) {
                parameterNames.push(match[1]);
            }

            // build search regular expression
            const rxFind = /{([^}]+)}/g;
            let rxStr = '';
            let offset = 0;
            while (match = rxFind.exec(path)) {
                rxStr += path.substring(offset, match.index) + '([\\s\\S]+?)';
                offset = match.index + match[0].length;
            }
            rxStr += path.substr(offset);
            const rx = new RegExp('^' + rxStr + '$');

            // add the parse function
            parser.parse = path => {

                // check if this path is a match
                const match = rx.exec(path);
                if (!match) return undefined;

                // get path parameter strings
                const pathParams = {};
                parameterNames.forEach((name, index) => pathParams[name] = match[index + 1]);
                return pathParams;
            };

            if (!pathParsers[pathLength]) pathParsers[pathLength] = [];
            pathParsers[pathLength].push(parser);
        });

    // store protected properties
    store.set(this, {
        defaults: defaults,
        definition: definition,
        pathParsers: pathParsers,
        version: version
    });
}

/**
 * Deserialize a value. Useful for taking request input and parsing.
 * @param {object} schema
 * @param {*} value
 * @returns {{ errors:string[], value:* }}
 */
OpenApiEnforcer.prototype.deserialize = function(schema, value) {
    const errors = [];
    const result = deserialize(errors, '', schema, value);
    const hasErrors = errors.length;
    return {
        errors: hasErrors ? errors.map(v => v.trim()) : null,
        value: hasErrors ? null : result
    };
};

/**
 * Check a value against a schema for errors.
 * @param {object} schema
 * @param {*} value
 * @returns {string[]|undefined}
 */
OpenApiEnforcer.prototype.errors = function(schema, value) {
    const data = store.get(this);
    const version = data.version;
    const v = {
        definition: data.definition,
        error: (prefix, message) => v.errors.push((prefix ? prefix + ': ' : '') + message),
        errors: [],
        options: data.defaults.validate,
        version: version
    };
    validate(v, '', 0, schema, value);
    return v.errors.length > 0 ? v.errors : null;
};

/**
 * Get details about the matching path.
 * @param {string} path
 * @returns {{path: string, params: Object.<string, *>, schema: object}|undefined}
 */
OpenApiEnforcer.prototype.path = function(path) {

    // normalize the path
    path = util.edgeSlashes(path.split('?')[0], true, false);

    // get all parsers that fit the path length
    const pathLength = path.split('/').length - 1;
    const parsers = store.get(this).pathParsers[pathLength];

    // find the right parser
    const length = parsers.length;
    for (let i = 0; i < length; i++) {
        const parser = parsers[i];
        const params = parser.parse(path);
        if (params) {
            return {
                params: params,
                path: parser.path,
                schema: util.copy(parser.definition)
            };
        }
    }
};

/**
 * Populate an object or an array using default, x-template, x-variable, and a parameter map.
 * @param {object} config
 * @param {object} config.schema
 * @param {object} [config.params={}]
 * @param {object} [config.options]
 * @param {*} [config.value]
 * @returns {*}
 */
OpenApiEnforcer.prototype.populate = function (config) {
    const options = config.options
        ? Object.assign({}, OpenApiEnforcer.defaults.populate, config.options)
        : OpenApiEnforcer.defaults.populate;

    // initialize variables
    const initialValueProvided = config.hasOwnProperty('value');
    const version = store.get(this).version;
    const v = {
        injector: populate.injector[options.replacement],
        map: config.params || {},
        options: options,
        schemas: version.schemas,
        version: version
    };

    // produce start value
    const value = v.options.copy && initialValueProvided
        ? util.copy(config.value)
        : config.value;

    // begin population
    const root = { root: value };
    populate.populate(v, '<root>', config.schema, root, 'root');

    return root.root;
};

/**
 * Generate a random value that meets the schema requirements.
 * @param {object} schema
 * @returns {*}
 */
OpenApiEnforcer.prototype.random = function(schema) {
    return store.get(this).version.random(schema);
};

/**
 * Parse and validate input parameters for a request.
 * @param {string|object} req
 * @param {string|object} [req.body]
 * @param {object} [req.cookies]
 * @param {object} [req.headers]
 * @param {string} [req.method='get']
 * @param {string} [req.path]
 * @returns {object}
 */
OpenApiEnforcer.prototype.request = function(req) {

    // normalize input parameter
    if (typeof req === 'string') req = { path: req };
    if (typeof req !== 'object') throw Error('Invalid request. Must be a string or an object. Received: ' + req);
    req = Object.assign({}, req);
    if (req.body !== undefined && typeof req.body !== 'object' && typeof req.body !== 'string') throw Error('Invalid request body. Must be a string or an object. Received: ' + req.body);
    if (req.cookies && typeof req.cookies !== 'object') throw Error('Invalid request cookies. Must be an object. Received: ' + req.cookies);
    if (req.headers && typeof req.headers !== 'object') throw Error('Invalid request headers. Must be an object. Received: ' + req.headers);
    if (typeof req.path !== 'string') throw Error('Invalid request path. Must be a string. Received: ' + req.path);
    if (!req.method) req.method = 'get';
    if (typeof req.method !== 'string') throw Error('Invalid request method. Must be a string. Received: ' + req.method);

    // build request path and query
    const pathAndQuery = req.path.split('?');
    req.path = pathAndQuery[0];
    req.query = pathAndQuery[1];
    req.path = util.edgeSlashes(req.path, true, false);

    // get the defined open api path or call next middleware
    const path = this.path(req.path);
    if (!path) return { statusCode: 404, errors: ['Not found'] };

    // validate that the path supports the method
    const method = req.method.toLowerCase();
    if (!path.schema[method]) return { statusCode: 405, errors: ['Method not allowed'] };

    // parse and validate request input
    const result = store.get(this).version.parseRequestParameters(path.schema, {
        body: req.body,
        cookie: req.cookies || {},
        header: util.lowerCaseProperties(req.headers) || {},
        method: method,
        path: path.params,
        query: req.query || ''
    });

    const responses = path.schema[method].responses;
    const value = result.value;
    return {
        errors: result.errors,
        path: path.path,
        request: value
            ? {
                body: value.body,
                cookies: value.cookie,
                headers: value.header,
                path: value.path,
                query: value.query
            }
            : null,
        response: (config) => {
            const data = responseData(this, responses, config);
            return {
                data: data,
                example: config => responseExample(this, responses, data, config),
                populate: config => responsePopulate(this, responses, data, config),
                serialize: config => responseValidateSerialize(this, responses, data, config)
            }
        },
        schema: path.schema
    };
};

/**
 * Validate and serialize a response.
 * @param {{ code: string, contentType: string, path: string, method: string }} options The request object.
 * @returns {{data: function, example: function, populate: function, serialize: function}}
 */
OpenApiEnforcer.prototype.response = function(options) {
    const path = this.path(options.path);
    if (!path) throw Error('Invalid request path. The path is not defined in the specification: ' + req.path);

    options = Object.assign({}, { method: 'get' }, options);
    const method = options.method.toLowerCase();
    if (!path.schema[method]) throw Error('Invalid method for request path. The method is not defined in the specification: ' + method.toUpperCase() + ' ' + req.path);

    const responses = path.schema[method].responses;
    const data = responseData(this, responses, options);
    return {
        data: data,
        example: config => responseExample(this, responses, data, config),
        populate: config => responsePopulate(this, responses, data, config),
        serialize: config => responseValidateSerialize(this, responses, data, config)
    };
};

/**
 * Get a copy of the schema at the specified path.
 * @param {string} [path=''] The path in the schema to get a sub-schema from. Supports variable substitution for path parameters.
 * @param {object} [schema] The schema to traverse. Defaults to the entire OpenApiEnforcer document.
 * @returns {object|undefined} Will return undefined if the specified path is invalid.
 */
OpenApiEnforcer.prototype.schema = function(path, schema) {
    let result = schema || store.get(this).definition;

    // normalize path
    if (!path) path = '';
    path = path.replace(/^\/(?!\/)/, '').replace(/(?!\/)\/$/, '');

    // determine path keys
    const keys = [];
    let index = 0;
    let join = false;
    path.split('/').forEach(key => {
        if (!key && keys[index - 1]) {
            join = true;
        } else if (join) {
            keys[index - 1] += '/' + key;
        } else {
            index = keys.push(key);
        }
    });

    // loop through path parts to find object of interest
    let key;
    while (key = keys.shift()) {
        if (result && typeof result === 'object') {
            result = result[key];
        } else {
            return;
        }
    }

    return util.copy(result);
};

/**
 * Serialize a value for sending as a response.
 * @param {object} schema
 * @param {*} value
 * @returns {*}
 */
OpenApiEnforcer.prototype.serialize = function(schema, value) {
    return serialize('', schema, value);
};

/**
 * Check a value against a schema for errors and throw any errors encountered.
 * @param {object} schema
 * @param {*} value
 * @throws {Error}
 */
OpenApiEnforcer.prototype.validate = function(schema, value) {
    const errors = this.errors(schema, value);
    if (errors) {
        if (errors.length === 1) throw Error(errors[0]);
        throw Error('One or more errors found during schema validation: \n  ' + errors.join('\n  '));
    }
};

Object.defineProperties(OpenApiEnforcer.prototype, {
    version: {
        get: () => {
            const definition = store.get(this).definition;
            return definition.openapi || definition.swagger;
        }
    }
});


OpenApiEnforcer.defaults = {
    populate: {
        copy: false,
        defaults: true,
        ignoreMissingRequired: true,
        oneOf: true,
        replacement: 'handlebar',
        serialize: false,
        templateDefaults: true,
        templates: true,
        variables: true
    }
};

// static properties with methods
OpenApiEnforcer.format = format;
OpenApiEnforcer.parse = parse;


// convert from string values to correct data types
function deserialize(errors, prefix, schema, value) {
    const type = util.schemaType(schema);
    let result;
    switch (type) {
        case 'array':
            if (Array.isArray(value)) return schema.items
                ? value.map((v,i) => deserialize(errors, prefix + '/' + i, schema.items, v))
                : value;
            errors.push(prefix + ' Expected an array. Received: ' + value);
            break;

        case 'boolean':
        case 'integer':
        case 'number':
            result = parse[type](value);
            if (result.error) errors.push(prefix + ' ' + result.error);
            return result.value;

        case 'string':
            switch (schema.format) {
                case 'binary':
                case 'byte':
                case 'date':
                case 'date-time':
                    result = parse[schema.format](value);
                    break;
                default:
                    result = { value: value };
            }
            if (result.error) errors.push(prefix + ' ' + result.error);
            return result.value;

        case 'object':
            if (value && typeof value === 'object') {
                const result = {};
                const additionalProperties = schema.additionalProperties;
                const properties = schema.properties || {};
                Object.keys(value).forEach(key => {
                    if (properties.hasOwnProperty(key)) {
                        result[key] = deserialize(errors, prefix + '/' + key, properties[key], value[key]);
                    } else if (additionalProperties) {
                        result[key] = deserialize(errors, prefix + '/' + key, additionalProperties, value[key]);
                    }
                });
                return result;
            }
            errors.push(prefix + ' Expected an object. Received: ' + value);
            return;

        default:
            errors.push(prefix + ' Unknown schema type');
            return;
    }
}

function responseData(context, responses, config) {
    const version = store.get(context).version;
    if (!config) config = {};
    if (!config.hasOwnProperty('contentType') && config.headers && config.headers['content-type']) config.contentType = config.headers['content-type'];
    return version.getResponseData(responses, config);
}

function responseExample(context, responses, options) {
    if (!responses) throw Error('Cannot build example response without schema');

    options = Object.assign({}, options);
    if (!options.hasOwnProperty('code')) options.code = responses.default ? 'default' : Object.keys(responses)[0];

    const version = store.get(context).version;
    const data = version.getResponseExamples(responses[options.code], options.contentType);
    let example;

    if (!data) return;
    if (!name) {
        example = data.examples[0];
    } else {
        example = data.examples.filter(example => example.name === name)[0] || data.examples[0];
    }
    if (example === undefined && data.schema) example = context.random(data.schema);
    return {
        contentType: data.contentType,
        example: example,
        schema: data.schema
    };
}

function responsePopulate(context, pathSchema, config) {
    config = Object.assign({}, config);
    if (!config.headers) config.headers = {};
    if (!config.options) config.options = {};
    if (!config.params) config.params = {};
    config.headers = util.lowerCaseProperties(config.headers);

    const data = responseData(context, pathSchema, config);
    if (!data) throw Error('Cannot populate value without schema');
    const result = {};
    
    // populate body
    if (data.schema) {
        const options = { 
            schema: data.schema, 
            params: config.params,
            options: config.options
        };
        if (config.hasOwnProperty('body')) options.value = config.body;
        result.body = context.populate(options);
        if (config.serialize) result.body = context.serialize(data.schema, result.body);
    }

    // populate headers
    const headersSchemas = data.code && responses[data.code] && responses[data.code].headers;
    const headers = config.headers;
    result.headers = headers;
    if (headersSchemas) {
        if (!headers.hasOwnProperty('content-type') && data.contentType) {
            headers['content-type'] = data.contentType;
        }
        Object.keys(headersSchemas).forEach(header => {
            const schema = headersSchemas[header];
            const options = { 
                schema: schema, 
                params: config.params,
                options: config.options
            };
            if (headers.hasOwnProperty(header)) options.value = headers[header];
            headers[header] = context.populate(options);
            if (config.serialize) headers[header] = context.serialize(schema, headers[header]);
        });
    }

    return result;
}

function responseValidateSerialize(context, pathSchema, code, body, headers) {
    const result = { header: {} };
    const errors = [];

    // validate and serialize the body if a schema exists
    const bodySchema = store.get(context).version.getResponseBodySchema(pathSchema, code, headers && headers['content-type']);
    if (bodySchema) {
        const err = context.errors(bodySchema, body);
        if (err) {
            errors.push('One or more errors in response body: \n' + err.join('\n\t'));
        } else {
            result.body = context.serialize(bodySchema, body);
        }
    } else {
        result.body = body;
    }

    // validate and serialize each header if a schema exists
    if (headers && pathSchema.responses) {
        const schema = pathSchema.responses[code] || pathSchema.responses.default;
        if (schema.headers) {
            const schemas = schema.headers;
            Object.keys(headers)
                .forEach(key => {
                    key = key.toLowerCase();
                    if (schemas[key]) {
                        const err = context.errors(schemas[key].schema, headers[key]);
                        if (err) {
                            errors.push('One or more errors in response header "' + key + '": \n' + err.join('\n\t'));
                        } else {
                            result.header[key] = context.serialize(schemas[key].schema, headers[key]);
                        }
                    } else {
                        result.header[key] = headers[key];
                    }
                });
        }
    }

    const hasErrors = errors.length;
    return {
        errors: hasErrors ? errors : undefined,
        value: result
    };
}

function serialize(prefix, schema, value) {
    const type = util.schemaType(schema);
    switch (type) {
        case 'array':
            if (Array.isArray(value)) return value.map((v, i) => serialize(prefix + '/' + i, schema.items || {}, v));
            break;

        case 'boolean':
        case 'integer':
        case 'number':
            return format[type](prefix, value);

        case 'object':
            if (value && typeof value === 'object') {
                const result = {};
                const additionalProperties = schema.additionalProperties;
                const properties = schema.properties || {};
                Object.keys(value).forEach(key => {
                    if (properties.hasOwnProperty(key)) {
                        result[key] = serialize(prefix + '/' + key, properties[key], value[key]);
                    } else if (additionalProperties) {
                        result[key] = serialize(prefix + '/' + key, additionalProperties, value[key]);
                    }
                });
                return result;
            }
            return value;

        case 'string':
        default:
            switch (schema.format) {
                case 'binary':
                case 'byte':
                case 'date':
                case 'date-time':
                    return format[schema.format](prefix, value);
            }
            return format.string(prefix, value);
    }
}