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
const parse         = require('./parse-value');
const traverse      = require('./traverse');
const util          = require('./util');

exports.injector = {
    colon: buildInjector(() => /:([_$a-z][_$a-z0-9]*)/ig),
    doubleHandlebar: buildInjector(() => /{{([_$a-z][_$a-z0-9]*)}}/ig),
    handlebar: buildInjector(() => /{([_$a-z][_$a-z0-9]*)}/ig)
};

exports.populate = function(v, exception, schema, object, property) {
    const options = v.options;
    const type = util.schemaType(schema);
    let value = object[property];

    if (schema.allOf) {
        schema.allOf.forEach((schema, index) => exports.populate(v, exception.nest('/allOf/' + index), schema, object, property));

    } else if (schema.oneOf && options.oneOf && schema.discriminator) {
        const discriminator = v.version.getDiscriminatorSchema(schema, value);
        if (discriminator) exports.populate(v, exception.nest('/oneOf'), discriminator, object, property);

    } else if (type === 'array') {
        let value = object[property];
        if (value !== undefined && !Array.isArray(object[property])) {
            exception('Provided value must be an array. Received: ' + util.smart(value));
            return;
        }

        apply(v, exception, schema, type, object, property);

        value = object[property];
        if (value) {
            value.forEach((item, index) => {
                exports.populate(v, exception.nest('/' + index), schema.items, value, index)
            });
        }

    } else if (type === 'object') {
        if (value !== undefined && (!value || typeof value !== 'object')) {
            exception('Provided value must be a non-null object. Received: ' + util.smart(value));
            return;
        }

        apply(v, exception, schema, type, object, property);
        value = object[property];

        // if not ignoring required then these values may not actually populate
        const required = options.ignoreMissingRequired ? null : schema.required || [];
        const target = required ? Object.assign({}, value) : value || {};

        // populate for additional properties
        const additionalProperties = schema.additionalProperties;
        if (additionalProperties) {
            const properties = schema.properties || {};
            Object.keys(target).forEach(key => {

                // if enforcing required then remove this property from the remaining required list
                if (required) {
                    const index = required.indexOf(key);
                    if (index !== -1) required.splice(index, 1);
                }

                // populate the property
                if (!properties.hasOwnProperty(key)) {
                    exports.populate(v, exception.nest('/' + key), additionalProperties, target, key);
                }
            });
        }

        // populate for known properties
        const properties = schema.properties;
        if (properties) {
            Object.keys(properties).forEach(key => {
                exports.populate(v, exception.nest('/' + key), properties[key], target, key);
            });
        }

        // if enforcing required and it was fulfilled then update the object's property with the target
        // if not enforcing required then the object's property is already the target
        if ((value !== undefined || Object.keys(target).length) && (!required || !required.length)) {
            object[property] = target;
        }

    } else {
        apply(v, exception, schema, type, object, property);
    }


};


function apply(v, exception, schema, type, object, property) {
    if (object[property] === undefined) {
        const options = v.options;
        const map = v.map;
        if (options.variables && schema.hasOwnProperty('x-variable') && map.hasOwnProperty(schema['x-variable'])) {
            const value = map[schema['x-variable']];
            if (value !== undefined) object[property] = value;

        } else if (options.templates && type === 'string' && schema.hasOwnProperty('x-template')) {
            const value = v.injector(schema['x-template'], map);
            object[property] = parseStringValue(exception, schema, value);

        } else if (options.defaults && schema.hasOwnProperty('default')) {
            const defaultValue = schema.default;
            if (defaultValue !== undefined) {
                const value = options.templateDefaults && typeof defaultValue === 'string'
                    ? v.injector(defaultValue, map)
                    : defaultValue;
                object[property] = parseStringValue(exception, schema, value);
            }
        }
    }
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

function parseStringValue(exception, schema, value) {
    if (typeof value !== 'string' || util.schemaType(schema) !== 'string') return value;

    let result;
    switch (util.schemaFormat(schema)) {
        case 'byte':
        case 'binary':
        case 'date':
        case 'date-time':
            result = parse[schema.format](value);
            return result.error
                ? exception(result.error)
                : result.value;
        default:
            return value;
    }
}

function populate(version, schema, params, value, options) {
    if (!params) params = {};

    // normalize options
    options = Object.assign({}, data.defaults.populate, options, version.defaults.populate);

    // produce start value
    if (options.copy) value = util.copy(value);

    // acquire injector
    const injector = populate.injector[options.replacement];

    const result = traverse({
        schema: schema,
        value: value,
        version: version,
        handler: data => {
            const schema = data.schema;
            const type = data.type;

            // if there is no value then attempt to populate one
            if (data.value === undefined) {
                if (options.variables && schema.hasOwnProperty('x-variable') && params.hasOwnProperty(schema['x-variable'])) {
                    const value = params[schema['x-variable']];
                    if (value !== undefined) data.value = value;

                } else if (options.templates && type === 'string' && schema.hasOwnProperty('x-template')) {
                    const value = injector(schema['x-template'], params);
                    data.value = parseStringValue(exception, schema, value);

                } else if (options.defaults && schema.hasOwnProperty('default')) {
                    const defaultValue = schema.default;
                    if (defaultValue !== undefined) {
                        const value = options.templateDefaults && typeof defaultValue === 'string'
                            ? injector(defaultValue, params)
                            : defaultValue;
                        data.value = parseStringValue(exception, schema, value);
                    }
                }
            }

            // if there is still no value and schema is for an object then try to populate its properties
            if (type === 'object') {

            }


            // if still no value, maybe go deeper
            if (data.value === undefined) {

                switch (data.type) {
                    case 'anyOf':
                    case 'oneOf':
                        schemas = data.type === 'anyOf' ? schema.anyOf : schema.oneOf;
                        index = Math.floor(Math.random() * schemas.length);
                        data.schema = schemas[index];
                        data.again();
                        break;

                    case 'allOf':
                        // if (type === 'object') {
                        //     const merged = {};
                        //     const schemas = schema.allOf;
                        //     const length = schemas.length;
                        //     let hasValue;
                        //     for (let i = 0; i < length; i++) {
                        //         const schema = schemas[i];
                        //         if (!schema.type || util.schemaType(schema) === 'object') {
                        //             if (schema.properties)
                        //         } else {
                        //             message('Invalid schema type at index: ' + i);
                        //         }
                        //     }
                        //
                        //     const merged = schema.allOf.reduce((p, c) => {
                        //         Object.assign(p, { properties: })
                        //     }, {})
                        // } else {
                        //     message('Unable to populate "allOf" except for type "object"')
                        // }
                        data.value = undefined;     // TODO: future functionality
                        break;

                    case 'not':
                        message('Unable to populate "not" except for objects')
                        break;

                    default:
                }
            }

            // if still no value then go deeper on arrays or objects
            if (data.value === undefined) {
                if (type === 'array') {

                } else if (type === 'object') {

                }
            }
        }
    });
}