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

function OperationObject(data) {
    const Callback = require('./callback');
    const ExternalDocumentation = require('./external-documentation');
    const Parameter = require('./parameter');
    const RequestBody = require('./request-body');
    const Responses = require('./responses');
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
                items: Parameter
            },
            produces: {
                allowed: major === 2,
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            requestBody: RequestBody,
            responses: Responses,
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
                type: 'string'
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