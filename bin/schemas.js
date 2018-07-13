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
const Validate  = require('./validate');

const rxExtension = /^x-.+/;

// define what properties are allowed for which types
const validations = {}; // TODO: required, readOnly - understand placement
validations[2] = {
    common: { default: true, description: true, enum: true, example: true, externalDocs: true,
        readOnly: true, title: true, type: true, xml: true },
    formats: {
        array: {},
        boolean: {},
        integer: { int32: true, int64: true },
        number: { float: true, double: true },
        object: {},
        string: { binary: true, byte: true, date: true, 'date-time': true, password: true }
    },
    modifiers: { allOf: true },
    types: {
        array: { items: true, maxItems: true, minItems: true, uniqueItems: true },
        boolean: {},
        integer: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
        number: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
        object: { additionalProperties: true, discriminator: true, maxProperties: true, minProperties: true, properties: true, required: true },
        string: { format: true, maximum: true, minimum: true, maxLength: true, minLength: true, pattern: true }
    },
    value: 2
};
validations[3] = {
    common: { default: true, deprecated: true, description: true, enum: true, example: true, externalDocs: true,
        nullable: true, readOnly: true, title: true, type: true, writeOnly: true, xml: true },
    formats: {
        array: {},
        boolean: {},
        integer: { int32: true, int64: true },
        number: { float: true, double: true },
        object: {},
        string: { binary: true, byte: true, date: true, 'date-time': true, password: true }
    },
    modifiers: { allOf: true, anyOf: true, oneOf: true, not: true },
    types: {
        array: { items: true, maxItems: true, minItems: true, uniqueItems: true },
        boolean: {},
        integer: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
        number: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
        object: { additionalProperties: true, discriminator: true, maxProperties: true, minProperties: true, properties: true, required: true },
        string: { format: true, maxLength: true, maximum: true, minimum: true, minLength: true, pattern: true }
    },
    value: 2
};

module.exports = {

    /**
     * Merge multiple schemas and validate the final schema.
     * @param version
     * @param {object[]} schemas
     * @param {object} [options]
     * @param {boolean} [options.overwriteDiscriminator=false] Set to true to allow conflicting discriminators to overwrite the previous, otherwise causes exceptions.
     * @param {boolean} [options.orPattern=false]
     * @param {boolean} [options.throw]
     * @param {boolean} [options.validateInput=true]
     * @returns {*}
     */
    merge: (version, schemas, options) => {
        if (!Array.isArray(schemas)) throw Error('Missing required schemas to merge');
        if (!validations[version]) throw Error('Invalid version specified');

        options = Object.assign({}, options);
        if (!options.hasOwnProperty('throw')) options.throw = true;
        if (!options.hasOwnProperty('validateInput')) options.validateInput = true;
        options.map = new Map();

        // only keep schemas that are plain objects
        schemas = schemas.filter(util.isPlainObject);

        const exception = Exception('Cannot merge schemas');
        version = validations[version];

        // validate individual schemas prior to merging
        if (options.validateInput) {
            const length = schemas.length;
            for (let index = 0; index < length; index++) {
                const child = exception.nest('Invalid schema ' + index);
                validate(child, version, schemas[index], options);
            }
        }

        // if individual schemas are valid then continue
        let merged;
        if (!Exception.hasException(exception)) {

            // merge schemas and validate the merged schema
            merged = merge(exception, version, schemas, options);

            // if still no exceptions then do a final validation on the merged object
            if (!Exception.hasException(exception)) {
                validate(exception.nest('Invalid merged schema'), version, merged, options);
            }
        }

        // handle result appropriately
        return util.errorHandler(options.throw, exception, merged);
    },

    /**
     * Parse schema values with minimal validation.
     * For example, pattern converted to RegExp, date default converted to Date object, etc.
     * @param {number} version
     * @param {object} schema
     * @param {object} [options]
     */
    parse: (version, schema, options) => {
        if (!validations[version]) throw Error('Invalid version specified');
        if (!util.isPlainObject(schema)) throw Error('Invalid schema specified');

        options = Object.assign({}, options);
        if (!options.hasOwnProperty('throw')) options.throw = true;
        options.map = new Map();

        // validate the schema
        const exception = Exception('Cannot parse schema');
        version = validations[version];
        validate(exception, version, schema, options);
        if (Exception.hasException(exception)) return util.errorHandler(options.throw, exception, null);

        // begin parsing
        const value = parse(exception, version, schema, options);
        return util.errorHandler(options.throw, exception, value);
    },

    /**
     * Validate a schema. The validation is not comprehensive. It only does enough validation
     * to make sure that the schema does not contain logic that will cause the other APIs within
     * this package to crash.
     * @param {number} version
     * @param {object} schema
     * @param {object} [options]
     * @param {boolean} [options.throw=true] If exception occurs then throw.
     * @throws {Error}
     * @returns {Exception|null}
     */
    validate: (version, schema, options) => {
        if (!validations[version]) throw Error('Invalid version specified');
        if (!util.isPlainObject(schema)) throw Error('Invalid schema specified');

        options = Object.assign({}, options);
        if (!options.hasOwnProperty('throw')) options.throw = true;
        options.map = new Map();

        const exception = Exception('Schema has one or more errors');
        validate(exception, validations[version], schema, options);

        const message = exception.toString();
        if (message && options.throw) throw Error(message);
        return message ? exception : null;
    }
};

function merge(exception, version, schemas, options) {
    const length = schemas.length;
    const result = { type: (schemas[0] && schemas[0].type) || {} };

    // watch for cyclic merging
    const existing = options.map.get(schemas);
    if (existing) return existing;
    options.map.set(schemas, result);

    for (let index = 0; index < length; index++) {
        const schema = schemas[index];
        if (!schema) continue;

        // merge all schemas and then reprocess this schema
        if (schema.allOf) {
            schemas[index] = merge(exception.nest('allOf'), version, schema.allOf, options);
            index--;

        } else if (schema.anyOf || schema.oneOf || schema.not) {
            exception('Cannot merge the modifiers anyOf, oneOf, or not');

        } else {
            // validate types match
            let type = schema.type;
            if (type === 'integer' && result.type === 'number') result.type = 'integer';
            if (type === 'number' && result.type === 'integer') type = 'integer';
            if (type !== result.type) {
                exception('Incompatible types: ' + schema.type + ' and ' + result.type);
                continue;
            }

            // validate formats match
            let format = schema.format;
            if (format && !result.format) result.format = format;
            if (format !== result.format) {
                exception('Incompatible formats: ' + schema.format + ' and ' + result.format);
                continue;
            }

            switch(result.type) {
                case 'array':
                    if (schema.hasOwnProperty('maxItems')) result.maxItems = lowestNumber(schema.maxItems, result.maxItems);
                    if (schema.hasOwnProperty('minItems')) result.minItems = highestNumber(schema.minItems, result.minItems);
                    if (schema.uniqueItems) result.uniqueItems = true;
                    if (schema.items) result.items = merge(exception.nest('items'), version, [schema.items, result.items], options);
                    break;

                case 'boolean':
                    if (schema.hasOwnProperty('default')) result.default = schema.default;
                    break;

                case 'integer':
                case 'number':
                    if (schema.hasOwnProperty('maximum')) result.maximum = lowestNumber(schema.maximum, result.maximum);
                    if (schema.hasOwnProperty('minimum')) result.minimum = highestNumber(schema.minimum, result.minimum);
                    if (schema.exclusiveMaximum) result.exclusiveMaximum = true;
                    if (schema.exclusiveMinimum) result.exclusiveMinimum = true;
                    if (schema.hasOwnProperty('multipleOf')) {
                        result.multipleOf = result.multipleOf
                            ? leastCommonMultiple(result.multipleOf, schema.multipleOf)
                            : schema.multipleOf;
                    }
                    break;

                case 'object':
                    if (schema.hasOwnProperty('maxProperties')) result.maxProperties = lowestNumber(schema.maxProperties, result.maxProperties);
                    if (schema.hasOwnProperty('minProperties')) result.minProperties = highestNumber(schema.minProperties, result.minProperties);
                    if (schema.hasOwnProperty('required')) {
                        if (!result.required) {
                            result.required = schema.required.concat();
                        } else {
                            result.required = util.arrayUnique(result.required.concat(schema.required));
                        }
                    }
                    if (schema.discriminator) {
                        if (!result.discriminator || options.overwriteDiscriminator) {
                            result.discriminator = schema.discriminator;
                        } else {
                            exception('Cannot merge objects with competing discriminators (unless option.overwriteDiscriminator is set to true)');
                        }
                    }
                    if (schema.properties) {
                        if (!result.properties) result.properties = {};
                        Object.keys(schema.properties).forEach(key => {
                            result.properties[key] = merge(exception.nest('Could not merge "properties" key: ' + key),
                                version, [schema.properties[key], result.properties[key]], options);
                        })
                    }
                    if (schema.additionalProperties) {
                        if (!result.additionalProperties || result.additionalProperties === true) {
                            result.additionalProperties = schema.additionalProperties
                        } else {
                            result.additionalProperties = merge(exception.nest('Could not merge additionalProperties'),
                                version, [result.additionalProperties, schema.additionalProperties], options);
                        }

                    }
                    break;

                case 'string':
                    // TODO: date
                    if (schema.hasOwnProperty('maxLength')) result.maxLength = lowestNumber(schema.maxLength, result.maxLength);
                    if (schema.hasOwnProperty('minLength')) result.minLength = highestNumber(schema.minLength, result.minLength);
                    if (schema.hasOwnProperty('pattern')) {
                        if (!result.hasOwnProperty('pattern')) {
                            result.pattern = rxStringToRx(schema.pattern);
                        } else if (result.pattern !== schema.pattern) {
                            result.pattern = rxMerge(result.pattern, schema.pattern);
                        }
                    }
                    break;
            }

            if (schema.hasOwnProperty('default')) result.default = schema.default;
        }
    }

    return result;
}

function parse(exception, version, schema, options) {
    if (!util.isPlainObject(schema)) return;

    // watch for cyclic parsing - only parse each schema once
    const existing = options.map.get(schema);
    if (existing) return existing;

    // store new parsed value
    const result = Object.assign({}, schema);
    options.map.set(schema, result);

    const type = schema.type;
    if (schema.allOf) {
        result.allOf = parse(exception.nest('allOf'), version, schema.allOf, options);

    } else if (schema.anyOf) {
        result.anyOf = parse(exception.nest('anyOf'), version, schema.anyOf, options);

    } else if (schema.oneOf) {
        result.oneOf = parse(exception.nest('oneOf'), version, schema.oneOf, options);

    } else if (schema.not) {
        result.not = parse(exception.nest('not'), version, schema.not, options);

    } else if (type === 'array') {
        if (result.items) result.items = parse(exception.nest('items'), version, schema.items, options);

    } else if (type === 'boolean') {

    } else if (type === 'integer') {

    } else if (type === 'number') {

    } else if (type === 'object') {
        if (result.additionalProperties) result.additionalProperties = parse(exception.nest('additionalProperties'), version, schema.additionalProperties, options);
        if (result.properties) result.properties = parse(exception.nest('properties'), version, schema.properties, options);

    } else if (type === 'string') {
        switch (schema.format) {
            case 'binary':


            case 'byte':
                if (schema.hasOwnProperty('default')) schema.default = Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'base64');
                break;

            case 'date':
                break;

            case 'date-time':
                break;
        }

        // TODO: enum values
    }
}

function validate(exception, version, schema, options) {

    // watch for cyclic validation - only validate each schema once
    if (options.map.has(schema)) return;
    options.map.set(schema, true);

    // validate that only the allowed properties are specified
    const common = version.common;
    const keys = Object.keys(schema).filter(k => !rxExtension.test(k));
    const length = keys.length;
    const modifiers = [];
    const type = schema.type;
    const typeProperties = version.types[type] || {};
    for (let i = 0; i < length; i++) {
        const key = keys[i];

        // validate that the property is allowed
        if (!(common[key] || typeProperties[key] || version.modifiers[key])) {
            exception('Property not allowed: ' + key);

        // keep track of modifiers
        } else if (version.modifiers[key]) {
            modifiers.push(key);
        }
    }

    if (modifiers.length > 1) {
        exception('Cannot have multiple modifiers: ' + modifiers);

    } else if (modifiers.length === 1) {
        const modifier = modifiers[0];
        switch (modifier) {
            case 'allOf':
            case 'anyOf':
            case 'oneOf':
                if (!Array.isArray(schema[modifier])) {
                    exception('Modifier "' + modifier + '" must be an array');
                } else {
                    schema[modifier].forEach((schema, index) => {
                        validate(exception.nest(modifier + '/' + index), version, schema, options);
                    });
                }
                break;

            case 'not':
                if (!util.isPlainObject(schema.not)) {
                    exception('Modifier "not" must be an object');
                } else {
                    validate(exception.nest('not'), version, schema.not, options);
                }
                break;
        }

    } else if (!type) {
        exception('Missing required property: type');

    } else if (!version.types[type]) {
        exception('Invalid type specified. Expected one of: ' + Object.keys(version.types).join(', '));

    } else if (type === 'array') {
        if (schema.items) {
            if (util.isPlainObject(schema.items)) {
                validate(exception.nest('items'), version, schema.items, options);
            } else {
                exception('Property "items" must be an object');
            }
        }
        if (schema.hasOwnProperty('maxItems') && !isNonNegativeInteger(schema.maxItems)) {
            exception('Property "maxItems" must be a non-negative integer');
        }
        if (schema.hasOwnProperty('minItems') && !isNonNegativeInteger(schema.minItems)) {
            exception('Property "minItems" must be a non-negative integer');
        }
        if (!minMaxValid(schema.minItems, schema.maxItems)) {
            exception('Property "minItems" must be less than or equal to "maxItems"');
        }
        if (schema.hasOwnProperty('default')) {
            if (!Array.isArray(schema.default) && !defaultNullOk(schema)) {
                exception('Invalid default value. Expected an array');
            } else {
                Validate(exception.nest('Invalid default value'), schema, value);
            }
        }

    } else if (type === 'boolean') {
        if (schema.hasOwnProperty('default')) {
            if (typeof schema.default !== 'boolean' && !defaultNullOk(schema)) {
                exception('Invalid default value. Expected a boolean');
            } else {
                Validate(exception.nest('Invalid default value'), schema, value);
            }
        }

    } else if (type === 'integer') {
        if (schema.hasOwnProperty('format') && !version.formats.integer) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(version.formats.integer).join(', '));
        }
        if (schema.hasOwnProperty('maximum') && !isInteger(schema.maximum)) {
            exception('Property "maximum" must be an integer');
        }
        if (schema.hasOwnProperty('minimum') && !isInteger(schema.minimum)) {
            exception('Property "minimum" must be an integer');
        }
        if (!minMaxValid(schema.minimum, schema.maximum, schema.exclusiveMinimum, schema.exclusiveMaximum)) {
            const msg = schema.exclusiveMinimum || schema.exclusiveMaximum ? '' : ' or equal to ';
            exception('Property "minimum" must be less than ' + msg + '"maximum"');
        }
        if (schema.hasOwnProperty('multipleOf') && typeof schema.multipleOf !== 'number') {
            exception('Property "multipleOf" must be a number');
        }
        if (schema.hasOwnProperty('default')) {
            if (!isInteger(schema.default) && !defaultNullOk(schema)) {
                exception('Invalid default value. Expected an integer');
            } else {
                Validate(exception.nest('Invalid default value'), schema, value);
            }
        }

    } else if (type === 'number') {
        if (schema.hasOwnProperty('format') && !version.formats.number) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(version.formats.number).join(', '));
        }
        if (schema.hasOwnProperty('maximum') && typeof schema.maximum !== 'number') {
            exception('Property "maximum" must be a number');
        }
        if (schema.hasOwnProperty('minimum') && typeof schema.minimum !== 'number') {
            exception('Property "minimum" must be a number');
        }
        if (!minMaxValid(schema.minimum, schema.maximum, schema.exclusiveMinimum, schema.exclusiveMaximum)) {
            const msg = schema.exclusiveMinimum || schema.exclusiveMaximum ? '' : ' or equal to ';
            exception('Property "minimum" must be less than ' + msg + '"maximum"');
        }
        if (schema.hasOwnProperty('multipleOf') && typeof schema.multipleOf !== 'number') {
            exception('Property "multipleOf" must be a number');
        }
        if (schema.hasOwnProperty('default')) {
            if (typeof schema.default !== 'number' && !defaultNullOk(schema)) {
                exception('Invalid default value. Expected a number');
            } else {
                Validate(exception.nest('Invalid default value'), schema, value);
            }
        }

    } else if (type === 'object') {
        if (schema.hasOwnProperty('maxProperties') && !isNonNegativeInteger(schema.maxProperties)) {
            exception('Property "maxProperties" must be a non-negative integer');
        }
        if (schema.hasOwnProperty('minProperties') && !isNonNegativeInteger(schema.minProperties)) {
            exception('Property "minProperties" must be a non-negative integer');
        }
        if (!minMaxValid(schema.minProperties, schema.maxProperties)) {
            exception('Property "minProperties" must be less than or equal to "maxProperties"');
        }
        if (schema.hasOwnProperty('discriminator')) {
            validateDiscriminator(exception.nest('One or more errors exist with the discriminator'), version, schema, options)
        }
        if (schema.hasOwnProperty('required')) {
            if (!Array.isArray(schema.required)) {
                exception('Property "required" must be an array of strings');
            } else {
                const properties = schema.properties || {};
                const missing = schema.required.filter(key => !properties.hasOwnProperty(key));
                if (missing.length > 0) {
                    exception('Missing one or more required properties: ' + missing.join(', '));
                }
            }
        }
        if (schema.additionalProperties) {
            if (util.isPlainObject(schema.additionalProperties)) {
                validate(exception.nest('additionalProperties'), version, schema.additionalProperties, options);
            } else if (schema.additionalProperties !== true) {
                exception('Property "additionalProperties" must be an object');
            }
        }
        if (schema.properties) {
            if (!util.isPlainObject(schema.properties)) {
                exception('Property "properties" must be an object');
            } else {
                const subException = exception.nest('properties');
                Object.keys(schema.properties).forEach(key => {
                    const subSchema = schema.properties[key];
                    if (util.isPlainObject(subSchema)) {
                        validate(subException.nest(key), version, subSchema, options);
                    } else {
                        exception('Property "' + key + '" must be an object');
                    }
                })
            }
        }
        if (schema.hasOwnProperty('default')) {
            if (typeof schema.default !== 'object' && !defaultNullOk(schema)) {
                exception('Invalid default value. Expected an object');
            } else {
                Validate(exception.nest('Invalid default value'), schema, value);
            }
        }

    } else if (type === 'string') {
        if (schema.hasOwnProperty('format') && !version.formats.string) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(version.formats.string).join(', '));
        }
        if (isDateFormat(schema)) {
            let valid = true;
            if (schema.hasOwnProperty('maximum')) {
                valid = valid && Validate(exception.nest('maximum'), { type: 'string', format: schema.format }, schema.maximum);
            }
            if (schema.hasOwnProperty('minimum')) {
                valid = valid && Validate(exception.nest('minimum'), { type: 'string', format: schema.format }, schema.minimum);
            }
            if (valid && !minMaxValid(schema.maximum, schema.minimum)) {
                exception('Property "minimum" must be less than or equal to "maximum"');
            }
        } else {
            if (schema.hasOwnProperty('maximum')) {
                exception('Property "maximum" not allowed unless format is "date" or "date-time"');
            }
            if (schema.hasOwnProperty('minimum')) {
                exception('Property "minimum" not allowed unless format is "date" or "date-time"');
            }
        }
        if (schema.hasOwnProperty('maxLength') && !isNonNegativeInteger(schema.maxLength)) {
            exception('Property "maxLength" must be a non-negative integer');
        }
        if (schema.hasOwnProperty('minLength') && !isNonNegativeInteger(schema.minLength)) {
            exception('Property "minLength" must be a non-negative integer');
        }
        if (!minMaxValid(schema.minLength, schema.maxLength)) {
            exception('Property "minimum" must be less than or equal to "maximum"');
        }
        if (schema.hasOwnProperty('pattern') && typeof schema.pattern !== 'string' && !(schema.pattern instanceof RegExp)) {
            exception('Property "pattern" must be a string or a RegExp instance');
        }
        if (schema.hasOwnProperty('default')) {
            if (typeof schema.default !== 'string' && !defaultNullOk(schema)) {
                exception('Invalid default value. Expected a string');
            } else {
                Validate(exception.nest('Invalid default value'), schema, version.value);
            }
        }
    }
}





function defaultNullOk(schema) {
    return schema.nullable && schema.default === null;
}

function greatestCommonDenominator(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function highestNumber(n1, n2) {
    const t1 = typeof n1 === 'number';
    const t2 = typeof n2 === 'number';
    if (t1 && t2) return n1 < n2 ? n2 : n1;
    return t1 ? n1 : n2;
}

function isDateFormat(schema) {
    return schema.format && (schema.format === 'date' || schema.format === 'date-time');
}

function isInteger(value) {
    return typeof value === 'number' && Math.round(value) === value;
}

function isNonNegativeInteger(value) {
    return isInteger(value) && value >= 0;
}

function leastCommonMultiple(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    return (!x || !y) ? 0 : Math.abs((x * y) / greatestCommonDenominator(x, y));
}

function lowestNumber(n1, n2) {
    const t1 = typeof n1 === 'number';
    const t2 = typeof n2 === 'number';
    if (t1 && t2) return n1 > n2 ? n2 : n1;
    return t1 ? n1 : n2;
}

function minMaxValid(min, max, exclusiveMin, exclusiveMax) {
    if (min === undefined || max === undefined || min < max) return true;
    return !exclusiveMin && !exclusiveMax && min === max;
}

function rxStringToRx(value) {
    if (typeof value === 'string') {
        const rx = /^\/([\s\S]+?)\/(\w*)?$/;
        const match = rx.exec(value);
        return match
            ? RegExp(match[1], match[2] || '')
            : RegExp(value);
    } else if (value instanceof RegExp) {
        return value;
    } else {
        throw Error('Cannot convert value to RegExp instance');
    }
}

function rxMerge(rx1, rx2) {
    rx1 = rxStringToRx(rx1);
    rx2 = rxStringToRx(rx2);
    const source = rx1.source + '|' + rx2.source;
    const flags = util.arrayUnique((rx1.flags + rx2.flags).split('')).join('');
    return RegExp(source, flags);
}

function validateDiscriminator(exception, version, schema, options) {
    let discriminator = schema.discriminator;
    switch (version.value) {
        case 2:
            if (typeof discriminator !== 'string') {
                exception('Discriminator must be a string');
            } else if (!Array.isArray(schema.required) || schema.required.indexOf(discriminator) === -1) {
                exception('Property "' + discriminator + '" must be listed as required');
            }
            break;

        case 3:
            if (!discriminator || typeof discriminator !== 'object') {
                exception('Discriminator must be an object with property "propertyName" as a string');
            } else if (!discriminator.hasOwnProperty('propertyName')) {
                exception('Missing required property: propertyName');
            } else if (typeof discriminator.propertyName !== 'string') {
                exception('Property "propertyName" must be a string');
            } else {
                if (!Array.isArray(schema.required) || schema.required.indexOf(discriminator.propertyName) === -1) {
                    exception('Property "' + discriminator.propertyName + '" must be listed as required');
                }
                if (discriminator.hasOwnProperty('map') && !util.isPlainObject(discriminator.map)) {
                    exception('Property "map" must be an object');
                }
            }
            break;

        default:
            exception('Discriminators not supported for this version: ' + version.value);
            break;
    }
}