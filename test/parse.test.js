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
const Buffer    = require('buffer').Buffer;
const expect    = require('chai').expect;
const parse     = require('../bin/parse');

describe('parse', () => {

    describe('binary', () => {

        it('accepts string of 0s and 1s', () => {
            const result = parse.binary('01010101');
            expect(result).to.be.an.instanceof(Buffer);
            expect(result.length).to.equal(8);
            expect(result.toString()).to.equal('01010101');
        });

        it('cannot take a number', () => {
            expect(() => parse.binary(1)).to.throw(Error);
        });

    });

    describe('boolean', () => {

        it('accepts boolean', () => {
            expect(parse.boolean(true)).to.be.true;
        });

        it('accepts "true"', () => {
            expect(parse.boolean('true')).to.be.true;
        });

        it('accepts "false"', () => {
            expect(parse.boolean('false')).to.be.false;
        });

        it('does not accept number', () => {
            expect(() => parse.boolean(0)).to.throw(Error);
        });

        it('accepts number when forced', () => {
            expect(parse.boolean(0, true)).to.be.false;
        });

        it('accepts object when forced', () => {
            expect(parse.boolean({}, true)).to.be.true;
        });

    });

    describe('byte', () => {

        it('accepts base64 string', () => {
            const result = parse.byte('aGVsbG8=');
            expect(result).to.be.an.instanceof(Buffer);
            expect(result.toString()).to.equal('hello');
        });

        it('does not accept non base64 string', () => {
            expect(() => parse.byte(123)).to.throw(Error);
        });

    });

    describe('date', () => {

        it('accepts Date object', () => {
            const d = new Date();
            const p = parse.date(d);
            expect(p).not.to.equal(d);
            expect(p.toISOString()).to.equal(d.toISOString().substr(0, 10) + 'T00:00:00.000Z');
        });

        it('accepts ISO date string', () => {
            const iso = '2000-01-01';
            const p = parse.date(iso);
            expect(p.toISOString()).to.equal(iso + 'T00:00:00.000Z');
        });

        it('does not accept ISO date-time string', () => {
            const iso = '2000-01-01T00:00:00.000Z';
            expect(() => parse.date(iso)).to.throw(Error);
        });

        it('does not accept number', () => {
            expect(() => parse.date(1)).to.throw(Error);
        });

        it('accepts ISO date-time string if forced', () => {
            const iso = '2000-01-01T00:00:00.000Z';
            const p = parse.date(iso, true);
            expect(p.toISOString()).to.equal(iso);
        });

        it('forced ISO date-time string looses time component', () => {
            const iso = '2000-01-01T11:11:11.111Z';
            const p = parse.date(iso, true);
            expect(p.toISOString()).to.equal('2000-01-01T00:00:00.000Z');
        });

        it('accepts number if forced', () => {
            const num = +(new Date('2000-01-01T11:11:11.111Z'));
            const p = parse.date(num, true);
            expect(p.toISOString()).to.equal('2000-01-01T00:00:00.000Z');
        });

    });

    describe('dateTime', () => {

        it('accepts Date object', () => {
            const d = new Date();
            const p = parse.dateTime(d);
            expect(p).not.to.equal(d);
            expect(p.toISOString()).to.equal(d.toISOString());
        });

        it('accepts ISO date-time string', () => {
            const iso = '2000-01-01T00:00:00.000Z';
            const p = parse.dateTime(iso);
            expect(p.toISOString()).to.equal(iso);
        });

        it('does not accept ISO date string', () => {
            const iso = '2000-01-01';
            expect(() => parse.dateTime(iso)).to.throw(Error);
        });

        it('does not accept number', () => {
            expect(() => parse.dateTime(1)).to.throw(Error);
        });

        it('accepts ISO date string if forced', () => {
            const iso = '2000-01-01';
            const p = parse.dateTime(iso, true);
            expect(p.toISOString()).to.equal(iso + 'T00:00:00.000Z');
        });

        it('accepts number if forced', () => {
            const num = +(new Date('2000-01-01T11:11:11.111Z'));
            const p = parse.dateTime(num, true);
            expect(p.toISOString()).to.equal('2000-01-01T11:11:11.111Z');
        });
    });

    describe('integer', () => {

        it('accepts integer number', () => {
            expect(parse.integer(123)).to.equal(123);
        });

        it('accepts integer string', () => {
            expect(parse.integer('123')).to.equal(123);
        });

        it('does not accept decimal number', () => {
            expect(() => parse.integer(1.23)).to.throw(Error);
        });

        it('does not accept decimal string', () => {
            expect(() => parse.integer('1.23')).to.throw(Error);
        });

        it('accepts decimal number when forced', () => {
            expect(parse.integer(1.23, true)).to.equal(1);
        });

        it('accepts decimal string when forced', () => {
            expect(parse.integer('1.23', true)).to.equal(1);
        });

        it('accepts boolean when forced', () => {
            expect(parse.integer(true, true)).to.equal(1);
        });

    });

    describe('number', () => {

        it('accepts number', () => {
            expect(parse.number(1.23)).to.equal(1.23);
        });

        it('accepts number string', () => {
            expect(parse.number('1.23')).to.equal(1.23);
        });

        it('does not accept boolean', () => {
            expect(() => parse.number(true)).to.throw(Error);
        });

        it('accepts boolean when forced', () => {
            expect(parse.number(true, true)).to.equal(1);
        });
    });

});