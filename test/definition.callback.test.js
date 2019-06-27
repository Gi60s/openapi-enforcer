/**
 *  @license
 *    Copyright 2019 Brigham Young University
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
const Enforcer      = require('../index');
const expect        = require('chai').expect;

describe('definition/callback', () => {
    const callbackDef = {
        '{$request.body#/successUrl}': {
            post: {
                requestBody: {
                    content: {
                        'text/plain': {
                            schema: { type: 'string' }
                        }
                    }
                },
                responses: {
                    '200': { description: 'OK' }
                }
            }
        }
    };

    const pathDef = {
        post: {
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                successUrl: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'OK' }
            },
            callbacks: {
                inProgress: callbackDef
            }
        }
    };

    it('can exist within a path item', () => {
        const [ pathItem, err ] = new Enforcer.v3_0.PathItem(pathDef);
        expect(err).to.equal(undefined);
        expect(pathItem.post.callbacks.inProgress).to.be.instanceof(Enforcer.v3_0.Callback);
    });

    it('can be exist within the components section', () => {
        const [ , err ] = new Enforcer.v3_0.OpenApi({
            openapi: '3.0.0',
            info: { title: '', version: '' },
            paths: {},
            components: {
                callbacks: {
                    myCallback: callbackDef
                }
            }
        });
        expect(err).to.equal(undefined);
    })

});
