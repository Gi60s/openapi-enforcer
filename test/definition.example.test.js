/**
 *  @license
 *    Copyright 2019 Brigham Young University
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
const Enforcer      = require('../index');
const expect        = require('chai').expect;

describe('definition/example', () => {

    describe('summary', () => {
        it('can be a string', () => {
            const def = { summary: 'a summary' };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.equal(undefined);
        });

        it('must be a string', () => {
            const def = { summary: 5 };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.match(/Value must be a string/);
        });
    });

    describe('description', () => {
        it('can be a string', () => {
            const def = { description: 'a description' };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.equal(undefined);
        });

        it('must be a string', () => {
            const def = { description: 5 };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.match(/Value must be a string/);
        });
    });

    describe('value', () => {
        it('can be a string', () => {
            const def = { value: 'hello' };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.equal(undefined);
        });

        it('can be a number', () => {
            const def = { value: 5 };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.equal(undefined);
        });

        it('can be an object', () => {
            const def = { value: { a: 1, b: 'two' } };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.equal(undefined);
        });
    });

    describe('externalValue', () => {
        it('can be a string', () => {
            const def = { externalValue: 'a string' };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.equal(undefined);
        });

        it('must be a string', () => {
            const def = { externalValue: 5 };
            const [ , err ] = Enforcer.v3_0.Example(def);
            expect(err).to.match(/Value must be a string/);
        });
    });

});
