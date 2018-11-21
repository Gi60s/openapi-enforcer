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
const assert        = require('../bin/assert');
const Enforcer      = require('../index');
const expect        = require('chai').expect;
const util          = require('../bin/util');
const Value         = require('../bin/value');

describe.only('enforcer/schema', () => {
    const schemas = {
        Cat: {
            type: 'object',
            additionalProperties: false,
            properties: {
                huntingSkill: { type: 'string' }
            }
        },
        Dog: {
            type: 'object',
            additionalProperties: false,
            properties: {
                packSize: { type: 'integer', minimum: 1 }
            }
        },
        Pet2: {
            type: 'object',
            required: ['petType'],
            properties: {
                petType: { type: 'string' }
            },
            discriminator: 'petType'
        },
        Pet3: {
            type: 'object',
            required: ['petType'],
            discriminator: {
                propertyName: 'petType',
                mapping: {
                    dog: 'Dog',
                    cat: '#/components/schemas/Cat'
                }
            },
            properties: {
                petType: { type: 'string' }
            }
        }
    };
    const allOf2Def = {
        swagger: '2.0',
        info: {title: '', version: ''},
        definitions: {
            Cat: {
                allOf: [
                    { '$ref': '#/definitions/Pet' },
                    schemas.Cat
                ]
            },
            Dog: {
                allOf: [
                    { '$ref': '#/definitions/Pet' },
                    schemas.Dog
                ]
            },
            Pet: schemas.Pet2
        }
    };
    const allOf3Def = {
        openapi: '3.0.0',
        info: {title: '', version: ''},
        components: {
            schemas: {
                Cat: {
                    allOf: [
                        { '$ref': '#/components/schemas/Pet' },
                        schemas.Cat
                    ]
                },
                Dog: {
                    allOf: [
                        { '$ref': '#/components/schemas/Pet' },
                        schemas.Dog
                    ]
                },
                Pet: schemas.Pet3
            }
        }
    };
    const anyOfDef = {
        openapi: '3.0.0',
        info: { title: '', version: '' },
        components: {
            schemas: {
                Pet: {
                    anyOf: [
                        { '$ref': '#/components/schemas/Cat' },
                        { '$ref': '#/components/schemas/Dog' }
                    ],
                    discriminator: {
                        propertyName: 'petType',
                        mapping: {
                            cat: 'Cat',
                            dog: '#/components/schemas/Dog'
                        }
                    }
                },
                Cat: schemas.Cat,
                Dog: schemas.Dog
            }
        }
    };
    const oneOfDef = {
        openapi: '3.0.0',
        info: { title: '', version: '' },
        components: {
            schemas: {
                Pet: {
                    oneOf: [
                        { '$ref': '#/components/schemas/Cat' },
                        { '$ref': '#/components/schemas/Dog' }
                    ],
                    discriminator: {
                        propertyName: 'petType',
                        mapping: {
                            cat: 'Cat',
                            dog: '#/components/schemas/Dog'
                        }
                    }
                },
                Cat: schemas.Cat,
                Dog: schemas.Dog
            }
        }
    };

    describe('definition', () => {


        it('allows a valid schema object', () => {
            const [ , err ] = Enforcer.v2_0.Schema({ type: 'string' });
            expect(err).to.be.undefined;
        });

        describe('type', () => {

            it('requires the "type" property', () => {
                const [ , err ] = Enforcer.v2_0.Schema({});
                expect(err).to.match(/Missing required property: type/);
            });

            it('requires a valid type', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'foo' });
                expect(err).to.match(/Value must be one of:/);
            });

        });

        describe('additionalProperties', () => {

            it('is valid for objects', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', additionalProperties: { type: 'string' } });
                expect(err).to.be.undefined;
            });

            it('is not valid for non-objects', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', additionalProperties: { type: 'string' } });
                expect(err).to.match(/Property not allowed: additionalProperties/);
            });

            it('can be a boolean', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', additionalProperties: true });
                expect(err).to.be.undefined;
            });

            it('can be an object', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', additionalProperties: { type: 'string' } });
                expect(err).to.be.undefined;
            });

            it('it cannot be a string', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', additionalProperties: 'hello' });
                expect(err).to.match(/Value must be a boolean or a plain object/);
            });

            it('validates items', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    additionalProperties: {
                        type: 'object',
                        properties: {
                            x: {
                                type: 'boolean',
                                format: 'date',
                            }
                        }
                    }
                });
                expect(err).to.match(/Property not allowed: format/);
            });

        });

        describe('allOf', () => {

            it('it does not need a type specified', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ allOf: [] });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', allOf: 'hello' });
                expect(err).to.match(/Value must be an array/);
            });

            it('accepts multiple items', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    allOf: [
                        { type: 'string', minLength: 5 },
                        { type: 'string', maxLength: 10 }
                    ]
                });
                expect(err).to.be.undefined;
            });

            it('validates items', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    allOf: [{ type: 'string', maximum: 5 }]
                });
                expect(err).to.match(/Property not allowed: maximum/);
            });

        });

        describe('anyOf', () => {

            it('is not allowed for v2', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ anyOf: [] });
                expect(err).to.match(/Property not allowed: anyOf/);
            });

            it('is allowed for v3', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ anyOf: [] });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ anyOf: {} });
                expect(err).to.match(/Value must be an array/);
            });

            it('validates items', () => {
                const [ , err ] = Enforcer.v3_0.Schema({
                    anyOf: [
                        { type: 'string', default: 1 }
                    ]
                });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('default', () => {

            it('allows default', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', default: 'hello' });
                expect(err).to.be.undefined;
            });

            it('deserializes default', () => {
                const [ def, err ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date', default: '2000-01-01' });
                expect(err).to.be.undefined;
                expect(def.default).to.deep.equal(new Date('2000-01-01'));
            });

            it('must must be the same type as type specified', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', default: 'hello' });
                expect(err).to.match(/Value must be a number/)
            });

            it('must match schema', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'number',
                    maximum: 5,
                    default: 10
                });
                expect(err).to.match(/Expected number to be less than or equal to 5/)
            });

        });

        describe('deprecated', () => {

            it('is not allowed for v2', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', deprecated: true });
                expect(err).to.match(/Property not allowed: deprecated/);
            });

            it('is allowed for v3', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ type: 'string', deprecated: true });
                expect(err).to.be.undefined;
            });

            it('must be a boolean', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ type: 'string', deprecated: 'hello' });
                expect(err).to.match(/Value must be a boolean/);
            });

            it('defaults to false', () => {
                const [ def ] = Enforcer.v3_0.Schema({ type: 'string' });
                expect(def.deprecated).to.equal(false);
            });

            it('does not have default for v2', () => {
                const [ def ] = Enforcer.v2_0.Schema({ type: 'string' });
                expect(def).not.to.haveOwnProperty('deprecated');
            });

        });

        describe('description', () => {

            it('can be a string', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', description: 'hello' });
                expect(err).to.be.undefined;
            });

            it('cannot be a number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', description: 1 });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('discriminator', () => {

            describe('v2', () => {

                it('can be valid', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({
                        type: 'object',
                        discriminator: 'a',
                        required: ['a'],
                        properties: { a: { type: 'string' } }
                    });
                    expect(err).to.be.undefined;
                });

                it('must be a string', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({
                        type: 'object',
                        discriminator: 1,
                        required: ['a'],
                        properties: { a: { type: 'string' } }
                    });
                    expect(err).to.match(/Value must be a string/);
                });

                it('must require property', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({
                        type: 'object',
                        discriminator: 'a',
                        properties: { a: { type: 'string' } }
                    });
                    expect(err).to.match(/Value "a" must be found in the parent's required properties list/);
                });

                it('must be listed as a property', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({
                        type: 'object',
                        discriminator: 'a',
                        required: ['a']
                    });
                    expect(err).to.match(/Value "a" must be found in the parent's properties definition/);
                });

            });

            describe('v3', () => {

                it('can be valid', () => {
                    const [ , err ] = Enforcer.v3_0.Schema({
                        type: 'object',
                        properties: { a: { type: 'string' } },
                        discriminator: {
                            propertyName: 'a'
                        },
                        required: ['a']
                    });
                    expect(err).to.be.undefined;
                });

                it('must be an object', () => {
                    const [ , err ] = Enforcer.v3_0.Schema({
                        type: 'object',
                        properties: { a: { type: 'string' } },
                        discriminator: 'a',
                        required: ['a']
                    });
                    expect(err).to.match(/Value must be a plain object. Received: "a"/);
                });

                it('must have propertyName property', () => {
                    const [ , err ] = Enforcer.v3_0.Schema({
                        type: 'object',
                        properties: { a: { type: 'string' } },
                        discriminator: {},
                        required: ['a']
                    });
                    expect(err).to.match(/Missing required property: propertyName/);
                });

                it('requires that propertyName property be a string', () => {
                    const [ , err ] = Enforcer.v3_0.Schema({
                        type: 'object',
                        properties: { a: { type: 'string' } },
                        discriminator: {
                            propertyName: 5
                        },
                        required: ['a']
                    });
                    expect(err).to.match(/at: discriminator > propertyName\n +Value must be a string/);
                });

                it('must have the propertyName as a required property', () => {
                    const [ , err ] = Enforcer.v3_0.Schema({
                        type: 'object',
                        discriminator: {
                            propertyName: 'a'
                        }
                    });
                    expect(err).to.match(/Property "a" must be required because it is used as the discriminator property/);
                });

                it('allows a mapping', () => {
                    const [ , err ] = Enforcer.v3_0.Schema({
                        type: 'object',
                        properties: { a: { type: 'string' } },
                        discriminator: {
                            propertyName: 'a',
                            mapping: {
                                x: '#/components/X'
                            }
                        },
                        required: ['a']
                    });
                    expect(err).to.be.undefined;
                });

                it('requires each mapping value to be a string', () => {
                    const [ , err ] = Enforcer.v3_0.Schema({
                        type: 'object',
                        properties: { a: { type: 'string' } },
                        discriminator: {
                            propertyName: 'a',
                            mapping: {
                                x: 1
                            }
                        },
                        required: ['a']
                    });
                    expect(err).to.match(/> x\n +Value must be a string/);
                });

                it('requires mapping to resolve to schema instance', async () => {
                    const def = util.copy(allOf3Def);
                    def.components.schemas.Pet.discriminator.mapping.cow = '#/components/schemas/Cow';
                    await assert.willReject(() => Enforcer(def), /Reference cannot be resolved: #\/components\/schemas\/Cow/)
                });

                it('must match one of the anyOf options', async () => {
                    const def = util.copy(anyOfDef);
                    def.components.schemas.Pet.anyOf = [ { '$ref': '#/components/schemas/Cat' } ];
                    await assert.willReject(() => Enforcer(def), /Mapping reference must exist in anyOf/);
                });

                it('must match one of the oneOf options', async () => {
                    const def = util.copy(anyOfDef);
                    def.components.schemas.Pet.oneOf = [ { '$ref': '#/components/schemas/Cat' } ];
                    await assert.willReject(() => Enforcer(def), /Mapping reference must exist in oneOf/);
                });

            });

        });

        describe('enum', () => {

            it('must be an array', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', enum: 1 });
                expect(err).to.match(/Value must be an array/);
            });

            it('must validate against the schema', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', maximum: 5, enum: [ 10 ] });
                expect(err).to.match(/Expected number to be less than or equal to 5/);
            });

            describe('strings', () => {

                it('allows enum value with matching types', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', enum: ['a', 'b', 'c'] });
                    expect(err).to.be.undefined;
                });

                it('does not allow enum value with mismatched type', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', enum: [1] });
                    expect(err).to.match(/Value must be a string/);
                });

            });

            describe('numbers', () => {

                it('allows enum value with matching types', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', enum: [1] });
                    expect(err).to.be.undefined;
                });

                it('does not allow enum value with mismatched type', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', enum: ['a'] });
                    expect(err).to.match(/Value must be a number/);
                });

            });

            describe('dates', () => {

                it('allows enum value with matching types', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date', enum: ['2001-01-01'] });
                    expect(err).to.be.undefined;
                });

                it('parses enum values', () => {
                    const [ def ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date', enum: ['2001-01-01'] });
                    expect(def.enum[0]).to.deep.equal(new Date('2001-01-01'));
                });

                it('does not allow enum value with mismatched type', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date', enum: ['a'] });
                    expect(err).to.match(/Expected a date string of the format YYYY-MM-DD/);
                });
            });

            describe('object', () => {

                it('allows enum value with matching types', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({
                        type: 'object',
                        properties: {
                            a: { type: 'string' }
                        },
                        enum: [
                            { a: 'a' },
                            { a: 'b' }
                        ]
                    });
                    expect(err).to.be.undefined;
                });

                it('does not allow enum value with mismatched type', () => {
                    const [ , err ] = Enforcer.v2_0.Schema({
                        type: 'object',
                        properties: {
                            a: { type: 'string' }
                        },
                        enum: [{ a: 1 }]
                    });
                    expect(err).to.match(/Unable to deserialize value\s+at: a\s+Expected a string/);
                });

            });

        });

        describe('example', () => {

            it('can be a string', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'string',
                    example: 'hello'
                });
                expect(err).to.be.undefined;
            });

            it('warns of invalid value', () => {
                const [ , , warning ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    properties: {
                        a: { type: 'number' }
                    },
                    required: ['a', 'b'],
                    example: {
                        a: 'hello'
                    }
                });
                expect(warning).to.match(/Expected a number/);
            });

        });

        describe('format', () => {

            it('allows valid format', () => {
                const [ , err, warning ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date' });
                expect(err).to.be.undefined;
                expect(warning).to.be.undefined;
            });

            it('warns for unknown format', () => {
                const [ , err, warning ] = Enforcer.v2_0.Schema({ type: 'string', format: 'foo' });
                expect(err).to.be.undefined;
                expect(warning).to.match(/Non standard format used: foo/);
            });

        });

        describe('items', () => {

            it('is valid for arrays', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' } });
                expect(err).to.be.undefined;
            });

            it('is required for arrays', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array' });
                expect(err).to.match(/Missing required property: items/);
            });

            it('is not valid for non-arrays', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', items: { type: 'string' } });
                expect(err).to.match(/Property not allowed: items/);
            });

            it('cannot be a non object', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: 'string' });
                expect(err).to.match(/Value must be a plain object/);
            });

            it('traverses sub objects', () => {
                const [ def ] = Enforcer.v2_0.Schema({
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'date',
                        default: '2001-01-01',
                        enum: ['2001-01-01', '2001-01-02']
                    }
                });
                expect(def.items.default).to.deep.equal(new Date('2001-01-01'));
            });

        });

        describe('maximum and minimum', () => {

            it('allows maximum for number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', maximum: 5 });
                expect(err).to.be.undefined;
            });

            it('allows maximum for string date', () => {
                const [ def, err ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date', maximum: '2000-01-01' });
                expect(err).to.be.undefined;
                expect(def.maximum).to.be.instanceof(Date);
            });

            it('does not allow maximum for array', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', maximum: '2000-01-01' });
                expect(err).to.match(/Property not allowed: maximum/);
            });

            it('allows minimum for number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', minimum: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minimum below maximum', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', minimum: 0, maximum: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minimum at maximum', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', minimum: 5, maximum: 5 });
                expect(err).to.be.undefined;
            });

            it('does not allow exclusive minimum at maximum', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', minimum: 5, maximum: 5, exclusiveMinimum: true });
                expect(err).to.match(/Property "minimum" must be less than "maximum"/);
            });

            it('does not allow minimum above maximum', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', minimum: 6, maximum: 5 });
                expect(err).to.match(/Property "minimum" must be less than or equal to "maximum"/);
            });

            it('allow maximum and minimum for date format', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date', minimum: '2000-01-01', maximum: '2000-12-31' });
                expect(err).to.be.undefined;
            })

        });

        describe('maxItems and minItems', () => {

            it('allows maxItems for array', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' }, maxItems: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minItems for array', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' }, minItems: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minItems below maxItems', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' }, minItems: 0, maxItems: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minItems at maxItems', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 5 });
                expect(err).to.be.undefined;
            });

            it('does not allow minItems above maxItems', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' }, minItems: 6, maxItems: 5 });
                expect(err).to.match(/Property "minItems" must be less than or equal to "maxItems"/);
            });

            it('does not allow maxItems for number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', maxItems: 5 });
                expect(err).to.match(/Property not allowed: maxItems/);
            });

        });

        describe('maxLength and minLength', () => {

            it('allows maxLength for string', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', maxLength: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minLength for string', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', minLength: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minLength below maxLength', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', minLength: 0, maxLength: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minLength at maxLength', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', minLength: 5, maxLength: 5 });
                expect(err).to.be.undefined;
            });

            it('does not allow minLength above maxLength', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', minLength: 6, maxLength: 5 });
                expect(err).to.match(/Property "minLength" must be less than or equal to "maxLength"/);
            });

            it('does not allow maxLength for number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', maxLength: 5 });
                expect(err).to.match(/Property not allowed: maxLength/);
            });

        });

        describe('maxProperties and minProperties', () => {

            it('allows maxProperties for object', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', maxProperties: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minProperties for object', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', minProperties: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minProperties below maxProperties', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', minProperties: 0, maxProperties: 5 });
                expect(err).to.be.undefined;
            });

            it('allows minProperties at maxProperties', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', minProperties: 5, maxProperties: 5 });
                expect(err).to.be.undefined;
            });

            it('does not allow minProperties above maxProperties', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', minProperties: 6, maxProperties: 5 });
                expect(err).to.match(/Property "minProperties" must be less than or equal to "maxProperties"/);
            });

            it('does not allow maxProperties for number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', maxProperties: 5 });
                expect(err).to.match(/Property not allowed: maxProperties/);
            });

        });

        describe('multipleOf', () => {

            it('allows multipleOf for number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', multipleOf: 2 });
                expect(err).to.be.undefined;
            });

            it('does not allow multipleOf for string', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', multipleOf: 2 });
                expect(err).to.match(/Property not allowed: multipleOf/);
            });

        });

        describe('not', () => {

            it('is not allowed for v2', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ not: { type: 'string' } });
                expect(err).to.match(/Property not allowed: not/);
            });

            it('is allowed for v3', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ not: { type: 'string' } });
                expect(err).to.be.undefined;
            });

            it('validates sub schema', () => {
                const [ , err ] = Enforcer.v3_0.Schema({
                    not: { type: 'string', default: 1 }
                });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('oneOf', () => {

            it('is not allowed for v2', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ oneOf: [] });
                expect(err).to.match(/Property not allowed: oneOf/);
            });

            it('is allowed for v3', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ oneOf: [] });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ oneOf: {} });
                expect(err).to.match(/Value must be an array/);
            });

            it('validates items', () => {
                const [ , err ] = Enforcer.v3_0.Schema({
                    oneOf: [
                        { type: 'string', default: 1 }
                    ]
                });
                expect(err).to.match(/Value must be a string/);
            });

        });

        describe('pattern', () => {

            it('is allowed for type string', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', pattern: 'hello' });
                expect(err).to.be.undefined;
            });

            it('will deserialize value to regular expression', () => {
                const [ def ] = Enforcer.v2_0.Schema({ type: 'string', pattern: 'hello' });
                expect(def.pattern).to.be.instanceof(RegExp);
            });

            it('is not allowed for type boolean', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'boolean', pattern: 'hello' });
                expect(err).to.match(/Property not allowed: pattern/);
            });

        });

        describe('properties', () => {

            it('is valid for objects', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', properties: {} });
                expect(err).to.be.undefined;
            });

            it('is not valid for non-objects', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', properties: {} });
                expect(err).to.match(/Property not allowed: properties/);
            });

            it('is must be an object', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', properties: 'hello' });
                expect(err).to.match(/Value must be a plain object/);
            });

            it('validates items', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    properties: {
                        x: {
                            type: 'object',
                            properties: {
                                y: {
                                    type: 'boolean',
                                    format: 'date'
                                }
                            }
                        }
                    }
                });
                expect(err).to.match(/Property not allowed: format/);
            });

        });

        describe('readOnly', () => {

            it('is valid on properties within a schema', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    properties: {
                        a: {
                            type: 'string',
                            readOnly: true
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('is not valid on a schema', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    readOnly: true
                });
                expect(err).to.match(/Property not allowed: readOnly/);
            });

            it('should not be required', () => {
                const { warning } = Enforcer.v2_0.Schema({
                    type: 'object',
                    required: ['a'],
                    properties: {
                        a: {
                            type: 'string',
                            readOnly: true
                        }
                    }
                });
                expect(warning).to.match(/Property should not be marked as both read only and required/);
            });

        });

        describe('required', () => {

            it('is allowed for type object', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', required: ['hello'] });
                expect(err).to.be.undefined;
            });

            it('must be an array', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'object', required: 'hello' });
                expect(err).to.match(/Value must be an array/);
            });

            it('is not allowed for type boolean', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'boolean', required: ['hello'] });
                expect(err).to.match(/Property not allowed: required/);
            });

        });

        describe('uniqueItems', () => {

            it('is allowed if array', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' }, uniqueItems: true });
                expect(err).to.be.undefined;
            });

            it('must be a boolean', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'array', items: { type: 'string' }, uniqueItems: 'true' });
                expect(err).to.match(/must be a boolean/);
            });

            it('is not allowed if number', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'number', uniqueItems: false });
                expect(err).to.match(/Property not allowed: uniqueItems/);
            });

        });

        describe('writeOnly', () => {

            it('is not allowed in v2', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    properties: {
                        a: {
                            type: 'string',
                            writeOnly: true
                        }
                    }
                });
                expect(err).to.match(/Property not allowed: writeOnly/)
            });

            it('is valid on properties within a schema', () => {
                const [ , err ] = Enforcer.v3_0.Schema({
                    type: 'object',
                    properties: {
                        a: {
                            type: 'string',
                            writeOnly: true
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('is not valid on a schema', () => {
                const [ , err ] = Enforcer.v3_0.Schema({
                    type: 'object',
                    writeOnly: true
                });
                expect(err).to.match(/Property not allowed: writeOnly/);
            });

            it('should not allow readOnly and writeOnly', () => {
                const [ , err ]= Enforcer.v3_0.Schema({
                    type: 'object',
                    required: ['a'],
                    properties: {
                        a: {
                            type: 'string',
                            readOnly: true,
                            writeOnly: true
                        }
                    }
                });
                expect(err).to.match(/Cannot be marked as both readOnly and writeOnly/);
            });

        });

    });

    describe('deserialize', () => {

        describe('array', () => {

            it('deserialize each item in the array', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'array',
                    items: {type: 'string', format: 'date'}
                });
                const [value] = schema.deserialize(['2000-01-01']);
                expect(value).to.deep.equal([new Date('2000-01-01')]);
            });

        });

        describe('binary', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'binary'
                });
            });

            it('does not allow value true', () => {
                const [, err] = schema.deserialize(true);
                expect(err).to.match(/Expected a binary octet string/);
            });

            it('does not allow value false', () => {
                const [, err] = schema.deserialize(false);
                expect(err).to.match(/Expected a binary octet string/);
            });

            it('does not allow number', () => {
                const [, err] = schema.deserialize(5);
                expect(err).to.match(/Expected a binary octet string/);
            });

            it('does not allow non-binary octet string', () => {
                const [, err] = schema.deserialize('hello');
                expect(err).to.match(/Expected a binary octet string/);
            });

            it('allows binary octet string', () => {
                const [value] = schema.deserialize(('00001101'));
                expect(value).to.deep.equal(Buffer.from([13]));
            });

            it('allows buffer', () => {
                const buf = Buffer.from('\r');
                const [value] = schema.deserialize(buf);
                expect(value).to.deep.equal(Buffer.from([13]));
            });

            it('does not allow object', () => {
                const [, err] = schema.deserialize(Value.coerce({}));
                expect(err).to.match(/Expected a binary octet string/);
            });

            it('does not allow null', () => {
                const [, err] = schema.deserialize(Value.coerce(null));
                expect(err).to.match(/Expected a binary octet string/);
            });

        });

        describe('boolean', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({type: 'boolean'});
            });

            it('allows true', () => {
                const [value] = schema.deserialize(true);
                expect(value).to.be.true;
            });

            it('allows false', () => {
                const [value] = schema.deserialize(false);
                expect(value).to.be.false;
            });

            it('does not allow number', () => {
                const [, err] = schema.deserialize(1);
                expect(err).to.match(/Expected a boolean/);
            });

        });

        describe('byte', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'byte'
                });
            });

            it('does not allow true', () => {
                const [, err] = schema.deserialize(true);
                expect(err).to.match(/Expected a base64 string/);
            });

            it('does not allow false', () => {
                const [, err] = schema.deserialize(false);
                expect(err).to.match(/Expected a base64 string/);
            });

            it('does not allow number', () => {
                const [, err] = schema.deserialize(1);
                expect(err).to.match(/Expected a base64 string/);
            });

            it('does not allow string', () => {
                const [, err] = schema.deserialize('M');
                expect(err).to.match(/Expected a base64 string/);
            });

            it('allows buffer', () => {
                const [value] = schema.deserialize(Buffer.from('M'));
                expect(value).to.be.an.instanceof(Buffer);
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize(Value.coerce({}));
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [, err] = schema.deserialize(Value.coerce(null));
                expect(err).to.match(/Expected a base64 string/);
            });

        });

        describe('date', () => {
            const date = '2000-01-01';
            const iso = date + 'T00:00:00.000Z';
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'date'
                });
            });

            it('allows a valid date object', () => {
                const [value] = schema.deserialize(new Date(iso));
                expect(value.toISOString()).to.equal(iso);
            });

            it('allows a date string', () => {
                const [value] = schema.deserialize(date);
                expect(value).to.deep.equal(new Date(iso));
            });

            it('does not allow a date-time string', () => {
                const [,err] = schema.deserialize(iso);
                expect(err).to.match(/Expected a date string of the format YYYY-MM-DD/);
            });

            it('does not allow a number', () => {
                const [, err] = schema.deserialize(1);
                expect(err).to.match(/Expected a date string of the format YYYY-MM-DD/);
            });

            it('does not allow a boolean', () => {
                const [, err] = schema.deserialize(true);
                expect(err).to.match(/Expected a date string of the format YYYY-MM-DD/);
            });

            it('does not allow an object', () => {
                const [, err] = schema.deserialize({});
                expect(err).to.match(/Expected a date string of the format YYYY-MM-DD/);
            });

            it('does not allow null', () => {
                const [, err] = schema.deserialize(null);
                expect(err).to.match(/Expected a date string of the format YYYY-MM-DD/);
            });

        });

        describe('date-time', () => {
            const iso = '2000-01-01T00:00:00.000Z';
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'date-time'
                });
            });

            it('allows a valid date object', () => {
                const d = new Date(iso);
                const [value] = schema.deserialize(d);
                expect(value).to.equal(d);
            });

            it('does not allow a date string', () => {
                const [,err] = schema.deserialize(iso.substr(0, 10));
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ/);
            });

            it('allows a date-time string', () => {
                const [value] = schema.deserialize(iso);
                expect(value).to.deep.equal(new Date(iso));
            });

            it('does not allow a number', () => {
                const [, err] = schema.deserialize(1);
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ/);
            });

            it('does not allow a boolean', () => {
                const [, err] = schema.deserialize(Value.coerce(true));
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ/);
            });

            it('does not allow an object', () => {
                const [, err] = schema.deserialize(Value.coerce({}));
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ/);
            });

            it('does not allow null', () => {
                const [, err] = schema.deserialize(Value.coerce(null));
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ/);
            });

        });

        describe('integer', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({type: 'integer'});
            });

            it('allows integer', () => {
                const [value] = schema.deserialize(123);
                expect(value).to.equal(123);
            });

            it('does not allow decimal number', () => {
                const [, err] = schema.deserialize(123.7);
                expect(err).to.match(/Expected an integer/);
            });

            it('does not allow string integer', () => {
                const [, err] = schema.deserialize('123');
                expect(err).to.match(/Expected an integer/);
            });

            it('does not allow string decimal', () => {
                const [, err] = schema.deserialize('123.7');
                expect(err).to.match(/Expected an integer/);
            });

            it('does not allow date object', () => {
                const [, err] = schema.deserialize(new Date('2000-01-01T00:00:00.000Z'));
                expect(err).to.match(/Expected an integer/);
            });

            it('does not allow true', () => {
                const [, err] = schema.deserialize(true);
                expect(err).to.match(/Expected an integer/);
            });

            it('does not allow false', () => {
                const [, err] = schema.deserialize(false);
                expect(err).to.match(/Expected an integer/);
            });

            it('does not allow object', () => {
                const [, err] = schema.deserialize(Value.coerce({}));
                expect(err).to.match(/Expected an integer/);
            });

        });

        describe('number', () => {

            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({type: 'number'});
            });

            it('allows a number', () => {
                const [value] = schema.deserialize(123.7);
                expect(value).to.equal(123.7);
            });

            it('does not allow string number', () => {
                const [, err] = schema.deserialize('123.7');
                expect(err).to.match(/Expected a number/);
            });

            it('does not allow date object', () => {
                const [, err] = schema.deserialize(new Date('2000-01-01T00:00:00.000Z'));
                expect(err).to.match(/Expected a number/);
            });

            it('does not allow true', () => {
                const [, err] = schema.deserialize(true);
                expect(err).to.match(/Expected a number/);
            });

            it('does not allow false', () => {
                const [, err] = schema.deserialize(false);
                expect(err).to.match(/Expected a number/);
            });

            it('does not allow object', () => {
                const [, err] = schema.deserialize({});
                expect(err).to.match(/Expected a number/);
            });

        });

        describe('object', () => {

            it('can deserialize object properties', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'object',
                    properties: {
                        a: { type: 'string', format: 'date-time' },
                        b: {
                            type: 'object',
                            properties: {
                                c: { type: 'string', format: 'date' }
                            }
                        }
                    }
                });
                const dt = new Date();
                const [value] = schema.deserialize({a: dt.toISOString(), b: {c: dt.toISOString().substr(0, 10)}});
                expect(value).to.deep.equal({
                    a: dt,
                    b: {
                        c: new Date(dt.toISOString().substr(0, 10))
                    }
                });
            });

        });

    });

    describe('discriminate', () => {

        describe('anyOf', () => {

            it('pet can be Cat', async () => {
                const enforcer = await Enforcer(anyOfDef);
                const pet = enforcer.components.schemas.Pet;
                const schema = pet.discriminate({ name: 'Mittens', petType: 'Cat' });
                expect(schema).to.equal(enforcer.components.schemas.Cat);
            });

        });

        describe('oneOf', () => {

            it('pet can be Cat', async () => {
                const enforcer = await Enforcer(oneOfDef);
                const pet = enforcer.components.schemas.Pet;
                const schema = pet.discriminate({ name: 'Mittens', petType: 'Cat' });
                expect(schema).to.equal(enforcer.components.schemas.Cat);
            });

        });

        describe('polymorphism', () => {

            describe('v2', () => {

                const def = {
                    swagger: '2.0',
                    info: { title: '', version: '' },
                    definitions: {
                        Pet: schemas.Pet2,
                        Cat: {
                            allOf: [
                                { '$ref': '#/definitions/Pet' },
                                schemas.Cat
                            ]
                        },
                        Dog: {
                            allOf: [
                                { '$ref': '#/definitions/Pet' },
                                schemas.Dog
                            ]
                        }
                    }
                };

                let enforcer;
                before(async () => {
                    enforcer = await Enforcer(def);
                });

                it('pet can be Cat', () => {
                    const pet = enforcer.definitions.Pet;
                    const schema = pet.discriminate({ name: 'Mittens', petType: 'Cat' });
                    expect(schema).to.equal(enforcer.definitions.Cat);
                });

                it('pet can be Dog', () => {
                    const pet = enforcer.definitions.Pet;
                    const schema = pet.discriminate({ name: 'Fido', petType: 'Dog' });
                    expect(schema).to.equal(enforcer.definitions.Dog);
                });

                it('pet cannot be cat (case mismatch)', () => {
                    const pet = enforcer.definitions.Pet;
                    const schema = pet.discriminate({ name: 'Hopper', petType: 'cat' });
                    expect(schema).to.be.undefined;
                });

            });

            describe('v3', () => {
                let enforcer;
                before(async () => {
                    enforcer = await Enforcer(allOf3Def);
                });

                it('pet can be Cat', () => {
                    const pet = enforcer.components.schemas.Pet;
                    const schema = pet.discriminate({ name: 'Mittens', petType: 'Cat' });
                    expect(schema).to.equal(enforcer.components.schemas.Cat);
                });

                it('pet can be cat (using mapping)', () => {
                    const pet = enforcer.components.schemas.Pet;
                    const schema = pet.discriminate({ name: 'Mittens', petType: 'cat' });
                    expect(schema).to.equal(enforcer.components.schemas.Cat);
                });

                it('pet can be Dog', () => {
                    const pet = enforcer.components.schemas.Pet;
                    const schema = pet.discriminate({ name: 'Mittens', petType: 'Dog' });
                    expect(schema).to.equal(enforcer.components.schemas.Dog);
                });

                it('pet can be dog (using mapping)', () => {
                    const pet = enforcer.components.schemas.Pet;
                    const schema = pet.discriminate({ name: 'Mittens', petType: 'dog' });
                    expect(schema).to.equal(enforcer.components.schemas.Dog);
                });

            });

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
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'array',
                    items: {type: 'string', format: 'date'}
                });
                const [value] = schema.serialize([new Date('2000-01-01')]);
                expect(value).to.deep.equal(['2000-01-01']);
            });

        });

        describe('binary', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'binary'
                });
            });

            it('does not allow value true', () => {
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow value false', () => {
                const [, err] = schema.serialize(false);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow number', () => {
                const [, err] = schema.serialize(5);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows buffer', () => {
                const buf = Buffer.from('\r');
                const [value] = schema.serialize(buf);
                expect(value).to.equal('00001101');
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize(Value.coerce({}));
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(Value.coerce(null));
                expect(err).to.match(/Expected a Buffer instance/);
            });

        });

        describe('boolean', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({type: 'boolean'});
            });

            it('allows true', () => {
                const [value] = schema.serialize(true);
                expect(value).to.be.true;
            });

            it('allows false', () => {
                const [value] = schema.serialize(false);
                expect(value).to.be.false;
            });

            it('does not allow 1', () => {
                const [, err] = schema.serialize(1);
                expect(err).to.match(/Unable to serialize to boolean/);
            });

            it('does not allow 0', () => {
                const [, err] = schema.serialize(0);
                expect(err).to.match(/Unable to serialize to boolean/);
            });

            it('does not allow string', () => {
                const [, err] = schema.serialize('hello');
                expect(err).to.match(/Unable to serialize to boolean/);
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize({});
                expect(err).to.match(/Unable to serialize to boolean/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(null);
                expect(err).to.match(/Unable to serialize to boolean/);
            });

        });

        describe('byte', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'byte'
                });
            });

            it('does not allow true', () => {
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow false', () => {
                const [, err] = schema.serialize(false);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow number', () => {
                const [, err] = schema.serialize(1);
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow string', () => {
                const [, err] = schema.serialize('M');
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('allows buffer', () => {
                const [value] = schema.serialize(Buffer.from('M'));
                expect(value).to.equal('TQ==');
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize(Value.coerce({}));
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(Value.coerce(null));
                expect(err).to.match(/Expected a Buffer instance/);
            });

        });

        describe('date', () => {
            const date = '2000-01-01';
            const iso = date + 'T00:00:00.000Z';
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'date'
                });
            });

            it('allows a valid date object', () => {
                const [value] = schema.serialize(new Date(iso));
                expect(value).to.equal(date);
            });

            it('does not allow an invalid date object', () => {
                const [, err] = schema.serialize(new Date('hello'));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('allows a date string', () => {
                const [value] = schema.serialize(date);
                expect(value).to.equal(date);
            });

            it('allows a date-time string', () => {
                const [value] = schema.serialize(iso);
                expect(value).to.equal(date);
            });

            it('does not allow a number', () => {
                const [, err] = schema.serialize(1);
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow a boolean', () => {
                const [, err] = schema.serialize(Value.coerce(true));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow an object', () => {
                const [, err] = schema.serialize(Value.coerce({}));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(Value.coerce(null));
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

        });

        describe('date-time', () => {
            const iso = '2000-01-01T00:00:00.000Z';
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'date-time'
                });
            });

            it('allows a valid date object', () => {
                const [value] = schema.serialize(new Date(iso));
                expect(value).to.equal(iso);
            });

            it('does not allow an invalid date object', () => {
                const [, err] = schema.serialize(new Date('hello'));
                expect(err).to.match(/Expected a valid Date instance or an ISO date formatted string/);
            });

            it('allows a date string', () => {
                const [value] = schema.serialize(iso.substr(0, 10));
                expect(value).to.equal(iso);
            });

            it('allows a date-time string', () => {
                const [value] = schema.serialize(iso);
                expect(value).to.equal(iso);
            });

            it('does not allow a number', () => {
                const [, err] = schema.serialize(1);
                expect(err).to.match(/Expected a valid Date instance or an ISO date formatted string/);
            });

            it('does not allow a boolean', () => {
                const [, err] = schema.serialize(Value.coerce(true));
                expect(err).to.match(/Expected a valid Date instance or an ISO date formatted string/);
            });

            it('does not allow an object', () => {
                const [, err] = schema.serialize(Value.coerce({}));
                expect(err).to.match(/Expected a valid Date instance or an ISO date formatted string/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(Value.coerce(null));
                expect(err).to.match(/Expected a valid Date instance or an ISO date formatted string/);
            });

        });

        describe('integer', () => {
            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({type: 'integer'});
            });

            it('integer', () => {
                const [value] = schema.serialize(123);
                expect(value).to.equal(123);
            });

            it('does not allow decimal number', () => {
                const [, err] = schema.serialize(123.7);
                expect(err).to.match(/Unable to serialize to integer/);
            });

            it('does not allow string integer', () => {
                const [, err] = schema.serialize('123');
                expect(err).to.match(/Unable to serialize to integer/);
            });

            it('does not allow string decimal', () => {
                const [, err] = schema.serialize('123.7');
                expect(err).to.match(/Unable to serialize to integer/);
            });

            it('does not allow date object', () => {
                const [, err] = schema.serialize(new Date('2000-01-01T00:00:00.000Z'));
                expect(err).to.match(/Unable to serialize to integer/);
            });

            it('does not allow true', () => {
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Unable to serialize to integer/);
            });

            it('does not allow false', () => {
                const [, err] = schema.serialize(false);
                expect(err).to.match(/Unable to serialize to integer/);
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize(Value.coerce({}));
                expect(err).to.match(/Unable to serialize to integer/);
            });

        });

        describe('number', () => {

            let schema;

            before(() => {
                [schema] = Enforcer.v3_0.Schema({type: 'number'});
            });

            it('allows a number', () => {
                const [value] = schema.serialize(123.7);
                expect(value).to.equal(123.7);
            });

            it('does not allow string number', () => {
                const [, err] = schema.serialize('123.7');
                expect(err).to.match(/Unable to serialize to number/);
            });

            it('does not allow date object', () => {
                const [, err] = schema.serialize(new Date('2000-01-01T00:00:00.000Z'));
                expect(err).to.match(/Unable to serialize to number/);
            });

            it('does not allow true', () => {
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Unable to serialize to number/);
            });

            it('does not allow false', () => {
                const [, err] = schema.serialize(false);
                expect(err).to.match(/Unable to serialize to number/);
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize(Value.coerce({}));
                expect(err).to.match(/Unable to serialize to number/);
            });

        });

        describe('object', () => {

            it('can serialize object properties', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'object',
                    properties: {
                        a: {type: 'string', format: 'date-time'},
                        b: {
                            type: 'object',
                            properties: {
                                c: {type: 'string', format: 'date'}
                            }
                        }
                    }
                });
                const dt = new Date();
                const [value] = schema.serialize({a: dt, b: {c: dt}});
                expect(value).to.deep.equal({
                    a: dt.toISOString(),
                    b: {
                        c: dt.toISOString().substr(0, 10)
                    }
                });
            });

        });

    });

    describe('validate', () => {

        it('todo', () => {
            throw Error('TODO');
        });

    });

});