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
const util                  = require('./bin/util');

module.exports = enforcer;

function enforcer(definition, options) {
    const exception = Exception('Error building enforcer instance');
    let result;

    // normalize options
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('freeze')) options.freeze = true;
    if (!options.hasOwnProperty('hideWarnings')) options.hideWarnings = false;

    // validate definition and build enforcer
    if (!util.isPlainObject(definition)) {
        exception('Invalid input. Definition must be a plain object');
    } else {
        definition = util.copy(definition);
        const [ error, value, warning ] = definitionValidator(definition);
        if (error) exception(error);
        if (warning && !options.hideWarnings) console.log(warning.toString());
        result = value;
    }

    if (exception.hasException) throw Error(exception.toString());
    if (options.freeze) freeze.deep(result);
    return result;
}

Object.defineProperty(enforcer, 'EMPTY_VALUE', {
    configurable: false,
    writable: false,
    value: util.EMPTY_VALUE
});