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
const freeze        = require('./freeze');
const Paths         = require('./components/paths');
const Parameter     = require('./components/parameter');
const queryString   = require('querystring');
const Readable      = require('stream').Readable;
const Result        = require('./result');
const Schema        = require('./components/schema');
const util          = require('./util');

const rxSemver = /^(\d+)\.(\d+)\.(\d+)$/;

module.exports = Enforcer;

function Enforcer(definition, options) {
    const exception = Exception('Error building enforcer instance');

    options = Object.assign({}, options);
    if (!options.hasOwnProperty('freeze')) options.freeze = true;

    definition = util.copy(definition);

    const map = new WeakMap();
    if (!util.isPlainObject(definition)) {
        exception('Invalid input. Definition must be a plain object');

    } else if (!definition.hasOwnProperty('swagger') && !definition.hasOwnProperty('openapi')) {
        exception('Missing required property "swagger" or "openapi"');

    } else if (definition.hasOwnProperty('swagger')) {
        if (definition.swagger !== '2.0') {
            exception('Property "swagger" must have value "2.0"')

        } else {
            common(2, this, exception, definition, map);
            if (definition.hasOwnProperty('definitions')) {
                this.definitions = util.mapObject(definition.definitions, (definition, key) => {
                    return new Schema(2, this, exception.at('definitions/' + key), definition, map);
                });
            }
            if (definition.hasOwnProperty('parameters')) {
                this.parameters = util.mapObject(definition.definitions, (definition, key) => {
                    return new Parameter(2, this, exception.at('parameters/' + key), definition, map);
                });
            }
            if (definition.hasOwnProperty('responses')) {
                this.parameters = util.mapObject(definition.responses, (definition, key) => {
                    // TODO
                    return new Response(2, this, exception.at('responses/' + key), definition, map);
                });
            }
        }

    } else if (definition.hasOwnProperty('openapi')) {
        const match = rxSemver.exec(definition.openapi);
        if (!match || match[1] !== '3') {
            exception('OpenAPI version ' + definition.openapi + ' not supported');
        } else {
            common(3, this, exception, definition, map);
            if (definition.hasOwnProperty('components')) {
                if (!util.isPlainObject(definition.components)) {
                    exception('Property "components" must be an object');
                } else {
                    const components = definition.components;
                    this.components = {};
                    if (components.hasOwnProperty('headers')) {
                        this.components.parameters = util.mapObject(components.headers, (definition, key) => {
                            // TODO
                            return new Header(3, this, exception.at('components/headers/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('parameters')) {
                        this.components.parameters = util.mapObject(components.parameters, (definition, key) => {
                            return new Parameter(3, this, exception.at('components/parameters/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('responses')) {
                        this.parameters = util.mapObject(definition.responses, (definition, key) => {
                            // TODO
                            return new Response(3, this, exception.at('components/responses/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('requestBodies')) {
                        this.parameters = util.mapObject(definition.responses, (definition, key) => {
                            // TODO
                            return new RequestBody(3, this, exception.at('components/requestBodies/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('schemas')) {
                        this.components.schemas = util.mapObject(components.schemas, (definition, key) => {
                            return new Schema(3, this, exception.at('components/schemas/' + key), definition, map);
                        });
                    }
                }
            }
        }
    }

    if (exception.hasException) throw new Error(exception.toString());
    if (options.freeze) freeze.deepFreeze(this);
}

/**
 * Deserialize and validate a request.
 * @param {object} [request]
 * @param {Readable|object|string} [request.body]
 * @param {object} [request.cookies={}]
 * @param {object} [request.headers={}]
 * @param {string} [request.method='get']
 * @param {string} [request.path='/']
 * @param {object} [options]
 * @param {boolean} [options.allowOtherQueryParameters=false]
 * @returns {EnforcerResult}
 */
Enforcer.prototype.request = function(request, options) {

    // validate request parameter and properties
    if (request.hasOwnProperty('body') && !(typeof request.body === 'string' || util.isPlainObject(request.body) || request.body instanceof Readable)) throw Error('Invalid body provided');
    if (request.hasOwnProperty('cookies') && !isObjectStringMap(request.cookies)) throw Error('Invalid request cookie. Expected an object with string keys and string values');
    if (request.hasOwnProperty('headers') && !isObjectStringMap(request.headers)) throw Error('Invalid request headers. Expected an object with string keys and string values');
    if (request.hasOwnProperty('method') && typeof request.method !== 'string') throw Error('Invalid request method. Expected a string');
    if (request.hasOwnProperty('path') && typeof request.path !== 'string') throw Error('Invalid request path. Expected a string');

    // build internal request object
    const req = {};
    const pathQueryArray = request && request.path && request.path.split('?');
    if (request.hasOwnProperty('body')) req.body = request.body;
    req.cookie = request.hasOwnProperty('cookies') ? Object.assign({}, request.cookies) : {};
    req.header = request.hasOwnProperty('headers') ? Object.assign({}, request.headers) : {};
    req.method = request.hasOwnProperty('method') ? request.method : 'get';
    req.path = request.hasOwnProperty('path') ? pathQueryArray.shift() : '/';
    req.query = pathQueryArray.length ? parseQueryString(pathQueryArray.join('?')) : {};

    // normalize options
    options = Object.assign({ allowOtherQueryParameters: false }, options);

    const exception = Exception('Request has one or more errors');
    exception.statusCode = 400;

    // find the path that matches the request
    const pathMatch = this.paths.findMatch(req.path);
    if (!pathMatch) {
        exception('Path not found');
        exception.statusCode = 404;
        return Result(exception, null);
    }

    // check that a valid method was specified
    const path = pathMatch.path;
    if (!path.methods.includes(req.method)) {
        exception('Method not allowed: ' + method.toUpperCase());
        exception.statusCode = 405;
        exception.headers = { Allow: this.methods.join(', ') };
        return Result(exception, null);
    }

    // process non-body input - 1) parse, 2) deserialize, 3) validate
    const operation = path[req.method];
    const parameters = operation.parameters;
    ['cookie', 'header', 'path', 'query'].forEach(at => {
        if (parameters[at]) {
            const input = req[at];
            const missingRequired = parameters[at].required.concat();
            const child = exception.nest(util.ucFirst(at) + ' parameter');
            Object.keys(input).forEach(name => {
                const parameter = parameters[at].map[name];
                if (parameter) {
                    let data = parameter.parse(input[name]);
                    if (!data.error) data = parameter.schema.deserialize(data.value);
                    if (!data.error) data.error = parameter.schema.validate(data.value);
                    if (data.error) {
                        child.at(name)(data.value);
                    } else {
                        input[name] = data.value;
                    }
                } else if (at === 'path' || (at === 'query' && !options.allowOtherQueryParameters)) {
                    child.at(name)('Not allowed');
                }
                util.arrayRemoveItem(missingRequired, name);
            });
            if (missingRequired.length) {
                child('Missing required parameter' + (missingRequired.length > 1 ? 's' : '') +
                    ': ' + missingRequired.join(', '));
            }
        }
    });

    // TODO: process body input
    if (this.version === 2) {
        if (!parameters.body.empty) {

        } else if (!parameters.formData.empty) {

        }
    }

    // TODO: return parsed and validated input params as well as the operation responses object
};

function common(version, context, exception, definition, map) {
    if (!definition.hasOwnProperty('paths')) {
        exception('Missing required property "paths"');
    } else {
        context.paths = new Paths(version, context, exception.at('paths'), definition.paths, map);
    }
}

function isObjectStringMap(obj) {
    if (!util.isPlainObject(obj)) return false;
    const keys = Object.keys(obj);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
        if (typeof keys[i] !== 'string' || typeof obj[keys[i]] !== 'string') return false;
    }
    return true;
}

function parseQueryString(str) {
    const query = queryString.parse(str);
    Object.keys(query).forEach(key => {
        const value = query[key];
        if (!Array.isArray(value)) query[key] = [ value ];
    });
    return query;
}