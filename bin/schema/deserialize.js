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
const Value     = require('../value');

module.exports = runDeserialize;

function runDeserialize(exception, map, schema, originalValue) {
    const { serialize, value } = Value.getAttributes(originalValue);
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
                ? value.map((v, i) => runDeserialize(exception.at(i), map, schema.items, Value.inherit(v, { serialize })))
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
                    result[key] = runDeserialize(exception.at(key), map, properties[key], Value.inherit(value[key], { serialize }));
                } else if (additionalProperties) {
                    result[key] = runDeserialize(exception.at(key), map, additionalProperties, Value.inherit(value[key], { serialize }));
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
        const dataType = dataTypes[schema.type][schema.format] || null;

        if (type === 'boolean') {
            if (dataType) {
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
            if (dataType) {
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
            if (dataType) {
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
            if (dataType) {
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
    }
}