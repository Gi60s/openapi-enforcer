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
const Exception = require('../bin/exception');

describe('deserialize', () => {
    let enforcer;

    before(() => {
        enforcer = Enforcer('2.0')
    });

    it('string', () => {
        const v = enforcer.deserialize({ type: 'string' }, 'hello');
        expect(v).to.equal('hello');
    });

    it('number', () => {
        const v = enforcer.deserialize({ type: 'number' }, '2.4');
        expect(v).to.equal(2.4);
    });

    it('integer', () => {
        const v = enforcer.deserialize({ type: 'integer' }, '2');
        expect(v).to.equal(2);
    });

    it('byte', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'byte' }, 'aGVsbG8=');
        expect(v).to.be.instanceOf(Buffer);
        expect(v.toString()).to.equal('hello');
    });

    it('binary', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'binary' }, '01100001');
        expect(v).to.be.instanceOf(Buffer);
        expect(v[0]).to.equal(97);
        expect(v.toString()).to.equal('a');
    });

    it('boolean', () => {
        expect(enforcer.deserialize({ type: 'boolean' }, '')).to.be.false;
        expect(enforcer.deserialize({ type: 'boolean' }, 'false')).to.be.false;
        expect(enforcer.deserialize({ type: 'boolean' }, 'true')).to.be.true;
    });

    it('date', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'date' }, '2000-01-01');
        expect(v).to.be.instanceOf(Date);
        expect(v.toISOString()).to.equal('2000-01-01T00:00:00.000Z');
    });

    it('date-time', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'date-time' }, '2000-01-01T01:02:03.456Z');
        expect(v).to.be.instanceOf(Date);
        expect(v.toISOString()).to.equal('2000-01-01T01:02:03.456Z');
    });

    it('password', () => {
        const v = enforcer.deserialize({ type: 'string', format: 'password' }, 'plain text');
        expect(v).to.equal('plain text');
    });

    it('array', () => {
        const schema = {
            type: 'array',
            items: { type: 'string', format: 'date' }
        };
        const v = enforcer.deserialize(schema, ['2000-01-01']);
        expect(v).to.deep.equal([new Date('2000-01-01')]);
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
        expect(v).to.deep.equal({ a: 1, b: new Date('2000-01-01') });
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
        expect(v).to.deep.equal({
            a: 1,
            b: new Date('2000-01-01'),
            c: Buffer.from([97])
        });
    });

    it('reported data', () => {
        const v = enforcer.deserialize({ type: 'integer' }, '2', { throw: false });
        expect(v.error).to.equal(null);
        expect(v.value).to.equal(2);
    });

    it('thrown error', () => {
        expect(() => enforcer.deserialize({ type: 'integer' }, '2.4')).to.throw(/errors occurred during deserialization/);
    });

    it('reported error', () => {
        const v = enforcer.deserialize({ type: 'integer' }, '2.4', { throw: false });
        expect(v.error).to.be.instanceOf(Exception);
        expect(v.value).to.be.null;
    });

});