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

describe('deserialize', () => {
    let enforcer;

    before(() => {
        enforcer = Enforcer('2.0')
    });

    it('string', () => {
        const v = enforcer.deserialize({ type: 'string' }, 'hello');
        expect(v.value).to.equal('hello');
    });

    it('number', () => {
        const v = enforcer.deserialize({ type: 'number' }, '2.4');
        expect(v.value).to.equal(2.4);
    });

    it('integer', () => {
        const v = enforcer.deserialize({ type: 'integer' }, '2');
        expect(v.value).to.equal(2);
    });

    it('byte', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'byte' }, 'aGVsbG8=');
        expect(v.value).to.be.instanceOf(Buffer);
        expect(v.value.toString()).to.equal('hello');
    });

    it('binary', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'binary' }, '01100001');
        expect(v.value).to.be.instanceOf(Buffer);
        expect(v.value[0]).to.equal(97);
        expect(v.value.toString()).to.equal('a');
    });

    it('boolean', () => {
        expect(enforcer.deserialize({ type: 'boolean' }, '').value).to.be.false;
        expect(enforcer.deserialize({ type: 'boolean' }, 'false').value).to.be.false;
        expect(enforcer.deserialize({ type: 'boolean' }, 'true').value).to.be.true;
    });

    it('date', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'date' }, '2000-01-01');
        expect(v.value).to.be.instanceOf(Date);
        expect(v.value.toISOString()).to.equal('2000-01-01T00:00:00.000Z');
    });

    it('date-time', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'date-time' }, '2000-01-01T01:02:03.456Z');
        expect(v.value).to.be.instanceOf(Date);
        expect(v.value.toISOString()).to.equal('2000-01-01T01:02:03.456Z');
    });

    it('password', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'password' }, 'plain text');
        expect(v.value).to.equal('plain text');
    });

    it('array', () => {
        const schema = {
            type: 'array',
            items: { type: 'string', format: 'date' }
        };
        const v = enforcer.deserialize(schema, ['2000-01-01']);
        expect(v.value).to.deep.equal([new Date('2000-01-01')]);
    });

    it('object', () => {
        const schema = {
            type: 'object',
            properties: {
                a: { type: 'integer' },
                b: { type: 'string', format: 'date' }
            }
        };
        const v = enforcer.deserialize(schema, { a: 1, b: '2000-01-01' });
        expect(v.value).to.deep.equal({ a: 1, b: new Date('2000-01-01') });
    });

    it('object allOf', () => {
        const schema = {
            allOf: [
                {
                    type: 'object',
                    properties: {
                        a: { type: 'integer' },
                        b: { type: 'string', format: 'date' }
                    }
                },
                {
                    type: 'object',
                    properties: {
                        c: { type: 'string', format: 'binary' }
                    }
                }
            ]
        };
        const v = enforcer.deserialize(schema, { a: 1, b: '2000-01-01', c: '01100001' });
        expect(v.value).to.deep.equal({
            a: 1,
            b: new Date('2000-01-01'),
            c: Buffer.from([97])
        });
    });

    it('error', () => {
        const v = enforcer.deserialize({ type: 'integer' }, '2.4');
        expect(v.errors.length).to.equal(1);
        expect(v.value).to.be.null;
    })

});