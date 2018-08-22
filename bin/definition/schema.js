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

    errors: ({ value, exception }) => {

        if (!Schema.helpers.minMaxValid(value.minItems, value.maxItems)) {
            exception('Property "minItems" must be less than or equal to "maxItems"');
        }

        if (!Schema.helpers.minMaxValid(value.minLength, value.maxLength)) {
            exception('Property "minLength" must be less than or equal to "maxLength"');
        }

        if (!Schema.helpers.minMaxValid(value.minProperties, value.maxProperties)) {
            exception('Property "minProperties" must be less than or equal to "maxProperties"');
        }

        if (!Schema.helpers.minMaxValid(value.minimum, value.maximum, value.exclusiveMinimum, value.exclusiveMaximum)) {
            const msg = value.exclusiveMinimum || value.exclusiveMaximum ? '' : 'or equal to ';
            exception('Property "minimum" must be less than ' + msg + '"maximum"');
        }

        if (value.hasOwnProperty('default') && value.enum) {
            const index = value.enum.findIndex(v => util.same(v, value.default));
            if (index === -1) exception('Default value does not meet enum requirements');
        }

    },

    helpers: {

        exclusive: {
            type: 'boolean'
        },

        maxOrMin: {
            allowed: ({ parent }) => Schema.helpers.numericish(parent.value),
            type: ({ parent }) => Schema.helpers.dateType(parent.value) ? 'string' : 'number',
            deserialize: ({ exception, parent, value }) =>
                Schema.helpers.dateType(parent.value)
                ? Schema.helpers.deserializeDate(parent.value, exception, value)
                : value
        },

        maxOrMinItems: {
            allowed: ({ parent }) => parent.value.type === 'array',
            type: 'number',
            errors: ({ exception, value }) => {
                if (!util.isInteger(value) || value < 0) {
                    exception('Value must be a non-negative integer');
                }
            }
        },

        maxOrMinLength: {
            allowed: ({ parent }) => parent.value.type === 'string' && !Schema.helpers.dateType(parent.value),
            type: 'number',
            errors: ({ exception, value }) => {
                if (!util.isInteger(value) || value < 0) {
                    exception('Value must be a non-negative integer');
                }
            }
        },

        maxOrMinProperties: {
            allowed: ({ parent }) => parent.value.type === 'object',
            type: 'number',
            errors: ({ exception, value }) => {
                if (!util.isInteger(value) || value < 0) {
                    exception('Value must be a non-negative integer');
                }
            }
        },

        dateType: function(definition) {
            return definition.type === 'string' && definition.format && definition.format.startsWith('date')
        },

        deserializeDate: function (definition, exception, value) {
            if (Schema.helpers.dateType(definition)) {
                if (!rx[definition.format].test(value)) {
                    exception('Value must be formatted as a ' + definition.format);
                    return value;
                } else {
                    const date = util.getDateFromValidDateString(definition.format, value);
                    if (!date) exception('Value is not a valid ' + definition.format);
                    return date;
                }
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
        allowed: ({ parent }) => ['integer', 'number', 'string'].includes(parent.value.type),
        type: 'string',
        enum: ({ parent }) => {
            switch (parent.value.type) {
                case 'integer': return ['int32', 'int64'];
                case 'number': return ['float', 'double'];
                case 'string': return ['binary', 'byte', 'date', 'date-time', 'password'];
            }
        }
    },
    title: 'string',
    description: 'string',
    default: {
        deserialize: ({ exception, parent, value }) =>
            Schema.helpers.deserializeDate(parent.value, exception, value)
    },
    multipleOf: {
        allowed: ({ parent }) => ['integer', 'number'].includes(parent.value.type),
        type: 'number'
    },
    maximum: Schema.helpers.maxOrMin,
    exclusiveMaximum: Schema.helpers.exclusive,
    minimum: Schema.helpers.maxOrMin,
    exclusiveMinimum: Schema.helpers.exclusive,
    maxLength: Schema.helpers.maxOrMinLength,
    minLength: Schema.helpers.maxOrMinLength,
    pattern: {
        allowed: ({ parent }) => parent.value.type === 'string',
        type: 'string',
        errors: ({ exception, value }) => {
            if (!value) exception('Value must be a non-empty string');
        },
        deserialize: ({ value }) => util.rxStringToRx(value)
    },
    maxItems: Schema.helpers.maxOrMinItems,
    minItems: Schema.helpers.maxOrMinItems,
    uniqueItems: {
        allowed: ({parent}) => parent.value.type === 'array',
        type: 'boolean'
    },
    maxProperties: Schema.helpers.maxOrMinProperties,
    minProperties: Schema.helpers.maxOrMinProperties,
    required: {
        allowed: ({parent}) => parent.value.type === 'object',
        items: 'string'
    },
    enum: {
        items: {
            type: ({ parent }) => parent.parent.value.type,
            deserialize: ({ exception, parent, value }) => {
                return Schema.helpers.deserializeDate(parent.parent.value, exception, value);
            },
            errors: ({ exception, parent, value }) => {
                // TODO: check for max, min, etc
            }
        }
    },
    items: {
        allowed: ({parent}) => parent.value.type === 'array',
        additionalProperties: Schema
    },
    allOf: {
        allowed: ({parent}) => parent.value.type === 'object',
        items: Schema
    },
    properties: {
        allowed: ({parent}) => parent.value.type === 'object',
        additionalProperties: Schema
    },
    additionalProperties: {
        allowed: ({parent}) => parent.value.type === 'object',
        properties: Schema
    },
    discriminator: {
        allowed: ({ parent }) => parent && parent.validator === Schema && parent.type === 'object',
        type: 'string',
        error: ({ exception, major, parent, value }) => {
            if (major === 2) {
                if (!parent.value.required || !parent.value.required.includes(value)) {
                    exception('Value must be found in the parent\'s required properties list.');
                }
                if (!parent.value.properties || !parent.value.properties.hasOwnProperty(value)) {
                    exception('Value must be found in the parent\'s properties definition.');
                }
            }

        }
    },
    readOnly: {
        allowed: ({ parent }) => parent && parent.validator === Schema && parent.value.type === 'object',
        type: 'boolean',
        default: false,
        error: ({ parent, value, warn }) => {
            if (parent && parent.value.required && parent.required.includes(value)) {
                warn('Value should not be exist in the parent\'s required properties list.');
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