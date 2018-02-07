/**
 *  @license
 *    Copyright 2016 Brigham Young University
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
const is            = require('./is');
const smart         = require('./util').smart;

/**
 * Parse client supplied binary string to a buffer.
 * @param {string} value
 * @returns {Buffer}
 */
exports.binary = function(value) {
    if (!is.binary(value)) throw Error('Expected a binary octet string. Received: ' + smart(value));
    return Buffer.from ? Buffer.from(value, 'binary') : new Buffer(value, 'binary');
};

/**
 * Parse client supplied boolean.
 * @param {*} value
 * @param {boolean} [force=false]
 * @returns {boolean}
 */
exports.boolean = function(value, force) {
    if (typeof value === 'boolean') return value;
    if (value === 'false') return false;
    if (value === 'true') return true;
    if (force) return !!value;
    throw Error('Expected "true", "false" or a boolean. Received: ' + smart(value));
};

/**
 * Parse client supplied base64 encoded string to a buffer.
 * @param {boolean, number, string, buffer} value
 * @returns {Buffer}
 */
exports.byte = function(value) {
    if (!is.byte(value)) throw Error('Expected a base64 string. Received: ' + smart(value));
    return Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'base64');
};

/**
 * Parse client supplied date string into a Date object.
 * @param {string, number, Date} value
 * @param {boolean} [force=false]
 * @returns {Date}
 */
exports.date = function(value, force) {
    let result;

    if (value instanceof Date || is.date(value)) {
        result = new Date(value);
    } else if (!force) {
        throw Error('Expected a Date object or a date string of the format: YYYY-MM-DD. Received: ' + smart(value));
    } else if (is.dateTime(value)) {
        result = new Date(value);
    } else if (!isNaN(value)) {
        result = new Date(+value);
    } else {
        throw Error('Expected a Date object, a date string of the format YYYY-MM-DD or YYYY-MM-DDTmm:hh:ss.sssZ, or a numeric type. Received: ' + smart(value));
    }

    result.setUTCHours(0);
    result.setUTCMinutes(0);
    result.setUTCSeconds(0);
    result.setUTCMilliseconds(0);
    return result;
};

/**
 * Parse client supplied date-time string into a Date object.
 * @param {string, number, Date} value
 * @param {boolean} [force=false]
 * @returns {Date}
 */
exports.dateTime = function(value, force) {
    if (value instanceof Date || is.dateTime(value)) {
        return new Date(value);
    } else if (!force) {
        throw Error('Expected a Date object or a date-time string of the format: YYYY-MM-DDThh:mm:ss.sss. Received: ' + smart(value));
    } else if (is.date(value)) {
        return new Date(value);
    } else if (!isNaN(value)) {
        return new Date(+value);
    } else {
        throw Error('Expected a Date object, a date string of the format YYYY-MM-DD or YYYY-MM-DDTmm:hh:ss.sssZ, or a numeric type. Received: ' + smart(value));
    }
};
exports['date-time'] = exports.dateTime;

/**
 * Parse client supplied value to an integer.
 * @param {string, number} value
 * @param {boolean} [force=false]
 * @returns {number}
 */
exports.integer = function(value, force) {
    if (!force && !is.integer(value)) {
        throw Error('Cannot convert to integer. The value must be numeric without decimals. Received: ' + smart(value));
    } else if (isNaN(value)) {
        throw Error('Cannot convert to integer. The value must be numeric. Received: ' + smart(value));
    } else {
        return Math.round(+value);
    }
};

/**
 * Parse client supplied value to a number.
 * @param {string, number, boolean} value
 * @param {boolean} [force=false]
 * @returns {number}
 */
exports.number = function(value, force) {
    if ((!force && !is.number(value)) || isNaN(value)) {
        throw Error('Cannot convert to number. The value must be numeric. Received: ' + smart(value));
    }
    return +value;
};