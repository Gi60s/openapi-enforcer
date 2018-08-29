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
const Example   = require('./example');
const Items     = require('./items');
const Schema    = require('./schema');
const v2Prop    = require('./_parameter-like').properties;

module.exports = {
    properties: {
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
        type: {
            allowed: ({major, parent}) => major === 2 && parent.value.in !== 'body',
            required: true,
            enum: ({parent}) => parent.value.in === 'formData'
                ? ['array', 'boolean', 'file', 'integer', 'number', 'string']
                : ['array', 'boolean', 'integer', 'number', 'string']
        },
        style: {
            allowed: ({ major }) => major === 3,
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
        allowEmptyValue: {
            allowed: ({parent}) => ['query', 'formData'].includes(parent.value.in),
            type: 'boolean',
            default: false
        },
        allowReserved: {
            allowed: ({parent, major}) => major === 3 && parent.value.in === 'query',
            type: 'boolean',
            default: ({parent}) => parent.value.style === 'form'
        },
        collectionFormat: {
            allowed: ({major, parent}) => major === 2 && parent.value.type === 'array',
            enum: ({parent}) => ['query', 'formData'].includes(parent.value.in)
                ? ['csv', 'ssv', 'tsv', 'pipes', 'multi']
                : ['csv', 'ssv', 'tsv', 'pipes'],
            default: 'csv'
        },
        content: {
            allowed: ({major}) => major === 3,
            additionalProperties: require('./media-type'),
            errors: ({exception, value}) => {
                const keys = Object.keys(value);
                if (keys.length !== 1) {
                    exception('Value must have exactly one key. Received: ' + keys.join(', '));
                }
            }
        },
        default: v2Prop.default,
        deprecated: {
            allowed: ({major}) => major === 3,
            type: 'boolean'
        },
        description: 'string',
        enum: v2Prop.enum,
        example: {
            allowed: ({major}) => major === 3
        },
        examples: {
            allowed: ({major}) => major === 3,
            additionalProperties: Example
        },
        exclusiveMaximum: v2Prop.exclusiveMaximum,
        exclusiveMinimum: v2Prop.exclusiveMinimum,
        explode: {
            allowed: ({major}) => major === 3,
            type: 'boolean',
            default: ({parent}) => parent.value.style === 'form',
            errors: ({exception, parent}) => {
                const type = parent.value.schema && parent.value.schema.type;
                if (parent.value.explode && (type === 'array' || type === 'object')) {
                    exception('Cookies do not support exploded values for non-primitive schemas');
                }
            }
        },
        format: v2Prop.format,
        items: Items,
        maximum: v2Prop.maximum,
        maxItems: v2Prop.maxItems,
        maxLength: v2Prop.maxLength,
        minimum: v2Prop.minimum,
        minItems: v2Prop.minItems,
        minLength: v2Prop.minLength,
        multipleOf: v2Prop.multipleOf,
        pattern: v2Prop.pattern,
        required: {
            required: ({parent}) => parent.value.in === 'path',
            type: 'boolean',
            default: ({parent}) => parent.value.in === 'path',
            enum: ({parent}) => parent.value.in === 'path' ? [true] : [true, false]
        },
        schema: Object.assign({}, Schema, {
            allowed: ({major, parent}) => major === 3 || parent.value.in === 'body'
        }),
        uniqueItems: v2Prop.uniqueItems
    },

    errors: ({ exception, major, value }) => {
        if (value.hasOwnProperty('default') && value.required) {
            exception('Cannot have a "default" and set "required" to true');
        }

        if (major === 3) {
            if (value.hasOwnProperty('content') && value.hasOwnProperty('schema')) {
                exception('Cannot have both "content" and "schema" properties');
            } else if (!value.hasOwnProperty('content') && !value.hasOwnProperty('schema')) {
                exception('Missing required property "content" or "schema"');
            }

            if (value.hasOwnProperty('example') && value.hasOwnProperty('examples')) {
                exception('Cannot have both "example" and "examples" properties');
            }
        }
    }
};

function v2Property(property) {
    const result = Object.assign({}, property);
    const allowed = property.hasOwnProperty('allowed')
        ? (typeof property.allowed === 'function' ? property.allowed : (data) => property.allowed(data))
        : () => true;
    result.allowed = data => {
        if (data.major !== 2) return false;
        return allowed(data);
    };
    return result;
}