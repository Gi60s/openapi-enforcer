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
const Exception = require('../exception');
const formatter = require('./formatter');
const util      = require('../util');

/**
 * Convert a serialized value to deserialized.
 * Converts Buffer and Date objects into string equivalent.
 * @param {Schema} schema
 * @param {*} value
 * @returns {{ error: Exception, value: *}}
 */
exports.deserialize = function(schema, value) {
    const exception = Exception('Unable to deserialize value');

    // check the schema
    if (schema.hasException) {
        exception.push(schema.exception);
        return exception;
    }

    // deserialize
    const result = deserialize(exception, util.getVersionApi(schema.version), new Map(), schema, value);

    // return results
    const hasException = Exception.hasException(exception);
    return {
        error: hasException ? exception : null,
        value: hasException ? null : result
    }
};

exports.serialize = function(schema, value) {
    const exception = Exception('Unable to serialize value');

    // check the schema
    if (schema.hasException) {
        exception.push(schema.exception);
        return exception;
    }

    // deserialize
    const result = serialize(exception, util.getVersionApi(schema.version), new Map(), schema, value);

    // return results
    const hasException = Exception.hasException(exception);
    return {
        error: hasException ? exception : null,
        value: hasException ? null : result
    }
};



function deserialize(exception, version, map, schema, value) {
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

    const type = schema.type;

    if (schema.allOf) {
        const result = {};
        schema.allOf.forEach((schema, index) => {
            const v = deserialize(exception.nest('Unable to deserialize "allOf" at index ' + index), schema, value);
            Object.assign(result, v)
        });
        return result;

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, version, map, schema, value, deserialize);
        } else {
            const anyOfException = Exception('Unable to deserialize using anyOf schemas');
            const length = schema.allOf.length;
            for (let index = 0; index < length; index++) {
                const subSchema = schema.allOf[index];
                const child = anyOfException.nest('Unable to deserialize using schema at index' + index);
                const result = deserialize(child, version, map, subSchema, value);
                if (!Exception.hasException(child)) {
                    const error = subSchema.validate(v);
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
            return runDiscriminator(exception, version, map, schema, value, deserialize);
        } else {
            const oneOfException = Exception('Did not deserialize against exactly one oneOf schema');
            let valid = 0;
            let result = undefined;
            schema.oneOf.forEach((schema, index) => {
                const child = oneOfException.nest('Unable to deserialize using schema at index ' + index);
                result = deserialize(child, version, map, schema, value);
                if (!Exception.hasException(child)) {
                    const error = schema.validate(v);
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
                ? value.map((v, i) => deserialize(exception.nest('/' + i), schema.items, v))
                : value;
            matches.set(schema, result);
            return result;
        } else {
            exception.push('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') {
        if (util.isPlainObject(value)) {
            const result = {};
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    result[key] = deserialize(exception.nest('Unable to deserialize property: ' + key), properties[key], value[key]);
                } else if (additionalProperties) {
                    result[key] = deserialize(exception.nest('Unable to deserialize property: ' + key), additionalProperties, value[key]);
                }
            });
            matches.set(schema, result);
            return result;
        } else {
            exception('Expected an object. Received: ' + util.smart(value));
        }

    } else if (type === 'string' && typeof value === 'string') {
        const data = formatter.deserialize(exception, schema, value);
        if (data.error) {
            exception(data.error);
        } else {
            return data.value;
        }

    } else {
        return value;
    }
}

function runDiscriminator(exception, version, map, schema, value, next) {
    const subSchema = version.getDiscriminatorSchema(schema, value);
    const key = version.getDiscriminatorKey(schema, value);
    if (!subSchema) {
        exception('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
    } else {
        return next(exception.nest('Discriminator property "' + key + '" as "' + value[key] + '" has one or more errors'), version, map, subSchema, value);
    }
}

function serialize(exception, version, map, schema, value) {
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

    const type = schema.type;

    if (schema.allOf) {
        const result = {};
        schema.allOf.forEach((schema, index) => {
            const v = serialize(exception.nest('Unable to serialize "allOf" at index ' + index), schema, value);
            Object.assign(result, v)
        });
        return result;

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, version, map, schema, value, serialize);
        } else {
            const anyOfException = Exception('Unable to serialize using anyOf schemas');
            const length = schema.allOf.length;
            for (let index = 0; index < length; index++) {
                const subSchema = schema.allOf[index];
                const child = anyOfException.nest('Unable to serialize using schema at index' + index);
                const result = deserialize(child, version, map, subSchema, value);
                if (!Exception.hasException(child)) {
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
            return runDiscriminator(exception, version, map, schema, value, serialize);
        } else {
            const oneOfException = Exception('Did not serialize against exactly one oneOf schema');
            let valid = 0;
            let result = undefined;
            schema.oneOf.forEach((schema, index) => {
                const child = oneOfException.nest('Unable to serialize using schema at index ' + index);
                const result = deserialize(child, version, map, schema, value);
                if (!Exception.hasException(child)) {
                    const error = schema.validate(result);
                    if (error) {
                    if (error) {
                        child(error);
                    } else {
                        child('Serialized against schema at index ' + index);
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
                ? value.map((v, i) => serialize(exception.nest('Unable to serialize array item at index ' + i), version, map, schema.items, v))
                : value;
            matches.set(schema, result);
            return result;
        } else {
            exception.push('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') {
        if (util.isPlainObject(value)) {
            const result = {};
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    result[key] = serialize(exception.nest('Unable to serialize property: ' + key), properties[key], value[key]);
                } else if (additionalProperties) {
                    result[key] = serialize(exception.nest('Unable to serialize property: ' + key), additionalProperties, value[key]);
                }
            });
            return result;
        } else {
            exception('Expected an object. Received: ' + util.smart(value));
        }

    } else if (type === 'string' && typeof value !== 'string') {
        const data = formatter.serialize(exception, schema, value);
        if (data.error) {
            exception(data.error);
        } else {
            return data.value;
        }

    } else {
        return value;
    }
}