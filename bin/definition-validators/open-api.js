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
const OpenAPIEnforcer   = require('../enforcers/open-api');

module.exports = OpenAPIObject;

const rxHostParts = /^((?:https?|wss?):\/\/)?(.+?)(\/.+)?$/;
const rxSemanticVersion = /^\d+\.\d+\.\d+$/;

function OpenAPIObject({ major }) {
    const Callback              = require('./callback');
    const Example               = require('./example');
    const ExternalDocumentation = require('./external-documentation');
    const Header                = require('./header');
    const Info                  = require('./info');
    const Link                  = require('./link');
    const Parameter             = require('./parameter');
    const Paths                 = require('./paths');
    const RequestBody           = require('./request-body');
    const Response              = require('./response');
    const Schema                = require('./schema');
    const SecurityRequirement   = require('./security-requirement');
    const SecurityScheme        = require('./security-scheme');
    const Server                = require('./server');
    const Tag                   = require('./tag');

    Object.assign(this, {
        component: OpenAPIEnforcer,
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
                allowed: major === 3,
                type: 'object',
                properties: {
                    callbacks: Callback,
                    examples: {
                        type: 'object',
                        additionalProperties: Example
                    },
                    headers: {
                        type: 'object',
                        additionalProperties: Header
                    },
                    links: {
                        type: 'object',
                        additionalProperties: Link
                    },
                    parameters: {
                        type: 'object',
                        additionalProperties: Parameter
                    },
                    requestBodies: {
                        type: 'object',
                        additionalProperties: RequestBody
                    },
                    responses: {
                        type: 'object',
                        additionalProperties: Response
                    },
                    schemas: {
                        type: 'object',
                        additionalProperties: Schema
                    },
                    securitySchemes: {
                        type: 'object',
                        additionalProperties: SecurityScheme
                    },
                }
            },
            consumes: {
                allowed: major === 2,
                type: 'array',
                items: 'string'
            },
            definitions: {
                allowed: major === 2,
                type: 'object',
                additionalProperties: Schema
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
            info: function (data) {
                const result = new Info(data);
                result.required = true;
                return result;
            },
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
                additionalProperties: Parameter
            },
            paths: Paths,
            produces: {
                allowed: major === 2,
                type: 'array',
                items: 'string'
            },
            responses: {
                allowed: major === 2,
                type: 'object',
                additionalProperties: Response
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
            securityDefinitions: {
                allowed: major === 2,
                type: 'object',
                additionalProperties: SecurityScheme
            },
            servers: {
                allowed: major === 3,
                type: 'array',
                items: Server
            },
            swagger: {
                allowed: major === 2,
                required: true,
                type: 'string',
                enum: ['2.0']
            },
            tags: {
                type: 'array',
                items: Tag
            },
            externalDocs: ExternalDocumentation
        }
    });
};