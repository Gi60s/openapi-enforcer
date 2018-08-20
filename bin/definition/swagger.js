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
const ExternalDocumentation = require('./external-documentation');
const Info                  = require('./info');
const Parameter             = require('./parameter');
const Path                  = require('./path');
const Response              = null;
const Schema                = require('./schema');
const SecurityRequirement   = require('./security-requirement');
const SecurityScheme        = require('./security-scheme');
const Tag                   = require('./tag');

module.exports = {
    swagger: {
        allowed: ({ version }) => version === 2,
        required: true,
        type: 'string',
        enum: ['2.0']
    },
    info: {
        required: true,
        isPlainObject: true,
        properties: Info
    },
    host: {
        type: 'string'
    },
    basePath: {
        type: 'string'
    },
    schemes: {
        allowed: ({ version }) => version === 2,
        items: {
            type: 'string',
            enum: ['http', 'https', 'ws', 'wss']
        }
    },
    consumes: {
        allowed: ({ version }) => version === 2,
        items: 'string'
    },
    produces: {
        allowed: ({ version }) => version === 2,
        items: 'string'
    },
    paths: {
        required: true,
        additionalProperties: Path
    },
    definitions: {
        additionalProperties: Schema
    },
    parameters: {
        additionalProperties: Parameter
    },
    responses: {
        additionalProperties: Response
    },
    securityDefinitions: {
        additionalProperties: SecurityScheme
    },
    security: SecurityRequirement,
    tags: {
        items: Tag
    },
    externalDocs: {
        properties: ExternalDocumentation
    }
};

const validationsMap = {
    swagger: {
        allowed: ({ version }) => version === 2,
        required: true,
        type: 'string',
        error: ({ value }) => value === '2.0' ? false : 'Value must equal 2.0'
    },
    info: {
        required: () => true,
        isPlainObject: true,
        each: {
            title: {
                required: true
            }
        }
    },
    host: {
        type: () => 'string'
    },
    basePath: {
        type: () => 'string'
    },
    schemes: {
        allowed: (ctx, version) => version === 2,
        isArray: true,
        errorsEach: {
            type: () => 'string',
            enum: () => ['http', 'https', 'ws', 'wss']
        }
    },
    consumes: {
        allowed: (ctx, version) => version === 2,
        isArray: true
    },
    produces: {
        allowed: (ctx, version) => version === 2,
        isArray: true
    },
};