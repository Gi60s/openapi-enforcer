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
const util = require('../util');

const { copy, randomOneOf: chooseOne, randomNumber, randomText } = util;

module.exports = runRandom;

function runRandom(exception, schema, value, options, depth) {
    throw Error('TODO: use data-type random when available');

    const { arrayVariation = 4, defaultPossibility = .25, numberVariation = 1000, } = options;
    const type = schema.type;

    // 15% chance of using default value
    if (schema.hasOwnProperty('default') && Math.random() < defaultPossibility) return schema.default;

    // select an enum value
    if (schema.enum) return copy(chooseOne(schema.enum));

    if (schema.allOf) {
        exception.message('Cannot generate random value for schema with allOf');

    } else if (schema.anyOf) {
        exception.message('Cannot generate random value for schema with anyOf');

    } else if (schema.oneOf) {
        exception.message('Cannot generate random value for schema with oneOf');

    } else if (schema.not) {
        exception.message('Cannot generate random value for schema with not');

    } else if (type === 'array') {
        const min = schema.hasOwnProperty('minItems') ? schema.minItems : 0;
        const max = schema.hasOwnProperty('maxItems') ? schema.maxItems : config.minimum + arrayVariation;
        const length = randomNumber({ min, max });
        const array = Array.isArray(value) ? value.concat() : [];
        let duplicates = 0;
        let index;
        while ((index = array.length) < length) {
            if (array[index] === undefined) {
                const value = runRandom(exception.at(index), schema.items, array[index], options, depth + 1);
                if (schema.uniqueItems) {
                    const match = array.find(v => util.same(v, value));
                    if (match) {
                        duplicates++;
                        if (duplicates > 5) exception.message('Cannot generate example due to too narrowly scoped schema constraints');
                    } else {
                        duplicates = 0;
                        array[index] = value;
                    }
                } else {
                    array[index] = value;
                }
            }
        }
        return array;

    } else if (type === 'boolean') {
        return value === undefined ? chooseOne([true, false]) : value;

    } else if (type === 'integer' || type === 'number') {
        if (value === undefined) {
            const decimalPlaces = type === 'integer' ? 0 : randomNumber({ min: 0, max: 4 });
            const exclusiveMin = !!schema.exclusiveMinimum;
            const exclusiveMax = !!schema.exclusiveMaximum;
            const min = schema.hasOwnProperty('minimum') ? schema.minimum : -1 * Math.floor(numberVariation * .25);
            const max = schema.hasOwnProperty('maximum') ? schema.maximum :Math.ceil(numberVariation * .75);
            value = randomNumber({ min, max, exclusiveMin, exclusiveMax, decimalPlaces });
        }
        return value;

    } else if (type === 'object') {
        const result = Object.assign({}, value);
        const max = schema.hasOwnProperty('maxProperties') ? schema.maxProperties : Number.MAX_SAFE_INTEGER;
        let remaining = max - Object.keys(result).length;
        if (schema.properties) {

            // separate properties by optional or required
            const optionalKeys = [];
            const requiredKeys = [];
            Object.keys(schema.properties).forEach(key => {
                schema.properties[key].required ? requiredKeys.push(key) : optionalKeys.push(key);
            });

            // populate required properties
            requiredKeys.forEach(key => {
                if (result[key] === undefined) {
                    result[key] = runRandom(exception.at(key), schema.properties[key], undefined, options, depth + 1);
                    remaining--;
                }
            });

            // populate optional properties until max properties reached
            let length = optionalKeys.length;
            while (remaining && length) {
                const index = Math.floor(Math.random() * length);
                const key = optionalKeys.splice(index, 1)[0];
                length--;
                if (result[key] === undefined) {
                    remaining--;
                    result[key] = runRandom(exception.at(key), schema.properties[key], undefined, options, depth + 1);
                }
            }
        }

        if (schema.additionalProperties && remaining) {
            let count = 0;
            let index = 1;
            while (count < 3 && remaining) {
                const key = 'additionalProperty' + index++;
                if (!result.hasOwnProperty(key)) {
                    count++;
                    remaining--;
                    result[key] = runRandom(exception.at(key), schema.additionalProperties === true ? randomSchema() : schema.additionalProperties, undefined, options, depth + 1);
                }
            }
        }

        return result;

    } else if (type === 'string') {
        const options = {};
        if (schema.hasOwnProperty('minLength')) options.minLength = schema.minLength;
        if (schema.hasOwnProperty('maxLength')) options.maxLength = schema.maxLength;
        return randomText(options)

    }
}

function randomSchema() {
    switch (Math.floor(Math.random() * 8)) {
        case 0: return { type: 'boolean' };
        case 1: return { type: 'integer' };
        case 2: return { type: 'number' };
        case 3: return { type: 'string' };
        case 4: return { type: 'string', format: 'binary' };
        case 5: return { type: 'string', format: 'byte' };
        case 6: return { type: 'string', format: 'date' };
        case 7: return { type: 'string', format: 'date-time' };
    }
}