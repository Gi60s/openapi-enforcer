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

function Schema() {}

/**
 * Take a serialized (ready for HTTP transmission) value and deserialize it.
 * Converts strings of binary, byte, date, and date-time to JavaScript equivalents.
 * @param {*} value
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.deserialize = function(value) {
    return serial.deserialize(this, value);
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