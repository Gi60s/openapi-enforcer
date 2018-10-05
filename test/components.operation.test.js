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

    describe('request', () => {
        const arrSchema = { type: 'array', items: { type: 'number' } };
        const arrStrSchema = { type: 'array', items: { type: 'string' } };
        const numSchema = { type: 'number' };
        const objSchema = {
            type: 'object',
            properties: {
                R: { type: 'number' },
                G: { type: 'number' },
                B: { type: 'number' }
            }
        };

        describe('in body', () => {
            let def;

            beforeEach(() => {
                def = {
                    parameters: [{ name: 'body', in: 'body' }],
                    responses: { 200: { description: '' } }
                };
            });

            it('deserializes primitive string', () => {
                def.parameters[0].schema = numSchema;
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ body: '1' });
                expect(req.body).to.equal(1);
            });

            it('deserializes array elements', () => {
                def.parameters[0].schema = arrSchema;
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ body: ['1', '2', '3'] });
                expect(req.body).to.deep.equal([1,2,3]);
            });

            it('deserializes object elements', () => {
                def.parameters[0].schema = objSchema;
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ body: { R: '50', G: '100', B: '150' } });
                expect(req.body).to.deep.equal({ R: 50, G: 100, B: 150 });
            });

            it('validates missing required body', () => {
                def.parameters[0].required = true;
                def.parameters[0].schema = numSchema;
                const [ , operation ] = definition(2, Operation, def);
                const [ err ] = operation.request({ });
                expect(err).to.match(/Missing required parameter: body/);
            });

            it('validates primitive', () => {
                def.parameters[0].schema = { type: 'number', maximum: 1 };
                const [ , operation ] = definition(2, Operation, def);
                const [ err ] = operation.request({ body: '2' });
                expect(err).to.match(/Expected number to be less than or equal to 1/);
                expect(err.statusCode).to.equal(400);
            });

            it('validates array elements', () => {
                def.parameters[0].schema = {
                    type: 'array',
                    items: {
                        type: 'number',
                        minimum: 2
                    }
                };
                const [ , operation ] = definition(2, Operation, def);
                const [ err ] = operation.request({ body: ['1', '2', '3'] });
                expect(err).to.match(/Expected number to be greater than or equal to 2/);
            });

            it('validates object elements', () => {
                def.parameters[0].schema = {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        R: { type: 'number' },
                        G: { type: 'number' }
                    }
                };
                const [ , operation ] = definition(2, Operation, def);
                const [ err ] = operation.request({ body: { R: '50', G: '100', B: '150' } });
                expect(err).to.match(/Property not allowed: B/);
            });

        });

        describe('in cookie', () => {

            describe('v3', () => {
                let def;

                beforeEach(() => {
                    def = {
                        parameters: [{ name: 'user', in: 'cookie' }],
                        responses: { 200: { description: '' } }
                    };
                });

                describe('default style (form)', () => {

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { cookie: 'user=12345' } });
                        expect(req.cookie.user).to.equal(12345);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { cookie: 'user=12345' } });
                        expect(req.cookie.user).to.equal(12345);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { cookie: 'user=1,2,3' } });
                        expect(req.cookie.user).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { cookie: 'user=R,50,G,100,B,150' } });
                        expect(req.cookie.user).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                });
            });

        });

        describe('in formData', () => {
            let def;

            beforeEach(() => {
                def = {
                    parameters: [
                        { name: 'user', in: 'formData', type: 'string' },
                        { name: 'age', in: 'formData', type: 'number', minimum: 0 }
                    ],
                    responses: { 200: { description: '' } }
                };
            });

            it('creates req.body property from form data elements', () => {
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ body: { user: 'Bob', age: '15' } });
                expect(req.body).to.deep.equal({ user: 'Bob', age: 15 });
            });

            it('allows already deserialized values', () => {
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ body: { user: 'Bob', age: 15 } });
                expect(req.body).to.deep.equal({ user: 'Bob', age: 15 });
            });

            it('validates values', () => {
                const [ , operation ] = definition(2, Operation, def);
                const [ err ] = operation.request({ body: { user: 'Bob', age: -1 } });
                expect(err).to.match(/Expected number to be greater than or equal to 0/)
            });

            it('validates that required values are set', () => {
                def.parameters[0].required = true;
                const [ , operation ] = definition(2, Operation, def);
                const [ err ] = operation.request({ body: { } });
                expect(err).to.match(/Missing required parameter: user/);
            });

        });

        describe('in header', () => {

            it('ignores parameter without definition', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ header: { 'x-value': '1' } });
                expect(req.header).not.to.haveOwnProperty('x-value');
            });

            describe('v2', () => {

                it('can deserialize date string', () => {
                    const def = {
                        parameters: [{ name: 'x-date', in: 'header', type: 'string', format: 'date' }],
                        responses: { 200: { description: '' } }
                    };
                    const [ , operation ] = definition(2, Operation, def);
                    const [ , req ] = operation.request({ header: { 'x-date': '2000-01-01' } });
                    expect(+req.header['x-date']).to.equal(+new Date('2000-01-01'));
                });

            });

            describe('v3', () => {

                describe('simple', () => {
                    let def;

                    beforeEach(() => {
                        def = {
                            parameters: [{ name: 'x-value', in: 'header' }],
                            responses: { 200: { description: '' } }
                        };
                    });

                    it('allows other headers', () => {
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ err ] = operation.request({ header: { 'x-value': '1', 'x-str': 'str' } });
                        expect(err).to.be.undefined;
                    });

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { 'x-value': '1' } });
                        expect(req.header['x-value']).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { 'x-value': '1' } });
                        expect(req.header['x-value']).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { 'x-value': '1,2,3' } });
                        expect(req.header['x-value']).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { 'x-value': '1,2,3' } });
                        expect(req.header['x-value']).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { 'x-value': 'R=50,G=100,B=200' } });
                        expect(req.header['x-value']).to.deep.equal({ R: 50, G: 100, B: 200 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ header: { 'x-value': 'R,50,G,100,B,200' } });
                        expect(req.header['x-value']).to.deep.equal({ R: 50, G: 100, B: 200 });
                    });

                });

            });

        });

        describe('in path', () => {
            let def;

            beforeEach(() => {
                def = {
                    parameters: [{ name: 'x', in: 'path', required: true }],
                    responses: { 200: { description: '' } }
                }
            });

            it('cannot supply parameter without definition', () => {
                def.parameters[0].type = 'number';
                const [ , operation ] = definition(2, Operation, def);
                const [ err, ] = operation.request({ path: { y: '1' } });
                expect(err).to.match(/Received unexpected parameter: y/);
            });

            describe('v2', () => {

                it('can deserialize path value', () => {
                    def.parameters[0].type = 'number';
                    const [ , operation ] = definition(2, Operation, def);
                    const [ , req ] = operation.request({ path: { x: '1' } });
                    expect(req.path.x).to.equal(1);
                });

            });

            describe('v3', () => {

                describe('simple (default)', () => {

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: 'R=50,G=100,B=150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: 'R,50,G,100,B,150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                });

                describe('label', () => {

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '.1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '.1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '.1.2.3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '.1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '.R=50.G=100.B=150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: '.R,50,G,100,B,150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                });

                describe('matrix', () => {

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: ';x=1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: ';x=1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: ';x=1;x=2;x=3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: ';x=1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: ';R=50;G=100;B=150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ path: { x: ';x=R,50,G,100,B,150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                });

            });

        });

        describe('in query', () => {

            it('overwrites duplicate parameters for non-collection', () => {
                const def = {
                    parameters: [{ name: 'x', in: 'query', type: 'number' }],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ query: 'x=1&x=2' });
                expect(req.query.x).to.equal(2);
            });

            it('does allow non defined parameter w/ allowOtherQueryParameters', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ query: 'x=1' }, { allowOtherQueryParameters: true });
                expect(req.query).to.deep.equal({});
            });

            it('does not allow non defined parameter w/o allowOtherQueryParameters', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                const [ err ] = operation.request({ query: 'x=1' }, { allowOtherQueryParameters: false });
                expect(err).to.match(/Received unexpected parameter: x/);
            });

            it('allows empty value if specified to allow in document', () => {
                const def = {
                    parameters: [{ name: 'color', in: 'query', type: 'string', allowEmptyValue: true }],
                    responses: { 200: { description: '' } }
                };
                const [ , operation ] = definition(2, Operation, def);
                const [ , req ] = operation.request({ query: 'color=' });
                expect(req.query).to.haveOwnProperty('color');
                expect(req.query.color).to.equal('');
            });

            describe('v2', () => {
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
                    const [ , req ] = operation.request({ query: 'x=1,2,3' });
                    expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                });

                it('can deserialize an ssv collection', () => {
                    def.parameters[0].collectionFormat = 'ssv';
                    const [ , operation ] = definition(2, Operation, def);
                    const [ , req ] = operation.request({ query: 'x=1%202%203' });
                    expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                });

                it('can deserialize a tsv collection', () => {
                    def.parameters[0].collectionFormat = 'tsv';
                    const [ , operation ] = definition(2, Operation, def);
                    const [ , req ] = operation.request({ query: 'x=1%092%093' });
                    expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                });

                it('can deserialize a pipes collection', () => {
                    def.parameters[0].collectionFormat = 'pipes';
                    const [ , operation ] = definition(2, Operation, def);
                    const [ , req ] = operation.request({ query: 'x=1|2|3' });
                    expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                });

                it('can deserialize a multi collection', () => {
                    def.parameters[0].collectionFormat = 'multi';
                    const [ , operation ] = definition(2, Operation, def);
                    const [ , req ] = operation.request({ query: 'x=1&x=2&x=3' });
                    expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                });

            });

            describe('v3', () => {
                let def;

                beforeEach(() => {
                    def = {
                        parameters: [{ name: 'color', in: 'query' }],
                        responses: { 200: { description: '' } }
                    };
                });

                describe('default style (form)', () => {

                    it('can deserialize string', () => {
                        def.parameters[0].schema = { type: 'string' };
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ query: 'x=1&color=red&y=2' }, { allowOtherQueryParameters: true });
                        expect(req.query.color).to.equal('red');
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrStrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ query: 'color=orange&color=blue,black,brown' });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                    it('can deserialize array (default exploded)', () => {
                        def.parameters[0].schema = arrStrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ query: 'color=blue&color=black&x=1&color=brown' }, { allowOtherQueryParameters: true });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                    it('can deserialize object (default exploded)', () => {
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ query: 'R=100&G=200&B=150' });
                        expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                    });

                    it('can deserialize object (not exploded)', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ query: 'color=R,100,G,200,B,150' });
                        expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                    });

                });

                describe('spaceDelimited', () => {

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'spaceDelimited';
                        def.parameters[0].schema = arrStrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ query: 'color=blue%20black%20brown' });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                });

                describe('pipeDelimited\t', () => {

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'pipeDelimited';
                        def.parameters[0].schema = arrStrSchema;
                        const [ , operation ] = definition(3, Operation, def);
                        const [ , req ] = operation.request({ query: 'color=blue|black|brown' });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                });

                it('can deserialize deepObject style', () => {
                    def.parameters[0].style = 'deepObject';
                    def.parameters[0].schema = objSchema;
                    const [ , operation ] = definition(3, Operation, def);
                    const [ , req ] = operation.request({ query: 'color[R]=100&color[G]=200&color[B]=150' });
                    expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                });

            });

        });

        describe.only('requestBody', () => {
            let def;
            let appJson;
            let appStar;
            let appXml;
            let starStar;
            let textPlain;

            beforeEach(() => {
                appJson = { schema: { type: 'object', additionalProperties: false, properties: { json: { type: 'number' } } } };
                appXml = { schema: { type: 'object', additionalProperties: false, properties: { xml: { type: 'number' } } } };
                textPlain = { schema: { type: 'object', additionalProperties: false, properties: { text: { type: 'number' } } } };
                appStar = { schema: { type: 'object', additionalProperties: false, properties: { star: { type: 'number' } } } };
                starStar = { schema: { type: 'object', additionalProperties: false, properties: { star2: { type: 'number' } } } };
                def = {
                    requestBody: {
                        content: {
                            'application/json': appJson,
                            'application/xml': appXml,
                            'application/*': appStar,
                            'text/plain': textPlain,
                            '*/*': starStar,
                        }
                    },
                    responses: { 200: { description: '' } }
                }
            });

            it.only('deserializes primitive string', () => {
                appJson.schema = numSchema;
                const [ err, operation ] = definition(3, Operation, def);
                console.log('' + err);
                const [ , req ] = operation.request({ body: '1', header: { 'content-type': 'application/json' } });
                expect(req.body).to.equal(1);
            });

            it('deserializes array elements', () => {
                appJson.schema = arrSchema;
                const [ , operation ] = definition(3, Operation, def);
                const [ , req ] = operation.request({ body: ['1', '2', '3'], header: { 'content-type': 'application/json' } });
                expect(req.body).to.deep.equal([1,2,3]);
            });

            it('deserializes object elements', () => {
                appJson.schema = objSchema;
                const [ , operation ] = definition(3, Operation, def);
                const [ , req ] = operation.request({ body: { R: '50', G: '100', B: '150' }, header: { 'content-type': 'application/json' } });
                expect(req.body).to.deep.equal({ R: 50, G: 100, B: 150 });
            });

            it('validates missing required request body', () => {
                def.requestBody.required = true;
                const [ , operation ] = definition(3, Operation, def);
                const [ err ] = operation.request({});
                expect(err).to.match(/Missing required request body/);
            });

            it('matches correct media type', () => {
                throw Error('TODO');
            });

        });

    });

});