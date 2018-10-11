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
const SecuritySchemeEnforcer    = require('../enforcers/security-scheme');

module.exports = SecuritySchemeObject;

function SecuritySchemeObject({ major }) {
    Object.assign(this, {
        component: SecuritySchemeEnforcer,
        type: 'object',
        properties: {
            authorizationUrl: {
                allowed: ({ parent }) => major === 2 && parent.value.type === 'oauth2',
                required: ({ parent }) => ['implicit', 'accessCode'].includes(parent.value.flow),
                type: 'string'
            },
            bearerFormat: {
                allowed: ({ parent }) => major === 3 && parent.value.type === 'http',
                type: 'string'
            },
            description: 'string',
            flow: {
                allowed: ({ parent }) => major === 2 && parent.value.type === 'oauth2',
                required: true,
                type: 'string',
                enum: ['implicit', 'password', 'application', 'accessCode']
            },
            flows: {
                allowed: ({ parent }) => major === 3 && parent.value.type === 'oauth2',
                type: 'object',
                properties: {
                    authorizationCode: OAuthFlow({
                        authorizationUrl: {
                            required: true,
                            type: 'string'
                        },
                        tokenUrl: {
                            required: true,
                            type: 'string'
                        }
                    }),
                    clientCredentials: OAuthFlow({
                        tokenUrl: {
                            required: true,
                            type: 'string'
                        }
                    }),
                    implicit: OAuthFlow({
                        authorizationUrl: {
                            required: true,
                            type: 'string'
                        }
                    }),
                    password: OAuthFlow({
                        tokenUrl: {
                            required: true,
                            type: 'string'
                        }
                    })
                }
            },
            in: {
                allowed: ({ parent }) => parent.value.type === 'apiKey',
                required: true,
                type: 'string',
                enum: major === 2
                    ? ['query', 'header']
                    : ['query', 'header', 'cookie']
            },
            name: {
                allowed: ({ parent }) => parent.value.type === 'apiKey',
                required: true,
                type: 'string'
            },
            openIdConnectUrl: {
                allowed: major === 3,
                required: ({ parent }) => parent.value.type === 'openIdConnect',
                type: 'string'
            },
            scheme: {
                allowed: ({ parent }) => major === 3 && parent.value.type === 'http',
                required: true,
                type: 'string'
            },
            scopes: {
                allowed: ({ parent }) => major === 2 && parent.value.type === 'oauth2',
                type: 'object',
                required: true,
                additionalProperties: {
                    type: 'string'
                }
            },
            tokenUrl: {
                allowed: ({ parent }) => major === 2 && parent.value.type === 'oauth2',
                required: ({ parent }) => ['password', 'application', 'accessCode'].includes(parent.value.flow),
            },
            type: {
                weight: -10,
                required: true,
                type: 'string',
                enum: major === 2
                    ? ['basic', 'apiKey', 'oauth2']
                    : ['apiKey', 'http', 'oauth2', 'openIdConnect']
            }
        }
    });
}

function OAuthFlow(def) {
    return Object.assign({}, {
        type: 'object',
        properties: {
            refreshUrl: {
                type: 'string'
            },
            scopes: {
                required: true,
                type: 'object',
                additionalProperties: {
                    type: 'string'
                }
            }
        }
    }, def);
}