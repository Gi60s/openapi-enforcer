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
const punctuation = ',,,,,,,,,,.................................:;!?';
const punctuationCount = punctuation.length;
const words = "lorem ipsum dolor sit amet consectetur adipiscing elit suspendisse sollicitudin felis pretium laoreet tortor facilisis a integer eu metus velit praesent varius sed erat quis ornare nunc porttitor nulla at ultrices nam ac vestibulum metus maecenas malesuada lectus leo blandit a congue gravida phasellus consectetur libero et tincidunt diam pellentesque lacus neque eros sed porta nunc id lobortis eget ligula mollis nulla nunc maximus gravida felis finibus est ullamcorper pellentesque ex in turpis pharetra dictum in fermentum arcu mauris odio molestie iaculis accumsan nec convallis nec nunc vestibulum nisl curabitur tristique non porttitor vivamus dui ipsum orci eget vulputate lacus interdum suscipit massa elementum sodales at interdum fames ante primis in faucibus duis mi pulvinar accumsan donec odio enim sed dignissim turpis quisque vitae turpis ut nibh tincidunt aliquam magna semper aliquam feugiat sapien justo egestas condimentum metus tincidunt odio volutpat vehicula pulvinar arcu diam bibendum sem leo sodales eleifend vehicula fusce faucibus quam lorem rhoncus amet hendrerit rhoncus augue mattis commodo lobortis urna consequat hendrerit enim risus placerat eros euismod ligula tellus tempus condimentum ac lectus erat ultrices mi lacus nisi scelerisque vehicula cursus cras enim elit aenean aliquam tempor ullamcorper est proin aliquet orci et augue posuere viverra massa augue purus orci purus neque ut elit pretium molestie vel tellus ex consequat tristique urna fringilla dignissim ex lectus imperdiet lobortis potenti efficitur feugiat facilisi placerat posuere bibendum velit volutpat dapibus donec".split(' ');
const wordCount = words.length;

module.exports = {
    arrayRemoveItem,
    copy: value => {
        const map = new Map();
        return copy(map, value);
    },
    edgeSlashes,
    extractEnforcerValues,
    findMediaMatch,
    getDateFromValidDateString,
    getDefinitionType,
    isDate,
    isNumber,
    isInteger,
    isPlainObject,
    isObject,
    isObjectStringMap,
    lowerCaseObjectProperties,
    mapObject,
    parseCookieString,
    parseQueryString,
    randomNumber,
    randomOneOf,
    randomText,
    reject,
    rxStringToRx,
    same,
    smart,
    ucFirst,
    validateMaxMin
};

function arrayRemoveItem(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
    return array;
}

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

    } else if (isPlainObject(value)) {
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

function edgeSlashes (value, start, end) {
    value = value.replace(/^\//, '').replace(/\/$/, '');
    if (value.length === 0 && (start || end)) return '/';
    if (start) value = '/' + value;
    if (end) value += '/';
    return value;
}

function extractEnforcerValues(source) {
    if (Array.isArray(source)) {
        return source.map(v => extractEnforcerValues(v));
    } else if (isPlainObject(source)) {
        const result = {};
        Object.keys(source).forEach(key => {
            result[key] = extractEnforcerValues(source[key]);
        });
        return result;
    } else if (typeof source === 'object' && source instanceof Value) {
        return source.value;
    } else {
        return source;
    }
}

/**
 * Provide an accept media / mime type string and possible matches and get the match.
 * @param {string} input The allowed media type string. Example: text/html, application/xhtml+xml, application/xml;q=0.9, text/*;q=0.8
 * @param {string[]} store An array of media types to search through (no quality number)
 * @returns {string[]} The media type matches in order of best match first.
 */
function findMediaMatch(input, store) {
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
}

function getDateFromValidDateString (format, string) {
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

function getDefinitionType (definition) {
    if (Array.isArray(definition)) return 'array';
    if (isPlainObject(definition)) return 'object';
    if (definition === null) return 'null';

    const type = typeof definition;
    return type === 'object' ? 'decoratedObject' : type;
}

function isDate (value) {
    return value && !isNaN(value) && value instanceof Date;
}

function isNumber (value) {
    return typeof value === 'number' && !isNaN(value);
}

function isInteger (value) {
    return !isNaN(value) && typeof value === 'number' && value === Math.round(value);
}

function isObject(v) {
    return v && typeof v === 'object' && Object.prototype.toString.call(v) === '[object Object]';
}

function isPlainObject (value) {
    if (!isObject(value)) return false;

    // check for modified constructor
    const constructor = value.constructor;
    if (typeof constructor !== 'function') return false;

    // check for modified prototype
    const prototype = constructor.prototype;
    if (!isObject(prototype)) return false;

    // check constructor for Object-specific method
    return prototype.hasOwnProperty('isPrototypeOf');
}

// check to see if its an object with properties as strings
function isObjectStringMap (obj) {
    if (!isPlainObject(obj)) return false;
    const keys = Object.keys(obj);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
        if (typeof keys[i] !== 'string' || typeof obj[keys[i]] !== 'string') return false;
    }
    return true;
}

// create shallow copy of the object but make all property names lower case
function lowerCaseObjectProperties (obj) {
    const result = {};
    Object.keys(obj).forEach(key => {
        result[key.toLowerCase()] = obj[key];
    });
    return result;
}

function mapObject (object, callback) {
    const result = {};
    Object.keys(object).forEach(key => {
        result[key] = callback(object[key], key);
    });
    return result;
}

function parseCookieString(str) {
    const result = {};
    str.split(/; */).forEach(pair => {
        const [key, value] = pair.split('=');
        if (!result[key]) result[key] = [];
        result[key].push(value || '');
    });
    return result;
}

function parseQueryString (str, delimiter) {
    const query = queryString.parse(str, delimiter);
    Object.keys(query).forEach(key => {
        const value = query[key];
        if (!Array.isArray(value)) query[key] = [ value ];
    });
    return Object.assign({}, query);
}

function randomNumber ({ min, max, multipleOf, exclusiveMin = false, exclusiveMax = false, decimalPlaces = 0, spread = 1000 } = {}) {
    const minIsNumber = isNumber(min);
    const maxIsNumber = isNumber(max);

    if (typeof multipleOf === 'number' && multipleOf > 0) {
        min = Math.ceil(min / multipleOf);
        max = Math.floor(max / multipleOf);
        const index = Math.round(Math.random() * (max - min) / multipleOf);
        return index * multipleOf;

    } else {
        const multiplier = minIsNumber && maxIsNumber ? max - min : spread;
        let num = Math.random() * multiplier;
        if (minIsNumber) num += min;

        decimalPlaces = Math.round(decimalPlaces);
        if (decimalPlaces === 0) {
            num = Math.round(num);
        } else if (decimalPlaces > 0) {
            const dec = Math.pow(10, decimalPlaces);
            if (dec > 1) num = Math.round(num * dec) / dec;
        }

        if (minIsNumber) {
            if (num < min) num = min;
            if (num === min && exclusiveMin) num += Math.pow(10, -1 * decimalPlaces);
        }
        if (maxIsNumber) {
            if (num > max) num = max;
            if (num === max && exclusiveMax) num -= Math.pow(10, -1 * decimalPlaces);
        }

        if (minIsNumber && (num < min || (num === min && exclusiveMin))) return undefined;
        if (maxIsNumber && (num > max || (num === max && exclusiveMax))) return undefined;
        return num;
    }
}

function randomOneOf (choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function randomText ({ minLength = 1, maxLength = 250 } = {}) {
    const length = randomNumber({ min: minLength, max: maxLength });
    let result = '';
    let punctuationIndex = 1;
    let uc = true;
    while (result.length < length) {
        const index = Math.floor(Math.random() * wordCount);
        let word = words[index];
        if (uc) word = ucFirst(word);
        uc = false;
        result += word;
        if (Math.random() >= punctuationIndex) {
            punctuationIndex = 1;
            const index = Math.floor(Math.random() * punctuationCount);
            const punct = punctuation[index];
            if (/[.!?]/.test(punct)) uc = true;
            result += punct;
        } else {
            punctuationIndex *= .9;
        }
        result += ' ';
    }
    result = result.trim();
    result = result.replace(/[,.:;!?]$/, ''); // if ends in punctation then remove it
    if (maxLength > 5) {
        if (result.length >= maxLength) result = result.substr(0, maxLength - 1);
        result += '.';
    } else if (result.length > maxLength) {
        result = result.substr(0, maxLength);
    }
    return result;
}

function reject (message) {
    return Promise.reject(typeof message === 'string' ? Error(message) : Error(message.toString()));
}

function rxStringToRx (value) {
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

function same (v1, v2) {
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

    } else if (isDate(v1)) {
        return isDate(v2) && +v2 === +v1;

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
}

function smart (value) {
    const type = typeof value;
    if (type === 'string') return '"' + value.replace(/"/g, '\\"') + '"';
    if (value instanceof Date) return isNaN(value) ? 'invalid date object' : value.toISOString();
    if (Array.isArray(value)) {
        let result = '[' + value.toString() + ']';
        const length = result.length;
        if (length > 15) {
            const excess = length - 15;
            const offTop = Math.floor(excess / 2);
            const offBottom = excess - offTop;
            const middle = Math.ceil(length / 2);
            result = result.substr(0, middle - offBottom) + '...' + result.substr(middle + offTop)
        }
        return result;
    }
    if (value && type === 'object') {
        const name = value.constructor.name;
        return '[object' + (name ? ' ' + name : '') + ']';
    }
    return String(value);
}

function ucFirst (value) {
    return value[0].toUpperCase() + value.substr(1);
}

function validateMaxMin(exception, schema, type, maxProperty, minProperty, exclusives, value, maximum, minimum) {
    if (schema.hasOwnProperty(maxProperty)) {
        if (exclusives && schema.exclusiveMaximum && value >= maximum) {
            let bound = schema.serialize(schema[maxProperty]).value || schema[maxProperty];
            let val = schema.serialize(value).value || value;
            exception.message('Expected ' + type + ' to be less than ' +
                smart(bound) + '. Received: ' +
                smart(val));
        } else if (value > maximum) {
            let bound = schema.serialize(schema[maxProperty]).value || schema[maxProperty];
            let val = schema.serialize(value).value || value;
            exception.message('Expected ' + type + ' to be less than or equal to ' +
                smart(bound) + '. Received: ' +
                smart(val));
        }
    }

    if (schema.hasOwnProperty(minProperty)) {
        if (exclusives && schema.exclusiveMinimum && value <= minimum) {
            let bound = schema.serialize(schema[minProperty]).value || schema[minProperty];
            let val = schema.serialize(value).value || value;
            exception.message('Expected ' + type + ' to be greater than ' +
                smart(bound) + '. Received: ' +
                smart(val));
        } else if (value < minimum) {
            let bound = schema.serialize(schema[minProperty]).value || schema[minProperty];
            let val = schema.serialize(value).value || value;
            exception.message('Expected ' + type + ' to be greater than or equal to ' +
                smart(bound) + '. Received: ' +
                smart(val));
        }
    }
}