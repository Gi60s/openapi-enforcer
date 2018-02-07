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

describe.only('is', () => {

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

    });

    describe('date', () => {

    });

    describe('dateTime', () => {

    });

    describe('integer', () => {

    });

    describe('number', () => {

    });

});