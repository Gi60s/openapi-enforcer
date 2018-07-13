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
const schemas       = require('../bin/schemas');

describe.only('schemas', () => {
    
    describe('merge', () => {

        it('invalid version', () => {
            expect(() => schemas.merge(1, [])).to.throw(/invalid version/i);
        });

        it('array of schemas omitted', () => {
            expect(() => schemas.merge(2)).to.throw(/missing required schemas/i);
        });

        it('empty schema items ignored', () => {
            const value = schemas.merge(2, [{ type: 'number' }, undefined])
            expect(value).to.deep.equal({ type: 'number' })
        });

        describe('array', () => {

            it('compatible', () => {
                const merged = schemas.merge(2, [
                    { type: 'array', maxItems: 10 },
                    { type: 'array', minItems: 0, uniqueItems: true }
                ]);
                expect(merged).to.deep.equal({ type: 'array', maxItems: 10, minItems: 0, uniqueItems: true });
            });

            it('compatible competing maxItems', () => {
                const merged = schemas.merge(2, [
                    { type: 'array', maxItems: 3 },
                    { type: 'array', maxItems: 5 }
                ]);
                expect(merged).to.deep.equal({ type: 'array', maxItems: 3 });
            });

            it('compatible competing minItems', () => {
                const merged = schemas.merge(2, [
                    { type: 'array', minItems: 3 },
                    { type: 'array', minItems: 5 }
                ]);
                expect(merged).to.deep.equal({ type: 'array', minItems: 5 });
            });

            it('compatible items', () => {
                const merged = schemas.merge(2, [
                    { type: 'array', items: { type: 'string', minLength: 2 } },
                    { type: 'array', uniqueItems: true, items: { type: 'string', maxLength: 10 } }
                ]);
                expect(merged).to.deep.equal({
                    type: 'array',
                    uniqueItems: true,
                    items: { type: 'string', minLength: 2, maxLength: 10 }
                });
            });

        });

        describe('integers and numbers', () => {
            const options = { throw: false };
            const n1 = { type: 'number', minimum: 0 };
            const n2 = { type: 'number', maximum: 10 };

            it('compatible', () => {
                const data = schemas.merge(2, [n1, n2], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'number',
                    minimum: 0,
                    maximum: 10
                })
            });

            it('compatible competing maximum', () => {
                const data = schemas.merge(2, [n1, n2, { type: 'number', maximum: 5 }], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'number',
                    minimum: 0,
                    maximum: 5
                })
            });

            it('compatible competing minimum', () => {
                const data = schemas.merge(2, [n1, n2, { type: 'number', minimum: 5 }], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'number',
                    minimum: 5,
                    maximum: 10
                })
            });

            it('compatible with integer', () => {
                const data = schemas.merge(2, [n1, n2, { type: 'integer' }], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'integer',
                    minimum: 0,
                    maximum: 10
                })
            });

            it('incompatible with non-specific type', () => {
                const data = schemas.merge(2, [n1, { maximum: 10 }], options);
                expect(data.error).to.match(/missing required property: type/i);
                expect(data.value).to.be.null;
            });

            it('incompatible types', () => {
                const data = schemas.merge(2, [n1, { type: 'boolean' }], options);
                expect(data.error).to.match(/incompatible types/i);
                expect(data.value).to.be.null;
            });

            it('incompatible properties', () => {
                const data = schemas.merge(2, [{ type: 'number', minimum: 10 }, { type: 'number', maximum: 0}], options);
                expect(data.error).to.match(/invalid merged schema/i);
                expect(data.value).to.be.null;
            });

            it('incompatible thrown error', () => {
                expect(() => schemas.merge(2, [n1, { maximum: 10 }])).to.throw(/missing required property: type/i);
            });

        });

        describe('modifiers', () => {

            it('can do allOf', () => {
                const array = [
                    {
                        type: 'integer',
                        multipleOf: 5
                    },
                    {
                        allOf: [
                            { type: 'integer', minimum: 0 },
                            { type: 'number', maximum: 100 },
                            { type: 'number', multipleOf: 4 }
                        ]
                    }
                ];
                const merged = schemas.merge(3, array);
                expect(merged).to.deep.equal({
                    type: 'integer',
                    multipleOf: 20,
                    minimum: 0,
                    maximum: 100
                })
            });

            it('cannot do anyOf, oneOf, or not', () => {
                expect(() => schemas.merge(3, [{ anyOf: [] }])).to.throw(/cannot merge the modifiers/i);
                expect(() => schemas.merge(3, [{ oneOf: [] }])).to.throw(/cannot merge the modifiers/i);
                expect(() => schemas.merge(3, [{ not: { type: 'boolean'} }])).to.throw(/cannot merge the modifiers/i);
            })

        });

        describe('objects', () => {

            it('compatible additionalProperties', () => {
                const array = [
                    {
                        type: 'object',
                        additionalProperties: { type: 'number', minimum: 0 }
                    },
                    {
                        type: 'object',
                        additionalProperties: { type: 'integer', maximum: 10 }
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'object',
                    additionalProperties: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 10
                    }
                });
            });

            it('incompatible additionalProperties', () => {
                const array = [
                    {
                        type: 'object',
                        additionalProperties: { type: 'number' }
                    },
                    {
                        type: 'object',
                        additionalProperties: { type: 'string' }
                    }
                ];
                expect(() => schemas.merge(2, array)).to.throw(/incompatible types/i);
            });

            it('compatible single discriminator', () => {
                const array = [
                    {
                        type: 'object',
                        discriminator: 'x',
                        properties: { x: { type: 'number' }},
                        required: [ 'x' ]
                    },
                    {
                        type: 'object',
                        properties: { x: { type: 'integer' }}
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'object',
                    properties: { x: { type: 'integer' }},
                    required: ['x'],
                    discriminator: 'x'
                });
            });

            it('incompatible double discriminator', () => {
                const array = [
                    {
                        type: 'object',
                        discriminator: 'x',
                        required: [ 'x' ],
                        properties: { x: { type: 'number' }}
                    },
                    {
                        type: 'object',
                        discriminator: 'y',
                        required: [ 'y' ],
                        properties: { y: { type: 'number' }}
                    }
                ];
                expect(() => schemas.merge(2, array)).to.throw(/overwriteDiscriminator/);
            });

            it('compatible double discriminator via overwrites', () => {
                const array = [
                    {
                        type: 'object',
                        discriminator: 'x',
                        required: [ 'x' ],
                        properties: { x: { type: 'number' }}
                    },
                    {
                        type: 'object',
                        discriminator: 'y',
                        required: [ 'y' ],
                        properties: { y: { type: 'number' }}
                    }
                ];
                expect(schemas.merge(2, array, { overwriteDiscriminator: true })).to.deep.equal({
                    type: 'object',
                    properties: {
                        x: { type: 'number' },
                        y: { type: 'number' }
                    },
                    required: ['x', 'y'],
                    discriminator: 'y'
                });
            });

            it('compatible minProperties and maxProperties', () => {
                const array = [
                    {
                        type: 'object',
                        minProperties: 0,
                        maxProperties: 5
                    },
                    {
                        type: 'object',
                        minProperties: 5,
                        maxProperties: 10
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'object',
                    minProperties: 5,
                    maxProperties: 5
                });
            });
        });

        describe('string', () => {

            it('compatible minLength and maxLength', () => {
                const array = [
                    {
                        type: 'string',
                        minLength: 0,
                        maxLength: 5
                    },
                    {
                        type: 'string',
                        minLength: 5,
                        maxLength: 10
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'string',
                    minLength: 5,
                    maxLength: 5
                });
            });

            it('compatible format', () => {
                const array = [
                    {
                        type: 'string',
                        format: 'password'
                    },
                    {
                        type: 'string',
                        format: 'password'
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'string',
                    format: 'password'
                });
            });

            it('compatible single format', () => {
                const array = [
                    {
                        type: 'string',
                    },
                    {
                        type: 'string',
                        format: 'date'
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'string',
                    format: 'date'
                });
            });

            it('incompatible single format', () => {
                const array = [
                    {
                        type: 'string',
                        format: 'date-time'
                    },
                    {
                        type: 'string',
                        format: 'date'
                    }
                ];
                expect(() => schemas.merge(2, array)).to.throw(/incompatible formats/i);
            });

            it('compatible single pattern', () => {
                const array = [
                    {
                        type: 'string',
                        pattern: 'abc'
                    },
                    {
                        type: 'string'
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'string',
                    pattern: RegExp('abc')
                })
            });

            it('compatible multiple patterns', () => {
                const array = [
                    {
                        type: 'string',
                        pattern: 'abc'
                    },
                    {
                        type: 'string',
                        pattern: 'def'
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'string',
                    pattern: RegExp('abc|def')
                })
            });

            it('compatible multiple patterns with flags', () => {
                const array = [
                    {
                        type: 'string',
                        pattern: '/abc/i'
                    },
                    {
                        type: 'string',
                        pattern: '/def/ig'
                    },
                    {
                        type: 'string',
                        pattern: '/ghi/m'
                    }
                ];
                expect(schemas.merge(2, array)).to.deep.equal({
                    type: 'string',
                    pattern: RegExp('abc|def|ghi', 'igm')
                })
            });

        });
        
    });

    describe('validate', () => {

        describe('string', () => {

            it('maximum not allowed for non dates', () => {
                const schema = { type: 'string', maximum: '' };
                expect(() => schemas.validate(2, schema)).to.throw(/Property "maximum" not allowed/);
            });

            it('minimum not allowed for non dates', () => {
                const schema = { type: 'string', minimum: '' };
                expect(() => schemas.validate(2, schema)).to.throw(/Property "minimum" not allowed/);
            });

            describe('date format', () => {

                it('maximum valid', () => {
                    const schema = { type: 'string', format: 'date', maximum: '2000-01-01' };
                    expect(() => schemas.validate(2, schema)).not.to.throw();
                });

                it('maximum invalid format', () => {
                    const schema = { type: 'string', format: 'date', maximum: '2000-01-01T00:00:00.000Z' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "maximum" is not a valid/);
                });

                it('maximum invalid value', () => {
                    const schema = { type: 'string', format: 'date', maximum: '2000-02-30' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "maximum" is not a valid/);
                });

                it('minimum valid', () => {
                    const schema = { type: 'string', format: 'date', minimum: '2000-01-01' };
                    expect(() => schemas.validate(2, schema)).not.to.throw();
                });

                it('minimum invalid format', () => {
                    const schema = { type: 'string', format: 'date', minimum: '2000-01-01T00:00:00.000Z' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "minimum" is not a valid/);
                });

                it('minimum invalid value', () => {
                    const schema = { type: 'string', format: 'date', minimum: '2000-02-30' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "minimum" is not a valid/);
                });

            });

            describe('date-time format', () => {

                it('maximum valid', () => {
                    const schema = { type: 'string', format: 'date-time', maximum: '2000-01-01T00:00:00.000Z' };
                    expect(() => schemas.validate(2, schema)).not.to.throw();
                });

                it('maximum invalid format', () => {
                    const schema = { type: 'string', format: 'date-time', maximum: '2000-01-01' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "maximum" is not a valid/);
                });

                it('maximum invalid value', () => {
                    const schema = { type: 'string', format: 'date-time', maximum: '2000-02-30T00:00:00.000Z' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "maximum" is not a valid/);
                });

                it('minimum valid', () => {
                    const schema = { type: 'string', format: 'date-time', minimum: '2000-01-01T00:00:00.000Z' };
                    expect(() => schemas.validate(2, schema)).not.to.throw();
                });

                it('minimum invalid format', () => {
                    const schema = { type: 'string', format: 'date-time', minimum: '2000-01-01' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "minimum" is not a valid/);
                });

                it('minimum invalid value', () => {
                    const schema = { type: 'string', format: 'date-time', minimum: '2000-02-30T00:00:00.000Z' };
                    expect(() => schemas.validate(2, schema)).to.throw(/Property "minimum" is not a valid/);
                });

            });

        });

    });

});