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

module.exports = EnforcerValue;

const defaultCoerce = false;
const defaultSerialize = true;
const defaultValidate = true;

/**
 * Create a value with special handling.
 * @param {*} value
 * @param {object} [config]
 * @param {boolean} [config.coerce=false] Whether the value should use strong type coercion.
 * @param {boolean} [config.serialize] Whether the value should be serialized or deserialized.
 * @param {boolean} [config.validate] Whether the value should be validated.
 * @returns {EnforcerValue}
 * @constructor
 */
function EnforcerValue(value, { coerce, serialize, validate }) {
    if (!(this instanceof EnforcerValue)) return new EnforcerValue(value, { coerce, serialize, validate });
    this.coerce = coerce === undefined ? defaultCoerce : coerce;
    this.serialize = serialize === undefined ? defaultSerialize : serialize;
    this.validate = validate === undefined ? defaultValidate : validate;
    this.value = value;
}

EnforcerValue.getAttributes = function (value) {
    return typeof value === 'object' && value instanceof EnforcerValue
        ? {
            coerce: value.coerce,
            serialize: value.serialize,
            validate: value.validate,
            value: value.value
        }
        : {
            coerce: defaultCoerce,
            serialize: defaultSerialize,
            validate: defaultValidate,
            value
        };
};