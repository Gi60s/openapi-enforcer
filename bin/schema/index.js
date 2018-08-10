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
const Exception     = require('../exception');
const populate      = require('./populate');
const random        = require('./random');
const rx            = require('../rx');
const serial        = require('./serialize');
const util          = require('../util');
const validate      = require('./validate');

const rxExtension = /^x-.+/;
const store = new WeakMap();

module.exports = Schema;

const validationsMap = {
    2: {
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
        composites: { allOf: true },
        types: {
            array: { items: true, maxItems: true, minItems: true, uniqueItems: true },
            boolean: {},
            integer: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
            number: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
            object: { additionalProperties: true, discriminator: true, maxProperties: true, minProperties: true, properties: true, required: true },
            string: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, maxLength: true, minLength: true, pattern: true }
        }
    },
    3: {
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
        composites: { allOf: true, anyOf: true, oneOf: true, not: true },
        types: {
            array: { items: true, maxItems: true, minItems: true, uniqueItems: true },
            boolean: {},
            integer: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
            number: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
            object: { additionalProperties: true, discriminator: true, maxProperties: true, minProperties: true, properties: true, required: true },
            string: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maxLength: true, maximum: true, minimum: true, minLength: true, pattern: true }
        }
    }
};

function Schema(enforcer, exception, definition, map) {

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
        return;
    }

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    // store protected variables
    store.set(this, {
        enforcer: enforcer,
        definition: definition
    });

    // validate that only the allowed properties are specified and copy properties to this
    const validations = validationsMap[enforcer.version];
    const common = validations.common;
    const keys = Object.keys(definition);
    const length = keys.length;
    const composites = [];
    const type = definition.type;
    const typeProperties = validations.types[type] || {};
    for (let i = 0; i < length; i++) {
        const key = keys[i];

        // validate that the property is allowed
        if (!(common[key] || typeProperties[key] || validations.composites[key] || rxExtension.test(key) || allowProperty(definition, key, enforcer.version))) {
            exception('Property not allowed: ' + key);

        } else {
            const value = definition[key];
            if (value instanceof Date) {
                this[key] = new Date(+value);
            } else if (value instanceof Buffer) {
                this[key] = value.slice(0);
            } else if (Array.isArray(value)) {
                this[key] = value.concat();
            } else if (util.isPlainObject(value)) {
                this[key] = Object.assign({}, value)
            } else {
                this[key] = definition[key];
            }

            // keep track of composites
            if (validations.composites[key]) composites.push(key);
        }
    }

    // cannot have multiple of allOf, oneOf, anyOf, not, etc.
    if (composites.length > 1) {
        exception('Cannot have multiple composites: ' + composites.join(', '));

    } else if (composites.length === 1) {
        const composite = composites[0];
        switch (composite) {
            case 'allOf':
            case 'anyOf':
            case 'oneOf':
                if (!Array.isArray(this[composite])) {
                    exception('Composite "' + composite + '" must be an array');
                } else {
                    this[composite] = this[composite]
                        .map((def, index) => new Schema(enforcer, exception.at(composite + '/' + index), def, map));
                }
                break;

            case 'not':
                this.not = new Schema(enforcer, exception.at('not'), this.not, map);
                break;
        }

    } else if (!type) {
        exception.first('Missing required property: type');

    } else if (!validations.types[type]) {
        exception('Invalid type specified. Expected one of: ' + Object.keys(validations.types).join(', '));

    } else if (type === 'array') {
        if (this.items) {
            this.items = new Schema(enforcer, exception.at('items'), this.items, map);
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
        if (this.hasOwnProperty('format') && !validations.formats.integer[this.format]) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(validations.formats.integer).join(', '));
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
        if (this.hasOwnProperty('format') && !validations.formats.number[this.format]) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(validations.formats.number).join(', '));
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
            const child = exception.at('discriminator');
            let discriminator = this.discriminator;
            switch (enforcer.version) {
                case 2:
                    if (typeof discriminator !== 'string') {
                        child('Discriminator must be a string');
                    } else if (!Array.isArray(this.required) || this.required.indexOf(discriminator) === -1) {
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
                        if (!Array.isArray(this.required) || this.required.indexOf(discriminator.propertyName) === -1) {
                            child('Property "' + discriminator.propertyName + '" must be listed as required');
                        }
                        if (discriminator.hasOwnProperty('mapping')) {
                            if (!util.isPlainObject(discriminator.mapping)) {
                                child('Property "mapping" must be an object');
                            } else {
                                const mapping = discriminator.mapping;
                                Object.keys(mapping).forEach(key => {
                                    const def = mapping[key];
                                    if (!util.isPlainObject(def)) {
                                        child('Mapped value for "' + key + '" must be an object');
                                    } else {
                                        mapping[key] = new Schema(enforcer, child.at('mapping'), def, map);
                                    }
                                });
                            }
                        }
                    }
                    break;
            }
        }
        if (this.hasOwnProperty('required')) {
            if (!Array.isArray(this.required) || this.required.filter(v => v && typeof v === 'string').length !== this.required.length) {
                exception('Property "required" must be an array of non-empty strings');
            } else if (this.hasOwnProperty('maxProperties') && this.required.length > this.maxProperties) {
                exception('The number or "required" properties exceeds the "maxProperties" value');
            }
        }
        if (this.hasOwnProperty('additionalProperties') && typeof this.additionalProperties !== 'boolean') {
            this.additionalProperties = new Schema(enforcer, exception.at('additionalProperties'), this.additionalProperties, map);
        }
        if (this.properties) {
            if (!util.isPlainObject(this.properties)) {
                exception('Property "properties" must be an object');
            } else {
                const subException = exception.at('properties');
                Object.keys(this.properties).forEach(key => {
                    this.properties[key] = new Schema(enforcer, subException.at(key), this.properties[key], map);
                })
            }
        }

    } else if (type === 'string') {
        const isDateFormat = this.format && (this.format === 'date' || this.format === 'date-time');
        if (this.hasOwnProperty('format') && !validations.formats.string[this.format]) {
            exception('Invalid "format" specified. Expected one of: ' + Object.keys(validations.formats.string).join(', '));
        }
        if (isDateFormat) {
            let valid = true;
            if (this.hasOwnProperty('maximum')) {
                if (!rx[this.format].test(this.maximum)) {
                    exception('Property "maximum" is not formatted as a ' + this.format);
                    valid = false;
                } else {
                    const date = util.getDateFromValidDateString(this.format, this.maximum);
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
                    const date = util.getDateFromValidDateString(this.format, this.minimum);
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
        if (this.hasOwnProperty('pattern') && typeof this.pattern !== 'string') {
            exception('Property "pattern" must be a string');
        }

        // parse pattern string into a regular expression
        if (this.hasOwnProperty('pattern')) {
            if (typeof this.pattern !== 'string') {
                exception('Property "pattern" must be a string');
            } else {
                this.pattern = util.rxStringToRx(this.pattern);
            }
        }
    }

    // deserialize and validate default value
    if (this.hasOwnProperty('default')) {
        const data = this.deserialize(this.default);
        if (data.error) {
            data.error.header = 'Unable to deserialize default value';
            exception(data.error);
        } else {
            this.default = data.value;
            const childException = this.validate(this.default);
            if (childException) {
                childException.header = 'Default value is not valid';
                exception(childException);
            }
        }
    }

    // deserialize and validate example
    if (this.hasOwnProperty('example')) {
        const data = this.deserialize(this.example);
        if (data.error) {
            data.error.header = 'Unable to deserialize example';
            exception(data.error);
        } else {
            this.example = data.value;
            const childException = this.validate(this.example);
            if (childException) {
                childException.header = 'Example is not valid';
                exception(childException);
            }
        }
    }

    // deserialize and validate enum values
    if (this.hasOwnProperty('enum')) {
        if (!Array.isArray(this.enum)) {
            exception('Property "enum" must be an array');
        } else {
            const length = this.enum.length;
            for (let i = 0; i < length; i++) {
                const data = this.deserialize(this.enum[i]);
                if (data.error) {
                    data.error.header = 'Unable to deserialize enum value at index: ' + i;
                    exception(data.error);
                } else {
                    this.enum[i] = data.value;
                    const childException = this.validate(this.enum[i]);
                    if (childException) {
                        childException.header = 'Invalid enum value at index: ' + i;
                        exception(childException);
                    }
                }
            }
        }
    }
}

/**
 * Take a serialized (ready for HTTP transmission) value and deserialize it.
 * Converts strings of binary, byte, date, and date-time to JavaScript equivalents.
 * @param {*} value
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.deserialize = function(value) {
    const data = store.get(this);
    if (!data) throw Error('Expected a Schema instance type');
    return serial.deserialize(this, value);
};

/**
 * Check if the schema has any exceptions or get the Exception object.
 * @param {boolean} [force=false] Set to true to get the Exception object even if there is no exception.
 * @returns {Exception|null}
 */
Schema.prototype.exception = function(force) {
    const data = store.get(this);
    if (!data) throw Error('Expected a Schema instance type');
    return force || data.exception.hasException ? data.exception : null;
};

/**
 * Get discriminator key and schema.
 * @param {*} value
 * @returns {{ key: string, schema: Schema }}
 */
Schema.prototype.getDiscriminator = function(value) {
    const { definition, enforcer } = store.get(this);
    const version = enforcer.version;
    if (version === 2) {
        const discriminator = definition.discriminator;
        const key = discriminator && value && value.hasOwnProperty(discriminator) ? value[discriminator] : undefined;
        if (!key) return { key: undefined, schema: undefined };
        const schema = enforcer.definition && enforcer.definition.definitions && enforcer.definition.definitions[key];
        return { key, schema };

    } else if (version === 3) {
        const discriminator = definition.discriminator;
        const key = discriminator && value && value.hasOwnProperty(discriminator.propertyName) ? value[discriminator.propertyName] : undefined;
        if (!key) return { key: undefined, schema: undefined };

        const mapping = discriminator.mapping;
        const schema = mapping && mapping[key];
        return { key, schema };
    }
};

/**
 * Merge two or more schemas.
 * @param {...Schema|object} schema
 * @param {object} [options]
 * @param {boolean} [options.overwriteDiscriminator=false] Set to true to allow conflicting discriminators to overwrite the previous, otherwise causes exceptions.
 * @param {boolean} [options.orPattern=false]
 * @param {boolean} [options.throw=true]
 */
// Schema.prototype.merge = function(schema, options) {
//     const data = store.get(this);
//     if (!data) throw Error('Expected a Schema instance type');
//
//     options = Object.assign({}, options);
//     if (!options.hasOwnProperty('throw')) options.throw = true;
//
//     // get schemas array
//     const schemas = Array.from(arguments)
//         .map(schema => schema instanceof Schema
//             ? schema
//             : Schema(Exception('Schema has one or more errors'), data.version, schema, data.options));
//
//     // at this schema to the list of schemas
//     args.unshift(this);
//
//     const merged = merge(schemas, options);
//     const exception = merged.exception();
//     if (exception || options.throw) throw Error(exception.toString());
//     return merged;
// };

/**
 * Populate a value from a list of parameters.
 * @param {object} params
 * @param {*} [value]
 * @param {object} [options]
 * @param {boolean} [options.copy=false]
 * @param {boolean} [options.conditions=true]
 * @param {boolean} [options.defaults=true]
 * @param {string} [options.replacement='handlebar']
 * @param {boolean} [options.reportErrors=false]
 * @param {boolean} [options.templateDefaults=true]
 * @param {boolean} [options.templates=true]
 * @param {boolean} [options.variables=true]
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.populate = function(params, value, options) {
    return populate.populate(this, params, value, options);
};

/**
 * Produce a random value for the schema.
 * @param {*} value An initial value to add random values to.
 * @param {object} [options]
 * @param {boolean} [options.skipInvalid=false]
 * @param {boolean} [options.throw=true]
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.random = function(value, options) {
    return random(this, value, options);
};

/**
 * Take a deserialized (not ready for HTTP transmission) value and serialize it.
 * Converts Buffer and Date objects into string equivalent.
 * @param value
 * @returns {*}
 */
Schema.prototype.serialize = function(value) {
    const data = store.get(this);
    if (!data) throw Error('Expected a Schema instance type');
    return serial.deserialize(this, value);
};

/**
 * Check to see if the value is valid for this schema.
 * @param {*} value
 * @returns {Exception|null}
 */
Schema.prototype.validate = function(value) {
    return validate(this, value);
};

/**
 * Get the OpenAPI version used for this schema.
 */
Object.defineProperty(Schema.prototype, 'version', {
    get: function() {
        const data = store.get(this);
        if (!data) throw Error('Expected a Schema instance type');
        return data.enforcer.version;
    }
});




// put custom property checks here
function allowProperty(schema, property, version) {
    if (property === 'discriminator') return true;
    return false;
}

function isInteger(value) {
    return typeof value === 'number' && Math.round(value) === value;
}

function isNonNegativeInteger(value) {
    return isInteger(value) && value >= 0;
}

function minMaxValid(min, max, exclusiveMin, exclusiveMax) {
    if (min === undefined || max === undefined) return true;
    min = +min;
    max = +max;
    return min < max || (!exclusiveMin && !exclusiveMax && min === max);
}