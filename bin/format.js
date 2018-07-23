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
const util          = require('./util');

const Error = util.Error;
const smart = util.smart;
const zeros = '00000000';

/**
 * Convert value into a binary octet string.
 * @param {boolean, number, string, Buffer} value
 * @returns {{ error: string|null, value: string|null}}
 */
exports.binary = function(value) {
    const type = typeof value;

    if (type === 'boolean') {
        return formatted(null, '0000000' + (value ? '1' : '0'));

    } else if (type === 'number' && !isNaN(value)) {
        return formatted(null, decToBin(value));

    } else if (type === 'string' || value instanceof Buffer) {
        const buffer = Buffer.from(value);
        let binary = '';
        for (let i = 0; i < buffer.length; i++) {
            const byte = buffer[i].toString(2);
            binary += zeros.substr(byte.length) + byte;
        }
        return formatted(null, binary);

    } else {
        return formatted('Cannot convert to binary. The value must be a boolean, ' +
            'number, string, or buffer. Received: ' + smart(value));
    }
};

/**
 * Convert a value to a boolean.
 * @param {*} value
 * @returns {{ error: null, value: boolean}}
 */
exports.boolean = function(value) {
    return formatted(null, !!value);
};

/**
 * Convert to base64 encoded string.
 * @param {boolean, number, string, buffer} value
 * @returns {{ error: string|null, value: string|null}}
 */
exports.byte = function(value) {
    const type = typeof value;

    if (type === 'boolean') {
        return formatted(null, value ? 'AQ==' : 'AA==');

    } else if (type === 'number' && !isNaN(value)) {
        const binary = decToBin(value);
        const bytes = [];
        for (let i = 0; i < binary.length; i += 8) bytes.push(parseInt(binary.substr(i, 8), 2));
        return formatted(null, Buffer.from(bytes).toString('base64'));

    } else if (type === 'string') {
        return formatted(null, Buffer.from(value, 'utf8').toString('base64'));

    } else if (value instanceof Buffer) {
        return formatted(null, value.toString('base64'));

    } else {
        return formatted('Cannot convert to byte. The value must be a boolean, ' +
            'number, string, or buffer. Received: ' + smart(value));
    }
};

/**
 * Take a number, date value, or a date string and convert to date format.
 * @param {Date, string, number} value
 * @returns {{ error: string|null, value: string|null}}
 */
exports.date = function(value) {
    const data = exports.dateTime(value);
    if (data.error) {
        data.error = data.error.replace('date-time', 'date');
        return data;
    }
    return formatted(null, data.value.substr(0, 10));
};

/**
 * Take a number, date value, or a date string and convert to ISO date format.
 * @param {Date, string, number} value
 * @returns {{ error: string|null, value: string|null}}
 */
exports.dateTime = function(value) {
    const type = typeof value;
    const isString = type === 'string';

    if (isString && rx.dateTime.test(value)) {
        return formatted(null, new Date(value).toISOString());

    } else if (isString && rx.date.test(value)) {
        return formatted(null, new Date(value + 'T00:00:00.000Z').toISOString());

    } else if (util.isDate(value)) {
        return formatted(null, value.toISOString());

    } else if (type === 'number') {
        return formatted(null, new Date(value).toISOString());

    } else {
        return formatted('Cannot convert to date-time. The value must be a Date, ' +
            'a number, or a date string. Received: ' + smart(value));
    }
};
exports['date-time'] = exports.dateTime;

/**
 * Convert a value to an integer.
 * @param {*} value
 * @returns {{ error: string|null, value: number|null}}
 */
exports.integer = function(value) {
    const result = +value;
    if (!isNaN(result)) return formatted(null, Math.round(result));
    return formatted('Cannot convert to integer. The value must be numeric. ' +
        'Received: ' + smart(value));
};

/**
 * Convert a value to a number.
 * @param {string, number, boolean} value
 * @returns {{ error: string|null, value: number|null}}
 */
exports.number = function(value) {
    const result = +value;
    if (!isNaN(result)) return formatted(null, result);
    return formatted('Cannot convert to number. The value must be numeric. ' +
        'Received: ' + smart(value));
};

/**
 * Convert a value to a string.
 * @param {string, number, boolean, object, date} value
 * @returns {{ error: string|null, value: string|null}}
 */
exports.string = function(value) {
    switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
            return formatted(null, String(value));
        case 'object':
            if (util.isDate(value)) return formatted(null, value.toISOString());
            return formatted(null, JSON.stringify(value));
    }
    return formatted('Cannot convert to string. The value must be a string, ' +
        'a number, or a boolean, and Object, or a Date. Received: ' + smart(value));
};

function decToBin(dec) {
    const binary = (dec >>> 0).toString(2);
    const mod = binary.length % 8;
    return mod === 0 ? binary : zeros.substr(mod) + binary;
}

function formatted(err, value) {
    return {
        error: err ? err : null,
        value: err ? null : value
    }
}