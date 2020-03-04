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

module.exports = runSerialize;

function runSerialize(exception, map, schema, originalValue) {
    const { serialize, value } = Value.getAttributes(originalValue);
    if (!serialize) return originalValue;

    const type = schema.type;

    // handle cyclic serialization
    if (value && typeof value === 'object') {
        const matches = map.get(schema);
        if (matches && matches.includes(value)) {
            return value;
        } else {
            map.set(schema, [ value ]);
        }
    }

    if (value === null && (schema.nullable || schema['x-nullable'])) return value;

    if (schema.allOf) {
        const result = {};
        const allOfException = exception.nest('Unable to serialize allOf');
        schema.allOf.forEach((schema, index) => {
            const v = runSerialize(allOfException.at(index), map, schema, originalValue);
            Object.assign(result, v)
        });
        return Object.assign(value, result);

    } else if (schema.anyOf || schema.oneOf) {
        let subSchema;
        if (schema.discriminator && (subSchema = schema.discriminate(value))) {
            Object.assign(value, runSerialize(exception, map, subSchema, originalValue));
        } else {
            const key = schema.anyOf ? 'anyOf' : 'oneOf';
            const exceptions = [];
            const matches = [];
            schema[key].forEach(subSchema => {
                const childException = new Exception('');
                const mapCopy = new Map(map);
                const result = runSerialize(childException, mapCopy, subSchema, originalValue);
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
                    exception.message('Unable to determine serialization schema because too many schemas match. Use of a discriminator or making your schemas more specific would help this problem.')
                } else {
                    return util.merge(value, highs[0].result);
                }
            } else if (matches.length === 0) {
                const child = exception.nest('No matching schemas');
                exceptions.forEach(childException => child.push(childException));
            } else {
                return util.merge(value, matches[0].result);
            }
        }
        return value;

    } else if (type === 'array') {
        if (Array.isArray(value)) {
            if (schema.items) {
                value.forEach((v, i) => {
                    value[i] = runSerialize(exception.at(i), map, schema.items, Value.inherit(v, { serialize }));
                })
            }
            return value;
        } else {
            exception.message('Expected an array. Received: ' + util.smart(value));
        }

    } else if (type === 'object') {
        if (util.isObject(value)) {
            const additionalProperties = schema.additionalProperties;
            const properties = schema.properties || {};
            Object.keys(value).forEach(key => {
                if (properties.hasOwnProperty(key)) {
                    value[key] = runSerialize(exception.at(key), map, properties[key], value[key]);
                } else if (additionalProperties) {
                    value[key] = runSerialize(exception.at(key), map, additionalProperties, value[key]);
                }
            });

            if (schema.discriminator) {
                const subSchema = schema.discriminate(value);
                if (subSchema) {
                    Object.assign(value, runSerialize(exception, map, subSchema, originalValue));
                } else {
                    exception.message('Unable to discriminate to schema');
                }
            }
            return value;
        } else {
            exception.message('Expected an object. Received: ' + util.smart(originalValue));
        }

    } else if (schema !== true) {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = dataTypes[schema.type][schema.format] || {};
        if (!dataType.serialize) dataType.serialize = function({ value }) { return value };

        if (type === 'boolean') {
            let result = dataType.serialize({
                exception,
                schema,
                value
            });
            if (typeof result !== 'boolean') {
                exception.message('Unable to serialize to a boolean. Received: ' + util.smart(value));
            }
            return result;

        } else if (type === 'integer') {
            let result = dataType.serialize({
                exception,
                schema,
                value
            });
            if (typeof result !== 'number' || isNaN(result) || result !== Math.round(result)) {
                exception.message('Unable to serialize to an integer. Received: ' + util.smart(value));
            }
            return result;

        } else if (type === 'number') {
            let result = dataType.serialize({
                exception,
                schema,
                value
            });
            if (typeof result !== 'number' || isNaN(result)) {
                exception.message('Unable to serialize to a number. Received: ' + util.smart(value));
            }
            return result;

        } else if (type === 'string') {
            let result = dataType.serialize({
                exception,
                schema,
                value
            });
            if (typeof result !== 'string') {
                exception.message('Unable to serialize to a string. Received: ' + util.smart(value));
            }
            return result;
        }

    } else {
        return value;
    }
}
