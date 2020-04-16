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
const EnforcerRef   = require('../enforcer-ref');
const RequestBody   = require('./RequestBody');
const util          = require('../util');

const rxContentTypeMime = /(?:^multipart\/)|(?:^application\/x-www-form-urlencoded$)/;

module.exports = {
    init: function (data) {
        const { exception, plugins } = data;
        plugins.push(() => {
            util.validateExamples(this, exception);
        });
    },

    prototype: {},

    validator: function (data) {
        const escalateCodes = data.options.exceptionEscalateCodes;
        const skipCodes = data.options.exceptionSkipCodes;
        return {
            type: 'object',
            properties: {
                encoding: {
                    type: 'object',
                    allowed: ({ parent }) => parent.parent.parent.validator === RequestBody.validator,
                    additionalProperties: EnforcerRef('Encoding'),
                    errors: ({ exception, parent }) => {
                        if (!rxContentTypeMime.test(parent.key)) {
                            exception.message('Mime type must be multipart/* or application/x-www-form-urlencoded. Found: ' + parent.key);
                        }
                    }
                },
                example: { allowed: true, freeForm: true },
                examples: {
                    type: 'object',
                    additionalProperties: EnforcerRef('Example')
                },
                schema: EnforcerRef('Schema')
            },
            errors: ({ parent, key, exception, warn }) => {
                if (parent && parent.key === 'content') {
                    if (!module.exports.rx.mediaType.test(key) && !skipCodes.WMED001) {
                        (escalateCodes.WMED001 ? exception : warn).message('Media type appears invalid. [WMED001]');
                    }
                }
            }
        }
    },

    rx: {
        mediaType: /^(?:\*|(application|audio|example|font|image|message|model|multipart|text|video|x-\S+))\/(?:\*|(?:([\w.\-]+)\+)?([\w.\-]+)(?:; *(.+))?)$/
    }
};
