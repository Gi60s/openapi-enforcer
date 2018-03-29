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
const expect    = require('chai').expect;
const enforcer  = require('../../index');

describe('v3/response', () => {
    const schema = {
        openapi: '3.0.0',
        paths: {
            '/': {
                get: {
                    responses: {
                        200: {
                            headers: {
                                'x-date': {
                                    schema: {
                                        type: 'string',
                                        format: 'date'
                                    }
                                }
                            },
                            content: {
                                'application/json': {
                                    type: 'object',
                                    properties: {
                                        date: {
                                            type: 'string',
                                            format: 'date'
                                        }
                                    }
                                },
                                'text/plain': {
                                    type: 'string'
                                }
                            }
                        },
                        default: {
                            content: {
                                'application/json': {
                                    type: 'object',
                                    properties: {
                                        date: {
                                            type: 'string',
                                            format: 'date'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/no-default': {
                get: {
                    responses: {
                        200: {},
                        201: {}
                    }
                }
            }
        }
    };
    let instance;
    let request;

    before(() => {
        instance = new enforcer(schema, {});
        request = Request({ path: '/' });
    });

    describe('data', () => {

        it('will use default code if it exists', () => {
            const req = { path: '/', method: 'get' };
            const data = instance.response(req).data();
            expect(data.code).to.equal('default');
        });

        it('will use first code if no default code', () => {
            const req = { path: '/no-default', method: 'get' };
            const data = instance.response(req).data();
            expect(data.code).to.equal('200');
        });

        it('will use first response code content type if omitted', () => {
            const req = { code: 200, path: '/', method: 'get' };
            const data = instance.response(req).data();
            expect(data.contentType).to.equal('application/json');
        });

        it('will accept wild-card content type', () => {
            const req = { code: 200, path: '/', method: 'get', contentType: '*/plain' };
            const data = instance.response(req).data();
            expect(data.contentType).to.equal('text/plain');
        });

        it('will accept weighted content type list', () => {
            const req = request({});
            const data1 = instance.response({ 
                code: 200, 
                contentType: 'text/plain;q=0.9, application/json;q=1',
                method: 'get',
                path: '/'
            }).data();
            const data2 = instance.response(req).data({ code: 200, contentType: 'text/plain, application/json;q=0.9' });
            expect(data1.contentType).to.equal('application/json');
            expect(data2.contentType).to.equal('text/plain');
        });

    });

    describe('example', () => {

        it.only('will use default code if it exists', () => {

        });

        it('will use first code if no default code', () => {

        });

        it('will use first response code content type if omitted', () => {

        });

        it('header content-type added when missing', () => {

        });

        it('will accept wild-card content type', () => {

        });

        it('will accept weighted content type list', () => {

        });

        it('will use named example specified', () => {

        });

        it('returns random if named object not defined', () => {

        });

    });

    describe('populate', () => {

        it('will use default code if it exists', () => {
            
        });

        it('will use first code if no default code', () => {

        });

        it('will use first response code content type if omitted', () => {

        });

        it('missing header content-type added from contentType', () => {

        });

        it('if contentType empty will pull from header', () => {

        });

        it('missing header content-type and missing contentType uses first content type', () => {

        });



    });

    describe('serialize', () => {

        describe('body', () => {
            let d = '2000-01-01T00:00:00.000Z';

            it('valid code and content type omitted', () => {
                const req = request({});
                const res = instance.response(req).serialize({
                    code: 200,
                    body: { date: new Date(d) }
                });
                expect(res.value.body).to.deep.equal({ date: '2000-01-01' });
            });

            it('valid code and content type', () => {
                const req = request({});
                const res = instance.response(req).serialize({
                    code: 200,
                    body: { date: new Date(d) },
                    headers: { 'content-type': 'application/json' }
                });
                expect(res.value.body).to.deep.equal({ date: '2000-01-01' });
            });

            it('valid code and invalid content type', () => {
                const req = request({});
                const options = {
                    code: 200,
                    body: { date: new Date(d) },
                    headers: { 'content-type': 'text/plain' }
                };
                expect(instance.response(req).serialize(options).value.body)
                    .to.deep.equal({ date: new Date(d) });
            });

            it('invalid code uses default', () => {
                const req = request({});
                const res = instance.response(req).serialize({
                    code: 400,
                    body: { date: new Date(d) },
                    headers: { 'content-type': 'application/json' }
                });
                expect(res.value.body).to.deep.equal({ date: '2000-01-01' });
            });

        });

        describe('headers', () => {
            let d = '2000-01-01T00:00:00.000Z';

            it('header with schema', () => {
                const req = request({});
                const res = instance.response(req).serialize({
                    code: 200,
                    body: {},
                    headers: { 'x-date': new Date(d) }
                });
                expect(res.value.header['x-date']).to.equal('2000-01-01');
            });

            it('header without schema', () => {
                const req = request({});
                const res = instance.response(req).serialize({
                    code: 200,
                    body: {},
                    headers: { 'x-abc': new Date(d) }
                });
                expect(res.value.header['x-abc']).to.deep.equal(new Date(d));
            });

        });

    });

});

function Request(defaults) {
    return function(obj) {
        return Object.assign({
            body: obj.body || defaults.body || '',
            cookie: Object.assign({}, defaults.cookie, obj.cookie),
            header: Object.assign({}, defaults.header, obj.header),
            method: obj.method || defaults.method || 'get',
            path: obj.path || defaults.path || '',
            query: obj.query || defaults.query || ''
        });
    }
}