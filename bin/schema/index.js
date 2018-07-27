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
const Schema        = require('./schema');

const validations = getValidationsMap();

/**
 * Convert a plain object into a parsed and validated Schema instance.
 * @param {number} version The swagger/openapi major version number. For example, 2 or 3
 * @param {object} schema
 * @param {object} [options]
 * @param {boolean} [options.throw=true] If an exception occurs then throw an error.
 * @param {boolean} [options.freeze=true] Freeze the Schema instance. Helps protect you from accidentally invalidating the schema.
 * @returns {Schema}
 */
module.exports = function (version, schema, options) {
    // schema may already be a Schema instance
    if (schema instanceof Schema) return schema;

    // validate input
    if (!validations[version]) throw Error('Invalid version specified');
    if (!util.isPlainObject(schema)) throw Error('Invalid schema specified');

    // normalize options
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('throw')) options.throw = true;
    if (!options.hasOwnProperty('freeze')) options.freeze = true;

    // create the exception instance
    const exception = Exception('Schema has one or more errors');

    // build the schema
    const instance = new Schema(exception, validations[version], schema, options, new Map());

    // if there is an error and we're throwing then throw now
    if (options.throw && instance.exception()) throw Error(exception.toString());

    return instance;
};



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
        composites: { allOf: true },
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
        composites: { allOf: true, anyOf: true, oneOf: true, not: true, discriminator: true },
        types: {
            array: { items: true, maxItems: true, minItems: true, uniqueItems: true },
            boolean: {},
            integer: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
            number: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maximum: true, minimum: true, multipleOf: true },
            object: { additionalProperties: true, discriminator: true, maxProperties: true, minProperties: true, properties: true, required: true },
            string: { exclusiveMaximum: true, exclusiveMinimum: true, format: true, maxLength: true, maximum: true, minimum: true, minLength: true, pattern: true }
        },
        value: 3
    };
    return validations;
}