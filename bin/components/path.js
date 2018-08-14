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
const Operation     = require('./operation');
const util          = require('../util');

const validationsMap = {
    2: {
        bodyOk: { head: true, options: true, patch: true, post: true, put: true },
        methods: ['delete', 'get', 'head', 'options', 'patch', 'post', 'put'],
        parametersIn: ['body', 'formData', 'header', 'path', 'query']
    },
    3: {
        bodyOk: { head: true, options: true, patch: true, post: true, put: true, trace: true },
        methods: ['delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace'],
        parametersIn: ['cookie', 'header', 'path', 'query']
    }
};


module.exports = Path;

function Path(enforcer, exception, definition, map) {

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
        return;
    }

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    // validate and build parameters
    const parameters = Operation.buildParameters(enforcer, exception, definition, map);

    // build operation objects
    this.methods = [];
    const validations = validationsMap[enforcer.version];
    validations.methods.forEach(method => {
        if (definition.hasOwnProperty(method)) {

            // create the operation
            const operation = new Operation(enforcer, exception.at(method), definition[method], map);

            // add path wide parameters
            Object.keys(parameters).forEach(at => {
                Object.keys(parameters[at].map).forEach(name => {
                    const store = operation.parameters[at];
                    const wideParam = parameters[at].map[name];
                    if (!store.map[name]) {
                        store.map[name] = wideParam;
                        store.empty = false;
                        if (wideParam.required) store.required.push(name);
                    }
                });
            });


            if (operation.requestBody && !validations.bodyOk[method]) {
                exception('Cannot use request body with method: ' + method);
            }

            this[method] = operation;
            this.methods.push(method);
        }
    });

}