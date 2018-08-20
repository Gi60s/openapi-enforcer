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

const maxOrMin = {
    allowed: ({ numericish }) => numericish,
    type: ({dateType}) => dateType ? 'string' : 'number',
    errors: ({ dateType, definition, exception, value }) => {
        if (dateType && !rx[definition.format].test(value)) exception('Value not formatted as a ' + definition.format);
    },
    deserialize: ({ dateType, deserializeDate, exception, value }) => dateType ? deserializeDate(exception, value) : value
};

const maxOrMinItems = {
    allowed: ({definition}) => definition.type === 'array',
    type: 'number',
    errors: ({ exception, integer, nonNegative }) => {
        if (!nonNegative || !integer) exception('Value must be a non-negative integer');
    }
};

const maxOrMinLength = {
    allowed: ({dateType, definition}) => definition.type === 'string' && !dateType,
    type: 'number',
    errors: ({ exception, integer, nonNegative }) => {
        if (!nonNegative || !integer) exception('Value must be a non-negative integer');
    }
};

const maxOrMinProperties = {
    allowed: ({definition}) => definition.type === 'object',
    type: 'number',
    errors: ({ exception, integer, nonNegative }) => {
        if (!nonNegative || !integer) exception('Value must be a non-negative integer');
    }
};

const Schema = {};
module.exports = Schema;

Object.assign(Schema, {
    type: {
        type: 'string',
        required: true,
        enum: ['array', 'boolean', 'integer', 'number', 'object', 'string']
    },
    format: {
        allowed: ({ definition }) => ['integer', 'number', 'string'].includes(definition.type),
        type: 'string',
        enum: ({ definition }) => {
            switch (definition.type) {
                case 'integer': return ['int32', 'int64'];
                case 'number': return ['float', 'double'];
                case 'string': return ['binary', 'byte', 'date', 'date-time', 'password'];
            }
        }
    },
    title: 'string',
    description: 'string',
    default: {
        deserialize: ({ dateType, definition, deserializeDate, exception, value }) => {
            return dateType ? deserializeDate(exception, value) : value;
        }
    },
    multipleOf: {
        allowed: ({ definition }) => {
            return ['integer', 'number'].includes(definition.type)
        },
        type: 'number'
    },
    maximum: maxOrMin,
    exclusiveMaximum: exclusive,
    minimum: maxOrMin,
    exclusiveMinimum: exclusive,
    maxLength: maxOrMinLength,
    minLength: maxOrMinLength,
    pattern: {
        allowed: ({ definition }) => definition.type === 'string',
        type: 'string',
        errors: ({ exception, value }) => {
            if (!value) exception('Value must be a non-empty string');
        },
        deserialize: ({ value }) => util.rxStringToRx(value)
    },
    maxItems: maxOrMinItems,
    minItems: maxOrMinItems,
    uniqueItems: {
        allowed: ({definition}) => definition.type === 'array',
        type: 'boolean'
    },
    maxProperties: maxOrMinProperties,
    minProperties: maxOrMinProperties,
    required: {
        allowed: ({definition}) => definition.type === 'object',
        items: 'string'
    },
    enum: {
        items: {
            type: ({ definition }) => definition.type
        },
        errors: ({ dateType, definition, exception, value }) => {
            // TODO: what about other types: arrays, numbers, etc
            if (dateType) {
                value.forEach((v, i) => {
                    if (!rx[definition.format].test(v)) exception.at(i)('Value not formatted as a ' + definition.format);
                });
            }
        },
        // TODO: what about other types: arrays, numbers, etc
        deserialize: ({ dateType, definition, deserializeDate, exception, value }) => dateType
            ? value.map((v, i) => deserializeDate(exception.at(i), v))
            : value
    },
    items: {
        allowed: ({definition}) => definition.type === 'array',
        additionalProperties: Schema
    },
    allOf: {
        allowed: ({definition}) => definition.type === 'object',
        items: Schema
    },
    properties: {
        allowed: ({definition}) => definition.type === 'object',
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
    },

    __enforcer_definition_post_validate: ({ definition, exception, minMaxValid }) => {

        if (!minMaxValid(definition.minItems, definition.maxItems)) {
            exception('Property "minItems" must be less than or equal to "maxItems"');
        }

        if (!minMaxValid(definition.minLength, definition.maxLength)) {
            exception('Property "minLength" must be less than or equal to "maxLength"');
        }

        if (!minMaxValid(definition.minProperties, definition.maxProperties)) {
            exception('Property "minProperties" must be less than or equal to "maxProperties"');
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
});