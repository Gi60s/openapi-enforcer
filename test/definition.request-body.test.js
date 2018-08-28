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
const definition    = require('../bin/definition/index').normalize;
const expect        = require('chai').expect;
const RequestBody   = require('../bin/definition/request-body');

describe.only('definitions/request-body', () => {

    it('allows a valid definition', () => {
        const [ err ] = definition(3, RequestBody, {
            content: {
                'application/json': {

                }
            }
        });
        expect(err).to.be.undefined;
    });

    describe('encoding', () => {

        it('is allowed with multipart mimetype', () => {
            const [ err ] = definition(3, RequestBody, {
                content: {
                    'multipart/mixed': {
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        },
                        encoding: {
                            a: {
                                contentType: 'text/plain'
                            }
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('is allowed with application/x-www-form-urlencoded mimetype', () => {
            const [ err ] = definition(3, RequestBody, {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        },
                        encoding: {
                            a: {
                                contentType: 'text/plain'
                            }
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('is not allowed for other mime types', () => {
            const [ err ] = definition(3, RequestBody, {
                content: {
                    'text/plain': {
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        },
                        encoding: {
                            a: {
                                contentType: 'text/plain'
                            }
                        }
                    }
                }
            });
            expect(err).to.match(/Property not allowed: encoding/);
        });

        describe('allowReserved', () => {

            it('is allowed with multipart mimetype', () => {
                const [ err ] = definition(3, RequestBody, {
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string' }
                                }
                            },
                            encoding: {
                                a: {
                                    contentType: 'text/plain',
                                    allowReserved: true
                                }
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('defaults to false', () => {
                const [ err, def ] = definition(3, RequestBody, {
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string' }
                                }
                            },
                            encoding: {
                                a: {
                                    contentType: 'text/plain'
                                }
                            }
                        }
                    }
                });
                expect(def.content['multipart/mixed'].encoding.a.allowReserved).to.equal(false);
            });

            it.only('is ignored for application/x-www-form-urlencoded mimetype', () => {
                const [ err, def ] = definition(3, RequestBody, {
                    content: {
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string' }
                                }
                            },
                            encoding: {
                                a: {
                                    contentType: 'text/plain',
                                    allowReserved: true
                                }
                            }
                        }
                    }
                });
                expect(def.content['application/x-www-form-urlencoded'].encoding.a).to.deep.equal({ contentType: 'text/plain' });
            });

        });

    });

});