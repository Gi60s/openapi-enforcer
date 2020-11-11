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
const expect        = require('chai').expect;
const Enforcer      = require('../');

describe('enforcer/parameter', () => {
    const schema = { type: 'string' };

    describe('constructor', () => {

        it('defines schema for v2', () => {
            const [ def ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                type: 'string'
            });
            expect(def.schema.type).to.equal('string');
        });

        it('defines schema for v3 with content', () => {
            const [ def ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                content: {
                    'application/json': {
                        schema: { type: 'string' }
                    }
                }
            });
            expect(def.schema.type).to.equal('string');
        })

    });

    it('can be valid', () => {
        const [ , err ] = Enforcer.v2_0.Parameter({
            name: 'hi',
            in: 'path',
            type: 'string',
            required: true
        });
        expect(err).to.be.undefined;
    });

    describe('allowEmptyValue', () => {

        it('is valid in query', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'query', type: 'string', allowEmptyValue: true });
            expect(err).to.be.undefined;
        });

        it('is not valid in header', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'header', type: 'string', allowEmptyValue: true });
            expect(err).to.match(/Property not allowed: allowEmptyValue/);
        });

    });

    describe('allowReserved', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({ name: 'hi', in: 'query', schema, allowReserved: true });
            expect(err).to.be.undefined;
        });

        it('is not allowed for v2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'header', type: 'string', allowReserved: true });
            expect(err).to.match(/Property not allowed: allowReserved/);
        });

        it('it not allowed in header', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({ name: 'hi', in: 'header', schema, allowReserved: true });
            expect(err).to.match(/Property not allowed: allowReserved/);
        });

        it('it must be a boolean', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({ name: 'hi', in: 'query', schema, allowReserved: 'abc' });
            expect(err).to.match(/Value must be a boolean/);
        });

    });

    describe('collectionFormat', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'query', type: 'array', items: { type: 'string' }, collectionFormat: 'multi' });
            expect(err).to.be.undefined;
        });

        it('is not valid in v3', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({ name: 'hi', in: 'query', schema, collectionFormat: 'multi' });
            expect(err).to.match(/Property not allowed: collectionFormat/);
        });

        it('is not valid for "string" type', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'query', type: 'string', collectionFormat: 'multi' });
            expect(err).to.match(/Property not allowed: collectionFormat/);
        });

        it('defaults to csv', () => {
            const [ def ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'query', type: 'array', items: { type: 'string' } });
            expect(def.collectionFormat).to.equal('csv');
        });

    });

    describe('content', () => {

        it('must be a plain object', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                content: []
            });
            expect(err).to.match(/Value must be a plain object/);
        });

        it('can only have one property', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                content: {
                    x: {},
                    y: {}
                }
            });
            expect(err).to.match(/Value must have exactly one key/);
        });

        describe('media type', () => {

            it('can have a schema defined', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    content: {
                        'application/json': {
                            schema: { type: 'object' }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('will validate that the schema is valid', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    content: {
                        'application/json': {
                            schema: {
                                minimum: 5,
                                maximum: 10,
                                default: 1
                            }
                        }
                    }
                });
                expect(err).to.match(/Expected number to be greater than or equal to 5/);
            });

            it('can not set encoding for parameters', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string' }
                                }
                            },
                            encoding: {
                                a: {
                                    contentType: 'text/plain'
                                }
                            }
                        }
                    }
                });
                expect(err).to.match(/Property not allowed: encoding/);
            });

        });

    });

    describe('default', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'query', type: 'string', default: 'hello' });
            expect(err).to.be.undefined;
        });

        it('is not valid in v3', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({ name: 'hi', in: 'query', schema, default: 'hello' });
            expect(err).to.match(/Property not allowed: default/);
        });

        it('must match type', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'query', type: 'string', default: 1 });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('deprecated', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({ name: 'hi', in: 'query', schema, deprecated: true });
            expect(err).to.be.undefined;
        });

        it('is not valid in v2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({ name: 'hi', in: 'query', deprecated: true });
            expect(err).to.match(/Property not allowed: deprecated/);
        });

        it('must be a boolean', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({ name: 'hi', in: 'query', schema, deprecated: 1 });
            expect(err).to.match(/Value must be a boolean/);
        });

    });

    describe('enum', () => {

        describe('v2', () => {

            it('can have enum', () => {
                const [ , err ] = Enforcer.v2_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    type: 'string',
                    enum: ['hero', 'normal', 'villain']
                });
                expect(err).to.be.undefined;
            });

            it('must have valid enum values', () => {
                const [ , err ] = Enforcer.v2_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    type: 'string',
                    enum: ['hero', true, 5]
                });
                expect(err).to.match(/at: 1\s+Value must be a string/);
                expect(err).to.match(/at: 2\s+Value must be a string/);
                expect(err.count).to.equal(2);
            });

        });

    });

    describe('examples', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema,
                examples: {
                    a: {
                        value: 'Example value'
                    }
                }
            });
            expect(err).to.be.undefined
        });

        it('cannot be set for v2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                type: 'string',
                examples: {
                    a: {
                        value: 'Example value'
                    }
                }
            });
            expect(err).to.match(/Property not allowed: examples/);
        });

        it('cannot have both example and examples', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema,
                example: 'Example value',
                examples: {
                    a: {
                        value: 'Example value'
                    }
                }
            });
            expect(err).to.match(/Cannot have both "example" and "examples" properties/);
        });

    });

    describe('explode', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema,
                explode: true
            });
            expect(err).to.be.undefined;
        });

        it('is not valid in v2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                explode: true
            });
            expect(err).to.match(/Property not allowed: explode/);
        });

        it('defaults to true for "form"', () => {
            const [ def ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema,
                style: 'form'
            });
            expect(def.explode).to.equal(true);
        });

        it('defaults to false for not "form"', () => {
            const [ def ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema: { type: 'array', items: { type: 'string' } },
                style: 'spaceDelimited'
            });
            expect(def.explode).to.equal(false);
        });

        it('does not let cookies be exploded for non-primitives', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'cookie',
                schema: { type: 'object' },
                explode: true
            });
            expect(err).to.match(/Cookies do not support exploded values for non-primitive schemas/)
        });

    });

    describe('in', () => {

        it('is required', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                type: 'string',
                name: 'hi'
            });
            expect(err).to.match(/Missing required property: in/);
        });

        it('can be formData if version 2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                type: 'string',
                name: 'hi',
                in: 'formData'
            });
            expect(err).to.be.undefined;
        });

        it('cannot be formData if version 3', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                schema,
                in: 'formData'
            });
            expect(err).to.match(/Value must be one of/);
        });

    });

    describe('items', () => {

        it('is allowed in version 2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                type: 'array',
                items: {
                    type: 'string'
                }
            });
            expect(err).to.be.undefined;
        });

        it('is only valid for array types', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                type: 'string',
                items: {
                    type: 'string'
                }
            });
            expect(err).to.match(/Property not allowed: items/);
        });

        it('is not allowed in version 3', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema,
                items: {
                    type: 'string'
                }
            });
            expect(err).to.match(/Property not allowed: items/);
        });

    });

    describe('name', () => {

        it('is required', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                schema,
                in: 'query'
            });
            expect(err).to.match(/Missing required property: name/);
        });

        it('must be a string', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                schema,
                name: 1,
                in: 'query'
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('required', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                type: 'string',
                name: 'hi',
                in: 'formData',
                required: true
            });
            expect(err).to.be.undefined;
        });

        it('must be a boolean', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                type: 'string',
                name: 'hi',
                in: 'formData',
                required: 1
            });
            expect(err).to.match(/Value must be a boolean/);
        });

        it('must be true if in path', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                type: 'string',
                name: 'hi',
                in: 'path',
                required: false
            });
            expect(err).to.match(/Value must be true/);
        });

        it('is required for path ', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                type: 'string',
                name: 'hi',
                in: 'path'
            });
            expect(err).to.match(/Missing required property: required/);
        });

        it('is optional for non path and defaults to false', () => {
            const [ def ] = Enforcer.v2_0.Parameter({
                type: 'string',
                name: 'hi',
                in: 'query'
            });
            expect(def.required).to.equal(false);
        });

    });

    describe('schema', () => {

        it('can be set for v3', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema: { type: 'string' }
            });
            expect(err).to.be.undefined;
        });

        it('cannot be set for v2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                schema
            });
            expect(err).to.match(/Property not allowed: schema/);
        });

        it('must be plain object', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema: []
            });
            expect(err).to.match(/at: schema\s+Value must be a plain object/);
        });

        it('cannot accompany content property', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema: { type: 'string' },
                content: {}
            });
            expect(err).to.match(/Cannot have both "content" and "schema" properties/);
        });

    });

    describe('style', () => {

        it('can be set', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'query',
                schema,
                style: 'form'
            });
            expect(err).to.be.undefined;
        });

        it('is not valid in v2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                style: 'form'
            });
            expect(err).to.match(/Property not allowed: style/);
        });

        describe('cookie', () => {

            it('defaults to form', () => {
                const [ def ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'cookie',
                    schema
                });
                expect(def.style).to.equal('form');
            });

            it('must be form', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'cookie',
                    style: 'spaceDelimited',
                    schema
                });
                expect(err).to.match(/Value must be "form"/)
            });

        });

        describe('header', () => {

            it('defaults to simple', () => {
                const [ def ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'header',
                    schema
                });
                expect(def.style).to.equal('simple');
            });

            it('must be simple', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'header',
                    style: 'spaceDelimited',
                    schema
                });
                expect(err).to.match(/Value must be "simple"/)
            });

        });

        describe('path', () => {

            it('defaults to simple', () => {
                const [ def ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'path',
                    required: true,
                    schema
                });
                expect(def.style).to.equal('simple');
            });

            it('must be valid type', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'path',
                    required: true,
                    style: 'spaceDelimited',
                    schema
                });
                expect(err).to.match(/Value must be one of: simple, label, matrix/)
            });

        });

        describe('query', () => {

            it('defaults to form', () => {
                const [ def ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    schema
                });
                expect(def.style).to.equal('form');
            });

            it('must be valid type', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    style: 'simple',
                    schema: { type: 'array', items: { type: 'string' } }
                });
                expect(err).to.match(/Value must be one of: form, spaceDelimited, pipeDelimited, deepObject/)
            });

            it('must be array for spaceDelimited', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    schema: { type: 'string' },
                    style: 'spaceDelimited'
                });
                expect(err).to.match(/Style "spaceDelimited" is incompatible with schema type: string/);
            });

            it('must be array for pipeDelimited', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    schema: { type: 'string' },
                    style: 'pipeDelimited'
                });
                expect(err).to.match(/Style "pipeDelimited" is incompatible with schema type: string/);
            });

            it('must be object for deepObject', () => {
                const [ , err ] = Enforcer.v3_0.Parameter({
                    name: 'hi',
                    in: 'query',
                    schema: { type: 'string' },
                    style: 'deepObject'
                });
                expect(err).to.match(/Style "deepObject" is incompatible with schema type: string/);
            });

        });

    });

    describe('type', () => {

        it('is allowed in v2', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'query',
                type: 'string'
            });
            expect(err).to.be.undefined;
        });

        it('is not allowed if "in" is body', () => {
            const [ , err ] = Enforcer.v2_0.Parameter({
                name: 'hi',
                in: 'body',
                type: 'string'
            });
            expect(err).to.match(/Property not allowed: type/);
        });

        it('is not allowed in v3', () => {
            const [ , err ] = Enforcer.v3_0.Parameter({
                name: 'hi',
                in: 'body',
                type: 'string'
            });
            expect(err).to.match(/Property not allowed: type/);
        });

    });

});
