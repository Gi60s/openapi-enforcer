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
const expect            = require('chai').expect;
const format            = require('../bin/format');
const OpenApiEnforcer   = require('../index');

describe('#format', () => {
    let enforcer;

    before(() => {
        enforcer = new OpenApiEnforcer('2.0');
    });

    describe('array', () => {
        const schema = { items: { type: 'integer' } };

        it('number', () => {
            const ar = [1.2, 1.7];
            expect(enforcer.format(schema, ar)).to.deep.equal([1,2]);
        });
    });

    describe('binary', () => {
        const schema = { type: 'string', format: 'binary' };

        it('true', () => {
            expect(enforcer.format(schema, true)).to.equal('00000001');
        });

        it('false', () => {
            expect(enforcer.format(schema, false)).to.equal('00000000');
        });

        it('number', () => {
            expect(enforcer.format(schema, 1)).to.equal('00000001');
        });

        it('full byte', () => {
            expect(enforcer.format(schema, 255)).to.equal('11111111');
        });

        it('large number', () => {
            expect(enforcer.format(schema, 256)).to.equal('0000000100000000');
        });

        it('string', () => {
            expect(enforcer.format(schema, '\r')).to.equal('00001101');
        });

        it('buffer', () => {
            const buf = Buffer.from('\r');
            expect(enforcer.format(schema, buf)).to.equal('00001101');
        });

        it('object', () => {
            expect(() => enforcer.format(schema, {})).to.throw(Error);
        });

    });

    describe('boolean', () => {
        const schema = { type: 'boolean' };

        it('true', () => {
            expect(enforcer.format(schema, true)).to.be.true;
        });

        it('false', () => {
            expect(enforcer.format(schema, false)).to.be.false;
        });

        it('1', () => {
            expect(enforcer.format(schema, 1)).to.be.true;
        });

        it('0', () => {
            expect(enforcer.format(schema, 0)).to.be.false;
        });

        it('{}', () => {
            expect(enforcer.format(schema, {})).to.be.true;
        });

        it('null', () => {
            expect(enforcer.format(schema, null)).to.be.false;
        });

    });

    describe('byte', () => {
        const schema = { type: 'string', format: 'byte' };

        it('true', () => {
            expect(enforcer.format(schema, true)).to.equal('AQ==');
        });

        it('false', () => {
            expect(enforcer.format(schema, false)).to.equal('AA==');
        });

        it('number', () => {
            expect(enforcer.format(schema, 1)).to.equal('AQ==');
        });

        it('large number', () => {
            expect(enforcer.format(schema, 256)).to.equal('AQA=');
        });

        it('larger number', () => {
            expect(enforcer.format(schema, 270721)).to.equal('BCGB');
        });

        it('M', () => {
            expect(enforcer.format(schema, 'M')).to.equal('TQ==');
        });

        it('Ma', () => {
            expect(enforcer.format(schema, 'Ma')).to.equal('TWE=');
        });

        it('buffer', () => {
            const b = Buffer.from('M');
            expect(enforcer.format(schema, b)).to.equal('TQ==')
        });

        it('invalid type', () => {
            expect(() => enforcer.format(schema, null)).to.throw(Error);
        });

    });

    describe('date', () => {
        const schema = { type: 'string', format: 'date' };
        const iso = '2000-01-01T00:00:00.000Z';

        it('Date object', () => {
            const d = new Date(iso);
            expect(enforcer.format(schema, d)).to.equal('2000-01-01');
        });

        it('ISO format', () => {
            expect(enforcer.format(schema, iso)).to.equal('2000-01-01');
        });

        it('date format', () => {
            expect(enforcer.format(schema, '2000-01-01')).to.equal('2000-01-01');
        });

        it('oveflow', () => {
            expect(enforcer.format(schema, '2000-02-30')).to.equal('2000-03-01');
        });

        it('number', () => {
            const d = new Date(iso);
            expect(enforcer.format(schema, +d)).to.equal('2000-01-01');
        });

        it('boolean', () => {
            expect(() => enforcer.format(schema, true)).to.throw(Error);
        });

    });

    describe('date-time', () => {
        const schema = { type: 'string', format: 'date-time' };
        const iso = '2000-01-01T01:15:22.345Z';

        it('Date object', () => {
            const d = new Date(iso);
            expect(enforcer.format(schema, d)).to.equal(iso);
        });

        it('ISO format', () => {
            expect(enforcer.format(schema, iso)).to.equal(iso);
        });

        it('date format', () => {
            expect(enforcer.format(schema, '2000-01-01')).to.equal('2000-01-01T00:00:00.000Z');
        });

        it('oveflow', () => {
            expect(enforcer.format(schema, '2000-02-30')).to.equal('2000-03-01T00:00:00.000Z');
        });

        it('number', () => {
            const d = new Date(iso);
            expect(enforcer.format(schema, +d)).to.equal(iso);
        });

        it('boolean', () => {
            expect(() => enforcer.format(schema, true)).to.throw(Error);
        });

    });

    describe('integer', () => {
        const schema = { type: 'integer' };

        it('integer', () => {
            expect(enforcer.format(schema, 123)).to.equal(123);
        });

        it('float', () => {
            expect(enforcer.format(schema, 123.7)).to.equal(124);
        });

        it('string integer', () => {
            expect(enforcer.format(schema, '123')).to.equal(123);
        });

        it('string float', () => {
            expect(enforcer.format(schema, '123.7')).to.equal(124);
        });

        it('date', () => {
            const dt = new Date('2000-01-01T00:00:00.000Z');
            expect(enforcer.format(schema, dt)).to.equal(+dt);
        });

        it('true', () => {
            expect(enforcer.format(schema, true)).to.equal(1);
        });

        it('false', () => {
            expect(enforcer.format(schema, false)).to.equal(0);
        });

        it('object', () => {
            expect(() => enforcer.format(schema, {})).to.throw(/must be numeric/);
        });

    });

    describe('number', () => {
        const schema = { type: 'number' };

        it('integer', () => {
            expect(enforcer.format(schema, 123)).to.equal(123);
        });

        it('float', () => {
            expect(enforcer.format(schema, 123.7)).to.equal(123.7);
        });

        it('string integer', () => {
            expect(enforcer.format(schema, '123')).to.equal(123);
        });

        it('string float', () => {
            expect(enforcer.format(schema, '123.7')).to.equal(123.7);
        });

        it('date', () => {
            const dt = new Date('2000-01-01T00:00:00.000Z');
            expect(enforcer.format(schema, dt)).to.equal(+dt);
        });

        it('true', () => {
            expect(enforcer.format(schema, true)).to.equal(1);
        });

        it('false', () => {
            expect(enforcer.format(schema, false)).to.equal(0);
        });

        it('object', () => {
            expect(() => enforcer.format(schema, {})).to.throw(/must be numeric/);
        });

    });

    describe('object', () => {
        const schema = {
            properties: {
                a: { type: 'integer' },
                b: { type: 'string' },
                c: { type: 'boolean' },
                d: { type: 'string', format: 'date' },
                o: { additionalProperties: { type: 'number' } }
            }
        };

        function create(v) {
            return { a: v, b: v, c: v, d: v, x: v, o: { x: v, y: v }};
        }

        it('number', () => {
            const o = create(1.7);
            expect(enforcer.format(schema, o)).to.deep.equal({
                a: 2,
                b: '1.7',
                c: true,
                d: '1970-01-01',
                o: { x: 1.7, y: 1.7 }
            });
        });
    });

    describe('string', () => {
        const schema = { type: 'string' };

        it('true', () => {
            expect(enforcer.format(schema, true)).to.equal('true');
        });

        it('false', () => {
            expect(enforcer.format(schema, false)).to.equal('false');
        });

        it('number', () => {
            expect(enforcer.format(schema, 123.7)).to.equal('123.7');
        });

        it('null', () => {
            expect(enforcer.format(schema, null)).to.equal('null');
        });

        it('object', () => {
            expect(enforcer.format(schema, { a: 1 })).to.equal('{"a":1}');
        });

        it('date', () => {
            const iso = '2000-01-01T01:03:04.005Z';
            expect(enforcer.format(schema, new Date(iso))).to.equal(iso);
        });

        it('symbol', () => {
            const s = Symbol('my-symbol');
            expect(() => enforcer.format(schema, s)).to.throw(/Cannot convert to string/i);
        });

    });

});

describe('format', () => {

    describe('binary', () => {

        it('false is 00000000', () => {
            expect(format.binary(false)).to.equal('00000000');
        });

        it('true is 00000001', () => {
            expect(format.binary(true)).to.equal('00000001');
        });

        it('0 is 00000000', () => {
            expect(format.binary(0)).to.equal('00000000');
        });

        it('1 is 00000001', () => {
            expect(format.binary(1)).to.equal('00000001');
        });

        it('2 is 00000010', () => {
            expect(format.binary(2)).to.equal('00000010');
        });

        it('35 is 00100011', () => {
            expect(format.binary(35)).to.equal('00100011');
        });

        it('1315 is 0000010100100011', () => {
            expect(format.binary(1315)).to.equal('0000010100100011');
        });

        it('A is 01000001', () => {
            expect(format.binary('A')).to.equal('01000001');
        });

        it('AA is 0100000101000001', () => {
            expect(format.binary('AA')).to.equal('0100000101000001');
        });

        it('Buffer("Hello") is 0100100001100101011011000110110001101111', () => {
            expect(format.binary(Buffer.from("Hello"))).to.equal('0100100001100101011011000110110001101111');
        });

        it('Object throws error', () => {
            expect(() => format.binary({})).to.throw(Error);
        });

    });

    describe('boolean', () => {

        it('truthy is true', () => {
            expect(format.boolean('hello')).to.be.true;
        });

        it('falsy is false', () => {
            expect(format.boolean(null)).to.be.false;
        });

    });

    describe('byte', () => {

        it('false is AA==', () => {
            expect(format.byte(false)).to.equal('AA==');
        });

        it('true is AQ==', () => {
            expect(format.byte(true)).to.equal('AQ==');
        });

        it('0 is AA==', () => {
            expect(format.byte(0)).to.equal('AA==');
        });

        it('1 is AQ==', () => {
            expect(format.byte(1)).to.equal('AQ==');
        });

        it('2 is Ag==', () => {
            expect(format.byte(2)).to.equal('Ag==');
        });

        it('35 is Iw==', () => {
            expect(format.byte(35)).to.equal('Iw==');
        });

        it('1315 is BSM=', () => {
            expect(format.byte(1315)).to.equal('BSM=');
        });

        it('A is QQ==', () => {
            expect(format.byte('A')).to.equal('QQ==');
        });

        it('AA is QUE=', () => {
            expect(format.byte('AA')).to.equal('QUE=');
        });

        it('Buffer("Hello") is SGVsbG8=', () => {
            expect(format.byte(Buffer.from("Hello"))).to.equal('SGVsbG8=');
        });

        it('Object throws error', () => {
            expect(() => format.byte({})).to.throw(Error);
        });

    });

    describe('date', () => {

        it('Date object', () => {
            const d = new Date(0);
            expect(format.date(d)).to.equal('1970-01-01');
        });

        it('date string in ISO format', () => {
            expect(format.date('2000-01-01')).to.equal('2000-01-01');
        });

        it('date-time string in ISO format', () => {
            expect(format.date('2000-01-01T11:11:11.111Z')).to.equal('2000-01-01');
        });

        it('number', () => {
            expect(format.date(0)).to.equal('1970-01-01');
        });

        it('Object throws error', () => {
            expect(() => format.date({})).to.throw(Error);
        });

    });

    describe('dateTime', () => {

        it('Date object', () => {
            const d = new Date(0);
            expect(format.date(d)).to.equal('1970-01-01');
        });

        it('date string in ISO format', () => {
            expect(format.date('2000-01-01')).to.equal('2000-01-01');
        });

        it('date-time string in ISO format', () => {
            expect(format.date('2000-01-01T11:11:11.111Z')).to.equal('2000-01-01');
        });

        it('number', () => {
            expect(format.date(0)).to.equal('1970-01-01');
        });

        it('Object throws error', () => {
            expect(() => format.date({})).to.throw(Error);
        });

    });

    describe('integer', () => {

        it('integer string', () => {
            expect(format.integer('123')).to.equal(123);
        });

        it('decimal string', () => {
            expect(format.integer('5.67')).to.equal(6);
        });

        it('integer number', () => {
            expect(format.integer(123)).to.equal(123);
        });

        it('decimal number', () => {
            expect(format.integer(5.67)).to.equal(6);
        });

        it('date object', () => {
            expect(format.integer(new Date(1000))).to.equal(1000);
        });

        it('invalid string throws error', () => {
            expect(() => format.integer('hello')).to.throw(Error);
        });

    });

    describe('number', () => {

        it('integer string', () => {
            expect(format.number('123')).to.equal(123);
        });

        it('decimal string', () => {
            expect(format.number('5.67')).to.equal(5.67);
        });

        it('integer number', () => {
            expect(format.number(123)).to.equal(123);
        });

        it('decimal number', () => {
            expect(format.number(5.67)).to.equal(5.67);
        });

        it('date object', () => {
            expect(format.number(new Date(1000))).to.equal(1000);
        });

        it('invalid string throws error', () => {
            expect(() => format.number('hello')).to.throw(Error);
        });

    });

    describe('string', () => {

        it('string', () => {
            expect(format.string('hello')).to.equal('hello');
        });

        it('number', () => {
            expect(format.string(5.67)).to.equal('5.67');
        });

        it('true', () => {
            expect(format.string(true)).to.equal('true');
        });

        it('false', () => {
            expect(format.string(false)).to.equal('false');
        });

        it('Object', () => {
            const o = { a: 1, b: 2 };
            expect(format.string(o)).to.equal(JSON.stringify(o));
        });

        it('Date', () => {
            expect(format.string(new Date(0))).to.equal('1970-01-01T00:00:00.000Z');
        });

        it('Symbol throws error', () => {
            expect(() => format.string(Symbol('s'))).to.throw(Error);
        })

    });

});