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
const PathsObject   = require('./components/paths');
const util          = require('./util');

const rxSemvar = /^(\d+)\.(\d+)\.(\d+)$/;

module.exports = Enforcer;

function Enforcer(exception, definition) {
    const map = new WeakMap();
    if (!util.isPlainObject(definition)) {
        exception('Invalid input. Definition must be a plain object');

    } else if (!definition.hasOwnProperty('swagger') && !definition.hasOwnProperty('openapi')) {
        exception('Missing required property "swagger" or "openapi"');

    } else if (definition.hasOwnProperty('swagger')) {
        if (definition.swagger !== '2.0') {
            exception('Property "swagger" must have value "2.0"')

        } else {
            common(this, 2, exception, definition, map);
            if (definition.hasOwnProperty('definitions')) {
                this.definitions = util.mapObject(definition.definitions, (definition, key) => {
                    return new Schema(2, exception.at('definitions/' + key), definition, map);
                });
            }
            if (definition.hasOwnProperty('parameters')) {
                this.parameters = util.mapObject(definition.definitions, (definition, key) => {
                    return new Parameter(2, exception.at('parameters/' + key), definition, map);
                });
            }
            if (definition.hasOwnProperty('responses')) {
                this.parameters = util.mapObject(definition.responses, (definition, key) => {
                    return new Response(2, exception.at('responses/' + key), definition, map);
                });
            }
        }

    } else if (definition.hasOwnProperty('openapi')) {
        const match = rxSemvar.exec(definition.openapi);
        if (!match || match[1] !== '3') {
            exception('OpenAPI version ' + definition.openapi + ' not supported');
        } else {
            common(this, 3, exception, definition, map);
            if (definition.hasOwnProperty('components')) {
                if (!util.isPlainObject(definition.components)) {
                    exception('Property "components" must be an object');
                } else {
                    const components = definition.components;
                    this.components = {};
                    if (components.hasOwnProperty('headers')) {
                        this.components.parameters = util.mapObject(components.headers, (definition, key) => {
                            return new Header(3, exception.at('components/headers/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('parameters')) {
                        this.components.parameters = util.mapObject(components.parameters, (definition, key) => {
                            return new Parameter(3, exception.at('components/parameters/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('responses')) {
                        this.parameters = util.mapObject(definition.responses, (definition, key) => {
                            return new Response(3, exception.at('components/responses/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('requestBodies')) {
                        this.parameters = util.mapObject(definition.responses, (definition, key) => {
                            return new RequestBody(3, exception.at('components/requestBodies/' + key), definition, map);
                        });
                    }
                    if (components.hasOwnProperty('schemas')) {
                        this.components.schemas = util.mapObject(components.schemas, (definition, key) => {
                            return new Schema(3, exception.at('components/schemas/' + key), definition, map);
                        });
                    }
                }
            }
        }
    }

}

Enforcer.prototype.request = function(req) {
    const data = this.paths.findMatch(req.path);
    if (!data) return;

    const params = {};
    const result = { params: params, res: null };
    params.path = data.params;

    // TODO: process the request parameters and build a response helper
};

function common(context, version, exception, definition, map) {
    if (!definition.hasOwnProperty('paths')) {
        exception('Missing required property "paths"');
    } else {
        context.paths = new PathsObject(version, exception.at('paths'), definition.paths, map);
    }
}