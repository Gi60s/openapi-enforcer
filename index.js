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

const dataTypeFormats       = require('./bin/data-type-formats');
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

const v2_0 = enforcer.v2_0 = {};
Object.defineProperty(v2_0, 'version', { value: '2.0' });
Object.assign(v2_0, {
    Contact: Super(v2_0, 'Contact'),
    Discriminator: Super(v2_0, 'Discriminator'),
    Example: Super(v2_0, 'Example'),
    ExternalDocumentation: Super(v2_0, 'ExternalDocumentation'),
    Header: Super(v2_0, 'Header'),
    Info: Super(v2_0, 'Info'),
    Items: Super(v2_0, 'Items'),
    License: Super(v2_0, 'License'),
    Operation: Super(v2_0, 'Operation'),
    Parameter: Super(v2_0, 'Parameter'),
    PathItem: Super(v2_0, 'PathItem'),
    Paths: Super(v2_0, 'Paths'),
    Reference: Super(v2_0, 'Reference'),
    Response: Super(v2_0, 'Response'),
    Responses: Super(v2_0, 'Responses'),
    Schema: Super(v2_0, 'Schema'),
    SecurityRequirement: Super(v2_0, 'SecurityRequirement'),
    SecurityScheme: Super(v2_0, 'SecurityScheme'),
    Swagger: Super(v2_0, 'Swagger'),
    Tag: Super(v2_0, 'Tag'),
    Xml: Super(v2_0, 'Xml')
});

const v3_0 = enforcer.v3_0 = {};
Object.defineProperty(v3_0, 'version', { value: '3.0' });
Object.assign(v3_0, {
    Callback: Super(v3_0, 'Callback'),
    Components: Super(v3_0, 'Components'),
    Contact: Super(v3_0, 'Contact'),
    Discriminator: Super(v3_0, 'Discriminator'),
    Encoding: Super(v3_0, 'Encoding'),
    Example: Super(v3_0, 'Example'),
    ExternalDocumentation: Super(v3_0, 'ExternalDocumentation'),
    Header: Super(v3_0, 'Header'),
    Info: Super(v3_0, 'Info'),
    License: Super(v3_0, 'License'),
    Link: Super(v3_0, 'Link'),
    MediaType: Super(v3_0, 'MediaType'),
    OAuthFlow: Super(v3_0, 'OAuthFlow'),
    OAuthFlows: Super(v3_0, 'OAuthFlows'),
    OpenApi: Super(v3_0, 'OpenApi'),
    Operation: Super(v3_0, 'Operation'),
    Parameter: Super(v3_0, 'Parameter'),
    PathItem: Super(v3_0, 'PathItem'),
    Paths: Super(v3_0, 'Paths'),
    Reference: Super(v3_0, 'Reference'),
    RequestBody: Super(v3_0, 'RequestBody'),
    Response: Super(v3_0, 'Response'),
    Responses: Super(v3_0, 'Responses'),
    Schema: Super(v3_0, 'Schema'),
    SecurityRequirement: Super(v3_0, 'SecurityRequirement'),
    SecurityScheme: Super(v3_0, 'SecurityScheme'),
    Server: Super(v3_0, 'Server'),
    ServerVariable: Super(v3_0, 'ServerVariable'),
    Tag: Super(v3_0, 'Tag'),
    Xml: Super(v3_0, 'Xml')
});

enforcer.Value = require('./bin/value');


enforcer.v2_0.Schema.defineDataTypeFormat('string', 'binary', dataTypeFormats.binary);
enforcer.v2_0.Schema.defineDataTypeFormat('string', 'byte', dataTypeFormats.byte);
enforcer.v2_0.Schema.defineDataTypeFormat('string', 'date', dataTypeFormats.date);
enforcer.v2_0.Schema.defineDataTypeFormat('string', 'date-time', dataTypeFormats.dateTime);

enforcer.v3_0.Schema.defineDataTypeFormat('string', 'binary', dataTypeFormats.binary);
enforcer.v3_0.Schema.defineDataTypeFormat('string', 'byte', dataTypeFormats.byte);
enforcer.v3_0.Schema.defineDataTypeFormat('string', 'date', dataTypeFormats.date);
enforcer.v3_0.Schema.defineDataTypeFormat('string', 'date-time', dataTypeFormats.dateTime);