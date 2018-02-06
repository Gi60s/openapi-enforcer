/**
 *  @license
 *    Copyright 2017 Brigham Young University
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
const multipart     = require('./multipart-parser');
const populate      = require('./populate');
const util          = require('./util');
const validate      = require('./validate');

module.exports = OpenApiEnforcer;

const store = new WeakMap();
const rxPathParam = /{([^}]+)}/;

/**
 * Produce an open api enforcer instance.
 * @param {object, string} definition The open api definition object or a string representing the version to use.
 * @param {object} [defaultOptions]
 * @constructor
 */
function OpenApiEnforcer(definition, defaultOptions) {

    // make sure that this is called as a new instance
    if (!(this instanceof OpenApiEnforcer)) return new OpenApiEnforcer(definition, defaultOptions);

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
    const Version = util.tryRequire('./versions/v' + major);
    if (!Version) throw Error('The Open API definition version is either invalid or not supported: ' + v);
    const version = new Version(definition);

    // normalize defaults
    const defaults = Object.assign({}, defaultOptions);
    Object.keys(Version.defaults)
        .forEach(category => {
            defaults[category] = Object.assign({}, Version.defaults[category], defaults[category]);
        });

    // build path parser functions
    const pathParsers = { statics: {}, dynamics: {} };
    if (!definition.paths || typeof definition.paths !== 'object') definition.paths = {};
    Object.keys(definition.paths)
        .forEach(path => {
            const about = {
                definition: definition.paths[path],
                path: path
            };

            // if no parameters then store as a static path
            if (!rxPathParam.test(path)) {
                pathParsers.statics[path] = about;

            // analyze the dynamic path and prep for parsing of actual paths
            } else {
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
                    console.log(match);
                    rxStr += path.substring(offset, match.index) + '([\\s\\S]+?)';
                    offset = match.index + match[0].length;
                }
                rxStr += path.substr(offset);
                const rx = new RegExp('^' + rxStr + '$');

                // determine static path percentage
                const pathParts = path.split('/');
                const pathLength = pathParts.length - 1;
                pathParts.shift();
                const total = pathParts
                    .map(v => {
                        const rx = /{([^}]+)}/g;
                        let statics = 0;
                        let params = 0;
                        let offset = 0;
                        let match;
                        while (match = rx.exec(v)) {
                            if (match.index > offset) statics++;
                            params++;
                            offset = match.index + match[0].length;
                        }
                        if (offset < v.length) statics++;
                        return statics / (statics + params);
                    })
                    .reduce((prev, curr) => prev + curr, 0);
                about.weight = total / (pathLength - 1);

                // add the parse function
                about.parse = str => {
                    str = util.edgeSlashes(str, true, false);

                    const match = rx.exec(str);
                    if (!match) return undefined;

                    const params = {};
                    parameterNames.forEach((name, index) => params[name] = match[index + 1]);
                    return params;
                };

                if (!pathParsers.dynamics[pathLength]) pathParsers.dynamics[pathLength] = [];
                pathParsers.dynamics[pathLength].push(about);
            }
        });
    Object.keys(pathParsers.dynamics)
        .forEach(key => {
            pathParsers.dynamics[key].sort((a, b) => a.weight < b.weight ? -1 : 1);
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
 * Format a value for sending as a response.
 * @param {*} value
 * @param {object} schema
 * @returns {*}
 */
OpenApiEnforcer.prototype.format = function(value, schema) {
    const type = util.schemaType(schema);
    switch (type) {
        case 'array':
            if (Array.isArray(value)) return value.map(v => this.format(v, schema.items));
            break;

        case 'boolean':
        case 'integer':
        case 'number':
            return format[type](value);

        case 'string':
            switch (schema.format) {
                case 'binary':
                case 'byte':
                case 'date':
                case 'date-time':
                    return format[schema.format](value);
            }
            return format.string(value);

        case 'object':
            if (value && typeof value === 'object') {
                const result = {};
                const additionalProperties = schema.additionalProperties;
                const properties = schema.properties || {};
                Object.keys(value).forEach(key => {
                    if (properties.hasOwnProperty(key)) {
                        result[key] = this.format(value[key], properties[key]);
                    } else if (additionalProperties) {
                        result[key] = this.format(value[key], additionalProperties);
                    }
                });
                return result;
            }
    }
};

OpenApiEnforcer.prototype.middleware = function(options) {
    const enforcer = this;
    return function(req, res, next) {
        // parse the incoming request
        const data = enforcer.path(req.path);

        // TODO: multipart fields and files merged into single body object
        // TODO: can openapi specify what types of files to update and size limits?

        // overwrite the send method to validate the response prior to sending
        /*const send = res.send;
        res.send = function(status, body) {
            const errors = enforcer.errors(schema, body);
            send.apply(send, arguments);
        };*/

        req.openapi = openapi;
    }
};

/**
 * Get details about the matching path.
 * @param {string} path
 * @returns {{path: string, params: Object.<string, *>, schema: object}|undefined}
 */
OpenApiEnforcer.prototype.path = function(path) {
    const parsers = store.get(this).pathParsers;

    // normalize path
    if (!path) path = '';
    path = util.edgeSlashes(path, true, false);

    // check for static path match - simple key lookup
    const staticPath = parsers.statics[path];
    if (staticPath) {
        return {
            params: {},
            path: staticPath.path,
            schema: util.copy(staticPath.definition)
        }

    // process dynamic path matches - test each regular expression
    } else {
        const pathLength = path.split('/').length - 1;
        const dynamics = parsers.dynamics[pathLength];

        // no matches
        if (!dynamics) return;

        const length = dynamics.length;
        for (let i = 0; i < length; i++) {
            const parser = dynamics[i];
            const params = parser.parse(path);
            if (params) return {
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
 * @param {object} [map]
 * @param {*} [initialValue]
 */
OpenApiEnforcer.prototype.populate = function(schema, map, initialValue) {
    const data = store.get(this);
    const options = data.defaults.populate;

    // initialize variables
    const initialValueProvided = arguments.length > 3;
    const version = data.version;
    const v = {
        injector: populate.injector[options.replacement],
        map: map || {},
        options: data.defaults.populate,
        schemas: version.schemas,
        version: version
    };

    // produce start value
    const value = v.options.copy && initialValueProvided
        ? util.copy(initialValue)
        : initialValue;

    // begin population
    const root = { root: value };
    populate.populate(v, '<root>', schema, root, 'root');

    return root.root;
};

/**
 * Convert input into values.
 * @param {object|string} request A request object or the path to use with GET method.
 * @param {string|object} [request.body=''] The body of the request.
 * @param {string|Object.<string,string>} [request.header={}] The request header as a string or object
 * @param {string} [request.method=GET] The request method.
 * @param {string} [request.path=''] The request path. The path can contain the query parameters.
 * @param {string|Object.<string,string|undefined|Array.<string|undefined>>} [request.query={}] The request query. If the path also has the query defined then this query will overwrite the path query parameters.
 */
OpenApiEnforcer.prototype.request = function(request) {
    let type;
    let hasError;

    // process and validate input parameter
    if (arguments.length === 0) request = '';
    if (typeof request === 'string') request = { path: request };
    if (!request || typeof request !== 'object') throw Error('Expected an object or a string. Received: ' + util.smart(request));
    const req = Object.assign({ body: '', header: {}, method: 'GET', path: '', query: {} }, request);

    // validate path
    if (typeof req.path !== 'string') throw Error('Invalid request path specified. Expected a string. Received: ' + util.smart(req.path));
    const pathComponents = req.path.split('?');
    req.path = '/' + pathComponents[0].replace(/^\//, '').replace(/\/$/, '');

    this.path(req.path);

    // normalize and validate header
    type = typeof req.header;
    if (type === 'string') {
        req.header = req.header.split('\n')
            .reduce((p, c) => {
                const match = /^([^:]+): ([\s\S]*?)\r?$/.exec(c);
                p[match[1].toLowerCase()] = match[2] || '';
                return p;
            }, {});
    } else if (req.header && type === 'object') {
        const header = {};
        const keys = Object.keys(req.header);
        const length = keys.length;
        for (let i = 0; i < length; i++) {
            const key = keys[i];
            const value = req.header[key];
            if (typeof value !== 'string') {
                hasError = true;
                break;
            }
            header[key.toLowerCase()] = value;
        }
        req.header = header;
    } else {
        hasError = true;
    }
    if (hasError) throw Error('Invalid request header specified. Expected a string or an object. Received: ' + util.smart(req.header));

    // normalize and validate body
    type = typeof req.body;
    if (type !== 'string' && type !== 'object') throw Error('Invalid request body. Expected a string or an object. Received: ' + util.smart(req.body));
    if (type === 'string' && req.body && req.header['content-type']) {
        const contentType = req.header['content-type'];
        const index = contentType.indexOf(';');
        switch (index !== -1 ? contentType.substr(0, index) : contentType) {
            case 'application/json':
                req.body = JSON.parse(req.body);
                break;
            case 'application/x-www-form-urlencoded':
                req.body = parseQueryString(req.body);
                break;
            case 'multipart/form-data':
                req.body = multipart(req.header, req.body);
        }
    }

    // normalize and validate method
    req.method = req.method.toLowerCase();
    if (['get', 'post', 'put', 'delete', 'options', 'head', 'patch'].indexOf(req.method) === -1) {
        throw Error('Invalid request method specified. Expected on of: GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH. Received: ' + util.smart(req.method));
    }

    // normalize and validate query
    type = typeof req.query;
    if (type === 'string') {
        req.query = parseQueryString(req.query);
    } else if (type === 'object') {
        const query = {};
        const keys = Object.keys(req.query);
        const length = keys.length;
        for (let i = 0; i < length; i++) {
            const value = req.query[keys[i]];
            const type = typeof value;
            if (type === 'string' || value === undefined) {
                query[key] = [ value ];
            } else if (Array.isArray(value)) {
                const length = value.length;
                for (let j = 0; j < length; j++) {
                    const type = typeof value[j];
                    if (type !== 'string' && type !== 'undefined') {
                        hasError = true;
                        break;
                    }
                }
            } else {
                hasError = true;
                break;
            }
        }
    } else {
        hasError = true;
    }
    if (hasError) throw Error('Invalid request query. Expected a string or an object with values that are string or arrays of strings/undefined. Received: ' + util.smart(req.query));

    // merge path component of query with query
    if (pathComponents[1]) {
        const query = parseQueryString(pathComponents[1]);
        Object.keys(query).forEach(key => {
            if (!req.query[key]) req.query[key] = [];
            req.query[key].push.apply(req.query[key], query[key]);
        });
    }

    //return store.get(this).version.request(req);

    return req;
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


OpenApiEnforcer.is = require('./is');

/**
 * Parse query string into object mapped to array of values.
 * @param {string} string
 * @returns {Object.<string, string[]>}
 */
function parseQueryString(string) {
    const result = {};
    string
        .split('&')
        .forEach(v => {
            const ar = v.split('=');
            const name = ar[0];
            const value = ar[1];
            if (!result[name]) result[name] = [];
            result[name].push(value);
        });
    return result;
}