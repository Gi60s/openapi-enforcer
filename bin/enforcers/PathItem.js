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

const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

module.exports = {
    init: function (data) {
        this.methods = {
            value: methods.filter(method => !!this[method]) // an array of all methods used by this path
        };
    },

    prototype: {},

    validator: function ({ major }) {
        const Operation = require('./Operation');
        return {
            type: 'object',
            properties: {
                delete: ComponentRef('Operation'),
                description: {
                    type: 'string'
                },
                get: ComponentRef('Operation'),
                head: ComponentRef('Operation'),
                options: ComponentRef('Operation'),
                parameters: {
                    weight: -1,
                    type: 'array',
                    items: ComponentRef('Parameter'),
                    errors: Operation.parametersValidation
                },
                patch: ComponentRef('Operation'),
                post: ComponentRef('Operation'),
                put: ComponentRef('Operation'),
                trace: ComponentRef('Operation', { allowed: major === 3 }),
                servers: {
                    allowed: major === 3,
                    type: 'array',
                    items: ComponentRef('Server')
                },
                summary: {
                    type: 'string'
                },
            }
        }
    }
};

module.exports = Super(PathEnforcer);

function PathEnforcer(data) {


}