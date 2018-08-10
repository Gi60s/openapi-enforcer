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
const Exception     = require('../bin/exception');
const expect        = require('chai').expect;
const Schema        = require('../bin/components/schema');
const util          = require('../bin/util');

describe('components/schema', () => {

    describe('definition', () => {

        it('must be a plain object', () => {
            const { exception } = getSchema(2, []);
            expect(exception).to.match(/Must be a plain object/);
        });

        it('should produce a schema instance', () => {
            const definition = { type: 'string' };
            const { schema } = getSchema(2, definition);
            expect(schema).to.be.instanceOf(Schema);
        });

        it('should not produce an exception with a valid schema', () => {
            const definition = { type: 'string' };
            const { exception } = getSchema(2, definition);
            expect(exception.hasException).to.be.false;
        });

        it('identifies existing Schema instances', () => {
            const definition = { type: 'object', properties: {} };
            definition.properties.x = definition;
            const { exception, schema } = getSchema(2, definition);
            expect(exception.hasException).to.be.false;
            expect(schema).to.equal(schema.properties.x);
        });

        it('allows extension property', () => {
            const d = new Date();
            const b = Buffer.from('hello');
            const { exception, schema } = getSchema(2, { type: 'string', 'x-date': d, 'x-buffer': b });
            expect(exception.hasException).to.be.false;
            expect(schema['x-date']).to.deep.equal(d);
            expect(schema['x-buffer']).to.deep.equal(b);
        });

        it('does not allow invalid property', () => {
            const { exception } = getSchema(2, { type: 'string', foo: 'hello' });
            expect(exception).to.match(/Property not allowed: foo/);
        });

        it('allows a single composite', () => {
            const { exception, schema } = getSchema(2, { allOf: [{ type: 'string' }] });
            expect(exception.hasException).to.be.false;
            expect(schema.allOf[0]).to.be.instanceof(Schema);
        });

        it('does not allow multiple composites', () => {
            const { exception } = getSchema(3, { allOf: [], oneOf: [] });
            expect(exception).to.match(/Cannot have multiple composites/);
        });

        it('requires that allOf be an array', () => {
            const { exception } = getSchema(3, { allOf: {} });
            expect(exception).to.match(/must be an array/);
        });

        it('requires that anyOf be an array', () => {
            const { exception } = getSchema(3, { anyOf: {} });
            expect(exception).to.match(/must be an array/);
        });

        it('requires that oneOf be an array', () => {
            const { exception } = getSchema(3, { oneOf: {} });
            expect(exception).to.match(/must be an array/);
        });

        it('requires that not be a plain object', () => {
            const { exception } = getSchema(3, { not: [] });
            expect(exception).to.match(/Must be a plain object/);
        });

        it('requires a "type" property when not using composites', () => {
            const { exception } = getSchema(3, {});
            expect(exception).to.match(/Missing required property: type/);
        });

        it('requires a valid "type" property value', () => {
            const { exception } = getSchema(3, { type: 'hogwash' });
            expect(exception).to.match(/Invalid type specified/);
        });

    });

    describe('schema types', () => {

        describe('array', () => {

            it('should convert items plain object into Schema instance', () => {
                const { schema } = getSchema(2, { type: 'array', items: { type: 'string' } });
                expect(schema.items).to.be.instanceOf(Schema);
            });

            it('should not allow "minItems" to be less than "maxItems"', () => {
                const definition = { type: 'array', minItems: 5, maxItems: 1 };
                const { exception } = getSchema(2, definition);
                expect(exception).to.match(/Property "minItems" must be less than or equal to "maxItems"/);
            });

            describe('maxItems', () => {

                it('should allow a positive integer', () => {
                    const { exception } = getSchema(2, { type: 'array', maxItems: 5 });
                    expect(exception.hasException).to.be.false;
                });

                it('should allow zero', () => {
                    const { exception } = getSchema(2, { type: 'array', maxItems: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a negative integer', () => {
                    const { exception } = getSchema(2, { type: 'array', maxItems: -1 });
                    expect(exception).to.match(/Property "maxItems" must be a non-negative integer/);
                });

                it('should not allow a decimal value', () => {
                    const { exception } = getSchema(2, { type: 'array', maxItems: 5.5 });
                    expect(exception).to.match(/Property "maxItems" must be a non-negative integer/);
                });

            });

            describe('minItems', () => {

                it('should allow a positive integer', () => {
                    const { exception } = getSchema(2, { type: 'array', minItems: 5 });
                    expect(exception.hasException).to.be.false;
                });

                it('should allow zero', () => {
                    const { exception } = getSchema(2, { type: 'array', minItems: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a negative integer', () => {
                    const { exception } = getSchema(2, { type: 'array', minItems: -1 });
                    expect(exception).to.match(/Property "minItems" must be a non-negative integer/);
                });

                it('should not allow a decimal value', () => {
                    const { exception } = getSchema(2, { type: 'array', minItems: 5.5 });
                    expect(exception).to.match(/Property "minItems" must be a non-negative integer/);
                });

            });

        });

        describe('boolean', () => {

            it('should allow the boolean type', () => {
                const { exception } = getSchema(2, { type: 'boolean' });
                expect(exception.hasException).to.be.false;
            });

        });

        describe('integer', () => {

            describe('format', () => {

                it('should allow valid value', () => {
                    const { exception } = getSchema(2, { type: 'integer', format: 'int32' });
                    expect(exception.hasException).to.be.false;
                });

                it('should produce exception from invalid value', () => {
                    const { exception } = getSchema(2, { type: 'integer', format: 'float' });
                    expect(exception).to.match(/Invalid "format"/);
                });

            });

            describe('maximum', () => {

                it('should allow integer value', () => {
                    const { exception } = getSchema(2, { type: 'integer', maximum: 2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a decimal value', () => {
                    const { exception } = getSchema(2, { type: 'integer', maximum: 2.2 });
                    expect(exception).to.match(/must be an integer/);
                });

                it('should not allow a string value', () => {
                    const { exception } = getSchema(2, { type: 'integer', maximum: '2' });
                    expect(exception).to.match(/must be an integer/);
                });

            });

            describe('minimum', () => {

                it('should allow integer value', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: 2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a decimal value', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: 2.2 });
                    expect(exception).to.match(/must be an integer/);
                });

                it('should not allow a string value', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: '2' });
                    expect(exception).to.match(/must be an integer/);
                });

            });

            describe('maximum and minimum', () => {

                it('should allow maximum above minimum', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: -1, maximum: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('should allow maximum at minimum', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: 0, maximum: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow maximum at minimum when maximum is exclusive', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: 0, maximum: 0, exclusiveMaximum: true });
                    expect(exception).to.match(/"minimum" must be less than "maximum"/);
                });

                it('should not allow maximum at minimum when minimum is exclusive', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: 0, maximum: 0, exclusiveMinimum: true });
                    expect(exception).to.match(/"minimum" must be less than "maximum"/);
                });

                it('should not allow maximum below minimum', () => {
                    const { exception } = getSchema(2, { type: 'integer', minimum: 5, maximum: 2 });
                    expect(exception).to.match(/"minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('multipleOf', () => {

                it('should allow an integer', () => {
                    const { exception } = getSchema(2, { type: 'integer', multipleOf: 2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a non-positive integer', () => {
                    const { exception } = getSchema(2, { type: 'integer', multipleOf: 0 });
                    expect(exception).to.match(/Property "multipleOf" must be a positive integer/);
                });

                it('should not allow a decimal', () => {
                    const { exception } = getSchema(2, { type: 'integer', multipleOf: 1.2 });
                    expect(exception).to.match(/Property "multipleOf" must be a positive integer/);
                });

            });

        });

        describe('number', () => {

            describe('format', () => {

                it('should allow valid value', () => {
                    const { exception } = getSchema(2, { type: 'number', format: 'float' });
                    expect(exception.hasException).to.be.false;
                });

                it('should produce exception from invalid value', () => {
                    const { exception } = getSchema(2, { type: 'number', format: 'int32' });
                    expect(exception).to.match(/Invalid "format"/);
                });

            });

            describe('maximum', () => {

                it('should allow number value', () => {
                    const { exception } = getSchema(2, { type: 'number', maximum: 2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should allow a decimal value', () => {
                    const { exception } = getSchema(2, { type: 'number', maximum: 2.2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a string value', () => {
                    const { exception } = getSchema(2, { type: 'number', maximum: '2' });
                    expect(exception).to.match(/must be a number/);
                });

            });

            describe('minimum', () => {

                it('should allow number value', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: 2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should allow a decimal value', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: 2.2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a string value', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: '2' });
                    expect(exception).to.match(/must be a number/);
                });

            });

            describe('maximum and minimum', () => {

                it('should allow maximum above minimum', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: -1, maximum: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('should allow maximum at minimum', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: 0, maximum: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow maximum at minimum when maximum is exclusive', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: 0, maximum: 0, exclusiveMaximum: true });
                    expect(exception).to.match(/"minimum" must be less than "maximum"/);
                });

                it('should not allow maximum at minimum when minimum is exclusive', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: 0, maximum: 0, exclusiveMinimum: true });
                    expect(exception).to.match(/"minimum" must be less than "maximum"/);
                });

                it('should not allow maximum below minimum', () => {
                    const { exception } = getSchema(2, { type: 'number', minimum: 2, maximum: 1 });
                    expect(exception).to.match(/"minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('multipleOf', () => {

                it('should allow a number', () => {
                    const { exception } = getSchema(2, { type: 'number', multipleOf: 2 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a non-positive number', () => {
                    const { exception } = getSchema(2, { type: 'number', multipleOf: 0 });
                    expect(exception).to.match(/Property "multipleOf" must be a positive number/);
                });

                it('should allow a decimal', () => {
                    const { exception } = getSchema(2, { type: 'number', multipleOf: 1.2 });
                    expect(exception.hasException).to.be.false;
                });

            });

        });

        describe('object', () => {

            describe('maxProperties', () => {

                it('should allow a non-negative integer', () => {
                    const { exception } = getSchema(2, { type: 'object', maxProperties: 1 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow a decimal', () => {
                    const { exception } = getSchema(2, { type: 'object', maxProperties: 1.2 });
                    expect(exception).to.match(/Property "maxProperties" must be a non-negative integer/);
                });

                it('should not allow a negative integer', () => {
                    const { exception } = getSchema(2, { type: 'object', maxProperties: -1 });
                    expect(exception).to.match(/Property "maxProperties" must be a non-negative integer/);
                });

                it('should not allow more required properties than max properties', () => {
                    const { exception } = getSchema(2, { type: 'object', maxProperties: 1, required: ['a', 'b']});
                    expect(exception).to.match(/The number or "required" properties exceeds the "maxProperties" value/);
                })

            });

            describe('minProperties', () => {

                it('should allow a non-negative integer', () => {
                    const { exception } = getSchema(2, { type: 'object', minProperties: 1 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow decimal', () => {
                    const { exception } = getSchema(2, { type: 'object', minProperties: 1.2 });
                    expect(exception).to.match(/Property "minProperties" must be a non-negative integer/);
                });

                it('should not allow a negative integer', () => {
                    const { exception } = getSchema(2, { type: 'object', minProperties: -1 });
                    expect(exception).to.match(/Property "minProperties" must be a non-negative integer/);
                });

            });

            describe('maxProperties and minProperties', () => {

                it('should allow max above min', () => {
                    const { exception } = getSchema(2, { type: 'object', minProperties: 0, maxProperties: 1 });
                    expect(exception.hasException).to.be.false;
                });

                it('should allow max at min', () => {
                    const { exception } = getSchema(2, { type: 'object', minProperties: 1, maxProperties: 1 });
                    expect(exception.hasException).to.be.false;
                });

                it('should not allow max below min', () => {
                    const { exception } = getSchema(2, { type: 'object', minProperties: 1, maxProperties: 0 });
                    expect(exception).to.match(/Property "minProperties" must be less than or equal to "maxProperties"/);
                });

            });

            describe('discriminator', () => {

                describe('version 2', () => {

                    it('should accept a valid schema', () => {
                        const { exception } = getSchema(2, { type: 'object', discriminator: 'x', required: ['x'] });
                        expect(exception.hasException).to.be.false;
                    });

                    it('should not allow a non-string as the discriminator value', () => {
                        const { exception } = getSchema(2, { type: 'object', discriminator: 1 });
                        expect(exception).to.match(/Discriminator must be a string/);
                    });

                    it('should require the discriminator property', () => {
                        const { exception } = getSchema(2, { type: 'object', discriminator: 'x' });
                        expect(exception).to.match(/Property "x" must be listed as required/);
                    });

                });

                describe('version 3', () => {

                    it('should accept a valid schema', () => {
                        const schema = {
                            type: 'object',
                            required: ['x'],
                            discriminator: {
                                propertyName: 'x'
                            }
                        };
                        const { exception } = getSchema(3, schema);
                        expect(exception.hasException).to.be.false;
                    });

                    it('requires the discriminator to be an object', () => {
                        const { exception } = getSchema(3, { type: 'object', discriminator: 1 });
                        expect(exception).to.match(/Discriminator must be an object/);
                    });

                    it('must have a property "propertyName"', () => {
                        const { exception } = getSchema(3, { type: 'object', discriminator: {} });
                        expect(exception).to.match(/Missing required property: propertyName/);
                    });

                    it('requires the "propertyName" to be a string', () => {
                        const { exception } = getSchema(3, { type: 'object', discriminator: { propertyName: 1 } });
                        expect(exception).to.match(/Property "propertyName" must be a string/);
                    });

                    it('requires the discriminator property name to be a required property', () => {
                        const { exception } = getSchema(3, { type: 'object', discriminator: { propertyName: 'x' } });
                        expect(exception).to.match(/Property "x" must be listed as required/);
                    });

                    describe('mapping', () => {
                        const base = { type: 'object', discriminator: { propertyName: 'x' }, required: ['x'] };

                        it('has mapped objects as Schema instances', () => {
                            const def = util.copy(base);
                            def.discriminator.mapping = { a: { type: 'object' } };
                            const { schema } = getSchema(3, def);
                            expect(schema.discriminator.mapping.a).to.be.instanceOf(Schema);
                        });

                        it('requires the mapping to be an object', () => {
                            const schema = util.copy(base);
                            schema.discriminator.mapping = 5;
                            const { exception } = getSchema(3, schema);
                            expect(exception).to.match(/Property "mapping" must be an object/);
                        });

                        it('requires mapping key values to be an object', () => {
                            const schema = util.copy(base);
                            schema.discriminator.mapping = { a: 5 };
                            const { exception } = getSchema(3, schema);
                            expect(exception).to.match(/Mapped value for "a" must be an object/);
                        });

                    });

                });

            });

            describe('required', () => {

                it('should be an array of valid strings', () => {
                    const { exception } = getSchema(2, { type: 'object', required: ['a'] });
                    expect(exception.hasException).to.be.false;
                });

                it('allows an empty array', () => {
                    const { exception } = getSchema(2, { type: 'object', required: [] });
                    expect(exception.hasException).to.be.false;
                });

                it('does not allow an empty string in the array', () => {
                    const { exception } = getSchema(2, { type: 'object', required: [''] });
                    expect(exception).to.match(/Property "required" must be an array of non-empty strings/);
                });

                it('should not allow an array with a number', () => {
                    const { exception } = getSchema(2, { type: 'object', required: [1] });
                    expect(exception).to.match(/Property "required" must be an array of non-empty strings/);
                });

                it('should not allow a non-array', () => {
                    const { exception } = getSchema(2, { type: 'object', required: {} });
                    expect(exception).to.match(/Property "required" must be an array of non-empty strings/);
                });

            });

            describe('additionalProperties', () => {

                it('allows an object definition', () => {
                    const { schema } = getSchema(2, { type: 'object', additionalProperties: { type: 'string' }});
                    expect(schema.additionalProperties).to.be.instanceOf(Schema);
                });

                it('allows true', () => {
                    const { exception, schema } = getSchema(2, { type: 'object', additionalProperties: true });
                    expect(exception.hasException).to.be.false;
                    expect(schema.additionalProperties).to.equal(true);
                });

                it('allows falise', () => {
                    const { exception, schema } = getSchema(2, { type: 'object', additionalProperties: false });
                    expect(exception.hasException).to.be.false;
                    expect(schema.additionalProperties).to.equal(false);
                });

                it('does not allow an array', () => {
                    const { exception } = getSchema(2, { type: 'object', additionalProperties: [] });
                    expect(exception).to.match(/Must be a plain object/);
                });

            });

            describe('properties', () => {

                it('converts each property value into a Schema instance', () => {
                    const { schema } = getSchema(2, { type: 'object', properties: { a: { type: 'string' }} });
                    expect(schema.properties.a).to.be.instanceOf(Schema);
                });

                it('must be an object', () => {
                    const { exception } = getSchema(2, { type: 'object', properties: [] });
                    expect(exception).to.match(/Property "properties" must be an object/);
                });

                it('sub properties must be objects', () => {
                    const { exception } = getSchema(2, { type: 'object', properties: { a: 5 } });
                    expect(exception).to.match(/Must be a plain object/);
                });

            });

        });

        describe('string', () => {

            it('has exception for invalid format', () => {
                const { exception } = getSchema(2, { type: 'string', format: 'float' });
                expect(exception).to.match(/Invalid "format" specified/);
            });

            it('does not allow property "maximum" when format is not date or date-time', () => {
                const { exception } = getSchema(2, { type: 'string', maximum: '' });
                expect(exception).to.match(/Property "maximum" not allowed/);
            });

            it('does not allow property "minimum" when format is not date or date-time', () => {
                const { exception } = getSchema(2, { type: 'string', minimum: '' });
                expect(exception).to.match(/Property "minimum" not allowed/);
            });

            it('does not allow property "exclusiveMaximum" when format is not date or date-time', () => {
                const { exception } = getSchema(2, { type: 'string', exclusiveMaximum: true });
                expect(exception).to.match(/Property "exclusiveMaximum" not allowed/);
            });

            it('does not allow property "exclusiveMinimum" when format is not date or date-time', () => {
                const { exception } = getSchema(2, { type: 'string', exclusiveMinimum: true });
                expect(exception).to.match(/Property "exclusiveMinimum" not allowed/);
            });

            describe('date format', () => {

                it('should allow a valid maximum', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date', maximum: '2000-01-01' });
                    expect(exception.hasException).to.be.false;
                });

                it('should have an exception if maximum is an invalid format', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date', maximum: '2000-01-01T00:00:00.000Z' });
                    expect(exception).to.match(/Property "maximum" is not formatted as a date/);
                });

                it('should allow a valid minimum', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date', minimum: '2000-01-01' });
                    expect(exception.hasException).to.be.false;
                });

                it('should have an exception if minimum is an invalid format', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date', minimum: '2000-01-01T00:00:00.000Z' });
                    expect(exception).to.match(/Property "minimum" is not formatted as a date/);
                });

            });

            describe('date-time format', () => {

                it('maximum valid', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time', maximum: '2000-01-01T00:00:00.000Z' });
                    expect(exception.hasException).to.be.false;
                });

                it('maximum invalid format', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time', maximum: '2000-01-01' });
                    expect(exception).to.match(/Property "maximum" is not formatted as a date-time/);
                });

                it('maximum invalid date', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time', maximum: '2000-02-30T00:00:00.000Z' });
                    expect(exception).to.match(/Property "maximum" is not a valid date-time/);
                });

                it('minimum valid', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time', minimum: '2000-01-01T00:00:00.000Z' });
                    expect(exception.hasException).to.be.false;
                });

                it('minimum invalid format', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time', minimum: '2000-01-01' });
                    expect(exception).to.match(/Property "minimum" is not formatted as a date-time/);
                });

                it('minimum invalid date', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time', minimum: '2000-02-30T00:00:00.000Z' });
                    expect(exception).to.match(/Property "minimum" is not a valid date-time/);
                });

                it('maximum above minimum', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time',
                        maximum: '2000-01-02T00:00:00.000Z',
                        minimum: '2000-01-01T00:00:00.000Z' });
                    expect(exception.hasException).to.be.false;
                });

                it('maximum at minimum', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time',
                        maximum: '2000-01-01T00:00:00.000Z',
                        minimum: '2000-01-01T00:00:00.000Z' });
                    expect(exception.hasException).to.be.false;
                });

                it('maximum at minimum exclusive', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time',
                        exclusiveMinimum: true,
                        maximum: '2000-01-01T00:00:00.000Z',
                        minimum: '2000-01-01T00:00:00.000Z' });
                    expect(exception).to.match(/Property "minimum" must be less than "maximum"/);
                });

                it('maximum below minimum', () => {
                    const { exception } = getSchema(2, { type: 'string', format: 'date-time',
                        maximum: '2000-01-01T00:00:00.000Z',
                        minimum: '2000-01-02T00:00:00.000Z' });
                    expect(exception).to.match(/Property "minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('maxLength', () => {

                it('non-negative integer', () => {
                    const { exception } = getSchema(2, { type: 'string', maxLength: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('negative integer', () => {
                    const { exception } = getSchema(2, { type: 'string', maxLength: -1 });
                    expect(exception).to.match(/Property "maxLength" must be a non-negative integer/);
                });

                it('decimal', () => {
                    const { exception } = getSchema(2, { type: 'string', maxLength: 0.5 });
                    expect(exception).to.match(/Property "maxLength" must be a non-negative integer/);
                });

            });

            describe('minLength', () => {

                it('non-negative integer', () => {
                    const { exception } = getSchema(2, { type: 'string', minLength: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('negative integer', () => {
                    const { exception } = getSchema(2, { type: 'string', minLength: -1 });
                    expect(exception).to.match(/Property "minLength" must be a non-negative integer/);
                });

                it('decimal', () => {
                    const { exception } = getSchema(2, { type: 'string', minLength: 0.5 });
                    expect(exception).to.match(/Property "minLength" must be a non-negative integer/);
                });

            });

            describe('maxLength and minLength', () => {

                it('max above min', () => {
                    const { exception } = getSchema(2, { type: 'string', minLength: 0, maxLength: 1 });
                    expect(exception.hasException).to.be.false;
                });

                it('max at min', () => {
                    const { exception } = getSchema(2, { type: 'string', minLength: 0, maxLength: 0 });
                    expect(exception.hasException).to.be.false;
                });

                it('max below min', () => {
                    const { exception } = getSchema(2, { type: 'string', minLength: 1, maxLength: 0 });
                    expect(exception).to.match(/Property "minimum" must be less than or equal to "maximum"/);
                });

            });

            describe('pattern', () => {

                it('string ok', () => {
                    const { exception } = getSchema(2, { type: 'string', pattern: 'abc' });
                    expect(exception.hasException).to.be.false;
                });

                it('number not ok', () => {
                    const { exception } = getSchema(2, { type: 'string', pattern: 0 });
                    expect(exception).to.match(/Property "pattern" must be a string/);
                });

            });

        });

    });

    describe('defaults', () => {

        it('allows a valid default value', () => {
            const { exception } = getSchema(2, { type: 'number', default: 2 });
            expect(exception.hasException).to.be.false;
        });

        it('does not allow an invalid type for default value', () => {
            const { exception } = getSchema(2, { type: 'number', default: '' });
            expect(exception).to.match(/Default value is not valid/);
        });

        it('does not allow an invalid default value', () => {
            const { exception } = getSchema(2, { type: 'number', maximum: 4, default: 5 });
            expect(exception).to.match(/Default value is not valid/);
        });

        it('will deserialize a default value', () => {
            const { exception, schema } = getSchema(2, { type: 'string', format: 'date', default: '2000-01-01' });
            expect(exception.hasException).to.be.false;
            expect(schema.default).to.be.instanceOf(Date);
        });

        it('cannot deserialize a poorly formatted default value', () => {
            const { exception } = getSchema(2, { type: 'string', format: 'date', default: 'hello' });
            expect(exception).to.match(/Unable to deserialize default value/);
        });

        it('will validate a default value', () => {
            const { exception } = getSchema(2, { type: 'string', format: 'date', maximum: '2000-01-01', default: '2000-01-02' });
            expect(exception).to.match(/Expected date to be less than or equal to/);
        });

        it('will deep deserialize a default value', () => {
            const s = {
                type: 'object',
                properties: {
                    start: { type: 'string', format: 'date' }
                },
                default: {
                    start: '2000-01-02'
                }
            };
            const { exception, schema } = getSchema(2, s);
            expect(exception.hasException).to.be.false;
            expect(schema.default.start).to.be.instanceof(Date);
        });

    });

    describe('examples', () => {

        it('allows a valid example', () => {
            const { exception } = getSchema(2, { type: 'number', example: 2 });
            expect(exception.hasException).to.be.false;
        });

        it('does not allow an invalid example', () => {
            const { exception } = getSchema(2, { type: 'number', example: '' });
            expect(exception).to.match(/Example is not valid/);
        });

        it('will deserialize an example', () => {
            const { exception, schema } = getSchema(2, { type: 'string', format: 'date', example: '2000-01-01' });
            expect(exception.hasException).to.be.false;
            expect(schema.example).to.be.instanceOf(Date);
        });

        it('cannot deserialize a poorly formatted example', () => {
            const { exception } = getSchema(2, { type: 'string', format: 'date', example: 'hello' });
            expect(exception).to.match(/Unable to deserialize example/);
        });

    });

    describe('enum', () => {

        it('allows a valid value', () => {
            const { exception } = getSchema(2, { type: 'number', enum: [1, 2, 3] });
            expect(exception.hasException).to.be.false;
        });

        it('must be an array', () => {
            const { exception } = getSchema(2, { type: 'number', enum: 1 });
            expect(exception).to.match(/Property "enum" must be an array/);
        });

        it('does not allow an invalid enum value', () => {
            const { exception } = getSchema(2, { type: 'number', enum: [1, '2'] });
            expect(exception).to.match(/Invalid enum value/);
        });

        it('will deserialize enum values', () => {
            const { exception, schema } = getSchema(2, { type: 'string', format: 'date', enum: ['2000-01-01', '2000-01-02'] });
            expect(exception.hasException).to.be.false;
            expect(schema.enum[0]).to.be.instanceOf(Date);
            expect(schema.enum[1]).to.be.instanceOf(Date);
        });

        it('cannot deserialize a poorly formatted enum value', () => {
            const { exception } = getSchema(2, { type: 'string', format: 'date', enum: ['hello'] });
            expect(exception).to.match(/Unable to deserialize enum value/);
        });

        it('will validate enum values', () => {
            const { exception } = getSchema(2, { type: 'string', format: 'date', maximum: '2000-01-01', enum: ['2000-01-02'] });
            expect(exception).to.match(/Invalid enum value/);
        });

    });

});

function getSchema(version, definition) {
    const exception = Exception('');
    const schema = new Schema({ version }, exception, definition, new WeakMap());
    return { exception, schema };
}