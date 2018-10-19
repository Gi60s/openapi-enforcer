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
const rx        = require('../rx');
const util      = require('../util');

const binary = {};
const byte = {};

module.exports = {
    binary,
    byte
};

binary.deserialize = function ({ exception, value }) {
    if (!rx.binary.test(value)) {
        exception('Value is not a binary octet string');
    } else {
        const length = value.length;
        const array = [];
        for (let i = 0; i < length; i += 8) array.push(parseInt(value.substr(i, 8), 2))
        return Buffer.from ? Buffer.from(array, 'binary') : new Buffer(array, 'binary');
    }
};

binary.random = function ({ schema }) {
    // TODO: random
    throw Error('TODO');
};

binary.serialize = function ({ coerce, exception, value }) {
    if (coerce) value = coerceToBuffer(exception, value);
    if (value instanceof Buffer) {
        let binary = '';
        for (let i = 0; i < value.length; i++) {
            const byte = value[i].toString(2);
            binary += zeros.substr(byte.length) + byte;
        }
        return binary;
    } else {
        exception('Expected a Buffer instance. Received: ' + util.smart(originalValue));
    }
};

binary.validate = function ({ exception, value }) {
    if (!Buffer.isBuffer(value)) {
        exception('Expected value to be a buffer. Received: ' + smart(value));
    } else {
        util.validateMaxMin(exception, schema, 'binary length', 'maxLength', 'minLength', true, value.length * 8, schema.maxLength, schema.minLength);
    }
};

byte.deserialize = function ({ exception, value }) {
    if (!rx.byte.test(value) && value.length % 4 !== 0) {
        exception('Value is not a base64 string');
    } else {
        return Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'base64');
    }
};

byte.random = function ({ schema }) {
    // TODO: random
    throw Error('TODO');
};

byte.serialize = function ({ coerce, exception, value }) {
    const originalValue = value;
    if (coerce) value = coerceToBuffer(exception, value);
    if (value instanceof Buffer) {
        return value.toString('base64');
    } else {
        exception('Expected a Buffer instance. Received: ' + util.smart(originalValue));
    }
};

byte.validate = function ({ exception, value }) {
    if (!Buffer.isBuffer(value)) {
        exception('Expected value to be a buffer. Received: ' + smart(value));
    } else {
        util.validateMaxMin(exception, schema, 'byte length', 'maxLength', 'minLength', true, value.length, schema.maxLength, schema.minLength);
    }
};



function coerceToBuffer(exception, value) {
    const type = typeof value;
    if (type === 'number' || type === 'boolean') {
        value = Number(value);
        if (!isNaN(value) && value >= 0) {
            let hex = value.toString(16);
            if (hex.length % 2) hex = '0' + hex;

            const array = [];
            const length = hex.length;
            for (let i = 0; i < length; i += 2) {
                array.push(hex.substr(i, 2));
            }

            value = Buffer.from(array.join(''), 'hex');
        } else {
            exception('Unable to coerce value');
        }
    } else if (type === 'string') {
        value = value ? Buffer.from(value) : Buffer.from([0]);
    }
    return value;
}