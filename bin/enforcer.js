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
            this.version = 2;

            if (definition.hasOwnProperty('definitions')) {
                this.definitions = util.mapObject(definition.definitions, (definition, key) => {
                    return new Schema(this, exception.at('definitions/' + key), definition, map);
                });
            }
        }

    } else if (definition.hasOwnProperty('openapi')) {
        const match = rxSemver.exec(definition.openapi);
        if (!match || match[1] !== '3') {
            exception('OpenAPI version ' + definition.openapi + ' not supported');
        } else {
            this.version = 3;
        }
    }

    if (!exception.hasException) {
        if (!definition.hasOwnProperty('paths')) {
            exception('Missing required property "paths"');
        } else {
            this.paths = new Paths(this, exception.at('paths'), definition.paths, map);
        }
    }

    if (exception.hasException) throw new Error(exception.toString());
    if (options.freeze) freeze.deep(this);
}

/**
 * Deserialize and validate a request.
 * @param {object} [request]
 * @param {object|string} [request.body]
 * @param {string} [request.cookies='']
 * @param {object} [request.headers={}]
 * @param {string} [request.method='get']
 * @param {string} [request.path='/']
 * @param {object} [options]
 * @param {boolean} [options.allowOtherQueryParameters=false]
 * @returns {EnforcerResult}
 */
Enforcer.prototype.request = function(request, options) {

    // validate request parameter and properties
    if (request.hasOwnProperty('body') && !(typeof request.body === 'string' || util.isPlainObject(request.body))) throw Error('Invalid body provided');
    if (request.hasOwnProperty('cookies') && typeof request.cookies !== 'string') throw Error('Invalid request cookies. Expected a string.');
    if (request.hasOwnProperty('headers') && !isObjectStringMap(request.headers)) throw Error('Invalid request headers. Expected an object with string keys and string values');
    if (request.hasOwnProperty('method') && typeof request.method !== 'string') throw Error('Invalid request method. Expected a string');
    if (request.hasOwnProperty('path') && typeof request.path !== 'string') throw Error('Invalid request path. Expected a string');

    // build internal request object
    const req = {};
    const pathQueryArray = request && request.path && request.path.split('?');
    const pathString = request.hasOwnProperty('path') ? pathQueryArray.shift() : '/';
    const queryString = pathQueryArray.join('&');
    const cookieString = request.hasOwnProperty('cookies') ? request.cookies : '';
    req.cookie = cookieString ? util.parseQueryString(cookieString, '; ') : {};
    req.header = request.hasOwnProperty('headers') ? Object.assign({}, request.headers) : {};
    req.method = request.hasOwnProperty('method') ? request.method : 'get';
    req.query = queryString ? util.parseQueryString(queryString) : {};

    // normalize options
    options = Object.assign({ allowOtherQueryParameters: false }, options);

    const exception = Exception('Request has one or more errors');
    exception.statusCode = 400;

    // find the path that matches the request
    const pathMatch = this.paths.findMatch(pathString);
    if (!pathMatch) {
        exception('Path not found');
        exception.statusCode = 404;
        return new Result(exception, null);
    }

    // check that a valid method was specified
    const path = pathMatch.path;
    if (!path.methods.includes(req.method)) {
        exception('Method not allowed: ' + method.toUpperCase());
        exception.statusCode = 405;
        exception.headers = { Allow: this.methods.join(', ') };
        return new Result(exception, null);
    }

    // make all header properties lowercase
    const headerNamesMap = util.lowerCaseObjectProperties(req.header);

    // process non-body input - 1) parse, 2) deserialize, 3) validate
    const operation = path[req.method];
    const parameters = operation.parameters;
    req.path = pathMatch.params;
    ['cookie', 'header', 'path', 'query'].forEach(at => {
        if (parameters[at]) {
            const child = exception.nest('In ' + at + ' parameters');
            const input = Object.assign({}, req[at]);
            const output = {};
            const missingRequired = [];
            const unknownParameters = at === 'query' && !options.allowOtherQueryParameters
                ? Object.keys(input)
                : [];

            Object.keys(parameters[at].map).forEach(name => {
                const key = at === 'header' ? headerNamesMap[name] : name;
                const parameter = parameters[at].map[name];
                const type = parameter.schema && parameter.schema.type;
                if (input.hasOwnProperty(key)) {
                    util.arrayRemoveItem(unknownParameters, key);
                    const data = (at === 'query' || at === 'cookie')
                        ? parameter.parse(queryString, input)
                        : parameter.parse(input[key]);
                    processInput(child.at(key), parameter, data, v => output[key] = v);

                } else if (parameter.in === 'query' && parameter.style === 'form' && parameter.explode && type === 'object') {
                    const data = parameter.parse(queryString, input);
                    processInput(null, parameter, data, value => {
                        Object.keys(value).forEach(key => util.arrayRemoveItem(unknownParameters, key));
                        output[key] = value;
                    })

                } else if (parameter.in === 'query' && parameter.style === 'deepObject' && type === 'object') {
                    const data = parameter.parse(queryString, input);
                    processInput(child.at(key), parameter, data, value => {
                        Object.keys(value).forEach(k => util.arrayRemoveItem(unknownParameters, key + '[' + k + ']'));
                        output[key] = value;
                    });

                } else if (parameter.required) {
                    missingRequired.push(key);
                }
            });

            req[at] = output;

            // add exception for any unknown query parameters
            if (unknownParameters.length) {
                child('Received unexpected parameter' +
                    (unknownParameters.length === 1 ? '' : 's') + ': ' +
                    unknownParameters.join(', '));
            }

            //
            if (missingRequired.length) {
                child('Missing required parameter' + (missingRequired.length > 1 ? 's' : '') +
                    ': ' + missingRequired.join(', '));
            }
        }
    });

    // process the body
    if (request.hasOwnProperty('body')) {
        let body;
        if (util.isPlainObject(request.body)) {
            body = util.copy(request.body);
        } else if (typeof request.body === 'string') {
            body = request.body;
        }
    }

    // TODO: process body input
    if (this.version === 2) {
        if (!parameters.body.empty) {

        } else if (!parameters.formData.empty) {

        }
    }

    // TODO: return parsed and validated input params as well as the operation responses object

    // build the result object
    const result = {};
    if (req.hasOwnProperty('body')) result.body = req.body;
    result.cookies = req.cookie;
    result.headers = req.header;
    result.params = req.params;
    result.path = req.path;
    result.query = req.query;

    // return the request
    req.operation = operation;
    return new Result(exception, result);
};

Object.defineProperty(Enforcer, 'EMPTY_VALUE', {
    configurable: false,
    writable: false,
    value: util.EMPTY_VALUE
});

function isObjectStringMap(obj) {
    if (!util.isPlainObject(obj)) return false;
    const keys = Object.keys(obj);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
        if (typeof keys[i] !== 'string' || typeof obj[keys[i]] !== 'string') return false;
    }
    return true;
}

function processInput(exception, parameter, data, success) {
    if (!data.error) data = parameter.schema.deserialize(data.value);
    if (!data.error) data.error = parameter.schema.validate(data.value);
    if (data.error) {
        if (exception) exception(data.error);
    } else {
        success(data.value);
    }
}