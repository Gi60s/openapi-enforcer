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

const rxExtension = /^x-.+/;

module.exports = function(target, version, exception, obj, map) {
    obj = Object.assign({}, obj);

    // check for missing required and set defaults
    const missingRequired = [];
    Object.keys(map).forEach(key => {
        const m = map[key];
        if (!obj.hasOwnProperty(key) && (!m.allowed || m.allowed(obj, version))) {
            if (m.required && m.required(obj, version)) {
                missingRequired.push(key);
            } else if (m.default) {
                obj[key] = m.default(obj, version);
            }
        }
    });

    // validate each property and its value
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        const m = map[key];
        let message;
        if (rxExtension.test(key)) {
            target[key] = value;
        } else if (!map.hasOwnProperty(key) || (m.allowed && !m.allowed(obj, version, value))) {
            exception('Property not allowed: ' + key);
        } else if (m.type && (message = m.type(obj, version, value)) !== typeof value) {
            exception('Value for property "' + key + '" must be a ' + message + '. Received: ' + util.smart(value));
        } else if (m.isPlainObject && !util.isPlainObject(value)) {
            exception('Value for property "' + key + '" must be a plain object. Received: ' + util.smart(value));
        } else if (m.isArray && !Array.isArray(value)) {
            exception('Value for property "' + key + '" must be an array. Received: ' + util.smart(value));
        } else if (m.enum && (message = m.enum(obj, version, value)).findIndex(v => util.same(v, value)) === -1) {
            exception('Property "' + key + '" has invalid value: ' + util.smart(value) +'. Must be one of: ' + message.join(', '));
        } else if (m.errors && (message = m.errors(obj, version, value))) {
            exception('Property "' + key + '" has invalid value. ' + message);
        } else if (!m.ignore || !m.ignore(obj, version, value)) {
            target[key] = value;
        }
    });

    // report missing required properties
    if (missingRequired.length) {
        exception('Missing required propert' +
            (missingRequired.length === 1 ? 'y' : 'ies') +
            ': ' + missingRequired.join(', '));
    }

    return target;
};