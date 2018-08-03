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
const util      = require('../util');

module.exports = Operation;

const validationsMap = {
    2: {
        methods: ['delete', 'get', 'head', 'options', 'patch', 'post', 'put']
    },
    3: {
        methods: ['delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace']
    }
};

function Operation(version, enforcer, exception, definition, map) {

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
    } else {

    }

}