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
const Parameter     = require('./parameter');
const util          = require('../util');

module.exports = Operation;

const validationsMap = {
    2: {
        parametersIn: ['body', 'formData', 'header', 'path', 'query']
    },
    3: {
        parametersIn: ['cookie', 'header', 'path', 'query']
    }
};

function Operation(enforcer, exception, definition, map) {

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
        return;
    }

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    // build parameters
    if (definition.hasOwnProperty('parameters')) {
        this.parameters = Operation.buildParameters(enforcer, exception, definition, map);
    }

    if (enforcer.version === 3) {
        if (definition.hasOwnProperty('requestBody')) {

        }
    }

    if (definition.hasOwnProperty('responses')) {

    }

}

Operation.buildParameters = function buildParameters(enforcer, exception, definition, map) {
    const result = {};
    validationsMap[enforcer.version].parametersIn.forEach(at => result[at] = { empty: true, map: {}, required: [] });

    if (definition.hasOwnProperty('parameters')) {
        if (!Array.isArray(definition.parameters)) {
            exception('Property "parameters" must be an array');
        } else {
            const paramException = exception.at('parameters');
            definition.parameters.forEach((definition, index) => {
                const child = paramException.at(index);
                const parameter = new Parameter(enforcer, child, definition, map);
                if (!child.hasException) {
                    const data = result[parameter.in];
                    data.empty = false;
                    data.map[parameter.name] = parameter;
                    if (parameter.required) data.required.push(parameter.name);
                }
            });
        }
    }

    return result;
};