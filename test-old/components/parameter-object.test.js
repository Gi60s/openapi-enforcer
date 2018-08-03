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
const ParameterObject   = require('../../bin-old/components/parameter-object');

describe('components/parameter-object', () => {

    describe.only('v2', () => {

        it('valid definition', () => {
            const po = new ParameterObject(2, {
                name: 'x',
                in: 'path',
                required: true,
                type: 'string'
            });
            return po;
        });

        describe('in', () => {



        });

    });

    describe('v2', () => {

    });

});