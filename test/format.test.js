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

describe('format', () => {

    describe('binary', () => {

        it('false is 00000000', () => {
            expect(format.binary(false).value).to.equal('00000000');
        });

        it('true is 00000001', () => {
            expect(format.binary(true).value).to.equal('00000001');
        });

        it('0 is 00000000', () => {
            expect(format.binary(0).value).to.equal('00000000');
        });

        it('1 is 00000001', () => {
            expect(format.binary(1).value).to.equal('00000001');
        });

        it('2 is 00000010', () => {
            expect(format.binary(2).value).to.equal('00000010');
        });

        it('35 is 00100011', () => {
            expect(format.binary(35).value).to.equal('00100011');
        });

        it('1315 is 0000010100100011', () => {
            expect(format.binary(1315).value).to.equal('0000010100100011');
        });

        it('A is 01000001', () => {
            expect(format.binary('A').value).to.equal('01000001');
        });

        it('AA is 0100000101000001', () => {
            expect(format.binary('AA').value).to.equal('0100000101000001');
        });

        it('Buffer("Hello") is 0100100001100101011011000110110001101111', () => {
            expect(format.binary(Buffer.from("Hello")).value).to.equal('0100100001100101011011000110110001101111');
        });

        it('Object throws error', () => {
            expect(format.binary({}).error).to.match(/cannot convert to binary/i);
        });

    });

    describe('boolean', () => {

        it('truthy is true', () => {
            expect(format.boolean('hello').value).to.be.true;
        });

        it('falsy is false', () => {
            expect(format.boolean(null).value).to.be.false;
        });

    });

    describe('byte', () => {

        it('false is AA==', () => {
            expect(format.byte(false).value).to.equal('AA==');
        });

        it('true is AQ==', () => {
            expect(format.byte(true).value).to.equal('AQ==');
        });

        it('0 is AA==', () => {
            expect(format.byte(0).value).to.equal('AA==');
        });

        it('1 is AQ==', () => {
            expect(format.byte(1).value).to.equal('AQ==');
        });

        it('2 is Ag==', () => {
            expect(format.byte(2).value).to.equal('Ag==');
        });

        it('35 is Iw==', () => {
            expect(format.byte(35).value).to.equal('Iw==');
        });

        it('1315 is BSM=', () => {
            expect(format.byte(1315).value).to.equal('BSM=');
        });

        it('A is QQ==', () => {
            expect(format.byte('A').value).to.equal('QQ==');
        });

        it('AA is QUE=', () => {
            expect(format.byte('AA').value).to.equal('QUE=');
        });

        it('Buffer("Hello") is SGVsbG8=', () => {
            expect(format.byte(Buffer.from("Hello")).value).to.equal('SGVsbG8=');
        });

        it('Object throws error', () => {
            expect(format.byte({}).error).to.match(/cannot convert to byte/i);
        });

    });

    describe('date', () => {

        it('Date object', () => {
            const d = new Date(0);
            expect(format.date(d).value).to.equal('1970-01-01');
        });

        it('date string in ISO format', () => {
            expect(format.date('2000-01-01').value).to.equal('2000-01-01');
        });

        it('date-time string in ISO format', () => {
            expect(format.date('2000-01-01T11:11:11.111Z').value).to.equal('2000-01-01');
        });

        it('number', () => {
            expect(format.date(0).value).to.equal('1970-01-01');
        });

        it('Object throws error', () => {
            expect(format.date({}).error).to.match(/cannot convert to date/i)
        });

    });

    describe('dateTime', () => {

        it('Date object', () => {
            const d = new Date(0);
            expect(format.dateTime(d).value).to.equal('1970-01-01T00:00:00.000Z');
        });

        it('date string in ISO format', () => {
            expect(format.dateTime('2000-01-01').value).to.equal('2000-01-01T00:00:00.000Z');
        });

        it('date-time string in ISO format', () => {
            expect(format.dateTime('2000-01-01T11:11:11.111Z').value).to.equal('2000-01-01T11:11:11.111Z');
        });

        it('number', () => {
            expect(format.dateTime(0).value).to.equal('1970-01-01T00:00:00.000Z');
        });

        it('Object throws error', () => {
            expect(format.dateTime({}).error).to.match(/cannot convert to date-time/i)
        });

    });

    describe('integer', () => {

        it('integer string', () => {
            expect(format.integer('123').value).to.equal(123);
        });

        it('decimal string', () => {
            expect(format.integer('5.67').value).to.equal(6);
        });

        it('integer number', () => {
            expect(format.integer(123).value).to.equal(123);
        });

        it('decimal number', () => {
            expect(format.integer(5.67).value).to.equal(6);
        });

        it('date object', () => {
            expect(format.integer(new Date(1000)).value).to.equal(1000);
        });

        it('invalid string throws error', () => {
            expect(format.integer('hello').error).to.match(/cannot convert to integer/i);
        });

    });

    describe('number', () => {

        it('integer string', () => {
            expect(format.number('123').value).to.equal(123);
        });

        it('decimal string', () => {
            expect(format.number('5.67').value).to.equal(5.67);
        });

        it('integer number', () => {
            expect(format.number(123).value).to.equal(123);
        });

        it('decimal number', () => {
            expect(format.number(5.67).value).to.equal(5.67);
        });

        it('date object', () => {
            expect(format.number(new Date(1000)).value).to.equal(1000);
        });

        it('invalid string throws error', () => {
            expect(format.number('hello').error).to.match(/cannot convert to number/i)
        });

    });

    describe('string', () => {

        it('string', () => {
            expect(format.string('hello').value).to.equal('hello');
        });

        it('number', () => {
            expect(format.string(5.67).value).to.equal('5.67');
        });

        it('true', () => {
            expect(format.string(true).value).to.equal('true');
        });

        it('false', () => {
            expect(format.string(false).value).to.equal('false');
        });

        it('Object', () => {
            const o = { a: 1, b: 2 };
            expect(format.string(o).value).to.equal(JSON.stringify(o));
        });

        it('Date', () => {
            expect(format.string(new Date(0)).value).to.equal('1970-01-01T00:00:00.000Z');
        });

        it('Symbol throws error', () => {
            expect(format.string(Symbol('s')).error).to.match(/cannot convert to string/i);
        });

    });

});