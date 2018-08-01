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
const path      = require('path');
const util      = require('./util');

util.deepFreeze(validationsMap);

module.exports = function(enforcer, major, definition) {
    const version = util.tryRequire(path.resolve(__dirname, 'v' + major));
    if (!version) throw Error('The Open API definition version is either invalid or unsupported: ' + value);

    const result = Object.assign({}, version, {
        enforcer: enforcer,
        definition: definition
    });
    util.deepFreeze(result);

    return result;
};