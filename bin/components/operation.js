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
const normalize     = null; //require('../map-normalizer');
const Parameter     = require('./parameter');
const util          = require('../util');

module.exports = Operation;

const parametersIn = {
    2: ['body', 'formData', 'header', 'path', 'query'],
    3: ['cookie', 'header', 'path', 'query']
};
const schemesArray = ["http", "https", "ws", "wss"];
const validationsMap = {
    tags: {
        isArray: true
    },
    summary: {
        type: () => 'string'
    },
    description: {
        type: () => 'string'
    },
    externalDocs: {
        isPlainObject: true
    },
    operationId: {
        type: () => 'string'
    },
    consumes: {
        allowed: (ctx, version) => version === 2,
        isArray: true
    },
    produces: {
        allowed: (ctx, version) => version === 2,
        isArray: true
    },
    parameters: {
        isArray: true
    },
    responses: {
        required: true,
        isPlainObject: true
    },
    requestBody: {
        allowed: (ctx, version) => version === 3,
        required: true
    },
    callbacks: {
        allowed: (ctx, version) => version === 3,
        isPlainObject: true
    },
    schemes: {
        allowed: (ctx, version) => version === 2,
        isArray: true,
        errorsEach: (ctx, version, value) => {
            let result = normalize.expectsString(ctx, version, value);
            if (!result) result = schemesArray.includes(value) ? false : 'Expected one of: ' + schemesArray.join(', ');
            return result;
        }
    },
    deprecated: {
        type: () => 'boolean',
        default: () => false,
    },
    security: {
        isArray: true
    },
    servers: {
        isArray: true
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

    // validate and normalize the definition
    const version = enforcer.version;
    normalize(this, version, exception, definition, validationsMap);

    // if consumes or produces are not specified then check the root for those definitions
    if (version === 2) {

    }

    // build parameters
    if (definition.hasOwnProperty('parameters')) {
        this.parameters = Operation.buildParameters(enforcer, exception, definition, map);
    }

    if (this.requestBody) {
        this.requestBody
    }

    if (definition.hasOwnProperty('responses')) {

    }

}

Operation.buildParameters = function buildParameters(enforcer, exception, definition, map) {
    const result = {};
    parametersIn[enforcer.version].forEach(at => result[at] = { empty: true, map: {}, required: [] });

    if (definition.hasOwnProperty('parameters')) {
        if (!Array.isArray(definition.parameters)) {
            exception('Property "parameters" must be an array');
        } else {
            const paramException = exception.at('parameters');
            definition.parameters.forEach((definition, index) => {
                const child = paramException.at(index);
                const parameter = new Parameter(enforcer, child, definition, map);
                if (!child.hasException || (parameter.in && parameter.name)) {
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