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
const expect    = require('chai').expect;
const is        = require('../bin/is');

describe('is', () => {

    describe('binary', () => {

        it('binary string with length divisible by 8', () => {
            expect(is.binary('00001111')).to.be.true;
        });

        it('binary string with length not divisible by 8', () => {
            expect(is.binary('000011110')).to.be.false;
        });

    });

    describe('boolean', () => {

        it('"true" is boolean', () => {
            expect(is.boolean('true')).to.be.true;
        });

        it('"false" is boolean', () => {
            expect(is.boolean('false')).to.be.true;
        });

        it('true is boolean', () => {
            expect(is.boolean(true)).to.be.true;
        });

        it('number is not boolean', () => {
            expect(is.boolean(1)).to.be.false;
        });

        it('"true" is not strict boolean', () => {
            expect(is.boolean('true', true)).to.be.false;
        });

    });

    describe('byte', () => {

        it('base64 encoded string', () => {
            expect(is.byte('aGVsbG8=')).to.be.true;
        });

        it('not base64 encoded string', () => {
            expect(is.byte('5*2')).to.be.false;
        });

    });

    describe('date', () => {

        it('date at start of day is date', () => {
            expect(is.date(new Date('2000-01-01T00:00:00.000Z'))).to.be.true;
        });

        it('date not at start of day is not date', () => {
            expect(is.date(new Date('2000-01-01T11:11:11.111Z'))).to.be.false;
        });

        it('string with ISO date format is date', () => {
            expect(is.date('2000-01-01')).to.be.true;
        });

        it('string with ISO date-time format is not date', () => {
            expect(is.date('2000-01-01T00:00:00.000Z')).to.be.false;
        });

        it('number is not date', () => {
            expect(is.date(1)).to.be.false;
        });

        it('string with ISO date format is not date in strict mode', () => {
            expect(is.date('2000-01-01', true)).to.be.false;
        });

    });

    describe('dateTime', () => {

        it('date is date-time', () => {
            expect(is.dateTime(new Date())).to.be.true;
        });

        it('string with ISO date format not is date-time', () => {
            expect(is.dateTime('2000-01-01')).to.be.false;
        });

        it('string with ISO date-time format is date-time', () => {
            expect(is.dateTime('2000-01-01T00:00:00.000Z')).to.be.true;
        });

        it('number is not date-time', () => {
            expect(is.dateTime(1)).to.be.false;
        });

        it('string with ISO date-time format is not date-time in strict mode', () => {
            expect(is.dateTime('2000-01-01T00:00:00.000Z', true)).to.be.false;
        });

    });

    describe('integer', () => {

        it('string integer is integer', () => {
            expect(is.integer('123')).to.be.true;
        });

        it('string decimal is not integer', () => {
            expect(is.integer('1.23')).to.be.false;
        });

        it('integer number is integer', () => {
            expect(is.integer(123)).to.be.true;
        });

        it('decimal number is integer', () => {
            expect(is.integer(1.23)).to.be.false;
        });

        it('string integer is not integer in strict', () => {
            expect(is.integer('123', true)).to.be.false;
        });

    });

    describe('number', () => {

        it('string number is number', () => {
            expect(is.number('1.23')).to.be.true;
        });

        it('number is number', () => {
            expect(is.number(1.23)).to.be.true;
        });

        it('string number is not number in strict', () => {
            expect(is.number('1.23', true)).to.be.false;
        });

    });

});