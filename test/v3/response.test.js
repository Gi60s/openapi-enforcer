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
            }
        }
    };
    let instance;
    let request;

    before(() => {
        instance = new enforcer(schema, {});
        request = Request({ path: '/' });
    });

    describe('body', () => {
        let d = '2000-01-01T00:00:00.000Z';

        it('valid code and content type omitted', () => {
            const req = request({});
            const res = instance.response(req, 200, { date: new Date(d) });
            expect(res.value.body).to.deep.equal({ date: '2000-01-01' });
        });

        it('valid code and content type', () => {
            const req = request({});
            const res = instance.response(req, 200, { date: new Date(d) }, { 'content-type': 'application/json' });
            expect(res.value.body).to.deep.equal({ date: '2000-01-01' });
        });

        it('valid code and invalid content type', () => {
            const req = request({});
            expect(instance.response(req, 200, { date: new Date(d) }, { 'content-type': 'text/plain' }).value.body)
                .to.deep.equal({ date: new Date(d) });
        });

        it('invalid code uses default', () => {
            const req = request({});
            const res = instance.response(req, 400, { date: new Date(d) }, { 'content-type': 'application/json' });
            expect(res.value.body).to.deep.equal({ date: '2000-01-01' });
        });

    });

    describe('headers', () => {
        let d = '2000-01-01T00:00:00.000Z';

        it('header with schema', () => {
            const req = request({});
            const res = instance.response(req, 200, {}, { 'x-date': new Date(d) });
            expect(res.value.header['x-date']).to.equal('2000-01-01');
        });

        it('header without schema', () => {
            const req = request({});
            const res = instance.response(req, 200, {}, { 'x-abc': new Date(d) });
            expect(res.value.header['x-abc']).to.deep.equal(new Date(d));
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