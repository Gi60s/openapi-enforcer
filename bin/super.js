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
const definitionValidator   = require('./definition-validator');
const Result                = require('./result');

const store = {};

module.exports = function (version, name) {
    if (!store[version]) store[version] = {};
    if (!store[version].hasOwnProperty(name)) {
        const enforcer = require('./enforcers/' + name);
        store[version][name] = createConstructor(version, name, enforcer);
    }
    return store[version][name];
};

function createConstructor(version, name, enforcer) {
    const callbacks = [];
    const store = new WeakMap();

    // build the named constructor
    const F = new Function('build', 'name',
        `const F = function ${name} (definition) {
            if (!(this instanceof F)) return new F(definition)
            return build(this, definition)
        }
        return F`
    )(build, name);

    // set the constructor prototype and constructor
    F.prototype = Object.assign({}, enforcer.prototype || {});
    F.constructor = F;

    // get the enforcer data for this instance
    Object.defineProperty(F.prototype, 'enforcerData', {
        get: function () {
            return store.get(this);
        }
    });

    // define a method to turn the complex object into a plain object
    F.prototype.toObject = function () {
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
    F.extend = function (callback) {
        if (typeof callback !== 'function') throw Error('Invalid input. Callback must be a function. Received: ' + callback);
        callbacks.push(callback);
    };

    function build (context, definition) {
        // validate the definition
        const data = definitionValidator.normalize(version, enforcer.validator, definition);
        if (data.exception.hasException) return new Result(undefined, data.exception, data.warn);

        // store full set of enforcer data
        store.set(context, data);

        // add definition properties to context
        Object.assign(context, data.result.value);

        // run the construct function if present
        if (enforcer.run) enforcer.run(data);

        // add plugin callbacks to this instance
        const plugins = data.plugins;
        callbacks.forEach(callback => plugins.push(function() {
            callback.call(context, data);
        }));

        return new Result(context, data.exception, data.warn);
    }

    return F;
}