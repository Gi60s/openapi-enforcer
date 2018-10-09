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
const definitionValidator   = require('./bin/definition-validator').openapi;
const Exception             = require('./bin/exception');
const freeze                = require('./bin/freeze');
const Ignored               = require('./ignored');
const util                  = require('./bin/util');

module.exports = enforcer;

/**
 * Create an enforcer instance.
 * @param {object} definition
 * @param {object} [options]
 * @param {boolean} [options.freeze=true] Whether to freeze the result object to prevent modification.
 * @param {boolean} [options.hideWarnings=false] Set to true to hide warnings from the console.
 * @returns {*}
 */
function enforcer(definition, options) {
    // normalize options
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('freeze')) options.freeze = true;
    if (!options.hasOwnProperty('hideWarnings')) options.hideWarnings = false;

    // validate definition and build enforcer
    const [ openapi, exception, warnings ] = enforcer.evaluate(definition);

    if (!options.hideWarnings && warnings) console.warn(warnings.toString());
    if (exception && exception.hasException) throw Error(exception.toString());
    if (options.freeze) freeze.deep(openapi);
    return openapi;
}

enforcer.ignored = Ignored;

enforcer.compile = enforcer;

/**
 * Check the definition for errors.
 * @param {object} definition
 * @throws {Error} if definition is not a plain object
 * @returns {string}
 */
enforcer.errors = function (definition) {
    if (!util.isPlainObject(definition)) {
        throw Error('Invalid input. Definition must be a plain object');
    } else {
        const [ , exception ] = definitionValidator(definition);
        return exception ? exception.toString() : '';
    }
};

/**
 * Evaluate a definition and get back errors, warnings, and the enforcer instance as appropriate.
 * @param {object} definition
 * @throws {Error} if definition is not a plain object
 * @returns {EnforcerResult<OpenAPIEnforcer>}
 */
enforcer.evaluate = function (definition) {
    if (!util.isPlainObject(definition)) {
        throw Error('Invalid input. Definition must be a plain object');
    } else {
        definition = util.copy(definition);
        return definitionValidator(definition);
    }
};