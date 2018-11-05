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
const EnforcerRef       = require('./enforcer-ref');

module.exports = data => {
    const Schema = require('./enforcers/Schema');

    const { major } = data;
    const result = {
        type: 'object'
    };
    const schema = Schema.validator(data);

    if (major === 2) {
        result.properties = {};
        Object.assign(result.properties, {
            type: {
                weight: -15,
                required: true,
                enum: ['array', 'boolean', 'integer', 'number', 'string']
            },
            collectionFormat: {
                allowed: ({ parent }) => parent.value.type === 'array',
                enum: ['csv', 'ssv', 'tsv', 'pipes'],
                default: 'csv'
            },
            default: schema.properties.default,
            enum: schema.properties.enum,
            exclusiveMaximum: schema.properties.exclusiveMaximum,
            exclusiveMinimum: schema.properties.exclusiveMinimum,
            format: schema.properties.format,
            items: {
                component: ItemsEnforcer,
                type: 'object',
                allowed: ({ parent }) => parent.value.type === 'array',
                required: ({ parent }) => parent.value.type === 'array',
                properties: result.properties,
                errors: result.errors
            },
            maximum: schema.properties.maximum,
            maxItems: schema.properties.maxItems,
            maxLength: schema.properties.maxLength,
            minimum: schema.properties.minimum,
            minItems: schema.properties.minItems,
            minLength: schema.properties.minLength,
            multipleOf: schema.properties.multipleOf,
            pattern: schema.properties.pattern,
            uniqueItems: schema.properties.uniqueItems
        });
        result.errors = schema.errors;

    } else if (major === 3) {
        result.properties = {
            content: {
                type: 'object',
                additionalProperties: EnforcerRef('MediaType'),
                errors: ({exception, value}) => {
                    const keys = Object.keys(value);
                    if (keys.length !== 1) {
                        exception('Value must have exactly one key. Received: ' + keys.join(', '));
                    }
                }
            },
            deprecated: {
                type: 'boolean'
            },
            description: {
                type: 'string'
            },
            example: {},
            examples: {
                type: 'object',
                additionalProperties: EnforcerRef('Example')
            },
            schema: EnforcerRef('Schema')
        };

        result.errors = ({ exception, major, definition }) => {
            if (definition.hasOwnProperty('content') && definition.hasOwnProperty('schema')) {
                exception('Cannot have both "content" and "schema" properties');
            } else if (!definition.hasOwnProperty('content') && !definition.hasOwnProperty('schema')) {
                exception('Missing required property "content" or "schema"');
            }

            if (definition.hasOwnProperty('example') && definition.hasOwnProperty('examples')) {
                exception('Cannot have both "example" and "examples" properties');
            }
        };
    }

    return result;
};