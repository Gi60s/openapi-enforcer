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
const Enforcer  = require('../index');

describe('v3/version', () => {

    describe('as string', () => {

        it('2.0', () => {
            const enforcer = Enforcer('2.0');
            expect(enforcer.version()).to.equal('2.0');
        });

        it('3.0.0', () => {
            const enforcer = Enforcer('3.0.0');
            expect(enforcer.version()).to.equal('3.0.0');
        });

        it('3.0.3', () => {
            const enforcer = Enforcer('3.0.3');
            expect(enforcer.version()).to.equal('3.0.3');
        });

        it('3.0 is invalid', () => {
            expect(() => Enforcer('3.0')).to.throw(/unsupported/i);
        });

        it('4.0.0 is invalid', () => {
            expect(() => Enforcer('4.0.0')).to.throw(/unsupported/i);
        });

    });

    describe('as object', () => {

        it('{ swagger: 2.0 }', () => {
            const enforcer = Enforcer({ swagger: '2.0' });
            expect(enforcer.version()).to.equal('2.0');
        });

        it('{ openapi: 3.0.0 }', () => {
            const enforcer = Enforcer({ openapi: '3.0.0' });
            expect(enforcer.version()).to.equal('3.0.0');
        });

        it('{ openapi: 3.0 } invalid', () => {
            expect(() => Enforcer({ openapi: '3.0' })).to.throw(/unsupported/i);
        });

        it('4.0.0 is invalid', () => {
            expect(() => Enforcer({ openapi: '4.0.0' })).to.throw(/unsupported/i);
        });

    })

});