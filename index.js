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
const definitionValidator   = require('./bin/definition-validator');
const freeze                = require('./bin/freeze');
const Super                 = require('./bin/super');

const openapiValidator = definitionValidator.openapi;
const normalizeValidator = definitionValidator.normalize;

module.exports = enforcer;

/**
 * Create an enforcer instance.
 * @param {object} definition
 * @param {object} [options]
 * @param {boolean} [options.freeze=true] Whether to freeze the result object to prevent modification.
 * @param {boolean} [options.hideWarnings=false] Set to true to hide warnings from the console.
 * @returns {Promise<OpenApiEnforcer>}
 */
async function enforcer(definition, options) {
    // normalize options
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('freeze')) options.freeze = true;
    if (!options.hasOwnProperty('hideWarnings')) options.hideWarnings = false;

    // validate definition and build enforcer
    const [ openapi, exception, warnings ] = await enforcer.evaluate(definition);

    if (!options.hideWarnings && warnings) console.warn(warnings.toString());
    if (exception && exception.hasException) throw Error(exception.toString());
    if (options.freeze) freeze.deep(openapi);
    return openapi;
}

enforcer.enforcer = enforcer;

/**
 * Check the definition for errors.
 * @param {object} definition
 * @returns {Promise<string>}
 */
enforcer.errors = function (definition) {
    return openapiValidator(definition).then(({ error }) => error ? error.toString() : '')
};

/**
 * Evaluate a definition and get back errors, warnings, and the enforcer instance as appropriate.
 * @param {string|object} definition
 * @throws {Error} if definition is not a plain object
 * @returns {Promise<EnforcerResult<OpenAPIEnforcer>>}
 */
enforcer.evaluate = function (definition) {
    return openapiValidator(definition);
};

enforcer.v2 = {
    Contact: Super(2, 'Contact'),
    Discriminator: Super(2, 'Discriminator'),
    Example: Super(2, 'Example'),
    ExternalDocumentation: Super(2, 'ExternalDocumentation'),
    Header: Super(2, 'Header'),
    Info: Super(2, 'Info'),
    Items: Super(3, 'Items'),
    License: Super(2, 'License'),
    Operation: Super(2, 'Operation'),
    Parameter: Super(2, 'Parameter'),
    PathItem: Super(2, 'PathItem'),
    Paths: Super(2, 'Paths'),
    Reference: Super(2, 'Reference'),
    Response: Super(2, 'Response'),
    Responses: Super(2, 'Responses'),
    Schema: Super(2, 'Schema'),
    SecurityRequirement: Super(2, 'SecurityRequirement'),
    SecurityScheme: Super(2, 'SecurityScheme'),
    Swagger: Super(2, 'Swagger'),
    Tag: Super(2, 'Tag'),
    Xml: Super(2, 'Xml')
};

enforcer.v3 = {
    Callback: Super(3, 'Callback'),
    Components: Super(3, 'Components'),
    Contact: Super(3, 'Contact'),
    Discriminator: Super(3, 'Discriminator'),
    Encoding: Super(3, 'Encoding'),
    Example: Super(3, 'Example'),
    ExternalDocumentation: Super(3, 'ExternalDocumentation'),
    Header: Super(3, 'Header'),
    Info: Super(3, 'Info'),
    License: Super(3, 'License'),
    Link: Super(3, 'Link'),
    MediaType: Super(3, 'MediaType'),
    OAuthFlow: Super(3, 'OAuthFlow'),
    OAuthFlows: Super(3, 'OAuthFlows'),
    OpenApi: Super(3, 'OpenApi'),
    Operation: Super(3, 'Operation'),
    Parameter: Super(3, 'Parameter'),
    PathItem: Super(3, 'PathItem'),
    Paths: Super(3, 'Paths'),
    Reference: Super(3, 'Reference'),
    RequestBody: Super(3, 'RequestBody'),
    Response: Super(3, 'Response'),
    Responses: Super(3, 'Responses'),
    Schema: Super(3, 'Schema'),
    SecurityRequirement: Super(3, 'SecurityRequirement'),
    SecurityScheme: Super(3, 'SecurityScheme'),
    Server: Super(3, 'Server'),
    ServerVariable: Super(3, 'ServerVariable'),
    Tag: Super(3, 'Tag'),
    Xml: Super(3, 'Xml')
};

enforcer.Schema = function (definition) {

    return normalizeValidator(version, schemaValidator, definition);
};

enforcer.Value = require('./value');