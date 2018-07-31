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
const path          = require('path');
const rx            = require('./rx');

const rxMediaType = /^([\s\S]+?)\/(?:([\s\S]+?)\+)?([\s\S]+?)$/;

exports.arrayPushMany = function(target, source) {
    source.forEach(item => target.push(item));
};

/**
 * Make all items in an array unique.
 * @param {array} array
 * @returns {array}
 */
exports.arrayUnique = function(array) {
    const result = [];
    array.forEach(item => {
        if (result.indexOf(item) === -1) result.push(item);
    });
    return result;
};

/**
 * Copies Dates, Buffers, Arrays, plain Objects, and Primitives
 * @param {*} value
 * @returns {*}
 */
exports.copy = function(value) {
    const map = new Map();
    return copy(map, value);
};

exports.deepFreeze = function(value) {
    if (value instanceof Date) {
        value.setDate = noop;
        value.setFullYear = noop;
        value.setHours = noop;
        value.setMilliseconds = noop;
        value.setMinutes = noop;
        value.setMonth = noop;
        value.setSeconds = noop;
        value.setTime = noop;
        value.setUTCDate = noop;
        value.setUTCFullYear = noop;
        value.setUTCHours = noop;
        value.setUTCMilliseconds = noop;
        value.setUTCMinutes = noop;
        value.setUTCMonth = noop;
        value.setUTCSeconds = noop;
        value.setYear = noop;

    } else if (Array.isArray(value)) {
        value.forEach(v => this.deepFreeze(v));
        Object.freeze(value);

    } else if (this.isPlainObject(value)) {
        Object.keys(value).forEach(k => this.deepFreeze(value[k]));
        Object.freeze(value);
    }
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

exports.Error = function(meta, message) {
    if (arguments.length === 1) {
        meta = {};
        message = arguments[0];
    } else if (typeof meta === 'string') {
        meta = { code: meta };
    }
    const err = Error(message.replace(/\s+/g, ' '));
    Object.assign(err, meta);
    return err;
};

exports.errorHandler = function(useThrow, exception, value) {
    const hasErrors = exception && exception.hasException;
    if (hasErrors && useThrow) {
        const err = Error(exception);
        err.code = 'OPEN_API_EXCEPTION';
        Object.assign(err, exception.meta);
        throw err;
    } else if (useThrow) {
        return value;
    } else {
        return {
            error: hasErrors ? exception : null,
            value: hasErrors ? null : value
        };
    }
};

/**
 * Provide an accept media / mime type string and possible matches and get the match.
 * @param {string} input
 * @param {string[]} store
 * @returns {string[]} The media type matches.
 */
exports.findMediaMatch = function(input, store) {
    const accepts = input
        .split(/, */)
        .map((value, index) => {
            const set = value.split(';');
            const match = rxMediaType.exec(set[0]);
            const q = /q=(\d(?:\.\d)?)/.exec(set[1]);
            if (!match) return;
            return {
                extension: match[2] || '*',
                index: index,
                quality: +((q && q[1]) || 1),
                subType: match[3],
                type: match[1]
            }
        })
        .filter(v => !!v);

    // populate matches
    const results = [];
    accepts.forEach(accept => {
        store.forEach(value => {
            const match = rxMediaType.exec(value);
            if (match) {
                const type = match[1];
                const subType = match[3];
                const extension = match[2] || '*';
                const typeMatch = ((accept.type === type || accept.type === '*' || type === '*') &&
                    (accept.subType === subType || accept.subType === '*' || subType === '*') &&
                    (accept.extension === extension || accept.extension === '*' || extension === '*'));
                if (typeMatch) {
                    results.push({
                        index: accept.index,
                        quality: accept.quality,
                        score: (accept.type === type ? 1 : 0) + (accept.subType === subType ? 1 : 0) + (accept.extension === extension ? 1 : 0),
                        value
                    });
                }
            }
        })
    });

    // sort results
    results.sort((a, b) => {
        if (a.quality < b.quality) return 1;
        if (a.quality > b.quality) return -1;
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return a.index < b.index ? 1 : -1;
    });

    // make results unique
    const map = {};
    const unique = [];
    results.forEach(item => {
        const value = item.value;
        if (!map[value]) {
            map[value] = item;
            unique.push(item.value);
        }
    });

    return unique;
};

exports.getDateFromValidDateString = function (format, string) {
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
};

exports.isDate = function (value) {
    return value && !isNaN(value) && value instanceof Date;
};

exports.isPlainObject = function(value) {
    if (!isObject(value)) return false;

    // check for modified constructor
    const constructor = value.constructor;
    if (typeof constructor !== 'function') return false;

    // check for modified prototype
    const prototype = constructor.prototype;
    if (!isObject(prototype)) return false;

    // check constructor for Object-specific method
    return prototype.hasOwnProperty('isPrototypeOf');
};

exports.lowerCaseProperties = function(obj) {
    const result = {};
    Object.keys(obj).forEach(key => {
        result[key.toLowerCase()] = obj[key];
    });
    return result;
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

exports.queryParamsByName = function (name, value) {
    const rx = RegExp('(?:^|&)' + name + '=([^&]*)', 'g');
    const results = [];
    let match;
    while (match = rx.exec(value)) results.push(decodeURIComponent(match[1]));
    return results.length ? results : null;
};

exports.queryParamNames = function(value, objValue) {
    const retObject = arguments.length >= 2;
    const names = {};
    const boolean = !!objValue;
    value.split('&').forEach(pair => {
        const kv = pair.split('=');
        const name = kv[0];
        if (name) names[name] = boolean;
    });
    return retObject ? names : Object.keys(names);
};

exports.randomNumber = function(integer, min, max) {
    if (!min) min = Math.random();
    if (!max) max = Math.random();
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

    if (Array.isArray(v1)) {
        if (!Array.isArray(v2)) return false;

        const length = v1.length;
        if (length !== v2.length) return false;

        for (let i = 0; i < length; i++) {
            if (!same(v1[i], v2[i])) return false;
        }

        return true;

    } else if (Buffer.isBuffer(v1)) {
        return Buffer.isBuffer(v2) && v1.toString() === v2.toString();

    } else if (exports.isDate(v1)) {
        return exports.isDate(v2) && +v2 === +v1;

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
 * @returns {string}
 */
exports.schemaType = function(schema) {
    if (schema.type) return schema.type;  // TODO: remove this function - validator will require all types be specified
    if (schema.items) return 'array';
    if (schema.properties || schema.additionalProperties) return 'object';
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
 * Wrap with quotations if the value is a string.
 * @param value
 * @returns {*}
 */
exports.smart = function(value) {
    if (typeof value === 'string') return '"' + value.replace(/"/g, '\\"') + '"';
    if (value instanceof Date) return value.toISOString();
    return String(value);
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

function isObject(v) {
    return v && typeof v === 'object' && Object.prototype.toString.call(v) === '[object Object]';
}

function noop() {}