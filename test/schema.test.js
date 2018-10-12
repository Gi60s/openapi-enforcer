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
const Enforcer      = require('../index');

describe('request', () => {
    let enforcer;
    let schema;

    before(() => {
        enforcer = new Enforcer('2.0');
        schema = enforcer.schema({
            type: 'object',
            properties: {
                a: {
                    type: 'integer',
                    'x-variable': 'myInteger',
                    'x-nullable': true,
                    minimum: 0,
                    maximum: 10
                },
                b: {
                    type: 'string',
                    format: 'date',
                    default: '2000-01-01'
                },
                c: {
                    type: 'string',
                    'x-template': '{myInteger} is an integer'
                }
            }
        });
    });

    it('returns object with functions', () => {
        ['deserialize', 'errors', 'populate', 'random', 'serialize', 'validate'].forEach(name => {
            expect(typeof schema[name]).to.equal('function');
        });
    });

    it('can deserialize', () => {
        const value = schema.deserialize({ a: '1', b: '2000-01-01' });
        expect(value).to.deep.equal({
            a: 1,
            b: new Date('2000-01-01')
        })
    });

    it('can check for errors', () => {
        const errors = schema.errors({ a: 'a string', b: null, c: 15 });
        expect(errors.length).to.equal(3);
    });

    it('can populate', () => {
        const value = schema.populate({ myInteger: 5 });
        expect(value).to.deep.equal({
            a: 5,
            b: new Date('2000-01-01'),
            c: '5 is an integer'
        });
    });

    it('can produce random value', () => {
        const value = schema.random();
        expect(value.a).to.be.at.least(0);
        expect(value.a).to.be.at.most(10);
    });

    it('can serialize', () => {
        const value = schema.serialize({ b: new Date('2000-01-01') });
        expect(value.b).to.equal('2000-01-01');
    });

    it('can validate', () => {
        expect(() => schema.validate({ a: 15 })).to.throw(/less than or equal to 10/)
    });

    it('can allow null value with x-nullable in schema', () => {
        expect(() =>
            schema.validate({ a: null })
        ).not.to.throw(Error);
    });

    it('does not allow null value without x-nullable in schema', () => {
        expect(() => schema.validate({ b: null })).to.throw(/Expected a valid date object. Received: null/);
    });

});