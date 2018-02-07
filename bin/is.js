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
const rx        = require('./rx');

/**
 * Check if a value is a valid base64 encoded string
 * @param {string} v
 * @returns {boolean}
 */
exports.byte = v => typeof v === 'string' && rx.byte.test(v) && v.length % 4 === 0;

/**
 * Check if a value is a valid binary string.
 * @param {string} v
 * @returns {boolean}
 */
exports.binary = v => typeof v === 'string' && rx.binary.test(v);

/**
 * Check to see if a value is a boolean.
 * @param {boolean|string} value
 * @param {boolean} [strict] If set to true the value must be typeof boolean
 * @returns {boolean}
 */
exports.boolean = (value, strict) => {
    if (strict && typeof value !== 'boolean') return false;
    return rx.boolean.test(value);
};

/**
 * Check to see if a value is a valid date format.
 * @param {string|Date} value
 * @param {boolean} [strict] If set to true the value must be a Date instance
 * @returns {boolean}
 */
exports.date = (value, strict) => {
    if (!strict && typeof value === 'string') {
        return rx.date.test(value);
    } else if (value instanceof Date) {
        return !(isNaN(value) || value.getUTCHours() || value.getUTCMinutes() ||
            value.getUTCSeconds() || value.getUTCMilliseconds());
    } else {
        return false;
    }
};

/**
 * Check to see if a value is a valid date-time format.
 * @param {string|Date} value
 * @param {boolean} [strict] If set to true the value must be a Date instance
 * @returns {boolean}
 */
exports.dateTime = (value, strict) => {
    if (!strict && typeof value === 'string') {
        return rx.dateTime.test(value);
    } else {
        return value instanceof Date && !isNaN(value);
    }
};

/**
 * Check to see if the value is an integer.
 * @param {number|string} value
 * @param {boolean} [strict] If set to true the value must be typeof number and !isNaN
 * @returns {boolean}
 */
exports.integer = (value, strict) => {
    if (strict && (typeof value !== 'number' || isNaN(value))) return false;
    return rx.integer.test(value);
};

/**
 * Check to see if the value is a number.
 * @param {number|string} value
 * @param {boolean} [strict] If set to true the value must be typeof number and !isNaN
 * @returns {boolean}
 */
exports.number = (value, strict) => {
    if (strict && (typeof value !== 'number' || isNaN(value))) return false;
    return rx.number.test(value);
};