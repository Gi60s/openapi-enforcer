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
const parse     = require('../bin-old/parse-value');

describe('parse', () => {

    describe('binary', () => {

        // 01011001 => 89 => Y
        it('accepts string binary octet', () => {
            const result = parse.binary('01011001').value;
            expect(result).to.be.an.instanceof(Buffer);
            expect(result.length).to.equal(1);
            expect(result.toString('utf8')).to.equal('Y');
        });

        it('accepts string binary octet (3x)', () => {
            const result = parse.binary('010000100101100101010101').value;
            expect(result).to.be.an.instanceof(Buffer);
            expect(result.length).to.equal(3);
            expect(result.toString('utf8')).to.equal('BYU');
        });

        it('does not accept string binary quartet', () => {
            expect(parse.binary('0101').error).not.to.be.null;
        });

        it('does not accept non-string', () => {
            expect(parse.binary(1).error).not.to.be.null;
        });

    });

    describe('boolean', () => {

        it('accepts "true"', () => {
            expect(parse.boolean('true').value).to.be.true;
        });

        it('accepts "false"', () => {
            expect(parse.boolean('false').value).to.be.false;
        });

        it('accepts ""', () => {
            expect(parse.boolean('').value).to.be.false;
        });

        it('accepts true', () => {
            expect(parse.boolean(true).value).to.be.true;
        });

        it('accepts false', () => {
            expect(parse.boolean(false).value).to.be.false;
        });

        it('does not accept other string', () => {
            expect(parse.boolean(" ").error).not.to.be.null;
        });

        it('does not accept other non-string', () => {
            expect(parse.boolean(1).error).not.to.be.null;
        });

    });

    describe('byte', () => {

        it('accepts base64 string', () => {
            const result = parse.byte('aGVsbG8=').value;
            expect(result).to.be.an.instanceof(Buffer);
            expect(result.toString()).to.equal('hello');
        });

        it('does not accept non base64 string', () => {
            expect(parse.byte('a').error).not.to.be.null;
        });

        it('does not accept non string', () => {
            expect(parse.byte(1).error).not.to.be.null;
        });

    });

    describe('date', () => {

        it('accepts ISO date string', () => {
            const iso = '2000-01-01';
            const p = parse.date(iso).value;
            expect(p.toISOString()).to.equal(iso + 'T00:00:00.000Z');
        });

        it('accepts ISO date-time string', () => {
            const iso = '2000-01-01T01:02:03.456Z';
            const p = parse.date(iso).value;
            expect(p.toISOString()).to.equal(iso.substr(0, 10) + 'T00:00:00.000Z');
        });

        it('does not accept non-string', () => {
            expect(parse.date(1).error).not.to.be.null;
        });

    });

    describe('dateTime', () => {

        it('accepts ISO date-time string', () => {
            const iso = '2000-01-01T00:00:00.000Z';
            const p = parse.dateTime(iso).value;
            expect(p.toISOString()).to.equal(iso);
        });

        it('accepts ISO date string', () => {
            const iso = '2000-01-01';
            const p = parse.dateTime(iso).value;
            expect(p.toISOString()).to.equal(iso + 'T00:00:00.000Z');
        });

        it('does not accept non-string', () => {
            expect(parse.dateTime(1).error).not.to.be.null;
        });

    });

    describe('integer', () => {

        it('accepts integer string', () => {
            expect(parse.integer('123').value).to.equal(123);
        });

        it('does not accept decimal string', () => {
            expect(parse.integer('1.23').error).not.to.be.null;
        });

        it('accepts number', () => {
            expect(parse.integer(123).value).to.equal(123);
        });

        it('does not accept decimal', () => {
            expect(parse.integer(1.23).error).not.to.be.null;
        });

    });

    describe('number', () => {

        it('accepts number', () => {
            expect(parse.number(1.23).value).to.equal(1.23);
        });

        it('accepts number string', () => {
            expect(parse.number('1.23').value).to.equal(1.23);
        });

        it('does not accept non-number string', () => {
            expect(parse.number('abc').error).not.to.be.null;
        });

        it('does not accept boolean', () => {
            expect(parse.number(true).error).not.to.be.null;
        });
    });

});