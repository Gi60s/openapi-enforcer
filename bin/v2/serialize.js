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
const format    = require('../format');
const parse     = require('../parse');
const util      = require('../util');

exports.deserialize = deserialize;
exports.serialize = serialize;

function deserialize(exception, schema, value) {
    if (value === null && schema['x-nullable'] === true) return null;
    if (schema.allOf) {
        const result = {};
        schema.allOf.forEach((schema, index) => {
            const v = deserialize(exception.nest('/allOf/' + index), schema, value);
            Object.assign(result, v)
        });
        return result;

    } else {
        const type = util.schemaType(schema);
        let result;
        switch (type) {
            case 'array':
                if (Array.isArray(value)) return schema.items
                    ? value.map((v,i) => deserialize(exception.nest('/' + i), schema.items, v))
                    : value;
                exception.push('Expected an array. Received: ' + util.smart(value));
                return;

            case 'boolean':
            case 'integer':
            case 'number':
                result = parse[type](value);
                if (result.error) exception.push(result.error);
                return result.value;

            case 'string':
                switch (schema.format) {
                    case 'binary':
                    case 'byte':
                    case 'date':
                    case 'date-time':
                        result = parse[schema.format](value);
                        break;
                    default:
                        result = { value: value };
                }
                if (result.error) exception.push(result.error);
                return result.value;

            case 'object':
                if (value && typeof value === 'object') {
                    const result = {};
                    const additionalProperties = schema.additionalProperties;
                    const properties = schema.properties || {};
                    Object.keys(value).forEach(key => {
                        if (properties.hasOwnProperty(key)) {
                            result[key] = deserialize(exception.nest('/' + key), properties[key], value[key]);
                        } else if (additionalProperties) {
                            result[key] = deserialize(exception.nest('/' + key), additionalProperties, value[key]);
                        } else {
                            exception.push('Property not allowed: ' + key);
                        }
                    });
                    return result;
                }
                exception.push('Expected an object. Received: ' + util.smart(value));
                return;

            default:
                exception.push('Unknown schema type');
                return;
        }
    }
}

function serialize(exception, schema, value) {
    if (value === null && schema['x-nullable'] === true) return null;
    if (schema.allOf) {
        const result = {};
        schema.allOf.forEach((schema, index) => {
            const v = serialize(exception.nest('/allOf/' + index), schema, value);
            Object.assign(result, v)
        });
        return result;

    } else {
        const type = util.schemaType(schema);
        let result;
        switch (type) {
            case 'array':
                if (Array.isArray(value)) {
                    return schema.items
                        ? value.map((v, i) => serialize(exception.nest('/' + i), schema.items || {}, v))
                        : value;
                }
                exception.push('Expected an array. Received: ' + util.smart(value));
                return;

            case 'boolean':
            case 'integer':
            case 'number':
                result = format[type](value);
                if (result.error) exception.push(result.error);
                return result.value;

            case 'string':
            default:
                switch (schema.format) {
                    case 'binary':
                    case 'byte':
                    case 'date':
                    case 'date-time':
                        result = format[schema.format](value);
                        break;
                    default:
                        result = format.string(value);
                }
                if (result.error) exception.push(result.error);
                return result.value;

            case 'object':
                if (value && typeof value === 'object') {
                    const result = {};
                    const additionalProperties = schema.additionalProperties;
                    const properties = schema.properties || {};
                    Object.keys(value).forEach(key => {
                        if (properties.hasOwnProperty(key)) {
                            result[key] = serialize(exception.nest('/' + key), properties[key], value[key]);
                        } else if (typeof additionalProperties === 'object') {
                            result[key] = serialize(exception.nest('/' + key), additionalProperties, value[key]);
                        } else if (additionalProperties) {
                            result[key] = value[key];
                        } else {
                            exception.push('Property not allowed: ' + key);
                        }
                    });
                    return result;
                }
                return value;
        }
    }
}