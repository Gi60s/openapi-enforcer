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

module.exports = {
    type: {
        type: 'string',
        enum: ['basic', 'apiKey', 'oauth2']
    },
    description: 'string',
    name: {
        allowed: ({ definition }) => definition.type === 'apiKey',
        required: true,
        type: 'string'
    },
    in: {
        allowed: ({ definition }) => definition.type === 'apiKey',
        required: true,
        type: 'string',
        enum: ['query', 'header']
    },
    flow: {
        allowed: ({ definition }) => definition.type === 'oauth2',
        required: true,
        type: 'string',
        enum: ['implicit', 'password', 'application', 'accessCode']
    },
    authorizationUrl: {
        allowed: ({ definition }) => definition.type === 'oauth2',
        required: ({ definition }) => ['implicit', 'accessCode'].includes(definition.flow),
        type: 'string'
    },
    tokenUrl: {
        allowed: ({ definition }) => definition.type === 'oauth2',
        required: ({ definition }) => ['password', 'application', 'accessCode'].includes(definition.flow),
    },
    scopes: {
        allowed: ({ definition }) => definition.type === 'oauth2',
        required: true,
        additionalProperties: 'string'
    }
};