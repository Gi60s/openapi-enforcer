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
const EnforcerRef   = require('../enforcer-ref');
const Exception     = require('../exception');
const Result        = require('../result');
const Operation     = require('./Operation');
const util          = require('../util');

const rxHostParts = /^((?:https?|wss?):\/\/)?(.+?)(\/.+)?$/;
const rxSemanticVersion = /^\d+\.\d+\.\d+$/;

module.exports = {
    init: function (data) {

    },

    prototype: {
        /**
         * Get path parameters and operation from a method and path.
         * @param {string} method
         * @param {string} path
         * @returns {EnforcerResult<{operation:OperationEnforcer, params:Object}>}
         */
        path: function (method, path) {
            const exception = Exception('Request has one or more errors');
            path = this.enforcerData.options.disablePathNormalization
                ? path.split('?')[0]
                : util.edgeSlashes(path.split('?')[0], true, false);
            method = method.toLowerCase();

            // find the path that matches the request
            const pathMatch = this.paths.findMatch(path);
            if (!pathMatch) {
                exception.message('Path not found');
                exception.statusCode = 404;
                return new Result(undefined, exception);
            }

            // check that a valid method was specified
            const pathEnforcer = pathMatch.path;
            if (!pathEnforcer.methods.includes(method)) {
                exception.message('Method not allowed: ' + method.toUpperCase());
                exception.statusCode = 405;
                exception.headers = { Allow: pathEnforcer.methods.map(v => v.toUpperCase()).join(', ') };
                return new Result(undefined, exception);
            }

            // parse and validate path parameters
            const operation = pathEnforcer[method];
            const pathParams = operation.parametersMap.path;
            const params = pathMatch.params;
            if (pathParams) {
                const child = exception.nest('Error in one or more path parameters');
                Object.keys(pathParams).forEach(name => {
                    const parameter = pathParams[name];
                    const schema = pathParams[name].schema;

                    let data = parameter.parse(params[name]);
                    if (!data.error) data = schema.deserialize(data.value);
                    if (!data.error) data.error = schema.validate(data.value);
                    if (data.error) {
                        child.at(name).push(data.error);
                    } else {
                        params[name] = data.value;
                    }
                })
            }

            if (exception.hasException) return new Result(undefined, exception);
            return new Result({
                operation,
                params,
                pathKey: pathMatch.pathKey
            });
        },

        /**
         * Deserialize and validate a request.
         * @param {object} [request]
         * @param {object|string} [request.body]
         * @param {Object<string,string>} [request.headers={}] The request headers
         * @param {string} [request.method='get']
         * @param {string} [request.path='/']
         * @param {Object<string,string>} [request.query] Will be overwritten if the path includes query string parameters.
         * @param {object} [options]
         * @param {boolean,string[]} [options.allowOtherQueryParameters=false] Allow query parameter data that is not specified in the OAS document
         * @returns {EnforcerResult<{ body:*, cookie:object, headers:object, operation: Operation, path:object, query:object, response:function }>}
         */
        request: function (request, options) {
            request = this.toRequestObject(request);

            // validate input parameters
            if (!request || typeof request !== 'object') throw Error('Invalid request. Expected a non-null object. Received: ' + request);
            if (request.hasOwnProperty('body') && !(typeof request.body === 'string' || typeof request.body === 'object')) throw Error('Invalid body provided');
            if (request.hasOwnProperty('headers') && !util.isObjectStringMap(request.headers)) throw Error('Invalid request headers. Expected an object with string keys and string values');
            if (request.hasOwnProperty('method') && typeof request.method !== 'string') throw Error('Invalid request method. Expected a string');
            if (!request.hasOwnProperty('path')) throw Error('Missing required request path');
            if (typeof request.path !== 'string') throw Error('Invalid request path. Expected a string');
            if (request.hasOwnProperty('query') && !util.isObjectStringMap(request.query)) throw Error('Invalid request query. Expected an object with string keys and string values');

            if (!options) options = {};
            if (typeof options !== 'object') throw Error('Invalid options. Expected an object. Received: ' + options);
            options = Object.assign({}, options);
            if (!options.hasOwnProperty('allowOtherQueryParameters')) options.allowOtherQueryParameters = false;
            options.pathParametersProcessed = true;

            const method = request.hasOwnProperty('method') ? request.method.toLowerCase() : 'get';
            let [ pathString, query ] = request.path.split('?');
            if (!query && request.hasOwnProperty('query')) query = util.toQueryString(request.query);
            const path = this.enforcerData.options.disablePathNormalization
                ? pathString
                : util.edgeSlashes(pathString, true, false);
            const [ pathObject, error ] = this.path(method, path);
            if (error) return new Result(undefined, error);

            // set up request input
            const { operation, params, pathKey } = pathObject;
            const req = {
                headers: request.headers || {},
                path: params,
                query: query || ''
            };
            if (request.hasOwnProperty('body')) req.body = request.body;

            const result = operation.request(req, options);
            if (result.value) {
                result.value.operation = operation;
                result.value.response = (code, body, headers = {}) => {
                    headers = util.lowerCaseObjectProperties(headers);
                    if (!headers['content-type'] && req.headers.accept) {
                        const matches = operation.getResponseContentTypeMatches(code, req.headers.accept);
                        if (matches.length) headers['content-type'] = matches[0];
                    }
                    return operation.response(code, body, headers)
                };
                result.value.pathKey = pathKey;
            }
            return result;
        },

        toRequestObject: Operation.prototype.toRequestObject
    },

    validator: function ({ major }) {
        return {
            type: 'object',
            properties: {
                basePath: {
                    allowed: major === 2,
                    type: 'string',
                    errors: ({ exception, definition }) => {
                        if (definition[0] !== '/') exception.message('Value must start with a forward slash');
                    }
                },
                components: EnforcerRef('Components', { weight: -1, allowed: major === 3 }),
                consumes: {
                    allowed: major === 2,
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                definitions: {
                    weight: -1,
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: EnforcerRef('Schema')
                },
                host: {
                    type: 'string',
                    allowed: major === 2,
                    errors: ({ exception, definition }) => {
                        const match = rxHostParts.exec(definition);
                        if (match) {
                            if (match[1]) exception.message('Value must not include the scheme: ' + match[1]);
                            if (match[3]) exception.message('Value must not include sub path: ' + match[3]);
                        }
                    }
                },
                info: EnforcerRef('Info', { required: true }),
                openapi: {
                    allowed: major === 3,
                    required: true,
                    type: 'string',
                    errors: ({ exception, definition }) => {
                        if (!rxSemanticVersion.test(definition)) exception.message('Value must be a semantic version number');
                    }
                },
                parameters: {
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: EnforcerRef('Parameter')
                },
                paths: EnforcerRef('Paths', { required: true }),
                produces: {
                    allowed: major === 2,
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                responses: {
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: EnforcerRef('Response')
                },
                schemes: {
                    allowed: major === 2,
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['http', 'https', 'ws', 'wss']
                    }
                },
                security: {
                    type: 'array',
                    items: EnforcerRef('SecurityRequirement')
                },
                securityDefinitions: {
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: EnforcerRef('SecurityScheme')
                },
                servers: {
                    allowed: major === 3,
                    type: 'array',
                    items: EnforcerRef('Server')
                },
                swagger: {
                    allowed: major === 2,
                    required: true,
                    type: 'string',
                    enum: ['2.0']
                },
                tags: {
                    type: 'array',
                    items: EnforcerRef('Tag')
                },
                externalDocs: EnforcerRef('ExternalDocumentation')
            }
        }
    }
};
