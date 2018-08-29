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
const Items     = require('./items');
const Schema    = require('./schema');

module.exports = {
    properties: {
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
        default: v2Property(Schema.properties.default),
        enum: v2Property(Schema.properties.enum),
        exclusiveMaximum: v2Property(Schema.properties.exclusiveMaximum),
        exclusiveMinimum: v2Property(Schema.properties.exclusiveMinimum),
        format: v2Property(Schema.properties.format),
        items: Items,
        maximum: v2Property(Schema.properties.maximum),
        maxItems: v2Property(Schema.properties.maxItems),
        maxLength: v2Property(Schema.properties.maxLength),
        minimum: v2Property(Schema.properties.minimum),
        minItems: v2Property(Schema.properties.minItems),
        minLength: v2Property(Schema.properties.minLength),
        multipleOf: v2Property(Schema.properties.multipleOf),
        pattern: v2Property(Schema.properties.pattern),
        uniqueItems: v2Property(Schema.properties.uniqueItems)
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