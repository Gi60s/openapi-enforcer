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
const RandExp = require("randexp");
const util = require('../util');

const { copy, randomOneOf: chooseOne, randomNumber, randomText } = util;

module.exports = runRandom;

function runRandom(exception, warn, map, schema, parent, property, options, depth) {
    const type = schema.type;
    const value = parent[property];

    if (value && typeof value === 'object') {
        const existing = map.get(value);
        if (existing) return;
        map.set(value, true)
    }

    if (depth > options.maxDepth) return;

    if (schema.hasOwnProperty('default') && Math.random() < options.defaultPossibility) {
        parent[property] = util.copy(schema.default);

    } else if (schema.enum) {
        parent[property] = copy(chooseOne(schema.enum));

    } else if (schema.allOf) {
        const [ allOf, err ] = schema.allOfMerged;
        if (err) {
            warn.nest('Cannot generate random value for schema with allOf').push(err);
        } else {
            runRandom(exception, warn, map, allOf, parent, property, options, depth);
        }

    } else if (schema.anyOf || schema.oneOf) {
        const mode = schema.anyOf ? 'anyOf' : 'oneOf';
        if (schema.discriminator) {
            const { name, key, schema: subSchema } = schema.discriminate(value, true);
            if (subSchema) {
                runRandom(exception, warn, map, subSchema, parent, property, options, depth);
            } else if (name === undefined) {
                const subSchema = chooseOne(schema[mode])
                runRandom(exception, warn, map, subSchema, parent, property, options, depth);
            } else {
                exception.message('Discriminator property "' + key + '" as "' + name + '" did not map to a schema');
            }
        } else {
            const subSchema = chooseOne(schema[mode])
            runRandom(exception, warn, map, subSchema, parent, property, options, depth);
        }

    } else if (schema.not) {
        warn.message('Cannot generate random value for schema with not');

    } else if (type === 'array') {
        const min = schema.hasOwnProperty('minItems') ? schema.minItems : 0;
        let max = schema.hasOwnProperty('maxItems') ? schema.maxItems : min + options.arrayVariation - Math.round(.5 * depth);
        if (max < min) max = min;
        const length = randomNumber({ min, max });
        if (depth > 0 && parent.hasOwnProperty(property) && !Array.isArray(parent[property])) {
            exception.message('Provided value is not an array');
        } else {
            const array = Array.isArray(value) ? value : [];
            for (let index = 0; index < length; index++) {
                let retry = true;
                let retriesRemaining = options.uniqueItemRetry;
                while (retry && retriesRemaining) {
                    const o = {};
                    runRandom(exception.at(index), warn.at(index), map, schema.items, o, 'value', options, depth + 1);
                    const value = o.value;
                    retry = schema.uniqueItems && array.findIndex((v) => util.same(v, value)) !== -1;
                    if (!retry) {
                        array[index] = value;
                    } else if (retry && !retriesRemaining) {
                        warn.message('Cannot generate example due to too narrowly scoped schema constraints');
                    }
                }
            }
            parent[property] = array;
        }

    } else if (type === 'object') {
        if (depth > 0 && parent.hasOwnProperty(property) && !util.isObject(parent[property])) {
            exception.message('Provided value is not a plain object');
        } else {
            const definedProperties = schema.properties ? Object.keys(schema.properties) : [];
            const object = parent[property] || {};
            let count = 0;

            // add required properties first
            if (schema.required) {
                schema.required.forEach(key => {
                    const index = definedProperties.indexOf(key);
                    if (index !== -1) definedProperties.splice(index, 1);

                    let subSchema = schema.properties && schema.properties[key];
                    if (!subSchema) subSchema = schema.additionalProperties;
                    if (subSchema === true) subSchema = randomSchema(schema);
                    runRandom(exception.at(key), warn.at(key), map, subSchema, object, key, options, depth + 1);

                    count++;
                });
            }

            // add defined properties (in random order)
            let definedPropertiesLength = definedProperties.length;
            const maxProperties = schema.hasOwnProperty('maxProperties') ? schema.maxProperties : Number.MAX_SAFE_INTEGER;
            while (definedPropertiesLength && count < maxProperties) {
                if (Math.random() < options.definedPropertyPossibility) {
                    const index = Math.floor(Math.random() * definedPropertiesLength);
                    const key = definedProperties[index];
                    runRandom(exception.at(key), warn.at(key), map, schema.properties[key], object, key, options, depth + 1);
                    count++;
                }
                definedPropertiesLength--;
            }

            // add additional properties
            if (schema.additionalProperties) {
                const minProperties = schema.hasOwnProperty('minProperties') ? schema.minProperties : 0;
                let addMoreProperties = count < minProperties || Math.random() < options.additionalPropertiesPossibility;
                let additionalPropertiesIndex = 1;
                while (addMoreProperties && count < maxProperties) {
                    const key = 'additionalProperty' + additionalPropertiesIndex++;
                    if (!object.hasOwnProperty(key)) {
                        const subSchema = schema.additionalProperties === true ? randomSchema(schema) : schema.additionalProperties;
                        runRandom(exception.at(key), warn.at(key), map, subSchema, object, key, options, depth + 1);
                        count++;
                        addMoreProperties = count < minProperties || Math.random() < options.additionalPropertiesPossibility;
                    }
                }
            }

            parent[property] = object;
        }

    } else if (!parent.hasOwnProperty(property) || depth === 0) {
        const dataTypes = schema.enforcerData.staticData.dataTypes;
        const dataType = (dataTypes[schema.type] && dataTypes[schema.type][schema.format]) || null;

        if (dataType && dataType.random) {
            parent[property] = dataType.random({ exception, schema }, { chooseOne, randomNumber, randomText });

        } else if (type === 'boolean') {
            parent[property] = chooseOne([true, false]);

        } else if (type === 'integer' || type === 'number') {
            const decimalPlaces = type === 'integer' ? 0 : randomNumber({min: 1, max: 4});
            const exclusiveMin = !!schema.exclusiveMinimum;
            const exclusiveMax = !!schema.exclusiveMaximum;
            const multipleOf = schema.hasOwnProperty('multipleOf') ? schema.multipleOf : 0;
            const hasMin = schema.hasOwnProperty('minimum')
            const hasMax = schema.hasOwnProperty('maximum')
            let min, max;
            if (hasMin && !hasMax) {
                min = schema.minimum
                max = min + options.numberVariation
            } else if (!hasMin && hasMax) {
                max = schema.maximum
                min = max - options.numberVariation
            } else if (hasMin && hasMax) {
                min = schema.minimum
                max = schema.maximum
            } else {
                min = -1 * Math.floor(options.numberVariation * .25);
                max = Math.ceil(options.numberVariation * .75);
            }
            parent[property] = randomNumber({min, max, multipleOf, exclusiveMin, exclusiveMax, decimalPlaces});

        } else if (type === 'string') {
            if (schema.hasOwnProperty('pattern')) {
                parent[property] = new RandExp(schema.pattern).gen();
            } else {
                const options = {};
                if (schema.hasOwnProperty('minLength')) options.minLength = schema.minLength;
                if (schema.hasOwnProperty('maxLength')) options.maxLength = schema.maxLength;
                parent[property] = randomText(options)
            }
        }
    }
}

function randomSchema(ref) {
    // type "string" format "binary" or "byte" cannot be serialized or deserialized w/o schema
    // so they are omitted from the list of possible random schemas
    const def = chooseOne([
        { type: 'boolean' },
        { type: 'integer' },
        { type: 'number' },
        { type: 'string' },
        { type: 'string', format: 'date' },
        { type: 'string', format: 'date-time' }
    ]);
    const [ schema ] = new ref.enforcerData.context.Schema(def);
    return schema;
}
