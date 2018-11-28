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
const util              = require('../util');
const Value             = require('../value');

module.exports = runValidate;

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