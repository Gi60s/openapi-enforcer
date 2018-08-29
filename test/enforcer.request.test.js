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
const Definition    = require('../bin/definition');
const Enforcer      = require('../index');
const expect        = require('chai').expect;

describe.skip('enforcer/request', () => {

    describe('path parameters', () => {

        describe('variations', () => {

            it('/{name}', () => {
                const def = new Definition(2)
                    .addParameter('/{name}', 'get', { name: 'name', in: 'path', required: true, type: 'string' })
                    .build();
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/bob' });
                expect(req.path).to.deep.equal({ name: 'bob' })
            });

            it('/{a},{b}.{c}-{d}', () => {
                const def = new Definition(2)
                    .addParameter('/{a},{b}.{c}-{d}', 'get',
                        { name: 'a', in: 'path', required: true, type: 'string' },
                        { name: 'b', in: 'path', required: true, type: 'string' },
                        { name: 'c', in: 'path', required: true, type: 'string' },
                        { name: 'd', in: 'path', required: true, type: 'string' })
                    .build();
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/paths,have.parameters-sometimes' });
                expect(req.path).to.deep.equal({ a: 'paths', b: 'have', c: 'parameters', d: 'sometimes' })
            });

            it('/{a}/b/{c}/{d}/e', () => {
                const def = new Definition(2)
                    .addParameter('/{a}/b/{c}/{d}/e', 'get',
                        { name: 'a', in: 'path', required: true, type: 'string' },
                        { name: 'c', in: 'path', required: true, type: 'string' },
                        { name: 'd', in: 'path', required: true, type: 'string' })
                    .build();
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/a/b/c/d/e' });
                expect(req.path).to.deep.equal({ a: 'a', c: 'c', d: 'd' })
            });

        });

        describe('v2', () => {

            it('will serialize values', () => {
                const def = new Definition(2)
                    .addParameter('/{array}/{num}/{boolean}/{date}/{dateTime}/{binary}/{byte}', 'get',
                        { name: 'array', in: 'path', required: true, type: 'array', items: { type: 'integer' } },
                        { name: 'num', in: 'path', required: true, type: 'number' },
                        { name: 'boolean', in: 'path', required: true, type: 'boolean' },
                        { name: 'date', in: 'path', required: true, type: 'string', format: 'date' },
                        { name: 'dateTime', in: 'path', required: true, type: 'string', format: 'date-time' },
                        { name: 'binary', in: 'path', required: true, type: 'string', format: 'binary' },
                        { name: 'byte', in: 'path', required: true, type: 'string', format: 'byte' });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '1,2,3/123/false/2000-01-01/2000-01-01T01:02:03.456Z/00000010/aGVsbG8=' });
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

            it('will serialize nested arrays', () => {
                const def = new Definition(2)
                    .addParameter('/{array}', 'get', {
                        name: 'array',
                        in: 'path', required: true,
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
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/1 2 3,4 5|6,7 8' });
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

            it('can handle complex path', () => {
                const def = new Definition(3)
                    .addParameter('/users{id}', 'get', {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'array', items: { type: 'number' } },
                        style: 'matrix',
                        explode: true
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/users;id=1;id=2' });
                expect(req.path.id).to.deep.equal([1,2]);
            });

            describe('style: simple', () => {

                it('primitive', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'simple',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/5' });
                    expect(req.path.value).to.equal(5);
                });

                it('primitive explode', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'simple',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/5' });
                    expect(req.path.value).to.equal(5);
                });

                it('array', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'simple',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('array explode', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'simple',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('object', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/a,1,b,2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/a=1,b=2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

            });

            describe('style: label', () => {

                it('primitive', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'label',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/.5' });
                    expect(req.path.value).to.equal(5);
                });

                it('primitive explode', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'label',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/.5' });
                    expect(req.path.value).to.equal(5);
                });

                it('array', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'label',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/.3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('array explode', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'label',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/.3.4.5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('object', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/.a,1,b,2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/.a=1.b=2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

            });

            describe('style: matrix', () => {

                it('primitive', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'matrix',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/;value=5' });
                    expect(req.path.value).to.equal(5);
                });

                it('primitive explode', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            style: 'matrix',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/;value=5' });
                    expect(req.path.value).to.equal(5);
                });

                it('array', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'matrix',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/;value=3,4,5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('array explode', () => {
                    const def = new Definition(3)
                        .addParameter('/{value}', 'get', {
                            name: 'value',
                            in: 'path',
                            required: true,
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'matrix',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/;value=3;value=4;value=5' });
                    expect(req.path.value).to.deep.equal([3,4,5]);
                });

                it('object', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/;value=a,1,b,2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/;a=1;b=2' });
                    expect(req.path.value).to.deep.equal({a:1,b:2});
                });

            });

        });

    });

    describe('query parameters', () => {

        describe('v2', () => {

            describe('collectionFormat multi', () => {

                it('can parse multi input', () => {
                    const def = new Definition(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' }
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?item=1&item=2&item=3' });
                    expect(req.query.item).to.deep.equal([1, 2, 3]);
                });

                it('can define multi that does not receive input', () => {
                    const def = new Definition(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' }
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/' });
                    expect(req.query).not.to.haveOwnProperty('item');
                });

                it('can allow empty value', () => {
                    const def = new Definition(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' },
                            allowEmptyValue: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?item' });
                    expect(req.query).to.haveOwnProperty('item');
                    expect(req.query.item).to.deep.equal([Enforcer.EMPTY_VALUE]);
                });

                it('can produce error with empty value', () => {
                    const def = new Definition(2)
                        .addParameter('/', 'get', {
                            name: 'item',
                            in: 'query',
                            type: 'array',
                            collectionFormat: 'multi',
                            items: { type: 'number' },
                            allowEmptyValue: false
                        });
                    const enforcer = new Enforcer(def);
                    const [err] = enforcer.request({ path: '/?item' });
                    expect(err).to.match(/Empty value not allowed/);
                });

            });

            it('can have value', () => {
                const def = new Definition(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'query',
                        type: 'string',
                        allowEmptyValue: true
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/?value=yes' });
                expect(req.query.value).to.equal('yes');
            });

            it('can have empty value', () => {
                const def = new Definition(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'query',
                        type: 'string',
                        allowEmptyValue: true
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/?value' });
                expect(req.query).to.haveOwnProperty('value');
                expect(req.query.value).to.equal(Enforcer.EMPTY_VALUE);
            });

        });

        describe('v3', () => {

            describe('style: form', () => {

                it('primitive', () => {
                    const def = new Definition(3)
                        .addParameter('/', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: false
                        })
                        .addPath('/', 'get');
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.equal(2);
                });

                it('primitive explode', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.equal(2);
                });

                it('primitive allowEmptyValue', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: false,
                            allowEmptyValue: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value' });
                    expect(req.query.value).to.equal(Enforcer.EMPTY_VALUE);
                });

                it('primitive do not allowEmptyValue', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'form',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [err, req] = enforcer.request({ path: '/?value' });
                    expect(err).to.match(/Empty value not allowed/);
                });

                it('array', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1,2' });
                    expect(req.query.value).to.deep.equal([1,2]);
                });

                it('array explode', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.deep.equal([1, 2]);
                });

                it('array allowEmptyValue', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: false,
                            allowEmptyValue: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value' });
                    expect(req.query.value).to.deep.equal([Enforcer.EMPTY_VALUE]);
                });

                it('array do not allowEmptyValue', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'form',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [err] = enforcer.request({ path: '/?value' });
                    expect(err).to.match(/Empty value not allowed/);
                });

                it('object', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=a,1,b,2' });
                    expect(req.query.value).to.deep.equal({a:1,b:2});
                });

                it('object explode', () => {
                    const def = new Definition(3)
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
                                    properties: {
                                        c: { type: 'number' },
                                        d: { type: 'number' }
                                    }
                                },
                                style: 'form',
                                explode: true
                            });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?a=1&b=2&c=3&d=4' });
                    expect(req.query).to.deep.equal({
                        x: { a:1, b:2 },
                        y: { c:3, d:4 }
                    });
                });

                it('object explode with invalid values', () => {
                    const def = new Definition(3)
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
                                    properties: {
                                        c: { type: 'number' },
                                        d: { type: 'number' }
                                    }
                                },
                                style: 'form',
                                explode: true
                            });
                    const enforcer = new Enforcer(def);
                    const [err] = enforcer.request({ path: '/?a=bob&b=2&c=3&d=4' });
                    expect(err).to.match(/Received unexpected parameters: a, b/);
                });

                it('object allowEmptyValue', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=a,,b,2' });
                    expect(req.query.value).to.deep.equal({ a: Enforcer.EMPTY_VALUE, b: 2 });
                });

                it('object do not allowEmptyValue', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [err] = enforcer.request({ path: '/?value=a,,b,2' });
                    expect(err).to.match(/Empty value not allowed/);
                });

            });

            describe('style: spaceDelimited', () => {

                it('does not allow primitives', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'spaceDelimited',
                            explode: false
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "spaceDelimited" is incompatible with schema type: number/);
                });

                it('does not allow exploded primitives', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'spaceDelimited',
                            explode: true
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "spaceDelimited" is incompatible with schema type: number/);
                });

                it('array', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'spaceDelimited',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1 2' });
                    expect(req.query.value).to.deep.equal([1,2]);
                });

                it('array explode', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'spaceDelimited',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.deep.equal([1, 2]);
                });

                it('does not allow objects', () => {
                    const def = new Definition(3)
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
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "spaceDelimited" is incompatible with schema type: object/);
                });

                it('does not allow exploded objects', () => {
                    const def = new Definition(3)
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
                            });
                    expect(() => new Enforcer(def)).to.throw(/Style "spaceDelimited" is incompatible with schema type: object/);
                });

            });

            describe('style: pipeDelimited', () => {

                it('does not allow primitives', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'pipeDelimited',
                            explode: false
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "pipeDelimited" is incompatible with schema type: number/);
                });

                it('does not allow exploded primitives', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'pipeDelimited',
                            explode: true
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "pipeDelimited" is incompatible with schema type: number/);
                });

                it('array', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'pipeDelimited',
                            explode: false
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1|2' });
                    expect(req.query.value).to.deep.equal([1,2]);
                });

                it('array explode', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'pipeDelimited',
                            explode: true
                        });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?value=1&value=2' });
                    expect(req.query.value).to.deep.equal([1, 2]);
                });

                it('does not allow objects', () => {
                    const def = new Definition(3)
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
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "pipeDelimited" is incompatible with schema type: object/);
                });

                it('does not allow exploded objects', () => {
                    const def = new Definition(3)
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
                            });
                    expect(() => new Enforcer(def)).to.throw(/Style "pipeDelimited" is incompatible with schema type: object/);
                });

            });

            describe('style: deepObject', () => {

                it('does not allow primitives', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'deepObject',
                            explode: false
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "deepObject" is incompatible with schema type: number/);
                });

                it('does not allow exploded primitives', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'number' },
                            style: 'deepObject',
                            explode: true
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "deepObject" is incompatible with schema type: number/);
                });

                it('does not allow arrays', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'deepObject',
                            explode: false
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "deepObject" is incompatible with schema type: array/);
                });

                it('does not allow exploded arrays', () => {
                    const def = new Definition(3)
                        .addParameter('/', 'get', {
                            name: 'value',
                            in: 'query',
                            schema: { type: 'array', items: { type: 'number' } },
                            style: 'deepObject',
                            explode: true
                        });
                    expect(() => new Enforcer(def)).to.throw(/Style "deepObject" is incompatible with schema type: array/);
                });

                it('object', () => {
                    const def = new Definition(3)
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
                        });
                    const enforcer = new Enforcer(def);
                    const [err, req] = enforcer.request({ path: '/?value[a]=1&value[b]=2' });
                    expect(req.query.value).to.deep.equal({ a: 1, b: 2 });
                });

                it('object explode', () => {
                    const def = new Definition(3)
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
                            });
                    const enforcer = new Enforcer(def);
                    const [, req] = enforcer.request({ path: '/?x[a]=1&x[b]=2&y[c]=3&y[d]=4' });
                    expect(req.query).to.deep.equal({ x: { a:1, b:2 }, y: { c:3, d:4 } });
                });

            });

        });

    });

    describe('header parameters', () => {

        it('has case insensitive header names', () => {
            const def = new Definition(2)
                .addParameter('/', 'get', {
                    name: 'vALUe',
                    in: 'header',
                    type: 'string'
                });
            const enforcer = new Enforcer(def);
            const [, req] = enforcer.request({ path: '/', headers: { VAlue: 'abc' } });
            expect(req.headers.VAlue).to.equal('abc');
        });

        it('cannot have property allowEmptyValue', () => {
            const def = new Definition(2)
                .addParameter('/', 'get', {
                    name: 'value',
                    in: 'header',
                    type: 'string',
                    allowEmptyValue: true
                });
            expect(() => new Enforcer(def)).to.throw(/Property not allowed: allowEmptyValue/);
        });

        it('cannot have empty header string', () => {
            const def = new Definition(2)
                .addParameter('/', 'get', {
                    name: 'value',
                    in: 'header',
                    type: 'string'
                });
            const enforcer = new Enforcer(def);
            const [err] = enforcer.request({ path: '/', headers: { value: '' } });
            expect(err).to.match(/Empty value not allowed/);
        });


        describe('v2', () => {

            it('will deserialize date value', () => {
                const def = new Definition(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        type: 'string',
                        format: 'date'
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { value: '2000-01-01' } });
                expect(req.headers.value).to.deep.equal(new Date('2000-01-01'));
            });

            it('will deserialize array of numbers', () => {
                const def = new Definition(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        type: 'array',
                        items: { type: 'number' }
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { value: '1,2,3' } });
                expect(req.headers.value).to.deep.equal([1,2,3]);
            });

            it('will not allow multi collection format', () => {
                const def = new Definition(2)
                    .addParameter('/', 'get', {
                        name: 'item',
                        in: 'header',
                        type: 'array',
                        collectionFormat: 'multi',
                        items: { type: 'number' }
                    });
                expect(() => new Enforcer(def)).to.throw(/Property "collectionFormat" has invalid value/);
            });

        });

        describe('v3', () => {

            it('primitive', () => {
                const def = new Definition(3)
                    .addParameter('/', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'number' },
                        explode: false
                    })
                    .addPath('/', 'get');
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { value: '1' } });
                expect(req.headers.value).to.equal(1);
            });

            it('primitive explode', () => {
                const def = new Definition(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'number' },
                        explode: true
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { value: '1' } });
                expect(req.headers.value).to.equal(1);
            });

            it('array', () => {
                const def = new Definition(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: false
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { value: '1,2,3' } });
                expect(req.headers.value).to.deep.equal([1,2,3]);
            });

            it('array explode', () => {
                const def = new Definition(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'header',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: true
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { value: '1,2,3' } });
                expect(req.headers.value).to.deep.equal([1,2,3]);
            });

            it('object', () => {
                const def = new Definition(3)
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
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { value: 'a,1,b,2' } });
                expect(req.headers.value).to.deep.equal({a:1,b:2});
            });

            it('object explode', () => {
                const def = new Definition(3)
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
                        });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', headers: { x: 'a=1,b=2' } });
                expect(req.headers.x).to.deep.equal({ a:1, b:2 });
            });

        });

    });

    describe('cookie parameters', () => {

        describe('v2', () => {

            it('does not support cookie parameters', () => {
                const def = new Definition(2)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        type: 'string'
                    });
                expect(() => new Enforcer(def)).to.throw(/Property "in" has invalid value: "cookie"/);
            });

        });

        describe('v3', () => {

            it('primitive', () => {
                const def = new Definition(3)
                    .addParameter('/', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'number' },
                        explode: false
                    })
                    .addPath('/', 'get');
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', cookies: 'value=1' });
                expect(req.cookies.value).to.equal(1);
            });

            it('primitive explode', () => {
                const def = new Definition(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'number' },
                        explode: true
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', cookies: 'value=1' });
                expect(req.cookies.value).to.equal(1);
            });

            it('array', () => {
                const def = new Definition(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: false
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', cookies: 'value=1,2,3' });
                expect(req.cookies.value).to.deep.equal([1,2,3]);
            });

            it('array explode', () => {
                const def = new Definition(3)
                    .addParameter('/', 'get', {
                        name: 'value',
                        in: 'cookie',
                        schema: { type: 'array', items: { type: 'number' } },
                        explode: true
                    });
                expect(() => new Enforcer(def)).to.throw(/Cookies do not support exploded style "form" with schema type: array/);
            });

            it('object', () => {
                const def = new Definition(3)
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
                    });
                const enforcer = new Enforcer(def);
                const [, req] = enforcer.request({ path: '/', cookies: 'value=a,1,b,2' });
                expect(req.cookies.value).to.deep.equal({a:1,b:2});
            });

            it('object explode', () => {
                const def = new Definition(3)
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
                        });
                expect(() => new Enforcer(def)).to.throw(/Cookies do not support exploded style "form" with schema type: object/);
            });

        });

    });

    describe('body', () => {

        describe('v2', () => {

            describe('in body', () => {

                it('', () => {
                    
                });

            });

            describe('in formData', () => {

            });

            // TODO: files

        });

        describe('v3', () => {

        });

    });

});

