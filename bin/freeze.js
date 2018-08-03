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

/**
 * Freeze a date so it cannot be modified.
 * @param {Date} value
 */
exports.date = function(value) {
    value.setDate = noop;
    value.setFullYear = noop;
    value.setHours = noop;
    value.setMilliseconds = noop;
    value.setMinutes = noop;
    value.setMonth = noop;
    value.setSeconds = noop;
    value.setTime = noop;
    value.setUTCDate = noop;
    value.setUTCFullYear = noop;
    value.setUTCHours = noop;
    value.setUTCMilliseconds = noop;
    value.setUTCMinutes = noop;
    value.setUTCMonth = noop;
    value.setUTCSeconds = noop;
    value.setYear = noop;
};

/**
 * Perform a deep freeze that prevents anything from being added to, removed, or modified on the object.
 * @param {array|object|date} value
 */
exports.deep = function(value) {
    if (value instanceof Date) {
        exports.date(value);

    } else if (Array.isArray(value)) {
        value.forEach(v => exports.deepFreeze(v));
        Object.freeze(value);

    } else if (this.isPlainObject(value)) {
        Object.keys(value).forEach(k => exports.deepFreeze(value[k]));
        Object.freeze(value);
    }
};

/**
 * Prevent any properties that have already been written from being modified.
 * @param {array|object|date} value
 */
exports.written = function(value) {
    if (value instanceof Date) {
        exports.date(value);

    } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
            exports.written(v);
            Object.defineProperty(value, String(i), {
                writable: false,
                value: value[i]
            });
        });

    } else if (this.isPlainObject(value)) {
        Object.keys(value).forEach(k => {
            exports.written(value[k])
            Object.defineProperty(value, k, {
                writable: false,
                value: value[k]
            })
        });
    }
};

function noop() {}