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
const definition    = require('../bin/definition/index').normalize;
const expect        = require('chai').expect;
const Schema        = require('../bin/definition/schema');

describe.only('definitions/schema', () => {

    it('allows a valid schema object', () => {
        const [ err ] = definition(2, Schema, { type: 'string' });
        expect(err).to.be.undefined;
    });

    describe('type', () => {

        it('requires the "type" property', () => {
            const [ err ] = definition(2, Schema, {});
            expect(err).to.match(/Missing required property: type/);
        });

        it('requires a valid type', () => {
            const [ err ] = definition(2, Schema, { type: 'foo' });
            expect(err).to.match(/Value must be one of:/);
        });

    });

    describe('format', () => {

        it('allows valid format', () => {
            const [ err ] = definition(2, Schema, { type: 'string', format: 'date' });
            expect(err).to.be.undefined;
        });

        it('does not allow invalid format', () => {
            const [ err ] = definition(2, Schema, { type: 'string', format: 'foo' });
            expect(err).to.match(/Value must be one of:/);
        });

    });

    describe('default', () => {

        it('allows default', () => {
            const [ err, def ] = definition(2, Schema, { type: 'string', default: 'hello' });
            expect(err).to.be.undefined;
            expect(def).to.deep.equal({ type: 'string', default: 'hello' });
        });

        it('deserializes default', () => {
            const [ err, def ] = definition(2, Schema, { type: 'string', format: 'date', default: '2000-01-01' });
            expect(err).to.be.undefined;
            expect(def.default).to.deep.equal(new Date('2000-01-01'));
        });

    });

    describe('multipleOf', () => {

        it('allows multipleOf for number', () => {
            const [ err, def ] = definition(2, Schema, { type: 'number', multipleOf: 2 });
            expect(err).to.be.undefined;
        });

        it('does not allow multipleOf for string', () => {
            const [ err, def ] = definition(2, Schema, { type: 'string', multipleOf: 2 });
            expect(err).to.match(/Property not allowed: multipleOf/);
        });

    });

    describe('maximum and minimum', () => {

        it('allows maximum for number', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', maximum: 5 });
            expect(err).to.be.undefined;
        });

        it('allows maximum for string date', () => {
            const [ err, def ] = definition(2, Schema, { type: 'string', format: 'date', maximum: '2000-01-01' });
            expect(err).to.be.undefined;
            expect(def.maximum).to.be.instanceof(Date);
        });

        it('does not allow maximum for array', () => {
            const [ err ] = definition(2, Schema, { type: 'array', maximum: '2000-01-01' });
            expect(err).to.match(/Property not allowed: maximum/);
        });

        it('allows minimum for number', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', minimum: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minimum below maximum', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', minimum: 0, maximum: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minimum at maximum', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', minimum: 5, maximum: 5 });
            expect(err).to.be.undefined;
        });

        it('does not allow exclusive minimum at maximum', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', minimum: 5, maximum: 5, exclusiveMinimum: true });
            expect(err).to.match(/Property "minimum" must be less than "maximum"/);
        });

        it('does not allow minimum above maximum', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', minimum: 6, maximum: 5 });
            expect(err).to.match(/Property "minimum" must be less than or equal to "maximum"/);
        });

    });

    describe('maxItems and minItems', () => {

        it('allows maxItems for array', () => {
            const [ err  ] = definition(2, Schema, { type: 'array', maxItems: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minItems for array', () => {
            const [ err  ] = definition(2, Schema, { type: 'array', minItems: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minItems below maxItems', () => {
            const [ err  ] = definition(2, Schema, { type: 'array', minItems: 0, maxItems: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minItems at maxItems', () => {
            const [ err  ] = definition(2, Schema, { type: 'array', minItems: 5, maxItems: 5 });
            expect(err).to.be.undefined;
        });

        it('does not allow minItems above maxItems', () => {
            const [ err  ] = definition(2, Schema, { type: 'array', minItems: 6, maxItems: 5 });
            expect(err).to.match(/Property "minItems" must be less than or equal to "maxItems"/);
        });

        it('does not allow maxItems for number', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', maxItems: 5 });
            expect(err).to.match(/Property not allowed: maxItems/);
        });

    });

    describe('maxLength and minLength', () => {

        it('allows maxLength for string', () => {
            const [ err  ] = definition(2, Schema, { type: 'string', maxLength: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minLength for string', () => {
            const [ err  ] = definition(2, Schema, { type: 'string', minLength: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minLength below maxLength', () => {
            const [ err  ] = definition(2, Schema, { type: 'string', minLength: 0, maxLength: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minLength at maxLength', () => {
            const [ err  ] = definition(2, Schema, { type: 'string', minLength: 5, maxLength: 5 });
            expect(err).to.be.undefined;
        });

        it('does not allow minLength above maxLength', () => {
            const [ err  ] = definition(2, Schema, { type: 'string', minLength: 6, maxLength: 5 });
            expect(err).to.match(/Property "minLength" must be less than or equal to "maxLength"/);
        });

        it('does not allow maxLength for number', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', maxLength: 5 });
            expect(err).to.match(/Property not allowed: maxLength/);
        });

    });

    describe('maxProperties and minProperties', () => {

        it('allows maxProperties for object', () => {
            const [ err  ] = definition(2, Schema, { type: 'object', maxProperties: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minProperties for object', () => {
            const [ err  ] = definition(2, Schema, { type: 'object', minProperties: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minProperties below maxProperties', () => {
            const [ err  ] = definition(2, Schema, { type: 'object', minProperties: 0, maxProperties: 5 });
            expect(err).to.be.undefined;
        });

        it('allows minProperties at maxProperties', () => {
            const [ err  ] = definition(2, Schema, { type: 'object', minProperties: 5, maxProperties: 5 });
            expect(err).to.be.undefined;
        });

        it('does not allow minProperties above maxProperties', () => {
            const [ err  ] = definition(2, Schema, { type: 'object', minProperties: 6, maxProperties: 5 });
            expect(err).to.match(/Property "minProperties" must be less than or equal to "maxProperties"/);
        });

        it('does not allow maxProperties for number', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', maxProperties: 5 });
            expect(err).to.match(/Property not allowed: maxProperties/);
        });

    });

    describe('uniqueItems', () => {

        it('is allowed if array', () => {
            const [ err  ] = definition(2, Schema, { type: 'array', uniqueItems: true });
            expect(err).to.be.undefined;
        });

        it('must be a boolean', () => {
            const [ err  ] = definition(2, Schema, { type: 'array', uniqueItems: 'true' });
            expect(err).to.match(/must be a boolean/);
        });

        it('is not allowed if number', () => {
            const [ err  ] = definition(2, Schema, { type: 'number', uniqueItems: false });
            expect(err).to.match(/Property not allowed: uniqueItems/);
        });

    });

    describe('pattern', () => {

        it('is allowed for type string', () => {
            const [ err ] = definition(2, Schema, { type: 'string', pattern: 'hello' });
            expect(err).to.be.undefined;
        });

        it('will deserialize value to regular expression', () => {
            const [ err, def ] = definition(2, Schema, { type: 'string', pattern: 'hello' });
            expect(def.pattern).to.be.instanceof(RegExp);
        });

        it('is not allowed for type boolean', () => {
            const [ err ] = definition(2, Schema, { type: 'boolean', pattern: 'hello' });
            expect(err).to.match(/Property not allowed: pattern/);
        });

    });

    describe('required', () => {

        it('is allowed for type object', () => {
            const [ err ] = definition(2, Schema, { type: 'object', required: ['hello'] });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ err, def ] = definition(2, Schema, { type: 'object', required: 'hello' });
            expect(err).to.match(/Value must be an array/);
        });

        it('is not allowed for type boolean', () => {
            const [ err ] = definition(2, Schema, { type: 'boolean', required: ['hello'] });
            expect(err).to.match(/Property not allowed: required/);
        });

    });

    describe('enum', () => {

        it('must be an array', () => {
            const [ err ] = definition(2, Schema, { type: 'string', enum: 1 });
            expect(err).to.match(/Value must be an array/);
        });

        describe('strings', () => {

            it('allows enum value with matching types', () => {
                const [ err ] = definition(2, Schema, { type: 'string', enum: ['a', 'b', 'c'] });
                expect(err).to.be.undefined;
            });

            it('does not allow enum value with mismatched type', () => {
                const [ err ] = definition(2, Schema, { type: 'string', enum: [1] });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('numbers', () => {

            it('allows enum value with matching types', () => {
                const [ err ] = definition(2, Schema, { type: 'number', enum: [1] });
                expect(err).to.be.undefined;
            });

            it('does not allow enum value with mismatched type', () => {
                const [ err ] = definition(2, Schema, { type: 'number', enum: ['a'] });
                expect(err).to.match(/Value must be a number/);
            });

        });

        describe('dates', () => {

            it('allows enum value with matching types', () => {
                const [ err, def ] = definition(2, Schema, { type: 'string', format: 'date', enum: ['2001-01-01'] });
                expect(err).to.be.undefined;
            });

            it('parses enum values', () => {
                const [ err, def ] = definition(2, Schema, { type: 'string', format: 'date', enum: ['2001-01-01'] });
                expect(def.enum[0]).to.deep.equal(new Date('2001-01-01'));
            });

            it('does not allow enum value with mismatched type', () => {
                const [ err ] = definition(2, Schema, { type: 'string', format: 'date', enum: ['a'] });
                expect(err).to.match(/Value must be formatted as a date/);
            });
        });

        describe('object', () => {

            it('allows enum value with matching types', () => {
                const [ err, def ] = definition(2, Schema, {
                    type: 'object',
                    properties: {
                        a: { type: 'string' }
                    },
                    enum: [
                        { a: 'a' },
                        { a: 'b' }
                    ]
                });
                expect(err).to.be.undefined;
            });

            it('does not allow enum value with mismatched type', () => {
                const [ err, def ] = definition(2, Schema, {
                    type: 'object',
                    properties: {
                        a: { type: 'string' }
                    },
                    enum: [ 1 ]
                });
                expect(err).to.match(/Value must be a plain object/);
            });

        });

    });

    describe.only('items', () => {

        it('is valid for arrays', () => {
            const [ err, def ] = definition(2, Schema, { type: 'array', items: { type: 'string' } });
            expect(err).to.be.undefined;
        });

        it('is not valid for non-arrays', () => {
            const [ err, def ] = definition(2, Schema, { type: 'number', items: { type: 'string' } });
            expect(err).to.match(/Property not allowed: items/);
        });

        it('cannot be a non object', () => {
            const [ err, def ] = definition(2, Schema, { type: 'array', items: 'string' });
            expect(err).to.match(/Value must be a plain object/);
        });

        it('traverses sub objects', () => {
            const [ err, def ] = definition(2, Schema, {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'date',
                    default: '2001-01-01',
                    enum: ['2001-01-01', '2001-01-02']
                }
            });
            expect(def.items.default).to.deep.equal(new Date('2001-01-01'));
        });

    });

});