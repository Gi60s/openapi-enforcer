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
const Schema   = require('./schema');

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
module.exports = {
    properties: {
        type: {
            required: true,
            enum: ['array', 'boolean', 'integer', 'number', 'string']
        },
        collectionFormat: {
            allowed: ({ parent }) => parent.value.type === 'array',
            enum: ['csv', 'ssv', 'tsv', 'pipes'],
            default: 'csv'
        },
        default: Schema.properties.default,
        enum: Schema.properties.enum,
        exclusiveMaximum: Schema.properties.exclusiveMaximum,
        exclusiveMinimum: Schema.properties.exclusiveMinimum,
        format: Schema.properties.format,
        items: Object.assign({}, module.exports, {
            allowed: ({parent}) => parent.value.type === 'array',
            required: ({ parent }) => parent.value.type === 'array'
        }),
        maximum: Schema.properties.maximum,
        maxItems: Schema.properties.maxItems,
        maxLength: Schema.properties.maxLength,
        minimum: Schema.properties.minimum,
        minItems: Schema.properties.minItems,
        minLength: Schema.properties.minLength,
        multipleOf: Schema.properties.multipleOf,
        pattern: Schema.properties.pattern,
        uniqueItems: Schema.properties.uniqueItems
    },

    errors: Schema.errors
};