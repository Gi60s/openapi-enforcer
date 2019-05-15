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

const schemaProperties = ['default', 'enum', 'exclusiveMaximum', 'exclusiveMinimum', 'format', 'items',
    'maximum', 'maxItems', 'maxLength', 'minimum', 'minItems', 'minLength', 'multipleOf',
    'pattern', 'type', 'uniqueItems'];

exports.extractSchemaDefinition = extractSchemaDefinition;

exports.validator = data => {

    const { major } = data;
    const result = {
        type: 'object'
    };

    if (major === 2) {
        result.properties = {};
        Object.assign(result.properties, {
            type: {
                weight: -15,
                required: true,
                enum: ['array', 'boolean', 'integer', 'number', 'string']
            },
            collectionFormat: {
                allowed: ({ parent }) => parent.definition.type === 'array',
                enum: ['csv', 'ssv', 'tsv', 'pipes'],
                default: 'csv'
            },
            default: { allowed: true },
            description: {
                type: 'string'
            },
            enum: {
                allowed: true,
                type: 'array',
                items: { freeForm: true }
            },
            exclusiveMaximum: { allowed: true },
            exclusiveMinimum: { allowed: true },
            format: { allowed: true },
            items: {
                type: 'object',
                allowed: ({ parent }) => parent.definition.type === 'array',
                required: ({ parent }) => parent.definition.type === 'array',
                properties: result.properties,
                errors: result.errors
            },
            maximum: { allowed: true },
            maxItems: { allowed: true },
            maxLength: { allowed: true },
            minimum: { allowed: true },
            minItems: { allowed: true },
            minLength: { allowed: true },
            multipleOf: { allowed: true },
            pattern: { allowed: true },
            uniqueItems: { allowed: true }
        });

        result.errors = () => {};

    } else if (major === 3) {
        result.properties = {
            content: {
                type: 'object',
                additionalProperties: EnforcerRef('MediaType'),
                errors: ({exception, definition}) => {
                    const keys = Object.keys(definition);
                    if (keys.length !== 1) {
                        exception.message('Value must have exactly one key. Received: ' + keys.join(', '));
                    }
                }
            },
            deprecated: {
                type: 'boolean'
            },
            description: {
                type: 'string'
            },
            example: { allowed: true, freeForm: true },
            examples: {
                type: 'object',
                additionalProperties: EnforcerRef('Example')
            },
            schema: EnforcerRef('Schema')
        };

        result.errors = ({ exception, major, definition }) => {
            if (definition.hasOwnProperty('content') && definition.hasOwnProperty('schema')) {
                exception.message('Cannot have both "content" and "schema" properties');
            } else if (!definition.hasOwnProperty('content') && !definition.hasOwnProperty('schema')) {
                exception.message('Missing required property "content" or "schema"');
            }

            if (definition.hasOwnProperty('example') && definition.hasOwnProperty('examples')) {
                exception.message('Cannot have both "example" and "examples" properties');
            }
        };
    }

    return result;
};

function extractSchemaDefinition(result, definition) {
    schemaProperties.forEach(key => {
        if (definition.hasOwnProperty(key)) {
            const value = definition[key];
            switch (key) {
                case 'items':
                    result[key] = extractSchemaDefinition({}, value);
                    break;

                default:
                    result[key] = value;
                    break;
            }
        }
    });
    return result;
}
