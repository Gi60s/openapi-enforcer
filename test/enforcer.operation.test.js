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
const Enforcer      = require('../');
const expect        = require('chai').expect;

describe('enforcer/operation', () => {

    describe('constructor', () => {
        let def;

        before(() => {
            let err;
            [ def, err ] = Enforcer.v2_0.PathItem({
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
            if (err) console.log(err);
        });

        it('can get all parameters from path and operation', () => {
            const parameters = def.get.allParameters;
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

    describe('get response content type matches', () => {

        describe('v2', () => {

            it('has no produces defined returns exception with code NO_TYPES_SPECIFIED', () => {
                const [ operation ] = Enforcer.v2_0.Operation({
                    responses: { 200: { description: '' }}
                });
                const [ , err ] = operation.getResponseContentTypeMatches(200, 'application/json');
                expect(err.code).to.equal('NO_TYPES_SPECIFIED')
            });

            it('will pull produces from root if not specified in operation', () => {
                const [ swagger ] = Enforcer.v2_0.Swagger({
                    swagger: '2.0',
                    info: { title: '', version: '' },
                    produces: ['application/json', 'application/xml', 'text/html'],
                    paths: {
                        '/': {
                            get: {
                                responses: { 200: { description: '' } }
                            }
                        }
                    }
                });
                const [ matches ] = swagger.paths['/'].get.getResponseContentTypeMatches(200, 'application/*');
                expect(matches).to.deep.equal(['application/json', 'application/xml'])
            });

            it('will produce an exception with code NO_MATCH if produces are set but none matches accept', () => {
                const [ operation ] = Enforcer.v2_0.Operation({
                    produces: ['text/html'],
                    responses: { 200: { description: '' }}
                });
                const [ , err ] = operation.getResponseContentTypeMatches(200, 'application/json');
                expect(err.code).to.equal('NO_MATCH')
            });

        });

        describe('v3', () => {

            it('has no content defined returns exception with code NO_TYPES_SPECIFIED', () => {
                const [ operation ] = Enforcer.v3_0.Operation({
                    responses: {
                        200: {
                            description: ''
                        }
                    }
                });
                const [ , err ] = operation.getResponseContentTypeMatches(200, 'application/json');
                expect(err.code).to.equal('NO_TYPES_SPECIFIED')
            });

            it('will produce an exception with code NO_MATCH if content is set but none matches accept', () => {
                const [ operation ] = Enforcer.v3_0.Operation({
                    responses: {
                        200: {
                            description: '',
                            content: {
                                'text/html': {}
                            }
                        }
                    }
                });
                const [ , err ] = operation.getResponseContentTypeMatches(200, 'application/json');
                expect(err.code).to.equal('NO_MATCH')
            });

            it('will select correct content', () => {
                const [ operation ] = Enforcer.v3_0.Operation({
                    responses: {
                        200: {
                            description: '',
                            content: {
                                'application/json': {},
                                'application/xml': {},
                                'text/html': {}
                            }
                        }
                    }
                });
                const [ matches ] = operation.getResponseContentTypeMatches(200, 'application/*');
                expect(matches).to.deep.equal(['application/json', 'application/xml'])
            });

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
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ body: '1' });
                expect(req.body).to.equal(1);
            });

            it('does not deserialize array elements', () => {
                def.parameters[0].schema = arrSchema;
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ body: ['1', '2', '3'] });
                expect(err).to.match(/Unable to deserialize value\s+at: 0\s+Expected a number/);
                expect(err.count).to.equal(3);
            });

            it('does not deserialize object elements', () => {
                def.parameters[0].schema = objSchema;
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ body: { R: '50', G: '100', B: '150' } });
                expect(err).to.match(/Unable to deserialize value\s+at: R\s+Expected a number/);
                expect(err.count).to.equal(3);
            });

            it('does not decode uri', () => {
                const body = encodeURIComponent('hello world');
                def.parameters[0].schema = { type: 'string' };
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ body });
                expect(req.body).to.equal(body);
            });

            it('validates missing required body', () => {
                def.parameters[0].required = true;
                def.parameters[0].schema = numSchema;
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ });
                expect(err).to.match(/Missing required parameter: body/);
                expect(err.count).to.equal(1);
            });

            it('validates primitive', () => {
                def.parameters[0].schema = { type: 'number', maximum: 1 };
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ body: 2 });
                expect(err).to.match(/Expected number to be less than or equal to 1/);
                expect(err.count).to.equal(1);
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
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ body: [1, 2, 3] });
                expect(err).to.match(/Expected number to be greater than or equal to 2/);
                expect(err.count).to.equal(1);
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
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ body: { R: 50, G: 100, B: 150 } });
                expect(err).to.match(/at: B\s+Property not allowed/);
                expect(err.count).to.equal(1);
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
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { cookie: 'user=12345' } });
                        expect(req.cookie.user).to.equal(12345);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { cookie: 'user=12345' } });
                        expect(req.cookie.user).to.equal(12345);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { cookie: 'user=1,2,3' } });
                        expect(req.cookie.user).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { cookie: 'user=R,50,G,100,B,150' } });
                        expect(req.cookie.user).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('does not run uri decode', () => {
                        const cookieValue = encodeURIComponent('bob smith');
                        def.parameters[0].schema = { type: 'string' };
                        const [ operation, err ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { cookie: 'user=' + cookieValue } });
                        expect(req.cookie.user).to.equal(cookieValue);
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
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ body: { user: 'Bob', age: '15' } });
                expect(req.body).to.deep.equal({ user: 'Bob', age: 15 });
            });

            it('allows already deserialized values', () => {
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ body: { user: 'Bob', age: 15 } });
                expect(req.body).to.deep.equal({ user: 'Bob', age: 15 });
            });

            it('validates values', () => {
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ body: { user: 'Bob', age: -1 } });
                expect(err).to.match(/Expected number to be greater than or equal to 0/)
            });

            it('validates that required values are set', () => {
                def.parameters[0].required = true;
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ body: { } });
                expect(err).to.match(/Missing required parameter: user/);
            });

            it('does not run uri decode', () => {
                const user = encodeURIComponent('Bob Smith');
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ body: { user } });
                expect(req.body.user).to.equal(user);
            });

        });

        describe('in header', () => {

            it('ignores parameter without definition', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ headers: { 'x-value': '1' } });
                expect(req.headers).not.to.haveOwnProperty('x-value');
            });

            describe('v2', () => {

                it('can deserialize date string', () => {
                    const def = {
                        parameters: [{ name: 'x-date', in: 'header', type: 'string', format: 'date' }],
                        responses: { 200: { description: '' } }
                    };
                    const [ operation ] = Enforcer.v2_0.Operation(def);
                    const [ req ] = operation.request({ headers: { 'x-date': '2000-01-01' } });
                    expect(+req.headers['x-date']).to.equal(+new Date('2000-01-01'));
                });

                it('does not run uri decode', () => {
                    const value = encodeURIComponent('a value');
                    const def = {
                        parameters: [{ name: 'x-value', in: 'header', type: 'string' }],
                        responses: { 200: { description: '' } }
                    };
                    const [ operation ] = Enforcer.v2_0.Operation(def);
                    const [ req ] = operation.request({ headers: { 'x-value': value } });
                    expect(req.headers['x-value']).to.equal(value);
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
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ , err ] = operation.request({ headers: { 'x-value': '1', 'x-str': 'str' } });
                        expect(err).to.be.undefined;
                    });

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { 'x-value': '1' } });
                        expect(req.headers['x-value']).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { 'x-value': '1' } });
                        expect(req.headers['x-value']).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { 'x-value': '1,2,3' } });
                        expect(req.headers['x-value']).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { 'x-value': '1,2,3' } });
                        expect(req.headers['x-value']).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { 'x-value': 'R=50,G=100,B=200' } });
                        expect(req.headers['x-value']).to.deep.equal({ R: 50, G: 100, B: 200 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ headers: { 'x-value': 'R,50,G,100,B,200' } });
                        expect(req.headers['x-value']).to.deep.equal({ R: 50, G: 100, B: 200 });
                    });

                    it('does not run uri decode', () => {
                        const value = encodeURIComponent('a value');
                        def.parameters[0].type = 'string';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ headers: { 'x-value': value } });
                        expect(req.headers['x-value']).to.equal(value);
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
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ path: { y: '1' } });
                expect(err).to.match(/Received unexpected parameter: y/);
            });

            describe('v2', () => {

                it('can deserialize path value', () => {
                    def.parameters[0].type = 'number';
                    const [ operation ] = Enforcer.v2_0.Operation(def);
                    const [ req ] = operation.request({ path: { x: '1' } });
                    expect(req.path.x).to.equal(1);
                });

                it('does run uri decode', () => {
                    const value = 'a value';
                    def.parameters[0].type = 'string';
                    const [ operation ] = Enforcer.v2_0.Operation(def);
                    const [ req ] = operation.request({ path: { x: encodeURIComponent(value) } });
                    expect(req.path.x).to.equal(value);
                });

            });

            describe('v3', () => {

                describe('simple (default)', () => {

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: 'R=50,G=100,B=150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: 'R,50,G,100,B,150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('does run uri decode', () => {
                        const value = 'a value';
                        def.parameters[0].schema = { type: 'string' };
                        const [ operation, err ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: encodeURIComponent(value) } });
                        expect(req.path.x).to.equal(value);
                    });

                });

                describe('label', () => {

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '.1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '.1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '.1.2.3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '.1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '.R=50.G=100.B=150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '.R,50,G,100,B,150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('does run uri decode', () => {
                        const value = 'a value';
                        def.parameters[0].style = 'label';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        };
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: '.a,' + encodeURIComponent(value) } });
                        expect(req.path.x).to.deep.equal({ a: value });
                    });

                });

                describe('matrix', () => {

                    it('can deserialize exploded primitive', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: ';x=1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize primitive', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = numSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: ';x=1' } });
                        expect(req.path.x).to.equal(1);
                    });

                    it('can deserialize exploded array', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: ';x=1;x=2;x=3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: ';x=1,2,3' } });
                        expect(req.path.x).to.deep.equal([1, 2, 3]);
                    });

                    it('can deserialize exploded object', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = true;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: ';R=50;G=100;B=150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('can deserialize object', () => {
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: ';x=R,50,G,100,B,150' } });
                        expect(req.path.x).to.deep.equal({ R: 50, G: 100, B: 150 });
                    });

                    it('does run uri decode', () => {
                        const value = 'a value';
                        def.parameters[0].style = 'matrix';
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        };
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ path: { x: ';x=a,' + encodeURIComponent(value) } });
                        expect(req.path.x).to.deep.equal({ a: value });
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
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ query: 'x=1&x=2' });
                expect(req.query.x).to.equal(2);
            });

            it('does allow non defined parameter w/ allowOtherQueryParameters', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req ] = operation.request({ query: 'x=1' }, { allowOtherQueryParameters: true });
                expect(req.query).to.deep.equal({});
            });

            it('does not allow non defined parameter w/o allowOtherQueryParameters', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ query: 'x=1' }, { allowOtherQueryParameters: false });
                expect(err).to.match(/Received unexpected parameter: x/);
            });

            it('does allow non defined parameter when specified as a value in allowOtherQueryParameters array', () => {
                const def = {
                    parameters: [],
                    responses: { 200: { description: '' } }
                };
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ , err ] = operation.request({ query: 'x=1&y=2&z=3' }, { allowOtherQueryParameters: ['x', 'y'] });
                expect(err.count).to.equal(1);
                expect(err).to.match(/Received unexpected parameter: z/);
            });

            it('allows empty value if specified to allow in document', () => {
                const def = {
                    parameters: [{ name: 'color', in: 'query', type: 'string', allowEmptyValue: true }],
                    responses: { 200: { description: '' } }
                };
                const [ operation ] = Enforcer.v2_0.Operation(def);
                const [ req, ] = operation.request({ query: 'color=' });
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

                describe('csv collection', () => {

                    it('can deserialize a csv collection', () => {
                        def.parameters[0].collectionFormat = 'csv';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=1,2,3' });
                        expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                    });

                    it('does run uri decode', () => {
                        const value = 'a value';
                        def.parameters[0].collectionFormat = 'csv';
                        def.parameters[0].items.type = 'string';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=foo,' + encodeURIComponent(value) });
                        expect(req.query.x[1]).to.equal(value);
                    });

                });

                describe('ssv collection', () => {

                    it('can deserialize an ssv collection', () => {
                        def.parameters[0].collectionFormat = 'ssv';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=1%202%203' });
                        expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                    });

                    it('does run uri decode', () => {
                        const value = 'a%value';
                        def.parameters[0].collectionFormat = 'ssv';
                        def.parameters[0].items.type = 'string';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=foo%20' + encodeURIComponent(value) });
                        expect(req.query.x[1]).to.equal(value);
                    });

                });

                describe('tsv collection', () => {

                    it('can deserialize a tsv collection', () => {
                        def.parameters[0].collectionFormat = 'tsv';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=1%092%093' });
                        expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                    });

                    it('does run uri decode', () => {
                        const value = 'a value';
                        def.parameters[0].collectionFormat = 'tsv';
                        def.parameters[0].items.type = 'string';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=foo%09' + encodeURIComponent(value) });
                        expect(req.query.x[1]).to.equal(value);
                    });

                });

                describe('pipes collection', () => {

                    it('can deserialize a pipes collection', () => {
                        def.parameters[0].collectionFormat = 'pipes';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=1|2|3' });
                        expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                    });

                    it('does run uri decode', () => {
                        const value = 'a value';
                        def.parameters[0].collectionFormat = 'pipes';
                        def.parameters[0].items.type = 'string';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=foo|' + encodeURIComponent(value) });
                        expect(req.query.x[1]).to.equal(value);
                    });

                });

                describe('multi collection', () => {

                    it('can deserialize a multi collection', () => {
                        def.parameters[0].collectionFormat = 'multi';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=1&x=2&x=3' });
                        expect(req.query.x).to.deep.equal([ 1, 2, 3 ]);
                    });

                    it('does run uri decode', () => {
                        const value = 'a value';
                        def.parameters[0].collectionFormat = 'multi';
                        def.parameters[0].items.type = 'string';
                        const [ operation ] = Enforcer.v2_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=foo&x=' + encodeURIComponent(value) });
                        expect(req.query.x[1]).to.equal(value);
                    });

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
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'x=1&color=red&y=2' }, { allowOtherQueryParameters: true });
                        expect(req.query.color).to.equal('red');
                    });

                    it('can deserialize array', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = arrStrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=orange&color=blue,black,brown' });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                    it('can deserialize array (default exploded)', () => {
                        def.parameters[0].schema = arrStrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=blue&color=black&x=1&color=brown' }, { allowOtherQueryParameters: true });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                    it('can deserialize object (default exploded)', () => {
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'R=100&G=200&B=150' });
                        expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                    });

                    it('can deserialize object (not exploded)', () => {
                        def.parameters[0].explode = false;
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=R,100,G,200,B,150' });
                        expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                    });

                    it('does run uri decode', () => {
                        def.parameters[0].schema = { type: 'string' };
                        const value = 'red and blue';
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=' + encodeURIComponent(value) }, { allowOtherQueryParameters: true });
                        expect(req.query.color).to.equal(value);
                    });

                });

                describe('spaceDelimited', () => {

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'spaceDelimited';
                        def.parameters[0].schema = arrStrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=blue%20black%20brown' });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                    it('does run uri decode', () => {
                        def.parameters[0].style = 'spaceDelimited';
                        def.parameters[0].schema = { type: 'array', items: { type: 'string' } };
                        const value = 'blue black & brown';
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=' + encodeURIComponent(value) }, { allowOtherQueryParameters: true });
                        expect(req.query.color).to.deep.equal(['blue', 'black', '&', 'brown']);
                    });

                });

                describe('pipeDelimited', () => {

                    it('can deserialize array', () => {
                        def.parameters[0].style = 'pipeDelimited';
                        def.parameters[0].schema = arrStrSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=blue|black|brown' });
                        expect(req.query.color).to.deep.equal(['blue', 'black', 'brown']);
                    });

                    it('does run uri decode', () => {
                        def.parameters[0].style = 'pipeDelimited';
                        def.parameters[0].schema = { type: 'array', items: { type: 'string' } };
                        const value = 'blue|black and brown';
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color=' + encodeURIComponent(value) }, { allowOtherQueryParameters: true });
                        expect(req.query.color).to.deep.equal(['blue', 'black and brown']);
                    });

                });

                describe('deepObject', () => {

                    it('can deserialize deepObject style', () => {
                        def.parameters[0].style = 'deepObject';
                        def.parameters[0].schema = objSchema;
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req ] = operation.request({ query: 'color[R]=100&color[G]=200&color[B]=150' });
                        expect(req.query.color).to.deep.equal({ R: 100, G: 200, B: 150 });
                    });

                    it('does run uri decode', () => {
                        def.parameters[0].style = 'deepObject';
                        def.parameters[0].schema = {
                            type: 'object',
                            properties: {
                                a: { type: 'string' },
                                b: { type: 'string' }
                            }
                        };
                        const value = 'color[a]=hello&color[b]=to you';
                        const [ operation ] = Enforcer.v3_0.Operation(def);
                        const [ req, err ] = operation.request({ query: encodeURI('?' + value).substring(1) });
                        console.log(err)
                        expect(req.query.color).to.deep.equal({ a: 'hello', b: 'to you' });
                    });

                });

            });

        });

        describe('requestBody', () => {
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

            it('deserializes primitive string', () => {
                appJson.schema = numSchema;
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ req ] = operation.request({ body: '1', headers: { 'content-type': 'application/json' } });
                expect(req.body).to.equal(1);
            });

            it('does not deserialize array elements', () => {
                appJson.schema = arrSchema;
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ , err ] = operation.request({ body: ['1', '2', '3'], headers: { 'content-type': 'application/json' } });
                expect(err).to.match(/at: 0\s+Expected a number/);
                expect(err.count).to.equal(3);
            });

            it('does not deserialize object elements', () => {
                appJson.schema = objSchema;
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ , err ] = operation.request({ body: { R: '50', G: '100', B: '150' }, headers: { 'content-type': 'application/json' } });
                expect(err).to.match(/at: R\s+Expected a number/);
                expect(err.count).to.equal(3);
            });

            it('validates missing required request body', () => {
                def.requestBody.required = true;
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ , err ] = operation.request({});
                expect(err).to.match(/Missing required request body/);
            });

            it('matches correct media type', () => {
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ req ] = operation.request({ body: { json: 50 }, headers: { 'content-type': 'application/json' } });
                expect(req.body).to.deep.equal({ json: 50 });
            });

            it('matches correct media type with custom subtype', () => {
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ req ] = operation.request({ body: { star: 50 }, headers: { 'content-type': 'application/custom' } });
                expect(req.body).to.deep.equal({ star: 50 });
            });

            it('limits validations if exact match media type found', () => {
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ , err ] = operation.request({ body: { star: 50 }, headers: { 'content-type': 'application/json' } });
                expect(err).to.match(/at: star\s+Property not allowed/);
            });

            it('matches multiple media types but actual content fails for each media type', () => {
                const [ operation ] = Enforcer.v3_0.Operation(def);
                const [ , err ] = operation.request({ body: { number: 50 }, headers: { 'content-type': 'application/custom' } });
                expect(err).to.match(/For Content-Type application\/\*/);
                expect(err).to.match(/For Content-Type \*\/\*/);
            });

            it('can produce 415 status code error if content type unsupported', () => {
                const [ operation ] = Enforcer.v3_0.Operation(def = {
                    requestBody: {
                        content: {
                            'text/plain': textPlain
                        }
                    },
                    responses: { 200: { description: '' } }
                });
                const [ , err ] = operation.request({ body: { number: 50 }, headers: { 'content-type': 'application/json' } });
                expect(err).to.match(/Content-Type not accepted/);
                expect(err.statusCode).to.equal(415);
            });

        });

    });

    describe('definition', () => {
        const responses = { default: { description: '' } };

        describe('callbacks', () => {

            it('is not allowed for v2', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    callbacks: {},
                    responses
                });
                expect(err).to.match(/Property not allowed: callbacks/);
            });

            it('can be an object map of valid callback objects', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    callbacks: {
                        eventX: {
                            expression: {
                                get: {
                                    responses: {
                                        default: {
                                            description: 'ok'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an object map of valid callback objects', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    callbacks: {
                        eventX: {
                            expression: {
                                get: {
                                }
                            }
                        }
                    },
                    responses
                });
                expect(err).to.match(/Missing required property: responses/);
            });

        });

        describe('consumes', () => {

            it('is not valid for v3', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    consumes: [],
                    responses
                });
                expect(err).to.match(/Property not allowed: consumes/);
            });

            it('can be an array of strings for v2', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    consumes: ['application/json'],
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    consumes: {},
                    responses
                });
                expect(err).to.match(/Value must be an array/);
            });

            it('must be an array of strings', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    consumes: [1],
                    responses
                });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('deprecated', () => {

            it('can be a boolean', () => {
                const [ def ] = Enforcer.v2_0.Operation({
                    deprecated: true,
                    responses
                });
                expect(def.deprecated).to.equal(true);
            });

            it('must be a boolean', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    deprecated: 1,
                    responses
                });
                expect(err).to.match(/Value must be a boolean/);
            });

            it('defaults to false', () => {
                const [ def ] = Enforcer.v2_0.Operation({
                    responses
                });
                expect(def.deprecated).to.equal(false);
            });

        });

        describe('description', () => {

            it('can be a string', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    description: '',
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('cannot be a number', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    description: 1,
                    responses
                });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('externalDocs', () => {

            it('can be a valid external documentation object', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    externalDocs: {
                        url: ''
                    },
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be a valid external documentation object', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    externalDocs: {},
                    responses
                });
                expect(err).to.match(/Missing required property: url/);
            });

        });

        describe('operationId', () => {

            it('can be a string', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    operationId: 'a',
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be a string', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    operationId: 1,
                    responses
                });
                expect(err).to.match(/Value must be a string/);
            });

            it('must be unique among all operations', () => {
                const [ , err ] = Enforcer.v2_0.PathItem({
                    get: {
                        operationId: 'a',
                        responses
                    },
                    put: {
                        operationId: 'a',
                        responses
                    }
                });
                expect(err).to.match(/The operationId must be unique/);
            });

        });

        describe('parameters', () => {

            it('can be an array of parameter objects', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    parameters: [
                        { name: 'x', in: 'path', required: true, type: 'string' }
                    ],
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an array of parameter objects', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    parameters: [{}],
                    responses
                });
                expect(err).to.match(/Missing required properties: in, name, type/);
            });

            it('cannot have duplicate parameters', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    parameters: [
                        { name: 'x', in: 'path', required: true, type: 'string' },
                        { name: 'x', in: 'path', required: true, type: 'string' }
                    ],
                    responses
                });
                expect(err).to.match(/Parameter name must be unique per location/);
            });

            it('can only have one body parameter for v2', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    parameters: [
                        { name: 'x', in: 'body', type: 'string' },
                        { name: 'y', in: 'body', type: 'string' }
                    ],
                    responses
                });
                expect(err).to.match(/Only one body parameter allowed/);
            });

            it('cannot have both formData and body', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    parameters: [
                        { name: 'x', in: 'body', type: 'string' },
                        { name: 'y', in: 'formData', type: 'string' }
                    ],
                    responses
                });
                expect(err).to.match(/Cannot have parameters in "body" and "formData" simultaneously/);

            })

        });

        describe('produces', () => {

            it('is not valid for v3', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    produces: [],
                    responses
                });
                expect(err).to.match(/Property not allowed: produces/);
            });

            it('can be an array of strings for v2', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    produces: ['application/json'],
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    produces: {},
                    responses
                });
                expect(err).to.match(/Value must be an array/);
            });

            it('must be an array of strings', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    produces: [1],
                    responses
                });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('requestBody', () => {

            it('is not valid for v2', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    requestBody: {},
                    responses
                });
                expect(err).to.match(/Property not allowed: requestBody/);
            });

            it('can be a valid request body object for v3', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    requestBody: {
                        content: {
                            'application/json': {
                            }
                        }
                    },
                    responses
                });
                expect(err).to.be.undefined;
            });

        });

        describe('responses', () => {

            it('is required', () => {
                const [ , err ] = Enforcer.v3_0.Operation({});
                expect(err).to.match(/Missing required property: responses/);
            });

            it('can be a valid response object', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    responses
                });
                expect(err).to.be.undefined;
            });

            describe('codes', () => {

                it('default ok', () => {
                    const [ , err ] = Enforcer.v2_0.Operation({
                        responses: {
                            default: { description: '' }
                        }
                    });
                    expect(err).to.be.undefined
                });

                it('200 ok', () => {
                    const [ , err ] = Enforcer.v2_0.Operation({
                        responses: {
                            200: { description: '' }
                        }
                    });
                    expect(err).to.be.undefined
                });

                it('2XX not ok for v2', () => {
                    const [ , err ] = Enforcer.v2_0.Operation({
                        responses: {
                            '2XX': { description: '' }
                        }
                    });
                    expect(err).to.match(/Property not allowed: 2XX/);
                    expect(err.count).to.equal(1);
                });

                it('2XX ok for v3', () => {
                    const [ , err ] = Enforcer.v3_0.Operation({
                        responses: {
                            '2XX': { description: '' }
                        }
                    });
                    expect(err).to.be.undefined
                });

                it('2XX works for operation.response', () => {
                    const [ operation ] = Enforcer.v3_0.Operation({
                        responses: {
                            '200': { description: 'ok' },
                            '2XX': { description: '' }
                        }
                    });

                    const [ , err ] = operation.response(204)
                    expect(err).to.be.undefined
                });

                it('600 not ok', () => {
                    const [ , err ] = Enforcer.v2_0.Operation({
                        responses: {
                            '600': { description: '' }
                        }
                    });
                    expect(err).to.match(/Property not allowed: 600/);
                });

            });

        });

        describe('schemes', () => {

            it('is not allowed for v3', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    schemes: [],
                    responses
                });
                expect(err).to.match(/Property not allowed: schemes/);
            });

            it('can be an array of valid strings', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    schemes: ['http'],
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an array of strings', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    schemes: [1],
                    responses
                });
                expect(err).to.match(/Value must be a string/);
            });

            it('must match enum values', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    schemes: ['bob'],
                    responses
                });
                expect(err).to.match(/Value must be one of: http, https, ws, wss/);
            });

        });

        describe('security', () => {

            it('can be an array', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    security: [],
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    security: {},
                    responses
                });
                expect(err).to.match(/Value must be an array/);
            });

        });

        describe('servers', () => {

            it('is not allowed in v2', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    servers: [],
                    responses
                });
                expect(err).to.match(/Property not allowed: servers/);
            });

            it('can be an array of valid server objects', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    servers: [{
                        url: ''
                    }],
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an array of valid server objects', () => {
                const [ , err ] = Enforcer.v3_0.Operation({
                    servers: [{}],
                    responses
                });
                expect(err).to.match(/Missing required property: url/);
            });

        });

        describe('summary', () => {

            it('must be a string', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    summary: 1,
                    responses
                });
                expect(err).to.match(/Value must be a string/);
            });

            it('should be less than 120 characters', () => {
                const [ , err, warning ] = Enforcer.v2_0.Operation({
                    summary: '123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 ',
                    responses
                });
                expect(err).to.be.undefined;
                expect(warning).to.match(/Value should be less than 120 characters/);
            });

        });

        describe('tags', () => {

            it('allows an array of strings', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    tags: ['a', 'b'],
                    responses
                });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    tags: 1,
                    responses
                });
                expect(err).to.match(/Value must be an array/);
            });

            it('must be an array of strings', () => {
                const [ , err ] = Enforcer.v2_0.Operation({
                    tags: [1],
                    responses
                });
                expect(err).to.match(/Value must be a string/);
            });

        });

    });

    describe('response', () => {

        function getOperationWithResponseHeader(version, definition) {
            const mode = version === 2 ? 'v2_0' : 'v3_0';
            const [ operation, err ] = new Enforcer[mode].Operation({
                responses: {
                    200: {
                        description: 'Success',
                        headers: definition
                    }
                }
            });
            if (err) throw Error(err);
            return operation;
        }

        describe('v2', () => {

            describe('body', () => {
                let operation;
                const responseSchema = {
                    type: 'string',
                    format: 'date'
                };

                before(() => {
                    [ operation ] = new Enforcer.v2_0.Operation({
                        responses: {
                            200: {
                                description: 'Success',
                                schema: responseSchema
                            },
                            default: {
                                description: 'Success',
                                schema: {
                                    type: 'string',
                                    format: 'date-time'
                                }
                            }
                        }
                    })
                });

                it('can process via 200 response object', () => {
                    const date = new Date('2000-01-01T00:00:00.000Z');
                    const [ res ] = operation.response(200, date);
                    expect(res.schema.toObject()).to.deep.equal(responseSchema);
                    expect(res.body).to.equal('2000-01-01');
                });

                it('can process via default response object', () => {
                    const date = new Date('2000-01-01T00:00:00.000Z');
                    const [ res ] = operation.response('default', date);
                    expect(res.body).to.equal('2000-01-01T00:00:00.000Z');
                });

                it('will validate the body', () => {
                    const [ , err ] = operation.response(200, 'hello');
                    expect(err).to.match(/at: body\s+Expected a valid date object/)
                });

                it('does not validate or serialize for file', () => {
                    const [ operation ] = new Enforcer.v2_0.Operation({
                        responses: {
                            200: {
                                description: 'Success',
                                schema: { type: 'file' }
                            }
                        }
                    });
                    const file = Symbol('file');
                    const [ res ] = operation.response(200, file);
                    expect(res.body).to.equal(file);
                });

            });

            describe('header', () => {

                it('can process headers', () => {
                    const operation = getOperationWithResponseHeader(2, {
                        expires: {
                            type: 'string',
                            format: 'date'
                        }
                    });
                    const date = new Date('2000-01-01T00:00:00.000Z');
                    const [ res ] = operation.response(200, undefined, { expires: date });
                    expect(res.headers.expires).to.equal('2000-01-01');
                });

                it('will auto populate header default', () => {
                    const operation = getOperationWithResponseHeader(2, {
                        expires: {
                            type: 'string',
                            format: 'date',
                            default: '2001-01-01'
                        }
                    });
                    const [ res ] = operation.response(200);
                    expect(res.headers.expires).to.equal('2001-01-01');
                });

                it('will validate the headers', () => {
                    const operation = getOperationWithResponseHeader(2, {
                        expires: {
                            type: 'string',
                            format: 'date'
                        }
                    });
                    const [ , err ] = operation.response(200, '', { expires: 'hello' });
                    expect(err).to.match(/at: headers > expires\s+Expected a valid date object/);
                });

                it('can handle an array of collectionFormat csv', () => {
                    const operation = getOperationWithResponseHeader(2, {
                        'x': {
                            collectionFormat: 'csv',
                            type: 'array',
                            items: { type: 'string' }
                        }
                    });
                    const [ res ] = operation.response(200, undefined, { x: ['a', 'b', 'c']});
                    expect(res.headers.x).to.equal('a,b,c');
                });

                it('can nested arrays', () => {
                    const operation = getOperationWithResponseHeader(2, {
                        'x': {
                            type: 'array',
                            collectionFormat: 'pipes',
                            items: {
                                type: 'array',
                                collectionFormat: 'ssv',
                                items: {
                                    type: 'array',
                                    collectionFormat: 'tsv',
                                    items: {
                                        type: 'array',
                                        collectionFormat: 'csv',
                                        items: { type: 'string' }
                                    }
                                }
                            }
                        }
                    });
                    const ar = [
                        [
                            [
                                ['a', 'b'], // comma separated value
                                // tab delimiter
                                ['c', 'd']
                            ], // space delimiter
                            [
                                ['e', 'f', 'g']
                            ]
                        ], // pipe delimiter
                        [
                            [
                                ['h']
                            ]
                        ]
                    ];
                    const [ res ] = operation.response(200, undefined, { x: ar});
                    expect(res.headers.x).to.equal('a,b\tc,d e,f,g|h');
                });

            });

        });

        describe('v3', () => {

            describe('body', () => {

                it('uses headers to determine content type', () => {
                    const [ operation ] = Enforcer.v3_0.Operation({
                        responses: {
                            200: {
                                description: 'success',
                                content: {
                                    'text/plain': {
                                        schema: { type: 'string', format: 'date' }
                                    },
                                    'text/other': {
                                        schema: { type: 'string', format: 'date-time' }
                                    }
                                }
                            }
                        }
                    });

                    const date = new Date('2000-01-01T00:00:00.000Z');

                    const [ res1 ] = operation.response(200, date, { 'content-type': 'text/plain' });
                    expect(res1.schema.format).to.equal('date');
                    expect(res1.body).to.equal('2000-01-01');

                    const [ res2 ] = operation.response(200, date, { 'content-type': 'text/other' });
                    expect(res2.schema.format).to.equal('date-time');
                    expect(res2.body).to.equal('2000-01-01T00:00:00.000Z');
                });

                it('will auto select the only content type if header does not define to use it', () => {
                    const [ operation ] = Enforcer.v3_0.Operation({
                        responses: {
                            200: {
                                description: 'success',
                                content: {
                                    'text/plain': {
                                        schema: { type: 'string', format: 'date' }
                                    }
                                }
                            }
                        }
                    });
                    const date = new Date('2000-01-01T00:00:00.000Z');
                    const [ res ] = operation.response(200, date);
                    expect(res.body).to.equal('2000-01-01');
                });

                it('produces warning if specified content-type is not supported', () => {
                    const [ operation ] = Enforcer.v3_0.Operation({
                        responses: {
                            200: {
                                description: 'success',
                                content: {}
                            }
                        }
                    });
                    const [ , err, warn ] = operation.response(200, '', { 'content-type': 'application/json' });
                    expect(err).to.be.undefined;
                    expect(warn).to.match(/Content type specified is not defined as a possible mime-type/)
                });

                it('can handle response with non-plain objects', () => {
                    const [ operation ] = Enforcer.v3_0.Operation({
                        responses: {
                            200: {
                                description: 'success',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                name: { type: 'string' },
                                                birthdate: { type: 'string', format: 'date' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });

                    function Person (name, birthdate) {
                        this.name = name;
                        this.birthdate = birthdate;
                    }

                    Person.prototype.age = function () {
                        const diff = Date.now() - +this.birthdate;
                        const date = new Date(diff);
                        return date.getUTCFullYear() - 1970;
                    };

                    const bob = new Person('Bob', new Date('2000-01-01T00:00:00.000Z'));
                    const [ res ] = operation.response(200, bob);
                    expect(res.body).to.deep.equal({
                        name: 'Bob',
                        birthdate: '2000-01-01'
                    });
                });

                it('will not convert buffer to string is Schema.Value has serialize false', () => {
                    const [ operation ] = Enforcer.v3_0.Operation({
                        responses: {
                            200: {
                                description: 'success',
                                content: {
                                    'image/jpeg': {
                                        schema: {
                                            type: 'string',
                                            format: 'binary'
                                        }
                                    }
                                }
                            }
                        }
                    });
                    const buffer = Buffer.from('hello');
                    const [ res1 ] = operation.response(200, buffer);
                    const [ res2 ] = operation.response(200, new Enforcer.v3_0.Schema.Value(buffer, { serialize: false }));
                    expect(typeof res1.body).to.equal('string');
                    expect(res2.body).to.equal(buffer);
                })

                it('will not allow sending write only properties', () => {
                    const [ operation ] = Enforcer.v3_0.Operation({
                        responses: {
                            200: {
                                description: 'success',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                read: {
                                                    type: 'string',
                                                    readOnly: true
                                                },
                                                write: {
                                                    type: 'string',
                                                    writeOnly: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    const [ res, err ] = operation.response(200, { read: 'abc', write: 'abc'})
                    expect(res).to.be.undefined
                    expect(err).to.match(/Cannot read from write only properties: write/)
                })

            });

            describe('headers', () => {

                it('can stringify a primitive', () => {
                    const operation = getOperationWithResponseHeader(3, {
                        exists: {
                            schema: { type: 'boolean' }
                        }
                    });
                    const [ res ] = operation.response(200, '', { exists: true });
                    expect(res.headers.exists).to.equal('true');
                });

                it('can stringify an array of items', () => {
                    const operation = getOperationWithResponseHeader(3, {
                        numbers: {
                            schema: {
                                type: 'array',
                                items: { type: 'number' }
                            }
                        }
                    });
                    const [ res ] = operation.response(200, '', { numbers: [1, 2, 3] });
                    expect(res.headers.numbers).to.equal('1,2,3');
                });

                it('can stringify an array of items exploded', () => {
                    const operation = getOperationWithResponseHeader(3, {
                        numbers: {
                            explode: true,
                            schema: {
                                type: 'array',
                                items: { type: 'number' }
                            }
                        }
                    });
                    const [ res ] = operation.response(200, '', { numbers: [1, 2, 3] });
                    expect(res.headers.numbers).to.equal('1,2,3');
                });

                it('can stringify an object', () => {
                    const operation = getOperationWithResponseHeader(3, {
                        color: {
                            schema: {
                                type: 'object',
                                properties: {
                                    R: { type: 'number' },
                                    G: { type: 'number' },
                                    B: { type: 'number' }
                                }
                            }
                        }
                    });
                    const [ res ] = operation.response(200, '', { color: { R: 50, G: 100, B: 150 } });
                    expect(res.headers.color).to.equal('R,50,G,100,B,150');
                });

                it('can stringify an object exploded', () => {
                    const operation = getOperationWithResponseHeader(3, {
                        color: {
                            explode: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    R: { type: 'number' },
                                    G: { type: 'number' },
                                    B: { type: 'number' }
                                }
                            }
                        }
                    });
                    const [ res ] = operation.response(200, '', { color: { R: 50, G: 100, B: 150 } });
                    expect(res.headers.color).to.equal('R=50,G=100,B=150');
                });

                it('cannot do deep objects', () => {
                    const operation = getOperationWithResponseHeader(3, {
                        color: {
                            explode: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    x: {
                                        type: 'object',
                                        properties: {
                                            y: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    const [ , err ] = operation.response(200, '', { color: { x: { y: 5 } } });
                    expect(err).to.match(/at: headers > color > x\s+Unable to stringify value/)
                });

                it('does not care about case of keys in headers object', () => {
                    const operation = getOperationWithResponseHeader(3, {
                        CaseInsensitive: {
                            schema: { type: 'string' }
                        }
                    });
                    const [ res ] = operation.response(200, '', { CASEInsensitive: 'success' });
                    expect(res.headers['CaseInsensitive']).to.equal('success');
                });

            });

        });

    });

});
