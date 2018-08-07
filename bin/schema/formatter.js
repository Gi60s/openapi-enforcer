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
const merge     = require('./merge');
const rx        = require('../rx');
const util      = require('../util');

const zeros = '00000000';

exports.deserialize = function (exception, schema, value) {
    const type = schema.type;

    if (schema.allOf) {
        const merged = merge(schema.allOf);
        if (merged.error) {
            exception('Unable to merge allOf schemas');
            return { error: true };
        } else {
            return exception.deserialize(exception.at('allOf'), merged.value, value);
        }

    } else if (schema.anyOf || schema.oneOf) {
        if (schema.discriminator) {
            const data = schema.getDiscriminator(value);
            const subSchema = data.schema;
            const key = data.key;
            if (!subSchema) {
                exception('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
            } else {
                exports.deserialize(exception.nest('Discriminator property "' + key + '" as "' + value[key] + '" has one or more errors'), subSchema, value);
            }
        } else {
            return { value: value };
        }

    } else if (schema.not) {
        return { value: value };

    } else if (type === 'boolean' || type === 'integer' || type === 'number') {
        return { value: value };

    } else if (type === 'array') {
        if (!Array.isArray(value)) {
            exception('Expected an array. Received: ' + util.smart(value))
        } else if (schema.items) {
            let error = false;
            const result = value.map((value, index) => {
                const data = exports.deserialize(exception.at(index), schema.items, value);
                if (data.error) error = true;
                return data.value;
            });
            return { error: error, value: result };
        }

    } else if (type === 'object') {
        if (!util.isPlainObject(value)) {
            exception('Expected a plain object. Received: ' + util.smart(value));
        } else {
            const result = {};
            let error = false;
            Object.keys(value).forEach(key => {
                const subSchema = schema.properties.hasOwnProperty(key)
                    ? schema.properties[key]
                    : schema.additionalProperties;
                if (typeof subSchema === 'object') {
                    const data = exports.deserialize(exception.at(key), subSchema, value[key]);
                    if (data.error) error = true;
                    result[key] = data.value;
                } else {
                    result[key] = value[key];
                }
            });
            return { error: error, value: result };
        }

    } else if (type === 'string') {
        switch (schema.format) {
            case 'binary':
                if (!rx.binary.test(value)) {
                    exception('Value is not a binary octet string');
                    return { error: true };
                } else {
                    const length = value.length;
                    const array = [];
                    for (let i = 0; i < length; i+=8) array.push(parseInt(value.substr(i, 8), 2))
                    return { value: Buffer.from ? Buffer.from(array, 'binary') : new Buffer(array, 'binary') };
                }

            case 'byte':
                if (!rx.byte.test(value) && value.length % 4 !== 0) {
                    exception('Value is not a base64 string');
                    return { error: true };
                } else {
                    return { value: Buffer.from ? Buffer.from(value, 'base64') : new Buffer(value, 'base64') };
                }

            case 'date':
                if (!rx.date.test(value)) {
                    exception('Value is not date string of the format YYYY-MM-DD');
                    return { error: true };
                } else {
                    const date = util.getDateFromValidDateString('date', value);
                    if (!date) {
                        exception('Value is not a valid date');
                        return { error: true };
                    } else {
                        return { value: date };
                    }
                }

            case 'date-time':
                if (!rx.dateTime.test(value)) {
                    exception('Value is not date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ');
                    return { error: true };
                } else {
                    const date = util.getDateFromValidDateString('date-time', value);
                    if (!date) {
                        exception('Value is not a valid date-time');
                        return { error: true };
                    } else {
                        return { value: date };
                    }
                }

            default:
                return { value: value };
        }
    }
};

exports.serialize = function (exception, schema, value) {
    const type = schema.type;

    if (schema.allOf) {
        const merged = merge(schema.allOf);
        if (merged.error) {
            exception('Unable to merge allOf schemas');
            return { error: true };
        } else {
            return exception.serialize(exception.at('allOf'), merged.value, value);
        }

    } else if (schema.anyOf || schema.oneOf) {
        if (schema.discriminator) {
            const data = schema.getDiscriminator(value);
            const subSchema = data.schema;
            const key = data.key;
            if (!subSchema) {
                exception('Discriminator property "' + key + '" as "' + value[key] + '" did not map to a schema');
            } else {
                exports.serialize(exception.nest('Discriminator property "' + key + '" as "' + value[key] + '" has one or more errors'), subSchema, value);
            }
        } else {
            return { value: value };
        }

    } else if (schema.not) {
        return { value: value };

    } else if (type === 'boolean' || type === 'integer' || type === 'number') {
        return { value: value };

    } else if (type === 'array') {
        if (!Array.isArray(value)) {
            exception('Expected an array. Received: ' + util.smart(value))
        } else if (schema.items) {
            let error = false;
            const result = value.map((value, index) => {
                const data = exports.serialize(exception.at(index), schema.items, value);
                if (data.error) error = true;
                return data.value;
            });
            return { error: error, value: result };
        }

    } else if (type === 'object') {
        if (!util.isPlainObject(value)) {
            exception('Expected a plain object. Received: ' + util.smart(value));
        } else {

            const result = {};
            let error = false;
            Object.keys(value).forEach(key => {
                const subSchema = schema.properties.hasOwnProperty(key)
                    ? schema.properties[key]
                    : schema.additionalProperties;
                if (typeof subSchema === 'object') {
                    const data = exports.serialize(exception.at(key), subSchema, value[key]);
                    if (data.error) error = true;
                    result[key] = data.value;
                } else {
                    result[key] = value[key];
                }
            });
            return { error: error, value: result };
        }

    } else if (type === 'string') {
        switch (schema.format) {
            case 'binary':
                if (value instanceof Buffer) {
                    let binary = '';
                    for (let i = 0; i < value.length; i++) {
                        const byte = value[i].toString(2);
                        binary += zeros.substr(byte.length) + byte;
                    }
                    return {value: binary};
                } else {
                    exception('Value must be a Buffer instance');
                    return {error: true};
                }

            case 'byte':
                if (value instanceof Buffer) {
                    return {value: value.toString('base64')};
                } else {
                    exception('Value must be a Buffer instance');
                    return {error: true};
                }

            case 'date':
            case 'date-time':
                if (util.isDate(value)) {
                    const string = value.toISOString();
                    return {value: schema.format === 'date' ? string.substr(0, 10) : string};
                } else {
                    exception('Value must be a Date instance');
                    return {error: true};
                }

            default:
                return {value: value};
        }
    }
};