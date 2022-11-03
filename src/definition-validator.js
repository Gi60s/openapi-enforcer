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
const util          = require('./util');

const rxExtension = /^x-.+/;

module.exports = normalize;

function childData(parent, key, validator) {
    const definition = parent.definition[key];
    const development = !parent.production;

    const definitionType = util.getDefinitionType(definition);
    let result;

    if (definitionType === 'array') {
        result = [];
    } else if (definitionType === 'object') {
        result = {};
    } else {
        result = definition;
    }

    return {
        context: parent.context,
        definition,
        definitionType,
        defToInstanceMap: parent.defToInstanceMap,
        exception: development ? parent.exception.at(key) : parent.exception,
        key,
        major: parent.major,
        map: parent.map,
        minor: parent.minor,
        options: parent.options,
        parent,
        patch: parent.patch,
        plugins: parent.plugins,
        production: parent.production,
        refParser: parent.refParser,
        result,
        root: parent.root,
        staticData: null,
        usedDefault: false,
        validator,
        warn: development ? parent.warn.at(key) : parent.warn,
    };
}

/**
 *
 * @param data
 * @param superOptions Options that come from the super.js "build" function.
 * @returns {*}
 */
function normalize (data, refParser, superOptions) {
    const { definitionType, exception, production, result } = data;
    const skipCodes = superOptions.exceptionSkipCodes;
    let definition = data.definition;

    try {
        // generate the plain validator object
        const validator = fn(data.validator, data);
        const freeForm = validator.freeForm;

        // if type is invalid then exit
        if (!validateType(definitionType, data)) return;

        // if the value has already been processed then we are in a circular reference and we should return the known value
        if (definition && typeof definition === 'object') {
            const item = mapGetResult(data);
            if (item) return item.value;
            mapSetResult(data, result);
        }

        if (!production) {
            // if enum is invalid then exit
            if (validator.enum) {
                const matches = fn(validator.enum, data);
                if (!matches.includes(definition)) {
                    matches.length === 1
                        ? exception.message('Value must be ' + util.smart(matches[0]) + '. Received: ' + util.smart(definition))
                        : exception.message('Value must be one of: ' + matches.join(', ') + '. Received: ' + util.smart(definition));
                }
            }

            if (definitionType === 'array' && !freeForm) {
                definition.forEach((def, i) => {
                    const child = childData(data, i, validator.items);
                    result.push(runChildValidator(child, refParser, superOptions));
                });
                Object.freeze(result);

            } else if (definitionType === 'object' && !freeForm) {
                const missingRequired = [];
                const notAllowed = [];
                const unknownKeys = [];

                if (validator === true) {
                    Object.keys(definition).forEach(key => {
                        Object.defineProperty(result, key, {
                            configurable: true,
                            enumerable: true,
                            value: definition[key]
                        });
                    });
                    // Object.assign(result, util.copy(definition));

                } else if (validator === false) {
                    notAllowed.push.apply(notAllowed, Object.keys(definition));

                } else if (validator.additionalProperties) {
                    Object.keys(definition).forEach(key => {
                        const child = childData(data, key, validator.additionalProperties);
                        const keyValidator = EnforcerRef.isEnforcerRef(child.validator)
                            ? child.validator.config || {}
                            : child.validator;

                        const allowed = keyValidator.hasOwnProperty('allowed') ? fn(keyValidator.allowed, child) : true;
                        let valueSet = false;
                        if (child.definition !== undefined) {
                            if (!allowed) {
                                notAllowed.push(key);
                            } else if (!keyValidator.ignored || !fn(keyValidator.ignored, child)) {
                                Object.defineProperty(result, key, {
                                    configurable: true,
                                    enumerable: true,
                                    value: runChildValidator(child, refParser, superOptions)
                                });
                                valueSet = true;
                            }
                        }

                        if (valueSet && keyValidator.errors && keyValidator !== child.validator) {
                            const d = Object.assign({}, child);
                            d.definition = result[key];
                            fn(keyValidator.errors, d);
                        }
                    });

                } else {

                    // organize definition properties
                    Object.keys(definition).forEach(key => {
                        if (rxExtension.test(key)) {
                            Object.defineProperty(result, key, {
                                configurable: true,
                                enumerable: true,
                                value: definition[key] });
                        } else {
                            unknownKeys.push(key);
                        }
                    });

                    // get sorted array of all properties to use
                    const properties = mapAndSortValidatorProperties(validator, data);

                    // iterate through all known properties
                    properties.forEach(prop => {
                        const data = prop.data;
                        const key = data.key;
                        const validator = data.validator;
                        const keyValidator = EnforcerRef.isEnforcerRef(validator)
                            ? validator.config || {}
                            : validator;
                        const allowed = keyValidator.hasOwnProperty('allowed') ? fn(keyValidator.allowed, data) : true;
                        util.arrayRemoveItem(unknownKeys, key);

                        // set default value
                        if (data.definition === undefined && allowed && keyValidator.hasOwnProperty('default')) {
                            const defaultValue = fn(keyValidator.default, data);
                            if (defaultValue !== undefined) {
                                data.definition = defaultValue
                                data.usedDefault = true;
                                data.parent.definition[key] = data.definition;
                                data.definitionType = util.getDefinitionType(data.definition);
                            }
                        }

                        if (data.definition !== undefined) {
                            if (!allowed) {
                                notAllowed.push(key);
                            } else if (!keyValidator.ignored || !fn(keyValidator.ignored, data)) {
                                Object.defineProperty(result, key, {
                                    configurable: true,
                                    enumerable: true,
                                    value: runChildValidator(data, refParser, superOptions)
                                });
                            }
                        } else if (allowed && keyValidator.required && fn(keyValidator.required, data)) {
                            missingRequired.push(key);
                        }
                    });
                }

                // report any keys that are not allowed
                notAllowed.push.apply(notAllowed, unknownKeys);
                if (notAllowed.length && !skipCodes.EDEV001 && !util.schemaObjectHasSkipCode(definition, 'EDEV001')) {
                    notAllowed.sort();
                    exception.message('Propert' + (notAllowed.length === 1 ? 'y' : 'ies') + ' not allowed: ' + notAllowed.join(', ') + ' [EDEV001]');
                }

                // report missing required properties
                if (missingRequired.length) {
                    missingRequired.sort();
                    exception.message('Missing required propert' + (missingRequired.length === 1 ? 'y' : 'ies') + ': ' + missingRequired.join(', '));
                }

            } else if (!freeForm) {
                switch (definitionType) {
                    case 'boolean':
                    case 'null':
                    case 'number':
                    case 'string':
                        data.result = definition;
                        mapSetResult(data, definition);
                        break;
                    default:
                        exception.message('Unknown data type provided');
                        break;
                }
            } else {
                data.result = definition;
                mapSetResult(data, definition);
            }
        } else {
            if (definitionType === 'array') {
                definition.forEach((def, i) => {
                    const child = childData(data, i, validator.items);
                    result.push(runChildValidator(child, refParser, superOptions));
                });
                Object.freeze(result);
            } else if (definitionType === 'object') {
                Object.keys(definition).forEach(key => {
                    let childValidator;
                    if (typeof validator !== 'object') {
                        childValidator = validator;
                    } else if (validator.properties && validator.properties.hasOwnProperty(key)) {
                        childValidator = validator.properties[key]
                    } else if (validator.additionalProperties) {
                        childValidator = validator.additionalProperties;
                    }
                    const child = childData(data, key, childValidator);
                    Object.defineProperty(result, key, {
                        configurable: true,
                        enumerable: true,
                        value: runChildValidator(child, refParser, superOptions)
                    });
                });

                // set defaults where appropriate
                const properties = mapAndSortValidatorProperties(validator, data);
                properties.forEach(({ data }) => {
                    const key = data.key;
                    if (!result.hasOwnProperty(key)) {
                        const cValidator = data.validator;
                        const keyValidator = EnforcerRef.isEnforcerRef(cValidator)
                            ? cValidator.config || {}
                            : cValidator;
                        const allowed = keyValidator.hasOwnProperty('allowed') ? fn(keyValidator.allowed, data) : true;
                        if (allowed && keyValidator.hasOwnProperty('default')) {
                            const value = fn(keyValidator.default, data);
                            Object.defineProperty(result, key, {
                                configurable: true,
                                enumerable: true,
                                value
                            });
                        }
                    }
                })
            } else {
                data.result = definition;
                mapSetResult(data, definition);
            }
        }

        let deserialized = data.definition;
        if (validator.deserialize) {
            const d = Object.assign({}, data);
            deserialized = validator.deserialize(d);
            data.result = deserialized;
            mapSetResult(data, definition);
        }

        // run custom error validation check
        if (!production && validator.errors) {
            const d = Object.assign({}, data);
            d.definition = deserialized;
            fn(validator.errors, d);
        }

    } catch (err) {
        exception.message('Unexpected error encountered: ' + err.stack);
    }

    return data.result;
}

normalize.isValidatorState = function (value) {
    return value instanceof ValidatorState
};

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
            params.exception.message('Unexpected error encountered: ' + err.stack);
        }
    } else {
        return value;
    }
}

function mapAndSortValidatorProperties (validator, data) {
    const properties = Object.keys(validator.properties || {})
        .map(key => {
            const property = validator.properties[key];
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
    return properties;
}

function mapGetResult (data) {
    const { definition, map, validator } = data;
    const match = map.get(definition);
    if (!match) return undefined;

    let item = match.find(v => v.validator === validator);
    return item ? item.value : undefined;
}

function mapSetResult (data, value) {
    const { definition, map, validator } = data;
    let match = map.get(definition);

    if (!match) {
        match = [];
        map.set(definition, match);
    }

    const item = match.find(v => v.validator === validator);
    if (item) {
        item.value = value;
    } else {
        match.push({ validator, value });
    }
}

function runChildValidator(data, refParser, superOptions) {
    const validator = fn(data.validator, data);
    data.validator = validator;
    if (EnforcerRef.isEnforcerRef(validator)) {
        const subValidator = data.validator.config;
        if (data.definitionType === 'boolean') {     // account for boolean instead of schema definition
            data.validator = data.validator.config;
            return normalize(data, refParser, superOptions);
        } else if (!subValidator || validateType(data.definitionType, Object.assign({}, data, { validator: subValidator }))) {
            return new data.context[validator.value](new ValidatorState(data), refParser, superOptions);
        }
    } else if (data.validator) {
        return normalize(data, refParser, superOptions);
    } else {
        return data.result;
    }
}

function validateType(definitionType, data) {
    const { definition, exception } = data;
    const validator = fn(data.validator, data);
    if (!data.production && validator.type && definition !== undefined) {
        // get valid types
        let matches = fn(validator.type, data);
        if (!Array.isArray(matches)) matches = [ matches ];
        matches = matches.map(v => v === 'integer' ? 'number' : v);
        if (matches.includes('any')) return true;
        if (matches.includes(definitionType)) return true;

        const length = matches.length;
        let message;
        if (length === 1) {
            message = expectedTypeMessage(matches[0]);
        } else if (length === 2) {
            message = expectedTypeMessage(matches[0]) + ' or ' + expectedTypeMessage(matches[1])
        } else {
            const last = matches.pop();
            message = matches.map(match => expectedTypeMessage(match)).join(', ') + ', or ' + expectedTypeMessage(last);
        }
        exception.message('Value must be ' + message + '. Received: ' + util.smart(definition));
        return false;
    } else {
        return true;
    }
}

function ValidatorState (data) {
    Object.assign(this, data);
}
