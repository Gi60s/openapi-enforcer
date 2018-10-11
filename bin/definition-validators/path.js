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
const PathEnforcer     = require('../enforcers/path');

module.exports = PathObject;

function PathObject(data) {
    const Operation = require('./operation');
    const Parameter = require('./parameter');
    const Server = require('./server');
    const { major } = data;

    Object.assign(this, {
        component: PathEnforcer,
        type: 'object',
        properties: {
            delete: Operation,
            description: {
                type: 'string'
            },
            get: Operation,
            head: Operation,
            options: Operation,
            parameters: {
                weight: -1,
                type: 'array',
                items: Parameter,
                errors: Operation.parametersValidation
            },
            patch: Operation,
            post: Operation,
            put: Operation,
            trace: function(data) {
                const operation = new Operation(data);
                operation.allowed = major === 3;
                return operation;
            },
            servers: {
                allowed: major === 3,
                type: 'array',
                items: Server
            },
            summary: {
                type: 'string'
            },
        }
    });
}