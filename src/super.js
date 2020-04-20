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

const requestBodyAllowedMethods = { post: true, put: true, options: true, head: true, patch: true };

function Super (version, name, enforcer) {
    if (!enforcer) enforcer = require('./enforcers/' + name);
    return createConstructor(version, name, enforcer);
}

function createConstructor(version, name, enforcer) {
    const callbacks = [];
    const store = new WeakMap();

    // build the named constructor
    const F = new Function('build',
        `const F = function ${name} (definition, refParser, options) {
            if (!(this instanceof F)) return new F(definition, refParser, options)
            return build(this, definition, refParser, options)
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
        return toObjectCopy(this, new Map());
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

    function build (result, definition, refParser, options = {}) {
        const isStart = !definitionValidator.isValidatorState(definition);
        const needsValidation = true;

        // normalize options
        if (!options) options = {};
        if (isStart) options = Object.assign({}, options)
        options.requestBodyAllowedMethods = options.hasOwnProperty('requestBodyAllowedMethods')
            ? Object.assign({}, requestBodyAllowedMethods, options.requestBodyAllowedMethods)
            : requestBodyAllowedMethods;
        options.disablePathNormalization = options.hasOwnProperty('disablePathNormalization') ? !!options.disablePathNormalization : false;
        options.apiSuggestions = options.hasOwnProperty('apiSuggestions') ? !!options.apiSuggestions : true;
        options.production = !!options.production;
        options.exceptionSkipCodes = options.hasOwnProperty('exceptionSkipCodes')
            ? options.exceptionSkipCodes.reduce((p, c) => {
                p[c] = true;
                return p;
            }, {})
            : {};
        options.exceptionEscalateCodes = options.hasOwnProperty('exceptionEscalateCodes')
            ? options.exceptionEscalateCodes.reduce((p, c) => {
                p[c] = true;
                return p;
            }, {})
            : {};

        // validate the definition
        let data;
        if (isStart) {
            const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(version.version);
            if (!refParser) definition = util.copy(definition);
            data = {
                context: version,
                definition,
                defToInstanceMap: new WeakMap(),
                definitionType: util.getDefinitionType(definition),
                exception: Exception('One or more errors exist in the ' + name + ' definition'),
                key: undefined,
                map: new Map(),
                major: +match[1],
                minor: +match[2],
                parent: null,
                patch: +(match[3] || 0),
                plugins: [],
                production: options.production,
                refParser,
                result,
                staticData,
                validator: enforcer.validator,
                warn: Exception('One or more warnings exist in the ' + name + ' definition'),
                options: options
            };
            data.root = data;

        } else {
            data = definition;
            data.staticData = staticData;
            data.validator = enforcer.validator;
            data.result = result;
        }

        const matches = data.map.get(data.definition);
        const existing = matches ? matches.find(v => v.validator === data.validator) : undefined;

        if (existing) {
            data.result = result = existing.value;
            definitionValidator(data)
        } else {
            // store the full set of enforcer data
            store.set(result, data);
            if (data.definition && typeof data.definition === 'object') data.defToInstanceMap.set(data.definition, result);

            if (util.isPlainObject(data.definition)) {
                if (!needsValidation) data.validator = true;
                definitionValidator(data);
            } else {
                data.exception.message('Value must be a plain object');
            }

            // if an exception has occurred then exit now
            if (data.exception.hasException && isStart) return new Result(undefined, data.exception, data.warn);

            // run the init function if present
            if (enforcer.init) enforcer.init.call(result, data);

            // add plugin callbacks to this instance
            const plugins = data.plugins;
            callbacks.forEach(callback => plugins.push(function () {
                callback.call(result, {
                    enforcers: version,
                    exception: data.exception,
                    key: data.key,
                    major: data.major,
                    minor: data.minor,
                    parent: (data.parent && data.parent.result) || null,
                    patch: data.patch,
                    root: data.root.result,
                    warn: data.warn
                });
            }));
        }

        // execute plugins
        if (isStart) {
            while (data.plugins.length) data.plugins.shift()();
        }

        return isStart
            ? new Result(result, data.exception, data.warn)
            : result;
    }

    function toObjectCopy (object, map) {
        if (Array.isArray(object)) {
            const existing = map.get(object);
            if (existing) return existing;
            const result = [];
            map.set(object, result);
            object.forEach(v => {
                result.push(toObjectCopy(v, map));
            });
            return result;
        } else if (util.isPlainObject(object)) {
            const existing = map.get(object);
            if (existing) return existing;
            const result = {};
            map.set(object, result);
            Object.keys(object).forEach(key => {
                result[key] = toObjectCopy(object[key], map);
            });
            return result;
        } else {
            return object;
        }
    }

    return F;
}
