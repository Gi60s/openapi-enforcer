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
const Enforcer      = require('../index');
const expect        = require('chai').expect;

describe('#populate', () => {

    const definition = {
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0'
        },
        paths: {}
    };
    let enforcer;

    before(() => {
        enforcer = new Enforcer(definition, {
            populate: { throw: true }
        });
    });

    describe('integer', () => {

        it('default', () => {
            const value = enforcer.populate({ type: 'number', default: 5 });
            expect(value).to.equal(5);
        });

        it('x-template', () => {
            const value = enforcer.populate({type: 'number', 'x-template': ':myNumber'}, {myNumber: 5});
            expect(value).to.be.undefined; // x-template only works for strings
        });

        it('x-variable', () => {
            const value = enforcer.populate({type: 'number', 'x-variable': 'myNumber'}, {myNumber: 5});
            expect(value).to.equal(5);
        });

        it('default and x-variable 1', () => {
            const value = enforcer.populate({ type: 'number', default: 5, 'x-variable': 'myNumber' }, { myNumber: 6 });
            expect(value).to.equal(6);
        });

        it('default and x-variable 2', () => {
            const value = enforcer.populate({ type: 'number', default: 5, 'x-variable': 'myNumber' });
            expect(value).to.equal(5);
        });

        it('does not format', () => {
            const enforcer = new Enforcer(definition);
            const date = new Date();
            const value = enforcer.populate({type: 'number', 'x-variable': 'myNumber'}, {myNumber: date}, undefined);
            expect(value).to.equal(date);
        });

        it('report data', () => {
            const enforcer = new Enforcer(definition);
            const data = enforcer.populate({type: 'number', 'x-variable': 'myNumber'}, {myNumber: 1}, undefined, { throw: false });
            expect(data.value).to.equal(1);
        });

        it('report error', () => {
            const enforcer = new Enforcer(definition);
            const data = enforcer.populate({type: 'array'}, {}, {}, { throw: false });
            expect(data.errors).not.to.be.null;
        });

        it('throw error', () => {
            const enforcer = new Enforcer(definition);
            expect(() => enforcer.populate({type: 'array'}, {}, {}, { throw: true })).to.throw(/errors occurred during population/);
        });

    });

    describe('string', () => {

        it('default', () => {
            const value = enforcer.populate({ type: 'string', default: 'hello' });
            expect(value).to.equal('hello');
        });

        it('x-template', () => {
            const value = enforcer.populate({ type: 'string', 'x-template': '{varName}' }, { varName: 'hello' });
            expect(value).to.equal('hello');
        });

        it('x-template multiple', () => {
            const value = enforcer.populate({type: 'string', 'x-template': '{greeting}, {name}!'}, {greeting: 'Hello', name: 'Bob'});
            expect(value).to.equal('Hello, Bob!');
        });

        it('x-variable', () => {
            const value = enforcer.populate({type: 'string', 'x-variable': 'varName'},{varName: 'hello'});
            expect(value).to.equal('hello');
        });

    });

    describe('date', () => {

        it('x-variable keeps type', () => {
            const schema = {
                type: 'string',
                format: 'date',
                'x-variable': 'myDate'
            };
            const value = enforcer.populate(schema, { myDate: 'hello' });
            expect(value).to.equal('hello');
        });

        it('default corrects type', () => {
            const schema = {
                type: 'string',
                format: 'date',
                default: '2000-01-01'
            };
            const value = enforcer.populate(schema, { myDate: 'hello' });
            expect(value).to.deep.equal(new Date('2000-01-01'));
        });

        it('x-template corrects type', () => {
            const schema = {
                type: 'string',
                format: 'date',
                'x-template': '{year}-{month}-01'
            };
            const value = enforcer.populate(schema, { year: '2000', month: '01' });
            expect(value).to.deep.equal(new Date('2000-01-01'));
        });

    });

    describe('array', () => {

        it('array of numbers', () => {
            const schema = { type: 'array', items: { type: 'number', default: 5 }};
            const initValue = [1, 2, undefined, 3, 4, undefined];
            const value = enforcer.populate(schema, {}, initValue, { copy: true });
            expect(value).not.to.equal(initValue);
            expect(value).to.deep.equal([1, 2, 5, 3, 4, 5]);
        });

        it('double defaults', () => {
            const schema = {
                type: 'array',
                default: [{ y: 'hi' }, { x: 'bye', y: 'later' }],
                items: {
                    type: 'object',
                    properties: {
                        x: {
                            type: 'string',
                            default: 'hello'
                        },
                        y: {
                            type: 'string'
                        }
                    }
                }
            };
            const value = enforcer.populate(schema);
            expect(value).to.deep.equal([{ x: 'hello', y: 'hi' }, { x: 'bye', y: 'later' }]);
        });

    });

    describe('object', () => {

        it('ignore missing requires', () => {
            const schema = {
                required: ['name'],
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number', default: 5 }
                }
            };
            const value = enforcer.populate(schema);
            expect(value).to.deep.equal({ age: 5 })
        });

        it('don\'t ignore missing requires', () => {
            const enforcer = new Enforcer(definition);
            const schema = {
                required: ['name'],
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number', default: 5 }
                }
            };
            const value = enforcer.populate(schema, {}, undefined, { ignoreMissingRequired: false });
            expect(value).to.be.undefined;
        });

        it('additional properties', () => {
            const schema = {
                additionalProperties: {
                    type: 'object',
                    properties: {
                        x: { type: 'number', default: 5 }
                    }
                }
            };
            const value = enforcer.populate(schema, {}, { a: {} });
            expect(value).to.deep.equal({ a: { x: 5 } });
        });

        it('allOf', () => {
            const schema = {
                allOf: [
                    {
                        properties: {
                            a: { type: 'string', default: 'A' }
                        }
                    },{
                        properties: {
                            b: { type: 'string', default: 'B' }
                        }
                    }
                ]
            };
            const value = enforcer.populate(schema);
            expect(value).to.deep.equal({ a: 'A', b: 'B' });
        });

        describe('anyOf', () => {
            const schema = {
                anyOf: [
                    { properties: { value: { type: 'number', default: 5 } } },
                    { properties: { value: { type: 'string', default: 'hello' } } }
                ]
            };

            it('does nothing', () => {
                const value = enforcer.populate(schema);
                expect(value).to.be.undefined;
            });
        });

        describe('oneOf', () => {
            const one = {
                properties: {
                    mode: { type: 'string' },
                    value: { type: 'number', default: 5 }
                }
            };
            const two = {
                properties: {
                    mode: { type: 'string' },
                    value: { type: 'string', default: 'hello' }
                }
            };
            const schema = {
                oneOf: [ one, two ],
                discriminator: {
                    propertyName: 'mode',
                    mapping: {
                        one: one,
                        two: two
                    }
                }
            };

            it('one', () => {
                const value = enforcer.populate(schema, {}, { mode: 'one' });
                expect(value).to.deep.equal({ mode: 'one', value: 5 });
            });

            it('two', () => {
                const value = enforcer.populate(schema, {}, { mode: 'two' });
                expect(value).to.deep.equal({ mode: 'two', value: 'hello' });
            });

        });

    });

});