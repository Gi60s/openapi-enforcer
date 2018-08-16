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
const rx        = require('../rx');
const util      = require('../util');
const Result    = require('../result');

const zeros = '00000000';

/**
 * Convert a serialized value to deserialized.
 * Converts strings to Buffers and Dates where appropriate.
 * @param {Schema} schema
 * @param {*} value
 * @returns {EnforcerResult}
 */
exports.deserialize = function(schema, value) {
    const exception = Exception('Unable to deserialize value');
    return new Result(exception, deserialize(exception, new Map(), schema, value));
};

/**
 * Convert a deserialized value to serialized.
 * Converts Buffer and Date objects into string equivalent.
 * @param {Schema} schema
 * @param {*} value
 * @returns {EnforcerResult}
 */
exports.serialize = function(schema, value) {
    const exception = Exception('Unable to serialize value');
    return new Result(serialize(exception, new Map(), schema, value));
};



function deserialize(exception, map, schema, value) {
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

    // if the value is empty then skip deserialization
    if (value === util.EMPTY_VALUE) return util.EMPTY_VALUE;

    const type = schema.type;

    if (schema.allOf) {
        const result = {};
        schema.allOf.forEach((schema, index) => {
            const v = deserialize(exception.at('Unable to deserialize "allOf" at index ' + index), map, schema, value);
            Object.assign(result, v)
        });
        return result;

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            return runDiscriminator(exception, map, schema, value, deserialize);
        } else {
            const anyOfException = Exception('Unable to deserialize using anyOf schemas');
            const length = schema.allOf.length;
            for (let index = 0; index < length; index++) {
                const subSchema = schema.allOf[index];
                const child = anyOfException.nest('Unable to deserialize using schema at index' + index);
                const result = deserialize(child, map, subSchema, value);
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
            return runDiscriminator(exception, map, schema, value, deserialize);
        } else {
            const oneOfException = Exception('Did not deserialize against exactly one oneOf schema');
            let valid = 0;
            let result = undefined;
            schema.oneOf.forEach((schema, index) => {
                const child = oneOfException.nest('Unable to deserialize using schema at index ' + index);
                result = deserialize(child, map, schema, value);
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

    } else if (type === 'object') {
        if (util.isPlainObject(value)) {
            const result = {};
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    result[key] = deserialize(exception.nest('Unable to deserialize property: ' + key), map, properties[key], value[key]);
                } else if (additionalProperties) {
                    result[key] = deserialize(exception.nest('Unable to deserialize property: ' + key), map, additionalProperties, value[key]);
                }
            });
            matches.set(schema, result);
            return result;
        } else {
            exception('Expected an object. Received: ' + util.smart(value));
        }

    } else if (type === 'string' && typeof value === 'string') {
        switch (schema.format) {
            case 'binary':
                if (!rx.binary.test(value)) {
                    exception('Value is not a binary octet string');
                    break;
                } else {
                    const length = value.length;
                    const array = [];
                    for (let i = 0; i < length; i+=8) array.push(parseInt(value.substr(i, 8), 2))
                    return Buffer.from ? Buffer.from(array, 'binary') : new Buffer(array, 'binary');
                }

            case 'byte':
                if (!rx.byte.test(value) && value.length % 4 !== 0) {
                    exception('Value is not a base64 string');
                    break;
                } else {
                    return Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'base64');
                }

            case 'date':
                if (!rx.date.test(value)) {
                    exception('Value is not date string of the format YYYY-MM-DD');
                    break;
                } else {
                    const date = util.getDateFromValidDateString('date', value);
                    if (!date) {
                        exception('Value is not a valid date');
                        break;
                    } else {
                        return date;
                    }
                }

            case 'date-time':
                if (!rx.dateTime.test(value)) {
                    exception('Value is not date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ');
                    break;
                } else {
                    const date = util.getDateFromValidDateString('date-time', value);
                    if (!date) {
                        exception('Value is not a valid date-time');
                        break;
                    } else {
                        return date;
                    }
                }

            default:
                return value;
        }

    } else {
        return value;
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

function serialize(exception, map, schema, value) {
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
            const v = serialize(exception.nest('Unable to serialize "allOf" at index ' + index), map, schema, value);
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
                const child = anyOfException.nest('Unable to serialize using schema at index' + index);
                const result = deserialize(child, map, subSchema, value);
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
            return runDiscriminator(exception, map, schema, value, serialize);
        } else {
            const oneOfException = Exception('Did not serialize against exactly one oneOf schema');
            let valid = 0;
            let result = undefined;
            schema.oneOf.forEach((schema, index) => {
                const child = oneOfException.nest('Unable to serialize using schema at index ' + index);
                const result = deserialize(child, map, schema, value);
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
                ? value.map((v, i) => serialize(exception.nest('Unable to serialize array item at index ' + i), map, schema.items, v))
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
                    result[key] = serialize(exception.nest('Unable to serialize property: ' + key), map, properties[key], value[key]);
                } else if (additionalProperties) {
                    result[key] = serialize(exception.nest('Unable to serialize property: ' + key), map, additionalProperties, value[key]);
                }
            });
            return result;
        } else {
            exception('Expected an object. Received: ' + util.smart(value));
        }

    } else if (type === 'string' && typeof value !== 'string') {
        switch (schema.format) {
            case 'binary':
                if (value instanceof Buffer) {
                    let binary = '';
                    for (let i = 0; i < value.length; i++) {
                        const byte = value[i].toString(2);
                        binary += zeros.substr(byte.length) + byte;
                    }
                    return binary;
                } else {
                    exception('Value must be a Buffer instance');
                    break;
                }

            case 'byte':
                if (value instanceof Buffer) {
                    return value.toString('base64');
                } else {
                    exception('Value must be a Buffer instance');
                    break;
                }

            case 'date':
            case 'date-time':
                if (util.isDate(value)) {
                    const string = value.toISOString();
                    return schema.format === 'date' ? string.substr(0, 10) : string;
                } else {
                    exception('Value must be a Date instance');
                    break;
                }

            default:
                return value;
        }

    } else {
        return value;
    }
}