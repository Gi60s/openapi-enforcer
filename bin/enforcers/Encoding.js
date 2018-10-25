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

const rxContentType = /^([a-z-]+)\/(\*|[a-z-]+)(?:\+([a-z-]+))?/;

module.exports = {
    init: function (data) {

    },

    prototype: {},

    validator: function (data) {
        return {
            type: 'object',
            allowed: ({ exception, key, parent }) => {
                const schema = parent && parent.parent && parent.parent.value && parent.parent.value.schema;
                return schema && schema.type === 'object' && schema.properties && schema.properties.hasOwnProperty(key)
                    ? true
                    : 'Encoding property ' + key + ' not found among schema object properties';
            },
            properties: {
                allowReserved: {
                    type: 'boolean',
                    ignore: ({ parent }) => parent.parent.parent.key !== 'application/x-www-form-urlencoded',
                    default: false
                },
                contentType: {
                    type: 'string',
                    default: ({ parent }) => {
                        const propertyName = parent.key;
                        const v = parent.parent.parent.value.schema.properties[propertyName];
                        if (v.type === 'string' && v.format === 'binary') return 'application/octet-stream';
                        if (v.type === 'object') return 'application/json';
                        if (v.type === 'array') {
                            const i = v.items;
                            if (i.type === 'string' && i.format === 'binary') return 'application/octet-stream';
                            if (i.type === 'object' || i.type === 'array') return 'application/json';
                        }
                        return 'text/plain';
                    },
                    errors: ({ exception, value }) => {
                        if (!rxContentType.test(value)) exception('Value is not a valid content-type');
                    }
                },
                headers: {
                    ignore: ({ parent }) => !parent.parent.parent.key.startsWith('multipart/'),
                    type: 'object',
                    additionalProperties: ComponentRef('Header', {
                        ignore: ({ key }) => key.toLowerCase() === 'content-type'
                    })
                },
                style: {
                    weight: -5,
                    type: 'string',
                    ignore: ({ parent }) => parent.parent.parent.key !== 'application/x-www-form-urlencoded',
                    default: 'form',
                    enum: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
                    errors: ({ exception, parent, value }) => {
                        const type = parent.parent.parent.value.schema.type;
                        if (!type || !value) return false;
                        if (parent.value.in === 'query') {
                            if ((value !== 'form') &&
                                !(value === 'spaceDelimited' && type === 'array') &&
                                !(value === 'pipeDelimited' && type === 'array') &&
                                !(value === 'deepObject' && type === 'object')) {
                                exception('Style "' + value + '" is incompatible with schema type: ' + type);
                            }
                        }
                    }
                },
                explode: {
                    type: 'boolean',
                    ignore: ({ parent }) => parent.parent.parent.key !== 'application/x-www-form-urlencoded',
                    default: ({ parent }) => parent.value.style === 'form'
                }
            }
        }
    }
};

