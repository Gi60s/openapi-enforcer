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
const Exception     = require('./exception');
const rx            = require('./rx');
const util          = require('./util');
const validate      = require('./validate');

const rxExtension = /^x-.+/;
const store = new WeakMap();
const validations = getValidationsMap();

module.exports = builder;

function builder(version, schema, options) {
    // schema may already be a Schema instance
    if (schema instanceof Schema) return schema;

    // validate input
    if (!validations[version]) throw Error('Invalid version specified');
    if (!util.isPlainObject(schema)) throw Error('Invalid schema specified');

    // normalize options
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('throw')) options.throw = true;

    // create the exception instance
    const exception = Exception('Schema has one or more errors');

    // build the schema
    const instance = new Schema(exception, validations[version], schema, options, new Map());

    // store the schema protected variables
    const data = {
        hasException: Exception.hasException(exception),
        exception: exception,
        version: version
    };
    store.set(instance, data);

    // if there is an error and we're throwing then throw now
    if (options.throw && data.hasException) throw Error(exception.toString());

    return instance;
}

builder.getException = function(instance) {
    const data = store.get(instance);
    if (!data) throw Error('Expected a Schema instance type');
    return data.exception;
};

builder.getVersion = function(instance) {
    const data = store.get(instance);
    if (!data) throw Error('Expected a Schema instance type');
    return data.version;
};

builder.hasException = function(instance) {
    const data = store.get(instance);
    if (!data) throw Error('Expected a Schema instance type');
    return data.hasException;
};

builder.merge = function(schemas) {

};

builder.Schema = Schema;


function Schema(exception, version, schema, options, map) {

    // already processed schema instances can be returned now
    if (schema instanceof Schema) return schema;

    // watch for cyclic building
    const existing = map.get(schema);
    if (existing) return existing;
    map.set(schema, this);

    // validate that only the allowed properties are specified and copy properties to this
    const common = version.common;
    const keys = Object.keys(schema).filter(k => !rxExtension.test(k));
    const length = keys.length;
    const modifiers = [];
    let skipDefaultValidations = false;
    const skipEnumValidationsIndexes = {};
    const type = schema.type;
    const typeProperties = version.types[type] || {};
    for (let i = 0; i < length; i++) {
        const key = keys[i];

        // validate that the property is allowed
        if (!(common[key] || typeProperties[key] || version.modifiers[key])) {
            exception('Property not allowed: ' + key);

        } else {
            this[key] = schema[key];

            // keep track of modifiers
            if (version.modifiers[key]) modifiers.push(key);
        }
    }

    // cannot have multiple of allOf, oneOf, anyOf, not, etc.
    if (modifiers.length > 1) {
        exception('Cannot have multiple modifiers: ' + modifiers.join(', '));

    } else if (modifiers.length === 1) {
        const modifier = modifiers[0];
        switch (modifier) {
            case 'allOf':
            case 'anyOf':
            case 'oneOf':
                if (!Array.isArray(this[modifier])) {
                    exception('Modifier "' + modifier + '" must be an array');
                } else {
                    this[modifier] = this[modifier]
                        .map((schema, index) => new Schema(exception.nest(modifier + '/' + index), version, schema, options, map));
                }
                break;

            case 'not':
                if (!util.isPlainObject(this.not)) {
                    exception('Modifier "not" must be an object');
                } else {
                    this.not = new Schema(exception.nest('not'), version, this.not, options, map);
                }
                break;
        }

    } else if (!type) {
        exception('Missing required property: type');

    } else if (!version.types[type]) {
        exception('Invalid type specified. Expected one of: ' + Object.keys(version.types).join(', '));

    } else if (type === 'array') {
        if (this.items) {
            if (util.isPlainObject(this.items)) {
                this.items = new Schema(exception.nest('items'), version, this.items, options, map);
            } else {
                exception('Property "items" must be an object');
            }
        }
        if (this.hasOwnProperty('maxItems') && !isNonNegativeInteger(this.maxItems)) {
            exception('Property "maxItems" must be a non-negative integer');
        }
        if (this.hasOwnProperty('minItems') && !isNonNegativeInteger(this.minItems)) {
            exception('Property "minItems" must be a non-negative integer');
        }
        if (!minMaxValid(this.minItems, this.maxItems)) {
            exception('Property "minItems" must be less than or equal to "maxItems"');
        }

    } else if (type === 'boolean') {
        // nothing to do here (yet)

    } else if (type === 'integer') {
        if (this.hasOwnProperty('format') && !version.formats.integer[this.format]) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(version.formats.integer).join(', '));
        }
        if (this.hasOwnProperty('maximum') && !isInteger(this.maximum)) {
            exception('Property "maximum" must be an integer');
        }
        if (this.hasOwnProperty('minimum') && !isInteger(this.minimum)) {
            exception('Property "minimum" must be an integer');
        }
        if (!minMaxValid(this.minimum, this.maximum, this.exclusiveMinimum, this.exclusiveMaximum)) {
            const msg = this.exclusiveMinimum || this.exclusiveMaximum ? '' : 'or equal to ';
            exception('Property "minimum" must be less than ' + msg + '"maximum"');
        }
        if (this.hasOwnProperty('multipleOf') && (!isInteger(this.multipleOf) || this.multipleOf < 1)) {
            exception('Property "multipleOf" must be a positive integer');
        }

    } else if (type === 'number') {
        if (this.hasOwnProperty('format') && !version.formats.number[this.format]) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(version.formats.number).join(', '));
        }
        if (this.hasOwnProperty('maximum') && typeof this.maximum !== 'number') {
            exception('Property "maximum" must be a number');
        }
        if (this.hasOwnProperty('minimum') && typeof this.minimum !== 'number') {
            exception('Property "minimum" must be a number');
        }
        if (!minMaxValid(this.minimum, this.maximum, this.exclusiveMinimum, this.exclusiveMaximum)) {
            const msg = this.exclusiveMinimum || this.exclusiveMaximum ? '' : 'or equal to ';
            exception('Property "minimum" must be less than ' + msg + '"maximum"');
        }
        if (this.hasOwnProperty('multipleOf') && (typeof this.multipleOf !== 'number' || this.multipleOf === 0)) {
            exception('Property "multipleOf" must be a positive number');
        }

    } else if (type === 'object') {
        if (this.hasOwnProperty('maxProperties') && !isNonNegativeInteger(this.maxProperties)) {
            exception('Property "maxProperties" must be a non-negative integer');
        }
        if (this.hasOwnProperty('minProperties') && !isNonNegativeInteger(this.minProperties)) {
            exception('Property "minProperties" must be a non-negative integer');
        }
        if (!minMaxValid(this.minProperties, this.maxProperties)) {
            exception('Property "minProperties" must be less than or equal to "maxProperties"');
        }
        if (this.hasOwnProperty('discriminator')) {
            const child = exception.nest('One or more errors exist with the discriminator');
            let discriminator = schema.discriminator;
            switch (version.value) {
                case 2:
                    if (typeof discriminator !== 'string') {
                        child('Discriminator must be a string');
                    } else if (!Array.isArray(schema.required) || schema.required.indexOf(discriminator) === -1) {
                        child('Property "' + discriminator + '" must be listed as required');
                    }
                    break;

                case 3:
                    if (!discriminator || typeof discriminator !== 'object') {
                        child('Discriminator must be an object with property "propertyName" as a string');
                    } else if (!discriminator.hasOwnProperty('propertyName')) {
                        child('Missing required property: propertyName');
                    } else if (typeof discriminator.propertyName !== 'string') {
                        child('Property "propertyName" must be a string');
                    } else {
                        if (!Array.isArray(schema.required) || schema.required.indexOf(discriminator.propertyName) === -1) {
                            child('Property "' + discriminator.propertyName + '" must be listed as required');
                        }
                        if (discriminator.hasOwnProperty('map') && !util.isPlainObject(discriminator.map)) {
                            child('Property "map" must be an object');
                        }
                    }
                    break;

                default:
                    child('Discriminators not supported for this version: ' + version.value);
                    break;
            }
        }
        if (this.hasOwnProperty('required')) {
            if (!Array.isArray(this.required)) {
                exception('Property "required" must be an array of strings');
            } else {
                const properties = this.properties || {};
                const missing = this.required.filter(key => !properties.hasOwnProperty(key));
                if (missing.length > 0) {
                    exception('Missing one or more required properties: ' + missing.join(', '));
                }
            }
        }
        if (this.additionalProperties) {
            if (util.isPlainObject(this.additionalProperties)) {
                this.additionalProperties = new Schema(exception.nest('additionalProperties'), version, this.additionalProperties, options, map);
            } else if (this.additionalProperties !== true) {
                exception('Property "additionalProperties" must be an object');
            }
        }
        if (this.properties) {
            if (!util.isPlainObject(this.properties)) {
                exception('Property "properties" must be an object');
            } else {
                const subException = exception.nest('properties');
                Object.keys(this.properties).forEach(key => {
                    const subSchema = this.properties[key];
                    if (util.isPlainObject(subSchema)) {
                        this.properties[key] = new Schema(subException.nest(key), version, subSchema, options, map);
                    } else {
                        exception('Property "' + key + '" must be an object');
                    }
                })
            }
        }

    } else if (type === 'string') {
        if (this.hasOwnProperty('format') && !version.formats.string[this.format]) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(version.formats.string).join(', '));
        }
        if (isDateFormat(this)) {
            let valid = true;
            if (this.hasOwnProperty('maximum')) {
                if (!rx[this.format].test(this.maximum)) {
                    exception('Property "maximum" is not formatted as a ' + this.format);
                    valid = false;
                } else {
                    const date = getDateFromValidDateString(this.format, this.maximum);
                    if (!date) {
                        exception('Property "maximum" is not a valid ' + this.format);
                        valid = false;
                    } else {
                        this.maximum = date;
                    }
                }
            }
            if (this.hasOwnProperty('minimum')) {
                if (!rx[this.format].test(this.minimum)) {
                    exception('Property "minimum" is not formatted as a ' + this.format);
                    valid = false;
                } else {
                    const date = getDateFromValidDateString(this.format, this.minimum);
                    if (!date) {
                        exception('Property "minimum" is not a valid ' + this.format);
                        valid = false;
                    } else {
                        this.minimum = date;
                    }
                }
            }
            if (valid && !minMaxValid(this.minimum, this.maximum, this.exclusiveMinimum, this.exclusiveMaximum)) {
                const msg = this.exclusiveMinimum || this.exclusiveMaximum ? '' : 'or equal to ';
                exception('Property "minimum" must be less than ' + msg + '"maximum"');
            }
        } else {
            if (this.hasOwnProperty('maximum')) {
                exception('Property "maximum" not allowed unless format is "date" or "date-time"');
            }
            if (this.hasOwnProperty('minimum')) {
                exception('Property "minimum" not allowed unless format is "date" or "date-time"');
            }
            if (this.hasOwnProperty('exclusiveMaximum')) {
                exception('Property "exclusiveMaximum" not allowed unless format is "date" or "date-time"');
            }
            if (this.hasOwnProperty('exclusiveMinimum')) {
                exception('Property "exclusiveMinimum" not allowed unless format is "date" or "date-time"');
            }
        }
        if (this.hasOwnProperty('maxLength') && !isNonNegativeInteger(this.maxLength)) {
            exception('Property "maxLength" must be a non-negative integer');
        }
        if (this.hasOwnProperty('minLength') && !isNonNegativeInteger(this.minLength)) {
            exception('Property "minLength" must be a non-negative integer');
        }
        if (!minMaxValid(this.minLength, this.maxLength)) {
            exception('Property "minimum" must be less than or equal to "maximum"');
        }
        if (this.hasOwnProperty('pattern') && typeof this.pattern !== 'string' && !(this.pattern instanceof RegExp)) {
            exception('Property "pattern" must be a string or a RegExp instance');
        }

        // parse pattern string into a regular expression
        if (this.pattern) this.pattern = rxStringToRx(this.pattern);

        // parse default value
        if (this.hasOwnProperty('default')) {
            const data = parseSchemaValue(exception.nest('Unable to parse default value'), this, this.default);
            if (!data.error) {
                this.default = data.value;
            } else {
                skipDefaultValidations = true;
            }
        }

        // parse enum values
        if (this.hasOwnProperty('enum')) {
            const length = this.enum.length;
            const enums = [];
            for (let i = 0; i < length; i++) {
                const data = parseSchemaValue(exception.nest('Unable to parse enum value at index ' + i), this, this.enum[i]);
                if (!data.error) {
                    this.enums.push(data.value);
                } else {
                    skipEnumValidationsIndexes[i] = true;
                }
            }
        }
    }

    if (type) {
        // validate default value
        if (this.hasOwnProperty('default') && !skipDefaultValidations) {
            validate(exception('Invalid default value'), version.value, this, this.default);
        }

        // validate enum values
        if (this.hasOwnProperty('enum')) {
            const length = this.enum.length;
            for (let i = 0; i < length; i++) {
                if (!skipEnumValidationsIndexes[i]) {
                    validate(exception('Invalid enum value at index ' + i), version.value, this, this.enum[i]);
                }
            }
        }
    }

}

Object.defineProperties(Schema.prototype, {
    exception: {
        get: function() { return builder.getException(this) }
    },
    hasException: {
        get: function() { return builder.hasException(this) }
    }
});




function getDateFromValidDateString(format, string) {
    const date = new Date(string);
    const match = rx[format].exec(string);
    const year = +match[1];
    const month = +match[2] - 1;
    const day = +match[3];
    const hour = +match[4] || 0;
    const minute = +match[5] || 0;
    const second = +match[6] || 0;
    const millisecond = +match[7] || 0;
    return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month &&
        date.getUTCDate() === day &&
        date.getUTCHours() === hour &&
        date.getUTCMinutes() === minute &&
        date.getUTCSeconds() === second &&
        date.getUTCMilliseconds() === millisecond ? date : null;
}

function getValidationsMap() {
    // define what properties are allowed for which types
    const validations = {};
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
            string: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, maxLength: true, minLength: true, pattern: true }
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
            string: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maxLength: true, maximum: true, minimum: true, minLength: true, pattern: true }
        },
        value: 2
    };
    return validations;
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
    if (min === undefined || max === undefined) return true;
    min = +min;
    max = +max;
    return min < max || (!exclusiveMin && !exclusiveMax && min === max);
}

function parseSchemaValue(exception, schema, value) {
    const format = schema.format;
    let data;
    switch (format) {
        case 'binary':
        case 'byte':
        case 'date':
        case 'date-time':
            data = parseValue[format](value);
            if (data.error) {
                exception.push(data.error);
                return { error: true };
            } else {
                return { value: data.value };
            }

        default:
            return { value: value };
    }
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