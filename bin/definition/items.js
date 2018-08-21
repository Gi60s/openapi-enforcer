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
const rx    = require('../rx');
const util  = require('../util');

const exclusive = {
    allowed: ({definition, major, numericish }) => major === 2 && numericish,
    type: 'boolean'
};

const maxOrMin = {
    allowed: ({definition, major, numericish }) => major === 2 && numericish,
    type: ({definition}) => definition.type === 'string' && definition.format.startsWith('date') ? 'string' : 'number',
    errors: ({ dateType, definition, exception, value }) => {
        if (dateType && !rx[definition.format].test(value)) exception('Value not formatted as a ' + definition.format);
    },
    deserialize: ({ dateType, deserializeDate, exception, value }) => dateType ? deserializeDate(exception, value) : value
};

const maxOrMinItems = {
    allowed: ({definition, major}) => major === 2 && definition.type === 'array',
    type: 'number',
    errors: ({ exception, integer, nonNegative }) => {
        if (!nonNegative || !integer) exception('Value must be a non-negative integer');
    }
};

const maxOrMinLength = {
    allowed: ({dateType, definition, major}) => major === 2 && ((definition.type === 'string' && !dateType) || definition.type === 'file'),
    type: 'number',
    errors: ({ exception, integer, nonNegative }) => {
        if (!nonNegative || !integer) exception('Value must be a non-negative integer');
    }
};

module.exports = {
    properties: {
        type: {
            allowed: ({definition, major}) => major === 2 && definition.in !== 'body',
            required: true,
            enum: ['array', 'boolean', 'integer', 'number', 'string']
        },
        format: {
            allowed: ({definition, major}) => major === 2 && (definition.type === 'integer' || definition.type === 'number' || definition.type === 'string'),
            enum: ({definition}) => {
                if (definition.type === 'integer') return ['int32', 'int64'];
                if (definition.type === 'number') return ['float', 'double'];
                return ['binary', 'byte', 'date', 'date-time', 'password'];
            }
        },
        items: {
            allowed: ({major}) => major === 2,
            required: ({definition}) => definition.type === 'array',
        },
        collectionFormat: {
            allowed: ({definition, major}) => major === 2 && definition.type === 'array',
            enum: ['csv', 'ssv', 'tsv', 'pipes'],
            default: 'csv'
        },
        default: {
            allowed: ({major}) => major === 2,
            deserialize: ({definition, deserializeDate, exception, value}) => deserializeDate(exception, value)
        },
        maximum: maxOrMin,
        exclusiveMaximum: exclusive,
        minimum: maxOrMin,
        exclusiveMinimum: exclusive,
        maxLength: maxOrMinLength,
        minLength: maxOrMinLength,
        pattern: {
            allowed: ({definition, major}) => major === 2 && definition.type === 'string',
            type: 'string',
            errors: ({exception, value}) => {
                if (!value) exception('Value must be a non-empty string');
            },
            deserialize: ({value}) => util.rxStringToRx(value)
        },
        maxItems: maxOrMinItems,
        minItems: maxOrMinItems,
        uniqueItems: {
            allowed: ({definition, major}) => major === 2 && definition.type === 'array',
            type: 'boolean'
        },
        enum: {
            allowed: ({major}) => major === 2,
            isArray: true,
            errors: ({dateType, definition, exception, value}) => {
                // TODO: what about other types: arrays, numbers, etc
                if (dateType) {
                    value.forEach((v, i) => {
                        if (!rx[definition.format].test(v)) exception.at(i)('Value not formatted as a ' + definition.format);
                    });
                }
            },

            // TODO: what about other types: arrays, numbers, etc
            deserialize: ({dateType, definition, deserializeDate, exception, value}) => dateType
                ? value.map((v, i) => deserializeDate(exception.at(i), v))
                : value
        },
        multipleOf: {
            allowed: ({definition, major}) => major === 2 && (definition.type === 'number' || definition.type === 'integer'),
            type: 'number'
        }
    },

    errors: ({ definition, exception, minMaxValid }) => {

        if (definition.required && definition.hasOwnProperty('default')) {
            exception('Cannot have both "default" and "required"');
        }

        if (!minMaxValid(definition.minItems, definition.maxItems)) {
            exception('Property "minItems" must be less than or equal to "maxItems"');
        }

        if (!minMaxValid(definition.minLength, definition.maxLength)) {
            exception('Property "minLength" must be less than or equal to "maxLength"');
        }

        if (!minMaxValid(definition.minimum, definition.maximum, definition.exclusiveMinimum, definition.exclusiveMaximum)) {
            const msg = definition.exclusiveMinimum || definition.exclusiveMaximum ? '' : 'or equal to ';
            exception('Property "minimum" must be less than ' + msg + '"maximum"');
        }

        if (definition.hasOwnProperty('default') && definition.enum) {
            const index = definition.enum.findIndex(v => util.same(v, value));
            if (index === -1) exception('Default value does not meed enum requirements');
        }

    }
};