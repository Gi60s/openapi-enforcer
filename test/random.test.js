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
const Exception     = require('../bin/exception');
const expect        = require('chai').expect;
const random        = require('../bin/random');

describe('random', () => {
    let exception;
    beforeEach(() => {
        exception = Exception('');
    });

    describe('number', () => {

        it('can be multiple of .25', () => {
            throw Error('TODO');
        });

        it('can be multiple of 3', () => {
            expect(random.number(exception, 1, 4, { multipleOf: 3 })).to.equal(3);
        });

        it('produces an exception if multiple out of bounds', () => {
            random.number(exception, 1, 4, { multipleOf: 5 });
            expect(exception.hasException).to.be.true;
        });

        it('can get number with 2 decimal places', () => {
            throw Error('TODO');
        });

    });

});