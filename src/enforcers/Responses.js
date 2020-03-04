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
const EnforcerRef  = require('../enforcer-ref');

const rxCode = /^[1-5]\d{2}$/;
const rxLocation = /^location$/i;
const rxRange = /^[1-5]X{2}$/;

module.exports = {
    init: function (data) {

    },

    prototype: {},

    validator: function (data) {
        const { major, options } = data;
        const skipCodes = options.exceptionSkipCodes;
        const escalateCodes = options.exceptionEscalateCodes;
        return {
            type: 'object',
            additionalProperties: EnforcerRef('Response', {
                allowed: ({ key }) => key === 'default' || rxCode.test(key) || (major === 3 && rxRange.test(key)),
                errors: ({ exception, key, parent, warn, definition, major, options }) => {
                    if (options.apiSuggestions) {
                        if (rxCode.test(key) && parent && parent.parent && parent.parent.key) {
                            const method = parent.parent.key.toLowerCase();
                            if (method === 'post' && key === '201') {
                                const key = definition.headers
                                    ? Object.keys(definition.headers)
                                        .filter(v => rxLocation.test(v))[0]
                                    : null;
                                if ((!key || !definition.headers[key]) && !skipCodes.WRES001) {
                                    (escalateCodes.WRES001 ? exception : warn).message('A 201 response for a POST request should return a location header (https://tools.ietf.org/html/rfc7231#section-4.3.3) and this is not documented in your OpenAPI document. [WRES001]')
                                }
                            } else if (key === '204') {
                                if (major === 2 && definition.schema && !skipCodes.WRES002) {
                                    (escalateCodes.WRES002 ? exception : warn).message('A 204 response must not contain a body (https://tools.ietf.org/html/rfc7231#section-6.3.5) but this response has a defined schema. [WRES002]')
                                } else if (major === 3 && definition.content && !skipCodes.WRES003) {
                                    (escalateCodes.WRES003 ? exception : warn).message('A 204 response must not contain a body (https://tools.ietf.org/html/rfc7231#section-6.3.5) but this response has a defined content. [WRES003]')
                                }
                            }
                        }
                    }
                }
            }),
            errors: ({ exception, definition }) => {
                if (Object.keys(definition).length === 0 && !exception.hasException) {
                    exception.message('Response object cannot be empty');
                }
            }
        }
    }
};
