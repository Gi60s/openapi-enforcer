/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, major 2.0 (the "License");
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
const Parameter     = require('../enforcers/parameter');

module.exports = ParameterObject;

function ParameterObject(data) {
    const Base      = require('./_parameter-base');
    const Schema    = require('./schema');

    const { major } = data;
    const base = Base(data);
    Object.assign(this, {
        component: Parameter,
        type: 'object',
        properties: Object.assign({}, base.properties, {
            name: {
                required: true,
                type: 'string'
            },
            in: {
                required: true,
                type: 'string',
                enum: ({major}) => major === 2
                    ? ['body', 'formData', 'header', 'query', 'path']
                    : ['cookie', 'header', 'path', 'query'],
            },
            required: {
                required: ({parent}) => parent.value.in === 'path',
                type: 'boolean',
                default: ({parent}) => parent.value.in === 'path',
                enum: ({parent}) => parent.value.in === 'path' ? [true] : [true, false]
            },
            allowEmptyValue: {
                allowed: ({parent}) => ['query', 'formData'].includes(parent.value.in),
                type: 'boolean',
                default: false
            },
        })
    });

    if (major === 2) {
        Object.assign(this.properties, {
            type: {
                allowed: ({major, parent}) => major === 2 && parent.value.in !== 'body',
                required: true,
                enum: ({parent}) => parent.value.in === 'formData'
                    ? ['array', 'boolean', 'file', 'integer', 'number', 'string']
                    : ['array', 'boolean', 'integer', 'number', 'string']
            },
            collectionFormat: {
                allowed: ({major, parent}) => major === 2 && parent.value.type === 'array',
                enum: ({parent}) => ['query', 'formData'].includes(parent.value.in)
                    ? ['csv', 'ssv', 'tsv', 'pipes', 'multi']
                    : ['csv', 'ssv', 'tsv', 'pipes'],
                default: 'csv'
            },
            schema: function() {
                const schema = new Schema(data);
                schema.allowed = ({major, parent}) => major === 3 || parent.value.in === 'body';
                return schema;
            }
        });

        this.errors = data => {
            const { exception, value } = data;
            if (value.hasOwnProperty('default') && value.required) {
                exception('Cannot have a "default" and set "required" to true');
            }
            base.errors(data);
        }

    } else if (major === 3) {
        Object.assign(this.properties, {
            style: {
                type: 'string',
                default: ({ parent }) => {
                    switch (parent.value.in) {
                        case 'cookie': return 'form';
                        case 'header': return 'simple';
                        case 'path': return 'simple';
                        case 'query': return 'form';
                    }
                },
                enum: ({ parent }) => {
                    switch (parent.value.in) {
                        case 'cookie': return ['form'];
                        case 'header': return ['simple'];
                        case 'path': return ['simple', 'label', 'matrix'];
                        case 'query': return ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'];
                    }
                },
                errors: ({ exception, parent }) => {
                    const style = parent.value.style;
                    const type = parent.value.schema && parent.value.schema.type;
                    if (!type || !style) return false;
                    if (parent.value.in === 'query') {
                        if ((style !== 'form') &&
                            !(style === 'spaceDelimited' && type === 'array') &&
                            !(style === 'pipeDelimited' && type === 'array') &&
                            !(style === 'deepObject' && type === 'object')) {
                            exception('Style "' + style + '" is incompatible with schema type: ' + type);
                        }
                    }
                }
            },
            explode: {
                type: 'boolean',
                default: ({parent}) => parent.value.style === 'form',
                errors: ({exception, parent}) => {
                    const type = parent.value.schema && parent.value.schema.type;
                    if (parent.value.in === 'cookie' && parent.value.explode && (type === 'array' || type === 'object')) {
                        exception('Cookies do not support exploded values for non-primitive schemas');
                    }
                }
            },
            allowReserved: {
                allowed: ({ parent }) => parent.value.in === 'query',
                type: 'boolean',
                default: false
            }
        });

        this.errors = base.errors;
    }
}