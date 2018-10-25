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
const ComponentRef  = require('../component-ref');

module.exports = {
    init: function (data) {

    },

    prototype: {},

    validator: function ({ major, root }) {
        return {
            type: 'object',
            additionalProperties: {
                type: 'array',
                items: {
                    type: 'string'
                },
                errors: ({ exception, parent, value }) => {
                    if (root.value) {
                        Object.keys(parent.value).forEach(key => {
                            let security;
                            if (major === 2) {
                                security = root.value && root.value.securityDefinitions &&
                                    root.value.securityDefinitions[key];
                                if (!security) {
                                    exception.at(key)('Security requirement name must be defined at the document root under the securityDefinitions');
                                }
                            } else if (major === 3) {
                                security = root.value && root.value.components &&
                                    root.value.components.securitySchemes &&
                                    root.value.components.securitySchemes[key];
                                if (!security) {
                                    exception.at(key)('Security requirement name must be defined at the document root under the components/securitySchemes');
                                }
                            }

                            // for oauth2 check that all scopes requested are defined
                            if (security) {
                                if (security.type === 'oauth2') {
                                    let scopes;
                                    if (major === 2) {
                                        scopes = (security.scopes && Object.keys(security.scopes)) || [];
                                    } else if (major === 3) {
                                        scopes = [];
                                        Object.keys(security.flows || {}).forEach(key => {
                                            const flow = security.flows[key];
                                            if (flow.scopes) scopes.push(...Object.keys(flow.scopes));
                                        })
                                    }

                                    value.forEach(scope => {
                                        if (scopes.includes(scope)) {
                                            const name = major === 2 ? 'securityDefinitions' : 'securitySchemes';
                                            exception.at(key)('Oauth2 scope not defined in ' + name);
                                        }
                                    });
                                } else {
                                    if (value.length > 0) {
                                        exception.at(key)('Security requirement for ' + security.type + ' value must be an empty array');
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }
    }
};
