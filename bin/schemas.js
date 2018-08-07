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

// define what properties are allowed for which types
const validations = {};
validations[2] = {
    array: ['items', 'maxItems', 'minItems', 'uniqueItems'],
    common: ['discriminator', 'enum', 'default', 'title', 'description', 'required', 'type'],
    formats: ['byte', 'binary', 'date', 'date-time', 'password'],   // only string formats
    integer: ['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multipleOf'],
    modifiers: ['allOf'],
    number: ['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multipleOf'],
    object: ['additionalProperties', 'maxProperties', 'minProperties', 'properties'],
    string: ['format', 'maxLength', 'minLength', 'pattern'],
    types: ['array', 'boolean', 'integer', 'number', 'object', 'string']
};
validations[3] = {
    array: validations[2].array.concat(),
    common: validations[2].common.concat(['readOnly', 'writeOnly']),
    formats: validations[2].formats.concat(),
    integer: validations[2].integer.concat(),
    modifiers: validations[2].modifiers.concat(['anyOf', 'oneOf', 'not']),
    number: validations[2].number.concat(),
    object: validations[2].object.concat(),
    string: validations[2].string.concat(),
    types: validations[2].types.concat()
};

module.exports = {

    /**
     * Merge multiple schemas.
     * @param version
     * @param {object[]} schemas
     * @param {object} [options]
     * @param {boolean} [options.throw]
     * @returns {*}
     */
    merge: (version, schemas, options) => {
        if (!validations[version]) throw Error('Invalid version specified');

        if (!options) options = {};
        if (!options.hasOwnProperty('throw')) options.throw = true;

        const exception = Exception('Cannot merge schemas');
        const merged = merge(exception, validations[version], schemas, options);
        return util.errorHandler(options.throw, exception, merged);
    },

    /**
     * Validate a schema. The validation is not comprehensive. It only does enough validation
     * to make sure that the schema does not contain logic that will cause the other APIs within
     * this package to crash.
     * @param {number} version
     * @param {object} schema
     * @param {object} [options]
     * @param {boolean} [options.defaults=false] Whether to validate defaults.
     * @param {boolean} [options.throw=true] If exception occurs then throw.
     * @throws {Error}
     * @returns {Exception|null}
     */
    validate: (version, schema, options) => {
        if (!validations[version]) throw Error('Invalid version specified');

        if (!options) options = {};
        if (!options.hasOwnProperty('defaults')) options.defaults = false;
        if (!options.hasOwnProperty('throw')) options.throw = true;

        const exception = Exception('Schema has one or more critical errors');
        validate(exception, validations[version], schema, options);

        const message = exception.toString();
        if (message && options.throw) throw Error(message);
        return message ? exception : null;
    }
};

function merge(exception, version, schemas, options) {
    const length = schemas.length;
    const parent = exception;
    const result = {
        type: schemas[0] && schemas[0].type
    };
    
    if (!Array.isArray(schemas)) return;

    for (let index = 0; index < length; index++) {
        const schema = schemas[index];
        if (schema) {
            const exception = parent.nest(index);
            
            // individual schema must be valid prior to continuing
            validate(exception, version, schema, options);
            if (Exception.hasException(exception)) return;

            const keys = Object.keys(schema);
            const modifiers = keys.filter(k => version.modifiers.indexOf(k) !== -1);

            if (modifiers.length > 0) {
                exception('Cannot have multiple modifiers: ' + modifiers);

            } else if (modifiers.length === 1) {
                const modifier = modifiers[0];
                switch (modifier) {
                    case 'allOf':
                        Object.assign(result, merge(exception.nest('allOf'), version, schema.allOf, options));
                        break;
                        
                    case 'anyOf':
                    case 'oneOf':
                    case 'not':
                        exception('Cannot merge modifiers: anyOf, oneOf, not');
                        break;
                }

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
                if (type === 'string') {
                    let format = schema.format;
                    if (format && !result.format) result.format = format;
                    if (format !== result.format) {
                        exception('Incompatible formats: ' + schema.format + ' and ' + result.format);
                        continue;
                    }
                }

                switch(result.type) {
                    case 'array':
                        if (schema.hasOwnProperty('maxItems')) result.maxItems = lowestNumber(schema.maxItems, result.maxItems);
                        if (schema.hasOwnProperty('minItems')) result.minItems = highestNumber(schema.minItems, result.minItems);
                        if (schema.items) schema.items = merge(exception.nest('items'), version, [schema.items, result.items], options);
                        break;

                    case 'boolean':
                        if (schema.hasOwnProperty('default')) result.default = schema.default;
                        break;

                    case 'integer':
                    case 'number':
                        if (schema.hasOwnProperty('maximum')) result.maximum = lowestNumber(schema.maximum, result.maximum);
                        if (schema.hasOwnProperty('minimum')) result.minimum = highestNumber(schema.minimum, result.minimum);
                        if (schema.hasOwnProperty('multipleOf')) {
                            result.multipleOf = result.multipleOf
                                ? leastCommonMultiple(result.multipleOf, schema.multipleOf)
                                : schema.multipleOf;
                        }
                        break;

                    case 'object':
                        if (schema.hasOwnProperty('maxProperties')) result.maxProperties = lowestNumber(schema.maxProperties, result.maxProperties);
                        if (schema.hasOwnProperty('minProperties')) result.minItems = highestNumber(schema.minProperties, result.minProperties);
                        if (schema.properties) {
                            if (!result.properties) result.properties = {};
                            Object.keys(schema.properties).forEach(key => {
                                result.properties[key] = merge(exception.nest('properties/' + key),
                                    version, [schema.properties[key], result.properties[key]], options);
                            })
                        }
                        if (schema.additionalProperties) {
                            result.additionalProperties = merge(exception.nest('additionalProperties'),
                                version, schema.additionalProperties, options);
                        }
                        break;

                    case 'string':
                        if (schema.hasOwnProperty('maxLength')) result.maxLength = lowestNumber(schema.maxLength, result.maxLength);
                        if (schema.hasOwnProperty('minLength')) result.minLength = highestNumber(schema.minLength, result.minLength);
                        break;
                }

                if (schema.hasOwnProperty('default')) result.default = schema.default;
            }
        }
    }

    // validate merged result
    const mergedException = Exception('Merged schema is not valid');
    validate(mergedException, version, result, options);
    if (Exception.hasException(mergedException)) exception.push(mergedException);

    return result;
}

// TODO: validate defaults against schema
function validate(exception, version, schema, options) {
    if (!schema) return;

    const keys = Object.keys(schema);
    const modifiers = keys.filter(k => version.modifiers.indexOf(k) !== -1);

    if (modifiers.length > 0) {
        exception('Cannot have multiple modifiers: ' + modifiers);

    } else if (modifiers.length === 1) {
        const modifier = modifiers[0];
        switch (modifier) {
            case 'allOf':
            case 'anyOf':
            case 'oneOf':
                if (!Array.isArray(schema[modifier])) {
                    exception('Property ' + modifier + ' must be an array');
                } else {
                    schema.allOf.forEach((schema, index) => {
                        validate(exception.nest(modifier + '/' + index), version, schema, options);
                    });
                }
                break;

            case 'not':
                validate(exception.nest('not'), version, schema.not, options);
                break;
        }

    } else if (!schema.type) {
        exception('Missing required property: type');

    } else if (version.types.indexOf(schema.type) === -1) {
        exception('Invalid type specified. Expected one of: ' + version.types.join(', '));

    } else {
        switch(schema.type) {
            case 'array':
                if (schema.hasOwnProperty('maxItems') && !isInteger(schema.maxItems)) {
                    exception('Property maxItems must be an integer');
                }
                if (schema.hasOwnProperty('minItems') && !isInteger(schema.minItems)) {
                    exception('Property minItems must be an integer');
                }
                if (!minMaxValid(schema.minItems, schema.maxItems)) {
                    exception('Property minItems must be less than or equal to maxItems');
                }
                if (schema.items) {
                    validate(exception.nest('items'), version, schema.items, options);
                }
                if (options.defaults && schema.hasOwnProperty('default') && !Array.isArray(schema.default)) {
                    exception('Invalid default value. Expected an array');
                }
                break;

            case 'boolean':
                if (options.defaults && schema.hasOwnProperty('default') && typeof schema.default !== 'boolean') {
                    exception('Invalid default value. Expected a boolean');
                }
                break;

            case 'integer':
                if (schema.hasOwnProperty('maximum') && !isInteger(schema.maximum)) {
                    exception('Property maximum must be an integer');
                }
                if (schema.hasOwnProperty('minimum') && !isInteger(schema.minimum)) {
                    exception('Property minimum must be an integer');
                }
                if (!minMaxValid(schema.minimum, schema.maximum, schema.exclusiveMinimum, schema.exclusiveMaximum)) {
                    exception('Property minimum must be less than or equal to maximum');
                }
                if (schema.hasOwnProperty('multipleOf') && typeof schema.multipleOf !== 'number') {
                    exception('Property multipleOf must be a number');
                }
                if (options.defaults && schema.hasOwnProperty('default') && !isInteger(schema.default)) {
                    exception('Invalid default value. Expected an integer');
                }
                break;

            case 'number':
                if (schema.hasOwnProperty('maximum') && typeof schema.maximum !== 'number') {
                    exception('Property maximum must be a number');
                }
                if (schema.hasOwnProperty('minimum') && typeof schema.minimum !== 'number') {
                    exception('Property minimum must be a number');
                }
                if (!minMaxValid(schema.minimum, schema.maximum, schema.exclusiveMinimum, schema.exclusiveMaximum)) {
                    exception('Property minimum must be less than or equal to maximum');
                }
                if (schema.hasOwnProperty('multipleOf') && typeof schema.multipleOf !== 'number') {
                    exception('Property multipleOf must be a number');
                }
                if (options.defaults && schema.hasOwnProperty('default') && typeof schema.default !== 'number') {
                    exception('Invalid default value. Expected a number');
                }
                break;

            case 'object':
                if (schema.hasOwnProperty('maxProperties') && !isInteger(schema.maxProperties)) {
                    exception('Property maxProperties must be an integer');
                }
                if (schema.hasOwnProperty('minProperties') && !isInteger(schema.minProperties)) {
                    exception('Property minProperties must be an integer');
                }
                if (!minMaxValid(schema.minProperties, schema.maxProperties)) {
                    exception('Property minimum must be less than or equal to maximum');
                }
                if (schema.properties) {
                    Object.keys(schema.properties).forEach(key => {
                        validate(exception.nest('properties/' + key), version, schema.properties[key], options);
                    })
                }
                if (schema.additionalProperties) {
                    validate(exception.nest('additionalProperties'), version, schema.additionalProperties, options);
                }
                if (options.defaults && schema.hasOwnProperty('default') && typeof schema.default !== 'object') {
                    exception('Invalid default value. Expected an object');
                }
                break;

            case 'string':
                if (schema.hasOwnProperty('maxLength') && !isInteger(schema.maxLength)) {
                    exception('Property maxLength must be an integer');
                }
                if (schema.hasOwnProperty('minLength') && !isInteger(schema.minLength)) {
                    exception('Property minLength must be an integer');
                }
                if (!minMaxValid(schema.minLength, schema.maxLength)) {
                    exception('Property minimum must be less than or equal to maximum');
                }
                if (schema.hasOwnProperty('format') && version.formats.indexOf(schema.format) === -1) {
                    exception('Invalid format specified. Expected one of: ' + version.formats.join(', '));
                }
                if (options.defaults && schema.hasOwnProperty('default') && typeof schema.default !== 'string') {
                    exception('Invalid default value. Expected a string');
                }
                break;
        }
    }
}

function isInteger(value) {
    return typeof value === 'number' && Math.round(value) === value;
}

function minMaxValid(min, max, exclusiveMin, exclusiveMax) {
    if (min === undefined || max === undefined || min < max) return true;
    return !exclusiveMin && !exclusiveMax && min === max;
}

function lowestNumber(n1, n2) {
    const t1 = typeof n1 === 'number';
    const t2 = typeof n2 === 'number';
    if (t1 && t2) return n1 > n2 ? n2 : n1;
    return t1 ? n1 : n2;
}

function highestNumber(n1, n2) {
    const t1 = typeof n1 === 'number';
    const t2 = typeof n2 === 'number';
    if (t1 && t2) return n1 < n2 ? n2 : n1;
    return t1 ? n1 : n2;
}

function leastCommonMultiple(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    return (!x || !y) ? 0 : Math.abs((x * y) / greatestCommonDenominator(x, y));
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