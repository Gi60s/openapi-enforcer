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
const base          = require('../validator-parameter-base');
const Exception     = require('../exception');
const Result        = require('../result');
const util          = require('../util');

module.exports = {
    init: function (data) {
        const { context, exception, major, warn, options } = data;
        if (major === 2) {
            const def = base.extractSchemaDefinition({}, this);
            const [schema, error, warning] = context.Schema(def);
            if (schema) this.schema = schema;
            if (error) exception.merge(error);
            if (warning) warn.merge(warning);
        }
        util.validateExamples(this, exception, warn, options);
    },

    prototype: {
        stringify: function (value) {
            const { major } = this.enforcerData;
            const schema = this.schema;

            const exception = Exception('Unable to stringify value');

            if (major === 2) {
                return new Result(v2Stringify(this, this, exception, value), exception);

            } else if (major === 3) {
                const type = schema && schema.type;
                let result;
                if (type === 'array') {
                    result = value
                        .map((value, index) => stringifyPrimitive(this, schema.items, exception.at(index), value))
                        .join(',')
                } else if (type === 'object') {
                    const array = [];
                    Object.keys(value).forEach(key => {
                        const subSchema = schema.properties.hasOwnProperty(key)
                            ? schema.properties[key]
                            : schema.additionalProperties;
                        let val = value[key];

                        if (subSchema !== true) {
                            val = stringifyPrimitive(this, subSchema, exception.at(key), val);
                        } else if (typeof val !== 'string') {
                            exception.message('Unable to stringify value: ' + util.smart(val));
                        }

                        if (typeof val === 'string') {
                            if (this.explode) {
                                array.push(key + '=' + val)
                            } else {
                                array.push(key, val)
                            }
                        }
                    });
                    result = array.join(',');
                } else {
                    result = stringifyPrimitive(this, schema, exception, value);
                }
                return new Result(result, exception);
            }
        }
    },

    validator: function (data) {
        const { major } = data;
        const validator = base.validator(data);

        Object.assign(validator.properties, {
            explode: {
                type: 'boolean',
                default: false
            },
            required: {
                type: 'boolean',
                default: false
            },
            style: {
                weight: -5,
                allowed: major === 3,
                type: 'string',
                default: 'simple',
                enum: ['simple']
            }
        });

        return validator;
    }
};

function stringifyPrimitive(header, schema, exception, value) {
    if (value === undefined) {
        if (header.allowEmptyValue) return '';
        exception.message('Empty value not allowed');

    } else if (value === null) {
        if (schema.nullable) return 'null';
        exception.message('Null value not allowed');

    } else if (schema.type === 'boolean') {
        if (value === true) return 'true';
        if (value === false) return 'false';
        exception.message('Expected true or false. Received: ' + util.smart(value))

    } else if (schema.type === 'integer' || schema.type === 'number') {
        if (typeof value === 'number' && !isNaN(value)) return String(value);
        const mode = schema.type === 'integer' ? 'an integer' : 'a number';
        exception.message('Expected ' + mode + '. Received: ' + util.smart(value));

    } else if (schema.type === 'string') {
        return value;

    } else {
        exception.message('Unable to stringify value: ' + util.smart(value))
    }
}

function v2Stringify(parameter, schema, exception, value) {
    if (schema.type === 'array') {
        const values = value.map((value, index) => schema.items ? v2Stringify(parameter, schema.items, exception.at(index), value) : value);
        switch (schema.collectionFormat) {
            case 'csv': return values.join(',');
            case 'pipes': return values.join('|');
            case 'ssv': return values.join(' ');
            case 'tsv': return values.join('\t');
        }
    } else {
        return stringifyPrimitive(parameter, schema, exception, value);
    }
}
