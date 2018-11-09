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
const queryString   = require('querystring');
const rx            = require('./rx');
const Value         = require('./value');

const rxMediaType = /^([\s\S]+?)\/(?:([\s\S]+?)\+)?([\s\S]+?)$/;

exports.arrayRemoveItem = function(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
    return array;
};

exports.copy = function(value) {
    const map = new Map();
    return copy(map, value);
};

exports.edgeSlashes = function(value, start, end) {
    value = value.replace(/^\//, '').replace(/\/$/, '');
    if (value.length === 0 && (start || end)) return '/';
    if (start) value = '/' + value;
    if (end) value += '/';
    return value;
};

exports.extractEnforcerValues = function(source) {
    if (Array.isArray(source)) {
        return source.map(v => exports.extractEnforcerValues(v));
    } else if (exports.isPlainObject(source)) {
        const result = {};
        Object.keys(source).forEach(key => {
            result[key] = exports.extractEnforcerValues(source[key]);
        });
        return result;
    } else if (typeof source === 'object' && source instanceof Value) {
        return source.value;
    } else {
        return source;
    }
};

/**
 * Provide an accept media / mime type string and possible matches and get the match.
 * @param {string} input The allowed media type string. Example: text/html, application/xhtml+xml, application/xml;q=0.9, text/*;q=0.8
 * @param {string[]} store An array of media types to search through (no quality number)
 * @returns {string[]} The media type matches in order of best match first.
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

exports.isInteger = function(value) {
    return !isNaN(value) && typeof value === 'number' && value === Math.round(value);
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

// check to see if its an object with properties as strings
exports.isObjectStringMap = function(obj) {
    if (!exports.isPlainObject(obj)) return false;
    const keys = Object.keys(obj);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
        if (typeof keys[i] !== 'string' || typeof obj[keys[i]] !== 'string') return false;
    }
    return true;
};

// create shallow copy of the object but make all property names lower case
exports.lowerCaseObjectProperties = function(obj) {
    const result = {};
    Object.keys(obj).forEach(key => {
        result[key.toLowerCase()] = obj[key];
    });
    return result;
};

exports.mapObject = function(object, callback) {
    const result = {};
    Object.keys(object).forEach(key => {
        result[key] = callback(object[key], key);
    });
    return result;
};

exports.parseCookieString = function(str) {
    const result = {};
    str.split(/; */).forEach(pair => {
        const [key, value] = pair.split('=');
        if (!result[key]) result[key] = [];
        result[key].push(value || '');
    });
    return result;
};

exports.parseQueryString = function (str, delimiter) {
    const query = queryString.parse(str, delimiter);
    Object.keys(query).forEach(key => {
        const value = query[key];
        if (!Array.isArray(value)) query[key] = [ value ];
    });
    return Object.assign({}, query);
};

exports.reject = function(message) {
    return Promise.reject(typeof message === 'string' ? Error(message) : Error(message.toString()));
};

exports.rxStringToRx = function(value) {
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
};

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

exports.smart = function(value) {
    const type = typeof value;
    if (type === 'string') return '"' + value.replace(/"/g, '\\"') + '"';
    if (value instanceof Date) return isNaN(value) ? 'invalid date object' : value.toISOString();
    if (value && type === 'object') {
        const name = value.constructor.name;
        return '[object' + (name ? ' ' + name : '') + ']';
    }
    return String(value);
};

exports.ucFirst = function(value) {
    return value[0].toUpperCase() + value.substr(1);
};

exports.validateMaxMin = function maxMin(exception, schema, type, maxProperty, minProperty, exclusives, value, maximum, minimum) {
    if (schema.hasOwnProperty(maxProperty)) {
        if (exclusives && schema.exclusiveMaximum && value >= maximum) {
            exception('Expected ' + type + ' to be less than ' +
                exports.smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
                exports.smart(schema.serialize(value).value));
        } else if (value > maximum) {
            exception('Expected ' + type + ' to be less than or equal to ' +
                exports.smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
                exports.smart(schema.serialize(value).value));
        }
    }

    if (schema.hasOwnProperty(minProperty)) {
        if (exclusives && schema.exclusiveMinimum && value <= minimum) {
            exception('Expected ' + type + ' to be greater than ' +
                exports.smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
                exports.smart(schema.serialize(value).value));
        } else if (value < minimum) {
            exception('Expected ' + type + ' to be greater than or equal to ' +
                exports.smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
                exports.smart(schema.serialize(value).value));
        }
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