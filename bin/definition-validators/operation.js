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

module.exports = OperationObject;

const map = new WeakMap();
const rxCode = /^[1-5]\d{2}$/;
const rxRange = /^[1-5](?:\d|X){2}$/;

function OperationObject(data) {
    const Callback = require('./callback');
    const ExternalDocumentation = require('./external-documentation');
    const Parameter = require('./parameter');
    const RequestBody = require('./request-body');
    const Response = require('./response');
    const SecurityRequirement = require('./security-requirement');
    const Server = require('./server');

    const { major, root } = data;

    if (!map.has(root)) map.set(root, []);
    const operationIds = map.get(root);

    Object.assign(this, {
        type: 'object',
        properties: {
            callbacks: {
                allowed: major === 3,
                type: 'object',
                additionalProperties: Callback
            },
            consumes: {
                allowed: major === 2,
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            deprecated: {
                type: 'boolean',
                default: false
            },
            description: {
                type: 'string'
            },
            externalDocs: ExternalDocumentation,
            operationId: {
                type: 'string',
                errors: ({ exception, value }) => {
                    if (operationIds.includes(value)) {
                        exception('The operationId must be unique');
                    } else {
                        operationIds.push(value);
                    }
                }
            },
            parameters: {
                type: 'array',
                items: Parameter,
                errors: ({ exception, value }) => {
                    const length = value.length;
                    const duplicates = [];
                    let bodiesCount = 0;
                    for (let i = 0; i < length; i++) {
                        const p1 = value[i];
                        if (p1.in === 'body') bodiesCount++;
                        for (let j = 0; j < length; j++) {
                            const p2 = value[j];
                            if (p1 !== p2 && p1.name === p2.name && p1.in === p2.in) {
                                const description = p1.name + ' in ' + p1.in;
                                if (!duplicates.includes(description)) duplicates.push(description);
                            }
                        }
                    }

                    if (bodiesCount > 1) {
                        exception('Only one body parameter allowed');
                    }

                    if (duplicates.length) {
                        exception('Parameter name must be unique per location. Duplicates found: ' + duplicates.join(', '));
                    }
                }
            },
            produces: {
                allowed: major === 2,
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            requestBody: RequestBody,
            responses: {
                required: true,
                type: 'object',
                additionalProperties: function (data) {
                    const response = new Response(data);
                    const { key } = data;
                    response.allowed = key === 'default' || rxCode.test(key) || (major === 3 && rxRange.test(key))
                        ? true
                        : 'Invalid response code.';
                    return response;
                },
                errors: ({ exception, value }) => {
                    if (Object.keys(value).length === 0) {
                        exception('Response object cannot be empty');
                    }
                }
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
                items: SecurityRequirement
            },
            servers: {
                allowed: major === 3,
                type: 'array',
                items: Server
            },
            summary: {
                type: 'string',
                errors: ({ value, warn }) => {
                    if (value.length >= 120) {
                        warn('Value should be less than 120 characters');
                    }
                }
            },
            tags: {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        }
    });
}