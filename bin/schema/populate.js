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
const Exception     = require('../exception');
const util          = require('../util');

exports.injector = {
    colon: buildInjector(() => /:([_$a-z][_$a-z0-9]*)/ig),
    doubleHandlebar: buildInjector(() => /{{([_$a-z][_$a-z0-9]*)}}/ig),
    handlebar: buildInjector(() => /{([_$a-z][_$a-z0-9]*)}/ig)
};

exports.populate = function(schema, params, value, options) {
    const exception = Exception('Unable to populate value');

    // check the schema
    if (schema.hasException) {
        exception(schema.exception());
        return exception;
    }

    options.injector = exports.injector[options.replacement];
    if (!params) params = {};
    if (options.copy) value = util.copy(value);
    const root = { root: value };

    // validate the value
    populate(exception, schema.version, new Map(), schema, params, root, 'root', options);

    // return the exception if an error occurred
    const hasException = exception.hasException;
    return {
        error: hasException ? exception : null,
        value: root.root
    }
};

function populate(exception, version, map, schema, params, object, property, options) {
    if (!schema) return;
    const type = schema.type;
    const value = object[property];
    let result;

    // if condition is not met then exit
    if (schema.hasOwnProperty('x-condition') && !params[schema['x-condition']]) return;

    // handle cyclic population
    const match = map.get(schema);
    if (match) return match;

    if (schema.allOf) {
        schema.allOf.forEach((schema, index) => {
            populate(exception.nest('Populating allOf at index ' + index),
                version, map, schema, params, object, property, options);
        });

    } else if (schema.anyOf || schema.oneOf) {
        if (!schema.discriminator) {
            exception('Unable to populate anyOf or oneOf without a discriminator and discriminator value');
        } else {
            const subSchema = version.getDiscriminatorSchema(schema, value);
            if (subSchema) {
                populate(exception.nest('Populating discriminator'),
                    version, map, subSchema, params, object, property, options);
            } else {
                exception('Unable to find discriminator schema');
            }
        }

    } else if (schema.not) {
        exception('Cannot populate "not" schemas');

    } else if (type === 'array') {
        if (value !== undefined && !Array.isArray(value)) {
            exception('Provided value must be an array. Received: ' + util.smart(value));
        } else {
            const value = apply(exception, schema, params, object, property, options);
            if (schema.items && Array.isArray(value)) {
                value.forEach((item, index) => {
                    populate(exception.nest('Populating array at index ' + index),
                        version, map, schema.items, params, value, index, options);
                });
            }
        }

    } else if (type === 'object') {
        if (value !== undefined && (!value || typeof value !== 'object')) {
            exception('Provided value must be an object. Received: ' + util.smart(value));
        } else {
            const applied = apply(exception, schema, params, object, property, options);
            const value = applied || {};

            // populate for additional properties
            const additionalProperties = schema.additionalProperties;
            if (additionalProperties) {
                const properties = schema.properties || {};
                Object.keys(value).forEach(key => {
                    if (!properties.hasOwnProperty(key)) {
                        populate(exception.nest('Populating additional property "' + key + '"'),
                            version, map, additionalProperties, params, value, key, options);
                    }
                });
            }

            // populate for known properties
            const properties = schema.properties;
            if (properties) {
                Object.keys(properties).forEach(key => {
                    populate(exception.nest('Populating property "' + key + '"'),
                        version, map, properties[key], params, value, key, options);
                });
            }

            if (applied || Object.keys(value).length) object[property] = value;
        }

    } else {
        apply(exception, schema, params, object, property, options);
    }
}

function apply(exception, schema, params, object, property, options) {

    // make sure that the condition is met
    if (schema.hasOwnProperty('x-condition') && !params[schema['x-condition']]) return;

    if (object[property] === undefined) {
        const type = schema.type;
        if (options.variables && schema.hasOwnProperty('x-variable') && params.hasOwnProperty(schema['x-variable'])) {
            const value = params[schema['x-variable']];
            if (value !== undefined) object[property] = value;

        } else if (options.templates && type === 'string' && schema.hasOwnProperty('x-template')) {
            object[property] = options.injector(schema['x-template'], params);

        } else if (options.defaults && schema.hasOwnProperty('x-default')) {
            const defaultValue = schema['x-default'];
            if (defaultValue !== undefined) {
                object[property] = options.templateDefaults && typeof defaultValue === 'string'
                    ? options.injector(defaultValue, params)
                    : defaultValue;
            }
        } else if (options.defaults && schema.hasOwnProperty('default')) {
            const defaultValue = schema.default;
            if (defaultValue !== undefined) {
                object[property] = options.templateDefaults && typeof defaultValue === 'string'
                    ? options.injector(defaultValue, params)
                    : defaultValue;
            }
        }
    }

    return object[property];
}

/**
 * Accepts a function that returns a regular expression. Uses the regular expression to extract parameter names from strings.
 * @param {function} rxGenerator
 * @returns {function}
 */
function buildInjector(rxGenerator) {
    return function(value, data) {
        const rx = rxGenerator();
        let match;
        let result = '';
        let offset = 0;
        while (match = rx.exec(value)) {
            const property = match[1];
            result += value.substring(offset, match.index) + (data[property] !== undefined ? data[property] : match[0]);
            offset = match.index + match[0].length;
        }
        return result + value.substr(offset);
    };
}