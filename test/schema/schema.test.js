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
const Schema        = require('../../bin/schema');
const util          = require('../../bin/util');

describe('schema constructor', () => {

    describe('parse', () => {

        describe('string', () => {

            describe('date-format', () => {

                it('default converted to date object', () => {
                    const schema = { type: 'string', format: 'date', default: '2000-01-01' };
                    expect(Schema(2, schema).default).to.deep.equal(new Date('2000-01-01T00:00:00.000Z'));
                });

                it('default cannot be parsed', () => {
                    const schema = { type: 'string', format: 'date-time', default: '2000-01-01' };
                    expect(() => Schema(2, schema)).to.throw(/Unable to parse default value/);
                });

                it('enum converted to date object', () => {
                    const schema = {
                        type: 'string',
                        format: 'date',
                        enum: ['2000-01-01']
                    };
                    expect(Schema(2, schema).enum[0]).to.deep.equal(new Date('2000-01-01T00:00:00.000Z'));
                });

                it('enum cannot be parsed', () => {
                    const schema = {
                        type: 'string',
                        format: 'date-time',
                        enum: ['2000-01-01']
                    };
                    expect(() => Schema(2, schema)).to.throw(/Unable to parse enum value/);
                });

                it('minimum converted to date object', () => {
                    const schema = {
                        type: 'string',
                        format: 'date',
                        minimum: '2000-01-01'
                    };
                    expect(Schema(2, schema).minimum).to.deep.equal(new Date('2000-01-01T00:00:00.000Z'));
                });

                it('maximum converted to date object', () => {
                    const schema = {
                        type: 'object',
                        properties: {
                            date: {
                                type: 'string',
                                format: 'date',
                                maximum: '2000-01-01'
                            }
                        }
                    };
                    expect(Schema(2, schema).properties.date.maximum)
                        .to.deep.equal(new Date('2000-01-01T00:00:00.000Z'));
                });

            });

        });

    });

    describe('validate', () => {

        it('invalid version', () => {
            expect(() => Schema(1, {})).to.throw(/Invalid version specified/);
        });

        it('invalid schema', () => {
            expect(() => Schema(2, [])).to.throw(/Invalid schema specified/);
        });

        it('invalid key', () => {
            const schema = { foo: 0 };
            expect(() => Schema(2, schema)).to.throw(/Property not allowed: foo/);
        });

        it('missing type', () => {
            expect(() => Schema(2, { default: 5 })).to.throw(/Missing required property: type/);
        });

        it('invalid type', () => {
            expect(() => Schema(2, { type: 'foo' })).to.throw(/Invalid type specified/);
        });

        it('enum must be an array', () => {
            expect(() => Schema(2, { type: 'string', enum: {} })).to.throw(/Property "enum" must be an array/);
        });

        it('cyclic catch', () => {
            const schema = { type: 'object' };
            schema.additionalProperties = schema;
            const s = Schema(2, schema);
            expect(s).to.be.instanceOf(Constructor);
            expect(s.additionalProperties).to.equal(s);
        });

        describe('composites', () => {

            it('not allowed composite', () => {
                const schema = { oneOf: [] };
                expect(() => Schema(2, schema)).to.throw(/Property not allowed: oneOf/);
            });

            it('allowed composite', () => {
                const schema = { oneOf: [] };
                expect(() => Schema(3, schema)).not.to.throw();
            });

            it('array composite not array', () => {
                expect(() => Schema(3, { allOf: {} })).to.throw(/Composite "allOf" must be an array/);
                expect(() => Schema(3, { anyOf: {} })).to.throw(/Composite "anyOf" must be an array/);
                expect(() => Schema(3, { oneOf: {} })).to.throw(/Composite "oneOf" must be an array/);
            });

            it('object composite not object', () => {
                expect(() => Schema(3, { not: [] })).to.throw(/Composite "not" must be an object/);
            });

            it('too many composite', () => {
                const schema = { oneOf: [], anyOf: [] };
                expect(() => Schema(3, schema)).to.throw(/Cannot have multiple composites/);
            });
            
            it('composite array converted to instances', () => {
                const schema = {
                    oneOf: [
                        { type: 'string' },
                        { type: 'number' }
                    ]
                };
                const s = Schema(3, schema);
                expect(s).to.be.instanceOf(Constructor);
                expect(Array.isArray(s.oneOf)).to.equal(true);
                expect(s.oneOf[0]).to.be.instanceOf(Constructor);
                expect(s.oneOf[1]).to.be.instanceOf(Constructor);
            });

            it('composite object converted to instance', () => {
                const schema = { not: { type: 'string' } };
                const s = Schema(3, schema);
                expect(s).to.be.instanceOf(Constructor);
                expect(s.not).to.be.instanceOf(Constructor);
            });

        });

        describe('array', () => {

            describe('items', () => {

                it('converts to schema', () => {
                    const schema = Schema(2, { type: 'array', items: { type: 'string' } });
                    expect(schema.items).to.be.instanceOf(Constructor);
                });

                it('must be plain object', () => {
                    expect(() => Schema(2, { type: 'array', items: 5 })).to.throw(/Property "items" must be an object/);
                })

            });

            describe('maxItems', () => {

                it('positive integer ok', () => {
                    expect(() => Schema(2, { type: 'array', maxItems: 5 })).not.to.throw();
                });

                it('negative integer error', () => {
                    expect(() => Schema(2, { type: 'array', maxItems: -5 })).to.throw(/Property "maxItems"/);
                });

                it('non integer error', () => {
                    expect(() => Schema(2, { type: 'array', maxItems: 5.5 })).to.throw(/Property "maxItems"/);
                });

            });

            describe('minItems', () => {

                it('positive integer ok', () => {
                    expect(() => Schema(2, { type: 'array', minItems: 5 })).not.to.throw();
                });

                it('negative integer error', () => {
                    expect(() => Schema(2, { type: 'array', minItems: -5 })).to.throw(/Property "minItems"/);
                });

                it('non integer error', () => {
                    expect(() => Schema(2, { type: 'array', minItems: 5.5 })).to.throw(/Property "minItems"/);
                });

            });

            describe('maxItems and minItems', () => {

                it('max above min', () => {
                    expect(() => Schema(2, { type: 'array', maxItems: 1, minItems: 0 })).not.to.throw();
                });

                it('max equals min', () => {
                    expect(() => Schema(2, { type: 'array', maxItems: 0, minItems: 0 })).not.to.throw();
                });

                it('max below min', () => {
                    expect(() => Schema(2, { type: 'array', maxItems: 0, minItems: 1 })).to.throw(/Property "minItems" must be less/);
                });

            });

        });

        describe('boolean', () => {

            it('boolean', () => {
                expect(() => Schema(2, { type: 'boolean' })).not.to.throw();
            })

        });

        describe('integer', () => {

            describe('format', () => {

                it('valid format', () => {
                    expect(() => Schema(2, { type: 'integer', format: 'int32' })).not.to.throw();
                });

                it('invalid format', () => {
                    expect(() => Schema(2, { type: 'integer', format: 'float' })).to.throw(/Invalid "format"/);
                });

            });

            describe('maximum', () => {

                it('valid value', () => {
                    expect(() => Schema(2, { type: 'integer', maximum: 2 })).not.to.throw();
                });

                it('invalid decimal value', () => {
                    expect(() => Schema(2, { type: 'integer', maximum: 2.2 })).to.throw(/must be an integer/);
                });

                it('invalid string value', () => {
                    expect(() => Schema(2, { type: 'integer', maximum: "2" })).to.throw(/must be an integer/);
                });

            });

            describe('minimum', () => {

                it('valid value', () => {
                    expect(() => Schema(2, { type: 'integer', minimum: 2 })).not.to.throw();
                });

                it('invalid decimal value', () => {
                    expect(() => Schema(2, { type: 'integer', minimum: 2.2 })).to.throw(/must be an integer/);
                });

                it('invalid string value', () => {
                    expect(() => Schema(2, { type: 'integer', minimum: "2" })).to.throw(/must be an integer/);
                });

            });

            describe('maximum and minimum', () => {

                it('max above min', () => {
                    expect(() => Schema(2, { type: 'integer', minimum: -1, maximum: 0 })).not.to.throw();
                });

                it('max at min', () => {
                    expect(() => Schema(2, { type: 'integer', minimum: 0, maximum: 0 })).not.to.throw();
                });

                it('max at min exclusive', () => {
                    expect(() => Schema(2, { type: 'integer', minimum: 0, maximum: 0, exclusiveMaximum: true })).to.throw(/"minimum" must be less than "maximum"/);
                });

                it('max below min', () => {
                    expect(() => Schema(2, { type: 'integer', minimum: 1, maximum: 0 })).to.throw(/"minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('multipleOf', () => {

                it('integer', () => {
                    expect(() => Schema(2, { type: 'integer', multipleOf: 2 })).not.to.throw();
                });

                it('non-positive integer', () => {
                    expect(() => Schema(2, { type: 'integer', multipleOf: 0 })).to.throw(/Property "multipleOf" must be a positive integer/);
                });

                it('not integer', () => {
                    expect(() => Schema(2, { type: 'integer', multipleOf: 1.2 })).to.throw(/Property "multipleOf" must be a positive integer/);
                });

            });

        });

        describe('number', () => {

            describe('format', () => {

                it('valid format', () => {
                    expect(() => Schema(2, { type: 'number', format: 'float' })).not.to.throw();
                });

                it('invalid format', () => {
                    expect(() => Schema(2, { type: 'number', format: 'int32' })).to.throw(/Invalid "format"/);
                });

            });

            describe('maximum', () => {

                it('valid value', () => {
                    expect(() => Schema(2, { type: 'number', maximum: 2.2 })).not.to.throw();
                });

                it('invalid string value', () => {
                    expect(() => Schema(2, { type: 'number', maximum: "2" })).to.throw(/must be a number/);
                });

            });

            describe('minimum', () => {

                it('valid value', () => {
                    expect(() => Schema(2, { type: 'number', minimum: 2.2 })).not.to.throw();
                });

                it('invalid string value', () => {
                    expect(() => Schema(2, { type: 'number', minimum: "2" })).to.throw(/must be a number/);
                });

            });

            describe('maximum and minimum', () => {

                it('max above min', () => {
                    expect(() => Schema(2, { type: 'number', minimum: -0.1, maximum: 0.1 })).not.to.throw();
                });

                it('max at min', () => {
                    expect(() => Schema(2, { type: 'number', minimum: 0, maximum: 0 })).not.to.throw();
                });

                it('max at min exclusive', () => {
                    expect(() => Schema(2, { type: 'number', minimum: 0, maximum: 0, exclusiveMaximum: true })).to.throw(/"minimum" must be less than "maximum"/);
                });

                it('max below min', () => {
                    expect(() => Schema(2, { type: 'number', minimum: 1, maximum: 0 })).to.throw(/"minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('multipleOf', () => {

                it('integer', () => {
                    expect(() => Schema(2, { type: 'number', multipleOf: 0.5 })).not.to.throw();
                });

                it('non-positive integer', () => {
                    expect(() => Schema(2, { type: 'number', multipleOf: 0 })).to.throw(/Property "multipleOf" must be a positive number/);
                });

            });

        });

        describe('object', () => {

            describe('maxProperties', () => {

                it('non-negative integer', () => {
                    expect(() => Schema(2, { type: 'object', maxProperties: 1 })).not.to.throw();
                });

                it('decimal', () => {
                    expect(() => Schema(2, { type: 'object', maxProperties: 1.2 })).to.throw(/Property "maxProperties" must be a non-negative integer/);
                });

                it('negative integer', () => {
                    expect(() => Schema(2, { type: 'object', maxProperties: -1 })).to.throw(/Property "maxProperties" must be a non-negative integer/);
                });

            });

            describe('minProperties', () => {

                it('non-negative integer', () => {
                    expect(() => Schema(2, { type: 'object', minProperties: 1 })).not.to.throw();
                });

                it('decimal', () => {
                    expect(() => Schema(2, { type: 'object', minProperties: 1.2 })).to.throw(/Property "minProperties" must be a non-negative integer/);
                });

                it('negative integer', () => {
                    expect(() => Schema(2, { type: 'object', minProperties: -1 })).to.throw(/Property "minProperties" must be a non-negative integer/);
                });

            });

            describe('maxProperties and minProperties', () => {

                it('max above min', () => {
                    expect(() => Schema(2, { type: 'object', minProperties: 0, maxProperties: 1 })).not.to.throw();
                });

                it('max at min', () => {
                    expect(() => Schema(2, { type: 'object', minProperties: 1, maxProperties: 1 })).not.to.throw();
                });

                it('max below min', () => {
                    expect(() => Schema(2, { type: 'object', minProperties: 1, maxProperties: 0 })).to.throw(/Property "minProperties" must be less than or equal to "maxProperties"/);
                });

            });

            describe('discriminator', () => {

                describe('version 2', () => {

                    it('valid', () => {
                        const schema = { type: 'object', discriminator: 'x', required: ['x'] };
                        expect(() => Schema(2, schema)).not.to.throw();
                    });

                    it('not a string', () => {
                        const schema = { type: 'object', discriminator: 1 };
                        expect(() => Schema(2, schema)).to.throw(/Discriminator must be a string/);
                    });

                    it('missing required', () => {
                        const schema = { type: 'object', discriminator: 'x' };
                        expect(() => Schema(2, schema)).to.throw(/Property "x" must be listed as required/);
                    });

                });

                describe('version 3', () => {

                    it('valid', () => {
                        const schema = {
                            type: 'object',
                            required: ['x'],
                            discriminator: {
                                propertyName: 'x'
                            }
                        };
                        expect(() => Schema(3, schema)).not.to.throw();
                    });

                    it('not an object', () => {
                        const schema = { type: 'object', discriminator: 1 };
                        expect(() => Schema(3, schema)).to.throw(/Discriminator must be an object/);
                    });

                    it('missing propertyName', () => {
                        const schema = { type: 'object', discriminator: {} };
                        expect(() => Schema(3, schema)).to.throw(/Missing required property: propertyName/);
                    });

                    it('invalid propertyName', () => {
                        const schema = { type: 'object', discriminator: { propertyName: 1 } };
                        expect(() => Schema(3, schema)).to.throw(/Property "propertyName" must be a string/);
                    });

                    it('missing required', () => {
                        const schema = { type: 'object', discriminator: { propertyName: 'x' } };
                        expect(() => Schema(3, schema)).to.throw(/Property "x" must be listed as required/);
                    });

                    describe('mapping', () => {
                        const base = { type: 'object', discriminator: { propertyName: 'x' }, required: ['x'] };

                        it('valid', () => {
                            const schema = util.copy(base);
                            schema.discriminator.mapping = { a: { type: 'object' } };
                            const s = Schema(3, schema);
                            expect(s.discriminator.mapping.a).to.be.instanceOf(Constructor);
                        });

                        it('not an object', () => {
                            const schema = util.copy(base);
                            schema.discriminator.mapping = 5;
                            expect(() => Schema(3, schema)).to.throw(/Property "mapping" must be an object/);
                        });

                        it('mapping key not object', () => {
                            const schema = util.copy(base);
                            schema.discriminator.mapping = { a: 5 };
                            expect(() => Schema(3, schema)).to.throw(/Mapped value for "a" must be an object/);
                        });

                    });

                });

            });

            describe('required', () => {

                it('array of valid strings', () => {
                    expect(() => Schema(2, { type: 'object', required: ['a'] })).not.to.throw();
                });

                it('empty array ok', () => {
                    expect(() => Schema(2, { type: 'object', required: [] })).not.to.throw();
                });

                it('array with empty string', () => {
                    expect(() => Schema(2, { type: 'object', required: [''] })).to.throw(/Property "required" must be an array of non-empty strings/);
                });

                it('array with number', () => {
                    expect(() => Schema(2, { type: 'object', required: [1] })).to.throw(/Property "required" must be an array of non-empty strings/);
                });

                it('not array', () => {
                    expect(() => Schema(2, { type: 'object', required: {} })).to.throw(/Property "required" must be an array of non-empty strings/);
                });

            });

            describe('additionalProperties', () => {

                it('object ok', () => {
                    const s = Schema(2, { type: 'object', additionalProperties: { type: 'string' }});
                    expect(s.additionalProperties).to.be.instanceOf(Constructor);
                });

                it('true ok', () => {
                    const s = Schema(2, { type: 'object', additionalProperties: true });
                    expect(s.additionalProperties).to.equal(true);
                });

                it('false ok', () => {
                    const s = Schema(2, { type: 'object', additionalProperties: false });
                    expect(s.additionalProperties).to.equal(false);
                });

                it('other not ok', () => {
                    expect(() => Schema(2, { type: 'object', additionalProperties: [] })).to.throw(/Property "additionalProperties" must be an object/);
                });

            });

            describe('properties', () => {

                it('valid object', () => {
                    const schema = { type: 'object', properties: { a: { type: 'string' }} };
                    const s = Schema(2, schema);
                    expect(s.properties.a).to.be.instanceOf(Constructor);
                });

                it('must be an object', () => {
                    const schema = { type: 'object', properties: [] };
                    expect(() => Schema(2, schema)).to.throw(/Property "properties" must be an object/);
                });

                it('sub properties must be objects', () => {
                    const schema = { type: 'object', properties: { a: 5 } };
                    expect(() => Schema(2, schema)).to.throw(/Property "a" must be an object/);
                });

            });

        });

        describe('string', () => {

            it('invalid format', () => {
                const schema = { type: 'string', format: 'float' };
                expect(() => Schema(2, schema)).to.throw(/Invalid "format" specified/);
            });

            it('maximum not allowed for non dates', () => {
                const schema = { type: 'string', maximum: '' };
                expect(() => Schema(2, schema, { throw: true })).to.throw(/Property "maximum" not allowed/);
            });

            it('minimum not allowed for non dates', () => {
                const schema = { type: 'string', minimum: '' };
                expect(() => Schema(2, schema)).to.throw(/Property "minimum" not allowed/);
            });

            it('exclusiveMaximum not allowed for non dates', () => {
                const schema = { type: 'string', exclusiveMaximum: true };
                expect(() => Schema(2, schema, { throw: true })).to.throw(/Property "exclusiveMaximum" not allowed/);
            });

            it('exclusiveMinimum not allowed for non dates', () => {
                const schema = { type: 'string', exclusiveMinimum: true };
                expect(() => Schema(2, schema)).to.throw(/Property "exclusiveMinimum" not allowed/);
            });

            describe('date format', () => {

                it('maximum valid', () => {
                    const schema = { type: 'string', format: 'date', maximum: '2000-01-01' };
                    expect(() => Schema(2, schema)).not.to.throw();
                });

                it('maximum invalid format', () => {
                    const schema = { type: 'string', format: 'date', maximum: '2000-01-01T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).to.throw(/Property "maximum" is not formatted as a date/);
                });

                it('minimum valid', () => {
                    const schema = { type: 'string', format: 'date', minimum: '2000-01-01' };
                    expect(() => Schema(2, schema)).not.to.throw();
                });

                it('minimum invalid format', () => {
                    const schema = { type: 'string', format: 'date', minimum: '2000-01-01T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).to.throw(/Property "minimum" is not formatted as a date/);
                });

            });

            describe('date-time format', () => {

                it('maximum valid', () => {
                    const schema = { type: 'string', format: 'date-time', maximum: '2000-01-01T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).not.to.throw();
                });

                it('maximum invalid format', () => {
                    const schema = { type: 'string', format: 'date-time', maximum: '2000-01-01' };
                    expect(() => Schema(2, schema)).to.throw(/Property "maximum" is not formatted as a date-time/);
                });

                it('maximum invalid date', () => {
                    const schema = { type: 'string', format: 'date-time', maximum: '2000-02-30T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).to.throw(/Property "maximum" is not a valid date-time/);
                });

                it('minimum valid', () => {
                    const schema = { type: 'string', format: 'date-time', minimum: '2000-01-01T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).not.to.throw();
                });

                it('minimum invalid format', () => {
                    const schema = { type: 'string', format: 'date-time', minimum: '2000-01-01' };
                    expect(() => Schema(2, schema)).to.throw(/Property "minimum" is not formatted as a date-time/);
                });

                it('minimum invalid date', () => {
                    const schema = { type: 'string', format: 'date-time', minimum: '2000-02-30T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).to.throw(/Property "minimum" is not a valid date-time/);
                });

                it('maximum above minimum', () => {
                    const schema = { type: 'string', format: 'date-time',
                        maximum: '2000-01-02T00:00:00.000Z',
                        minimum: '2000-01-01T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).not.to.throw();
                });

                it('maximum at minimum', () => {
                    const schema = { type: 'string', format: 'date-time',
                        maximum: '2000-01-01T00:00:00.000Z',
                        minimum: '2000-01-01T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).not.to.throw();
                });

                it('maximum at minimum exclusive', () => {
                    const schema = { type: 'string', format: 'date-time',
                        exclusiveMinimum: true,
                        maximum: '2000-01-01T00:00:00.000Z',
                        minimum: '2000-01-01T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).to.throw(/Property "minimum" must be less than "maximum"/);
                });

                it('maximum below minimum', () => {
                    const schema = { type: 'string', format: 'date-time',
                        maximum: '2000-01-01T00:00:00.000Z',
                        minimum: '2000-01-02T00:00:00.000Z' };
                    expect(() => Schema(2, schema)).to.throw(/Property "minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('maxLength', () => {

                it('non-negative integer', () => {
                    expect(() => Schema(2, { type: 'string', maxLength: 0 })).not.to.throw();
                });

                it('negative integer', () => {
                    expect(() => Schema(2, { type: 'string', maxLength: -1 })).to.throw(/Property "maxLength" must be a non-negative integer/);
                });

                it('decimal', () => {
                    expect(() => Schema(2, { type: 'string', maxLength: 0.5 })).to.throw(/Property "maxLength" must be a non-negative integer/);
                });

            });

            describe('minLength', () => {

                it('non-negative integer', () => {
                    expect(() => Schema(2, { type: 'string', minLength: 0 })).not.to.throw();
                });

                it('negative integer', () => {
                    expect(() => Schema(2, { type: 'string', minLength: -1 })).to.throw(/Property "minLength" must be a non-negative integer/);
                });

                it('decimal', () => {
                    expect(() => Schema(2, { type: 'string', minLength: 0.5 })).to.throw(/Property "minLength" must be a non-negative integer/);
                });

            });

            describe('maxLength and minLength', () => {

                it('max above min', () => {
                    expect(() => Schema(2, { type: 'string', minLength: 0, maxLength: 1 })).not.to.throw();
                });

                it('max at min', () => {
                    expect(() => Schema(2, { type: 'string', minLength: 0, maxLength: 0 })).not.to.throw();
                });

                it('max below min', () => {
                    expect(() => Schema(2, { type: 'string', minLength: 1, maxLength: 0 })).to.throw(/Property "minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('pattern', () => {

                it('string ok', () => {
                    expect(() => Schema(2, { type: 'string', pattern: 'abc' })).not.to.throw();
                });

                it('number not ok', () => {
                    expect(() => Schema(2, { type: 'string', pattern: 0 })).to.throw(/Property "pattern" must be a string/);
                });

            });

        });

    });

});