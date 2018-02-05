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
 * @returns {boolean}
 */
exports.boolean = function(value) {
    if (typeof value === 'boolean') return value;
    if (value === undefined) return false;
    if (value === 'false') return false;
    if (value === 'true') return true;
    throw Error('Expected "true", "false" or a boolean. Received: ' + smart(value));
};

/**
 * Parse client supplied base64 encoded string to a buffer.
 * @param {boolean, number, string, buffer} value
 * @returns {string}
 */
exports.byte = function(value) {
    if (!is.byte(value)) throw Error('Expected a base64 string. Received: ' + smart(value));
    return Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'binary');
};

/**
 * Parse client supplied date string into a Date object.
 * @param {string} value
 * @returns {Date}
 */
exports.date = function(value) {
    if (!is.date(value)) throw Error('Expected a date string of the format: YYYY-MM-DD. Received: ' + smart(value));
    return new Date(value + 'T00:00:00.000Z');
};

/**
 * Parse client supplied date-time string into a Date object.
 * @param {string} value
 * @returns {Date}
 */
exports.dateTime = function(value) {
    if (!is.dateTime(value)) throw Error('Expected a date-time string of the format: YYYY-MM-DDThh:mm:ss.sss. Received: ' + smart(value));
    return new Date(value);
};
exports['date-time'] = exports.dateTime;

/**
 * Parse client supplied value to an integer.
 * @param {*} value
 * @returns {number}
 */
exports.integer = function(value) {
    if (!is.integer(value)) throw Error('Cannot convert to integer. The value must be numeric without decimals. Received: ' + smart(value));
    return +value;
};

/**
 * Parse client supplied value to a number.
 * @param {string, number, boolean} value
 * @returns {number}
 */
exports.number = function(value) {
    if (!is.number(value)) throw Error('Cannot convert to number. The value must be numeric. Received: ' + smart(value));
    return +value;
};