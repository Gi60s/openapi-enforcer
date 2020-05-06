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

    })

});
