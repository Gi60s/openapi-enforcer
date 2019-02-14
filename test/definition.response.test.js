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
const Enforcer = require('../');
const { expect } = require('chai');

describe('definition/response', () => {

    describe('v2', () => {

        it('will produce an exception for an invalid example', () => {
            const [ , err ] = Enforcer.v2_0.Response({
                description: '',
                schema: {
                    type: 'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'string' }
                    }
                },
                examples: {
                    'application/json': {
                        a: '1',
                        b: '2'
                    }
                }
            });
            expect(err).to.match(/Expected a number. Received: "1"/)
        });

        it('will allow a valid example', () => {
            const [ res ] = Enforcer.v2_0.Response({
                description: '',
                schema: {
                    type: 'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'string' }
                    }
                },
                examples: {
                    'application/json': {
                        a: 1,
                        b: '2'
                    }
                }
            });
            expect(res).not.to.be.undefined
        });

    });

});