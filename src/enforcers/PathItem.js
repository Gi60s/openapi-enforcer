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
const EnforcerRef  = require('../enforcer-ref');
const util = require('../util')

const methods = util.methods()

module.exports = {
    init: function () {
        // an array of all methods used by this path
        this.methods = methods.filter(method => !!this[method]);
    },

    prototype: {},

    validator: function ({ major, options, definition: componentDefinition }) {
        const Operation = require('./Operation');
        const skipCodes = options.exceptionSkipCodes;
        const escalateCodes = options.exceptionEscalateCodes;
        return {
            type: 'object',
            properties: {
                delete: EnforcerRef('Operation'),
                description: {
                    type: 'string'
                },
                get: EnforcerRef('Operation'),
                head: EnforcerRef('Operation'),
                options: EnforcerRef('Operation'),
                parameters: {
                    weight: -1,
                    type: 'array',
                    items: EnforcerRef('Parameter'),
                    errors: Operation.parametersValidation
                },
                patch: EnforcerRef('Operation'),
                post: EnforcerRef('Operation'),
                put: EnforcerRef('Operation'),
                trace: EnforcerRef('Operation', { allowed: major === 3 }),
                servers: {
                    allowed: major === 3,
                    type: 'array',
                    items: EnforcerRef('Server')
                },
                summary: {
                    type: 'string'
                },
            },
            errors: ({ exception, definition, warn }) => {
                const length = methods.length;
                let hasMethod = false;
                for (let i = 0; i < length; i++) {
                    if (definition.hasOwnProperty(methods[i])) {
                        hasMethod = true;
                        break;
                    }
                }
                if (!hasMethod && !skipCodes.WPAT001 && !util.schemaObjectHasSkipCode(componentDefinition, 'WPAT001')) {
                    (escalateCodes.WPAT001 ? exception : warn).message('No methods defined. [WPAT001]')
                }
            }
        }
    }
};
