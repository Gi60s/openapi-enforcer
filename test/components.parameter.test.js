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
const definition    = require('../bin/definition-validator').normalize;
const expect        = require('chai').expect;
const Parameter     = require('../bin/definition-validators/parameter');

describe.only('components/parameter', () => {

    describe('constructor', () => {

        it('defines schema for v2', () => {
            const [ , def ] = definition(2, Parameter, {
                name: 'hi',
                in: 'query',
                type: 'string'
            });
            expect(def.schema.type).to.equal('string');
        });

        it('defines schema for v3 with content', () => {
            const [ , def ] = definition(3, Parameter, {
                name: 'hi',
                in: 'query',
                content: {
                    'application/json': {
                        schema: { type: 'string' }
                    }
                }
            });
            expect(def.schema.type).to.equal('string');
        })

    });

    describe('parse', () => {

        it('todo', () => {
            throw Error('todo')
        });

    });

});