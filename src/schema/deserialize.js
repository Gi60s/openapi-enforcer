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
const schemaUtil    = require('./util');
const util          = require('../util');
const Value         = require('./value');

const rxTrue = /^\s*true\s*$/i;
const rxFalse = /^\s*false\s*$/i;
const rxInteger = /^\s*\d+\s*$/;
const rxNumber = /^\s*(?:\d+(?:\.\d+)?)|(?:\.\d+)\s*$/;

module.exports = runDeserialize;

function runDeserialize(exception, map, schema, originalValue, options) {
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
        const exception2 = exception.at('allOf');
        if (schema.allOf[0].type === 'object') {
            const result = {};
            schema.allOf.forEach((schema, index) => {
                const v = runDeserialize(exception2.at(index), map, schema, originalValue, options);
                Object.assign(result, v)
            });
            return Object.assign(value, result);
        } else {
            return runDeserialize(exception2.at('0'), map, schema.allOf[0], originalValue, options);
        }

    } else if (schema.anyOf || schema.oneOf) {
        let result;
        let subSchema;
        if (schema.discriminator && (subSchema = schema.discriminate(value))) {
            result = Object.assign(value, runDeserialize(exception, map, subSchema, originalValue, options));
        } else {
            result = schemaUtil.anyOneOf(schema,
                originalValue, exception, map, runDeserialize, false, options);
        }
        return result;

    } else if (type === 'array') {
        if (Array.isArray(value)) {
            if (schema.items) {
                value.forEach((v, i) => {
                    value[i] = runDeserialize(exception.at(i), map, schema.items, Value.inherit(v, { serialize }), options);
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
                    value[key] = runDeserialize(exception.at(key), map, properties[key], Value.inherit(value[key], { serialize }), options);
                } else if (additionalProperties) {
                    value[key] = runDeserialize(exception.at(key), map, additionalProperties, Value.inherit(value[key], { serialize }), options);
                }
            });

            if (schema.discriminator) {
                const subSchema = schema.discriminate(value);
                if (subSchema) {
                    Object.assign(value, runDeserialize(exception, map, subSchema, originalValue, options));
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
        const dataType = (dataTypes[schema.type] && dataTypes[schema.type][schema.format]) || null;

        if (type === 'boolean') {
            if (dataType && dataType.deserialize) {
                // although this will never run right now, it is here in case a custom type definition for booleans is created
                return dataType.deserialize({
                    exception,
                    schema,
                    value
                });
            } else if (typeofValue !== 'boolean') {
                if (!options.strict) {
                    if (typeofValue === 'string') {
                        if (rxTrue.test(value)) return true;
                        if (rxFalse.test(value)) return false;
                    } else if (typeofValue === 'number') {
                        return !!value;
                    }
                }
                exception.message('Expected a boolean. Received: ' + util.smart(value));
            } else {
                return value;
            }

        } else if (type === 'integer') {
            if (dataType && dataType.deserialize) {
                return dataType.deserialize({
                    exception,
                    schema,
                    value
                });
            } else if (typeofValue !== 'number' || !util.isInteger(value)) {
                if (!options.strict && typeofValue === 'string' && rxInteger.test(value)) {
                    return +value;
                }
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
                if (!options.strict && typeofValue === 'string' && rxNumber.test(value)) {
                    return +value;
                }
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
