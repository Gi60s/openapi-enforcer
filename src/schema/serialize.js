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
const hooks         = require('./hooks')
const schemaUtil    = require('./util');
const util          = require('../util');
const Value         = require('./value');

module.exports = runSerialize;

function runSerialize(exception, map, schema, originalValue) {
    let { serialize, value } = Value.getAttributes(originalValue);
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

    const hookResult = hooks.runHooks(schema, 'beforeSerialize', value, exception)
    value = hookResult.value
    if (hookResult.done) return value

    if (value === null && (schema.nullable || schema['x-nullable'])) return hooks.after(schema, 'afterSerialize', value, exception);

    if (schema.allOf) {
        const result = {};
        const allOfException = exception.nest('Unable to serialize allOf');
        schema.allOf.forEach((schema, index) => {
            const v = runSerialize(allOfException.at(index), map, schema, originalValue);
            Object.assign(result, v)
        });
        return hooks.after(schema, 'afterSerialize', Object.assign(value, result), exception);

    } else if (schema.anyOf || schema.oneOf) {
        let result;
        if (schema.discriminator) {
            const { name, key, schema: subSchema } = schema.discriminate(value, true)
            if (subSchema) {
                result = Object.assign(value, runSerialize(exception, map, subSchema, originalValue));
            } else {
                exception.message('Discriminator property "' + key + '" as "' + name + '" did not map to a schema');
            }
        } else {
            result = schemaUtil.anyOneOf(schema, originalValue, exception, map, runSerialize, true);
        }
        return hooks.after(schema, 'afterSerialize', result, exception);

    } else if (type === 'array') {
        if (Array.isArray(value)) {
            if (schema.items) {
                value.forEach((v, i) => {
                    value[i] = runSerialize(exception.at(i), map, schema.items, Value.inherit(v, { serialize }));
                })
            }
            return hooks.after(schema, 'afterSerialize', value, exception);
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
                const { name, key, schema: subSchema } = schema.discriminate(value, true)
                if (subSchema) {
                    Object.assign(value, runSerialize(exception, map, subSchema, originalValue));
                } else {
                    exception.message('Discriminator property "' + key + '" as "' + name + '" did not map to a schema');
                }
            }
            return hooks.after(schema, 'afterSerialize', value, exception);
        } else {
            exception.message('Expected an object. Received: ' + util.smart(originalValue));
        }

    } else if (schema !== true) {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = (dataTypes[schema.type] && dataTypes[schema.type][schema.format]) || {};
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
            return hooks.after(schema, 'afterSerialize', result, exception);

        } else if (type === 'integer') {
            let result = dataType.serialize({
                exception,
                schema,
                value
            });
            if (typeof result !== 'number' || isNaN(result) || result !== Math.round(result)) {
                exception.message('Unable to serialize to an integer. Received: ' + util.smart(value));
            }
            return hooks.after(schema, 'afterSerialize', result, exception);

        } else if (type === 'number') {
            let result = dataType.serialize({
                exception,
                schema,
                value
            });
            if (typeof result !== 'number' || isNaN(result)) {
                exception.message('Unable to serialize to a number. Received: ' + util.smart(value));
            }
            return hooks.after(schema, 'afterSerialize', result, exception);

        } else if (type === 'string') {
            let result = dataType.serialize({
                exception,
                schema,
                value
            });
            if (typeof result !== 'string') {
                exception.message('Unable to serialize to a string. Received: ' + util.smart(value));
            }
            return hooks.after(schema, 'afterSerialize', result, exception);
        }

    } else {
        return hooks.after(schema, 'afterSerialize', value, exception);
    }
}
