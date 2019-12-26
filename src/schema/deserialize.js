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
const util      = require('../util');
const Value     = require('./value');

module.exports = runDeserialize;

function runDeserialize(exception, map, schema, originalValue) {
    const { serialize, value } = Value.getAttributes(originalValue);
    if (!serialize) return originalValue;

    const type = schema.type;
    const typeofValue = typeof value;

    // handle cyclic deserialization
    if (value && typeofValue === 'object') {
        let matches = map.get(schema);
        if (matches && matches.includes(value)) {
            return value;
        } else {
            map.set(schema, [ value ]);
        }
    }

    if (value === null && (schema.nullable || schema['x-nullable'])) return value;

    if (schema.allOf) {
        const result = {};
        const exception2 = exception.at('allOf');
        if (schema.allOf[0].type === 'object') {
            schema.allOf.forEach((schema, index) => {
                const v = runDeserialize(exception2.at(index), map, schema, originalValue);
                Object.assign(result, v)
            });
            return Object.assign(value, result);
        } else {
            return runDeserialize(exception2.at('0'), map, schema.allOf[0], originalValue);
        }

    } else if (schema.anyOf || schema.oneOf) {
        let result;
        let subSchema;
        if (schema.discriminator && (subSchema = schema.discriminate(value))) {
            result = Object.assign(value, runDeserialize(exception, map, subSchema, originalValue));
        } else {
            const key = schema.anyOf ? 'anyOf' : 'oneOf';
            const exceptions = [];
            const matches = [];
            schema[key].forEach(subSchema => {
                const childException = new Exception('');
                const mapCopy = new Map(map);
                const result = runDeserialize(childException, mapCopy, subSchema, originalValue);
                if (childException.hasException) {
                    exceptions.push(childException)
                } else {
                    let score = 1;
                    if (subSchema.type === 'object') {
                        const properties = subSchema.properties || {};
                        const keys = Object.keys(value);
                        const length = keys.length;
                        for (let i = 0; i < length; i++) {
                            const key = keys[i];
                            if (properties.hasOwnProperty(key)) {
                                score++;
                            } else if (properties.additionalProperties === false) {
                                score = 0;
                                break;
                            }
                        }
                    }
                    if (score > 0) matches.push({ score, result })
                }
            });
            if (matches.length > 1) {
                matches.sort((a, b) => a.score > b.score ? -1 : 1);
                const highScore = matches[0].score;
                const highs = matches.filter(match => match.score === highScore);
                if (highs.length > 1) {
                    exception.message('Unable to determine deserialization schema because too many schemas match. Use of a discriminator or making your schemas more specific would help this problem.')
                } else {
                    result = typeofValue === 'object'
                        ? Object.assign(value, highs[0].result)
                        : highs[0].result;
                }
            } else if (matches.length === 0) {
                const child = exception.nest('No matching schemas');
                exceptions.forEach(childException => child.push(childException));
            } else {
                result = typeofValue === 'object'
                    ? Object.assign(value, matches[0].result)
                    : matches[0].result;
            }
        }
        return result;

    } else if (type === 'array') {
        if (Array.isArray(value)) {
            if (schema.items) {
                value.forEach((v, i) => {
                    value[i] = runDeserialize(exception.at(i), map, schema.items, Value.inherit(v, { serialize }));
                });
            }
            return value;
        } else {
            exception.message('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') { // TODO: make sure that serialize and deserialze properly throw errors for invalid object properties
        if (util.isObject(value)) {
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    value[key] = runDeserialize(exception.at(key), map, properties[key], Value.inherit(value[key], { serialize }));
                } else if (additionalProperties) {
                    value[key] = runDeserialize(exception.at(key), map, additionalProperties, Value.inherit(value[key], { serialize }));
                }
            });

            if (schema.discriminator) {
                const subSchema = schema.discriminate(value);
                if (subSchema) {
                    Object.assign(value, runDeserialize(exception, map, subSchema, originalValue));
                } else {
                    exception.message('Unable to discriminate to schema');
                }
            }
            return value;
        } else {
            exception.message('Expected an object. Received: ' + util.smart(value));
        }

    } else if (schema !== true) {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = dataTypes[schema.type][schema.format] || null;

        if (type === 'boolean') {
            if (dataType && dataType.deserialize) {
                return dataType.deserialize({
                    exception,
                    schema,
                    value
                });
            } else if (typeofValue !== 'boolean') {
                exception.message('Expected a boolean. Received: ' + util.smart(value));
            } else {
                return typeofValue === 'string' ? value.toLowerCase() === 'false' : !!value;
            }

        } else if (type === 'integer') {
            if (dataType && dataType.deserialize) {
                return dataType.deserialize({
                    exception,
                    schema,
                    value
                });
            } else if (typeofValue !== 'number' || !util.isInteger(value)) {
                exception.message('Expected an integer. Received: ' + util.smart(value));
            } else {
                return value;
            }

        } else if (type === 'number') {
            if (dataType && dataType.deserialize) {
                return dataType.deserialize({
                    exception,
                    schema,
                    value: value
                });
            } else if (typeofValue !== 'number') {
                exception.message('Expected a number. Received: ' + util.smart(value));
            } else {
                return value;
            }

        } else if (type === 'string') {
            if (dataType && dataType.deserialize) {
                return dataType.deserialize({
                    exception,
                    schema,
                    value
                });
            } if (typeofValue !== 'string') {
                exception.message('Expected a string. Received: ' + util.smart(value));
            } else {
                return value;
            }
        }

    } else {
        return value;
    }
}
