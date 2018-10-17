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
const Exception = require('../exception');
const Result    = require('../result');
const Schema    = require('../definition-validators/schema');
const Super     = require('./super');
const util      = require('../util');
const validator = require('../definition-validator');

module.exports = Super(OpenAPIEnforcer);

function OpenAPIEnforcer(data) {

}

/**
 * Get path parameters and operation from a method and path.
 * @param {string} method
 * @param {string} path
 * @returns {EnforcerResult<{operation:OperationEnforcer, params:Object}>}
 */
OpenAPIEnforcer.prototype.path = function (method, path) {
    const exception = Exception('Request has one or more errors');
    path = util.edgeSlashes(path.split('?')[0], true, false);

    // find the path that matches the request
    const pathMatch = this.paths.findMatch(path);
    if (!pathMatch) {
        exception('Path not found');
        exception.statusCode = 404;
        return new Result(undefined, exception);
    }

    // check that a valid method was specified
    const pathEnforcer = pathMatch.path;
    if (!pathEnforcer.methods.includes(method)) {
        exception('Method not allowed: ' + method.toUpperCase());
        exception.statusCode = 405;
        exception.header = { Allow: pathEnforcer.methods.map(v => v.toUpperCase()).join(', ') };
        return new Result(undefined, exception);
    }

    return new Result({
        operation: pathEnforcer[method],
        params: pathMatch.params
    });
};

/**
 * Deserialize and validate a request.
 * @param {object} [request]
 * @param {object|string} [request.body]
 * @param {Object<string,string>} [request.header={}] The request headers
 * @param {string} [request.method='get']
 * @param {string} [request.path='/']
 * @param {object} [options]
 * @param {boolean} [options.allowOtherQueryParameters=false] Allow query parameter data that is not specified in the OAS document
 * @param {boolean} [options.bodyDeserializer] A function to call to deserialize the body into it's expected type.
 * @returns {EnforcerResult<{ body:*, header:object, method:string, path:object, query:object }>}
 */
OpenAPIEnforcer.prototype.request = function (request, options) {
    // validate input parameters
    if (!request || typeof request !== 'object') throw Error('Invalid request. Expected a non-null object. Received: ' + request);
    if (request.hasOwnProperty('body') && !(typeof request.body === 'string' || typeof request.body === 'object')) throw Error('Invalid body provided');
    if (request.hasOwnProperty('header') && !util.isObjectStringMap(request.header)) throw Error('Invalid request header. Expected an object with string keys and string values');
    if (request.hasOwnProperty('method') && typeof request.method !== 'string') throw Error('Invalid request method. Expected a string');
    if (!request.hasOwnProperty('path')) throw Error('Missing required request path');
    if (typeof request.path !== 'string') throw Error('Invalid request path. Expected a string');

    if (!options) options = {};
    if (typeof options !== 'object') throw Error('Invalid options. Expected an object. Received: ' + options);
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('allowOtherQueryParameters')) options.allowOtherQueryParameters = false;

    const method = request.hasOwnProperty('method') ? request.method.toLowerCase() : 'get';
    const [ pathString, query ] = request.path.split('?');
    const path = util.edgeSlashes(pathString, true, false);
    const [ pathObject, error ] = this.path(method, path);
    if (error) return new Result(undefined, error);

    // set up request input
    const { operation, params } = pathObject;
    const req = {
        header: request.header || {},
        path: params,
        query: query || ''
    };
    if (request.hasOwnProperty('body')) req.body = request.body;

    const result = operation.request(req, options);
    if (result.value) {
        result.value.operation = operation;
        result.value.response = code => this.response(operation, code);
    }
    return result;
};

OpenAPIEnforcer.prototype.response = function (operation, code) {

};

/**
 * Get a Schema instance from the provided definition.
 * @param {object} definition
 * @returns {EnforcerResult}
 */
OpenAPIEnforcer.prototype.schema = function (definition) {
    return validator.normalize(this.enforcerData.major, Schema, definition);
};