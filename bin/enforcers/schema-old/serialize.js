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
const Exception = require('../../exception');
const rx        = require('../../rx');
const util      = require('../../util');
const Result    = require('../../result');
const Value     = require('../../value');

/**
 * Convert a serialized value to deserialized.
 * Converts strings to Buffers and Dates where appropriate.
 * @param {Schema} schema
 * @param {*} value
 * @returns {EnforcerResult}
 */
exports.deserialize = function(schema, value) {
    const exception = Exception('Unable to deserialize value');
    return new Result(deserialize(exception, new Map(), schema, value), exception);
};

/**
 * Convert a deserialized value to serialized.
 * Converts Buffer and Date objects into string equivalent.
 * @param {Schema} schema
 * @param {object} protect Protected data
 * @param {*} value
 * @returns {EnforcerResult}
 */
exports.serialize = function(schema, protect, value) {
    const exception = Exception('Unable to serialize value');
    const result = runSerialize(exception, new Map(), schema, protect, value);
    return new Result(result, exception);
};


function deserialize(exception, map, schema, originalValue) {
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
            const v = deserialize(exception2.at(index), map, schema, originalValue);
            Object.assign(result, v)
        });
        return result;

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, map, schema, originalValue, deserialize);
        } else {
            const anyOfException = Exception('Unable to deserialize using anyOf schemas');
            const length = schema.allOf.length;
            for (let index = 0; index < length; index++) {
                const subSchema = schema.allOf[index];
                const child = anyOfException.at(index);
                const result = deserialize(child, map, subSchema, originalValue);
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
            return runDiscriminator(exception, map, schema, originalValue, deserialize);
        } else {
            const oneOfException = Exception('Did not deserialize against exactly one oneOf schema');
            let valid = 0;
            let result = undefined;
            schema.oneOf.forEach((schema, index) => {
                const child = oneOfException.nest('Unable to deserialize using schema at index ' + index);
                result = deserialize(child, map, schema, originalValue);
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
                exception(oneOfException);
            } else {
                return result;
            }
        }

    } else if (type === 'array') {
        if (Array.isArray(value)) {
            const result = schema.items
                ? value.map((v, i) => deserialize(exception.nest('/' + i), map, schema.items, v))
                : value;
            matches.set(schema, result);
            return result;
        } else {
            exception('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') { // TODO: make sure that serialize and deserialze properly throw errors for invalid object properties
        if (util.isPlainObject(value)) {
            const result = {};
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    result[key] = deserialize(exception.nest('Unable to deserialize property: ' + key), map, properties[key], value[key]);
                } else if (additionalProperties) {
                    result[key] = deserialize(exception.nest('Unable to deserialize property: ' + key), map, additionalProperties, value[key]);
                } else {
                    result[key] = value[key];   // not deserialized, just left alone
                }
            });
            matches.set(schema, result);
            return result;
        } else {
            exception('Expected an object. Received: ' + util.smart(value));
        }

    } else if (type === 'boolean') {
        if (typeofValue !== 'boolean' && !coerce) {
            exception('Expected a boolean. Received: ' + util.smart(value));
        } else {
            const val = typeofValue === 'string'
                ? value.toLowerCase() === 'false'
                : !!value;
            return schema.dataTypeFormats.deserialize(exception, val);
        }

    } else if (type === 'integer') {
        if (typeofValue !== 'number' && !coerce) {
            exception('Expected a number. Received: ' + util.smart(value));
        } else {
            return schema.dataTypeFormats.deserialize(exception, +value);
        }

    } else if (type === 'number') {
        if (typeofValue !== 'number' && !coerce) {
            exception('Expected a number. Received: ' + util.smart(value));
        } else {
            return schema.dataTypeFormats.deserialize(exception, +value);
        }

    } else if (type === 'string') {
        if (typeofValue !== 'string' && !coerce) {
            exception('Expected a string. Received: ' + util.smart(value));
        } else {
            return schema.dataTypeFormats.deserialize(exception, String(value));
        }
    }
}

function runDiscriminator(exception, map, parentSchema, value, next) {
    const { key, schema } = parentSchema.getDiscriminatorSchema(value);
    if (!schema) {
        exception('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
    } else {
        return next(exception.nest('Discriminator property "' + key + '" as "' + value[key] + '" has one or more errors'), map, schema, value);
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
        let result = schema.dataTypeFormats.serialize(exception, originalValue);
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
        let result = schema.dataTypeFormats.serialize(exception, originalValue);
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
        let result = schema.dataTypeFormats.serialize(exception, originalValue);
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
        let result = schema.dataTypeFormats.serialize(exception, originalValue);
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