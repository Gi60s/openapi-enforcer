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

const Exception = require('./exception');
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
    determineSchemaFromSchemas,
    edgeSlashes,
    findMediaMatch,
    freeze,
    getDateFromValidDateString,
    getDefinitionType,
    greatestCommonDenominator,
    isDate,
    isNumber,
    isInteger,
    isPlainObject,
    isObject,
    isObjectStringMap,
    leastCommonMultiple,
    leastOf,
    lowerCaseObjectProperties,
    mapObject,
    merge,
    methods,
    mostOf,
    parseCookieString,
    parseQueryString,
    randomNumber,
    randomOneOf,
    randomText,
    reject,
    rxStringToRx,
    same,
    schemaObjectHasSkipCode,
    smart,
    toPlainObject: function (value, options) {
        const map = new Map();
        if (!options) options = {};
        if (typeof options !== 'object') throw Error('Parameter "options" must be an object');
        if (!options.hasOwnProperty('allowInheritedProperties')) options.allowInheritedProperties = false;
        if (!options.hasOwnProperty('preserve')) options.preserve = [];

        if (!Array.isArray(options.preserve)) throw Error('Option "preserve" must be an array');
        options.preserve = new Set(options.preserve);
        options.preserve.add(Date);

        const result = toPlainObject(value, options, map);
        if (!result.set) throw Error('Unable to convert value to plain object');
        return result.value;
    },
    toQueryString,
    ucFirst,
    validateExamples,
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

function dateIsFrozen() {
    throw Error('Date object cannot be modified');
}

// given multiple possible schemas (anyOf or oneOf) find the correct schema based on the provided value
function determineSchemaFromSchemas(schemas, value) {
    const type = typeof value;
    const length = schemas.length;
    for (let i = 0; i < length; i++) {
        const schema = schemas[i];
        if (schema.type === 'array' && Array.isArray(value)) return schema;
        if (schema.type === 'boolean' && type === 'boolean') return schema;
        if (schema.type === 'integer' && type === 'number' && /^\d+$/.test(String(value))) return schema;
        if (schema.type === 'number' && type === 'number') return schema;
        if (schema.type === 'string' && type === 'string') return schema;
        if (schema.type === 'object' && type === 'object' && value !== null) return schema;
        if (value === null && (schema.nullable || schema['x-nullable'])) return schema;
        if (schema.anyOf) {
            const schema = determineSchemaFromSchemas(schema.anyOf, value)
            if (schema !== null) return schema;
        } else if (schema.oneOf) {
            const schema = determineSchemaFromSchemas(schema.oneOf, value)
            if (schema !== null) return schema;
        } else if (schema.allOf) {
            const length = schema.allOf.length;
            for (let j = 0; j < length; j++) {
                const schema = schema.allOf[j];
                if (schema.type !== undefined) return schema;
                if (schema.anyOf || schema.oneOf) return determineSchemaFromSchemas(schema.anyOf ?? schema.oneOf, value);
            }
        }
    }
    return null;
}

function edgeSlashes (value, start, end) {
    value = value.replace(/^\//, '').replace(/\/$/, '');
    if (value.length === 0 && (start || end)) return '/';
    if (start) value = '/' + value;
    if (end) value += '/';
    return value;
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
        store.forEach((value, order) => {
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
                        order,
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
        if (a.index < b.index) return 1;
        if (a.index > b.index) return -1;
        return a.order < b.order ? -1 : 1;
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

function freeze (value) {
    if (!value || typeof value !== 'object' || value instanceof Buffer) return value;
    if (value instanceof Date) {
        value.setDate = dateIsFrozen;
        value.setFullYear= dateIsFrozen;
        value.setHours= dateIsFrozen;
        value.setMilliseconds= dateIsFrozen;
        value.setMinutes= dateIsFrozen;
        value.setMonth= dateIsFrozen;
        value.setSeconds= dateIsFrozen;
        value.setTime= dateIsFrozen;
        value.setUTCDate= dateIsFrozen;
        value.setUTCFullYear= dateIsFrozen;
        value.setUTCHours= dateIsFrozen;
        value.setUTCMilliseconds= dateIsFrozen;
        value.setUTCMinutes= dateIsFrozen;
        value.setUTCMonth= dateIsFrozen;
        value.setUTCSeconds= dateIsFrozen;
        value.setYear= dateIsFrozen;
    }
    Object.freeze(value);
    return value;
}

function getDateFromValidDateString (format, string) {
    const date = new Date(string);
    const isoDate = date.toISOString();
    const match = format === 'date'
        ? rx.date.exec(isoDate.substring(0,10))
        : rx['date-time'].exec(isoDate);
    const year = +match[1];
    const month = +match[2] - 1;
    const day = +match[3];
    const hour = +match[4] || 0;
    const minute = +match[5] || 0;
    const second = +match[6] || 0;
    const millisecondStr = convertFractionToMilliseconds(match[7]);
    const millisecond = +millisecondStr || 0;
    return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hour &&
    date.getUTCMinutes() === minute &&
    date.getUTCSeconds() === second &&
    date.getUTCMilliseconds() === millisecond ? date : null;
}

function convertFractionToMilliseconds(fraction) {
    if (fraction === undefined) {
        return undefined;
    }
    var milliseconds = fraction;
    const lengthDiff = 3 - fraction.length;
    if (lengthDiff > 0) {
        // Need to add "0" to get 3 digits
        milliseconds = fraction + "0".repeat(lengthDiff);
    }
    else if (lengthDiff < 0) {
        // Need to truncate to get 3 digits
        milliseconds = fraction.substr(0, 3);
    }
    return milliseconds;
}

function getDefinitionType (definition) {
    if (Array.isArray(definition)) return 'array';
    if (isPlainObject(definition)) return 'object';
    if (definition === null) return 'null';

    const type = typeof definition;
    return type === 'object' ? 'decoratedObject' : type;
}

function greatestCommonDenominator(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
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

    // check for modified constructor or no constructor
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

function leastCommonMultiple (x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) return false;
    return (!x || !y) ? 0 : Math.abs((x * y) / greatestCommonDenominator(x, y));
}

function leastOf (numberArray) {
    const length = numberArray.length;
    let least = numberArray[0];
    for (let i = 1; i < length; i++) {
        if (numberArray[i] < least) least = numberArray[i];
    }
    return least;
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

function merge (target, source, mapping = '') {
    if (isPlainObject(target)) {
        if (!isObject(source)) throw Error(mapping + ': Unable to merge non-object into plain object.');
        Object.keys(source).forEach(key => {
            target[key] = target.hasOwnProperty(key)
                ? merge(target[key], source[key], mapping + '> ' + key)
                : source[key];
        });
        return target;
    } else if (Array.isArray(target)) {
        if (!Array.isArray(source)) throw Error(mapping + ': Unable to merge non-array into array');
        const tLength = target.length;
        const length = tLength > source.length
            ? tLength
            : source.length;
        for (let i = 0; i < length; i++) {
            if (i >= tLength) {
                target[i] = source[i];
            } else {
                target[i] = merge(target[i], source[i], '> ' + i);
            }
        }
        return target;
    } else {
        return source;
    }
}

function methods () {
    return ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
}

function mostOf (numberArray) {
    const length = numberArray.length;
    let most = numberArray[0];
    for (let i = 1; i < length; i++) {
        if (numberArray[i] > most) most = numberArray[i];
    }
    return most;
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

    if (max < min) throw Error('Maximum value must be greater than or equal to minimum value')

    if (isNumber(multipleOf) && multipleOf > 0) {
        const modMin = min % multipleOf;
        if (modMin !== 0) min += multipleOf - modMin;
        max -= max % multipleOf;

        if (max === min) return max;

        let index = Math.round(Math.random() * (max - min) / multipleOf);

        return (index + min) * multipleOf;

    } else {
        const multiplier = minIsNumber && maxIsNumber ? max - min : spread;
        let num = Math.random() * multiplier;
        if (minIsNumber) num += min;

        num = round(num, decimalPlaces);

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
    const length = randomNumber({ min: minLength, max: maxLength }) + 1;
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
    result = result.replace(/[,.:;!?]$/, ''); // if ends in punctuation then remove it
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

function round (number, decimalPlaces = 0) {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
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

function schemaObjectHasSkipCode(schema, skipCode) {
    const skipCodes = typeof schema === 'object' && schema !== null
        ? schema['x-enforcer-exception-skip-codes'] ?? ''
        : ''
    const codes = skipCodes.split(/ +/).map(code => code.trim())
    return codes.includes(skipCode);
}

function smart (value) {
    const type = typeof value;
    if (type === 'string') return '"' + value.replace(/"/g, '\\"') + '"';
    if (value instanceof Date) return isNaN(value) ? 'invalid date object' : value.toISOString();
    if (Array.isArray(value)) {
        let result = '[' + String(value) + ']';
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
        const name = value.constructor ? value.constructor.name : '';
        return '[object' + (name ? ' ' + name : '') + ']';
    }
    return String(value);
}

function toPlainObject (value, options, map) {
    if (value && value.constructor && options.preserve.has(value.constructor)) {
        return { set: true, value };

    } else if (Array.isArray(value)) {
        if (map.has(value)) return map.get(value);
        const result = { set: true, value: [] };
        map.set(value, result);
        value.forEach(v => {
            const r = toPlainObject(v, options, map);
            if (r.set) result.value.push(r.value);
        });
        return result;

    } else if (value && typeof value === 'object') {
        if (map.has(value)) return map.get(value);
        const result = { set: true, value: {} };
        map.set(value, result);
        for (let k in value) {
            if (options.allowInheritedProperties || value.hasOwnProperty(k)) {
                const r = toPlainObject(value[k], options, map);
                if (r.set) result.value[k] = r.value;
            }
        }
        return result;

    } else if (value instanceof Object) {
        return { set: false };
    } else {
        return { set: true, value };
    }
}

function toQueryString (obj) {
    return queryString.stringify(obj);
}

function ucFirst (value) {
    return value[0].toUpperCase() + value.substr(1);
}

function validateExamples(context, exception, warn, options) {
    const skipCodes = options.exceptionSkipCodes;
    const escalateCodes = options.exceptionEscalateCodes;

    if (context.hasOwnProperty('schema')) {
        if (context.hasOwnProperty('example')) {
            let value;
            let error;
            [ value, error ] = context.schema.deserialize(context.example);
            if (!error) error = context.schema.validate(value);
            if (error && !skipCodes.WSCH006 && !schemaObjectHasSkipCode(context, 'WSCH006')) {
                const child = new Exception('Example not valid. [WSCH006]');
                child.push(error);
                (escalateCodes.WSCH006 ? exception : warn).at('example').push(child);
            }
            Object.defineProperty(context, 'example', {
                configurable: true,
                enumerable: true,
                value: freeze(value)
            });
        }
        if (context.hasOwnProperty('examples')) {
            const major = context.enforcerData.major;
            Object.keys(context.examples)
                .forEach(key => {
                    let value;
                    let error;
                    const example = major === 2
                        ? context.examples[key]
                        : context.examples[key].value;
                    [ value, error ] = context.schema.deserialize(example);
                    if (!error) error = context.schema.validate(value);
                    if (error && !skipCodes.WSCH006 && !schemaObjectHasSkipCode(context, 'WSCH006')) {
                        const child = new Exception('Example not valid. [WSCH006]');
                        child.push(error);
                        (escalateCodes.WSCH006 ? exception : warn).at('examples').at(key).push(child);
                    }
                    if (major === 2) {
                        Object.defineProperty(context.examples, key, {
                            configurable: true,
                            enumerable: true,
                            value: freeze(value)
                        });
                    } else {
                        Object.defineProperty(context.examples[key], 'value', {
                            configurable: true,
                            enumerable: true,
                            value: freeze(value)
                        });
                    }
                });
        }
    }
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
