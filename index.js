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

module.exports = enforcer;

const freeze                = require('./bin/freeze');
const RefParser             = require('json-schema-ref-parser');
const Super                 = require('./bin/super');

/**
 * Create an enforcer instance.
 * @param {object} definition
 * @param {object} [options]
 * @param {boolean} [options.freeze=true] Whether to freeze the result object to prevent modification.
 * @param {boolean} [options.hideWarnings=false] Set to true to hide warnings from the console.
 * @returns {Promise<OpenApiEnforcer>}
 */
async function enforcer(definition, options) {
    let openapi;
    let warnings;

    // normalize options
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('freeze')) options.freeze = true;
    if (!options.hasOwnProperty('hideWarnings')) options.hideWarnings = false;

    const refParser = new RefParser();
    definition = await refParser.dereference(definition);
    definition = util.copy(definition);

    let exception = Exception('One or more errors exist in the OpenAPI definition');
    const hasSwagger = definition.hasOwnProperty('swagger');
    if (!hasSwagger && !definition.hasOwnProperty('openapi')) {
        exception('Missing required "openapi" or "swagger" property');

    } else {
        const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(definition.swagger || definition.openapi);
        if (!match) {
            exception.at(hasSwagger ? 'swagger' : 'openapi')('Invalid value');

        } else {
            const major = +match[1];
            const validator = major === 2
                ? Enforcer.v2_0.Swagger
                : Enforcer.v3_0.OpenApi;
            [ openapi, exception, warnings ] = validator(definition);
        }
    }

    if (!options.hideWarnings && warnings) console.warn(warnings.toString());
    if (exception && exception.hasException) throw Error(exception.toString());
    if (options.freeze) freeze.deep(openapi);
    return openapi;
}

enforcer.enforcer = enforcer;

enforcer.v2_0 = {
    Contact: Super('2.0', 'Contact'),
    Discriminator: Super('2.0', 'Discriminator'),
    Example: Super('2.0', 'Example'),
    ExternalDocumentation: Super('2.0', 'ExternalDocumentation'),
    Header: Super('2.0', 'Header'),
    Info: Super('2.0', 'Info'),
    Items: Super('2.0', 'Items'),
    License: Super('2.0', 'License'),
    Operation: Super('2.0', 'Operation'),
    Parameter: Super('2.0', 'Parameter'),
    PathItem: Super('2.0', 'PathItem'),
    Paths: Super('2.0', 'Paths'),
    Reference: Super('2.0', 'Reference'),
    Response: Super('2.0', 'Response'),
    Responses: Super('2.0', 'Responses'),
    Schema: Super('2.0', 'Schema'),
    SecurityRequirement: Super('2.0', 'SecurityRequirement'),
    SecurityScheme: Super('2.0', 'SecurityScheme'),
    Swagger: Super('2.0', 'Swagger'),
    Tag: Super('2.0', 'Tag'),
    Xml: Super('2.0', 'Xml')
};

enforcer.v3_0 = {
    Callback: Super('3.0', 'Callback'),
    Components: Super('3.0', 'Components'),
    Contact: Super('3.0', 'Contact'),
    Discriminator: Super('3.0', 'Discriminator'),
    Encoding: Super('3.0', 'Encoding'),
    Example: Super('3.0', 'Example'),
    ExternalDocumentation: Super('3.0', 'ExternalDocumentation'),
    Header: Super('3.0', 'Header'),
    Info: Super('3.0', 'Info'),
    License: Super('3.0', 'License'),
    Link: Super('3.0', 'Link'),
    MediaType: Super('3.0', 'MediaType'),
    OAuthFlow: Super('3.0', 'OAuthFlow'),
    OAuthFlows: Super('3.0', 'OAuthFlows'),
    OpenApi: Super('3.0', 'OpenApi'),
    Operation: Super('3.0', 'Operation'),
    Parameter: Super('3.0', 'Parameter'),
    PathItem: Super('3.0', 'PathItem'),
    Paths: Super('3.0', 'Paths'),
    Reference: Super('3.0', 'Reference'),
    RequestBody: Super('3.0', 'RequestBody'),
    Response: Super('3.0', 'Response'),
    Responses: Super('3.0', 'Responses'),
    Schema: Super('3.0', 'Schema'),
    SecurityRequirement: Super('3.0', 'SecurityRequirement'),
    SecurityScheme: Super('3.0', 'SecurityScheme'),
    Server: Super('3.0', 'Server'),
    ServerVariable: Super('3.0', 'ServerVariable'),
    Tag: Super('3.0', 'Tag'),
    Xml: Super('3.0', 'Xml')
};

enforcer.Value = require('./bin/value');