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
const Result    = require('../result');
const Swagger   = require('./swagger');
const util      = require('../util');

const rxExtension = /^x-.+/;
const reservedProperties = { '__enforcer_definition_post_validate': true };

module.exports = function(definition) {
    const exception = Exception('One or more errors exist in your OpenAPI definition');
    const hasSwagger = definition.hasOwnProperty('swagger');
    if (!hasSwagger && !definition.hasOwnProperty('openapi')) {
        return new Result(exception('Missing required "openapi" or "swagger" property'), null);
    } else {
        const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(definition.swagger || definition.openapi);
        if (match) {
            const major = +match[1];
            const minor = +match[2];
            const patch = +(match[3] || 0);
            return new Result(exception, normalize(major, minor, patch, exception, util.copy(definition), Swagger, {}));
        } else {
            return new Result(exception('Invalid value for property: ' + (hasSwagger ? 'swagger' : 'openapi')), null);
        }
    }
};

module.exports.normalize = function(version, validator, definition) {
    if (version === 2) version = '2.0';
    if (version === 3) version = '3.0.0';
    const exception = Exception('One or more errors found in definition');
    const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(version);
    const major = +match[1];
    const minor = +match[2];
    const patch = +(match[3] || 0);
    return new Result(exception, normalize(major, minor, patch, exception, util.copy(definition), validator, {}));
};

function normalize(major, minor, patch, exception, definition, validator, parent) {
    const _exception = exception;
    const result = {};
    const notAllowed = [];

    // check for missing required and set defaults
    const missingRequired = [];
    Object.keys(validator).forEach(key => {
        if (!reservedProperties[key]) {
            const m = validator[key];
            const param = {definition, major, minor, patch};
            if (typeof m === 'object' && !definition.hasOwnProperty(key) && (!m.hasOwnProperty('allowed') || fn(m.allowed, param))) {
                if (m.required && fn(m.required, param)) {
                    missingRequired.push(key);
                } else if (m.default) {
                    definition[key] = fn(m.default, param);
                }
            }
        }
    });

    // validate each property and its value
    Object.keys(definition).forEach(key => {

        const exception = _exception.at(key);
        const value = definition[key];
        const m = validator.hasOwnProperty(key)
            ? (typeof validator[key] === 'string' ? { type: validator[key] } : validator[key])
            : {};
        const param = {
            definition,
            exception,
            major,
            minor,
            parent,
            patch,
            value,
            validator,
            dateType: dateType(definition),
            deserializeDate: deserializeDate.bind(undefined, definition),
            integer: typeof value === 'number' && !isNaN(value) && Math.round(value) === value,
            nonNegative: typeof value === 'number' && !isNaN(value) && value >= 0,
            numericish: numericish(definition)
        };
        let message;

        // extensions always allowed
        if (rxExtension.test(key)) {
            result[key] = value;

        } else if (reservedProperties.hasOwnProperty(key)) {
            _exception('Property name "' + key + '" is reserved by the enforcer and is therefore not allowed');

        // check if property allowed
        } else if (!validator.hasOwnProperty(key) || (m.hasOwnProperty('allowed') && !fn(m.allowed, param))) {
            notAllowed.push(key);

        // check if type is correct
        } else if (m.type && (message = fn(m.type, param)) !== typeof value) {
            _exception('Value for property "' + key + '" must be a ' + message + '. Received: ' + util.smart(value));

        // check if type should be object
        } else if ((m.isPlainObject || m.hasOwnProperty('properties') || m.hasOwnProperty('additionalProperties')) && !util.isPlainObject(value)) {
            _exception('Value for property "' + key + '" must be a plain object. Received: ' + util.smart(value));

        // check if type should be array
        } else if ((m.isArray || m.hasOwnProperty('items')) && !Array.isArray(value)) {
            exception('Value for property "' + key + '" must be an array. Received: ' + util.smart(value));

        // check if enum matches
        } else if (m.enum && (message = fn(m.enum, param)).findIndex(v => util.same(v, value)) === -1) {
            exception('Property "' + key + '" has invalid value: ' + util.smart(value) +
                (message.length === 1 ? '. Must equal: ' + message[0] : '. Must be one of: ' + message.join(', ')));

        } else {

            // run custom error checker
            if (m.errors) fn(m.errors, param);

            // dive into array items definitions
            if (m.items && Array.isArray(value)) {
                working here
                const subValidator = typeof m.items === 'string' ? { type: m.items } : m.items;

                normalize(major, minor, patch, exception.at('items'), value, m.items, param);
            }

            // dive into object properties definitions
            if (m.properties) {

            }

            // dive into additionalProperties definitions
            if (m.additionalProperties) {
                Object.keys(definition).forEach(k => {
                    normalize(major, minor, patch, exception.at(k), value[k], m.additionalProperties, param);
                });
            }

            if (util.isPlainObject(value)) {
                if (m.properties) {
                    normalize(major, minor, patch, exception, value, m.properties, param);
                } else if (m.additionalProperties) {
                    Object.keys(value).forEach(k => {
                        normalize(major, minor, patch, exception.at(k), value[k], m.additionalProperties, param);
                    });
                }
            }

            // if no exceptions and not ignored then add
            if (!exception.hasException && (!m.ignore || !m.ignore(param))) {
                result[key] = m.deserialize ? m.deserialize(param) : value;
            }
        }
    });

    // report missing required properties
    if (missingRequired.length) {
        missingRequired.sort();
        _exception('Missing required propert' + (missingRequired.length === 1 ? 'y' : 'ies') + ': ' + missingRequired.join(', '));
    }

    // report not allowed properties
    if (notAllowed.length) {
        _exception('Propert' + (notAllowed.length === 1 ? 'y' : 'ies') + ' not allowed: ' + notAllowed.join(', '));
    }

    // run post validations
    if (validator['__enforcer_definition_post_validate']) {
        fn(validator['__enforcer_definition_post_validate'], {
            definition,
            exception,
            major,
            minor,
            patch,
            parent,
            validator,
            dateType,
            deserializeDate,
            numericish,
            minMaxValid
        });
    }

    return result;
}

function dateType(definition) {
    return definition.type === 'string' && definition.format && definition.format.startsWith('date')
}

function deserializeDate(definition, exception, value) {
    if (definition.type === 'string') {
        const date = util.getDateFromValidDateString(definition.format, value);
        if (!date) exception('Value is not a valid ' + definition.format);
        return date;
    } else {
        return value;
    }
}

function fn(value, params) {
    return typeof value === 'function'
        ? value(params)
        : value;
}

function minMaxValid(minimum, maximum, exclusiveMinimum, exclusiveMaximum) {
    if (minimum === undefined || maximum === undefined) return true;
    minimum = +minimum;
    maximum = +maximum;
    return minimum < maximum || (!exclusiveMinimum && !exclusiveMaximum && minimum === maximum);
}

function numericish(definition) {
    return ['number', 'integer'].includes(definition.type) || dateType(definition);
}