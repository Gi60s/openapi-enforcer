/**
 *  @license
 *    Copyright 2017 Brigham Young University
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

/**
 * Copies Dates, Buffers, Arrays, plain Objects, and Primitives
 * @param {*} value
 * @returns {*}
 */
exports.copy = function(value) {
    const map = new Map();
    return copy(map, value);
};

/**
 * Decide whether edges of a string should have slashes or not.
 * @param {string} value
 * @param {boolean} start
 * @param {boolean} end
 * @returns {string}
 */
exports.edgeSlashes = function(value, start, end) {
    value = value.replace(/^\//, '').replace(/\/$/, '');
    if (value.length === 0 && (start || end)) return '/';
    if (start) value = '/' + value;
    if (end) value += '/';
    return value;
};

/**
 * If a property does not exist then set it to the value.
 * @param {object} obj
 * @param {string|Symbol} property
 * @param {*} value
 */
exports.propertyDefault = function(obj, property, value) {
    if (!obj.hasOwnProperty(property)) obj[property] = value;
};

/**
 * Do a deep equal on two values.
 * @param {*} v1
 * @param {*} v2
 * @returns {boolean}
 */
exports.same = function same(v1, v2) {
    if (v1 === v2) return true;

    const type = typeof v1;
    if (type !== typeof v2) return false;

    const isArray = Array.isArray(v1);
    if (isArray && !Array.isArray(v2)) return false;

    if (isArray) {
        const length = v1.length;
        if (length !== v2.length) return false;

        for (let i = 0; i < length; i++) {
            if (!same(v1[i], v2[i])) return false;
        }

        return true;

    } else if (v1 && type === 'object') {
        if (!v2) return false;

        const keys = Object.keys(v1);
        const length = keys.length;
        if (length !== Object.keys(v2).length) return false;

        for (let i = 0; i < length; i++) {
            const key = keys[i];
            if (!same(v1[key], v2[key])) return false;
        }

        return true;

    } else {
        return false;
    }
};

/**
 * Determine the schema type using the schema. It isn't always specified but enough
 * information is generally provided to determine it.
 * @param {object} schema
 * @returns {string, undefined}
 */
exports.schemaType = function(schema) {
    if (schema.type) return schema.type;
    if (schema.items) return 'array';
    if (schema.properties || schema.additionalProperties || schema.allOf || schema.anyOf || schema.oneOf) return 'object';
    return undefined;
};

/**
 * Determine the schema format using the schema. It isn't always specified but enough
 * information is generally provided to determine it.
 * @param {object} schema
 * @returns {string, undefined}
 */
exports.schemaFormat = function(schema) {
    const type = exports.schemaType(schema);
    switch (type) {
        case 'boolean':
        case 'integer':
        case 'number':
            return type;
        case 'string':
            switch (schema.format) {
                case 'binary':
                case 'byte':
                case 'date':
                case 'date-time':
                    return schema.format;
                default:
                    return 'string';
            }
        default:
            return;
    }
};

/**
 * Wrap with quotations in the value is a string.
 * @param value
 * @returns {*}
 */
exports.smart = function(value) {
    if (typeof value === 'string') return "'" + value.replace(/'/g, "\\'") + "'";
    if (value instanceof Date) return value.toISOString();
    return value;
};

exports.traverse = function(object, callback) {
    const map = new Map();
    traverse(map, '', null, null, object, callback);
};

exports.tryRequire = function(path) {
    try {
        return require(path);
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') return null;
        throw err;
    }
};

function copy(map, value) {
    if (value instanceof Date) {
        return new Date(+value);

    } else if (value instanceof Buffer) {
        return value.slice(0);

    } else if (Array.isArray(value)) {
        let result = map.get(value);
        if (result) return result;

        result = [];
        map.set(value, result);
        value.forEach(v => result.push(copy(map, v)));
        return result;

    } else if (value && typeof value === 'object') {
        let result = map.get(value);
        if (result) return result;

        result = {};
        map.set(value, result);
        Object.keys(value).forEach(key => result[key] = copy(map, value[key]));
        return result;

    } else {
        return value;
    }
}

function traverse(map, path, property, parent, value, callback) {
    // avoid endless loop
    if (map.has(value)) return;
    map.set(value, true);

    callback(value, parent, property, path);

    if (Array.isArray(value)) {
        value.forEach((v, i) => traverse(map, path + '/' + i, i, value, v, callback));

    } else if (value && typeof value === 'object') {
        Object.keys(value).forEach(key => {
            traverse(map, path + '/' + key, key, value, value[key], callback)
        });
    }
}