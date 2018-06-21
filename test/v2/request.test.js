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

describe('v2/request', () => {
    const schema = {
        swagger: '2.0',
        paths: {
            '/': {
                get: {
                    responses: {
                        200: {
                            schema: {
                                type: 'number'
                            }
                        }
                    }
                },
                put: {
                    parameters: [
                        {
                            name: 'body',
                            in: 'body',
                            schema: {
                                type: 'object',
                                properties: {
                                    R: { type: 'number' },
                                    B: { type: 'number' },
                                    G: { type: 'number' }
                                }
                            }
                        }
                    ]
                },
                parameters: [
                    {
                        name: 'color',
                        in: 'query',
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                    {
                        name: 'number',
                        in: 'query',
                        type: 'number'
                    },
                    {
                        name: 'x-number',
                        in: 'header',
                        type: 'number'
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

        it('no errors', () => {
            const req = request({
                body: { R: 100, G: 200, B: 150 }
            });
            const params = instance.request(req);
            expect(params.body).to.deep.equal({ R: 100, G: 200, B: 150 });
        });

        it('has error', () => {
            const req = request({
                body: { R: 'red', G: 200, B: 150 }
            });
            expect(() => instance.request(req)).to.throw(/the value must be numeric/i);
        });

        it('missing required body', () => {
            const schema2 = modSchema(schema, { 'paths./.put.parameters.0': { required: true } });
            const instance = new enforcer(schema2, {});
            expect(() => instance.request({ path: '/', method: 'put' })).to.throw(/missing required body/i);
        });

    });

    describe.skip('formData', () => {

        it('not implemented', () => {
            throw Error('TODO');
        })

    });

    describe('header', () => {
        const request = Request({ path: '/' });

        it('no errors', () => {
            const req = request({ headers: { 'x-number': '12345' } });
            const params = instance.request(req);
            expect(params.headers['x-number']).to.equal(12345);
        });

        it('error', () => {
            const req = request({ headers: { 'x-number': 'abc' } });
            expect(() => instance.request(req)).to.throw(/value must be numeric/i);
        });

        it('uses default', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { default: 10 } });
            const instance = new enforcer(schema2, {});
            const req = request({});
            const params = instance.request(req);
            expect(params.headers['x-number']).to.equal(10);
        });

        it('missing required', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.2': { required: true } });
            const instance = new enforcer(schema2, {});
            const req = request({});
            expect(() => instance.request(req)).to.throw(/missing required header/i);
        });

    });

    describe('path', () => {

        it('gets path parameter', () => {
            const params = instance.request({ path: '/12345'});
            expect(params.params.name).to.equal('12345');
        });

    });

    describe('query', () => {

        it('single item takes last', () => {
            const params = instance.request({ path: '/?number=1&number=2'});
            expect(params.query.number).to.equal(2);
        });

        it('csv', () => {
            const params = instance.request({ path: '/?color=red,green,blue'});
            expect(params.query.color).to.deep.equal(['red', 'green', 'blue']);
        });

        it('ssv', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { collectionFormat: 'ssv' } });
            const instance = new enforcer(schema2, {});
            const params = instance.request({ path: '/?color=red green%20blue'});
            expect(params.query.color).to.deep.equal(['red', 'green', 'blue']);
        });

        it('tsv', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { collectionFormat: 'tsv' } });
            const instance = new enforcer(schema2, {});
            const params = instance.request({ path: '/?color=red\tgreen%09blue'});
            expect(params.query.color).to.deep.equal(['red', 'green', 'blue']);
        });

        it('pipes', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { collectionFormat: 'pipes' } });
            const instance = new enforcer(schema2, {});
            const params = instance.request({ path: '/?color=red|green%7Cblue'});
            expect(params.query.color).to.deep.equal(['red', 'green', 'blue']);
        });

        it('multi', () => {
            const schema2 = modSchema(schema, { 'paths./.parameters.0': { collectionFormat: 'multi' } });
            const instance = new enforcer(schema2, {});
            const params = instance.request({ path: '/?color=red&color=green&color=blue'});
            expect(params.query.color).to.deep.equal(['red', 'green', 'blue']);
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