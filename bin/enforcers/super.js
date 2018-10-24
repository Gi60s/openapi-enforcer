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

// 1. store individual enforcerData per instance using a map and a prototype getter
// 2. store protected data per instance using a map. How?

module.exports = function (Constructor) {
    const callbacks = [];
    const store = new WeakMap();

    // get the enforcer data for this instance
    Object.defineProperty(Constructor.prototype, 'enforcerData', {
        get: function () {
            return store.get(this);
        }
    });

    // define a method to turn the complex object into a plain object
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

    // add extension to the class - these callbacks will execute as plugins when the entire tree has been built
    Constructor.extend = function (callback) {
        if (typeof callback !== 'function') throw Error('Invalid input. Callback must be a function. Received: ' + callback);
        callbacks.push(callback);
    };

    return function (data) {
        const context = Object.create(Constructor.prototype);   // create the object
        store.set(context, data);                               // store enforcer data
        Object.assign(context, data.definition);                // copy definition properties to the object
        Constructor.call(context, data);                        // call the constructor with context

        // add callbacks to plugins - these will execute after the entire tree has been built
        const plugins = data.plugins;
        callbacks.forEach(callback => plugins.push(function() {
            callback.call(context, data);
        }));

        return context;
    };
};