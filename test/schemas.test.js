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
const schemas       = require('../bin/schemas');

describe('schemas', () => {
    
    describe('merge', () => {

        const options = { throw: false };

        it('invalid version', () => {
            expect(() => schemas.merge(1, [])).to.throw(/invalid version/i);
        });

        it('array of schemas omitted', () => {
            expect(() => schemas.merge(2)).to.throw(/missing required schemas/i);
        });

        it('empty schema items ignored', () => {
            const value = schemas.merge(2, [{ type: 'number' }, undefined])
            expect(value).to.deep.equal({ type: 'number' })
        });

        describe('numbers', () => {
            const n1 = { type: 'number', minimum: 0 };
            const n2 = { type: 'number', maximum: 10 };

            it('compatible', () => {
                const data = schemas.merge(2, [n1, n2], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'number',
                    minimum: 0,
                    maximum: 10
                })
            });

            it('compatible competing maximum', () => {
                const data = schemas.merge(2, [n1, n2, { type: 'number', maximum: 5 }], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'number',
                    minimum: 0,
                    maximum: 5
                })
            });

            it('compatible competing minimum', () => {
                const data = schemas.merge(2, [n1, n2, { type: 'number', minimum: 5 }], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'number',
                    minimum: 5,
                    maximum: 10
                })
            });

            it('compatible with integer', () => {
                const data = schemas.merge(2, [n1, n2, { type: 'integer' }], options);
                expect(data.error).to.be.null;
                expect(data.value).to.deep.equal({
                    type: 'integer',
                    minimum: 0,
                    maximum: 10
                })
            });

            it('incompatible with non-specific type', () => {
                const data = schemas.merge(2, [n1, { maximum: 10 }], options);
                expect(data.error).to.match(/missing required property: type/i);
                expect(data.value).to.be.null;
            });

            it('incompatible types', () => {
                const data = schemas.merge(2, [n1, { type: 'boolean' }], options);
                expect(data.error).to.match(/incompatible types/i);
                expect(data.value).to.be.null;
            });

            it('incompatible properties', () => {
                const data = schemas.merge(2, [{ type: 'number', minimum: 10 }, { type: 'number', maximum: 0}], options);
                expect(data.error).to.match(/invalid merged schema/i);
                expect(data.value).to.be.null;
            });

            it('incompatible thrown error', () => {
                expect(() => schemas.merge(2, [n1, { maximum: 10 }])).to.throw(/missing required property: type/i);
            });

        });

        describe('modifiers', () => {

            it('can do allOf', () => {
                const array = [
                    {
                        type: 'integer',
                        multipleOf: 5
                    },
                    {
                        allOf: [
                            { type: 'integer', minimum: 0 },
                            { type: 'number', maximum: 100 },
                            { type: 'number', multipleOf: 4 }
                        ]
                    }
                ];
                const merged = schemas.merge(3, array);
                expect(merged).to.deep.equal({
                    type: 'integer',
                    multipleOf: 20,
                    minimum: 0,
                    maximum: 100
                })
            });

            it('cannot do anyOf, oneOf, or not', () => {
                expect(() => schemas.merge(3, [{ anyOf: [] }])).to.throw(/cannot merge the modifiers/i);
                expect(() => schemas.merge(3, [{ oneOf: [] }])).to.throw(/cannot merge the modifiers/i);
                expect(() => schemas.merge(3, [{ not: { type: 'boolean'} }])).to.throw(/cannot merge the modifiers/i);
            })

        });
        
    });

});