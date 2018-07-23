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
const Exception = require('./exception');
const util      = require('./util');

const smart = util.smart;

/**
 *
 * @param {Exception} exception
 * @param {object} version
 * @param {object} schema A valid parsed schema.
 * @param {*} value The value to validate.
 * @returns {boolean} true if valid, false otherwise
 */
module.exports = function(exception, version, schema, value) {
    const map = new WeakMap();
    validate(exception, version, map, schema, value);
    return !Exception.hasException(exception);
};

function validate(exception, version, map, schema, value) {
    if (!schema) return;

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
        const child = exception.nest('Did not to validate against allOf schemas');
        schema.allOf.forEach((subSchema, index) => {
            validate(child.nest('Did not against schema #' + index), version, map, subSchema, value);
        });

    } else if (schema.anyOf) {
        const anyOfException = Exception('Did not validate against one or more anyOf schemas');
        const length = schema.anyOf.length;
        let valid = false;
        for (let i = 0; i < length; i++) {
            const child = anyOfException.nest('Schema #' + index);
            validate(child, version, map, schema.anyOf[i], value);
            if (!Exception.hasException(child)) {
                valid = true;
                break;
            }
        }
        if (!valid) exception.push(anyOfException);

    } else if (schema.oneOf) {
        const oneOfException = Exception('Did not validate against exactly one oneOf schema');
        const length = schema.anyOf.length;
        let valid = 0;
        for (let i = 0; i < length; i++) {
            const child = Exception('Did not validate against schema #' + index);
            validate(child, version, map, schema.anyOf[i], value);
            if (!Exception.hasException(child)) {
                valid++;
                oneOfException.push('Validated against schema #' + index);
            } else {
                oneOfException.push(child);
            }
        }
        if (valid !== 1) exception.push(oneOfException);

    } else if (schema.not) {
        const child = Exception('');
        validate(child, version, map, schema, value);
        if (!Exception.hasException(child)) exception('Value matches schema and it must not match schema');

    } else {
        validate[schema.type](exception, version, map, schema, value);
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

validate.array = function(exception, version, map, schema, value) {
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
                validate(exception.nest('Error(s) at index: ' + index), version, map, schema.items, val);
            });
        }
    }
};

validate.binary = function(exception, version, map, schema, value) {
    if (!Buffer.isBuffer(value)) {
        exception('Expected value to be a buffer. Received: ' + smart(value));
    } else {
        maxMin(exception, schema, 'binary length', 'maxLength', 'minLength', true, value.length * 8, schema.maxLength, schema.minLength);
    }
};

validate.boolean = function(exception, version, map, schema, value) {
    if (typeof value !== 'boolean') {
        exception('Expected a boolean. Received: ' + smart(value));
    }
};

validate.byte = function(exception, version, map, schema, value) {
    if (!Buffer.isBuffer(value)) {
        exception('Expected value to be a buffer. Received: ' + smart(value));

    } else {
        maxMin(exception, schema, 'byte length', 'maxLength', 'minLength', true, value.length, schema.maxLength, schema.minLength);
    }
};

validate.date = function(exception, version, map, schema, value) {
    if (!util.isDate(value)) {
        exception('Expected a valid date object. Received: ' + smart(value));

    } else {
        maxMin(exception, schema, 'date', 'maximum', 'minimum', false, value, new Date(schema.maximum), new Date(schema.minimum));
    }
};

validate['date-time'] = function(exception, version, map, schema, value) {
    if (!util.isDate(value)) {
        exception('Expected a valid date object. Received: ' + smart(value));

    } else {
        maxMin(exception, schema, 'date-time', 'maximum', 'minimum', false, value, new Date(schema.maximum), new Date(schema.minimum));
    }
};

validate.integer = function(exception, version, map, schema, value) {
    if (isNaN(value) || Math.round(value) !== value || typeof value !== 'number') {
        exception('Expected an integer. Received: ' + smart(value));

    } else {
        maxMin(exception, schema, 'integer', 'maximum', 'minimum', true, value, schema.maximum, schema.minimum);
        if (schema.multipleOf && value % schema.multipleOf !== 0) {
            exception('Expected a multiple of ' + schema.multipleOf + '. Received: ' + smart(value));
        }
    }
};

validate.number = function(exception, version, map, schema, value) {
    if (isNaN(value) || typeof value !== 'number') {
        exception('Expected a number. Received: ' + smart(value));

    } else {
        maxMin(exception, schema, 'number', 'maximum', 'minimum', true, value, schema.maximum, schema.minimum);
        if (schema.multipleOf && value % schema.multipleOf !== 0) {
            exception('Expected a multiple of ' + schema.multipleOf + '. Received: ' + smart(value));
        }
    }
};

validate.object = function(exception, version, map, schema, value) {
    if (!value || typeof value !== 'object') {
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
                    validate(exception('Error with additional property: ' + key), version, map, schema.additionalProperties, value[key]);
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
        if (schema.discriminate) {
            const discriminatorSchema = version.getDiscriminatorSchema(schema, value);
            if (discriminatorSchema) {
                validate(exception, version, map, schema, value);
            } else {
                exception('Unable to map discriminator schema');
            }
        }
    }
};

validate.string = function(exception, version, map, schema, value) {
    const length = value.length;
    if (typeof value !== 'string') {
        exception('Expected a string. Received: ' + smart(value));

    } else {
        if (schema.hasOwnProperty('maxLength') && length > schema.maxLength) {
            exception('String too long. ' + smart(value) + ' (' + length + ') exceeds maximum length of ' + schema.maxLength);
        }

        if (schema.hasOwnProperty('minLength') && length < schema.minLength) {
            exception('String too short. ' + smart(value) + ' (' + length + ') exceeds minimum length of ' + schema.minLength);
        }

        if (schema.hasOwnProperty('pattern') && !schema.pattern.test(value)) {
            exception('String does not match required pattern ' + schema.pattern + ' with value: ' + smart(value));
        }
    }
};




function maxMin(exception, schema, type, maxProperty, minProperty, exclusives, value, maximum, minimum) {
    if (schema.hasOwnProperty(maxProperty)) {
        if (exclusives && schema.exclusiveMaximum && value >= maximum) {
           exception('Expected ' + type + ' to be less than ' + schema[maxProperty] + '. Received: ' + smart(value));
        } else if (value > maximum) {
            exception('Expected ' + type + ' to be less than or equal to ' + schema[maxProperty] + '. Received: ' + smart(value));
        }
    }

    if (schema.hasOwnProperty(minProperty)) {
        if (exclusives && schema.exclusiveMinimum && value <= minimum) {
            exception('Expected ' + type + ' to be greater than ' + schema[minProperty] + '. Received: ' + smart(value));
        } else if (value < minimum) {
            exception('Expected ' + type + ' to be greater than or equal to ' + schema[minProperty] + '. Received: ' + smart(value));
        }
    }
}