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
const definition    = require('../bin/definition-validator').normalize;
const expect        = require('chai').expect;
const Responses     = require('../bin/definition-validators/response');

describe('definitions/responses', () => {

    it('allows a valid definition', () => {
        const [ err ] = definition(2, Responses, {
            default: {
                description: 'hello'
            }
        });
        expect(err).to.be.undefined;
    });

    it('requires a description', () => {
        const [ err ] = definition(2, Responses, {
            default: {}
        });
        expect(err).to.match(/Missing required property: description/);
    });



    describe('content', () => {

        it('is not allowed in v2', () => {
            const [ err ] = definition(2, Responses, {
                default: {
                    description: '',
                    content: {
                        'text/plain': {}
                    }
                }
            });
            expect(err).to.match(/Property not allowed: content/);
        });

        it('is allowed in v3', () => {
            const [ err ] = definition(3, Responses, {
                default: {
                    description: '',
                    content: {
                        'text/plain': {}
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('warns for odd media type', () => {
            const [ , , warning ] = definition(3, Responses, {
                default: {
                    description: '',
                    content: {
                        'foo/plain': {}
                    }
                }
            });
            expect(warning).to.match(/Media type appears invalid/);
        });

    });

    describe('examples', () => {

        it('accepts string', () => {
            const [ err, def ] = definition(2, Responses, {
                default: {
                    description: '',
                    examples: {
                        'text/plain': 'hello'
                    }
                }
            });
            expect(err).to.be.undefined;
            expect(def.default.examples['text/plain']).to.equal('hello')
        });

        it('accepts object', () => {
            const [ err, def ] = definition(2, Responses, {
                default: {
                    description: '',
                    examples: {
                        'application/json': { x: 'hello' }
                    }
                }
            });
            expect(err).to.be.undefined;
            expect(def.default.examples['application/json']).to.deep.equal({ x: 'hello' })
        });

        it('is not allowed for v3', () => {
            const [ err ] = definition(3, Responses, {
                default: {
                    description: 'hello',
                    examples: {}
                }
            });
            expect(err).to.match(/Property not allowed: examples/);
        });

    });

    describe('headers', () => {

        it('accepts a header', () => {
            const [ err ] = definition(3, Responses, {
                '2XX': {
                    description: '',
                    headers: {
                        'x-header': {
                            schema: {
                                type: 'string'
                            }
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('has style limited to "simple"', () => {
            const [ err ] = definition(3, Responses, {
                '2XX': {
                    description: '',
                    headers: {
                        'x-header': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            },
                            style: 'form'
                        }
                    }
                }
            });
            expect(err).to.match(/Value must be "simple"/);
        });

    });

    describe('links', () => {

        it('is not allowed for v2', () => {
            const [ err ] = definition(2, Responses, {
                default: {
                    description: '',
                    links: {}
                }
            });
            expect(err).to.match(/Property not allowed: links/);
        });

        it('is allowed for v3', () => {
            const [ err ] = definition(3, Responses, {
                default: {
                    description: '',
                    links: {
                        abc: {}
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('must meet naming conventions', () => {
            const [ err ] = definition(3, Responses, {
                default: {
                    description: '',
                    links: {
                        '$hi': {}
                    }
                }
            });
            expect(err).to.match(/Invalid key used for link value/);
        });

    });

    describe('schema', () => {

        it('is allowed for v2', () => {
            const [ err ] = definition(2, Responses, {
                default: {
                    description: '',
                    schema: {
                        type: 'string'
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('is not allowed for v3', () => {
            const [ err ] = definition(3, Responses, {
                default: {
                    description: '',
                    schema: {
                        type: 'string'
                    }
                }
            });
            expect(err).to.match(/Property not allowed: schema/);
        });

    });

});