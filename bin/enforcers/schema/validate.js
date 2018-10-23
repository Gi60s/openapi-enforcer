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
const util      = require('../../util');
const Value     = require('../../../value');

const smart = util.smart;

/**
 * Validate a value
 * @param {Schema} schema A valid parsed schema.
 * @param {*} value The value to validate.
 * @returns {Exception|null}
 */
module.exports = function(schema, value) {
    const exception = Exception('Value is not valid');

    // validate the value
    validate(exception, new Map(), schema, value);

    // return the exception if an error occurred
    return exception.hasException ? exception : null;
};

function validate(exception, map, schema, originalValue) {
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
            validate(child.at(index), map, subSchema, originalValue);
        });

    } else if (schema.anyOf) {
        if (schema.discriminator) {
            const data = schema.getDiscriminator(value);
            const subSchema = data.schema;
            const key = data.key;
            if (!subSchema) {
                exception('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
            } else {
                validate(exception.at(value[key]), map, subSchema, value);
            }
        } else {
            const anyOfException = Exception('Did not validate against one or more anyOf schemas');
            const length = schema.anyOf.length;
            let valid = false;
            for (let i = 0; i < length; i++) {
                const child = anyOfException.at(i);
                validate(child, map, schema.anyOf[i], value);
                if (!child.hasException) {
                    valid = true;
                    break;
                }
            }
            if (!valid) exception(anyOfException);
        }

    } else if (schema.oneOf) {
        if (schema.discriminator) {
            const data = schema.getDiscriminator(value);
            const subSchema = data.schema;
            const key = data.key;
            if (!subSchema) {
                exception('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
            } else {
                validate(exception.at(value[key]), map, subSchema, value);
            }
        } else {
            const oneOfException = Exception('Did not validate against exactly one oneOf schema');
            const length = schema.oneOf.length;
            let valid = 0;
            for (let i = 0; i < length; i++) {
                const child = Exception('Did not validate against schema at index ' + i);
                validate(child, map, schema.oneOf[i], value);
                if (!child.hasException) {
                    valid++;
                    oneOfException('Validated against schema at index ' + i);
                } else {
                    oneOfException(child);
                }
            }
            if (valid !== 1) exception(oneOfException);
        }

    } else if (schema.not) {
        const child = Exception('');
        validate(child, map, schema, value);
        if (!child.hasException) exception('Value should not validate against schema');

    } else if (type === 'array') {
        if (!Array.isArray(value)) {
            exception('Expected an array. Received: ' + smart(value));
        } else {
            const length = value.length;
            if (schema.hasOwnProperty('maxItems') && schema.maxItems < length) {
                exception('Too many items in the array. Maximum of ' + schema.maxItems + '. Found ' + length + ' items');
            }
            if (schema.hasOwnProperty('minItems') && schema.minItems > length) {
                exception('Too few items in the array. Minimum of ' + schema.minItems + '. Found ' + length + ' items');
            }
            if (schema.uniqueItems) {
                const singles = [];
                value.forEach((item, index) => {
                    const length = singles.length;
                    let found;
                    for (let i = 0; i < length; i++) {
                        if (util.same(item, singles[i])) {
                            exception('Array items must be unique. Value is not unique at index ' + index);
                            found = true;
                            break;
                        }
                    }
                    if (!found) singles.push(item);
                });
            }
            if (schema.items) {
                value.forEach((val, index) => {
                    validate(exception.nest('One or more errors in array at index: ' + index), version, map, schema.items, val);
                });
            }
        }

    } else if (type === 'object') {
        if (!util.isPlainObject(value)) {
            exception('Expected a non-null object. Received: ' + smart(value));
        } else {
            const properties = schema.properties || {};
            const required = schema.required ? schema.required.concat() : [];
            const keys = Object.keys(value);

            // validate each property in the value
            keys.forEach(key => {
                const index = required.indexOf(key);
                if (index !== -1) required.splice(index, 1);
                if (properties.hasOwnProperty(key)) {
                    validate(exception.nest('Error with property: ' + key), version, map, properties[key], value[key]);
                } else {
                    if (schema.additionalProperties === false) {
                        exception('Property not allowed: ' + key);
                    } else if (typeof schema.additionalProperties === 'object') {
                        validate(exception.nest('Error with additional property: ' + key), version, map, schema.additionalProperties, value[key]);
                    }
                }
            });

            // validate that all required are present
            if (required.length > 0) {
                exception('One or more required properties missing: ' + required.join(', '));
            }

            // validate number of properties
            maxMin(exception, schema, 'object property count', 'maxProperties', 'minProperties', false, keys.length, schema.maxProperties, schema.minProperties);

            // if a discriminator is present then validate discriminator mapping
            if (schema.discriminator) {
                const discriminatorSchema = version.getDiscriminatorSchema(schema, value);
                if (discriminatorSchema) {
                    validate(exception, version, map, discriminatorSchema, value);
                } else {
                    exception('Unable to map discriminator schema');
                }
            }
        }

    } else if (type === 'boolean') {
        if (typeof value !== 'boolean') {
            exception('Expected a boolean. Received: ' + smart(value));
        } else {
            schema.dataTypeFormats.validate(exception, value);
        }

    } else if (type === 'integer') {
        if (isNaN(value) || Math.round(value) !== value || typeof value !== 'number') {
            exception('Expected an integer. Received: ' + smart(value));
        } else {
            maxMin(exception, schema, 'integer', 'maximum', 'minimum', true, value, schema.maximum, schema.minimum);
            if (schema.multipleOf && value % schema.multipleOf !== 0) {
                exception('Expected a multiple of ' + schema.multipleOf + '. Received: ' + smart(value));
            }
            schema.dataTypeFormats.validate(exception, value);
        }

    } else if (type === 'number') {
        if (isNaN(value) || typeof value !== 'number') {
            exception('Expected a number. Received: ' + smart(value));
        } else {
            maxMin(exception, schema, 'number', 'maximum', 'minimum', true, value, schema.maximum, schema.minimum);
            if (schema.multipleOf && value % schema.multipleOf !== 0) {
                exception('Expected a multiple of ' + schema.multipleOf + '. Received: ' + smart(value));
            }
            schema.dataTypeFormats.validate(exception, value);
        }

    } else if (schema.type === 'string') {
        if (typeof value !== 'string') {
            exception('Expected a string. Received: ' + smart(value));

        } else {
            const length = value.length;
            if (schema.hasOwnProperty('maxLength') && length > schema.maxLength) {
                exception('String too long. ' + smart(value) + ' (' + length + ') exceeds maximum length of ' + schema.maxLength);
            }

            if (schema.hasOwnProperty('minLength') && length < schema.minLength) {
                exception('String too short. ' + smart(value) + ' (' + length + ') exceeds minimum length of ' + schema.minLength);
            }

            if (schema.hasOwnProperty('pattern') && !schema.pattern.test(value)) {
                exception('String does not match required pattern ' + schema.pattern + ' with value: ' + smart(value));
            }

            schema.dataTypeFormats.validate(exception, value);
        }
    }

    // enum validation
    if (schema.enum) {
        const length = schema.enum.length;
        let found;
        for (let i = 0; i < length; i++) {
            if (util.same(value, schema.enum[i])) {
                found = true;
                break;
            }
        }
        if (!found) exception('Value ' + smart(value) + ' did not meet enum requirements');
    }
}

function maxMin(exception, schema, type, maxProperty, minProperty, exclusives, value, maximum, minimum) {
    if (schema.hasOwnProperty(maxProperty)) {
        if (exclusives && schema.exclusiveMaximum && value >= maximum) {
           exception('Expected ' + type + ' to be less than ' +
               smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
               smart(schema.serialize(value).value));
        } else if (value > maximum) {
            exception('Expected ' + type + ' to be less than or equal to ' +
                smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
                smart(schema.serialize(value).value));
        }
    }

    if (schema.hasOwnProperty(minProperty)) {
        if (exclusives && schema.exclusiveMinimum && value <= minimum) {
            exception('Expected ' + type + ' to be greater than ' +
                smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
                smart(schema.serialize(value).value));
        } else if (value < minimum) {
            exception('Expected ' + type + ' to be greater than or equal to ' +
                smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
                smart(schema.serialize(value).value));
        }
    }
}