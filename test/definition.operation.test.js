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
const Operation     = require('../bin/definition-validators/operation');
const Path          = require('../bin/definition-validators/path');

describe.only('definitions/operation', () => {
    const responses = { default: { description: '' } };

    describe('callbacks', () => {

        it('is not allowed for v2', () => {
            const [ err ] = definition(2, Operation, {
                callbacks: {},
                responses
            });
            expect(err).to.match(/Property not allowed: callbacks/);
        });

        it('can be an object map of valid callback objects', () => {
            const [ err ] = definition(3, Operation, {
                callbacks: {
                    eventX: {
                        expression: {
                            get: {
                                responses: {
                                    default: {
                                        description: 'ok'
                                    }
                                }
                            }
                        }
                    }
                },
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be an object map of valid callback objects', () => {
            const [ err ] = definition(3, Operation, {
                callbacks: {
                    eventX: {
                        expression: {
                            get: {
                            }
                        }
                    }
                },
                responses
            });
            expect(err).to.match(/Missing required property: responses/);
        });

    });

    describe('consumes', () => {

        it('is not valid for v3', () => {
            const [ err ] = definition(3, Operation, {
                consumes: [],
                responses
            });
            expect(err).to.match(/Property not allowed: consumes/);
        });

        it('can be an array of strings for v2', () => {
            const [ err ] = definition(2, Operation, {
                consumes: ['application/json'],
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ err ] = definition(2, Operation, {
                consumes: {},
                responses
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be an array of strings', () => {
            const [ err ] = definition(2, Operation, {
                consumes: [1],
                responses
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('deprecated', () => {

        it('can be a boolean', () => {
            const [ err, def ] = definition(2, Operation, {
                deprecated: true,
                responses
            });
            expect(def.deprecated).to.equal(true);
        });

        it('must be a boolean', () => {
            const [ err ] = definition(2, Operation, {
                deprecated: 1,
                responses
            });
            expect(err).to.match(/Value must be a boolean/);
        });

        it('defaults to false', () => {
            const [ err, def ] = definition(2, Operation, {
                responses
            });
            expect(def.deprecated).to.equal(false);
        });

    });

    describe('description', () => {

        it('can be a string', () => {
            const [ err ] = definition(2, Operation, {
                description: '',
                responses
            });
            expect(err).to.be.undefined;
        });

        it('cannot be a number', () => {
            const [ err ] = definition(2, Operation, {
                description: 1,
                responses
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('externalDocs', () => {

        it('can be a valid external documentation object', () => {
            const [ err ] = definition(2, Operation, {
                externalDocs: {
                    url: ''
                },
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be a valid external documentation object', () => {
            const [ err ] = definition(2, Operation, {
                externalDocs: {},
                responses
            });
            expect(err).to.match(/Missing required property: url/);
        });

    });

    describe('operationId', () => {

        it('can be a string', () => {
            const [ err ] = definition(2, Operation, {
                operationId: 'a',
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ err ] = definition(2, Operation, {
                operationId: 1,
                responses
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('must be unique among all operations', () => {
            const [ err ] = definition(2, Path, {
                get: {
                    operationId: 'a',
                    responses
                },
                put: {
                    operationId: 'a',
                    responses
                }
            });
            expect(err).to.match(/The operationId must be unique/);
        });

    });

    describe('parameters', () => {

        it('can be an array of parameter objects', () => {
            const [ err ] = definition(2, Operation, {
                parameters: [
                    { name: 'x', in: 'path', required: true, type: 'string' }
                ],
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be an array of parameter objects', () => {
            const [ err ] = definition(2, Operation, {
                parameters: [{}],
                responses
            });
            expect(err).to.match(/Missing required properties: in, name, type/);
        });

        it('cannot have duplicate parameters', () => {
            const [ err ] = definition(2, Operation, {
                parameters: [
                    { name: 'x', in: 'path', required: true, type: 'string' },
                    { name: 'x', in: 'path', required: true, type: 'string' }
                ],
                responses
            });
            expect(err).to.match(/Parameter name must be unique per location/);
        });

        it('can only have one body parameter for v2', () => {
            const [ err ] = definition(2, Operation, {
                parameters: [
                    { name: 'x', in: 'body', required: true, type: 'string' },
                    { name: 'x', in: 'body', required: true, type: 'string' }
                ],
                responses
            });
            expect(err).to.match(/Only one body parameter allowed/);
        });

    });

    describe('produces', () => {

        it('is not valid for v3', () => {
            const [ err ] = definition(3, Operation, {
                produces: [],
                responses
            });
            expect(err).to.match(/Property not allowed: produces/);
        });

        it('can be an array of strings for v2', () => {
            const [ err ] = definition(2, Operation, {
                produces: ['application/json'],
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ err ] = definition(2, Operation, {
                produces: {},
                responses
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be an array of strings', () => {
            const [ err ] = definition(2, Operation, {
                produces: [1],
                responses
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('requestBody', () => {

        it('is not valid for v2', () => {
            const [ err ] = definition(2, Operation, {
                requestBody: {},
                responses
            });
            expect(err).to.match(/Property not allowed: requestBody/);
        });
        
        it('can be a valid request body object for v3', () => {
            const [ err ] = definition(3, Operation, {
                requestBody: {
                    content: {
                        'application/json': {
                        }
                    }
                },
                responses
            });
            expect(err).to.be.undefined;
        });

    });

    describe('responses', () => {

        it('is required', () => {
            const [ err ] = definition(3, Operation, {});
            expect(err).to.match(/Missing required property: responses/);
        });

        it('can be a valid response object', () => {
            const [ err ] = definition(3, Operation, {
                responses
            });
            expect(err).to.be.undefined;
        });

        describe('codes', () => {

            it('default ok', () => {
                const [ err ] = definition(2, Operation, {
                    responses: {
                        default: { description: '' }
                    }
                });
                expect(err).to.be.undefined
            });

            it('200 ok', () => {
                const [ err ] = definition(2, Operation, {
                    responses: {
                        200: { description: '' }
                    }
                });
                expect(err).to.be.undefined
            });

            it('2XX not ok for v2', () => {
                const [ err ] = definition(2, Operation, {
                    responses: {
                        '2XX': { description: '' }
                    }
                });
                expect(err).to.match(/Property not allowed: 2XX/);
            });

            it('2XX ok for v3', () => {
                const [ err ] = definition(3, Operation, {
                    responses: {
                        '2XX': { description: '' }
                    }
                });
                expect(err).to.be.undefined
            });

            it('600 not ok', () => {
                const [ err ] = definition(2, Operation, {
                    responses: {
                        '600': { description: '' }
                    }
                });
                expect(err).to.match(/Property not allowed: 600/);
            });

        });

    });

    describe('schemes', () => {

        it('is not allowed for v3', () => {
            const [ err ] = definition(3, Operation, {
                schemes: [],
                responses
            });
            expect(err).to.match(/Property not allowed: schemes/);
        });

        it('can be an array of valid strings', () => {
            const [ err ] = definition(2, Operation, {
                schemes: ['http'],
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be an array of strings', () => {
            const [ err ] = definition(2, Operation, {
                schemes: [1],
                responses
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('must match enum values', () => {
            const [ err ] = definition(2, Operation, {
                schemes: ['bob'],
                responses
            });
            expect(err).to.match(/Value must be one of: http, https, ws, wss/);
        });

    });

    describe('security', () => {

        it('can be an array', () => {
            const [ err ] = definition(2, Operation, {
                security: [],
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ err ] = definition(2, Operation, {
                security: {},
                responses
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must have a corresponding securityDefinition in v2', () => {
            throw Error('TODO');
        });

        it('must have a corresponding securityScheme in v3', () => {
            throw Error('TODO');
        });

        it('must be an empty array if not OAuth2', () => {
            throw Error('TODO');
        });

        it('must have array values for OAuth2 that are defined in the securityDefinition scope for v2', () => {
            throw Error('TODO');
        });

        it('must have array values for OAuth2 that are defined in the securityScheme scope for v3', () => {
            throw Error('TODO');
        });

        it('can have valid values for OAuth2 for v2', () => {
            throw Error('TODO');
        });

        it('can have valid values for OAuth2 for v3', () => {
            throw Error('TODO');
        });

    });

    describe('servers', () => {

        it('is not allowed in v2', () => {
            const [ err ] = definition(2, Operation, {
                servers: [],
                responses
            });
            expect(err).to.match(/Property not allowed: servers/);
        });

        it('can be an array of valid server objects', () => {
            const [ err ] = definition(3, Operation, {
                servers: [{
                    url: ''
                }],
                responses
            });
            expect(err).to.be.undefined;
        });

        it('must be an array of valid server objects', () => {
            const [ err ] = definition(3, Operation, {
                servers: [{}],
                responses
            });
            expect(err).to.match(/Missing required property: url/);
        });

    });

    describe('summary', () => {

        it('must be a string', () => {
            const [ err ] = definition(2, Operation, {
                summary: 1,
                responses
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('should be less than 120 characters', () => {
            const [ err, , warning ] = definition(2, Operation, {
                summary: '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 ',
                responses
            });
            expect(err).to.be.undefined;
            expect(warning).to.match(/Value should be less than 120 characters/);
        });

    });

    describe('tags', () => {

        it('allows an array of strings', () => {

        });

        it('must be an array', () => {

        });

        it('must be an array of strings', () => {

        });

    });

});