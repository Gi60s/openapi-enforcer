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
const EnforcerRef   = require('./enforcer-ref');
const Exception     = require('./exception');
const Super         = require('./super');
const util          = require('./util');

const rxExtension = /^x-.+/;

exports.start = function (version, name, enforcer, definition, context) {
    definition = util.copy(definition);
    const exception = Exception('One or more errors exist in the ' + name + ' definition');
    const warn = Exception('One or more warnings exist in the ' + name + ' definition');
    const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(version);
    const map = new Map();
    const major = +match[1];
    const minor = +match[2];
    const patch = +(match[3] || 0);
    const parent = null;
    const plugins = [];
    const result = {};
    const validator = enforcer.validator;
    const key = undefined;

    const root = { context, definition, exception, key, major, map, minor, parent, patch, plugins, result, validator, warn };
    root.root = root;
    normalize(root);
    root.plugins.forEach(plugin => plugin());
    return root;
};

exports.continue = normalize;

exports.isValidatorState = function (value) {
    return value instanceof ValidatorState
};

function childData(parent, key, validator) {
    return {
        context: parent.context,
        definition: parent.definition[key],
        exception: parent.exception.at(key),
        key,
        major: parent.major,
        map: parent.map,
        minor: parent.minor,
        parent,
        patch: parent.patch,
        plugins: parent.plugins,
        result: {},
        root: parent.root,
        validator,
        warn: parent.warn.at(key),
    };
}

function normalize (data) {
    const { exception, map, result } = data;
    let definition = data.definition;

    try {

        // get the definition type
        let definitionType = typeof definition;
        if (Array.isArray(definition)) definitionType = 'array';
        if (definitionType === 'object' && !util.isPlainObject(definition)) {
            exception('Definition must be a plain object');
            return;
        }

        // generate the plain validator object
        const validator = fn(data.validator, data);

        // if type is invalid then exit
        if (validator.type && definition !== undefined) {
            // get valid types
            let matches = fn(validator.type, data);
            if (!Array.isArray(matches)) matches = [ matches ];

            // check if types match
            const length = matches.length;
            let foundMatch = matches.length === 0;
            for (let i = 0; i < length; i++) {
                if (matches[i] === definitionType) {
                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                let message;
                if (matches.length === 1) {
                    message = expectedTypeMessage(matches[0]);
                } else if (matches.length === 2) {
                    message = expectedTypeMessage(matches[0]) + ' or ' + expectedTypeMessage(matches[1])
                } else {
                    const last = matches.pop();
                    message = matches.map(match => expectedTypeMessage(match)).join(', ') + ' or ' + expectedTypeMessage(last);
                }
                exception('Value must be ' + message + '. Received: ' + util.smart(definition));
                return;
            }
        }

        // if the validator is actually an EnforcerRef then pass validation and creation to a component enforcer instance
        // if (usesComponentEnforcerConstructor && definition !== undefined) {
        //     const version = major + '.' + minor;
        //     const name = validator.value;
        //     const additionalValidator = validator.config; // TODO: need to validate extra validations
        //
        //     if (additionalValidator.ignore && !fn(additionalValidator.ignore, data)) {
        //         result.value = new Super.getConstructor(version, name)(new ValidatorState(data));
        //     }
        //
        //     throw Error('IDEA: have object and array run this logic within properties');
        //     return;
        // }

        // if the value has already been processed then we are in a circular reference and we should return the known value
        if (definition && typeof definition === 'object') {
            const existing = map.get(definition);
            if (existing) {
                result.value = existing.value;
                return;
            }
            map.set(definition, result);
        }

        // if enum is invalid then exit
        if (validator.enum) {
            const matches = fn(validator.enum, data);
            if (!matches.includes(definition)) {
                matches.length === 1
                    ? exception('Value must be ' + util.smart(matches[0]) + '. Received: ' + util.smart(definition))
                    : exception('Value must be one of: ' + matches.join(', ') + '. Received: ' + util.smart(definition));
            }
        }

        // check if this value is allowed
        // const allowed = validator.hasOwnProperty('allowed') ? fn(validator.allowed, data) : true;
        // if (!allowed) {
        //     let message = 'Property not allowed';
        //     if (typeof allowed === 'string') message += '. ' + allowed;
        //     exception(message);
        //     return;
        // }
        //
        // // check if this value is ignored
        // const ignore = validator.ignore && fn(validator.ignore, data);
        // if (ignore) {
        //     result.value = undefined;
        //     return;
        // }

        // set default value
        if (definition === undefined && validator.hasOwnProperty('default')) definition = fn(validator.default, data);

        if (definitionType === 'array') {
            result.value = [];
            definition.forEach((def, i) => {
                const child = childData(data, i, validator.items);
                runChildValidator(child);
                if (child.result.value !== undefined) result.value.push(child.result.value);
            });

        } else if (definitionType === 'object') {
            const missingRequired = [];
            const notAllowed = [];
            const unknownKeys = [];

            if (validator === true) {
                result.value = util.copy(definition);

            } else if (validator === false) {
                notAllowed.push.apply(notAllowed, Object.keys(definition));

            } else if (validator.additionalProperties) {
                const resultValue = {};
                Object.keys(definition).forEach(key => {
                    const child = childData(data, key, validator.additionalProperties);
                    runChildValidator(child);
                    if (child.result.value !== undefined) resultValue[key] = child.result.value;
                });
                data.result.value = resultValue;

            } else {
                const resultValue = {};
                let valueSet = false;

                // organize definition properties
                Object.keys(definition).forEach(key => {
                    if (rxExtension.test(key)) {
                        resultValue[key] = definition[key];
                    } else {
                        unknownKeys.push(key);
                    }
                });

                // get sorted array of all properties to use
                const properties = Object.keys(validator.properties || {})
                    .map(key => {
                        const property = validator.properties[key];
                        util.arrayRemoveItem(unknownKeys, key);
                        return {
                            data: childData(data, key, property),
                            weight: property.weight || 0
                        }
                    });
                properties.sort((a, b) => {
                    if (a.weight < b.weight) return -1;
                    if (a.weight > b.weight) return 1;
                    return a.data.key < b.data.key ? -1 : 1;
                });

                // iterate through all known properties
                properties.forEach(prop => {
                    const data = prop.data;
                    const key = data.key;
                    const validator = data.validator;
                    if (data.definition !== undefined) {
                        if (validator.hasOwnProperty('allowed') && !fn(validator.allowed, data)) {
                            notAllowed.push(key);
                        } else if (!validator.ignore || !fn(validator.ignore, data)) {
                            runChildValidator(data);
                        }
                    } else if (validator.required && fn(validator.required, data)) {
                        missingRequired.push(key);
                    }
                    if (data.result.value !== undefined) {
                        valueSet = true;
                        resultValue[key] = data.result.value;
                    }
                });

                if (valueSet) result.value = resultValue;
            }

            // report any keys that are not allowed
            notAllowed.push.apply(notAllowed, unknownKeys);
            if (notAllowed.length) {
                exception('Propert' + (notAllowed.length === 1 ? 'y' : 'ies') + ' not allowed: ' + notAllowed.join(', '));
            }

            // report missing required properties
            if (missingRequired.length) {
                exception('Missing required propert' + (missingRequired.length === 1 ? 'y' : 'ies') + ': ' + missingRequired.join(', '));
            }

        } else if (definition !== undefined) {
            result.value = definition;
        }

        // run custom error validation check
        if (result.value !== undefined && validator.errors) {
            const d = Object.assign({}, data);
            d.definition = result.value;
            fn(validator.errors, d);
        }

    } catch (err) {
        exception('Unexpected error encountered: ' + err.stack);
    }
}

/**
 *
 * @param {ValidatorState} data
 * @returns {*}
 */
/*
function normalize2(data) {
    const { exception, major, map, minor, parent, patch, plugins, refParser, result, root, value, warn } = data = Object.assign({}, data);

    // if this value has already been processed then return result
    if (value && typeof value === 'object') {
        const existing = map.get(value);
        if (existing) return existing;
        map.set(value, result);
    }

    const validator = getValidator(data);
    let message;

    try {
        // get the value's data type
        const type = getValueType(value);
        if (validator.type && (message = checkType(data))) {
            exception('Value must be ' + message + '. Received: ' + util.smart(value));

        // check if enum matches
        } else if (validator.enum && (message = checkEnum(data))) {
            message.length === 1
                ? exception('Value must be ' + util.smart(message[0]) + '. Received: ' + util.smart(value))
                : exception('Value must be one of: ' + message.join(', ') + '. Received: ' + util.smart(value));

        } else if (type === 'array') {
            result.value = value.map((v, i) => {
                const r = {};
                normalize(new ValidatorState({
                    exception: exception.at(i),
                    key: i,
                    major,
                    map,
                    minor,
                    parent: data,
                    patch,
                    plugins,
                    refParser,
                    result: r,
                    root,
                    validator: validator.items,
                    value: v,
                    warn: warn.at(i)
                }));
                return r.value;
            });

        } else if (type === 'object') {
            result.value = {};
            if (validator.additionalProperties) {
                const additionalPropertiesValidator = validator.additionalProperties;
                Object.keys(value).forEach(key => {
                    const r = {};
                    const param = new ValidatorState({
                        exception: exception.at(key),
                        key,
                        major,
                        map,
                        minor,
                        parent: data,
                        patch,
                        plugins,
                        refParser,
                        result: r,
                        root,
                        validator: additionalPropertiesValidator,
                        value: value[key],
                        warn: warn.at(key)
                    });
                    const validator = getValidator(param);

                    const allowed = validator.hasOwnProperty('allowed')
                        ? fn(validator.allowed, param)
                        : true;
                    const ignore = validator.ignore && fn(validator.ignore, param);

                    if (allowed === true) {
                        if (!ignore) {
                            normalize(param);
                            result.value[key] = r.value;
                        }
                    } else {
                        let message = 'Property not allowed: ' + key;
                        if (typeof allowed === 'string') message += '. ' + allowed;
                        exception(message)
                    }
                });

            } else if (!validator.properties) {
                Object.keys(value).forEach(key => {
                    result.value[key] = value[key];
                });

            } else {
                const allowed = {};
                const ignores = {};
                const missingRequired = [];

                const properties = Object.keys(validator.properties)
                    .map(key => {
                        const value = validator.properties[key];
                        return { key: key, validator: value, weight: value.weight || 0 }
                    });
                properties.sort((a, b) => a.weight < b.weight ? -1 : 1);

                // check for missing required and set defaults
                properties.forEach(prop => {
                    const key = prop.key;
                    const param = new ValidatorState({
                        exception: exception.at(key),
                        key,
                        map,
                        major,
                        minor,
                        parent: data,
                        patch,
                        plugins,
                        refParser,
                        result: {},
                        root,
                        validator: prop.validator,
                        value: value[key],
                        warn: warn.at(key)
                    });
                    const validator = getValidator(param);

                    // check whether this property is allowed
                    allowed[key] = validator.hasOwnProperty('allowed')
                        ? fn(validator.allowed, param)
                        : true;

                    // check if this property is ignored
                    ignores[key] = validator.ignore && fn(validator.ignore, param);

                    // if it doesn't have the property and it is allowed then check if it is required or has a default
                    if (!value.hasOwnProperty(key) && allowed[key]) {
                        if (validator.required && fn(validator.required, param)) {
                            missingRequired.push(key);
                        } else if (validator.hasOwnProperty('default') && !ignores[key]) {
                            const defaultValue = fn(validator.default, param);
                            if (defaultValue !== undefined) value[key] = defaultValue;
                        }
                    }
                });

                // validate each property and copy to the result object
                Object.keys(value).forEach(key => {

                    // check if the key is an extension property
                    if (rxExtension.test(key)) {
                        result.value[key] = value[key];

                        // check if property allowed
                    } else if (allowed[key] !== true) {
                        let message = 'Property not allowed: ' + key;
                        if (typeof allowed[key] === 'string') message += '. ' + allowed[key];
                        exception(message)

                    } else if (!ignores[key]) {
                        const r = {};
                        normalize(new ValidatorState({
                            exception: exception.at(key),
                            key,
                            major,
                            map,
                            minor,
                            parent: data,
                            patch,
                            plugins,
                            refParser,
                            result: r,
                            root,
                            value: value[key],
                            validator: validator.properties[key],
                            warn: warn.at(key)
                        }));
                        result.value[key] = r.value;
                    }
                });

                // report missing required properties
                if (missingRequired.length) {
                    missingRequired.sort();
                    exception('Missing required propert' + (missingRequired.length === 1 ? 'y' : 'ies') + ': ' + missingRequired.join(', '));
                }
            }

        } else {
            result.value = validator.deserialize
                ? fn(validator.deserialize, new ValidatorState({
                    exception,
                    key: undefined,
                    map,
                    major,
                    minor,
                    parent,
                    patch,
                    plugins,
                    refParser,
                    root,
                    validator,
                    value,
                    warn
                }))
                : value;
        }

        if (result.value !== undefined) {

            if (validator.errors) {
                fn(validator.errors, new ValidatorState({
                    exception,
                    key: undefined,
                    map,
                    major,
                    minor,
                    parent,
                    patch,
                    plugins,
                    refParser,
                    root,
                    validator,
                    value: result.value,
                    warn
                }));
            }

            if (!exception.hasException && validator.component) {
                result.value = module.exports.component(validator.component, data);
            }
        }

    } catch (err) {
        exception('Unexpected error encountered: ' + err.stack);
    }
}
*/

function expectedTypeMessage(type) {
    if (type === 'array') return 'an array';
    if (type === 'object') return 'a plain object';
    return 'a ' + type;
}

function fn(value, params) {
    if (typeof value === 'function') {
        try {
            return value(params);
        } catch (err) {
            params.exception('Unexpected error encountered: ' + err.stack);
        }
    } else {
        return value;
    }
}

function runChildValidator(data) {
    const validator = fn(data.validator, data);
    data.validator = validator;
    if (EnforcerRef.isEnforcerRef(validator)) {
        const version = data.major + '.' + data.minor;
        const name = validator.value;
        data.result.value = new Super.getConstructor(version, name)(new ValidatorState(data));
        data.definition = data.result.value;
        data.validator = validator.config ? fn(validator.config, data) : undefined;
        if (data.validator) {
            data.validator.additionalProperties = true;
        }
    }
    if (data.validator) normalize(data);
}

function ValidatorState (data) {
    Object.assign(this, data);
}