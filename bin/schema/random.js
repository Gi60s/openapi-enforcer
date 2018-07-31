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
const Exception = require('../exception');
const util      = require('../util');

const stringChoices = [
    'Donec quis magna a nisl euismod congue.',
    'Phasellus a mi id enim ullamcorper venenatis efficitur non sem.',
    'Maecenas id lectus eu justo iaculis sodales id ut dolor.',
    'Suspendisse venenatis dui at condimentum convallis.',
    'Etiam sit amet purus eu diam lobortis aliquam non sed lectus.',
    'Ut ut metus feugiat, luctus metus commodo, sagittis metus.',
    'Maecenas viverra urna vitae ante mattis, eget lacinia est euismod.',
    'Suspendisse pellentesque dui id nisl venenatis malesuada.',
    'Integer posuere odio elementum hendrerit congue.',
    'Pellentesque sed urna ut felis vulputate faucibus.',
    'Donec sed dui at nunc interdum sagittis sit amet nec eros.',
    'Mauris vel quam in sem placerat maximus.',
    'Nam vestibulum urna ac tristique dictum.',
    'Integer tincidunt nibh vitae augue laoreet eleifend.',
    'Suspendisse dignissim nisl et risus pulvinar sollicitudin.',
    'Donec non velit id leo vehicula dictum eget quis risus.',
    'Sed ullamcorper leo vitae velit faucibus, quis egestas enim euismod.',
    'Aliquam eget risus vitae velit lacinia gravida nec quis nunc.',
    'Mauris egestas est placerat commodo commodo.',
    'Quisque euismod augue a felis efficitur, et semper erat maximus.',
    'Mauris aliquet metus sed arcu laoreet elementum.',
    'Vivamus ut purus faucibus, condimentum libero ut, dictum odio.',
    'Proin ac mi feugiat, cursus ligula a, rutrum erat.',
    'Curabitur blandit nibh quis sem lacinia sodales.',
    'Praesent euismod nunc ac arcu porta, dignissim lacinia lectus convallis.',
    'Phasellus elementum sapien nec ex dapibus, at faucibus arcu vehicula.',
    'Mauris eu magna at libero dictum fringilla ut ut justo.',
    'In posuere neque eu neque consequat iaculis.',
    'Donec auctor nisl in felis pharetra tincidunt.'
];

/**
 * Generate a random value.
 * @param {Schema} schema
 * @param {*} value A value with some values already populated.
 * @param {object} options
 * @param {number} [options.arrayVariation=5] The variation on array size.
 * @param {number} [options.dateVariation=2592000000] The number of milliseconds in date variation. Default is 30 days.
 * @param {number} [options.defaultPossibility=.15] Percentage chance that default value will be used.
 * @param {number} [options.maximimDepth=-1] The maximum depth for nested array and objects. Use -1 for unlimited.
 * @returns {*}
 */
module.exports = function(schema, value, options) {
    const exception = Exception('Unable to generate random value');

    options = Object.assign({
        arrayVariation: 5,
        dateVariation: 2592000000,
        defaultPossibility: 0.15,
        maximimDepth: -1
    }, options);

    // check the schema
    if (schema.hasException) {
        exception(schema.exception);
        return exception;
    }

    return random(exception, schema, value, options, 0);
};

function random(exception, schema, value, options, depth) {
    const type = schema.type;

    // 15% chance of using default value
    if (schema.hasOwnProperty('default') && Math.random() < options.defaultPossibility) return schema.default;

    // select an enum value
    if (schema.enum) return chooseOne(schema.enum);

    if (schema.allOf) {

    } else if (schema.anyOf || schema.oneOf) {

    } else if (schema.not) {

    } else if (type === 'array') {
        const config = {};
        config.minimum = schema.hasOwnProperty('minItems') ? schema.minItems : 0;
        config.maximum = schema.hasOwnProperty('maxItems') ? schema.maxItems : config.minimum + 5;
        const length = randomNumber(0, 0, true, config);
        const array = Array.isArray(value) ? value.concat() : [];
        let duplicates = 0;
        let index;
        while ((index = array.length) < length) {
            if (array[index] === undefined) {
                const value = random(exception, schema.items || randomSchema(), options);
                if (schema.uniqueItems) {
                    const match = array.find(v => util.same(v, value));
                    if (match) {
                        duplicates++;
                        if (duplicates > 5) exception('Cannot generate example due to too narrowly scoped schema constraints: ' + JSON.stringify(schema));
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

    } else if (type === 'integer') {
        return value === undefined ? randomNumber(0, 500, true, schema) : value;

    } else if (type === 'number') {
        return value === undefined ? randomNumber(0, 500, false, schema) : value;

    } else if (type === 'string') {
        if (value !== undefined) return value;

        const format = schema.format;
        if (format === 'binary' || format === 'byte') {
            const config = {};
            config.mininum = schema.hasOwnProperty('minLength') ? schema.minLength : 0;
            config.maximum = schema.hasOwnProperty('maxLength') ? schema.maxLength : config.mininum + 10;
            const length = randomNumber(0, 0, true, config);
            const array = [];
            for (let i = 0; i < length; i++) array.push(Math.floor(Math.random() * 255));
            return Buffer.from(array);

        } else if (format === 'date' || format === 'date-time') {
            const config = Object.assign({}, schema);
            if (config.enum) config.enum = config.enum.map(v => +(new Date(v)));
            if (config.maximum) config.maximum = +(new Date(config.maximum));
            if (config.minimum) config.minimum = +(new Date(config.minimum));
            const value = randomNumber(Date.now(), options.dateVariation, true, config);     // variation = 30 days
            const date = new Date(value);
            if (schema.format === 'date') date.setUTCHours(0, 0, 0, 0);
            return date;

        } else {
            let result = chooseOne(stringChoices);
            if (schema.pattern) {
                exception('Cannot generate example for string due to pattern requirement');
            }
            if (schema.hasOwnProperty('minLength')) {
                while (result.length < schema.minLength) result += ' ' + chooseOne(stringChoices);
            }
            if (schema.hasOwnProperty('maxLength') && result.length > schema.maxLength) {
                result = result.substr(0, schema.maxLength);
            }
            return result;
        }

    } else if (type === 'object') {
        const result = Object.assign({}, value);
        const max = schema.hasOwnProperty('maxProperties') ? schema.maxProperties : Number.MAX_SAFE_INTEGER;
        let remaining = max - Object.keys(result);
        if (schema.allOf) schema = mergeAllOfObjects(schema.allOf);
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
                    result[key] = random(exception, schema.properties[key] || randomSchema(), undefined, options, depth + 1);
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
                    result[key] = random(exception, schema.properties[key] || randomSchema(), undefined, options, depth + 1);
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
                    result[key] = random(exception, schema.additionalProperties === true ? randomSchema() : schema.additionalProperties, undefined, options, depth + 1);
                }
            }
        }

        return result;
    }
}



function chooseOne(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function common(schema, callback) {
    // 25% chance of using default value
    if (schema.hasOwnProperty('default') && Math.random() < .25) return schema.default;

    // select an enum value
    if (schema.enum) return chooseOne(schema.enum);

    return callback();
}

function mergeAllOfObjects(allOf) {
    const result = {};
    allOf.forEach(schema => {
        if (schema.properties) {
            if (!result.properties) result.properties = {};
            Object.keys(schema.properties).forEach(key => {
                mergeAllOfObjectsProperties(result.properties, schema.properties, key);
            });
        }
        if (schema.additionalProperties) {
            mergeAllOfObjectsProperties(result, schema, 'additionalProperties');
        }
    });
    return result;
}

function mergeAllOfObjectsProperties(result, schema, key) {
    if (!result[key]) {
        result[key] = schema[key];
    } else {
        const dest = result[key];
        const src = schema[key];
        ['minimum', 'minLength', 'minItems'].forEach(constraint => {
            if (dest[constraint] < src[constraint]) dest[constraint] = src[constraint];
        });
        ['maximum', 'maxLength', 'maxItems'].forEach(constraint => {
            if (dest[constraint] > src[constraint]) dest[constraint] = src[constraint];
        });
        ['exclusiveMaximum', 'exclusiveMinimum', 'required'].forEach(constraint => {
            if (src[constraint]) dest[constraint] = true;
        });
    }
}

function randomNumber(baseline, variation, round, schema) {
    return common(schema, () => {
        const hasMin = !isNaN(schema.minimum);
        const hasMax = !isNaN(schema.maximum);
        let min;
        let max;

        // select random value between max and min
        if (hasMin && hasMax) {
            min = schema.minimum;
            max = schema.maximum;
        } else if (hasMax) {
            max = schema.maximum;
            min = max - variation;
        } else if (hasMin) {
            min = schema.minimum;
            max = min + variation;
        } else {
            min = baseline - variation;
            max = baseline + variation;
        }

        const multipleOf = schema.hasOwnProperty('multipleOf') ? schema.multipleOf : 1;
        const diff = (max - min) / multipleOf;
        const result = min + (Math.random() * diff * multipleOf);
        if (round) {
            let rounded;
            rounded = Math.floor(result);
            if (rounded > min || (rounded === min && !schema.exclusiveMinimum)) return rounded;

            rounded = Math.ceil(result);
            if (rounded < max || (rounded === max && !schema.exclusiveMaximum)) return rounded;

            return chooseOne([min, max]);

        } else if (result < min) {
            return min;

        } else if (result > max) {
            return max;

        } else {
            return result;
        }
    });
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