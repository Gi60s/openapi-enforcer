'use strict';
const Buffer    = require('buffer').Buffer;
const Enforcer  = require('../index');
const expect    = require('chai').expect;
const util      = require('../bin/util');

describe('random', () => {
    let enforcer;

    before(() => {
        enforcer = new Enforcer('2.0');
    });

    describe('v3', () => {
        let enforcer;

        before(() => {
            enforcer = new Enforcer('3.0.0');
        });

        it('integer', () => {
            const schema = { type: 'integer', minimum: 0, maximum: 5 };
            const value = enforcer.random(schema);
            expect(value).to.be.at.most(5);
            expect(value).to.be.at.least(0);
        });

        it('anyOf', () => {
            const schema = {
                anyOf: [
                    { type: 'integer', minimum: 0, maximum: 5 },
                    { type: 'string', maxLength: 5 }
                ]
            };
            const value = enforcer.random(schema);

            if (typeof value === 'string') {
                expect(value.length).to.be.at.most(5);
            } else if (typeof value === 'number') {
                expect(value).to.be.at.most(5);
            } else {
                expect.fail(value);
            }
        });

        it('oneOf', () => {
            const schema = {
                oneOf: [
                    { type: 'integer', minimum: 0, maximum: 5 },
                    { type: 'string', maxLength: 5 }
                ]
            };
            const value = enforcer.random(schema);

            if (typeof value === 'string') {
                expect(value.length).to.be.at.most(5);
            } else if (typeof value === 'number') {
                expect(value).to.be.at.most(5);
            } else {
                expect.fail(value);
            }
        });

        it('allOf', () => {
            const schema = {
                type: 'object',
                properties: {
                    x: {
                        allOf: [
                            { type: 'integer', minimum: 0, maximum: 5 },
                            { type: 'integer', minimum: 5 }
                        ]
                    }
                }
            };
            expect(enforcer.random(schema)).to.deep.equal({ x: 5 });
        });

    });

    describe('array', () => {

        it('is array', () => {
            const schema = { type: 'array' };
            expect(enforcer.random(schema)).to.be.an.instanceOf(Array);
        });

        it('minimum length', () => {
            const schema = { type: 'array', minItems: 5 };
            expect(enforcer.random(schema).length).to.be.at.least(5);
        });

        it('maximum length', () => {
            const schema = { type: 'array', maxItems: 1 };
            expect(enforcer.random(schema).length).to.be.at.most(1);
        });

        it('maximum and minimum length', () => {
            const schema = { type: 'array', minItems: 1, maxItems: 1 };
            expect(enforcer.random(schema).length).to.equal(1);
        });

    });

    describe('binary and byte', () => {

        it('is buffer', () => {
            const schema = { type: 'string', format: 'byte' };
            expect(enforcer.random(schema)).to.be.an.instanceOf(Buffer);
        });

        it('minimum length', () => {
            const schema = { type: 'string', format: 'byte', minLength: 5 };
            expect(enforcer.random(schema).length).to.be.at.least(5);
        });

        it('maximum length', () => {
            const schema = { type: 'string', format: 'binary', maxLength: 1 };
            expect(enforcer.random(schema).length).to.be.at.most(1);
        });

        it('maximum and minimum length', () => {
            const schema = { type: 'string', format: 'binary', minLength: 1, maxLength: 1 };
            expect(enforcer.random(schema).length).to.equal(1);
        });

    });

    describe('boolean', () => {

        it('enum', () => {
            const schema = { type: 'boolean', enum: [true] };
            expect(enforcer.random(schema)).to.be.true;
        });

        it('true or false', () => {
            const schema = { type: 'boolean' };
            expect(enforcer.random(schema)).to.be.oneOf([true, false]);
        });

    });

    describe('date', () => {

        it('is a date', () => {
            const schema = { type: 'string', format: 'date' };
            expect(enforcer.random(schema)).to.be.an.instanceOf(Date);
        });

        it('is at start of day', () => {
            const schema = { type: 'string', format: 'date' };
            const value = enforcer.random(schema).toISOString().substr(10);
            expect(value).to.equal('T00:00:00.000Z');
        });

    });

    describe('dateTime', () => {

        it('is a date', () => {
            const schema = { type: 'string', format: 'date-time' };
            expect(enforcer.random(schema)).to.be.an.instanceOf(Date);
        });

        it('minimum', () => {
            const str = '2001-01-01T00:00:00.000Z';
            const d = new Date(str);
            const schema = { type: 'string', format: 'date-time', minimum: str };
            expect(+enforcer.random(schema)).to.be.at.least(+d);
        });

        it('maximum', () => {
            const str = '2001-01-01T00:00:00.000Z';
            const d = new Date(str);
            const schema = { type: 'string', format: 'date-time', maximum: str };
            expect(+enforcer.random(schema)).to.be.at.most(+d);
        });

        it('maximum and minimum', () => {
            const str1 = '2001-01-01T00:00:00.000Z';
            const str2 = '2001-01-02T00:00:00.000Z';
            const d1 = new Date(str1);
            const d2 = new Date(str2);
            const schema = { type: 'string', format: 'date-time', minimum: str1, maximum: str2 };
            const v = +enforcer.random(schema);
            expect(v).to.be.at.least(+d1);
            expect(v).to.be.at.most(+d2);
        });

    });

    describe('integer', () => {

        it('is integer', () => {
            const schema = { type: 'integer' };
            const value = enforcer.random(schema);
            expect(value).to.be.a('number');
            expect(Math.round(value)).to.equal(value);
        });

        it('enum', () => {
            const schema = { type: 'integer', enum: [1, 2, 3, -5] };
            expect(enforcer.random(schema)).to.be.oneOf(schema.enum);
        });

        it('random', () => {
            const value = enforcer.random({ type: 'integer' });
            expect(value).to.be.at.most(500);
            expect(value).to.be.at.least(-500);
        });

        it('minimum', () => {
            const schema = { type: 'integer', minimum: 0 };
            expect(enforcer.random(schema)).to.be.at.least(0);
        });

        it('maximum', () => {
            const schema = { type: 'integer', maximum: 0 };
            expect(enforcer.random(schema)).to.be.at.most(0);
        });

        it('minimum and maximum', () => {
            const schema = { type: 'integer', minimum: 0, maximum: 2 };
            expect(enforcer.random(schema)).to.be.oneOf([0, 1, 2])
        });

        it('minimum and maximum exclusive', () => {
            const schema = { type: 'integer', minimum: 0, maximum: 2, exclusiveMinimum: true, exclusiveMaximum: true };
            expect(enforcer.random(schema)).to.equal(1);
        });

    });

    describe('number', () => {

        it('is number', () => {
            const value = enforcer.random({ type: 'number' });
            expect(value).to.be.a('number');
        });

        it('enum', () => {
            const schema = { type: 'number', enum: [1, 2.2, 3.3, -5.5] };
            expect(enforcer.random(schema)).to.be.oneOf(schema.enum);
        });

        it('random', () => {
            const value = enforcer.random({ type: 'number' });
            expect(value).to.be.at.most(500);
            expect(value).to.be.at.least(-500);
        });

        it('minimum', () => {
            const schema = { type: 'number', minimum: 0 };
            expect(enforcer.random(schema)).to.be.at.least(0);
        });

        it('maximum', () => {
            const schema = { type: 'number', maximum: 0 };
            expect(enforcer.random(schema)).to.be.at.most(0);
        });

        it('minimum and maximum', () => {
            const schema = { type: 'number', minimum: 0, maximum: 2 };
            const value = enforcer.random(schema);
            expect(value).to.be.at.least(0);
            expect(value).to.be.at.most(2);
        });

        it('minimum and maximum exclusive', () => {
            const schema = { type: 'number', minimum: 0, maximum: 2, exclusiveMinimum: true, exclusiveMaximum: true };
            const value = enforcer.random(schema);
            expect(value).to.be.greaterThan(0);
            expect(value).to.be.lessThan(2);
        });
    });

    describe('object', () => {

        it('is object', () => {
            const schema = { type: 'object' };
            expect(util.isPlainObject(enforcer.random(schema))).to.equal(true);
        });

        it('has all required properties', () => {
            const schema = {
                type: 'object',
                required: ['a','b'],
                properties: {
                    a: { type: 'string' },
                    b: { type: 'string', format: 'date' }
                }
            };
            const value = enforcer.random(schema);
            expect(value.a).to.be.a('string');
            expect(value.b).to.be.an.instanceOf(Date);
        });

        it('has all optional properties when space available', () => {
            const schema = {
                type: 'object',
                properties: {
                    a: { type: 'string' },
                    b: { type: 'string', format: 'date' }
                }
            };
            const value = enforcer.random(schema);
            expect(value.a).to.be.a('string');
            expect(value.b).to.be.an.instanceOf(Date);
        });

        it('has some optional properties when some space available', () => {
            const schema = {
                type: 'object',
                minProperties: 1,
                maxProperties: 2,
                required: ['a'],
                properties: {
                    a: { type: 'string' },
                    b: { type: 'number' },
                    c: { type: 'number' }
                }
            };
            const value = enforcer.random(schema);
            expect(Object.keys(value).length).to.equal(2);
            expect(value.a).to.be.a('string');
            expect(value.b || value.c).to.be.a('number');
        });

        it('has additional properties when space available', () => {
            const schema = {
                type: 'object',
                maxProperties: 2,
                required: ['a'],
                properties: {
                    a: { type: 'string' }
                },
                additionalProperties: {
                    type: 'number'
                }
            };
            const value = enforcer.random(schema);
            expect(Object.keys(value).length).to.equal(2);
            expect(value.a).to.be.a('string');
            expect(value.additionalProperty1).to.be.a('number');
        });

    });

    describe('string', () => {

        it('is string', () => {
            const value = enforcer.random({ type: 'string' });
            expect(value).to.be.a('string');
        });

        it('minimum length', () => {
            const schema = { type: 'string', minLength: 500 };
            expect(enforcer.random(schema).length).to.be.at.least(500);
        });

        it('maximum length', () => {
            const schema = { type: 'string', maxLength: 10 };
            expect(enforcer.random(schema).length).to.be.at.most(10);
        });

        it('minimum and maximum length', () => {
            const schema = { type: 'string', minLength: 0, maxLength: 2 };
            const value = enforcer.random(schema);
            expect(value.length).to.be.at.least(0);
            expect(value.length).to.be.at.most(2);
        });
    });

});