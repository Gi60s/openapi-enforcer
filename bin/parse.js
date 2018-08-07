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
const rx            = require('./rx');
const smart         = require('./util').smart;

/**
 * Parse client supplied binary string to a buffer.
 * @param {string} value
 * @returns {{ error: string|null, value: Buffer }}
 */
exports.binary = function(value) {
    if (typeof value !== 'string' || !rx.binary.test(value)) {
        return parsed('Expected a binary octet string. Received: ' + smart(value));
    } else {
        const length = value.length;
        const array = [];
        for (let i = 0; i < length; i+=8) array.push(parseInt(value.substr(i, 8), 2))
        return parsed(null, Buffer.from ? Buffer.from(array, 'binary') : new Buffer(array, 'binary'));
    }
};

/**
 * Parse client supplied boolean.
 * @param {string|boolean} value
 * @returns {{ error: string|null, value: boolean }}
 */
exports.boolean = function(value) {
    if (value === false || value === 'false' || value === '') return parsed(null, false);
    if (value === true || value === 'true') return parsed(null, true);
    return parsed('Expected "true", "false" or an empty string. Received: ' + smart(value));
};

/**
 * Parse client supplied base64 encoded string to a buffer.
 * @param {string} value
 * @returns {{ error: string|null, value: Buffer }}
 */
exports.byte = function(value) {
    if (typeof value !== 'string' || !rx.byte.test(value) && value.length % 4 !== 0) {
        return parsed('Expected a base64 string. Received: ' + smart(value));
    } else {
        return parsed(null, Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'base64'));
    }
};

/**
 * Parse client supplied date string into a Date object.
 * @param {string} value
 * @returns {{ error: string|null, value: Date }}
 */
exports.date = function(value) {
    if (typeof value !== 'string' || !(isDateTime(value) || isDate(value))) {
        return parsed('Expected a date string of the format YYYY-MM-DD or YYYY-MM-DDTmm:hh:ss.sssZ. Received: ' + smart(value));

    } else {
        const result = new Date(value);
        result.setUTCHours(0);
        result.setUTCMinutes(0);
        result.setUTCSeconds(0);
        result.setUTCMilliseconds(0);
        return parsed(null, result);
    }
};

/**
 * Parse client supplied date-time string into a Date object.
 * @param {string} value
 * @returns {{ error: string|null, value: Date }}
 */
exports.dateTime = function(value) {
    if (typeof value !== 'string' || !(isDateTime(value) || isDate(value))) {
        return parsed('Expected a date string of the format YYYY-MM-DD or YYYY-MM-DDTmm:hh:ss.sssZ. Received: ' + smart(value));
    } else {
        return parsed(null, new Date(value));
    }
};
exports['date-time'] = exports.dateTime;

/**
 * Parse client supplied value to an integer.
 * @param {string|number} value
 * @returns {{ error: string|null, value: number }}
 */
exports.integer = function(value) {
    if (!rx.integer.test(value)) {
        return parsed('Cannot convert to integer. The value must be numeric without decimals. Received: ' + smart(value));
    } else {
        return parsed(null, +value);
    }
};

/**
 * Parse client supplied value to a number.
 * @param {string|number} value
 * @returns {{ error: string|null, value: number }}
 */
exports.number = function(value) {
    if (!rx.number.test(value)) {
        return parsed('Cannot convert to number. The value must be numeric. Received: ' + smart(value));
    } else {
        return parsed(null, +value);
    }
};


function isDate(value) {
    const match = rx.date.exec(value);
    if (!match) return false;
    const d = new Date(value);
    return d.getUTCFullYear() === +match[1] && d.getUTCMonth() + 1 === +match[2] && d.getUTCDate() === +match[3];
}

function isDateTime(value) {
    const match = rx.dateTime.exec(value);
    if (!match) return false;
    const d = new Date(value);
    return d.getUTCFullYear() === +match[1] && d.getUTCMonth() + 1 === +match[2] && d.getUTCDate() === +match[3] &&
        d.getUTCHours() === +match[4] && d.getUTCMinutes() === +match[5] && d.getUTCSeconds() === +match[6] &&
        d.getUTCMilliseconds() === +match[7];
}

function parsed(err, value) {
    return {
        error: err ? err : null,
        value: err ? null : value
    }
}