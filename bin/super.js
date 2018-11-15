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
module.exports = Super;

const definitionValidator   = require('./definition-validator');
const Exception             = require('./exception');
const Result                = require('./result');
const util                  = require('./util');

const store = {};
const constructors = [];

function Super (version, name, enforcer) {
    if (!enforcer) enforcer = require('./enforcers/' + name);
    return createConstructor(version, name, enforcer);
}

Super.getConstructor = function(version, name) {
    return store[version] && store[version][name];
};

function createConstructor(version, name, enforcer) {
    const callbacks = [];
    const store = new WeakMap();

    // build the named constructor
    const F = new Function('build',
        `const F = function ${name} (definition) {
            if (!(this instanceof F)) return new F(definition)
            return build(this, definition)
        }
        return F`
    )(build);

    // set the constructor prototype and constructor
    F.prototype = Object.assign({}, enforcer.prototype || {});
    F.constructor = F;

    Object.defineProperty(F, 'enforcerDefinition', {
        value: enforcer
    });

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

    const staticData = {};
    if (enforcer.statics) {
        const exported = enforcer.statics(staticData);
        Object.keys(exported).forEach(key => {
            F[key] = exported[key];
        });
    }

    function build (result, definition) {
        const isStart = !definitionValidator.isValidatorState(definition);

        // validate the definition
        let data;
        if (isStart) {
            const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(version.version);
            definition = util.copy(definition);
            data = {
                context: version,
                definition,
                definitionType: util.getDefinitionType(definition),
                exception: Exception('One or more errors exist in the ' + name + ' definition'),
                key: undefined,
                map: new Map(),
                major: +match[1],
                minor: +match[2],
                parent: null,
                patch: +(match[3] || 0),
                plugins: [],
                result,
                staticData,
                validator: enforcer.validator,
                warn: Exception('One or more warnings exist in the ' + name + ' definition'),
            };
            data.root = data;

        } else {
            data = definition;
            data.staticData = staticData;
            data.validator = enforcer.validator;
            data.result = result;
        }

        // store the full set of enforcer data
        store.set(result, data);

        if (util.isPlainObject(data.definition)) {
            definitionValidator(data);
        } else {
            data.exception.message('Value must be a plain object');
        }

        // if an exception has occurred then exit now
        if (data.exception.hasException && isStart) return new Result(undefined, data.exception, data.warn);

        // run the construct function if present
        if (enforcer.init) enforcer.init.call(result, data);

        // add plugin callbacks to this instance
        const plugins = data.plugins;
        callbacks.forEach(callback => plugins.push(function() {
            callback.call(result, {
                enforcers: parent.context,
                exception: data.exception,
                key: data.key,
                major: data.major,
                minor: data.minor,
                parent: (data.parent && data.parent.result) || null,
                path: data.patch,
                root: data.root.result,
                warn: data.warn
            });
        }));

        // execute plugins
        if (isStart) data.plugins.forEach(plugin => plugin());

        return isStart
            ? new Result(result, data.exception, data.warn)
            : result;
    }

    return F;
}