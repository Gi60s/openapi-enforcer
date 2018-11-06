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
const RequestBodyEnforcer     = require('../enforcers/request-body');

module.exports = RequestBody;

function RequestBody({ major }) {
    const MediaType     = require('./media-type');

    Object.assign(this, {
        component: RequestBodyEnforcer,
        allowed: major === 3,
        type: 'object',
        properties: {
            description: {
                type: 'string'
            },
            content: {
                type: 'object',
                required: true,
                additionalProperties: MediaType
            },
            required: {
                type: 'boolean',
                default: false
            }
        }
    });
}