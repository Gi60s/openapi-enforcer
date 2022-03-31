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
const Enforcer = require('../index');
const expect = require('chai').expect;

describe('enforcer/openapi', () => {

    describe('path', () => {
        const paths = {
            '/abc': {
                get: {
                    responses: {
                        200: { description: '' }
                    }
                },
                post: {
                    responses: {
                        201: { description: '' }
                    }
                }
            },
            '/user/{id}': {
                get: {
                    parameters: [{ name: 'id', in: 'path', required: true, type: 'integer', minimum: 0 }],
                    responses: {
                        200: { description: '' }
                    }
                }
            }
        };

        it('identifies correct path', () => {
            const [ openapi ] = Enforcer.v2_0.Swagger({
                swagger: '2.0',
                info: { title: '', version: '1.0.0' },
                paths
            });
            const [ path ] = openapi.path('get', '/user/1234');
            expect(path.operation.enforcerData.parent.key).to.equal('/user/{id}')
        });

        it('identifies correct method', () => {
            const [ openapi ] = Enforcer.v2_0.Swagger({
                swagger: '2.0',
                info: { title: '', version: '1.0.0' },
                paths
            });
            const [ path ] = openapi.path('post', '/abc');
            expect(path.operation.responses[201]).not.to.equal(undefined);
        });

        it('deserializes path parameters', () => {
            const [ openapi ] = Enforcer.v2_0.Swagger({
                swagger: '2.0',
                info: { title: '', version: '1.0.0' },
                paths
            });
            const [ path ] = openapi.path('get', '/user/1234');
            expect(path.params.id).to.equal(1234);
        });

        it('validates path parameters', () => {
            const [ openapi ] = Enforcer.v2_0.Swagger({
                swagger: '2.0',
                info: { title: '', version: '1.0.0' },
                paths
            });
            const [ , err ] = openapi.path('get', '/user/-1234');
            expect(err).to.match(/Expected integer to be greater than or equal to 0/);
        });

        it('can distinguish between paths with mathing variable placement and different operations', () => {
            const [ openapi, error ] = Enforcer.v2_0.Swagger({
                swagger: '2.0',
                info: { title: '', version: '1.0.0' },
                paths: {
                    '/{x}': { // distinct path due to different variable name
                        get: { // not a collision due to different method
                            parameters: [{ name: 'x', in: 'path', required: true, type: 'string' }],
                            responses: { 200: { description: 'ok' } }
                        }
                    },
                    '/{y}': { // distinct path due to different variable name
                        put: { // not a collision due to different method
                            parameters: [{ name: 'y', in: 'path', required: true, type: 'string' }],
                            responses: { 200: { description: 'ok' } }
                        }
                    }
                }
            });
            expect(error).to.equal(undefined)

            const [ getPath ] = openapi.path('get', '/123');
            expect(getPath.params.x).to.equal('123');

            const [ putPath ] = openapi.path('put', '/abc');
            expect(putPath.params.y).to.equal('abc');
        })

        describe('path case sensitivity', () => {
            const config = require('../index').config
            let defaultCaseSensitivity

            before(() => {
                defaultCaseSensitivity = config.useCaseSensitivePaths
            })

            after(() => {
                config.useCaseSensitivePaths = defaultCaseSensitivity
            })

            function init (useCaseSensitivePaths) {
                config.useCaseSensitivePaths = useCaseSensitivePaths

                return Enforcer.v2_0.Swagger({
                    swagger: '2.0',
                    info: { title: '', version: '1.0.0' },
                    paths: {
                        '/foo/Bar/baz': {
                            get: {
                                responses: { 200: { description: 'ok' } }
                            }
                        },
                        '/foo/bar/baz': {
                            get: {
                                responses: { 200: { description: 'ok' } }
                            }
                        }
                    }
                });
            }

            it('can have case sensitive paths', async () => {
                config.useCaseSensitivePaths = true
                const [ openapi ] = Enforcer.v2_0.Swagger({
                    swagger: '2.0',
                    info: { title: '', version: '1.0.0' },
                    paths: {
                        '/foo/Bar/baz': {
                            get: {
                                responses: { 200: { description: 'ok' } }
                            }
                        },
                        '/foo/bar/baz': {
                            get: {
                                responses: { 200: { description: 'ok' } }
                            }
                        }
                    }
                });
    
                const [ first ] = openapi.path('get', '/foo/Bar/baz');
                expect(first.pathKey).to.equal('/foo/Bar/baz');
    
                const [ second ] = openapi.path('get', '/foo/bar/baz');
                expect(second.pathKey).to.equal('/foo/bar/baz');
            })
    
            it('can have case insensitive paths', async () => {
                config.useCaseSensitivePaths = false
                const [ openapi ] = Enforcer.v2_0.Swagger({
                    swagger: '2.0',
                    info: { title: '', version: '1.0.0' },
                    paths: {
                        '/foo/bar/baz': {
                            get: {
                                responses: { 200: { description: 'ok' } }
                            }
                        }
                    }
                });
    
                const [ first ] = openapi.path('get', '/foo/bar/baz');
                expect(first.pathKey).to.equal('/foo/bar/baz');
    
                const [ second ] = openapi.path('get', '/FOO/Bar/Baz');
                expect(second.pathKey).to.equal('/foo/bar/baz');
            })

        })

    });

    describe('request', () => {

        describe('query parameters', () => {
            let openapi

            before(() => {
                let error
                [ openapi, error ] = Enforcer.v3_0.OpenApi({
                    openapi: '3.0.0',
                    info: { title: '', version: '' },
                    paths: {
                        '/': {
                            get: {
                                parameters: [{name: 'q', in: 'query', schema: {type: 'string'}}],
                                responses: {
                                    '200': {
                                        description: ''
                                    }
                                }
                            }
                        }
                    }
                })
                if (error) throw error
            })

            it('allows query parameter in path', () => {
                const [ req ] = openapi.request({ method: 'get', path: '/?q=hello' })
                expect(req.query).to.deep.equal({ q: 'hello' })
            });

            it('allows query parameter object', () => {
                const [ req ] = openapi.request({ method: 'get', path: '/', query: { q: 'hello' } })
                expect(req.query).to.deep.equal({ q: 'hello' })
            });

            it('ignores query parameter object if path includes query string', () => {
                const [ req ] = openapi.request({ method: 'get', path: '/?q=one', query: { q: 'two' } })
                expect(req.query).to.deep.equal({ q: 'one' })
            });

        });

        describe('required readOnly properties', () => {
            it('does not require readOnly properties when making a request', async () => {
                const definition = {
                    openapi: '3.0.0',
                    info: { title: '', version: '' },
                    paths: {
                        '/': {
                            post: {
                                requestBody: {
                                    content: {
                                        'application/json': {
                                            schema: {
                                                $ref: '#/components/schemas/Pet'
                                            }
                                        }
                                    }
                                },
                                responses: {
                                    200: { description: '' }
                                }
                            }
                        }
                    },
                    components: {
                        schemas: {
                            Pet: {
                                type: 'object',
                                required: ['id', 'name'],
                                properties: {
                                    id: {
                                        type: 'string',
                                        readOnly: true
                                    },
                                    name: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }

                const openapi = await Enforcer(definition)
                const result = openapi.request({
                    method: 'post',
                    path: '/',
                    body: { name: 'Bob' }
                })
                console.log(result.error)
                expect(result.error).to.be.undefined
            })
        })

    })

});
