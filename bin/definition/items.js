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
const Schema    = require('./schema');
const v2Prop    = require('./_parameter-like').properties;

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
module.exports = {
    allowed: ({ major, parent }) => major === 2 && parent.value.type === 'array',
    required: ({ parent }) => parent.value.type === 'array',
    properties: {
        type: {
            allowed: ({ major }) => major === 2,
            required: true,
            enum: ['array', 'boolean', 'integer', 'number', 'string']
        },
        collectionFormat: {
            allowed: ({ major, parent }) => major === 2 && parent.value.type === 'array',
            enum: ['csv', 'ssv', 'tsv', 'pipes'],
            default: 'csv'
        },
        default: v2Prop.default,
        enum: v2Prop.enum,
        exclusiveMaximum: v2Prop.exclusiveMaximum,
        exclusiveMinimum: v2Prop.exclusiveMinimum,
        format: v2Prop.format,
        items: module.exports,
        maximum: v2Prop.maximum,
        maxItems: v2Prop.maxItems,
        maxLength: v2Prop.maxLength,
        minimum: v2Prop.minimum,
        minItems: v2Prop.minItems,
        minLength: v2Prop.minLength,
        multipleOf: v2Prop.multipleOf,
        pattern: v2Prop.pattern,
        uniqueItems: v2Prop.uniqueItems
    },

    errors: Schema.errors
};