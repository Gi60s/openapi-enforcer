/**
 *  @license
 *    Copyright 2017 Brigham Young University
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
const SwaggerEnforcer   = require('../index');
const expect            = require('chai').expect;

describe('#format', () => {
    let swagger;

    before(() => {
        swagger = new SwaggerEnforcer('2.0');
    });

    describe('array', () => {
        const schema = { items: { type: 'integer' } };

        it('number', () => {
            const ar = [1.2, 1.7];
            expect(swagger.format(ar, schema)).to.deep.equal([1,2]);
        });
    });

    describe('binary', () => {
        const schema = { type: 'string', format: 'binary' };

        it('true', () => {
            expect(swagger.format(true, schema)).to.equal('00000001');
        });

        it('false', () => {
            expect(swagger.format(false, schema)).to.equal('00000000');
        });

        it('number', () => {
            expect(swagger.format(1, schema)).to.equal('00000001');
        });

        it('full byte', () => {
            expect(swagger.format(255, schema)).to.equal('11111111');
        });

        it('large number', () => {
            expect(swagger.format(256, schema)).to.equal('0000000100000000');
        });

        it('string', () => {
            expect(swagger.format('\r', schema)).to.equal('00001101');
        });

        it('buffer', () => {
            const buf = Buffer.from('\r');
            expect(swagger.format(buf, schema)).to.equal('00001101');
        });

        it('object', () => {
            expect(() => swagger.format({}, schema)).to.throw(Error);
        });

    });

    describe('boolean', () => {
        const schema = { type: 'boolean' };

        it('true', () => {
            expect(swagger.format(true, schema)).to.be.true;
        });

        it('false', () => {
            expect(swagger.format(false, schema)).to.be.false;
        });

        it('1', () => {
            expect(swagger.format(1, schema)).to.be.true;
        });

        it('0', () => {
            expect(swagger.format(0, schema)).to.be.false;
        });

        it('{}', () => {
            expect(swagger.format({}, schema)).to.be.true;
        });

        it('null', () => {
            expect(swagger.format(null, schema)).to.be.false;
        });

    });

    describe('byte', () => {
        const schema = { type: 'string', format: 'byte' };

        it('true', () => {
            expect(swagger.format(true, schema)).to.equal('AQ==');
        });

        it('false', () => {
            expect(swagger.format(false, schema)).to.equal('');
        });

        it('number', () => {
            expect(swagger.format(1, schema)).to.equal('AQ==');
        });

        it('large number', () => {
            expect(swagger.format(256, schema)).to.equal('AQA=');
        });

        it('larger number', () => {
            expect(swagger.format(270721, schema)).to.equal('BCGB');
        });

        it('M', () => {
            expect(swagger.format('M', schema)).to.equal('TQ==');
        });

        it('Ma', () => {
            expect(swagger.format('Ma', schema)).to.equal('TWE=');
        });

        it('buffer', () => {
            const b = Buffer.from('M', schema);
            expect(swagger.format(b, schema)).to.equal('TQ==')
        });

        it('invalid type', () => {
            expect(() => swagger.format(null, schema)).to.throw(Error);
        });

    });

    describe('date', () => {
        const schema = { type: 'string', format: 'date' };
        const iso = '2000-01-01T00:00:00.000Z';

        it('Date object', () => {
            const d = new Date(iso);
            expect(swagger.format(d, schema)).to.equal('2000-01-01');
        });

        it('ISO format', () => {
            expect(swagger.format(iso, schema)).to.equal('2000-01-01');
        });

        it('date format', () => {
            expect(swagger.format('2000-01-01', schema)).to.equal('2000-01-01');
        });

        it('oveflow', () => {
            expect(swagger.format('2000-02-30', schema)).to.equal('2000-03-01');
        });

        it('number', () => {
            const d = new Date(iso);
            expect(swagger.format(+d, schema)).to.equal('2000-01-01');
        });

        it('boolean', () => {
            expect(() => swagger.format(true, schema)).to.throw(Error);
        });

    });

    describe('date-time', () => {
        const schema = { type: 'string', format: 'date-time' };
        const iso = '2000-01-01T01:15:22.345Z';

        it('Date object', () => {
            const d = new Date(iso);
            expect(swagger.format(d, schema)).to.equal(iso);
        });

        it('ISO format', () => {
            expect(swagger.format(iso, schema)).to.equal(iso);
        });

        it('date format', () => {
            expect(swagger.format('2000-01-01', schema)).to.equal('2000-01-01T00:00:00.000Z');
        });

        it('oveflow', () => {
            expect(swagger.format('2000-02-30', schema)).to.equal('2000-03-01T00:00:00.000Z');
        });

        it('number', () => {
            const d = new Date(iso);
            expect(swagger.format(+d, schema)).to.equal(iso);
        });

        it('boolean', () => {
            expect(() => swagger.format(true, schema)).to.throw(Error);
        });

    });

    describe('integer', () => {
        const schema = { type: 'integer' };

        it('integer', () => {
            expect(swagger.format(123, schema)).to.equal(123);
        });

        it('float', () => {
            expect(swagger.format(123.7, schema)).to.equal(124);
        });

        it('string integer', () => {
            expect(swagger.format('123', schema)).to.equal(123);
        });

        it('string float', () => {
            expect(swagger.format('123.7', schema)).to.equal(124);
        });

        it('date', () => {
            const dt = new Date('2000-01-01T00:00:00.000Z');
            expect(swagger.format(dt, schema)).to.equal(+dt);
        });

        it('true', () => {
            expect(swagger.format(true, schema)).to.equal(1);
        });

        it('false', () => {
            expect(swagger.format(false, schema)).to.equal(0);
        });

        it('object', () => {
            expect(() => swagger.format({}, schema)).to.throw(/must be numeric/);
        });

    });

    describe('number', () => {
        const schema = { type: 'number' };

        it('integer', () => {
            expect(swagger.format(123, schema)).to.equal(123);
        });

        it('float', () => {
            expect(swagger.format(123.7, schema)).to.equal(123.7);
        });

        it('string integer', () => {
            expect(swagger.format('123', schema)).to.equal(123);
        });

        it('string float', () => {
            expect(swagger.format('123.7', schema)).to.equal(123.7);
        });

        it('date', () => {
            const dt = new Date('2000-01-01T00:00:00.000Z');
            expect(swagger.format(dt, schema)).to.equal(+dt);
        });

        it('true', () => {
            expect(swagger.format(true, schema)).to.equal(1);
        });

        it('false', () => {
            expect(swagger.format(false, schema)).to.equal(0);
        });

        it('object', () => {
            expect(() => swagger.format({}, schema)).to.throw(/must be numeric/);
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
            expect(swagger.format(o, schema)).to.deep.equal({
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
            expect(swagger.format(true, schema)).to.equal('true');
        });

        it('false', () => {
            expect(swagger.format(false, schema)).to.equal('false');
        });

        it('number', () => {
            expect(swagger.format(123.7, schema)).to.equal('123.7');
        });

        it('null', () => {
            expect(swagger.format(null, schema)).to.equal('null');
        });

        it('object', () => {
            expect(swagger.format({ a: 1 }, schema)).to.equal('{"a":1}');
        });

        it('date', () => {
            const iso = '2000-01-01T01:03:04.005Z';
            expect(swagger.format(new Date(iso), schema)).to.equal(iso);
        });

    });

});