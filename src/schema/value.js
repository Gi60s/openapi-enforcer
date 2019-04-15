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
const { isPlainObject } = require('../util');

module.exports = SchemaValue;

const defaultPopulate = true;
const defaultSerialize = true;
const defaultValidate = true;

/**
 * Create a value with special handling. If the value already is an Enforcer value then a new one
 * will be created with handling overwritten where specified.
 * @param {*} value
 * @param {object} [config]
 * @param {boolean} [config.populate] Whether the value should be populated.
 * @param {boolean} [config.serialize] Whether the value should be serialized or deserialized.
 * @param {boolean} [config.validate] Whether the value should be validated.
 * @returns {SchemaValue}
 * @constructor
 */
function SchemaValue(value, config = {}) {
    if (!(this instanceof SchemaValue)) return new SchemaValue(value, config);

    if (typeof value === 'object' && value instanceof SchemaValue) {
        config = {
            populate: config.populate === undefined ? value.populate : config.populate,
            serialize: config.serialize === undefined ? value.serialize : config.serialize,
            validate: config.validate === undefined ? value.validate : config.validate
        };
        value = value.value;
    }

    if (!config || typeof config !== 'object') throw Error('Invalid enforcer value configuration');

    const { populate, serialize, validate } = config;
    this.populate = populate;
    this.serialize = serialize;
    this.validate = validate;
    this.value = value;
}

/**
 * Get the attributes (with defaults applied) for an enforcer value.
 * @returns {{populate: boolean, serialize: boolean, validate: boolean, value: *}}
 */
SchemaValue.prototype.attributes = function () {
    return {
        populate: this.populate === undefined ? defaultPopulate : this.populate,
        serialize: this.serialize === undefined ? defaultSerialize : this.serialize,
        validate: this.validate === undefined ? defaultValidate : this.validate,
        value: this.value
    };
};

/**
 * Create a new SchemaValue instance that keeps it's own configuration over a supplied secondary configuration.
 * @param {*} value
 * @param {object} [config]
 * @param {boolean} [config.populate] Whether the value should be populated.
 * @param {boolean} [config.serialize] Whether the value should be serialized or deserialized.
 * @param {boolean} [config.validate] Whether the value should be validated.
 * @returns {SchemaValue}
 */
SchemaValue.inherit = function (value, config) {
    if (typeof value === 'object' && value instanceof SchemaValue) {
        if (value.populate === undefined && config.populate !== undefined) value.populate = config.populate;
        if (value.serialize === undefined && config.serialize !== undefined) value.serialize = config.serialize;
        if (value.validate === undefined && config.validate !== undefined) value.validate = config.validate;
        return value;
    } else {
        return new SchemaValue(value, config);
    }
};

SchemaValue.extract = extractSchemaValues;

/**
 * Get SchemaValue attributes whether the value is actually an SchemaValue instance or a plain value.
 * @param {*} value
 * @returns {{populate: boolean, serialize: boolean, validate: boolean, value: *}}
 */
SchemaValue.getAttributes = function (value) {
    return typeof value === 'object' && value instanceof SchemaValue
        ? value.attributes()
        : {
            populate: defaultPopulate,
            serialize: defaultSerialize,
            validate: defaultValidate,
            value
        };
};

function extractSchemaValues(source) {
    if (Array.isArray(source)) {
        return source.map(v => extractSchemaValues(v));
    } else if (isPlainObject(source)) {
        const result = {};
        Object.keys(source).forEach(key => {
            result[key] = extractSchemaValues(source[key]);
        });
        return result;
    } else if (typeof source === 'object' && source instanceof SchemaValue) {
        return source.value;
    } else {
        return source;
    }
}
