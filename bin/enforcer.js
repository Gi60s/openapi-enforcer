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
const Exception     = require('./exception');
const Paths         = require('./components/paths');
const Parameter     = require('./components/parameter');
const Schema        = require('./components/schema');
const util          = require('./util');

const rxSemver = /^(\d+)\.(\d+)\.(\d+)$/;

module.exports = Enforcer;

function Enforcer(definition) {
    const exception = Exception('Error building enforcer instance');

    const map = new WeakMap();
    if (!util.isPlainObject(definition)) {
        exception('Invalid input. Definition must be a plain object');

    } else if (!definition.hasOwnProperty('swagger') && !definition.hasOwnProperty('openapi')) {
        exception('Missing required property "swagger" or "openapi"');

    } else if (definition.hasOwnProperty('swagger')) {
        if (definition.swagger !== '2.0') {
            exception('Property "swagger" must have value "2.0"')

        } else {
            common(2, this, exception, definition, map);
            if (definition.hasOwnProperty('definitions')) {
                this.definitions = util.mapObject(definition.definitions, (definition, key) => {
                    return new Schema(2, this, exception.at('definitions/' + key), definition, map);
                });
            }
            if (definition.hasOwnProperty('parameters')) {
                this.parameters = util.mapObject(definition.definitions, (definition, key) => {
                    return new Parameter(2, this, exception.at('parameters/' + key), definition, map);
                });
            }
            if (definition.hasOwnProperty('responses')) {
                this.parameters = util.mapObject(definition.responses, (definition, key) => {
                    // TODO
                    return new Response(2, this, exception.at('responses/' + key), definition, map);
                });
            }
        }

    } else if (definition.hasOwnProperty('openapi')) {
        const match = rxSemver.exec(definition.openapi);
        if (!match || match[1] !== '3') {
            exception('OpenAPI version ' + definition.openapi + ' not supported');
        } else {
            common(3, this, exception, definition, map);
            if (definition.hasOwnProperty('components')) {
                if (!util.isPlainObject(definition.components)) {
                    exception('Property "components" must be an object');
                } else {
                    const components = definition.components;
                    this.components = {};
                    if (components.hasOwnProperty('headers')) {
                        this.components.parameters = util.mapObject(components.headers, (definition, key) => {
                            // TODO
                            return new Header(3, this, exception.at('components/headers/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('parameters')) {
                        this.components.parameters = util.mapObject(components.parameters, (definition, key) => {
                            return new Parameter(3, this, exception.at('components/parameters/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('responses')) {
                        this.parameters = util.mapObject(definition.responses, (definition, key) => {
                            // TODO
                            return new Response(3, this, exception.at('components/responses/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('requestBodies')) {
                        this.parameters = util.mapObject(definition.responses, (definition, key) => {
                            // TODO
                            return new RequestBody(3, this, exception.at('components/requestBodies/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('schemas')) {
                        this.components.schemas = util.mapObject(components.schemas, (definition, key) => {
                            return new Schema(3, this, exception.at('components/schemas/' + key), definition, map);
                        });
                    }
                }
            }
        }
    }

    if (exception.hasException) throw new Error(exception.toString());
}

Enforcer.prototype.request = function(req) {
    const data = this.paths.findMatch(req.path);
    if (!data) return;

    const params = {};
    const result = { params: params, res: null };
    params.path = data.params;

    // TODO: process the request parameters and build a response helper
};

function common(version, context, exception, definition, map) {
    if (!definition.hasOwnProperty('paths')) {
        exception('Missing required property "paths"');
    } else {
        context.paths = new Paths(version, context, exception.at('paths'), definition.paths, map);
    }
}