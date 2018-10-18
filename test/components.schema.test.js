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
const Enforcer      = require('../index');
const Coerce       = require('../coerce');
const expect        = require('chai').expect;
const Schema        = require('../bin/definition-validators/schema');

describe('components/schema', () => {
    let def;

    beforeEach(() => {
        def = {
            openapi: '3.0.0',
            info: { title: '', version: '' }
        }
    });

    describe('deserialize', () => {

        it('todo', () => {
            throw Error('TODO');
        });

    });

    describe('discriminators', () => {

        it('todo', () => {
            throw Error('TODO');
        });

    });

    describe('populate', () => {

        it('todo', () => {
            throw Error('TODO');
        });

    });

    describe('random', () => {

        it('todo', () => {
            throw Error('TODO');
        });

    });

    describe('serialize', () => {

        describe('array', () => {

            it('serializes each item in the array', () => {
                const [ schema ] = definition(3, Schema, {
                    type: 'array',
                    items: { type: 'string', format: 'date' }
                });
                const [ value ] = schema.serialize([new Date('2000-01-01')]);
                expect(value).to.deep.equal(['2000-01-01']);
            });

        });

        describe.only('binary', () => {
            let schema;

            before(() => {
                [ schema ] = definition(3, Schema, {
                    type: 'string',
                    format: 'binary'
                });
            });

            it('does not allow value true', () => {
                const [ , err ] = schema.serialize(true);
                expect(err).to.match(/Value must be a Buffer instance/);
            });

            it('allows value true if coerced', () => {
                const [ value ] = schema.serialize(Coerce(true));
                expect(value).to.equal('00000001');
            });

            it('does not allow value false', () => {
                const [ , err ] = schema.serialize(false);
                expect(err).to.match(/Value must be a Buffer instance/);
            });

            it('allows value false if coerced', () => {
                const [ value ] = schema.serialize(Coerce(false));
                expect(value).to.equal('00000000');
            });

            it('does not allow number', () => {
                const [ , err ] = schema.serialize(5);
                expect(err).to.match(/Value must be a Buffer instance/);
            });

            it('allows number if coerced', () => {
                const [ value ] = schema.serialize(Coerce(5));
                expect(value).to.equal('00000101');
            });

            it('allows 255 if coerced', () => {
                const [ value ] = schema.serialize(Coerce(255));
                expect(value).to.equal('11111111');
            });

            it('allows large number if coerced', () => {
                const [ value ] = schema.serialize(Coerce(256));
                expect(value).to.equal('0000000100000000');
            });

            it('ignores string', () => {
                const [ value ] = schema.serialize('\r');
                expect(value).to.equal('\r');
            });

            it('allows buffer', () => {
                const buf = Buffer.from('\r');
                const [ value ] = schema.serialize(buf);
                expect(value).to.equal('00001101');
            });

            it('does not allow object', () => {
                const [ , err ] = schema.serialize(Coerce({}));
                expect(err).to.match(/Value must be a Buffer instance/);
            });

        });

        describe('boolean', () => {
            const schema = { type: 'boolean' };

            it('allows true', () => {
                expect(enforcer.serialize(schema, true)).to.be.true;
            });

            it('allows false', () => {
                expect(enforcer.serialize(schema, false)).to.be.false;
            });

            it('does not allow 1', () => {
                expect(enforcer.serialize(schema, 1)).to.be.true;
            });

            it('allows 1 if coerced', () => {

            });

            it('does not allow 0', () => {
                expect(enforcer.serialize(schema, 0)).to.be.false;
            });

            it('allows 0 if coerced', () => {

            });

            it('does not allow string', () => {

            });

            it('allows empty string if coerced', () => {

            });

            it('allows non-empty string if coerced', () => {

            });

            it('does not allow object', () => {

            });

            it('allows object if coerced', () => {
                expect(enforcer.serialize(schema, {})).to.be.true;
            });

            it('does not allow null', () => {

            });

            it('allows null if coerced', () => {
                expect(enforcer.serialize(schema, null)).to.be.false;
            });

        });

        describe('byte', () => {
            const schema = { type: 'string', format: 'byte' };

            it('true', () => {
                expect(enforcer.serialize(schema, true)).to.equal('AQ==');
            });

            it('false', () => {
                expect(enforcer.serialize(schema, false)).to.equal('AA==');
            });

            it('number', () => {
                expect(enforcer.serialize(schema, 1)).to.equal('AQ==');
            });

            it('large number', () => {
                expect(enforcer.serialize(schema, 256)).to.equal('AQA=');
            });

            it('larger number', () => {
                expect(enforcer.serialize(schema, 270721)).to.equal('BCGB');
            });

            it('M', () => {
                expect(enforcer.serialize(schema, 'M')).to.equal('TQ==');
            });

            it('Ma', () => {
                expect(enforcer.serialize(schema, 'Ma')).to.equal('TWE=');
            });

            it('buffer', () => {
                const b = Buffer.from('M');
                expect(enforcer.serialize(schema, b)).to.equal('TQ==')
            });

            it('invalid type', () => {
                expect(() => enforcer.serialize(schema, null)).to.throw(/errors occurred during serialization/);
            });

        });

        describe('date', () => {
            const schema = { type: 'string', format: 'date' };
            const iso = '2000-01-01T00:00:00.000Z';

            it('Date object', () => {
                const d = new Date(iso);
                expect(enforcer.serialize(schema, d)).to.equal('2000-01-01');
            });

            it('ISO format', () => {
                expect(enforcer.serialize(schema, iso)).to.equal('2000-01-01');
            });

            it('date format', () => {
                expect(enforcer.serialize(schema, '2000-01-01')).to.equal('2000-01-01');
            });

            it('oveflow', () => {
                expect(enforcer.serialize(schema, '2000-02-30')).to.equal('2000-03-01');
            });

            it('number', () => {
                const d = new Date(iso);
                expect(enforcer.serialize(schema, +d)).to.equal('2000-01-01');
            });

            it('boolean', () => {
                expect(() => enforcer.serialize(schema, true)).to.throw(/errors occurred during serialization/);
            });

        });

        describe('date-time', () => {
            const schema = { type: 'string', format: 'date-time' };
            const iso = '2000-01-01T01:15:22.345Z';

            it('Date object', () => {
                const d = new Date(iso);
                expect(enforcer.serialize(schema, d)).to.equal(iso);
            });

            it('ISO format', () => {
                expect(enforcer.serialize(schema, iso)).to.equal(iso);
            });

            it('date format', () => {
                expect(enforcer.serialize(schema, '2000-01-01')).to.equal('2000-01-01T00:00:00.000Z');
            });

            it('oveflow', () => {
                expect(enforcer.serialize(schema, '2000-02-30')).to.equal('2000-03-01T00:00:00.000Z');
            });

            it('number', () => {
                const d = new Date(iso);
                expect(enforcer.serialize(schema, +d)).to.equal(iso);
            });

            it('boolean', () => {
                expect(() => enforcer.serialize(schema, true)).to.throw(/errors occurred during serialization/);
            });

        });

        describe('integer', () => {
            const schema = { type: 'integer' };

            it('integer', () => {
                expect(enforcer.serialize(schema, 123)).to.equal(123);
            });

            it('produces error when float is provided', () => {
                expect(enforcer.serialize(schema, 123.7)).to.equal(124);
            });

            it('string integer', () => {
                expect(enforcer.serialize(schema, '123')).to.equal(123);
            });

            it('string float', () => {
                expect(enforcer.serialize(schema, '123.7')).to.equal(124);
            });

            it('date', () => {
                const dt = new Date('2000-01-01T00:00:00.000Z');
                expect(enforcer.serialize(schema, dt)).to.equal(+dt);
            });

            it('true', () => {
                expect(enforcer.serialize(schema, true)).to.equal(1);
            });

            it('false', () => {
                expect(enforcer.serialize(schema, false)).to.equal(0);
            });

            it('object', () => {
                expect(() => enforcer.serialize(schema, {})).to.throw(/must be numeric/);
            });

        });

        describe('number', () => {
            const schema = { type: 'number' };

            it('integer', () => {
                expect(enforcer.serialize(schema, 123)).to.equal(123);
            });

            it('float', () => {
                expect(enforcer.serialize(schema, 123.7)).to.equal(123.7);
            });

            it('string integer', () => {
                expect(enforcer.serialize(schema, '123')).to.equal(123);
            });

            it('string float', () => {
                expect(enforcer.serialize(schema, '123.7')).to.equal(123.7);
            });

            it('date', () => {
                const dt = new Date('2000-01-01T00:00:00.000Z');
                expect(enforcer.serialize(schema, dt)).to.equal(+dt);
            });

            it('true', () => {
                expect(enforcer.serialize(schema, true)).to.equal(1);
            });

            it('false', () => {
                expect(enforcer.serialize(schema, false)).to.equal(0);
            });

            it('object', () => {
                expect(() => enforcer.serialize(schema, {})).to.throw(/must be numeric/);
            });

        });

        describe('object', () => {
            const schema = {
                properties: {
                    a: { type: 'integer' },
                    b: { type: 'string' },
                    c: { type: 'boolean' },
                    d: { type: 'string', format: 'date' },
                    o: { additionalProperties: { type: 'number' } }
                }
            };

            function create(v) {
                return { a: v, b: v, c: v, d: v, x: v, o: { x: v, y: v }};
            }

            it('number', () => {
                const o = create(1.7);
                expect(enforcer.serialize(schema, o)).to.deep.equal({
                    a: 2,
                    b: '1.7',
                    c: true,
                    d: '1970-01-01',
                    o: { x: 1.7, y: 1.7 }
                });
            });
        });

        describe('string', () => {
            const schema = { type: 'string' };

            it('true', () => {
                expect(enforcer.serialize(schema, true)).to.equal('true');
            });

            it('false', () => {
                expect(enforcer.serialize(schema, false)).to.equal('false');
            });

            it('number', () => {
                expect(enforcer.serialize(schema, 123.7)).to.equal('123.7');
            });

            it('null', () => {
                expect(enforcer.serialize(schema, null)).to.equal('null');
            });

            it('object', () => {
                expect(enforcer.serialize(schema, { a: 1 })).to.equal('{"a":1}');
            });

            it('date', () => {
                const iso = '2000-01-01T01:03:04.005Z';
                expect(enforcer.serialize(schema, new Date(iso))).to.equal(iso);
            });

            it('symbol', () => {
                const s = Symbol('my-symbol');
                expect(() => enforcer.serialize(schema, s)).to.throw(/Cannot convert to string/i);
            });

        });

        it('todo', () => {
            throw Error('TODO');
        });

    });

    describe('validate', () => {

        it('todo', () => {
            throw Error('TODO');
        });

    });

});