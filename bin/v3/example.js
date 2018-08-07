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
const util      = require('../util');

module.exports = function(schema) {
    const type = util.schemaType(schema);
    if (type === 'array') {
        example(schema, )
    }
};

function random(choices, weight) {
    if (arguments.length < 2) weight = .5;
    const index = Math.floor(Math.random() * choices.length * (1 - weight));
    return choices[index];
}

function example(schema) {
    const type = util.schemaType(schema);
    let choices;
    switch (type) {
        case 'array':


            if (Array.isArray(value)) return value.map((v, i) => serialize(prefix + '/' + i, schema.items || {}, v));
            break;

        case 'boolean':
            choices = [false, true];
            if (schema.default) choices.push(schema.default);
            return random(choices);

        case 'integer':


        case 'number':
            return format[type](prefix, value);

        case 'object':
            if (value && typeof value === 'object') {
                const result = {};
                const additionalProperties = schema.additionalProperties;
                const properties = schema.properties || {};
                Object.keys(value).forEach(key => {
                    if (properties.hasOwnProperty(key)) {
                        result[key] = serialize(prefix + '/' + key, properties[key], value[key]);
                    } else if (additionalProperties) {
                        result[key] = serialize(prefix + '/' + key, additionalProperties, value[key]);
                    }
                });
                return result;
            }
            return value;

        case 'string':
        default:
            switch (schema.format) {
                case 'binary':
                case 'byte':
                case 'date':
                case 'date-time':
                    return format[schema.format](prefix, value);
            }
            return format.string(prefix, value);
    }
}