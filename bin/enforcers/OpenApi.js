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
const ComponentRef  = require('../component-ref');

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
        },

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
        request: function (request, options) {
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
        },

        response: function (operation, code) {

        }
    },

    validator: function ({ major }) {
        return {
            type: 'object',
            properties: {
                basePath: {
                    allowed: major === 2,
                    type: 'string',
                    errors: ({ exception, value }) => {
                        if (value[0] !== '/') exception('Value must start with a forward slash');
                    }
                },
                components: {
                    weight: -1,
                    allowed: major === 3,
                    type: 'object',
                    properties: {
                        callbacks: ComponentRef('Callback'),
                        examples: {
                            type: 'object',
                            additionalProperties: ComponentRef('Example')
                        },
                        headers: {
                            type: 'object',
                            additionalProperties: ComponentRef('Header')
                        },
                        links: {
                            type: 'object',
                            additionalProperties: ComponentRef('Link')
                        },
                        parameters: {
                            type: 'object',
                            additionalProperties: ComponentRef('Parameter')
                        },
                        requestBodies: {
                            type: 'object',
                            additionalProperties: ComponentRef('RequestBody')
                        },
                        responses: {
                            type: 'object',
                            additionalProperties: ComponentRef('Response')
                        },
                        schemas: {
                            type: 'object',
                            additionalProperties: ComponentRef('Schema')
                        },
                        securitySchemes: {
                            type: 'object',
                            additionalProperties: ComponentRef('SecurityScheme')
                        },
                    }
                },
                consumes: {
                    allowed: major === 2,
                    type: 'array',
                    items: 'string'
                },
                definitions: {
                    weight: -1,
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: ComponentRef('Schema')
                },
                host: {
                    type: 'string',
                    allowed: major === 2,
                    errors: ({ exception, value }) => {
                        const match = rxHostParts.exec(value);
                        if (match) {
                            if (match[1]) exception('Value must not include the scheme: ' + match[1]);
                            if (match[3]) exception('Value must not include sub path: ' + match[3]);
                        }
                    }
                },
                info: ComponentRef('Info', { required: true }),
                openapi: {
                    allowed: major === 3,
                    required: true,
                    type: 'string',
                    errors: ({ exception, value }) => {
                        if (!rxSemanticVersion.test(value)) exception('Value must be a semantic version number');
                    }
                },
                parameters: {
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: ComponentRef('Parameter')
                },
                paths: ComponentRef('Paths'),
                produces: {
                    allowed: major === 2,
                    type: 'array',
                    items: 'string'
                },
                responses: {
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: ComponentRef('Response')
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
                    items: ComponentRef('SecurityRequirement')
                },
                securityDefinitions: {
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: ComponentRef('SecurityScheme')
                },
                servers: {
                    allowed: major === 3,
                    type: 'array',
                    items: ComponentRef('Server')
                },
                swagger: {
                    allowed: major === 2,
                    required: true,
                    type: 'string',
                    enum: ['2.0']
                },
                tags: {
                    type: 'array',
                    items: ComponentRef('Tag')
                },
                externalDocs: ComponentRef('ExternalDocumentation')
            }
        }
    }
};