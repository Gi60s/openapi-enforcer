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

module.exports = RequestBody;

const allowedMethods = ['post', 'put', 'options', 'head', 'patch'];

function RequestBody() {
    const MediaType     = require('./media-type');

    Object.assign(this, {
        allowed: ({ major, parent }) => major === 3 && (!parent || allowedMethods.includes(parent.key)),
        type: 'object',
        properties: {
            description: {
                type: 'string'
            },
            content: {
                type: 'object',
                additionalProperties: MediaType
            },
            required: {
                type: 'boolean',
                default: false
            }
        }
    });
}