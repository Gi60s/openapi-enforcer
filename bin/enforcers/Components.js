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

module.exports = {
    init: function (data) {

    },

    prototype: {},

    validator: function ({ major }) {
        return {
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
        }
    }
};