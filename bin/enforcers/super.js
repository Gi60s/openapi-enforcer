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

module.exports = function(Constructor) {
    const callbacks = [];

    Constructor.extend = function (callback) {
        if (typeof callback !== 'function') throw Error('Invalid input. Callback must be a function. Received: ' + callback);
        callbacks.push(callback);
    };

    Constructor.prototype.toObject = function () {
        const result = {};
        Object.keys(this).forEach(key => {
            const value = this[key];
            if (Array.isArray(value)) {
                result[key] = value.map(item => {
                    return item && typeof item === 'object' && typeof item.toObject === 'function'
                        ? item.toObject()
                        : item;
                });
            } else if (value && typeof value === 'object' && typeof value.toObject === 'function') {
                result[key] = value.toObject();
            } else if (value && typeof value === 'object') {
                result[key] = Object.assign({}, value);
            } else {
                result[key] = value;
            }
        });
        return result;
    };

    function build(f, data) {
        const prototype = Object.assign({}, Constructor.prototype, { enforcerData: data });
        prototype.constructor = f;
        const context = Object.create(prototype);
        Object.assign(context, data.definition);
        Constructor.call(context, data);

        // add callbacks to plugins
        const plugins = data.plugins;
        callbacks.forEach(callback => plugins.push(function() {
            callback.call(context, data);
        }));

        return context;
    }

    return new Function('build',
        `const f = function ${Constructor.name} (data) {
            return build(f, data);
        }
        return f`
    )(build);
};