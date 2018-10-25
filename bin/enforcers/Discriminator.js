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

const rxHttp = /^https?:\/\//;

module.exports = {
    init: function (data) {

    },

    prototype: {
        getSchema: function (value) {
            // TODO
        }
    },

    validator: function () {
        return {
            allowed: ({ parent }) => {
                return parent && parent.validator instanceof SchemaObject && parent.validator.type === 'object';  // TODO: there is no more SchemaObject
            },
            type: ({ major }) => major === 2 ? 'string' : 'object',
            properties: {
                propertyName: {
                    type: 'string',
                    required: true
                },
                mapping: {
                    type: 'object',
                    additionalProperties: {
                        type: 'string',
                        errors: ({ exception, refParser, value }) => {
                            if (refParser) {
                                try {
                                    const ref = rxHttp.test(value) || value.indexOf('/') !== -1
                                        ? value
                                        : '#/components/schemas/' + value;
                                    refParser.$refs.get(ref)
                                } catch (err) {
                                    exception('Reference cannot be resolved: ' + value);
                                }
                            }
                        }
                    }
                }
            },
            errors: ({ exception, major, parent, value }) => {
                if (major === 2) {
                    if (!parent.value.required || !parent.value.required.includes(value)) {
                        exception('Value "' + value + '" must be found in the parent\'s required properties list.');
                    }
                    if (!parent.value.properties || !parent.value.properties.hasOwnProperty(value)) {
                        exception('Value "' + value + '" must be found in the parent\'s properties definition.');
                    }

                } else if (major === 3 && value.hasOwnProperty('propertyName')) {
                    if (!parent.value.required || !parent.value.required.includes(value.propertyName)) {
                        exception('Value "' + value.propertyName + '" must be found in the parent\'s required properties list.');
                    }
                    if (!parent.value.properties || !parent.value.properties.hasOwnProperty(value.propertyName)) {
                        exception('Value "' + value.propertyName + '" must be found in the parent\'s properties definition.');
                    }
                }
            }
        }
    }
};
