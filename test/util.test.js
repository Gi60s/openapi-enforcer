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
const expect        = require('chai').expect;
const util          = require('../src/util');

describe('util', () => {

    describe('randomNumber', () => {
        const randomNumber = util.randomNumber;

        it('does not require any parameters', () => {
            const num = randomNumber();
            expect(num).to.be.a('number');
        });

        it('can have just a minimum', () => {
            const num = randomNumber({ min: 1000 });
            expect(num).to.be.at.least(1000);
        });

        it('can have just a maximum', () => {
            const num = randomNumber({ max: 0 });
            expect(num).to.be.at.most(0);
        });

        it('can specify a spread', () => {
            const num = randomNumber({ spread: 0 });
            expect(num).to.equal(0)
        });

        describe('multipleOf', () => {

            it('can handle whole numbers', () => {
                const num = randomNumber({ min: 1, max: 3, multipleOf: 2 });
                expect(num).to.equal(2);
            });

            it('can handle decimal numbers', () => {
                const num = randomNumber({ min: 1, max: 3, multipleOf: .5 });
                expect(num % .5).to.equal(0);
            });

        })

    });

});
