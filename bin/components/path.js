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
const Operation = require('./operation');
const Parameter = require('./parameter');
const util      = require('../util');

module.exports = Path;

const validationsMap = {
    2: {
        methods: ['delete', 'get', 'head', 'options', 'patch', 'post', 'put']
    },
    3: {
        methods: ['delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace']
    }
};

function Path(version, exception, definition, map) {

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
    } else {
        const validations = validationsMap[version];
        let body;

        // build parameters
        if (definition.hasOwnProperty('parameters')) {
            if (!Array.isArray(definition.parameters)) {
                exception('Property "parameters" must be an array');
            } else {
                this.parameters = version === 2
                    ? { header: {}, path: {}, query: {} }
                    : { cookie: {}, header: {}, path: {}, query: {} };

                definition.parameters.forEach((definition, index) => {
                    const child = exception.at(index);
                    const parameter = new Parameter(version, child, definition, map);
                    if (!child.hasException) {
                        if (version === 2 && (parameter.in === 'body' || parameter.in === 'formData')) {
                            body = parameter;
                        } else {
                            this.parameters[parameter.in][parameter.name] = parameter;
                        }

                    }
                });
            }
        }

        // build body
        if (version === 2) {
            if (body) {
                // TODO
            }
        } else if (version === 3) {
            // TODO
        }

        // build operation objects
        validations.methods.forEach(method => {
            if (definition.hasOwnProperty(method)) {
                this[method] = new Operation(version, exception.at(method), definition[method], map);
            }
        });
    }

}