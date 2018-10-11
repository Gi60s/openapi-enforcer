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
const DiscriminatorEnforcer = require('../enforcers/discriminator');
const SchemaEnforcer        = require('../enforcers/schema');
const rx                    = require('../rx');
const util                  = require('../util');
const XmlEnforcer           = require('../enforcers/xml');

module.exports = SchemaObject;

function SchemaObject() {
    const ExternalDocumentation = require('./external-documentation');

    const exclusive = {
        type: 'boolean'
    };

    const maxOrMin = {
        allowed: ({ parent }) => numericish(parent.value),
        type: ({ parent }) => dateType(parent.value) ? 'string' : 'number',
        deserialize: ({ exception, parent, value }) =>
            dateType(parent.value)
                ? deserializeDate(parent.value, exception, value)
                : value
    };

    const maxOrMinItems = {
        allowed: ({ parent }) => parent.value.type === 'array',
        type: 'number',
        errors: ({ exception, value }) => {
            if (!util.isInteger(value) || value < 0) {
                exception('Value must be a non-negative integer');
            }
        }
    };

    const maxOrMinLength = {
        allowed: ({ parent }) => parent.value.type === 'string' && !dateType(parent.value),
        type: 'number',
        errors: ({ exception, value }) => {
            if (!util.isInteger(value) || value < 0) {
                exception('Value must be a non-negative integer');
            }
        }
    };

    const maxOrMinProperties = {
        allowed: ({ parent }) => parent.value.type === 'object',
        type: 'number',
        errors: ({ exception, value }) => {
            if (!util.isInteger(value) || value < 0) {
                exception('Value must be a non-negative integer');
            }
        }
    };

    Object.assign(this, {
        useComponent: ({ value }) => value && typeof value === 'object',
        component: SchemaEnforcer,
        type: 'object',
        properties: {
            type: {
                type: 'string',
                required: ({ parent }) => {
                    const v = parent.value;
                    return !v.hasOwnProperty('allOf') && !v.hasOwnProperty('anyOf') &&
                        !v.hasOwnProperty('not') && !v.hasOwnProperty('oneOf');
                },
                enum: ['array', 'boolean', 'integer', 'number', 'object', 'string']
            },
            additionalProperties: function (data) {
                const schema = new SchemaObject(data);
                schema.allowed = ({parent}) => parent.value.type === 'object';
                schema.type = ['boolean', 'object'];
                schema.default = true;
                return schema;
            },
            allOf: {
                type: 'array',
                items: SchemaObject
            },
            anyOf: {
                allowed: ({major}) => major === 3,
                type: 'array',
                items: SchemaObject
            },
            default: {
                type: ({ parent }) => parent.value.type,
                deserialize: ({ exception, parent, value }) =>
                    deserializeDate(parent.value, exception, value)
            },
            deprecated: {
                allowed: ({major}) => major === 3,
                type: 'boolean',
                default: false
            },
            description: {
                type: 'string'
            },
            discriminator: {
                component: DiscriminatorEnforcer,
                allowed: ({ parent }) => parent && parent.validator instanceof SchemaObject && parent.validator.type === 'object',
                type: ({ major }) => major === 2 ? 'string' : 'object',
                properties: {
                    propertyName: {
                        type: 'string',
                        required: true
                    },
                    mapping: {
                        type: 'object',
                        additionalProperties: {
                            type: 'string'
                        }
                    }
                },
                errors: ({ exception, major, parent, value }) => {
                    if (major === 2) {
                        if (!parent.value.required || !parent.value.required.includes(value)) {
                            exception('Value "' + value + '" must be found in the parent\'s required properties list.');
                        }
                        if (!parent.value.properties || !parent.value.properties.hasOwnProperty(value)) {
                            exception('Value "' + value + '" must be found in the parent\'s properties definition.');
                        }

                    } else if (major === 3) {
                        if (!parent.value.required || !parent.value.required.includes(value.propertyName)) {
                            exception('Value "' + value.propertyName + '" must be found in the parent\'s required properties list.');
                        }
                        if (!parent.value.properties || !parent.value.properties.hasOwnProperty(value.propertyName)) {
                            exception('Value "' + value.propertyName + '" must be found in the parent\'s properties definition.');
                        }
                    }
                }
            },
            enum: {
                type: 'array',
                items: {
                    allowed: ({ parent }) => !!(parent && parent.parent),
                    type: ({ parent }) => parent.parent.value.type,
                    deserialize: ({ exception, parent, value }) => {
                        return deserializeDate(parent.parent.value, exception, value);
                    }
                }
            },
            example: {
                allowed: true
            },
            exclusiveMaximum: exclusive,
            exclusiveMinimum: exclusive,
            externalDocs: ExternalDocumentation,
            format: {
                allowed: ({ parent }) => ['integer', 'number', 'string'].includes(parent.value.type),
                type: 'string',
                errors: ({ exception, parent, warn }) => {
                    const format = parent.value.format;
                    if (format) {
                        const enums = [];
                        switch (parent.value.type) {
                            case 'integer': enums.push('int32', 'int64'); break;
                            case 'number': enums.push('float', 'double'); break;
                            case 'string': enums.push('binary', 'byte', 'date', 'date-time', 'password');
                        }
                        if (!enums.includes(format)) warn('Non standard format used: ' + format);
                    }
                }
            },
            items: function (data) {
                const schema = new SchemaObject(data);
                schema.allowed = ({parent}) => parent.value.type === 'array';
                schema.required = ({ parent }) => parent.value.type === 'array';
                return schema;
            },
            maximum: maxOrMin,
            maxItems: maxOrMinItems,
            maxLength: maxOrMinLength,
            maxProperties: maxOrMinProperties,
            minimum: maxOrMin,
            minItems: maxOrMinItems,
            minLength: maxOrMinLength,
            minProperties: maxOrMinProperties,
            multipleOf: {
                allowed: ({ parent }) => ['integer', 'number'].includes(parent.value.type),
                type: 'number'
            },
            not: function (data) {
                const schema = new SchemaObject(data);
                schema.allowed = ({major}) => major === 3;
                return schema;
            },
            nullable: {
                allowed: ({major}) => major === 3,
                type: 'boolean',
                default: false
            },
            oneOf: {
                allowed: ({major}) => major === 3,
                type: 'array',
                items: SchemaObject
            },
            pattern: {
                allowed: ({ parent }) => parent.value.type === 'string',
                type: 'string',
                errors: ({ exception, value }) => {
                    if (!value) exception('Value must be a non-empty string');
                },
                deserialize: ({ value }) => util.rxStringToRx(value)
            },
            properties: {
                allowed: ({parent}) => parent.value.type === 'object',
                type: 'object',
                additionalProperties: SchemaObject
            },
            readOnly: {
                allowed: isSchemaProperty,
                type: 'boolean',
                default: false,
                errors: ({ major, parent, value }) => {
                    if (major === 2 && value && parent && parent.parent && parent.parent.parent && parent.parent.parent.value.required && parent.parent.parent.value.required.includes(parent.key)) {
                        parent.warn('Property should not be marked as both read only and required');
                    }
                }
            },
            required: {
                allowed: ({parent}) => parent.value.type === 'object',
                type: 'array',
                items: 'string'
            },
            title: 'string',
            uniqueItems: {
                allowed: ({parent}) => parent.value.type === 'array',
                type: 'boolean'
            },
            writeOnly: {
                allowed: (data) => data.major === 3 && !!isSchemaProperty(data),
                type: 'boolean',
                default: false
            },
            xml: {
                component: XmlEnforcer,
                type: 'object',
                properties: {
                    name: 'string',
                    namespace: 'string',
                    prefix: 'string',
                    attribute: 'boolean',
                    wrapped: 'boolean'
                }
            }
        },

        errors: (data) => {
            const { exception, value } = data;

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

            if (value.hasOwnProperty('properties')) {
                Object.keys(value.properties).forEach(key => {
                    const v = value.properties[key];
                    if (v.readOnly && v.writeOnly) {
                        exception.at('properties').at(key)('Cannot be marked as both readOnly and writeOnly');
                    }
                });
            }

            if (value.hasOwnProperty('default') && value.enum) {
                const index = value.enum.findIndex(v => util.same(v, value.default));
                if (index === -1) exception('Default value does not meet enum requirements');
            }

            // validate that zero or one composite has been defined
            const composites = [];
            ['allOf', 'anyOf', 'oneOf', 'not'].forEach(composite => {
                if (value.hasOwnProperty(composite)) composites.push(composite);
            });
            if (composites.length > 1) {
                exception('Cannot have multiple composites: ' + composites.join(', '));
            }
        }
    });
}

function dateType(definition) {
    return definition.type === 'string' && definition.format && definition.format.startsWith('date')
}

function deserializeDate(definition, exception, value) {
    if (dateType(definition)) {
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
}

function isSchemaProperty({ parent }) {
    return parent && parent.parent && parent.parent.key === 'properties' &&
        parent.parent.parent && parent.parent.parent.validator instanceof SchemaObject;
}

function minMaxValid(minimum, maximum, exclusiveMinimum, exclusiveMaximum) {
    if (minimum === undefined || maximum === undefined) return true;
    minimum = +minimum;
    maximum = +maximum;
    return minimum < maximum || (!exclusiveMinimum && !exclusiveMaximum && minimum === maximum);
}

function numericish(definitiion) {
    return ['number', 'integer'].includes(definitiion.type) || dateType(definitiion);
}