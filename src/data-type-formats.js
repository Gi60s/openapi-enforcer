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
    constructors: [ Buffer ],

    deserialize: function ({ exception, value }) {
        if (value instanceof Buffer) {
            return value;
        } else if (typeof value !== 'string' || !rx.binary.test(value)) {
            exception.message('Expected a binary octet string');
        } else {
            const length = value.length;
            const array = [];
            for (let i = 0; i < length; i += 8) array.push(parseInt(value.substr(i, 8), 2))
            return Buffer.from(array, 'binary');
        }
    },

    random: randomBuffer(8),

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
    constructors: [ Buffer ],

    deserialize: function ({ exception, value }) {
        if (value instanceof Buffer) {
            return value;
        } else if (typeof value === 'string') {
            value = value.replace(/(\s)/gm, "");
            if (!rx.byte.test(value) || value.length % 4 !== 0) {
                exception.message('Expected a base64 string');
            } else {
                return Buffer.from(value, 'base64');
            }
        } else {
            exception.message('Expected a base64 string');
        }
    },

    random: randomBuffer(4),

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
    constructors: [ Date ],

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

    random: randomDate,

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
    constructors: [ Date ],

    deserialize: function ({ exception, value }) {
        if (value instanceof Date) {
            return value;
        } else if (typeof value !== 'string' || !rx.dateTime.test(value)) {
            exception.message('Expected a date-time string of the format YYYY-MM-DDThh:mm:ss.sssZ');
        } else {
            const date = util.getDateFromValidDateString('date-time', value);
            if (!date) {
                exception.message('Expected a date-time string of the format YYYY-MM-DDThh:mm:ss.sssZ');
            } else {
                return date;
            }
        }
    },

    isNumeric: true,

    random: randomDate,

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

function randomBuffer (divider) {
    return function ({ schema }, { randomNumber }) {
        const hasMin = schema.hasOwnProperty('minLength');
        const hasMax = schema.hasOwnProperty('maxLength');

        const config = {};
        if (hasMin && hasMax) {
            config.min = schema.minLength / divider;
            config.max = schema.maxLength / divider;
        } else if (hasMin) {
            config.min = +schema.minLength / divider;
            config.max = config.min + 25;
        } else if (hasMax) {
            config.max = +schema.maximum / divider;
            config.min = config.max - 25;
        } else {
            config.min = 1;
            config.max = 25;
        }

        const length = randomNumber(config);
        const array = [];
        for (let i = 0; i < length; i++) array.push(Math.floor(Math.random() * 256));
        return Buffer.from(array);
    }
}

function randomDate({ schema }, { randomNumber }) {
    const fiveYears = 157248000000; // 5 years in milliseconds
    const hasMin = schema.hasOwnProperty('minimum');
    const hasMax = schema.hasOwnProperty('maximum');
    const config = {
        exclusiveMinimum: schema.exclusiveMinimum,
        exclusiveMaximum: schema.exclusiveMaximum
    };

    if (hasMin && hasMax) {
        config.min = +schema.minimum;
        config.max = +schema.maximum;
    } else if (hasMin) {
        config.min = +schema.minimum;
        config.max = config.min + fiveYears;
    } else if (hasMax) {
        config.max = +schema.maximum;
        config.min = config.max - fiveYears;
    } else {
        const adder = fiveYears / 2;
        config.min = Date.now() - adder;
        config.max = Date.now() + adder;
    }

    const value = randomNumber(config);
    if (value === undefined) return;
    return new Date(value);
}
