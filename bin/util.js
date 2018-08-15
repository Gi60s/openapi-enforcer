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

exports.arrayRemoveItem = function(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
    return array;
};

exports.copy = function(value) {
    const map = new Map();
    return copy(map, value);
};

exports.ucFirst = function(value) {
    return value[0].toUpperCase() + value.substr(1);
};

exports.isDate = function (value) {
    return value && !isNaN(value) && value instanceof Date;
};

exports.edgeSlashes = function(value, start, end) {
    value = value.replace(/^\//, '').replace(/\/$/, '');
    if (value.length === 0 && (start || end)) return '/';
    if (start) value = '/' + value;
    if (end) value += '/';
    return value;
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

exports.mapObject = function(object, callback) {
    const result = {};
    Object.keys(object).forEach(key => {
        result[key] = callback(object[key], key);
    });
    return result;
};

exports.parseQueryString = function (str, delimiter) {
    const query = queryString.parse(str, delimiter);
    Object.keys(query).forEach(key => {
        const value = query[key];
        if (!Array.isArray(value)) query[key] = [ value ];
    });
    return query;
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
    if (typeof value === 'string') return '"' + value.replace(/"/g, '\\"') + '"';
    if (value instanceof Date) return value.toISOString();
    return String(value);
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