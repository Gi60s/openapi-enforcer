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
const ExternalDocumentation = require('./external-documentation');
const rx                    = require('../rx');
const util                  = require('../util');

const exclusive = {
    allowed: ({ numericish }) => numericish,
    type: 'boolean'
};

const Schema = {
    properties: {},

    errors: ({ value, exception, minMaxValid }) => {

        if (!minMaxValid(value.minItems, value.maxItems)) {
            exception('Property "minItems" must be less than or equal to "maxItems"');
        }

        if (!minMaxValid(value.minLength, value.maxLength)) {
            exception('Property "minLength" must be less than or equal to "maxLength"');
        }

        if (!minMaxValid(value.minProperties, value.maxProperties)) {
            exception('Property "minProperties" must be less than or equal to "maxProperties"');
        }

        if (!minMaxValid(value.minimum, value.maximum, value.exclusiveMinimum, value.exclusiveMaximum)) {
            const msg = value.exclusiveMinimum || value.exclusiveMaximum ? '' : 'or equal to ';
            exception('Property "minimum" must be less than ' + msg + '"maximum"');
        }

        if (value.hasOwnProperty('default') && value.enum) {
            const index = value.enum.findIndex(v => util.same(v, value));
            if (index === -1) exception('Default value does not meed enum requirements');
        }

    },

    helpers: {

        maxOrMin: {
            allowed: ({ numericish }) => numericish,
            type: ({dateType}) => dateType ? 'string' : 'number',
            errors: ({ dateType, value, exception }) => {
                if (dateType && !rx[value.format].test(value)) exception('Value not formatted as a ' + value.format);
            },
            deserialize: ({ dateType, deserializeDate, exception, value }) => dateType ? deserializeDate(exception, value) : value
        },

        maxOrMinItems: {
            allowed: ({value}) => value.type === 'array',
            type: 'number',
            errors: ({ exception, integer, nonNegative }) => {
                if (!nonNegative || !integer) exception('Value must be a non-negative integer');
            }
        },

        maxOrMinLength: {
            allowed: ({dateType, value}) => value.type === 'string' && !dateType,
            type: 'number',
            errors: ({ exception, integer, nonNegative }) => {
                if (!nonNegative || !integer) exception('Value must be a non-negative integer');
            }
        },

        maxOrMinProperties: {
            allowed: ({value}) => value.type === 'object',
            type: 'number',
            errors: ({ exception, integer, nonNegative }) => {
                if (!nonNegative || !integer) exception('Value must be a non-negative integer');
            }
        },

        dateType: function(definition) {
            return definition.type === 'string' && definition.format && definition.format.startsWith('date')
        },

        deserializeDate: function (definition, exception, value) {
            if (definition.type === 'string') {
                const date = util.getDateFromValidDateString(definition.format, value);
                if (!date) exception('Value is not a valid ' + definition.format);
                return date;
            } else {
                return value;
            }
        },

        minMaxValid: function(minimum, maximum, exclusiveMinimum, exclusiveMaximum) {
            if (minimum === undefined || maximum === undefined) return true;
            minimum = +minimum;
            maximum = +maximum;
            return minimum < maximum || (!exclusiveMinimum && !exclusiveMaximum && minimum === maximum);
        },

        numericish: function(definitiion) {
            return ['number', 'integer'].includes(definitiion.type) || this.dateType(definitiion);
        }
    }
};
module.exports = Schema;

Object.assign(Schema.properties, {
    type: {
        type: 'string',
        required: true,
        enum: ['array', 'boolean', 'integer', 'number', 'object', 'string']
    },
    format: {
        allowed: ({ value }) => ['integer', 'number', 'string'].includes(value.type),
        type: 'string',
        enum: ({ value }) => {
            switch (value.type) {
                case 'integer': return ['int32', 'int64'];
                case 'number': return ['float', 'double'];
                case 'string': return ['binary', 'byte', 'date', 'date-time', 'password'];
            }
        }
    },
    title: 'string',
    description: 'string',
    default: {
        deserialize: ({ dateType, value, deserializeDate, exception, value }) => {
            return dateType ? deserializeDate(exception, value) : value;
        }
    },
    multipleOf: {
        allowed: ({ value }) => {
            return ['integer', 'number'].includes(value.type)
        },
        type: 'number'
    },
    maximum: Schema.helpers.maxOrMin,
    exclusiveMaximum: Schema.helpers.exclusive,
    minimum: Schema.helpers.maxOrMin,
    exclusiveMinimum: Schema.helpers.exclusive,
    maxLength: Schema.helpers.maxOrMinLength,
    minLength: Schema.helpers.maxOrMinLength,
    pattern: {
        allowed: ({ value }) => value.type === 'string',
        type: 'string',
        errors: ({ exception, value }) => {
            if (!value) exception('Value must be a non-empty string');
        },
        deserialize: ({ value }) => util.rxStringToRx(value)
    },
    maxItems: Schema.helpers.maxOrMinItems,
    minItems: Schema.helpers.maxOrMinItems,
    uniqueItems: {
        allowed: ({value}) => value.type === 'array',
        type: 'boolean'
    },
    maxProperties: Schema.helpers.maxOrMinProperties,
    minProperties: Schema.helpers.maxOrMinProperties,
    required: {
        allowed: ({value}) => value.type === 'object',
        items: 'string'
    },
    enum: {
        items: {
            type: ({ value }) => value.type
        },
        errors: ({ dateType, value, exception, value }) => {
            // TODO: what about other types: arrays, numbers, etc
            if (dateType) {
                value.forEach((v, i) => {
                    if (!rx[value.format].test(v)) exception.at(i)('Value not formatted as a ' + value.format);
                });
            }
        },
        // TODO: what about other types: arrays, numbers, etc
        deserialize: ({ dateType, value, deserializeDate, exception, value }) => dateType
            ? value.map((v, i) => deserializeDate(exception.at(i), v))
            : value
    },
    items: {
        allowed: ({value}) => value.type === 'array',
        additionalProperties: Schema
    },
    allOf: {
        allowed: ({value}) => value.type === 'object',
        items: Schema
    },
    properties: {
        allowed: ({value}) => value.type === 'object',
        additionalProperties: Schema
    },
    additionalProperties: {
        properties: Schema
    },
    discriminator: {
        allowed: ({ parent }) => parent && parent.validator === Schema && parent.type === 'object',
        type: 'string',
        error: ({ exception, major, parent, value }) => {
            if (major === 2 && (!parent.required || !parent.required.includes(value))) {
                exception('Value must be found in the parent\'s required properties list.');
            }
        }
    },
    readOnly: {
        allowed: ({ parent }) => parent && parent.validator === Schema && parent.type === 'object',
        type: 'boolean',
        default: false,
        error: ({ exception, parent, value }) => {
            if (parent && parent.required && parent.required.includes(value)) {
                exception('Value should not be exist in the parent\'s required properties list.');
            }
        }
    },
    xml: {
        properties: {
            name: 'string',
            namespace: 'string',
            prefix: 'string',
            attribute: 'boolean',
            wrapped: 'boolean'
        }
    },
    externalDocs: ExternalDocumentation,
    example: {
        allowed: true
    }
});