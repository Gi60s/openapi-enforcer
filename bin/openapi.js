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
const populate      = require('./populate');
const util          = require('./util');
const validate      = require('./validate');

module.exports = OpenApiEnforcer;

const store = new WeakMap();
const rxPathParam = /{([^}]+)}/;
const rxVersion = /^2.0$|^\d+\.\d+\.\d+$/;

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
    } else if (typeof definition === 'string') {
        definition = { openapi: definition };
    }

    // validate the version number from the definition
    const v = definition.openapi || definition.swagger;
    if (!rxVersion.test(v)) throw Error('Unsupported Open API version specified: ' + v);

    // attempt to load the version specific settings and functions
    const match = /^(\d+)\./.exec(v);
    const major = match[1];
    const Version = util.tryRequire('./v' + major + '/index');
    if (!Version) throw Error('The Open API definition version is either invalid or unsupported: ' + v);
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
 * @param {object} options
 * @param {boolean} [options.throw=true] If true then throw errors if found, otherwise return errors array.
 * @returns {*|{ errors: string[], value:* }}
 */
OpenApiEnforcer.prototype.deserialize = function(schema, value, options) {
    const errors = [];
    const version = store.get(this).version;

    // normalize options
    if (!options) options = {};
    if (!options.hasOwnProperty('throw')) options.throw = true;

    // run version specific deserialization
    const result = version.serial.deserialize(errors, '', schema, value);

    // determine how to handle deserialization data
    const hasErrors = errors.length;
    if (hasErrors && options.throw) {
        throw Error('One or more errors occurred during deserialization: \n\t' + errors.join('\n\t'))
    } else if (options.throw) {
        return result;
    } else {
        return {
            errors: hasErrors ? errors.map(v => v.trim()) : null,
            value: hasErrors ? null : result
        };
    }
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
    const options = Object.assign({ prefix: '' }, arguments[2]);
    const v = {
        definition: data.definition,
        error: (prefix, message) => v.errors.push((prefix ? prefix + ': ' : prefix) + message),
        errors: [],
        options: data.defaults.validate,
        version: version
    };
    validate(v, options.prefix, 0, schema, value);
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

    // if the parser was not found then they have a bad path
    if (!parsers) return;

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
 * @param {object} schema
 * @param {object} config
 * @param {object} [config.params={}]
 * @param {object} [config.options] The populate options
 * @param {boolean} [config.throw=true] If true then throw errors if found, otherwise return errors array.
 * @param {*} [config.value]
 * @returns {{ errors: string[]|null, value: *}}
 */
OpenApiEnforcer.prototype.populate = function (schema, config) {
    if (!config) config = {};
    if (!config.hasOwnProperty('throw')) config.throw = true;

    const options = config.options
        ? Object.assign({}, OpenApiEnforcer.defaults.populate, config.options)
        : OpenApiEnforcer.defaults.populate;

    // initialize variables
    const initialValueProvided = config.hasOwnProperty('value');
    const version = store.get(this).version;
    const v = {
        errors: [],
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
    populate.populate(v, '<root>', schema, root, 'root');

    // determine how to handle population data
    const hasErrors = v.errors.length;
    if (hasErrors && options.throw) {
        throw Error('One or more errors occurred during population: \n\t' + v.errors.join('\n\t'))
    } else if (options.throw) {
        return root.root;
    } else {
        return {
            errors: hasErrors ? v.errors : null,
            value: hasErrors ? null : root.root
        };
    }
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
        header: req.headers ? util.lowerCaseProperties(req.headers) : {},
        method: method,
        path: path.params,
        query: req.query || ''
    });

    const responses = path.schema[method].responses;
    const produces = path.schema[method].produces;
    const value = result.value;
    const returnValue = {
        errors: result.errors,
        path: path.path,
        request: value
            ? {
                cookies: value.cookie,
                headers: value.header,
                path: value.path,
                query: value.query
            }
            : null,
        response: (config) => {
            const data = responseData(this, produces, responses, config);
            return {
                data: data,
                errors: config => responseErrors(this, responses, data, config),
                example: config => responseExample(this, responses, data, config),
                populate: config => responsePopulate(this, responses, data, config),
                serialize: config => responseSerialize(this, responses, data, config)
            }
        },
        schema: path.schema,
        statusCode: result.errors ? 400 : 200
    };
    if (value && value.hasOwnProperty('body')) returnValue.request.body = value.body;
    return returnValue;
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
    const produces = path.schema[method].produces;
    const data = responseData(this, produces, responses, options);
    return {
        data: data,
        errors: config => responseErrors(this, responses, data, config),
        example: config => responseExample(this, responses, data, config),
        populate: config => responsePopulate(this, responses, data, config),
        serialize: config => responseSerialize(this, responses, data, config)
    };
};


/**
 * Serialize a value for sending as a response.
 * @param {object} schema
 * @param {*} value
 * @param {object} options
 * @param {boolean} [options.throw=true] If true then throw errors if found, otherwise return errors array.
 * @returns {*}
 */
OpenApiEnforcer.prototype.serialize = function(schema, value, options) {
    const errors = [];
    const version = store.get(this).version;

    // normalize options
    if (!options) options = {};
    if (!options.hasOwnProperty('throw')) options.throw = true;

    // run version specific deserialization
    const result = version.serial.serialize(errors, '', schema, value);

    // determine how to handle serialization data
    const hasErrors = errors.length;
    if (hasErrors && options.throw) {
        throw Error('One or more errors occurred during serialization: \n\t' + errors.join('\n\t'))
    } else if (options.throw) {
        return result;
    } else {
        return {
            errors: hasErrors ? errors.map(v => v.trim()) : null,
            value: hasErrors ? null : result
        };
    }
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

OpenApiEnforcer.prototype.version = function() {
    const definition = store.get(this).definition;
    return definition.openapi || definition.swagger;
};


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



function responseData(context, produces, responses, config) {
    const version = store.get(context).version;
    if (!config) config = {};
    if (!config.hasOwnProperty('contentType') && config.headers && config.headers['content-type']) config.contentType = config.headers['content-type'];
    return version.getResponseData(produces, responses, config);
}

function responseErrors(context, responses, data, config) {
    const errors = [];

    if (data.error) {
        errors.push(data.error);
        return errors;
    }

    // check body for errors
    if (config.hasOwnProperty('body')) {
        const err = context.errors(data.schema, config.body, { prefix: 'Error in body' });
        if (err) util.arrayPushMany(errors, err);
    }

    // check headers for errors
    if (config.headers && responses && responses[data.code]) {
        const schemas = responses[data.code].headers;
        if (schemas) {
            const headers = config.headers;
            Object.keys(schemas)
                .forEach(name => {
                    const schema = schemas[name];
                    if (headers.hasOwnProperty(name)) {
                        const err = context.errors(schema.schema, headers[name], { prefix: 'Error in header "' + name + '"' });
                        if (err) util.arrayPushMany(errors, err);

                    } else if (schema.required) {
                        errors.push('Error in header "' + name + '": Missing required value');
                    }
                });
        }
    }

    return errors.length > 0 ? errors : null;
}

function responseExample(context, responses, data, options) {
    if (data.error) throw Error(data.error);
    if (!responses) throw Error('Cannot build example response without schema');
    if (!options) options = {};
    let example;
    if (data && data.code && !options.ignoreDocumentExample) {
        example = store.get(context).version.getResponseExample({
            accept: data.accept,
            contentType: data.contentType,
            name: options.name,
            responseSchema: responses[data.code]
        });
    }
    if (example === undefined && data.schema) example = context.random(data.schema);
    return example;
}

function responsePopulate(context, responses, data, options) {
    if (data.error) throw Error(data.error);

    const config = Object.assign({}, options);
    if (!config.headers) config.headers = {};
    if (!config.options) config.options = {};
    if (!config.params) config.params = {};
    config.headers = util.lowerCaseProperties(config.headers);

    if (!data) throw Error('Cannot populate value without schema');
    let result = {};
    
    // populate body
    if (data.schema) {
        const options = { 
            schema: data.schema, 
            params: config.params,
            options: config.options
        };
        if (config.hasOwnProperty('body')) options.value = config.body;
        result.body = context.populate(options);
    }

    // populate headers
    const headersSchemas = data.code && responses[data.code] && responses[data.code].headers;
    const headers = config.headers;
    result.headers = headers;
    if (headersSchemas) {

        // add content type to headers if not there already
        if (!headers.hasOwnProperty('content-type') && data.contentType) {
            headers['content-type'] = data.contentType;
        }

        // populate all headers with schemas
        Object.keys(headersSchemas).forEach(header => {
            const schema = headersSchemas[header].schema;
            if (schema) {
                const options = {
                    schema: schema,
                    params: config.params,
                    options: config.options
                };
                if (headers.hasOwnProperty(header)) options.value = headers[header];
                const value = context.populate(options);
                if (value !== undefined) headers[header] = value;
            }
        });
    }

    return result;
}

function responseSerialize(context, responses, data, config) {
    if (data.error) throw Error(data.error);

    const result = { headers: {} };
    const version = store.get(context).version;

    if (!config.skipValidation) {
        const errors = responseErrors(context, responses, data, config);
        if (errors) throw Error('Unable to serialize response due to one or more errors:\n  ' + errors.join('\n  '));
    }

    if (config.hasOwnProperty('body')) {
        result.body = context.serialize(data.schema, config.body);
    }

    if (config.headers && responses && responses[data.code]) {
        const headers = config.headers;
        const schemas = responses[data.code].headers;
        Object.keys(config.headers)
            .forEach(name => {
                const schema = schemas && schemas[name];
                if (schema) {
                    let value = schema && schema.schema
                        ? serialize('', schema.schema, headers[name])
                        : String(headers[name]);
                    value = version.serializeResponseHeader(schema, value);
                    result.headers[name] = value;
                }
            });
    }

    return result;
}

