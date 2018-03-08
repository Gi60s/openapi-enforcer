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
    const Version = util.tryRequire('./v' + major + '/index');
    if (!Version) throw Error('The Open API definition version is either invalid or not supported: ' + v);
    const version = new Version(this, definition);

    // normalize defaults
    const defaults = Object.assign({}, defaultOptions);
    Object.keys(Version.defaults)
        .forEach(category => {
            defaults[category] = Object.assign({}, Version.defaults[category], defaults[category]);
        });

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
 * @param {object} schema
 * @param {object} [map]
 * @param {*} [initialValue]
 * @returns {*}
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
 * Parse and validate input parameters for a request..
 * @param {string|object} req
 * @param {string|object} [req.body]
 * @param {object} [req.cookie]
 * @param {object} [req.header]
 * @param {string} [req.method='get']
 * @param {string} [req.path]
 * @returns {object}
 */
OpenApiEnforcer.prototype.request = function(req) {

    // normalize input parameter
    if (typeof req === 'string') req = { path: req };
    if (typeof req !== 'object') throw Error('Invalid request. Must be a string or an object. Received: ' + req);
    req = Object.assign({}, req);
    if (req.hasOwnProperty('body') && typeof req.body !== 'object' && typeof req.body !== 'string') throw Error('Invalid request body. Must be a string or an object. Received: ' + req.body);
    if (req.cookie && typeof req.cookie !== 'object') throw Error('Invalid request cookies. Must be an object. Received: ' + req.cookie);
    if (req.header && typeof req.header !== 'object') throw Error('Invalid request headers. Must be an object. Received: ' + req.header);
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
    if (!path) return { statusCode: 404, message: 'Not found' };

    // validate that the path supports the method
    const method = req.method.toLowerCase();
    if (!path.schema[method]) return { statusCode: 405, message: 'Method not allowed' };

    // parse and validate request input
    return store.get(this).version.parseRequestParameters(path.schema, {
        body: req.body,
        cookie: req.cookie || {},
        header: req.header || {},
        method: method,
        path: path.params,
        query: req.query || ''
    });
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