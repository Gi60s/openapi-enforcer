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
const Enforcer = require('../');
const { expect } = require('chai');

describe('definition/response', () => {

    describe('v2', () => {

        it('will produce an exception for an invalid example', () => {
            const [ , err ] = Enforcer.v2_0.Response({
                description: '',
                schema: {
                    type: 'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'string' }
                    }
                },
                examples: {
                    'application/json': {
                        a: '1',
                        b: '2'
                    }
                }
            });
            expect(err).to.match(/Expected a number. Received: "1"/)
        });

        it('will allow a valid example', () => {
            const [ res ] = Enforcer.v2_0.Response({
                description: '',
                schema: {
                    type: 'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'string' }
                    }
                },
                examples: {
                    'application/json': {
                        a: 1,
                        b: '2'
                    }
                }
            });
            expect(res).not.to.be.undefined
        });

        it('will suggest that the location header is provided for a 201 post response', () => {
            const [ value, err, warning ] = Enforcer.v2_0.PathItem({
                post: {
                    responses: {
                        201: {
                            description: ''
                        }
                    }
                }
            });
            expect(warning).to.match(/A 201 response for a POST request should return a location header/)
        });

        it('will not suggest that the location header is provided for a 201 post response if it is included', () => {
            const [ value, err, warning ] = Enforcer.v2_0.PathItem({
                post: {
                    responses: {
                        201: {
                            description: '',
                            headers: { location: { type: 'string' } }
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
            expect(warning).to.be.undefined;
        });

        it('will suggest that a 204 response should have no schema', () => {
            const [ value, err, warning ] = Enforcer.v2_0.PathItem({
                post: {
                    responses: {
                        204: {
                            description: '',
                            schema: { type: 'string' }
                        }
                    }
                }
            });
            expect(warning).to.match(/A 204 response must not contain a body/)
        });

    });

    describe('v3', () => {

        it('will suggest that the location header is provided for a 201 post response', () => {
            const [ value, err, warning ] = Enforcer.v3_0.PathItem({
                post: {
                    responses: {
                        201: {
                            description: ''
                        }
                    }
                }
            });
            expect(warning).to.match(/A 201 response for a POST request should return a location header/)
        });

        it('will not suggest that the location header is provided for a 201 post response if it is included', () => {
            const [ value, err, warning ] = Enforcer.v3_0.PathItem({
                post: {
                    responses: {
                        201: {
                            description: '',
                            headers: {
                                location: {
                                    description: '',
                                    schema: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
            expect(warning).to.be.undefined;
        });

        it('will suggest that a 204 response should have no schema', () => {
            const [ value, err, warning ] = Enforcer.v3_0.PathItem({
                post: {
                    responses: {
                        204: {
                            description: '',
                            content: {
                                'application/json': {
                                    schema: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            });
            expect(warning).to.match(/A 204 response must not contain a body/)
        });
    });

});
