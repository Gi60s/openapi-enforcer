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
const BinaryByte    = require('../data-types/binary-byte');
const EnforcerRef  = require('../enforcer-ref');
const Exception     = require('../exception');
const Result        = require('../result');
const util          = require('../util');
const Value         = require('../../value');

const store = new WeakMap();
const globalDataTypeFormats = {   // global types can be overwritten by local types
    boolean: {},
    integer: {},
    number: {},
    string: {
        binary: BinaryByte.binary,
        byte: BinaryByte.byte,
        date: require('../data-types/date'),
        'date-time': require('../data-types/date-time')
    }
};

module.exports = {
    init: function ({ exception, definition, warn }) {
        // validate the default value
        if (definition.hasOwnProperty('default')) {
            const error = this.validate(definition.default);
            if (error) exception.at('default')(error);
        }

        // validate enum values
        if (definition.hasOwnProperty('enum')) {
            definition.enum.forEach((value, index) => {
                const error = this.validate(value);
                if (error) exception.at('enum').at(index)(error);
            })
        }

        // validate the example
        if (definition.hasOwnProperty('example')) {
            const error = this.validate(definition.example);
            if (error) warn.at('example')(error);
        }

        // define and store data type formats
        const dataTypeFormats = {
            types: {},
            deserialize: (exception, value) => callDataTypeFormatFunction('deserialize', this, exception, value),
            serialize: (exception, value) => callDataTypeFormatFunction('serialize', this, exception, value),
            validate: (exception, value) => callDataTypeFormatFunction('validate', this, exception, value)
        };
        store.set(this, { dataTypeFormats });

        // merge global data types into (currently empty) data types object
        Object.keys(globalDataTypeFormats).forEach(key => {
            dataTypeFormats.types[key] = Object.assign({}, globalDataTypeFormats[key]);
        });
    },

    prototype: {
        // Plugins can define data type formats
        defineDataType: function (type, format, definition) {
            const types = store.get(this).dataTypeFormats.types;

            // validate input parameters
            if (!types.hasOwnProperty(type)) throw Error('Invalid type specified. Must be one of: ' + Object.keys(types).join(', '));
            if (!format || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string');
            if (types[type].hasOwnProperty(format)) throw Error('Format "' + format + '" is already defined for type ' + type);
            if (!definition || typeof definition !== 'object' ||
                typeof definition.deserialize !== 'function' ||
                typeof definition.serialize !== 'function' ||
                typeof definition.validate !== 'function'
                || (definition.random &&  typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.');

            // store the definition
            types[type][format] = definition;
        },

        /**
         * Take a serialized (ready for HTTP transmission) value and deserialize it.
         * Converts strings of binary, byte, date, and date-time to JavaScript equivalents.
         * @param {*} value
         * @returns {{ error: Exception|null, value: * }}
         */
        deserialize: function(value) {
            // return serial.deserialize(this, value);
        },

        /**
         * Get discriminator key and schema.
         * @param {*} value
         * @returns {{ key: string, schema: Schema }}
         */
        getDiscriminator: function(value) {
            const { definition, enforcer } = store.get(this);   // TODO: get rid of this, the values exist on the prototype
            const version = enforcer.version;
            if (version === 2) {
                const discriminator = definition.discriminator;
                const key = discriminator && value && value.hasOwnProperty(discriminator) ? value[discriminator] : undefined;
                if (!key) return { key: undefined, schema: undefined };
                const schema = enforcer.definition && enforcer.definition.definitions && enforcer.definition.definitions[key];
                return { key, schema };

            } else if (version === 3) {
                const discriminator = definition.discriminator;
                const key = discriminator && value && value.hasOwnProperty(discriminator.propertyName) ? value[discriminator.propertyName] : undefined;
                if (!key) return { key: undefined, schema: undefined };

                const mapping = discriminator.mapping;
                const schema = mapping && mapping[key];
                return { key, schema };
            }
        },

        /**
         * Populate a value from a list of parameters.
         * @param {object} params
         * @param {*} [value]
         * @param {object} [options]
         * @param {boolean} [options.copy=false]
         * @param {boolean} [options.conditions=true]
         * @param {boolean} [options.defaults=true]
         * @param {string} [options.replacement='handlebar']
         * @param {boolean} [options.reportErrors=false]
         * @param {boolean} [options.templateDefaults=true]
         * @param {boolean} [options.templates=true]
         * @param {boolean} [options.variables=true]
         * @returns {{ error: Exception|null, value: * }}
         */
        populate: function(params, value, options) {
            // return populate.populate(this, params, value, options);
        },

        /**
         * Produce a random value for the schema.
         * @param {*} value An initial value to add random values to.
         * @param {object} [options]
         * @param {boolean} [options.skipInvalid=false]
         * @param {boolean} [options.throw=true]
         * @returns {{ error: Exception|null, value: * }}
         */
        random: function(value, options) {
            //return random(this, value, options);
        },

        /**
         * Take a deserialized (not ready for HTTP transmission) value and serialize it.
         * Converts Buffer and Date objects into string equivalent.
         * @param value
         * @returns {*}
         */
        serialize: function(value) {
            const exception = Exception('Unable to serialize value');
            const result = runSerialize(exception, new Map(), this, value);
            return new Result(result, exception);
        },

        /**
         * Check to see if the value is valid for this schema.
         * @param {*} value
         * @returns {Exception|null}
         */
        validate: function(value) {
            return validate(this, value);
        }
    },

    validator: function (data) {
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
                additionalProperties: EnforcerRef('Schema', {
                    allowed: ({parent}) => parent.value.type === 'object',
                    type: ['boolean', 'object'],
                    default: true
                }),
                allOf: {
                    type: 'array',
                    items: EnforcerRef('Schema')
                },
                anyOf: {
                    allowed: ({major}) => major === 3,
                    type: 'array',
                    items: EnforcerRef('Schema')
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
                    allowed: ({ parent }) => {
                        return parent && parent.validator instanceof SchemaObject && parent.validator.type === 'object';
                    },
                    type: ({ major }) => major === 2 ? 'string' : 'object',
                    properties: {
                        propertyName: {
                            type: 'string',
                            required: true
                        },
                        mapping: {
                            type: 'object',
                            additionalProperties: {
                                type: 'string',
                                errors: ({ exception, refParser, value }) => {
                                    if (refParser) {
                                        try {
                                            const ref = rxHttp.test(value) || value.indexOf('/') !== -1
                                                ? value
                                                : '#/components/schemas/' + value;
                                            refParser.$refs.get(ref)
                                        } catch (err) {
                                            exception('Reference cannot be resolved: ' + value);
                                        }
                                    }
                                }
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

                        } else if (major === 3 && value.hasOwnProperty('propertyName')) {
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
                externalDocs: EnforcerRef('ExternalDocumentation'),
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
                items: EnforcerRef('Schema', {
                    allowed: ({parent}) => parent.value.type === 'array',
                    required: ({ parent }) => parent.value.type === 'array'
                }),
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
                not: EnforcerRef('Schema', { allowed: major === 3 }),
                nullable: {
                    allowed: ({major}) => major === 3,
                    type: 'boolean',
                    default: false
                },
                oneOf: {
                    allowed: ({major}) => major === 3,
                    type: 'array',
                    items: EnforcerRef('Schema')
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
                    additionalProperties: EnforcerRef('Schema')
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
                xml: EnforcerRef('Xml')
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
};

module.exports.defineDataTypeFormat = function (type, format, definition) {
    // validate input parameters
    if (!globalDataTypeFormats.hasOwnProperty('type')) throw Error('Invalid type specified. Must be one of: ' + Object.keys(globalDataTypes).join(', '));
    if (!format || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string');
    if (globalDataTypeFormats.hasOwnProperty(format)) throw Error('Format "' + format + '" is already defined');
    if (!definition || typeof definition !== 'object' ||
        typeof definition.deserialize !== 'function' ||
        typeof definition.serialize !== 'function' ||
        typeof definition.validate !== 'function'
        || (definition.random &&  typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.');

    // store the definition
    globalDataTypeFormats[format] = definition;
};


function callDataTypeFormatFunction(mode, schema, exception, originalValue) {
    const dataTypeFormats = store.get(schema).dataTypeFormats;
    const format = schema.format;
    const map = dataTypeFormats.types[schema.type] && dataTypeFormats.types[schema.type][schema.format];
    const fn = format && typeof map === 'object' && typeof map[mode] === 'function' ? map[mode] : null;
    if (fn) {
        const { coerce, serialize, validate, value } = Value.getAttributes(originalValue);
        return fn({
            coerce,
            exception,
            serialize,
            schema: this,
            validate,
            value
        });
    }
}

function runSerialize(exception, map, schema, originalValue) {
    const { coerce, serialize, value } = Value.getAttributes(originalValue);
    if (!serialize) return originalValue;

    const type = schema.type;
    const typeofValue = typeof value;
    let matches;

    // handle cyclic serialization
    if (value && typeof value === 'object') {
        matches = map.get(value);
        if (matches) {
            const existing = matches.get(schema);
            if (existing) return existing;
        } else {
            matches = new WeakMap();
            map.set(value, matches);
        }
    }

    if (schema.allOf) {
        const result = {};
        schema.allOf.forEach((schema, index) => {
            const v = runSerialize(exception.nest('Unable to serialize "allOf" at index ' + index), map, schema, originalValue);
            Object.assign(result, v)
        });
        return result;

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, map, schema, value, serialize);
        } else {
            const anyOfException = Exception('Unable to serialize using anyOf schemas');
            const length = schema.allOf.length;
            for (let index = 0; index < length; index++) {
                const subSchema = schema.allOf[index];
                const child = anyOfException.at(index);
                const result = runSerialize(child, map, subSchema, originalValue);
                if (!child.hasException) {
                    const error = subSchema.validate(result);
                    if (error) {
                        child(error);
                    } else {
                        return result;
                    }
                }
            }
            exception(anyOfException);
        }

    } else if (schema.oneOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, map, schema, originalValue, serialize);
        } else {
            const oneOfException = Exception('Did not serialize against exactly one oneOf schema');
            let valid = 0;
            let result = undefined;
            schema.oneOf.forEach((schema, index) => {
                const child = oneOfException.at(index);
                const result = runSerialize(child, map, schema, originalValue);
                if (!child.hasException) {
                    const error = schema.validate(result);
                    if (error) {
                        child(error);
                    } else {
                        child('Serialized against schema at index ' + index);
                        valid++;
                    }
                }
            });
            if (valid !== 1) {
                exception(oneOfException);
            } else {
                return result;
            }
        }

    } else if (type === 'array') {
        if (Array.isArray(value)) {
            const result = schema.items
                ? value.map((v, i) => runSerialize(exception.at(i), map, schema.items, v))
                : value;
            matches.set(schema, result);
            return result;
        } else {
            exception('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') {
        if (util.isPlainObject(value)) {
            const result = {};
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    result[key] = runSerialize(exception.nest('Unable to serialize property: ' + key), map, properties[key], value[key]);
                } else if (additionalProperties) {
                    result[key] = runSerialize(exception.nest('Unable to serialize property: ' + key), map, additionalProperties, value[key]);
                }
            });
            return result;
        } else {
            exception('Expected an object. Received: ' + util.smart(originalValue));
        }

    } else if (type === 'boolean') {
        let result = store.get(schema).dataTypeFormats.serialize(exception, originalValue);
        if (result === undefined) {
            if (typeofValue !== 'boolean' && !coerce) {
                exception('Expected a boolean. Received: ' + util.smart(value));
            } else {
                result = typeofValue === 'string'
                    ? value.length > 0 && value.toLowerCase() !== 'false'
                    : !!value;
            }
        }
        return result;

    } else if (type === 'integer') {
        let result = store.get(schema).dataTypeFormats.serialize(exception, originalValue);
        if (result === undefined) {
            const isInteger = typeofValue === 'number' && !isNaN(value) && value === Math.round(value);
            if (isInteger) {
                result = value;
            } else if (coerce) {
                result = +value;
                if (!isNaN(result) && result !== Math.round(result)) result = Math.round(result);
            }
        }
        if (isNaN(result)) {
            exception('Expected an integer. Received: ' + util.smart(value));
            result = undefined;
        }
        return result;

    } else if (type === 'number') {
        let result = store.get(schema).dataTypeFormats.serialize(exception, originalValue);
        if (result === undefined) {
            const isNumber = typeofValue === 'number' && !isNaN(value);
            if (isNumber) {
                result = value;
            } else if (coerce) {
                result = +value;
            }
        }
        if (isNaN(result)) {
            exception('Expected a number. Received: ' + util.smart(value));
            result = undefined;
        }
        return result;

    } else if (type === 'string') {
        let result = store.get(schema).dataTypeFormats.serialize(exception, originalValue);
        if (result === undefined) {
            if (typeofValue !== 'string' && !coerce) {
                exception('Expected a string. Received: ' + util.smart(value));
            } else {
                result = String(value);
            }
        }
        return result;
    }
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