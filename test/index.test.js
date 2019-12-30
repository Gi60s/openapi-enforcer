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
const assert            = require('../src/assert');
const DefinitionBuilder = require('../src/definition-builder');
const Enforcer          = require('../index');
const expect            = require('chai').expect;

describe('index/toPlainObject', () => {

    it('returns primitive as is', () => {
        const result = Enforcer.toPlainObject('hello');
        expect(result).to.equal('hello');
    });

    it('can handle plain object', () => {
        const o = { a: 1, b: 2, c: [1, 2] };
        const result = Enforcer.toPlainObject(o);
        expect(result).to.deep.equal(o);
    });

    it('can handle array', () => {
        const o = [1, 2, { a: 1, b: 2 }];
        const result = Enforcer.toPlainObject(o);
        expect(result).to.deep.equal(o);
    });

    describe('non plain object', () => {
        const d = new Date();

        function A () {
            this.a = 1;
            this.d = d;

            Object.defineProperty(this, 'c', {
                enumerable: true,
                value: 'c'
            })
        }
        A.prototype.f = function () { return 'function' };
        A.prototype.s = 'string';
        Object.defineProperty(A.prototype, 'b', { enumerable: true, value: true });

        it('leaves Date alone', () => {
            const o = { d: d };
            const result = Enforcer.toPlainObject(o);
            expect(result).to.deep.equal(o);
            expect(result.d.constructor).to.equal(Date);
        });

        it('can convert non-plain object', () => {
            const result = Enforcer.toPlainObject(new A());
            expect(result).to.deep.equal({
                a: 1,
                d: d,
                c: 'c'
            });
            expect(result.constructor).to.equal(Object);
        });

        it('can convert non-plain object including inherited', () => {
            const result = Enforcer.toPlainObject(new A(), { allowInheritedProperties: true });
            expect(result).to.deep.equal({
                a: 1,
                d: d,
                c: 'c',
                s: 'string',
                b: true
            });
            expect(result.constructor).to.equal(Object);
        });

        it('can preserve non-plain object', () => {
            const a = new A();
            const o = { a: a };
            const result = Enforcer.toPlainObject(o, { preserve: [ A ] });
            expect(result).to.deep.equal({ a: a });
            expect(result).not.to.equal(o);
            expect(result.a.constructor).to.equal(A);
        });

    });

});

describe('index/request', () => {

    describe('bad request', () => {

        it('can properly handler 404 (bad path)', async () => {
            const def = new DefinitionBuilder(2)
                .addPath('/', 'get')
                .build();
            const enforcer = await Enforcer(def);
            const [ , err ] = enforcer.request({ path: '/dne' });
            expect(err).to.match(/Path not found/);
            expect(err.statusCode).to.equal(404);
        });

        it('can properly handler 405 (bad method)', async () => {
            const def = new DefinitionBuilder(2)
                .addPath('/', 'get')
                .build();
            const enforcer = await Enforcer(def);
            const [ , err ] = enforcer.request({ path: '/', method: 'post' });
            expect(err).to.match(/Method not allowed/);
            expect(err.statusCode).to.equal(405);
            expect(err.headers).to.deep.equal({ Allow: 'GET' });
        });

    });

    describe('path parameters', () => {

        describe('variations', () => {

            it('/{name}', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/{name}', 'get', { name: 'name', in: 'path', required: true, type: 'string' })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/bob' });
                expect(req.path).to.deep.equal({ name: 'bob' })
            });

            it('/{a},{b}.{c}-{d}', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/{a},{b}.{c}-{d}', 'get',
                        { name: 'a', in: 'path', required: true, type: 'string' },
                        { name: 'b', in: 'path', required: true, type: 'string' },
                        { name: 'c', in: 'path', required: true, type: 'string' },
                        { name: 'd', in: 'path', required: true, type: 'string' })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req] = enforcer.request({ path: '/paths,have.parameters-sometimes' });
                expect(req.path).to.deep.equal({ a: 'paths', b: 'have', c: 'parameters', d: 'sometimes' })
            });

            it('/{a}/b/{c}/{d}/e', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/{a}/b/{c}/{d}/e', 'get',
                        { name: 'a', in: 'path', required: true, type: 'string' },
                        { name: 'c', in: 'path', required: true, type: 'string' },
                        { name: 'd', in: 'path', required: true, type: 'string' })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req] = enforcer.request({ path: '/a/b/c/d/e' });
                expect(req.path).to.deep.equal({ a: 'a', c: 'c', d: 'd' })
            });

        });

        describe('v2', () => {

            it('will serialize values', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/{array}/{num}/{boolean}/{date}/{dateTime}/{binary}/{byte}', 'get',
                        { name: 'array', in: 'path', required: true, type: 'array', items: { type: 'integer' } },
                        { name: 'num', in: 'path', required: true, type: 'number' },
                        { name: 'boolean', in: 'path', required: true, type: 'boolean' },
                        { name: 'date', in: 'path', required: true, type: 'string', format: 'date' },
                        { name: 'dateTime', in: 'path', required: true, type: 'string', format: 'date-time' },
                        { name: 'binary', in: 'path', required: true, type: 'string', format: 'binary' },
                        { name: 'byte', in: 'path', required: true, type: 'string', format: 'byte' })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '1,2,3/123/false/2000-01-01/2000-01-01T01:02:03.456Z/00000010/aGVsbG8=' });
                expect(req.path).to.deep.equal({
                    array: [1,2,3],
                    num: 123,
                    boolean: false,
                    date: new Date('2000-01-01'),
                    dateTime: new Date('2000-01-01T01:02:03.456Z'),
                    binary: Buffer.from([2]),
                    byte: Buffer.from('aGVsbG8=', 'base64')
                })
            });

            it('will serialize nested arrays', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/{array}', 'get', {
                        name: 'array',
                        in: 'path',
                        required: true,
                        type: 'array',
                        collectionFormat: 'pipes',
                        items: {
                            type: 'array',
                            items: {
                                type: 'array',
                                collectionFormat: 'ssv',
                                items: {
                                    type: 'number'
                                }
                            }
                        }
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/1 2 3,4 5|6,7 8' });
                expect(req.path).to.deep.equal({
                    array: [
                        [
                            [1,2,3],
                            [4,5]
                        ],
                        [
                            [6],
                            [7,8]
                        ]
                    ],
                })
            });

        });

        describe('v3', () => {

            it('can handle complex path', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/users{id}', 'get', {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'array', items: { type: 'number' } },
                        style: 'matrix',
                        explode: true
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/users;id=1;id=2' });
                expect(req.path.id).to.deep.equal([1,2]);
            });

            describe('style: simple', () => {

                it('primitive', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'simple',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/5' });
                    expect(req.path.value).to.equal(5);
                });

                it('primitive explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'simple',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/5' });
                    expect(req.path.value).to.equal(5);
                });

                it('array', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'simple',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('array explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'simple',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('object', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'simple',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/a,1,b,2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'simple',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/a=1,b=2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

            });

            describe('style: label', () => {

                it('primitive', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'label',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/.5' });
                    expect(req.path.value).to.equal(5);
                });

                it('primitive explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'label',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/.5' });
                    expect(req.path.value).to.equal(5);
                });

                it('array', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'label',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/.3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('array explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'label',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/.3.4.5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('object', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'label',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/.a,1,b,2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'label',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/.a=1.b=2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

            });

            describe('style: matrix', () => {

                it('primitive', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'matrix',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/;value=5' });
                    expect(req.path.value).to.equal(5);
                });

                it('primitive explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'matrix',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/;value=5' });
                    expect(req.path.value).to.equal(5);
                });

                it('array', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'matrix',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/;value=3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('array explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'matrix',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/;value=3;value=4;value=5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('object', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'matrix',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/;value=a,1,b,2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'matrix',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/;a=1;b=2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

            });

        });

    });

    describe('query parameters', () => {

        describe('v2', () => {

            describe('collectionFormat multi', () => {

                it('can parse multi input', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' }
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?item=1&item=2&item=3' });
                    expect(req.query.item).to.deep.equal([1, 2, 3]);
                });

                it('can define multi that does not receive input', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' }
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/' });
                    expect(req.query).not.to.haveOwnProperty('item');
                });

                it('can allow empty value', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' },
                            allowEmptyValue: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?item' });
                    expect(req.query).to.haveOwnProperty('item');
                    expect(req.query.item).to.deep.equal(['']);
                });

                it('can produce error with empty value', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' },
                            allowEmptyValue: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ , err ] = enforcer.request({ path: '/?item' });
                    expect(err).to.match(/Empty value not allowed/);
                });

            });

            it('can have value', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'query',
                        type: 'string',
                        allowEmptyValue: true
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/?value=yes' });
                expect(req.query.value).to.equal('yes');
            });

            it('can have empty value', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'query',
                        type: 'string',
                        allowEmptyValue: true
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/?value' });
                expect(req.query).to.haveOwnProperty('value');
                expect(req.query.value).to.equal('');
            });

        });

        describe('v3', () => {

            describe('style: form', () => {

                it('primitive', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: false
                        })
                        .addPath('/', 'get')
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.equal(2);
                });

                it('primitive explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.equal(2);
                });

                it('primitive allowEmptyValue', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: false,
                            allowEmptyValue: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value' });
                    expect(req.query.value).to.equal('');
                });

                it('primitive do not allowEmptyValue', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ , err ] = enforcer.request({ path: '/?value' });
                    expect(err).to.match(/Empty value not allowed/);
                });

                it('array', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1,2' });
                    expect(req.query.value).to.deep.equal([1,2]);
                });

                it('array explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.deep.equal([1, 2]);
                });

                it('array allowEmptyValue', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: false,
                            allowEmptyValue: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value' });
                    expect(req.query.value).to.deep.equal(['']);
                });

                it('array do not allowEmptyValue', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ , err ] = enforcer.request({ path: '/?value' });
                    expect(err).to.match(/Empty value not allowed/);
                });

                it('object', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'form',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=a,1,b,2' });
                    expect(req.query.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get',
                            {
                                name: 'x',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    additionalProperties: false,
                                    properties: {
                                        a: { type: 'number' },
                                        b: { type: 'number' }
                                    }
                                },
                                style: 'form',
                                explode: true
                            },{
                                name: 'y',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        c: { type: 'string' },
                                        d: { type: 'string' }
                                    }
                                },
                                style: 'form',
                                explode: true
                            })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?a=1&b=2&c=3&d=4' });
                    expect(req.query).to.deep.equal({
                        x: { a:1, b:2 },
                        y: { a:'1', b: '2', c:'3', d:'4' }
                    });
                });

                it('object explode with invalid values', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get',
                            {
                                name: 'x',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        a: { type: 'number' },
                                        b: { type: 'number' }
                                    }
                                },
                                style: 'form',
                                explode: true
                            },{
                                name: 'y',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    additionalProperties: false,
                                    properties: {
                                        c: { type: 'number' },
                                        d: { type: 'number' }
                                    }
                                },
                                style: 'form',
                                explode: true
                            })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ , err ] = enforcer.request({ path: '/?a=bob&b=2&c=3&d=4' });
                    expect(err).to.match(/Received unexpected parameters: a, b/);
                });

                it('object allowEmptyValue', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'form',
                            explode: false,
                            allowEmptyValue: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=a,,b,2' });
                    expect(req.query.value).to.deep.equal({ a: '', b: 2 });
                });

                it('object do not allowEmptyValue', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'form',
                            explode: false,
                            allowEmptyValue: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ , err ] = enforcer.request({ path: '/?value=a,,b,2' });
                    expect(err).to.match(/Empty value not allowed/);
                });

            });

            describe('style: spaceDelimited', () => {

                it('does not allow primitives', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'spaceDelimited',
                            explode: false
                        })
                        .build();
                    assert.willReject(() => Enforcer(def), /Style "spaceDelimited" is incompatible with schema type: number/);
                });

                it('does not allow exploded primitives', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'spaceDelimited',
                            explode: true
                        })
                        .build();
                    assert.willReject(() => Enforcer(def), /Style "spaceDelimited" is incompatible with schema type: number/);
                });

                it('array', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'spaceDelimited',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1 2' });
                    expect(req.query.value).to.deep.equal([1,2]);
                });

                it('array explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'spaceDelimited',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.deep.equal([1, 2]);
                });

                it('does not allow objects', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'spaceDelimited',
                            explode: false
                        })
                        .build();
                    assert.willReject(() => Enforcer(def), /Style "spaceDelimited" is incompatible with schema type: object/);
                });

                it('does not allow exploded objects', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get',
                            {
                                name: 'x',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        a: { type: 'number' },
                                        b: { type: 'number' }
                                    }
                                },
                                style: 'spaceDelimited',
                                explode: true
                            },{
                                name: 'y',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        c: { type: 'number' },
                                        d: { type: 'number' }
                                    }
                                },
                                style: 'spaceDelimited',
                                explode: true
                            })
                        .build();
                    assert.willReject(() => Enforcer(def), /Style "spaceDelimited" is incompatible with schema type: object/);
                });

            });

            describe('style: pipeDelimited', () => {

                it('does not allow primitives', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'pipeDelimited',
                            explode: false
                        })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "pipeDelimited" is incompatible with schema type: number/);
                });

                it('does not allow exploded primitives', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'pipeDelimited',
                            explode: true
                        })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "pipeDelimited" is incompatible with schema type: number/);
                });

                it('array', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'pipeDelimited',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1|2' });
                    expect(req.query.value).to.deep.equal([1,2]);
                });

                it('array explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'pipeDelimited',
                            explode: true
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.deep.equal([1, 2]);
                });

                it('does not allow objects', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'pipeDelimited',
                            explode: false
                        })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "pipeDelimited" is incompatible with schema type: object/);
                });

                it('does not allow exploded objects', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get',
                            {
                                name: 'x',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        a: { type: 'number' },
                                        b: { type: 'number' }
                                    }
                                },
                                style: 'pipeDelimited',
                                explode: true
                            },{
                                name: 'y',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        c: { type: 'number' },
                                        d: { type: 'number' }
                                    }
                                },
                                style: 'pipeDelimited',
                                explode: true
                            })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "pipeDelimited" is incompatible with schema type: object/);
                });

            });

            describe('style: deepObject', () => {

                it('does not allow primitives', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'deepObject',
                            explode: false
                        })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "deepObject" is incompatible with schema type: number/);
                });

                it('does not allow exploded primitives', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'deepObject',
                            explode: true
                        })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "deepObject" is incompatible with schema type: number/);
                });

                it('does not allow arrays', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'deepObject',
                            explode: false
                        })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "deepObject" is incompatible with schema type: array/);
                });

                it('does not allow exploded arrays', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'deepObject',
                            explode: true
                        })
                        .build();
                    assert.willReject(() => Enforcer(def),/Style "deepObject" is incompatible with schema type: array/);
                });

                it('object', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            style: 'deepObject',
                            explode: false
                        })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?value[a]=1&value[b]=2' });
                    expect(req.query.value).to.deep.equal({ a: 1, b: 2 });
                });

                it('object explode', async () => {
                    const def = new DefinitionBuilder(3)
                        .addParameter('/', 'get',
                            {
                                name: 'x',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        a: { type: 'number' },
                                        b: { type: 'number' }
                                    }
                                },
                                style: 'deepObject',
                                explode: true
                            },{
                                name: 'y',
                                in: 'query',
                                schema: {
                                    type: 'object',
                                    properties: {
                                        c: { type: 'number' },
                                        d: { type: 'number' }
                                    }
                                },
                                style: 'deepObject',
                                explode: true
                            })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/?x[a]=1&x[b]=2&y[c]=3&y[d]=4' });
                    expect(req.query).to.deep.equal({ x: { a:1, b:2 }, y: { c:3, d:4 } });
                });

            });

        });

    });

    describe('header parameters', () => {

        it('has case insensitive header names', async () => {
            const def = new DefinitionBuilder(2)
                .addParameter('/', 'get', {
                    name: 'vALUe',
                    in: 'header',
                    type: 'string'
                })
                .build();
            const enforcer = await Enforcer(def);
            const [ req ] = enforcer.request({ path: '/', headers: { VAlue: 'abc' } });
            expect(req.headers.value).to.equal('abc');
        });

        it('can escalate a warning', async () => {
            const def = new DefinitionBuilder(2)
                .addParameter('/', 'get', {
                    name: 'vALUe',
                    in: 'header',
                    type: 'string'
                })
                .build();
            const results = await Enforcer(def, {
                fullResult: true,
                componentOptions: {
                    exceptionEscalateCodes: ['WPAR001']
                }
            });
            expect(results.error).to.match(/Header names are case insensitive/);
        });

        it('cannot have property allowEmptyValue', async () => {
            const def = new DefinitionBuilder(2)
                .addParameter('/', 'get', {
                    name: 'value',
                    in: 'header',
                    type: 'string',
                    allowEmptyValue: true
                })
                .build();
            assert.willReject(() => Enforcer(def),/Property not allowed: allowEmptyValue/);
        });

        it('cannot have empty header string', async () => {
            const def = new DefinitionBuilder(2)
                .addParameter('/', 'get', {
                    name: 'value',
                    in: 'header',
                    type: 'string'
                })
                .build();
            const enforcer = await Enforcer(def);
            const [ , err ] = enforcer.request({ path: '/', headers: { value: '' } });
            expect(err).to.match(/Empty value not allowed/);
        });


        describe('v2', () => {

            it('will deserialize date value', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        type: 'string',
                        format: 'date'
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { value: '2000-01-01' } });
                expect(req.headers.value).to.deep.equal(new Date('2000-01-01'));
            });

            it('will deserialize array of numbers', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        type: 'array',
                        items: { type: 'number' }
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { value: '1,2,3' } });
                expect(req.headers.value).to.deep.equal([1,2,3]);
            });

            it('will not allow multi collection format', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/', 'get', {
                        name: 'item',
                        in: 'header',
                        type: 'array',
                        collectionFormat: 'multi',
                        items: { type: 'number' }
                    })
                    .build();
                assert.willReject(() => Enforcer(def),/Value must be one of: csv, ssv, tsv, pipes. Received: "multi"/);
            });

        });

        describe('v3', () => {

            it('primitive', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'number' },
                        explode: false
                    })
                    .addPath('/', 'get')
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { value: '1' } });
                expect(req.headers.value).to.equal(1);
            });

            it('primitive explode', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'number' },
                        explode: true
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { value: '1' } });
                expect(req.headers.value).to.equal(1);
            });

            it('array', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: false
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { value: '1,2,3' } });
                expect(req.headers.value).to.deep.equal([1,2,3]);
            });

            it('array explode', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: true
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { value: '1,2,3' } });
                expect(req.headers.value).to.deep.equal([1,2,3]);
            });

            it('object', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'number' },
                                b: { type: 'number' }
                            }
                        },
                        explode: false
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { value: 'a,1,b,2' } });
                expect(req.headers.value).to.deep.equal({a:1,b:2});
            });

            it('object explode', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get',
                        {
                            name: 'x',
                            in: 'header',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            explode: true
                        })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { x: 'a=1,b=2' } });
                expect(req.headers.x).to.deep.equal({ a:1, b:2 });
            });

        });

    });

    describe('cookie parameters', () => {

        describe('v2', () => {

            it('does not support cookie parameters', async () => {
                const def = new DefinitionBuilder(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        type: 'string'
                    })
                    .build();
                assert.willReject(() => Enforcer(def),/Value must be one of: body, formData, header, query, path. Received: "cookie"/);
            });

        });

        describe('v3', () => {

            it('primitive', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'number' },
                        explode: false
                    })
                    .addPath('/', 'get')
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { cookie: 'value=1' } });
                expect(req.cookie.value).to.equal(1);
            });

            it('primitive explode', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'number' },
                        explode: true
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { cookie: 'value=1' } });
                expect(req.cookie.value).to.equal(1);
            });

            it('array',async  () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: false
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { cookie: 'value=1,2,3' } });
                expect(req.cookie.value).to.deep.equal([1,2,3]);
            });

            it('array explode', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: true
                    })
                    .build();
                assert.willReject(() => Enforcer(def),/Cookies do not support exploded values for non-primitive schemas/);
            });

            it('object', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'number' },
                                b: { type: 'number' }
                            }
                        },
                        explode: false
                    })
                    .build();
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', headers: { cookie: 'value=a,1,b,2' } });
                expect(req.cookie.value).to.deep.equal({a:1,b:2});
            });

            it('object explode', async () => {
                const def = new DefinitionBuilder(3)
                    .addParameter('/', 'get',
                        {
                            name: 'x',
                            in: 'cookie',
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' },
                                    b: { type: 'number' }
                                }
                            },
                            explode: true
                        })
                    .build();
                assert.willReject(() => Enforcer(def),/Cookies do not support exploded values for non-primitive schemas/);
            });

        });

    });

    describe('body', () => {

        describe('v2', () => {

            describe('in body', () => {
                const arrSchema = {
                    type: 'array',
                    items: { type: 'number' }
                };
                const numSchema = { type: 'number' };
                const objSchema = {
                    type: 'object',
                        properties: {
                        a: { type: 'number' },
                        b: { type: 'number' }
                    }
                };

                it('requires the body to already be parsed', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'post', { name: 'x', in: 'body', schema: objSchema })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ , err ] = enforcer.request({ path: '/', method: 'post', body: '{"a":1,"b":2}' });
                    expect(err).to.match(/Expected an object/);
                });

                it('accepts object if schema is object', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'post', { name: 'x', in: 'body', schema: objSchema })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/', method: 'post', body: { a: 1, b: 2 } });
                    expect(req.body).to.deep.equal({ a: 1, b: 2 });
                });

                it('accepts array if schema is array', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'post', { name: 'x', in: 'body', schema: arrSchema })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/', method: 'post', body: [1, 2] });
                    expect(req.body).to.deep.equal([1,2]);
                });

                it('accepts string if schema is not object or array', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'post', { name: 'x', in: 'body', schema: numSchema })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/', method: 'post', body: '1' });
                    expect(req.body).to.equal(1);
                });

            });

            describe('in formData', () => {

                it('requires the body to be an object', async () => {
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'post', { name: 'x', in: 'formData', type: 'number' })
                        .build();
                    const enforcer = await Enforcer(def);
                    expect(() => enforcer.request({ path: '/', method: 'post', body: '1' })).to.throw(/Parameters in "formData" require that the provided body be a non-null object/);
                });

                it('deserializes and validates each property', async () => {
                    const d = new Date();
                    const def = new DefinitionBuilder(2)
                        .addParameter('/', 'post', { name: 'x', in: 'formData', type: 'number' })
                        .addParameter('/', 'post', { name: 'y', in: 'formData', type: 'string', format: 'date-time' })
                        .build();
                    const enforcer = await Enforcer(def);
                    const [ req ] = enforcer.request({ path: '/', method: 'post', body: { x: '1', y: d.toISOString() } });
                    expect(req.body).to.deep.equal({ x: 1, y: d });
                });

                describe('file', () => {

                    it('can consume multipart/form-data', async () => {
                        const def = new DefinitionBuilder(2).addPath('/', 'post').build();
                        const operation = def.paths['/'].post;
                        operation.consumes = ['multipart/form-data'];
                        operation.parameters = [
                            { name: 'x', in: 'formData', type: 'file', format: 'byte' }
                        ];
                        const enforcer = await Enforcer(def);
                        const [ req ] = enforcer.request({ path: '/', method: 'post', body: { x: 'aGVsbG8=' } });
                        expect(req.body.x).to.be.instanceof(Buffer);
                    });

                    it('can consume application/x-www-form-urlencoded', async () => {
                        const def = new DefinitionBuilder(2).addPath('/', 'post').build();
                        def.consumes = ['application/x-www-form-urlencoded'];
                        def.paths['/'].parameters = [
                            { name: 'x', in: 'formData', type: 'file', format: 'byte' }
                        ];
                        const enforcer = await Enforcer(def);
                        const [ req ] = enforcer.request({ path: '/', method: 'post', body: { x: 'aGVsbG8=' } });
                        expect(req.body.x).to.be.instanceof(Buffer);
                    });

                    it('must consume multipart/form-data and/or application/x-www-form-urlencoded', async () => {
                        const def = new DefinitionBuilder(2).addPath('/', 'post').build();
                        def.paths['/'].parameters = [
                            { name: 'x', in: 'formData', type: 'file', format: 'byte' }
                        ];
                        assert.willReject(() => Enforcer(def), /Parameters of type "file" require the consumes property to be set to either "multipart\/form-data" or "application\/x-www-form-urlencoded"/);
                    });

                });

            });

        });

        describe('v3', () => {

            it('uses content-type headers to determine media type', async () => {
                const def = new DefinitionBuilder(3).addPath('/', 'post').build();
                def.paths['/'].post.requestBody = {
                    content: {
                        'text/plain': {
                            schema: { type: 'number' }
                        },
                        'text/html': {
                            schema: { type: 'string' }
                        }
                    }
                };
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', method: 'post', body: '1', headers: { 'content-type': 'text/plain' } });
                expect(req.body).to.equal(1);
            });

            it('ranks media type by specificity', async () => {
                const def = new DefinitionBuilder(3).addPath('/', 'post').build();
                def.paths['/'].post.requestBody = {
                    content: {
                        'text/*': {
                            schema: { type: 'number' }
                        },
                        'text/plain': {
                            schema: { type: 'string' }
                        }
                    }
                };
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', method: 'post', body: '1', headers: { 'content-type': 'text/plain' } });
                expect(req.body).to.equal('1');
            });

            it('can use wild card media type', async () => {
                const def = new DefinitionBuilder(3).addPath('/', 'post').build();
                def.paths['/'].post.requestBody = {
                    content: {
                        'text/*': {
                            schema: { type: 'number' }
                        },
                        'text/plain': {
                            schema: { type: 'string' }
                        }
                    }
                };
                const enforcer = await Enforcer(def);
                const [ req ] = enforcer.request({ path: '/', method: 'post', body: '1', headers: { 'content-type': 'text/html' } });
                expect(req.body).to.equal(1);
            });

            it('requestBody can be required', async () => {
                const def = new DefinitionBuilder(3)
                    .addPath('/', 'post')
                    .build();
                def.paths['/'].post.requestBody = {
                    required: true,
                    content: {
                        'text/plain': {
                            schema: { type: 'string' }
                        }
                    }
                };
                const enforcer = await Enforcer(def);

                const [ req ] = enforcer.request({ path: '/', method: 'post', body: 'hello world' });
                expect(req.body).to.equal('hello world');

                const [ , err ] = enforcer.request({ path: '/', method: 'post' });
                expect(err).to.match(/Missing required request body/);
            });

        });

    });

});
