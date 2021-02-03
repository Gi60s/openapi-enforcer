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
const util          = require('../util');
const Value         = require('./value');

module.exports = runPopulate;

function runPopulate(exception, warn, depth, schema, params, object, property, options) {
    const { populate, value } = Value.getAttributes(object[property]);
    const type = schema.type;
    if (!populate) {
        object[property] = value;
        return;
    }

    // if condition is not met then exit
    if (schema.hasOwnProperty('x-condition') && !params[schema['x-condition']]) return;

    if (schema.allOf) {
        schema.allOf.forEach(schema => {
            runPopulate(exception, warn, depth, schema, params, object, property, options);
        });

    } else if (schema.anyOf || schema.oneOf) {
        const mode = schema.anyOf ? 'anyOf' : 'oneOf';
        if (!schema.discriminator) {
            exception.message('Unable to populate ' + mode + ' without a discriminator');
        } else {
            const { name, key, schema: subSchema } = schema.discriminate(value, true);
            if (subSchema) {
                runPopulate(exception, warn, depth, subSchema, params, object, property, options);
            } else {
                exception.message('Discriminator property "' + key + '" as "' + name + '" did not map to a schema');
            }
        }

    } else if (schema.not) {
        exception.message('Cannot populate "not" schemas');

    } else if (type === 'array') {
        if (value !== undefined && !Array.isArray(value)) {
            exception.message('Provided value must be an array. Received: ' + util.smart(value));
        } else {
            const value = apply(exception, schema, params, object, property, options);
            if (schema.items && Array.isArray(value)) {
                if (depth < 0) {
                    warn.message('Reached maximum depth');
                } else {
                    value.forEach((item, index) => {
                        runPopulate(exception.at(index), warn.at(index), depth - 1, schema.items, params, value, index, options);
                    });
                }
            }
        }

    } else if (type === 'object') {
        if (value !== undefined && (!value || typeof value !== 'object')) {
            exception.message('Provided value must be an object. Received: ' + util.smart(value));
        } else if (depth < 0) {
            warn.message('Reached maximum depth');
        } else {
            const applied = apply(exception, schema, params, object, property, options);
            const value = applied || {};

            // populate for additional properties
            const additionalProperties = schema.additionalProperties;
            if (additionalProperties) {
                const properties = schema.properties || {};
                Object.keys(value).forEach(key => {
                    if (!properties.hasOwnProperty(key)) {
                        runPopulate(exception.at(key), warn.at(key), depth - 1, additionalProperties, params, value, key, options);
                    }
                });
            }

            // populate for known properties
            const properties = schema.properties;
            if (properties) {
                Object.keys(properties).forEach(key => {
                    runPopulate(exception.at(key), warn.at(key), depth - 1, properties[key], params, value, key, options);
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
