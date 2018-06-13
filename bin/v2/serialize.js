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
const parse     = require('../parse');
const util      = require('../util');

exports.deserialize = deserialize;
exports.serialize = function(schema, value) {

};

function deserialize(errors, prefix, schema, value) {
    if (schema.allOf) {
        const result = {};
        schema.allOf.forEach((schema, index) => {
            const v = deserialize(errors, prefix + '/allOf/' + index, schema, value);
            Object.assign(result, v)
        });
        return result;
    } else {
        const type = util.schemaType(schema);
        let result;
        switch (type) {
            case 'array':
                if (Array.isArray(value)) return schema.items
                    ? value.map((v,i) => deserialize(errors, prefix + '/' + i, schema.items, v))
                    : value;
                errors.push(prefix + ' Expected an array. Received: ' + value);
                break;

            case 'boolean':
            case 'integer':
            case 'number':
                result = parse[type](value);
                if (result.error) errors.push(prefix + ' ' + result.error);
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
                if (result.error) errors.push(prefix + ' ' + result.error);
                return result.value;

            case 'object':
                if (value && typeof value === 'object') {
                    const result = {};
                    const additionalProperties = schema.additionalProperties;
                    const properties = schema.properties || {};
                    Object.keys(value).forEach(key => {
                        if (properties.hasOwnProperty(key)) {
                            result[key] = deserialize(errors, prefix + '/' + key, properties[key], value[key]);
                        } else if (additionalProperties) {
                            result[key] = deserialize(errors, prefix + '/' + key, additionalProperties, value[key]);
                        }
                    });
                    return result;
                }
                errors.push(prefix + ' Expected an object. Received: ' + value);
                return;

            default:
                errors.push(prefix + ' Unknown schema type');
                return;
        }
    }
}