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
const expect        = require('chai').expect;
const Enforcer      = require('../index');

describe('request', () => {
    let enforcer;

    before(() => {
        enforcer = new Enforcer({
            swagger: '2.0',
            paths: {
                '/': {
                    get: {},
                    post: {
                        parameters: [
                            { name: 'body', in: 'body', schema: { type: 'number' }}
                        ],
                        responses: {
                            '200': {
                                schema: {
                                    type: 'number'
                                }
                            }
                        }
                    }
                },
                '/num/{num}': {
                    get: {
                        parameters: [
                            { name: 'num', in: 'path', required: true, type: 'integer' }
                        ]
                    }
                }
            }
        });
    });

    describe('input validation', () => {

        describe('parameter', () => {

            it('string ok', () => {
                expect(() => enforcer.request('/')).not.to.throw();
            });

            it('object ok', () => {
                expect(() => enforcer.request({})).not.to.throw();
            });

            it('null throws error', () => {
                expect(() => enforcer.request(null)).to.throw();
            });

            it('number throws error', () => {
                expect(() => enforcer.request(5)).to.throw(/must be a string or an object/i);
            });

        });

        describe('body', () => {

            it('string ok', () => {
                expect(() => enforcer.request({ body: '' })).not.to.throw();
            });

            it('object ok', () => {
                expect(() => enforcer.request({ body: {} })).not.to.throw();
            });

            it('null ok', () => {
                expect(() => enforcer.request({ body: null })).not.to.throw();
            });

            it('number ok', () => {
                enforcer.request({ body: 5, method: 'post' });
                expect(() => enforcer.request({ body: 5, method: 'post' })).not.to.throw();
            });

        });

        describe('cookies', () => {

            it('undefined ok', () => {
                expect(() => enforcer.request({})).not.to.throw();
            });

            it('object ok', () => {
                expect(() => enforcer.request({ cookies: {} })).not.to.throw();
            });

            it('null throws error', () => {
                expect(() => enforcer.request({ cookies: null })).to.throw();
            });

            it('string throws error', () => {
                expect(() => enforcer.request({ cookies: '' })).to.throw();
            });

        });

        describe('headers', () => {

            it('undefined ok', () => {
                expect(() => enforcer.request({})).not.to.throw();
            });

            it('object ok', () => {
                expect(() => enforcer.request({ headers: {} })).not.to.throw();
            });

            it('null throws error', () => {
                expect(() => enforcer.request({ headers: null })).to.throw();
            });

            it('string throws error', () => {
                expect(() => enforcer.request({ headers: '' })).to.throw();
            });

        });

        describe('path', () => {

            it('undefined ok', () => {
                expect(() => enforcer.request({})).not.to.throw();
            });

            it('string ok', () => {
                expect(() => enforcer.request({ path: '' })).not.to.throw();
            });

            it('path not defined', () => {
                expect(() => enforcer.request({ path: '/hello' })).to.throw(/path not found/i);
            });

            it('null throws error', () => {
                expect(() => enforcer.request({ path: null })).to.throw();
            });

            it('object throws error', () => {
                expect(() => enforcer.request({ path: {} })).to.throw();
            });

        });

        describe('method', () => {

            it('undefined ok', () => {
                expect(() => enforcer.request({})).not.to.throw();
            });

            it('string ok', () => {
                expect(() => enforcer.request({ method: 'get' })).not.to.throw();
            });

            it('method not defined', () => {
                expect(() => enforcer.request({ method: 'delete' })).to.throw(/method not allowed/i);
            });

            it('null throws error', () => {
                expect(() => enforcer.request({ method: null })).to.throw();
            });

            it('object throws error', () => {
                expect(() => enforcer.request({ method: {} })).to.throw();
            });

        });

    });

    describe('deserialization', () => {

        it('path not defined', () => {
            const req = enforcer.request({ path: '/num/5' });
            console.log(req);
            throw Error('x');
        });
    });

    describe('response', () => {
        const properties = ['data', 'errors', 'example', 'populate', 'serialize'];
        const config = { code: 200, contentType: 'application/json' };

        it('via components', () => {
            const req = enforcer.request('/');
            const res = req.response();
            expect(Object.keys(res)).to.deep.equal(properties);
        });

        // it('invalid path', () => {
        //     const options = Object.assign({}, config, { path: '/hello' });
        //     expect(() => enforcer.response(options).to.throw(/invalid path/i);
        // });
        //
        // it('invalid method', () => {
        //     const options = Object.assign({}, config, { path: '/', method: 'delete' });
        //     expect(() => enforcer.response(options)).to.throw(/invalid method/i);
        // });
        //
        // it('has response properties', () => {
        //     const res = enforcer.response('/');
        //     expect(Object.keys(res)).to.deep.equal(properties);
        // })

    });

});