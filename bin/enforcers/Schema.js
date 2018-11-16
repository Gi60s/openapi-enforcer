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
const EnforcerRef  = require('../enforcer-ref');
const Exception     = require('../exception');
const Result        = require('../result');
const util          = require('../util');
const Value         = require('../value');

const rxHttp = /^https?:\/\//;

const prototype = {

    /**
     * Take a serialized (ready for HTTP transmission) value and deserialize it.
     * Converts strings of binary, byte, date, and date-time to JavaScript equivalents.
     * @param {*} value
     * @returns {{ error: Exception|null, value: * }}
     */
    deserialize: function(value) {
        const exception = Exception('Unable to deserialize value');
        const result = runDeserialize(exception, new Map(), this, value);
        return new Result(result, exception);
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
     * @returns {Exception|undefined}
     */
    validate: function(value) {
        const exception = Exception('Invalid value');
        runValidate(exception, new Map(), this, value, {});
        if (exception.hasException) return exception;
    }
};

module.exports = {
    init: function (data) {
        const { exception, warn } = data;

        if (this.hasOwnProperty('enum')) {
            const child = exception.at('enum');
            this.enum = this.enum.map((value, index) => {
                return deserializeAndValidate(this, child.at(index), value, { enum: false });
            });
        }

        if (this.hasOwnProperty('default')) this.default = deserializeAndValidate(this, exception.at('default'), this.default, {});
        if (this.hasOwnProperty('example')) this.example = deserializeAndValidate(this, warn.at('example'), this.example, {});
    },

    prototype,

    statics: function (scope) {
        const dataTypes = scope.dataTypes = {
            boolean: {},
            integer: {},
            number: {},
            string: {}
        };
        return {
            defineDataTypeFormat: function (type, format, definition) {
                // validate input parameters
                if (!dataTypes.hasOwnProperty(type)) throw Error('Invalid type specified. Must be one of: ' + Object.keys(dataTypes).join(', '));
                if (!format || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string');
                if (dataTypes.hasOwnProperty(format)) throw Error('Format "' + format + '" is already defined');
                if (!definition || typeof definition !== 'object' ||
                    typeof definition.deserialize !== 'function' ||
                    typeof definition.serialize !== 'function' ||
                    typeof definition.validate !== 'function'
                    || (definition.random &&  typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.');

                // store the definition
                dataTypes[type][format] = Object.assign({}, definition, { type, format });
            }
        }
    },

    validator: function (data) {
        const { major } = data;

        const exclusive = {
            allowed: ({ parent }) => {
                return numericish(parent.result);
            },
            type: 'boolean'
        };

        const maxOrMin = {
            weight: -8,
            allowed: ({ parent }) => numericish(parent.result),
            type: ({ parent }) => numericType(parent.result),
            deserialize: ({ exception, parent, result }) => {
                const value = runDeserialize(exception, new Map(), parent.result, result);
                return exception.hasException ? result : value;
            },
            errors: ({ exception, parent, result }) => {
                runValidate(exception, new Map(), parent.result, result, { maxMin: false })
            }
        };

        const maxOrMinItems = {
            allowed: ({ parent }) => parent.definition.type === 'array',
            type: 'number',
            errors: ({ exception, result }) => {
                if (!util.isInteger(result) || result < 0) {
                    exception.message('Value must be a non-negative integer');
                }
            }
        };

        const maxOrMinLength = {
            allowed: ({ parent }) => parent.definition.type === 'string' && !numericish(parent.result),
            type: 'number',
            errors: ({ exception, result }) => {
                if (!util.isInteger(result) || result < 0) {
                    exception.message('Value must be a non-negative integer');
                }
            }
        };

        const maxOrMinProperties = {
            allowed: ({ parent }) => parent.definition.type === 'object',
            type: 'number',
            errors: ({ exception, result }) => {
                if (!util.isInteger(result) || result < 0) {
                    exception.message('Value must be a non-negative integer');
                }
            }
        };

        return {
            type: 'object',
            properties: {
                additionalProperties: EnforcerRef('Schema', {
                    allowed: ({parent}) => parent.definition.type === 'object',
                    type: ['boolean', 'object'],    // either boolean or object
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
                    type: ({ parent }) => parent.definition.type
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
                    allowed: ({ parent }) => {
                        return parent && parent.validator === module.exports.validator && parent.definition.type === 'object';
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
                                errors: ({ exception, key, refParser, result }) => {
                                    if (refParser) {
                                        try {
                                            const ref = rxHttp.test(result) || result.indexOf('/') !== -1
                                                ? result
                                                : '#/components/schemas/' + result;
                                            refParser.$refs.get(ref)
                                        } catch (err) {
                                            exception.message('Reference cannot be resolved: ' + result);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    errors: ({ exception, major, parent, definition }) => {
                        if (major === 2) {
                            if (!parent.definition.required || !parent.definition.required.includes(definition)) {
                                exception.message('Value "' + definition + '" must be found in the parent\'s required properties list.');
                            }
                            if (!parent.definition.properties || !parent.definition.properties.hasOwnProperty(definition)) {
                                exception.message('Value "' + definition + '" must be found in the parent\'s properties definition.');
                            }

                        } else if (major === 3 && definition.hasOwnProperty('propertyName')) {
                            if (!parent.definition.required || !parent.definition.required.includes(definition.propertyName)) {
                                exception.message('Value "' + definition.propertyName + '" must be found in the parent\'s required properties list.');
                            }
                            if (!parent.definition.properties || !parent.definition.properties.hasOwnProperty(definition.propertyName)) {
                                exception.message('Value "' + definition.propertyName + '" must be found in the parent\'s properties definition.');
                            }
                        }
                    }
                },
                enum: {
                    weight: -7,
                    type: 'array',
                    items: {
                        allowed: ({ parent }) => !!(parent && parent.parent),
                        type: ({ parent }) => parent.parent.definition.type,
                        freeForm: true
                    }
                },
                example: {
                    allowed: true,
                    freeForm: true
                },
                exclusiveMaximum: exclusive,
                exclusiveMinimum: exclusive,
                externalDocs: EnforcerRef('ExternalDocumentation'),
                format: {
                    weight: -9,
                    allowed: ({ parent }) => ['integer', 'number', 'string'].includes(parent.definition.type),
                    type: 'string',
                    errors: ({ exception, parent, warn }) => {
                        const format = parent.definition.format;
                        if (format) {
                            const enums = [];
                            switch (parent.definition.type) {
                                case 'integer': enums.push('int32', 'int64'); break;
                                case 'number': enums.push('float', 'double'); break;
                                case 'string': enums.push('binary', 'byte', 'date', 'date-time', 'password');
                            }
                            if (!enums.includes(format)) warn.message('Non standard format used: ' + format);
                        }
                    }
                },
                items: EnforcerRef('Schema', {
                    allowed: ({parent}) => {
                        return parent.definition.type === 'array'
                    },
                    required: ({ parent }) => parent.definition.type === 'array'
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
                    allowed: ({ parent }) => ['integer', 'number'].includes(parent.definition.type),
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
                    allowed: ({ parent }) => parent.definition.type === 'string',
                    type: 'string',
                    deserialize: ({ exception, result }) => {
                        if (!result) {
                            exception.message('Value must be a non-empty string');
                            return /./;
                        } else {
                            return new RegExp(result);
                        }
                    },
                    errors: ({ exception, result }) => {
                        if (!result) exception.message('Value must be a non-empty string');
                    }
                },
                properties: {
                    allowed: ({parent}) => parent.definition.type === 'object',
                    type: 'object',
                    additionalProperties: EnforcerRef('Schema')
                },
                readOnly: {
                    allowed: isSchemaProperty,
                    type: 'boolean',
                    default: false,
                    errors: ({ major, parent, definition }) => {
                        if (major === 2 && definition && parent && parent.parent && parent.parent.parent && parent.parent.parent.definition.required && parent.parent.parent.definition.required.includes(parent.key)) {
                            parent.warn.message('Property should not be marked as both read only and required');
                        }
                    }
                },
                required: {
                    allowed: ({parent}) => parent.definition.type === 'object',
                    type: 'array',
                    items: 'string'
                },
                title: 'string',
                type: {
                    weight: -10,
                    type: 'string',
                    required: ({ parent }) => {
                        const v = parent.definition;
                        return !v.hasOwnProperty('allOf') && !v.hasOwnProperty('anyOf') &&
                            !v.hasOwnProperty('not') && !v.hasOwnProperty('oneOf');
                    },
                    enum: ['array', 'boolean', 'integer', 'number', 'object', 'string']
                },
                uniqueItems: {
                    allowed: ({parent}) => parent.definition.type === 'array',
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
                const { exception, result } = data;

                if (!minMaxValid(result.minItems, result.maxItems)) {
                    exception.message('Property "minItems" must be less than or equal to "maxItems"');
                }

                if (!minMaxValid(result.minLength, result.maxLength)) {
                    exception.message('Property "minLength" must be less than or equal to "maxLength"');
                }

                if (!minMaxValid(result.minProperties, result.maxProperties)) {
                    exception.message('Property "minProperties" must be less than or equal to "maxProperties"');
                }

                if (!minMaxValid(result.minimum, result.maximum, result.exclusiveMinimum, result.exclusiveMaximum)) {
                    const msg = result.exclusiveMinimum || result.exclusiveMaximum ? '' : 'or equal to ';
                    exception.message('Property "minimum" must be less than ' + msg + '"maximum"');
                }

                if (result.hasOwnProperty('properties')) {
                    Object.keys(result.properties).forEach(key => {
                        const v = result.properties[key];
                        if (v.readOnly && v.writeOnly) {
                            exception.at('properties').at(key).message('Cannot be marked as both readOnly and writeOnly');
                        }
                    });
                }

                // validate that zero or one composite has been defined
                const composites = [];
                ['allOf', 'anyOf', 'oneOf', 'not'].forEach(composite => {
                    if (result.hasOwnProperty(composite)) composites.push(composite);
                });
                if (composites.length > 1) {
                    exception.message('Cannot have multiple composites: ' + composites.join(', '));
                }
            }
        };
    }
};


function runDeserialize(exception, map, schema, originalValue) {
    const { coerce, serialize, value } = Value.getAttributes(originalValue);
    if (!serialize) return originalValue;

    const type = schema.type;
    const typeofValue = typeof value;
    let matches;

    // handle cyclic serialization
    if (value && typeofValue === 'object') {
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
        const exception2 = exception.at('allOf');
        schema.allOf.forEach((schema, index) => {
            const v = runDeserialize(exception2.at(index), map, schema, originalValue);
            Object.assign(result, v)
        });
        return result;

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, map, schema, originalValue, runDeserialize);
        } else {
            const anyOfException = Exception('Unable to deserialize using anyOf schemas');
            const length = schema.allOf.length;
            for (let index = 0; index < length; index++) {
                const subSchema = schema.allOf[index];
                const child = anyOfException.at(index);
                const result = runDeserialize(child, map, subSchema, originalValue);
                if (!child.hasException) {
                    const error = subSchema.validate(result);
                    if (error) {
                        child(error);
                    } else {
                        return result;
                    }
                }
            }
            exception.push(anyOfException);
        }

    } else if (schema.oneOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, map, schema, originalValue, runDeserialize);
        } else {
            const oneOfException = Exception('Did not deserialize against exactly one oneOf schema');
            let valid = 0;
            let result = undefined;
            schema.oneOf.forEach((schema, index) => {
                const child = oneOfException.nest('Unable to deserialize using schema at index ' + index);
                result = runDeserialize(child, map, schema, originalValue);
                if (!child.hasException) {
                    const error = schema.validate(result);
                    if (error) {
                        child(error);
                    } else {
                        child('Deserialized against schema at index ' + index);
                        valid++;
                    }
                }
            });
            if (valid !== 1) {
                exception.push(oneOfException);
            } else {
                return result;
            }
        }

    } else if (type === 'array') {
        if (Array.isArray(value)) {
            const result = schema.items
                ? value.map((v, i) => runDeserialize(exception.at(i), map, schema.items, Value.inherit(v, { coerce, serialize })))
                : value;
            matches.set(schema, result);
            return result;
        } else {
            exception.message('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') { // TODO: make sure that serialize and deserialze properly throw errors for invalid object properties
        if (util.isPlainObject(value)) {
            const result = {};
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    result[key] = runDeserialize(exception.at(key), map, properties[key], Value.inherit(value[key], {
                        coerce,
                        serialize
                    }));
                } else if (additionalProperties) {
                    result[key] = runDeserialize(exception.at(key), map, additionalProperties, Value.inherit(value[key], {
                        coerce,
                        serialize
                    }));
                } else {
                    result[key] = value[key];   // not deserialized, just left alone
                }
            });
            matches.set(schema, result);
            return result;
        } else {
            exception.message('Expected an object. Received: ' + util.smart(value));
        }

    } else {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = dataTypes[schema.type][schema.format] || { deserialize: function({ value }) { return value } };

        if (type === 'boolean') {
            if (typeofValue !== 'boolean' && !coerce) {
                exception.message('Expected a boolean. Received: ' + util.smart(value));
            } else {
                return dataType.deserialize({
                    coerce,
                    exception,
                    schema,
                    value: typeofValue === 'string' ? value.toLowerCase() === 'false' : !!value
                });
            }

        } else if (type === 'integer') {
            if (typeofValue !== 'number' && !coerce) {
                exception.message('Expected a number. Received: ' + util.smart(value));
            } else {
                return dataType.deserialize({
                    coerce,
                    exception,
                    schema,
                    value: +value
                });
            }

        } else if (type === 'number') {
            if (typeofValue !== 'number' && !coerce) {
                exception.message('Expected a number. Received: ' + util.smart(value));
            } else {
                return dataType.deserialize({
                    coerce,
                    exception,
                    schema,
                    value: +value
                });
            }

        } else if (type === 'string') {
            if (typeofValue !== 'string' && !coerce) {
                exception.message('Expected a string. Received: ' + util.smart(value));
            } else {
                return dataType.deserialize({
                    coerce,
                    exception,
                    schema,
                    value: String(value)
                });
            }
        }
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
        const allOfException = exception.nest('Unable to serialize allOf');
        schema.allOf.forEach((schema, index) => {
            const v = runSerialize(allOfException.at(index), map, schema, originalValue);
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
            exception.message('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') {
        if (util.isPlainObject(value)) {
            const result = {};
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    result[key] = runSerialize(exception.at(key), map, properties[key], value[key]);
                } else if (additionalProperties) {
                    result[key] = runSerialize(exception.at(key), map, additionalProperties, value[key]);
                }
            });
            return result;
        } else {
            exception.message('Expected an object. Received: ' + util.smart(originalValue));
        }

    } else {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = dataTypes[schema.type][schema.format] || { serialize: function({ value }) { return value } };

        if (type === 'boolean') {
            let result = dataType.serialize({
                coerce,
                exception,
                schema,
                value: originalValue
            });
            if (typeof result !== 'boolean' && !coerce) {
                exception.message('Unable to serialize to boolean. Received: ' + util.smart(result));
            } else {
                result = !!result;
            }
            return result;

        } else if (type === 'integer') {
            let result = dataType.serialize({
                coerce,
                exception,
                schema,
                value: originalValue
            });
            const isInteger = typeof result === 'number' && !isNaN(result) && result === Math.round(result);
            if (isInteger) {
                result = value;
            } else if (coerce) {
                result = +value;
                if (!isNaN(result) && result !== Math.round(result)) result = Math.round(result);
            } else {
                exception.message('Unable to serialize to integer. Received: ' + util.smart(result));
            }
            return result;

        } else if (type === 'number') {
            let result = dataType.serialize({
                coerce,
                exception,
                schema,
                value: originalValue
            });
            const isNumber = typeofValue === 'number' && !isNaN(value);
            if (isNumber) {
                result = value;
            } else if (coerce) {
                result = +value;
            }
            if (isNaN(result)) {
                exception.message('Unable to serialize to number. Received: ' + util.smart(value));
                result = undefined;
            }
            return result;

        } else if (type === 'string') {
            let result = dataType.serialize({
                coerce,
                exception,
                schema,
                value: originalValue
            });
            if (typeof result !== 'string' && !coerce) {
                exception.message('Unable to serialize to string. Received: ' + util.smart(value));
            } else {
                result = String(value);
            }
            return result;
        }
    }
}

function deserializeAndValidate(schema, exception, value, options) {
    let error;
    [ value, error ] = schema.deserialize(value);
    if (!error) {
        const exception = Exception('Invalid value');
        runValidate(exception, new Map(), schema, value, options);
        if (exception.hasException) error = exception;
    }
    if (error) exception.push(error);
    return value;
}

function isSchemaProperty({ parent }) {
    return parent && parent.parent && parent.parent.key === 'properties' &&
        parent.parent.parent && parent.parent.parent.validator === module.exports.validator;
}

function maxMin(exception, schema, type, maxProperty, minProperty, exclusives, value, maximum, minimum) {
    if (schema.hasOwnProperty(maxProperty)) {
        if (exclusives && schema.exclusiveMaximum && value >= maximum) {
            exception.message('Expected ' + type + ' to be less than ' +
                util.smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
                util.smart(schema.serialize(value).value));
        } else if (value > maximum) {
            exception.message('Expected ' + type + ' to be less than or equal to ' +
                util.smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
                util.smart(schema.serialize(value).value));
        }
    }

    if (schema.hasOwnProperty(minProperty)) {
        if (exclusives && schema.exclusiveMinimum && value <= minimum) {
            exception.message('Expected ' + type + ' to be greater than ' +
                util.smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
                util.smart(schema.serialize(value).value));
        } else if (value < minimum) {
            exception.message('Expected ' + type + ' to be greater than or equal to ' +
                util.smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
                util.smart(schema.serialize(value).value));
        }
    }
}

function minMaxValid(minimum, maximum, exclusiveMinimum, exclusiveMaximum) {
    if (minimum === undefined || maximum === undefined) return true;
    minimum = +minimum;
    maximum = +maximum;
    return minimum < maximum || (!exclusiveMinimum && !exclusiveMaximum && minimum === maximum);
}

function numericish(schema) {
    if (['number', 'integer'].includes(schema.type)) return true;
    const dataTypes = schema.enforcerData.staticData.dataTypes;
    const dataType = dataTypes[schema.type] && dataTypes[schema.type][schema.format];
    return !!(dataType && dataType.isNumeric);
}

function numericType (schema) {
    const dataTypes = schema.enforcerData.staticData.dataTypes;
    const dataType = dataTypes[schema.type] && dataTypes[schema.type][schema.format];
    if (dataType && dataType.isNumeric) {
        switch (schema.type) {
            case 'boolean':
                return 'boolean';
            case 'string':
                return 'string';
            case 'integer':
            case 'number':
            default:
                return 'number';
        }
    } else {
        return 'number';
    }
}

function runValidate(exception, map, schema, originalValue, options) {
    const { validate, value } = Value.getAttributes(originalValue);
    if (!validate) return originalValue;

    const type = schema.type;

    // handle cyclic validation
    if (value && typeof value === 'object') {
        let schemas = map.get(value);
        if (schemas && schemas.indexOf(schema) !== -1) return;

        if (!schemas) {
            schemas = [];
            map.set(value, schemas);
        }
        schemas.push(schema);
    }

    // if nullable and null then skip all other validation
    if (schema.nullable && value === null) return;

    if (schema.allOf) {
        const child = exception.nest('Did not validate against allOf schemas');
        schema.allOf.forEach((subSchema, index) => {
            runValidate(child.at(index), map, subSchema, originalValue, options);
        });

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            const data = schema.getDiscriminator(value);
            const subSchema = data.schema;
            const key = data.key;
            if (!subSchema) {
                exception.message('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
            } else {
                runValidate(exception.at(value[key]), map, subSchema, value, options);
            }
        } else {
            const anyOfException = Exception('Did not validate against one or more anyOf schemas');
            const length = schema.anyOf.length;
            let valid = false;
            for (let i = 0; i < length; i++) {
                const child = anyOfException.at(i);
                runValidate(child, map, schema.anyOf[i], value, options);
                if (!child.hasException) {
                    valid = true;
                    break;
                }
            }
            if (!valid) exception.message(anyOfException);
        }

    } else if (schema.oneOf) {
        if (schema.discriminator) {
            const data = schema.getDiscriminator(value);
            const subSchema = data.schema;
            const key = data.key;
            if (!subSchema) {
                exception.message('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
            } else {
                runValidate(exception.at(value[key]), map, subSchema, value, options);
            }
        } else {
            const oneOfException = Exception('Did not validate against exactly one oneOf schema');
            const length = schema.oneOf.length;
            let valid = 0;
            for (let i = 0; i < length; i++) {
                const child = Exception('Did not validate against schema at index ' + i);
                runValidate(child, map, schema.oneOf[i], value, options);
                if (!child.hasException) {
                    valid++;
                    oneOfException('Validated against schema at index ' + i);
                } else {
                    oneOfException(child);
                }
            }
            if (valid !== 1) exception.push(oneOfException);
        }

    } else if (schema.not) {
        const child = Exception('');
        runValidate(child, map, schema, value, options);
        if (!child.hasException) exception.message('Value should not validate against schema');

    } else if (type === 'array') {
        if (!Array.isArray(value)) {
            exception.message('Expected an array. Received: ' + util.smart(value));
        } else {
            const length = value.length;
            if (schema.hasOwnProperty('maxItems') && schema.maxItems < length) {
                exception.message('Too many items in the array. Maximum of ' + schema.maxItems + '. Found ' + length + ' items');
            }
            if (schema.hasOwnProperty('minItems') && schema.minItems > length) {
                exception.message('Too few items in the array. Minimum of ' + schema.minItems + '. Found ' + length + ' items');
            }
            if (schema.uniqueItems) {
                const singles = [];
                value.forEach((item, index) => {
                    const length = singles.length;
                    let found;
                    for (let i = 0; i < length; i++) {
                        if (util.same(item, singles[i])) {
                            exception.message('Array items must be unique. Value is not unique at index ' + index);
                            found = true;
                            break;
                        }
                    }
                    if (!found) singles.push(item);
                });
            }
            if (schema.items) {
                value.forEach((val, index) => {
                    runValidate(exception.at(index), map, schema.items, val, options);
                });
            }
        }

    } else if (type === 'object') {
        if (!util.isPlainObject(value)) {
            exception.message('Expected a non-null object. Received: ' + util.smart(value));
        } else {
            const properties = schema.properties || {};
            const required = schema.required ? schema.required.concat() : [];
            const keys = Object.keys(value);
            const knownPropertyException = exception.nest('Error with properties');
            const additionalPropertyException = exception.nest('Error with additional properties');

            // validate each property in the value
            keys.forEach(key => {
                const index = required.indexOf(key);
                if (index !== -1) required.splice(index, 1);
                if (properties.hasOwnProperty(key)) {
                    runValidate(knownPropertyException.at(key), map, properties[key], value[key], options);
                } else {
                    if (schema.additionalProperties === false) {
                        exception.message('Property not allowed: ' + key);
                    } else if (typeof schema.additionalProperties === 'object') {
                        runValidate(additionalPropertyException.at(key), map, schema.additionalProperties, value[key], options);
                    }
                }
            });

            // validate that all required are present
            if (required.length > 0) {
                exception.message('One or more required properties missing: ' + required.join(', '));
            }

            // validate number of properties
            maxMin(exception, schema, 'object property count', 'maxProperties', 'minProperties', false, keys.length, schema.maxProperties, schema.minProperties);

            // if a discriminator is present then validate discriminator mapping
            if (schema.discriminator) {
                const discriminatorSchema = version.getDiscriminatorSchema(schema, value);
                if (discriminatorSchema) {
                    runValidate(exception, map, discriminatorSchema, value, options);
                } else {
                    exception.message('Unable to map discriminator schema');
                }
            }
        }

    } else {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = dataTypes[schema.type][schema.format] || { validate: null };

        if (dataType.validate) {
            dataType.validate({ exception, schema, value });

        } else if (type === 'boolean') {
            if (typeof value !== 'boolean') exception.message('Expected a boolean. Received: ' + util.smart(value));

        } else if (type === 'integer') {
            if (isNaN(value) || Math.round(value) !== value || typeof value !== 'number') {
                exception.message('Expected an integer. Received: ' + util.smart(value));
            } else {
                if (options.maxMin !== false) {
                    maxMin(exception, schema, 'integer', 'maximum', 'minimum', true, value, schema.maximum, schema.minimum);
                }
                if (schema.multipleOf && value % schema.multipleOf !== 0) {
                    exception.message('Expected a multiple of ' + schema.multipleOf + '. Received: ' + util.smart(value));
                }
            }

        } else if (type === 'number') {
            if (isNaN(value) || typeof value !== 'number') {
                exception.message('Expected a number. Received: ' + util.smart(value));
            } else {
                if (options.maxMin !== false) {
                    maxMin(exception, schema, 'number', 'maximum', 'minimum', true, value, schema.maximum, schema.minimum);
                }
                if (schema.multipleOf && value % schema.multipleOf !== 0) {
                    exception.message('Expected a multiple of ' + schema.multipleOf + '. Received: ' + util.smart(value));
                }
            }

        } else if (schema.type === 'string') {
            if (typeof value !== 'string') {
                exception.message('Expected a string. Received: ' + util.smart(value));
            } else {
                const length = value.length;
                if (schema.hasOwnProperty('maxLength') && length > schema.maxLength) {
                    exception.message('String too long. ' + util.smart(value) + ' (' + length + ') exceeds maximum length of ' + schema.maxLength);
                }

                if (schema.hasOwnProperty('minLength') && length < schema.minLength) {
                    exception.message('String too short. ' + util.smart(value) + ' (' + length + ') exceeds minimum length of ' + schema.minLength);
                }

                if (schema.hasOwnProperty('pattern') && !schema.pattern.test(value)) {
                    exception.message('String does not match required pattern ' + schema.pattern + ' with value: ' + util.smart(value));
                }
            }
        }
    }

    // enum validation
    if (schema.enum && options.enum !== false) {
        const length = schema.enum.length;
        let found;
        for (let i = 0; i < length; i++) {
            if (util.same(value, schema.enum[i])) {
                found = true;
                break;
            }
        }
        if (!found) exception.message('Value ' + util.smart(value) + ' did not meet enum requirements');
    }
}