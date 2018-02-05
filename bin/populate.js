/**
 *  @license
 *    Copyright 2017 Brigham Young University
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
const format        = require('./format');
const util          = require('./util');

exports.injector = {
    colon: buildInjector(() => /:([_$a-z][_$a-z0-9]*)/ig),
    doubleHandlebar: buildInjector(() => /{{([_$a-z][_$a-z0-9]*)}}/ig),
    handlebar: buildInjector(() => /{([_$a-z][_$a-z0-9]*)}/ig)
};

exports.populate = function(v, prefix, schema, object, property) {
    const options = v.options;
    const type = util.schemaType(schema);

    if (type === 'array') {
        let value = object[property];
        if (value !== undefined && !Array.isArray(object[property])) {
            throw Error(prefix + ': Provided value must be an array. Received: ' + util.smart(value));
        }

        apply(v, schema, type, object, property);

        value = object[property];
        if (value) {
            value.forEach((item, index) => {
                exports.populate(v, prefix + '/' + index, schema.items, value, index)
            });
        }

    } else if (type === 'object') {
        const value = object[property];
        if (value !== undefined && (!value || typeof value !== 'object')) {
            throw Error(prefix + ': Provided value must be a non-null object. Received: ' + util.smart(value));
        }

        // if allOf then apply each item
        if (schema.allOf) {
            schema.allOf.forEach(schema => exports.populate(v, prefix, schema, object, property));

        // populate oneOf as described by the discriminator
        } else if (options.oneOf && schema.oneOf && schema.discriminator) {
            const discriminator = v.version.getDiscriminatorSchema(schema, value);
            if (discriminator) exports.populate(v, prefix, discriminator, object, property);

        } else {
            apply(v, schema, type, object, property);
            const value = object[property];

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
                        exports.populate(v, prefix + '/' + key, additionalProperties, target, key);
                    }
                });
            }

            // populate for known properties
            const properties = schema.properties;
            if (properties) {
                Object.keys(properties).forEach(key => {
                    exports.populate(v, prefix + '/' + key, properties[key], target, key);
                });
            }

            // if enforcing required and it was fulfilled then update the object's property with the target
            // if not enforcing required then the object's property is already the target
            if ((value !== undefined || Object.keys(target).length) && (!required || !required.length)) {
                object[property] = target;
            }

        }
    } else {
        apply(v, schema, type, object, property);
    }


};


function apply(v, schema, type, object, property) {
    if (object[property] === undefined) {
        const options = v.options;
        const map = v.map;
        if (options.variables && schema.hasOwnProperty('x-variable') && map.hasOwnProperty(schema['x-variable'])) {
            const value = map[schema['x-variable']];
            if (options.autoFormat) {
                const form = util.schemaFormat(schema);
                object[property] = format[form](value);
            } else {
                object[property] = value;
            }

        } else if (options.templates && type === 'string' && schema.hasOwnProperty('x-template')) {
            object[property] = v.injector(schema['x-template'], map);

        } else if (options.defaults && schema.hasOwnProperty('default')) {
            const value = schema.default;
            object[property] = options.templateDefaults && typeof value === 'string'
                ? v.injector(value, map)
                : value;
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
            result += value.substring(offset, match.index) + (data.hasOwnProperty(property) ? data[property] : match[0]);
            offset = match.index + match[0].length;
        }
        return result + value.substr(offset);
    };
}