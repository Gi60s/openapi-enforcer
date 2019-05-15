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
const assert        = require('../src/assert');
const Enforcer      = require('../index');
const expect        = require('chai').expect;
const util          = require('../src/util');

describe('definition/example', () => {

    describe('v2', () => {

    });

    describe('summary', () => {
        it('can be a string', () => {
            const def = { summary: 'a summary' }
            const [ , err ] = Enforcer.v2_0.Example
        });
    });

    describe('description', () => {

    });

    describe('value', () => {

    });

    describe('externalValue', () => {

    });

});
