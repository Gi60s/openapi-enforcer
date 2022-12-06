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
const hooks             = require('./hooks')
const Exception         = require('../exception');
const util              = require('../util');
const Value             = require('./value');

module.exports = runValidate;

/**
 *
 * @param exception
 * @param map
 * @param schema
 * @param originalValue
 * @param options
 * @param {object} options
 * @param {boolean} [options.enum] Set to false to skip enum validation.
 * @param {boolean} [options.isExample] If the passed in value is an example then set this to true.
 * @param {boolean} [options.maxMin] Set to false to skip max min validation.
 * @param {'read', 'write} [options.readWriteMode] Set to 'read' if in read only mode or to 'write' if write only mode.
 * @returns {*}
 */
function runValidate(exception, map, schema, originalValue, options) {
    let { validate, value } = Value.getAttributes(originalValue);
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

    const hookResult = hooks.runHooks(schema, 'beforeValidate', value, exception)
    value = hookResult.value
    if (hookResult.done) return value

    // if nullable and null then skip all other validation
    if (value === null && (schema.nullable || schema['x-nullable'])) return hooks.after(schema, 'afterValidate', value, exception);

    if (schema.allOf) {
        const child = exception.nest('Did not validate against all schemas');
        schema.allOf.forEach((subSchema, index) => {
            runValidate(child.at(index), map, subSchema, originalValue, options);
        });

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            const data = schema.discriminate(value, true);
            const subSchema = data.schema;
            const key = data.key;
            if (!subSchema) {
                exception.message('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
            } else {
                const child = exception.at(value[key])
                runValidate(child, map, subSchema, value, options);
            }
        } else {
            const anyOfException = Exception('Did not validate against at least one schema');
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
            if (!valid) {
                exception.push(anyOfException);
            }
        }

    } else if (schema.oneOf) {
        if (schema.discriminator) {
            const { name, key, schema: subSchema } = schema.discriminate(value, true);
            if (!subSchema) {
                exception.message('Discriminator property "' + key + '" as "' + name + '" did not map to a schema');
            } else {
                const child = exception.at(value[key])
                runValidate(child, map, subSchema, value, options);
            }
        } else {
            const oneOfException = Exception('Did not validate against exactly one schema');
            const length = schema.oneOf.length;
            let valid = 0;
            for (let i = 0; i < length; i++) {
                const child = Exception('Invalid value');
                runValidate(child, map, schema.oneOf[i], value, options);
                if (!child.hasException) {
                    valid++;
                    oneOfException.at(i).message('Valid value');
                } else {
                    oneOfException.at(i).push(child);
                }
            }
            if (valid !== 1) {
                exception.push(oneOfException);
            }
        }

    } else if (schema.not) {
        const child = Exception('');
        runValidate(child, map, schema.not, value, options);
        if (!child.hasException) {
            exception.message('Value should not validate against schema');
        }

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
        if (!util.isObject(value)) {
            exception.message('Expected a non-null object. Received: ' + util.smart(value));
        } else {
            const properties = schema.properties || {};
            const readWriteMode = options.readWriteMode;
            const readWriteOnly = [];
            const required = schema.required ?
                schema.required.filter(name => {
                    const prop = properties[name]
                    if (!options.readWriteMode || !prop) return true
                    if (options.readWriteMode === 'write' && !prop.readOnly) return true
                    if (options.readWriteMode === 'read' && !prop.writeOnly) return true
                    return false
                })
                : [];
            const keys = Object.keys(value);

            // validate each property in the value
            keys.forEach(key => {
                // remove item for required remaining array
                const index = required.indexOf(key);
                if (index !== -1) required.splice(index, 1);

                if (properties.hasOwnProperty(key)) {
                    const prop = properties[key]
                    if ((readWriteMode === 'write' && prop.readOnly) || (readWriteMode === 'read' && prop.writeOnly)) readWriteOnly.push(key)
                    runValidate(exception.at(key), map, prop, value[key], options);
                } else {
                    if (schema.additionalProperties === false) {
                        exception.at(key).message('Property not allowed');
                    } else if (typeof schema.additionalProperties === 'object') {
                        const prop = schema.additionalProperties
                        if ((readWriteMode === 'write' && prop.readOnly) || (readWriteMode === 'read' && prop.writeOnly)) readWriteOnly.push(key)
                        runValidate(exception.at(key), map, schema.additionalProperties, value[key], options);
                    } else if (options.isExample) {
                        const enforcerConfig = require('../../').config
                        if (enforcerConfig.examplesWarnAdditionalProperty === true) {
                            exception.at(key).message('Property is an additional property');
                        }
                    }
                }
            });

            // validate that all required are present
            if (required.length > 0) {
                exception.message('One or more required properties missing: ' + required.join(', '));
            }

            // validate that we only have readable or writable properties
            if (readWriteOnly.length > 0) {
                if (readWriteMode === 'write') {
                    exception.message('Cannot write to read only properties: ' + readWriteOnly.join(', '));
                } else if (readWriteMode === 'read') {
                    exception.message('Cannot read from write only properties: ' + readWriteOnly.join(', '));
                }
            }

            // validate number of properties
            maxMin(exception, schema, 'object property count', 'maxProperties', 'minProperties', false, keys.length, schema.maxProperties, schema.minProperties);

            // if a discriminator is present then validate discriminator mapping
            if (schema.discriminator) {
                const details = schema.discriminate(value, true);
                const { name, key } = details;
                if (details.schema) {
                    runValidate(exception, map, details.schema, value, options);
                } else if (name) {
                    exception.message('Discriminator property "' + key + '" as "' + name + '" did not map to a schema');
                } // else - already taken care of because it's a missing required error
            }
        }

    } else {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = (dataTypes[schema.type] && dataTypes[schema.type][schema.format]) || { validate: null };

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
                if (schema.multipleOf && !Number.isInteger(value / schema.multipleOf)) {
                    exception.message('Expected a multiple of ' + schema.multipleOf + '. Received: ' + util.smart(value));
                }
            }

        } else if (schema.type === 'string') {
            if (typeof value !== 'string') {
                exception.message('Expected a string. Received: ' + util.smart(value));
            } else {
                const length = value.length;
                if (schema.hasOwnProperty('maxLength') && length > schema.maxLength) {
                    exception.message('String too long. ' + util.smart(value) + ' (' + length + ') above maximum length of ' + schema.maxLength);
                }

                if (schema.hasOwnProperty('minLength') && length < schema.minLength) {
                    exception.message('String too short. ' + util.smart(value) + ' (' + length + ') below minimum length of ' + schema.minLength);
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

    hooks.after(schema, 'afterValidate', value, exception, true);
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
