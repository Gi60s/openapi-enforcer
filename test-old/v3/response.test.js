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
const { copy, same }    = require('../../bin-old/util');
const expect            = require('chai').expect;
const enforcer          = require('../../index');

describe('v3/response', () => {
    const schema = {
        openapi: '3.0.0',
        paths: {
            '/': {
                get: {
                    responses: {
                        200: {
                            headers: {
                                'x-array': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'string'
                                        }
                                    }
                                },
                                'x-date': {
                                    schema: {
                                        'x-variable': 'date',
                                        type: 'string',
                                        format: 'date'
                                    }
                                },
                                'x-required': {
                                    required: true
                                },
                                'x-obj': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            a: { type: 'string' },
                                            b: { type: 'string' }
                                        }
                                    }
                                }
                            },
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            date: {
                                                'x-variable': 'date',
                                                type: 'string',
                                                format: 'date'
                                            }
                                        },
                                        example: {
                                            date: '2000-01-30'
                                        }
                                    },
                                    example: {
                                        date: '2000-01-29'
                                    },
                                    examples: {
                                        First: {
                                            date: '2000-01-01'
                                        },
                                        Second: {
                                            date: '2000-01-02'
                                        }
                                    }
                                },
                                'text/plain': {
                                    schema: {
                                        type: 'string'
                                    }
                                }
                            }
                        },
                        default: {
                            content: {
                                'application/json': {
                                    schema: {
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
            const data = instance.response(req).data;
            expect(data.code).to.equal('default');
        });

        it('will use first code if no default code', () => {
            const req = { path: '/no-default', method: 'get' };
            const data = instance.response(req).data;
            expect(data.code).to.equal('200');
        });

        it('will use first response code content type if omitted', () => {
            const req = { code: 200, path: '/', method: 'get' };
            const data = instance.response(req).data;
            expect(data.contentType).to.equal('application/json');
        });

        it('will accept wild-card content type', () => {
            const req = { code: 200, path: '/', method: 'get', contentType: '*/plain' };
            const data = instance.response(req).data;
            expect(data.contentType).to.equal('text/plain');
        });

        it('will accept weighted content type list', () => {
            const data1 = instance.response({ 
                code: 200, 
                contentType: 'text/plain;q=0.9, application/json;q=1',
                path: '/'
            }).data;
            const data2 = instance.response({
                code: 200,
                contentType: 'text/plain, application/json;q=0.9',
                path: '/'
            }).data;
            expect(data1.contentType).to.equal('application/json');
            expect(data2.contentType).to.equal('text/plain');
        });

    });

    describe('example', () => {
        const req = { path: '/', method: 'get', code: 200, contentType: 'application/json' };
        let s;
        let c;

        beforeEach(() => {
            s = copy(schema);
            c = s.paths['/'].get.responses[200].content['application/json'];
        });

        it('use schema example if no overwrite example', () => {
            delete c.example;
            delete c.examples;
            instance = new enforcer(s, {});
            const example = instance.response(req).example();
            expect(example).not.to.equal(c.schema.example);
            expect(example).to.deep.equal(c.schema.example);
        });

        it('overwrite schema example', () => {
            delete c.examples;
            instance = new enforcer(s, {});
            const example = instance.response(req).example();
            expect(example).not.to.deep.equal(c.schema.example);
            expect(example).to.deep.equal(c.example);
        });

        it('example overwrites examples', () => {
            instance = new enforcer(s, {});
            const example = instance.response(req).example();
            expect(example).to.deep.equal(c.example);
        });

        it('selects one of examples', () => {
            delete c.example;
            instance = new enforcer(s, {});
            const example = instance.response(req).example();
            const oneOf = same(example, c.examples.First) || same(example, c.examples.Second);
            expect(oneOf).to.be.true;
        });

        it('select named example', () => {
            delete c.example;
            instance = new enforcer(s, {});
            const example = instance.response(req).example({ name: 'First' });
            expect(example).to.deep.equal(c.examples.First);
        });

        it('ignore documented examples', () => {
            instance = new enforcer(s, {});
            const example = instance.response(req).example({ ignoreDocumentExample: true });
            expect(example).not.to.deep.equal(c.example);
        });

        it('no documented examples', () => {
            delete c.example;
            delete c.examples;
            delete c.schema.example;
            const example = instance.response(req).example();
            expect(example).not.to.be.undefined;
        });

    });

    describe('populate', () => {
        const req = { path: '/', method: 'get', code: 200, contentType: 'application/json' };

        it('will populate body', () => {
            const d = new Date('2001-01-01');
            const value = instance.response(req).populate({
                params: { date: d }
            });
            expect(+value.body.date).to.equal(+d);
        });

        it('will populate headers', () => {
            const d = new Date('2001-01-01');
            const value = instance.response(req).populate({
                params: { date: d }
            });
            expect(+value.headers['x-date']).to.equal(+d);
        });

    });

    describe('serialize', () => {
        const req = { path: '/', method: 'get', code: 200, contentType: 'application/json' };
        const str = '2001-01-01';
        const d = new Date(str);

        it('will serialize body', () => {
            const response = instance.response(req);
            const populated = response.populate({ params: { date: d } });
            populated.headers['x-required'] = 1;
            const serialized = response.serialize(populated);
            expect(serialized.body.date).to.equal(str);
        });

        it('will serialize headers', () => {
            const response = instance.response(req);
            const populated = response.populate({ params: { date: d } });
            populated.headers['x-required'] = 1;
            const serialized = response.serialize(populated);
            expect(serialized.headers['x-date']).to.equal(str);
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