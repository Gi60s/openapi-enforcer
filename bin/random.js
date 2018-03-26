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
const util      = require('./util');

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

// generate random array
exports.array = function(schema) {
    return common(schema, () => {
        const config = {};
        config.minimum = schema.hasOwnProperty('minItems') ? schema.minItems : 0;
        config.maximum = schema.hasOwnProperty('maxItems') ? schema.maxItems : config.minimum + 5;
        const length = randomNumber(0, 0, true, config);
        const array = [];
        const itemSchema = schema.items;
        let duplicates = 0;
        while (array.length < length) {
            const value = this.byType(itemSchema || randomSchema());
            if (schema.uniqueItems) {
                const match = array.find(v => util.same(v, value));
                if (match) {
                    duplicates++;
                    if (duplicates > 5) throw Error('Cannot generate example due to too narrowly scoped schema constraints: ' + JSON.stringify(schema));
                } else {
                    duplicates = 0;
                    array.push(value);
                }
            } else {
                array.push(value);
            }
        }
        return array;
    });
};

// generate random buffer
exports.binary = function(schema) {
    return exports.byte(schema);
};

// generate random boolean
exports.boolean = function(schema) {
    return common(schema, () => {
        return chooseOne([false, true]);
    });
};

// generate random buffer
exports.byte = function(schema) {
    return common(schema, () => {
        const config = {};
        config.mininum = schema.hasOwnProperty('minLength') ? schema.minLength : 0;
        config.maximum = schema.hasOwnProperty('maxLength') ? schema.maxLength : config.mininum + 10;
        const length = randomNumber(0, 0, true, config);
        const array = [];
        for (let i = 0; i < length; i++) array.push(Math.floor(Math.random() * 255));
        return Buffer.from(array);
    });
};

// generate random value that matches schema type
exports.byType = function(schema) {
    const type = util.schemaType(schema);
    switch (type) {
        case 'array': return this.array(schema);
        case 'boolean': return this.boolean(schema);
        case 'integer': return this.integer(schema);
        case 'number': return this.number(schema);
        case 'object': return this.object(schema);
        case 'string':
            switch (schema.format) {
                case 'binary': return this.binary(schema);
                case 'byte': return this.byte(schema);
                case 'date': return this.date(schema);
                case 'date-time': return this.dateTime(schema);
            }
            return this.string(schema);
    }
};

// generate random date object
exports.date = function(schema) {
    const d = exports.dateTime(schema);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

// generate random date object
exports.dateTime = function(schema) {
    schema = Object.assign({}, schema);
    if (schema.enum) schema.enum = schema.enum.map(v => +(new Date(v)));
    if (schema.maximum) schema.maximum = +(new Date(schema.maximum));
    if (schema.minimum) schema.minimum = +(new Date(schema.minimum));
    const value = randomNumber(Date.now(), 2592000000, true, schema);     // variation = 30 days
    return new Date(value);
};
exports['date-time'] = exports.dateTime;

// generate random integer
exports.integer = function(schema) {
    return randomNumber(0, 500, true, schema);
};

// generate random number
exports.number = function(schema) {
    return randomNumber(0, 500, false, schema);
};

// generate random object
exports.object = function(schema) {
    const result = {};
    const max = schema.hasOwnProperty('maxProperties') ? schema.maxProperties : Number.MAX_SAFE_INTEGER;
    let remaining = max;

    if (schema.allOf) schema = mergeAllOfObjects(schema.allOf);

    if (schema.properties) {

        // separate properties by optional or required
        const optionalKeys = [];
        const requiredKeys = [];
        Object.keys(schema.properties).forEach(key => {
            schema.properties[key].required ? requiredKeys.push(key) : optionalKeys.push(key);
        });

        // check for too many required properties
        if (requiredKeys.length > max) {
            throw Error('Cannot generate example due to too many required properties: ' + JSON.stringify(schema));
        }

        // populate required properties
        requiredKeys.forEach(key => {
            result[key] = this.byType(schema.properties[key] || randomSchema());
        });
        remaining -= requiredKeys.length;

        // populate optional properties until max properties reached
        let length = optionalKeys.length;
        while (remaining && length) {
            const index = Math.floor(Math.random() * length);
            const key = optionalKeys.splice(index, 1)[0];
            length--;
            remaining--;
            result[key] = this.byType(schema.properties[key] || randomSchema());
        }
    }

    if (schema.additionalProperties && remaining) {
        let count = 0;
        let index = 1;
        while (count < 3 && remaining) {
            const key = 'additionalProperty' + index;
            if (!result.hasOwnProperty(key)) {
                count++;
                remaining--;
                result[key] = this.byType(schema.additionalProperties === true
                    ? randomSchema()
                    : schema.additionalProperties);
            }
        }
    }

    return result;
};

exports.string = function(schema) {
    return common(schema, () => {
        let result = chooseOne(stringChoices);
        if (schema.pattern) {
            throw Error('Cannot generate example for string due to pattern requirement');
        }
        if (schema.hasOwnProperty('minLength')) {
            while (result.length < schema.minLength) result += ' ' + chooseOne(stringChoices);
        }
        if (schema.hasOwnProperty('maxLength') && result.length > schema.maxLength) {
            result = result.substr(0, schema.maxLength);
        }
        return result;
    });
};




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

        // select exports value between max and min
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