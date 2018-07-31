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
const path      = require('path');
const util      = require('./util');

const validationsMap = {};
validationsMap[2] = {
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
validationsMap[3] = {
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
    },
    value: 3
};

util.deepFreeze(validationsMap);

module.exports = function(major, definition) {
    const version = util.tryRequire(path.resolve(__dirname, 'v' + major));
    if (!version) throw Error('The Open API definition version is either invalid or unsupported: ' + value);

    const result = Object.assign({}, version, {
        validationsMap: validationsMap[major],
        definition: definition
    });
    util.deepFreeze(result);

    return result;
};