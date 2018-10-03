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

describe('components/operation', () => {

    describe('constructor', () => {
        let def;

        before(() => {
            const result = definition(2, Path, {
                get: {
                    parameters: [
                        { name: 'b', in: 'path', type: 'number', required: true },
                        { name: 'c', in: 'query', type: 'number', required: true }
                    ],
                    responses: {
                        200: { description: '' }
                    }
                },
                parameters: [
                    { name: 'a', in: 'path', type: 'string', required: true },
                    { name: 'b', in: 'path', type: 'string', required: true },
                    { name: 'b', in: 'query', type: 'string' }
                ]
            });
            def = result.value;
        });

        it('merges parameters from path and operation', () => {
            const parameters = def.get.parameters;
            expect(parameters.length).to.equal(4);
            expect(parameters.filter(p => p.in === 'path').length).to.equal(2);
            expect(parameters.filter(p => p.in === 'query').length).to.equal(2);
        });

        it('creates a parameters map', () => {
            const map = def.get.parametersMap;
            const keys = Object.keys(map);
            keys.sort();
            expect(keys).to.deep.equal(['path', 'query']);
            expect(map.path).to.haveOwnProperty('a');
            expect(map.path).to.haveOwnProperty('b');
            expect(map.query).to.haveOwnProperty('b');
            expect(map.query).to.haveOwnProperty('c');
        });

    });

    describe.only('request', () => {

        describe('in body', () => {

            describe('string', () => {
                const def = {
                    parameters: [{ name: 'body', in: 'body', schema: { type: 'string' }}],
                    responses: { 200: { description: '' } }
                };

                it('is allowed', () => {
                    const [ , operation ] = definition(2, Operation, def);
                    return operation.request({ path: '/', body: 'hello' })
                        .then(req => {
                            expect(req.body).to.equal('hello');
                        });
                });

                it('is validated', () => {
                    const [ , operation ] = definition(2, Operation, def);
                    return operation.request({ body: 'hello' })
                        .then(shouldHaveRejected, err => {
                            expect(err.code).to.equal(400);
                        });
                });

            });

            describe('datetime', () => {

                it('is allowed', () => {

                });

                it('is validated', () => {

                });

            });

            describe('number', () => {

                it('is allowed', () => {

                });

                it('is validated', () => {

                });

            });

        });

        describe('in cookie', () => {

        });

        describe('in formData', () => {

        });

        describe('in header', () => {

        });

        describe('in path', () => {

        });

        describe.only('in query', () => {

            it('overwrites duplicate parameters for non-collection', () => {
                const def = {
                    parameters: [{ name: 'x', in: 'query', type: 'number' }],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                return operation.request({ path: '/?x=1&x=2' })
                    .then(([ err, req ]) => {
                        expect(req.query.x).to.equal(2);
                    });
            });

            it('does allow non defined parameter w/ allowOtherQueryParameters', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                return operation.request({ path: '/?x=1' }, { allowOtherQueryParameters: true })
                    .then(([ , req ]) => {
                        expect(req.query).to.deep.equal({});
                    });
            });

            it('does not allow non defined parameter w/o allowOtherQueryParameters', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                return operation.request({ path: '/?x=1' }, { allowOtherQueryParameters: false })
                    .then(([ err ]) => {
                        expect(err).to.match(/Received unexpected parameter: x/);
                    });
            });

            describe('v2 array', () => {
                let def;

                beforeEach(() => {
                    def = {
                        parameters: [{ name: 'x', in: 'query', type: 'array', items: { type: 'number' } }],
                        responses: { 200: { description: '' } }
                    };
                });

                it('can deserialize a csv collection', () => {
                    def.parameters[0].collectionFormat = 'csv';
                    const [ , operation ] = definition(2, Operation, def);
                    return operation.request({ path: '/?x=1,2,3' })
                        .then(([ , req ]) => {
                            expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                        });
                });

                it('can deserialize an ssv collection', () => {
                    def.parameters[0].collectionFormat = 'ssv';
                    const [ , operation ] = definition(2, Operation, def);
                    return operation.request({ path: '/?x=1%202%203' })
                        .then(([ , req ]) => {
                            expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                        });
                });

                it('can deserialize a tsv collection', () => {
                    def.parameters[0].collectionFormat = 'tsv';
                    const [ , operation ] = definition(2, Operation, def);
                    return operation.request({ path: '/?x=1%092%093' })
                        .then(([ , req ]) => {
                            expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                        });
                });

                it('can deserialize a pipes collection', () => {
                    def.parameters[0].collectionFormat = 'pipes';
                    const [ , operation ] = definition(2, Operation, def);
                    return operation.request({ path: '/?x=1|2|3' })
                        .then(([ , req ]) => {
                            expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                        });
                });

                it('can deserialize a multi collection', () => {
                    def.parameters[0].collectionFormat = 'multi';
                    const [ , operation ] = definition(2, Operation, def);
                    return operation.request({ path: '/?x=1&x=2&x=3' })
                        .then(([ , req ]) => {
                            expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                        });
                });

            });

            describe('v3 array', () => {
                let def;

                beforeEach(() => {
                    def = {
                        parameters: [
                            { name: 'color', in: 'query' }
                        ],
                        responses: { 200: { description: '' } }
                    };
                });

                describe('default style (form)', () => {

                    it('empty', () => {
                        def.parameters[0].allowEmptyValue = true;
                        def.parameters[0].schema = { type: 'string' };
                        const [ , operation ] = definition(3, Operation, def);
                        return operation.request({ path: '/?color=' })
                            .then(([ err, req ]) => {
                                expect(req.query).to.haveOwnProperty('color');
                                expect(req.query.color).to.equal(undefined);
                            });
                    });

                    it('string', () => {
                        def.parameters[0].schema = { type: 'string' };
                        const [ err, operation ] = definition(3, Operation, def);
                        return operation.request({ path: '/?x=1&color=red&y=2' }, { allowOtherQueryParameters: true })
                            .then(([ err, req ]) => {
                                expect(req.query.color).to.equal('red');
                            });
                    });

                    it('array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = { type: 'array', items: { type: 'string' } };
                        const [ err, operation ] = definition(3, Operation, def);
                        return operation.request({ path: '/?color=orange&color=blue,black,brown' })
                            .then(([ err, req ]) => {
                                expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                            });
                    });

                    it('array (default exploded)', () => {
                        def.parameters[0].schema = { type: 'array', items: { type: 'string' } };
                        const [ err, operation ] = definition(3, Operation, def);
                        return operation.request({ path: '/?color=blue&color=black&x=1&color=brown' }, { allowOtherQueryParameters: true })
                            .then(([ err, req ]) => {
                                expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                            });
                    });

                    it('object (default exploded)', () => {
                        def.parameters[0].schema = {
                            type: 'object',
                            properties: {
                                R: { type: 'number' },
                                G: { type: 'number' },
                                B: { type: 'number' }
                            }
                        };
                        const [ err, operation ] = definition(3, Operation, def);
                        return operation.request({ path: '/?' + encodeURIComponent('R=100&G=200&B=150') })
                            .then(([ err, req ]) => {
                                expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                            });
                    });

                    it('object', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = {
                            type: 'object',
                            properties: {
                                R: { type: 'number' },
                                G: { type: 'number' },
                                B: { type: 'number' }
                            }
                        };
                        const [ , operation ] = definition(3, Operation, def);
                        return operation.request({ path: '/?color=R,100,G,200,B,150' })
                            .then(([ err, req ]) => {
                                expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                            });
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

function shouldHaveRejected() {
    throw Error('Should have been rejected');
}