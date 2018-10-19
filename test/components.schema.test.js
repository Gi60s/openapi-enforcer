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

        describe('binary', () => {
            let schema;

            before(() => {
                [ schema ] = definition(3, Schema, {
                    type: 'string',
                    format: 'binary'
                });
            });

            it('does not allow value true', () => {
                const [ , err ] = schema.serialize(true);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows value true if coerced', () => {
                const [ value ] = schema.serialize(Coerce(true));
                expect(value).to.equal('00000001');
            });

            it('does not allow value false', () => {
                const [ , err ] = schema.serialize(false);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows value false if coerced', () => {
                const [ value ] = schema.serialize(Coerce(false));
                expect(value).to.equal('00000000');
            });

            it('does not allow number', () => {
                const [ , err ] = schema.serialize(5);
                expect(err).to.match(/Expected a Buffer instance/);
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
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [ , err ] = schema.serialize(Coerce(null));
                expect(err).to.match(/Expected a Buffer instance/);
            });

        });

        describe('boolean', () => {
            let schema;

            before(() => {
                [ schema ] = definition(3, Schema, { type: 'boolean' });
            });

            it('allows true', () => {
                const [ value ] = schema.serialize(true);
                expect(value).to.be.true;
            });

            it('allows false', () => {
                const [ value ] = schema.serialize(false);
                expect(value).to.be.false;
            });

            it('does not allow 1', () => {
                const [ , err ] = schema.serialize(1);
                expect(err).to.match(/Expected a boolean/);
            });

            it('allows 1 if coerced', () => {
                const [ value ] = schema.serialize(Coerce(1));
                expect(value).to.be.true;
            });

            it('does not allow 0', () => {
                const [ , err ] = schema.serialize(0);
                expect(err).to.match(/Expected a boolean/);
            });

            it('allows 0 if coerced', () => {
                const [ value ] = schema.serialize(Coerce(0));
                expect(value).to.be.false;
            });

            it('does not allow string', () => {
                const [ , err ] = schema.serialize('hello');
                expect(err).to.match(/Expected a boolean/);
            });

            it('allows empty string if coerced', () => {
                const [ value ] = schema.serialize(Coerce(''));
                expect(value).to.be.false;
            });

            it('allows non-empty string if coerced', () => {
                const [ value ] = schema.serialize(Coerce('hello'));
                expect(value).to.be.true;
            });

            it('does not allow object', () => {
                const [ , err ] = schema.serialize({});
                expect(err).to.match(/Expected a boolean/);
            });

            it('allows object if coerced', () => {
                const [ value ] = schema.serialize(Coerce({}));
                expect(value).to.be.true;
            });

            it('does not allow null', () => {
                const [ , err ] = schema.serialize(null);
                expect(err).to.match(/Expected a boolean/);
            });

            it('allows null if coerced', () => {
                const [ value ] = schema.serialize(Coerce(null));
                expect(value).to.be.false;
            });

        });

        describe('byte', () => {
            let schema;

            before(() => {
                [ schema ] = definition(3, Schema, {
                    type: 'string',
                    format: 'byte'
                });
            });

            it('does not allow true', () => {
                const [ , err ] = schema.serialize(true);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows true if coerced', () => {
                const [ value ] = schema.serialize(Coerce(true));
                expect(value).to.equal('AQ==');
            });

            it('does not allow false', () => {
                const [ , err ] = schema.serialize(false);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows false if coerced', () => {
                const [ value ] = schema.serialize(Coerce(false));
                expect(value).to.equal('AA==');
            });

            it('does not allow number', () => {
                const [ , err ] = schema.serialize(1);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows 0 if coerced', () => {
                const [ value ] = schema.serialize(Coerce(0));
                expect(value).to.equal('AA==');
            });

            it('allows 1 if coerced', () => {
                const [ value ] = schema.serialize(Coerce(1));
                expect(value).to.equal('AQ==');
            });

            it('allow 256 if coerced', () => {
                const [ value ] = schema.serialize(Coerce(256));
                expect(value).to.equal('AQA=');
            });

            it('allow 270721 if coerced', () => {
                const [ value ] = schema.serialize(Coerce(270721));
                expect(value).to.equal('BCGB');
            });

            it('does not allow string', () => {
                const [ , err ] = schema.serialize('M');
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows empty string if coerced', () => {
                const [ value ] = schema.serialize(Coerce(''));
                expect(value).to.equal('AA==');
            });

            it('allows single character string if coerced', () => {
                const [ value ] = schema.serialize(Coerce('M'));
                expect(value).to.equal('TQ==');
            });

            it('allows multiple character string if coerced', () => {
                const [ value ] = schema.serialize(Coerce('Ma'));
                expect(value).to.equal('TWE=');
            });

            it('allows buffer', () => {
                const [ value ] = schema.serialize(Buffer.from('M'));
                expect(value).to.equal('TQ==');
            });

            it('does not allow object', () => {
                const [ , err ] = schema.serialize(Coerce({}));
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [ , err ] = schema.serialize(Coerce(null));
                expect(err).to.match(/Expected a Buffer instance/);
            });

        });

        describe('date', () => {
            const date = '2000-01-01';
            const iso = date + 'T00:00:00.000Z';
            let schema;

            before(() => {
                [ schema ] = definition(3, Schema, {
                    type: 'string',
                    format: 'date'
                });
            });

            it('allows a valid date object', () => {
                const [ value ] = schema.serialize(new Date(iso));
                expect(value).to.equal(date);
            });

            it('does not allow an invalid date object', () => {
                const [ , err ] = schema.serialize(new Date('hello'));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('allows a date string', () => {
                const [ value ] = schema.serialize(date);
                expect(value).to.equal(date);
            });

            it('allows a date-time string', () => {
                const [ value ] = schema.serialize(iso);
                expect(value).to.equal(date);
            });

            it('does not allow a number', () => {
                const [ , err ] = schema.serialize(1);
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('allows a number if coerced', () => {
                const [ value ] = schema.serialize(Coerce(+(new Date(iso))));
                expect(value).to.equal(date);
            });

            it('does not allow a boolean', () => {
                const [ , err ] = schema.serialize(Coerce(true));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow an object', () => {
                const [ , err ] = schema.serialize(Coerce({}));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow null', () => {
                const [ , err ] = schema.serialize(Coerce(null));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

        });

        describe.only('date-time', () => {
            const iso = '2000-01-01T00:00:00.000Z';
            let schema;

            before(() => {
                [ schema ] = definition(3, Schema, {
                    type: 'string',
                    format: 'date-time'
                });
            });

            it('allows a valid date object', () => {
                const [ value ] = schema.serialize(new Date(iso));
                expect(value).to.equal(iso);
            });

            it('does not allow an invalid date object', () => {
                const [ , err ] = schema.serialize(new Date('hello'));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('allows a date string', () => {
                const [ value ] = schema.serialize(iso.substr(0, 10));
                expect(value).to.equal(iso);
            });

            it('allows a date-time string', () => {
                const [ value ] = schema.serialize(iso);
                expect(value).to.equal(iso);
            });

            it('does not allow a number', () => {
                const [ , err ] = schema.serialize(1);
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('allows a number if coerced', () => {
                const [ value ] = schema.serialize(Coerce(+(new Date(iso))));
                expect(value).to.equal(iso);
            });

            it('does not allow a boolean', () => {
                const [ , err ] = schema.serialize(Coerce(true));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow an object', () => {
                const [ , err ] = schema.serialize(Coerce({}));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow null', () => {
                const [ , err ] = schema.serialize(Coerce(null));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

        });

        describe('integer', () => {
            let schema;

            before(() => {
                [ schema ] = definition(3, Schema, { type: 'integer' });
            });

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