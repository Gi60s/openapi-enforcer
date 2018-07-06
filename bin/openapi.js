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
const Exception     = require('./exception');
const populate      = require('./populate');
const util          = require('./util');
const random        = require('./random');
const traverse      = require('./traverse');
const validate      = require('./validate');

module.exports = OpenApiEnforcer;

const store = new WeakMap();
const rxPathParam = /{([^}]+)}/;
const rxVersion = /^2.0$|^\d+\.\d+\.\d+$/;

const staticDefaults = {
    deserialize: {
        throw: true
    },
    errors: {
        prefix: ''
    },
    populate: {
        copy: false,
        defaults: true,
        ignoreMissingRequired: true,
        replacement: 'handlebar',
        templateDefaults: true,
        templates: true,
        throw: true,
        variables: true
    },
    random: {
        skipInvalid: false,
        throw: true
    },
    request: {
        throw: true
    },
    serialize: {
        throw: true
    }
};

/**
 * Produce an open api enforcer instance.
 * @param {object, string} definition The open api definition object or a string representing the version to use.
 * @param {object} [options] The default options.
 * @constructor
 */
function OpenApiEnforcer(definition, options) {

    // make sure that this is called as a new instance
    if (!(this instanceof OpenApiEnforcer)) return new OpenApiEnforcer(definition, options);

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
    version.defaults = Version.defaults;

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

    // normalize defaults
    const defaults = {};
    Object.keys(staticDefaults)
        .forEach(key => {
            defaults[key] = Object.assign({}, staticDefaults[key],
                OpenApiEnforcer.defaults && OpenApiEnforcer.defaults[key],
                options && options[key]);
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
 * @returns {*|{ exception: OpenAPIException, value:* }}
 */
OpenApiEnforcer.prototype.deserialize = function(schema, value, options) {
    const exception = new Exception('One or more errors occurred during deserialization');
    const data = store.get(this);
    const version = data.version;

    // normalize options
    options = Object.assign({}, data.defaults.deserialize, options);

    // run version specific deserialization
    const result = version.serial.deserialize(exception, schema, value);

    // determine how to handle deserialization data
    return errorHandler(options.throw, exception, result);
};

/**
 * Check a value against a schema for errors.
 * @param {object} schema
 * @param {*} value
 * @param {object} [options]
 * @param {string} [options.prefix='']
 * @returns {string[]|undefined}
 */
OpenApiEnforcer.prototype.errors = function(schema, value, options) {
    const data = store.get(this);
    const version = data.version;
    const v = {
        definition: data.definition,
        error: (prefix, message) => v.errors.push((prefix ? prefix + ': ' : prefix) + message),
        errors: [],
        options: version.defaults.validate,
        version: version
    };

    options = Object.assign({}, data.defaults.errors, options);
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
 * @param {object} [params={}]
 * @param {*} [value=undefined]
 * @param {object} options
 * @param {boolean} [options.copy]
 * @param {boolean} [options.ignoreMissingRequired]
 * @param {boolean} [options.oneOf]
 * @param {string} [options.replacement]
 * @param {boolean} [options.serialize]
 * @param {boolean} [options.templateDefaults]
 * @param {boolean} [options.templates]
 * @param {boolean} [options.throw=true] If true then throw errors if found, otherwise return errors array.
 * @param {boolean} [options.variables]
 * @returns {{ exception: OpenAPIException|null, value: *}|*}
 */
OpenApiEnforcer.prototype.populate = function (schema, params, value, options) {
    const data = store.get(this);
    const version = data.version;

    const exception = new Exception('One or more errors occurred during population');

    // normalize options
    options = Object.assign({}, data.defaults.populate, options, version.defaults.populate);

    // initialize variables
    const v = {
        context: this,
        injector: populate.injector[options.replacement],
        map: params || {},
        options: options,
        schemas: version.schemas,
        version: version
    };

    // produce start value
    if (v.options.copy) value = util.copy(value);

    // begin population
    const root = { root: value };
    populate.populate(v, exception, schema, root, 'root');

    // determine how to handle deserialization data
    return errorHandler(options.throw, exception, root.root);
};

/**
 * Generate a random value that meets the schema requirements.
 * @param {object} schema
 * @param {object} [options]
 * @param {boolean} [options.skipInvalid=false]
 * @returns {*}
 */
OpenApiEnforcer.prototype.random = function(schema, options) {
    // TODO: implement options
    options = Object.assign({}, data.defaults.populate, staticDefaults.populate, options);

    const version = store.get(this).version;
    const result = traverse({
        schema: schema,
        version: version,
        handler: data => {
            const schema = data.schema;
            let index;
            let schemas;

            switch (data.modifier) {
                case 'anyOf':
                case 'oneOf':
                    schemas = data.modifier === 'anyOf' ? schema.anyOf : schema.oneOf;
                    index = Math.floor(Math.random() * schemas.length);
                    data.schema = schemas[index];
                    data.again();
                    break;

                case 'allOf':
                    data.message('Random value generator does not work for "allOf" directive');
                    break;

                case 'not':
                    data.message('Random value generator does not work for "not" directive');
                    break;

                default:
                    data.value = random.byType(schema);
            }
        }
    });
    return result.value;
};

/**
 * Parse and validate input parameters for a request.
 * @param {string|object} req
 * @param {string|object} [req.body]
 * @param {object} [req.cookies]
 * @param {object} [req.headers]
 * @param {string} [req.method='get']
 * @param {string} [req.path]
 * @param {object} [options]
 * @param {boolean} [options.throw]
 * @returns {object}
 */
OpenApiEnforcer.prototype.request = function(req, options) {
    const data = store.get(this);
    const exception = new Exception('One or more problems exist with the request');
    options = Object.assign({}, data.defaults.request, options);

    // normalize input parameter
    if (typeof req === 'string') req = { path: req };
    if (!req || typeof req !== 'object') throw Error('Invalid request. Must be a string or an object. Received: ' + util.smart(req));
    req = Object.assign({}, req);
    if (req.hasOwnProperty('cookies') && (!req.cookies || typeof req.cookies !== 'object')) throw Error('Invalid request cookies. Must be an object. Received: ' + util.smart(req.cookies));
    if (req.hasOwnProperty('headers') && (!req.headers || typeof req.headers !== 'object')) throw Error('Invalid request headers. Must be an object. Received: ' + util.smart(req.headers));
    if (req.hasOwnProperty('path') && typeof req.path !== 'string') throw Error('Invalid request path. Must be a string. Received: ' + util.smart(req.path));
    if (req.hasOwnProperty('method') && typeof req.method !== 'string') throw Error('Invalid request method. Must be a string. Received: ' + util.smart(req.method));
    if (!req.hasOwnProperty('path')) req.path = '/';
    if (!req.hasOwnProperty('method')) req.method = 'get';

    // build request path and query
    const pathAndQuery = req.path.split('?');
    req.path = util.edgeSlashes(pathAndQuery[0], true, false);
    const query = pathAndQuery[1];

    // get the defined open api path or call next middleware
    const path = this.path(req.path);
    if (!path) {
        exception.push('Path not found');
        exception.meta = { statusCode: 404 };
        return errorHandler(options.throw, exception);
    }

    // validate that the path supports the method
    const method = req.method.toLowerCase();
    if (!path.schema[method]) {
        exception.push('Method not allowed');
        exception.meta = { statusCode: 405 };
        return errorHandler(options.throw, exception);
    }

    // parse and validate request input
    const parsed = store.get(this).version.parseRequestParameters(path.schema, exception, {
        body: req.body,
        cookie: req.cookies || {},
        header: req.headers ? util.lowerCaseProperties(req.headers) : {},
        method: method,
        path: path.params,
        query: query || ''
    });

    // if no errors then generate the return value, otherwise add 400 code
    let result = null;
    if (parsed.exception) {
        exception.meta = { statusCode: 400 };
    } else {
        const value = parsed.value;
        result = {
            path: path.path,
            cookies: value.cookie,
            headers: value.header,
            params: value.path,
            query: value.query,
            response: config => responseFactory(this, path, method, config),
            schema: path.schema
        };
        if (value && value.hasOwnProperty('body')) result.body = value.body;
    }

    return errorHandler(options.throw, exception, result);
};

/**
 * Validate and serialize a response.
 * @param {string|object} options
 * @param {string|number} options.code
 * @param {string} options.contentType
 * @param {string} options.path
 * @param {string} options.method
 * @returns {{data: function, example: function, populate: function, serialize: function}}
 */
OpenApiEnforcer.prototype.response = function(options) {
    if (typeof options === 'string') options = { path: options };
    if (!options || typeof options !== 'object') throw Error('Invalid options. Must be a string or an object. Received: ' + util.smart(options));
    options = Object.assign({}, options);

    if (typeof options.code !== 'string' && typeof options.code !== 'number') throw Error('Invalid code. Must be a string or a number. Received: ' + util.smart(options.code));
    if (typeof options.contentType !== 'string') throw Error('Invalid contentType. Must be a string. Received: ' + util.smart(options.contentType));
    if (typeof options.path !== 'string') throw Error('Invalid path. Must be a string. Received: ' + util.smart(options.path));
    if (options.hasOwnProperty('method') && typeof options.method !== 'string') throw Error('Invalid method. Must be a string. Received: ' + util.smart(options.method));

    const path = this.path(options.path);
    if (!path) throw Error('Invalid path. The path is not defined in the specification: ' + options.path);

    options = Object.assign({}, { method: 'get' }, options);
    const method = options.method.toLowerCase();
    if (!path.schema[method]) throw Error('Invalid method for request path. The method is not defined in the specification: ' + method.toUpperCase() + ' ' + options.path);

    return responseFactory(this, path, method, options);
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
    const exception = new Exception('One or more errors occurred during serialization');
    const data = store.get(this);
    const version = data.version;

    // normalize options
    options = Object.assign({}, data.defaults.serialize, options);

    // run version specific deserialization
    const result = version.serial.serialize(exception, schema, value);

    // determine how to handle serialization data
    return errorHandler(options.throw, exception, result);
};

/**
 * Get an object that will allow a simplified execution context for a recurring schema and options.
 * @param {object} schema
 * @param {object} [options]
 * @returns {{deserialize: (function(*=): (*|{errors: string[], value: *})), errors: (function(*=): string[]), populate: (function(*=, *=, *=): *), random: (function(): *), serialize: (function(*=, *=): {errors, value}), validate: (function(*=): void)}}
 */
OpenApiEnforcer.prototype.schema = function(schema, options) {
    const context = this;
    if (!options || typeof options !== 'object') options = {};
    return {
        deserialize: (value) => context.deserialize(schema, value, options.deserialize),
        errors: (value) => context.errors(schema, value, options.errors),
        populate: (params, value) => context.populate(schema, params, value, options.populate),
        random: () => context.random(schema),
        serialize: (value) => context.serialize(schema, value, options.serialize),
        validate: (value) => context.validate(schema, value)
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

// expose an interface for updating defaults
OpenApiEnforcer.defaults = util.copy(staticDefaults);

OpenApiEnforcer.Exception = Exception;



function errorHandler(useThrow, exception, value) {
    const hasErrors = Exception.hasException(exception);
    if (hasErrors && useThrow) {
        const err = Error(exception);
        err.code = 'OPEN_API_EXCEPTION';
        Object.assign(err, exception.meta);
        throw err;
    } else if (useThrow) {
        return value;
    } else {
        return {
            error: hasErrors ? exception : null,
            value: hasErrors ? null : value
        };
    }
}

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

function responseFactory(context, path, method, options) {
    const responses = path.schema[method].responses;
    const produces = path.schema[method].produces;
    const data = responseData(context, produces, responses, options);
    return {
        data: data,
        errors: config => responseErrors(context, responses, data, config),
        example: config => responseExample(context, responses, data, config),
        populate: config => responsePopulate(context, responses, data, config),
        serialize: config => responseSerialize(context, responses, data, config)
    };
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
    if (data.schema) result.body = context.populate(data.schema, config.params, config.body, config.options);

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
                const value = context.populate(schema, config.params, headers[header], config.options);
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
        result.body = context.serialize(data.schema, config.body, config.options);
    }

    if (config.headers && responses && responses[data.code]) {
        const headers = config.headers;
        const schemas = responses[data.code].headers;
        Object.keys(config.headers)
            .forEach(name => {
                const schema = schemas && schemas[name];
                if (schema) {
                    let value = schema && schema.schema
                        ? context.serialize(schema.schema, headers[name], config.options)
                        : String(headers[name]);
                    value = version.serializeResponseHeader(schema, value);
                    result.headers[name] = value;
                }
            });
    }

    return result;
}

