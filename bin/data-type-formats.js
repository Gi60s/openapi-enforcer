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
const util      = require('./util');

const zeros = '00000000';

exports.binary = {
    deserialize: function ({ exception, value }) {
        if (value instanceof Buffer) {
            return value;
        } else if (typeof value !== 'string' || !rx.binary.test(value)) {
            exception.message('Expected a binary octet string');
        } else {
            const length = value.length;
            const array = [];
            for (let i = 0; i < length; i += 8) array.push(parseInt(value.substr(i, 8), 2))
            return Buffer.from ? Buffer.from(array, 'binary') : new Buffer(array, 'binary');
        }
    },

    random: function ({ schema }, { length, maxLength, minLength }) {
        if (maxLength === undefined) maxLength = schema.hasOwnProperty('maxLength') / 8 ? schema.maxLength : 25;
        if (minLength === undefined) minLength = schema.hasOwnProperty('minLength') / 8 ? schema.minLength : 1;
        if (length === undefined) length = minLength + Math.round(Math.random() * (maxLength - minLength));
        const array = [];
        for (let i = 0; i < length; i++) array.push(Math.floor(Math.random() * 256));
        return Buffer.from(array);
    },

    serialize: function ({ exception, value }) {
        if (value instanceof Buffer) {
            let binary = '';
            for (let i = 0; i < value.length; i++) {
                const byte = value[i].toString(2);
                binary += zeros.substr(byte.length) + byte;
            }
            return binary;
        } else {
            exception.message('Expected a Buffer instance. Received: ' + util.smart(value));
        }
    },

    validate: function ({ exception, schema, value }) {
        if (!Buffer.isBuffer(value)) {
            exception.message('Expected value to be a buffer. Received: ' + util.smart(value));
        } else {
            util.validateMaxMin(exception, schema, 'binary length', 'maxLength', 'minLength', true, value.length * 8, schema.maxLength, schema.minLength);
        }
    },

    validator: function (data) {
        const { exception } = data;
        if (this.hasOwnProperty('maxLength') && this.maxLength % 8 !== 0) {
            exception.at('maxLength').message('Binary format requires maxLength to be a multiple of 8');
        }
        if (this.hasOwnProperty('minLength') && this.minLength % 8 !== 0) {
            exception.at('minLength').message('Binary format requires minLength to be a multiple of 8');
        }
    }
};

exports.byte = {
    deserialize: function ({ exception, value }) {
        if (value instanceof Buffer) {
            return value;
        } else if (typeof value !== 'string' || !rx.byte.test(value) || value.length % 4 !== 0) {
            exception.message('Expected a base64 string');
        } else {
            return Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'base64');
        }
    },

    random: function ({ schema }, { length, maxLength, minLength }) {
        if (maxLength === undefined) maxLength = schema.hasOwnProperty('maxLength') / 4 ? schema.maxLength : 150;
        if (minLength === undefined) minLength = schema.hasOwnProperty('minLength') / 4 ? schema.minLength : 1;
        if (length === undefined) length = minLength + Math.round(Math.random() * (maxLength - minLength));
        const array = [];
        for (let i = 0; i < length; i++) array.push(Math.floor(Math.random() * 256));
        return Buffer.from(array);
    },

    serialize: function ({ exception, value }) {
        if (value instanceof Buffer) {
            return value.toString('base64');
        } else {
            exception.message('Expected a Buffer instance. Received: ' + util.smart(value));
        }
    },

    validate: function ({ exception, schema, value }) {
        if (!Buffer.isBuffer(value)) {
            exception.message('Expected value to be a buffer. Received: ' + util.smart(value));
        } else {
            util.validateMaxMin(exception, schema, 'byte length', 'maxLength', 'minLength', true, value.length, schema.maxLength, schema.minLength);
        }
    },

    validator: function (data) {
        const { exception } = data;
        if (this.hasOwnProperty('maxLength') && this.maxLength % 4 !== 0) {
            exception.at('maxLength').message('Byte format requires maxLength to be a multiple of 4');
        }
        if (this.hasOwnProperty('minLength') && this.minLength % 4 !== 0) {
            exception.at('minLength').message('Byte format requires minLength to be a multiple of 4');
        }
    }
};

exports.date = {
    deserialize: function ({ exception, value }) {
        if (value instanceof Date) {
            return value;
        } else if (typeof value !== 'string' || !rx.date.test(value)) {
            exception.message('Expected a date string of the format YYYY-MM-DD');
        } else {
            const date = util.getDateFromValidDateString('date', value);
            if (!date) {
                exception.message('Value is not a valid date');
            } else {
                return date;
            }
        }
    },

    isNumeric: true,

    random: function ({ schema }, { minimum, maximum }) {
        minimum = +minimum;
        maximum = +maximum;
        const value = minimum + Math.round(Math.random() * (maximum - minimum));
        return new Date(value);
    },

    serialize: function ({ exception, value }) {
        const originalValue = value;
        const type = typeof value;
        if (type === 'string' && (rx.date.test(value) || rx.dateTime.test(value))) value = new Date(value);
        if (util.isDate(value)) {
            return value.toISOString().substr(0, 10);
        } else {
            exception.message('Expected a valid Date instance or date formatted string. Received: ' + util.smart(originalValue));
        }
    },

    validate: function ({ exception, schema, value }) {
        if (!util.isDate(value)) {
            exception.message('Expected a valid date object. Received: ' + util.smart(value));
        } else {
            util.validateMaxMin(exception, schema, schema.format, 'maximum', 'minimum', false, value, schema.maximum, schema.minimum);
        }
    },

    validator: function (data) {
        const { exception } = data;
        if (this.hasOwnProperty('maxLength') && this.maxLength !== 10) {
            exception.at('maxLength').message('Date format requires maxLength to equal 10');
        }
        if (this.hasOwnProperty('minLength') && this.minLength % 4 !== 0) {
            exception.at('minLength').message('Date format requires minLength to equal 10');
        }
    }
};

exports.dateTime = {
    deserialize: function ({ exception, value }) {
        if (value instanceof Date) {
            return value;
        } else if (typeof value !== 'string' || !rx.dateTime.test(value)) {
            exception.message('Expected a date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ');
        } else {
            const date = util.getDateFromValidDateString('date-time', value);
            if (!date) {
                exception.message('Expected a date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ');
            } else {
                return date;
            }
        }
    },

    isNumeric: true,

    random: function ({ schema }, { minimum, maximum }) {
        minimum = +minimum;
        maximum = +maximum;
        const value = minimum + Math.round(Math.random() * (maximum - minimum));
        return new Date(value);
    },

    serialize: function ({ exception, value }) {
        const originalValue = value;
        const type = typeof value;
        if (type === 'string' && (rx.date.test(value) || rx.dateTime.test(value))) value = new Date(value);
        if (util.isDate(value)) {
            return value.toISOString();
        } else {
            exception.message('Expected a valid Date instance or an ISO date formatted string. Received: ' + util.smart(originalValue));
        }
    },

    validate: function ({ exception, schema, value }) {
        if (!util.isDate(value)) {
            exception.message('Expected a valid date object. Received: ' + util.smart(value));
        } else {
            util.validateMaxMin(exception, schema, schema.format, 'maximum', 'minimum', false, value, schema.maximum, schema.minimum);
        }
    },

    validator: function (data) {
        const { exception } = data;
        if (this.hasOwnProperty('maxLength') && this.maxLength !== 10) {
            exception.at('maxLength').message('Date-time format requires maxLength to equal 24');
        }
        if (this.hasOwnProperty('minLength') && this.minLength % 4 !== 0) {
            exception.at('minLength').message('Date-time format requires minLength to equal 24');
        }
    }
};