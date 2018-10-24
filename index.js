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
const schemaValidator       = require('./bin/definition-validators/schema');

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
    Schema: require('./bin/enforcers/schema')
}

enforcer.Schema = function (definition) {

    return normalizeValidator(version, schemaValidator, definition);
};

enforcer.Value = require('./value');

function component(version, name) {
    const component = require('./bin/enforcers/' + name);
    return function (definition) {

    }
}