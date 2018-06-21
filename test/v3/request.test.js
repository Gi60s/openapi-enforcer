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
const copy      = require('../../bin/util').copy;
const expect    = require('chai').expect;
const enforcer  = require('../../index');

describe('v3/request', () => {
    const schema = {
        openapi: '3.0.0',
        paths: {
            '/': {
                get: {
                    responses: {
                        200: {
                            content: {
                                'application/xml': {
                                    type: 'string'
                                },
                                'application/json': {
                                    type: 'number'
                                },
                                'text/plain': {
                                    type: 'boolean'
                                }
                            }
                        }
                    }
                },
                put: {
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        R: { type: 'number' },
                                        B: { type: 'number' },
                                        G: { type: 'number' }
                                    }
                                },
                            },
                            'application/json2': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        approved: { type: 'boolean' },
                                        end: { type: 'string', format: 'date-time' },
                                        start: { type: 'string', format: 'date' }
                                    }
                                }
                            },
                            'text/plain': {
                                schema: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'user',
                        in: 'cookie',
                        schema: {
                            type: 'object',
                            required: ['id', 'sessionStart'],
                            properties: {
                                id: { type: 'number' },
                                sessionStart: { type: 'string', format: 'date-time' }
                            }
                        }
                    },
                    {
                        name: 'color',
                        in: 'query',
                        schema: {
                            type: 'object',
                            properties: {
                                R: { type: 'number' },
                                B: { type: 'number' },
                                G: { type: 'number' }
                            }
                        }
                    },
                    {
                        name: 'x-number',
                        in: 'header',
                        schema: { type: 'number' }
                    }
                ]
            },
            '/{name}': {
                get: {
                    parameters: [
                        { name: 'name', in: 'path', required: true, schema: { type: 'string' }}
                    ]
                }
            }
        }
    };
    let instance;

    before(() => {
        instance = new enforcer(schema, {});
    });

    describe('body', () => {
        const request = Request({ path: '/', method: 'put' });

        it('string content', () => {
            const req = request({
                body: 'this is some text',
                headers: { 'content-type': 'text/plain' }
            });
            const params = instance.request(req);
            expect(params.body).to.equal('this is some text');
        });

        it('application/json content', () => {
            const req = request({
                body: { R: 100, G: 200, B: 150 },
                headers: { 'content-type': 'application/json' }
            });
            const params = instance.request(req);
            expect(params.body).to.deep.equal({ R: 100, G: 200, B: 150 });
        });

        it('application/json2 content', () => {
            const end = new Date('2000-01-02T01:02:03.456Z');
            const start = new Date('2000-01-01T01:02:03.456Z');
            const req = request({
                body: {
                    approved: true,
                    end: end.toISOString(),
                    start: start.toISOString()   // date type (not date-time)
                },
                headers: { 'content-type': 'application/json2' }
            });
            const params = instance.request(req);
            expect(+params.body.end).to.equal(+end);
            expect(+params.body.start).to.equal(+new Date('2000-01-01'));
        });

        it('wrong content', () => {
            const req = request({
                body: { R: 100, G: 200, B: 150 },
                headers: { 'content-type': 'text/plain' }
            });
            expect(() => instance.request(req)).to.throw(/expected a string/i);
        });

        it('missing required body', () => {
            const schema2 = modSchema(schema, { 'paths./.put.requestBody': { required: true } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request({ path: '/', method: 'put' })).to.throw(/missing required request body/i);
        });

    });

    describe('cookie', () => {
        const ds = '2000-01-02T03:04:05.678Z';
        const request = Request({ path: '/' });

        it('default style (form)', () => {
            const req = request({ cookies: { user: 'id=12345&sessionStart=' + ds } });
            const params = instance.request(req);
            expect(params.cookies.user).to.deep.equal({ id: 12345, sessionStart: new Date(ds) });
        });

        it('cannot use matrix style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { style: 'matrix' } });
            const req = request({ cookies: { user: '' } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/matrix style/);
        });

        it('cannot use label style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { style: 'label' } });
            const req = request({ cookies: { user: '' } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/label style/);
        });

        it('cannot use simple style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { style: 'simple' } });
            const req = request({ cookies: { user: '' } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/simple style/);
        });

        it('cannot use spaceDelimited style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { style: 'spaceDelimited' } });
            const req = request({ cookies: { user: '' } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/spaceDelimited style/);
        });

        it('cannot use pipeDelimited style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { style: 'pipeDelimited' } });
            const req = request({ cookies: { user: '' } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/pipeDelimited style/);
        });

        it('cannot use deepObject style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { style: 'deepObject' } });
            const req = request({ cookies: { user: '' } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/deepObject style/);
        });

    });

    describe('header', () => {
        const config = { headers: { 'x-number': '12345' } };
        const request = Request({ path: '/' });

        it('default style (simple)', () => {
            const req = request(config);
            const params = instance.request(req);
            expect(params.headers['x-number']).to.equal(12345);
        });

        it('cannot use matrix style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { style: 'matrix' } });
            const req = request(config);
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/matrix style/);
        });

        it('cannot use label style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { style: 'label' } });
            const req = request(config);
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/label style/);
        });

        it('cannot use form style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { style: 'form' } });
            const req = request(config);
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/form style/);
        });

        it('cannot use spaceDelimited style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { style: 'spaceDelimited' } });
            const req = request(config);
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/spaceDelimited style/);
        });

        it('cannot use pipeDelimited style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { style: 'pipeDelimited' } });
            const req = request(config);
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/pipeDelimited style/);
        });

        it('cannot use deepObject style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { style: 'deepObject' } });
            const req = request(config);
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/deepObject style/);
        });

    });

    describe('path', () => {
        const request = Request({});

        it('default style (simple)', () => {
            const req = request({ path: '/Bob' });
            const params = instance.request(req);
            expect(params.params.name).to.equal('Bob');
        });

        it('can use matrix style', () => {
            const schema2 = modSchema(schema, { 'paths./{name}.get.parameters.0': { style: 'matrix' } });
            const req = request({ path: '/;name=Bob'});
            const instance = new enforcer(schema2, {});
            const params = instance.request(req);
            expect(params.params.name).to.equal('Bob');
        });

        it('can use label style', () => {
            const schema2 = modSchema(schema, { 'paths./{name}.get.parameters.0': { style: 'label' } });
            const req = request({ path: '/.Bob'});
            const instance = new enforcer(schema2, {});
            const params = instance.request(req);
            expect(params.params.name).to.equal('Bob');
        });

        it('cannot use form style', () => {
            const schema2 = modSchema(schema, { 'paths./{name}.get.parameters.0': { style: 'form' } });
            const req = request({ path: '/name=Bob' });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/form style/);
        });

        it('cannot use spaceDelimited style', () => {
            const schema2 = modSchema(schema, { 'paths./{name}.get.parameters.0': { style: 'spaceDelimited' } });
            const req = request({ path: '/Bob' });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/spaceDelimited style/);
        });

        it('cannot use pipeDelimited style', () => {
            const schema2 = modSchema(schema, { 'paths./{name}.get.parameters.0': { style: 'pipeDelimited' } });
            const req = request({ path: '/Bob' });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/pipeDelimited style/);
        });

        it('cannot use deepObject style', () => {
            const schema2 = modSchema(schema, { 'paths./{name}.get.parameters.0': { style: 'deepObject' } });
            const req = request({ path: '/Bob' });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/deepObject style/);
        });

    });

    describe('query', () => {
        const request = Request({});

        describe('default style (form)', () => {

            it('empty', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { schema: { type: 'string' }}});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=' });
                const params = instance.request(req);
                expect(params.query.color).to.equal('');
            });

            it('string', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { schema: { type: 'string' }}});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?x=1&color=red&y=2' });
                const params = instance.request(req);
                expect(params.query.color).to.equal('red');
            });

            it('array', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { schema: { type: 'array' }, explode: false }});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=orange&color=blue,black,brown' });
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal(['blue', 'black', 'brown']);
            });

            it('array (default exploded)', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { schema: { type: 'array' }}});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=blue&color=black&x=1&color=brown' });
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal(['blue', 'black', 'brown']);
            });

            it('object (default exploded)', () => {
                const instance = new enforcer(schema, {});
                const encoded = encodeURIComponent('R=100&G=200&B=150');
                const req = request({ path: '/?color=' + encoded });
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
            });

            it('object', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { explode: false } });
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=R,100,G,200,B,150' });
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
            });

        });

        describe('spaceDelimited', () => {

            it('array', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'spaceDelimited', schema: { type: 'array' }}});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=blue%20black%20brown'});
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal(['blue', 'black', 'brown']);
            });

            it('object', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'spaceDelimited' }});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=R%20100%20G%20200%20B%20150'});
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
            });

        });

        describe('pipeDelimited\t', () => {

            it('array', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'pipeDelimited', schema: { type: 'array' }}});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=blue|black|brown'});
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal(['blue', 'black', 'brown']);
            });

            it('object', () => {
                const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'pipeDelimited' }});
                const instance = new enforcer(schema2, {});
                const req = request({ path: '/?color=R|100|G|200|B|150'});
                const params = instance.request(req);
                expect(params.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
            });

        });

        it('cannot use matrix style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'matrix' } });
            const req = request({ path: '/?color=' });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/matrix style/);
        });

        it('cannot use label style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'label' } });
            const req = request({ path: '/?color=' });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/label style/);
        });

        it('cannot use simple style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'simple' } });
            const req = request({ path: '/?color=' });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request(req)).to.throw(/simple style/);
        });

        it('can use deepObject style', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.1': { style: 'deepObject' } });
            const instance = new enforcer(schema2, {});
            const req = request({ path: '/?color[R]=100&color[G]=200&color[B]=150'});
            const params = instance.request(req);
            expect(params.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
        });

    });

});

function modSchema(source, mods) {
    const definition = copy(source);
    Object.keys(mods).forEach(path => {
        const paths = path.split('.');
        let obj = definition;
        while (paths.length > 0) {
            const p = paths.shift();
            if (p.length) obj = obj[p];
        }
        Object.assign(obj, mods[path]);
    });
    return definition;
}

function Request(defaults) {
    return function(obj) {
        return Object.assign({
            body: obj.body || defaults.body || '',
            cookies: Object.assign({}, defaults.cookies, obj.cookies),
            headers: Object.assign({}, defaults.headers, obj.headers),
            method: obj.method || defaults.method || 'get',
            path: obj.path || defaults.path || '',
            query: obj.query || defaults.query || ''
        });
    }
}