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
const assert        = require('../src/assert');
const Enforcer      = require('../index');
const expect        = require('chai').expect;
const path          = require('path');
const util          = require('../src/util');
const Value         = require('../src/schema/value');

describe('definition/schema', () => {
    const schemas = {
        Cat: {
            type: 'object',
            properties: {
                birthDate: { type: 'string' },
                huntingSkill: { type: 'string' },
            }
        },
        Dog: {
            type: 'object',
            properties: {
                birthDate: { type: 'string', format: 'date' },
                packSize: { type: 'integer', minimum: 1 }
            }
        },
        Pet2: {
            type: 'object',
            required: ['petType'],
            properties: {
                petType: { type: 'string'}
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
        paths: {},
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
        paths: {},
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
    const allOfCircular = {
        openapi: '3.0.0',
        info: {title: '', version: ''},
        paths: {
            '/MatryoshkaSouvenir': {
                get: {
                    responses: {
                        200: {
                            description: 'Returns MatryoshkaSouvenir',
                            content: {
                                'application/json': {
                                    schema: {$ref: '#/components/schemas/MatryoshkaSouvenir'}
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                GiftCard: {
                    properties: {text: {type: 'string'}},
                    type: 'object'
                },
                Matryoshka: {
                    properties: {matryoshka: {'$ref': '#/components/schemas/Matryoshka'}},
                    type: 'object'
                },
                MatryoshkaSouvenir: {
                    allOf: [
                        {'$ref': '#/components/schemas/GiftCard'},
                        {'$ref': '#/components/schemas/Matryoshka'}
                    ]
                }
            }
        }
    };
    const anyOfDef = {
        openapi: '3.0.0',
        info: { title: '', version: '' },
        paths: {},
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
        paths: {},
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

            it('will warn of the missing "type" property', () => {
                const [ , err, warn ] = Enforcer.v2_0.Schema({});
                expect(err).to.be.undefined;
                expect(warn).to.match(/Schemas with an indeterminable type/);
            });

            it('will allow escalation of the missing "type" property', async () => {
                const def = {
                    openapi: '3.0.0',
                    info: { title: '', version: '' },
                    paths: {
                        '/': {
                            get: {
                                responses: {
                                    '200': {
                                        description: 'OK',
                                        content: {
                                            'application/json': {
                                                schema: {}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                const [ , err, warn ] = await Enforcer(def, { fullResult: true, componentOptions: { exceptionEscalateCodes: ['WSCH005'] }})
                expect(err).to.match(/Schemas with an indeterminable type/);
                expect(warn).to.be.undefined;
            });

            it('requires a valid type', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'foo' });
                expect(err).to.match(/Value must be one of:/);
            });

            it('allows top level schema to be of type "file" for v2', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'file' });
                expect(err).to.be.undefined;
            });

            it('does not allow nested schema to be of type "file" for nested schema', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    properties: {
                        file: { type: 'file' }
                    }
                });
                expect(err).to.match(/at: properties > file > type\s+Value can only be "file" for non-nested schemas/);
            });

            it('does not allow top level schema to be of type "file" for v3', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ type: 'file' });
                expect(err).to.match(/at: type\s+Value must be one of/);
            });

            // it('type "file" accounts for multi-use schema', () => {
            //     // TODO
            //     // The reason this test fails is because the context in which the definition is
            //     // valid changes based on position. The solution requires multiple fixes:
            //     //   1. Use a chain instead of parent property. The parent issue is that no node
            //     //      can have multiple parents which definitely does occur
            //     //   2. Recognize a circular loop not only by its existence in the node map but
            //     //      by it's existence within the chain array as well as its repeated position
            //     //      within a relevant context. To identify what amount of context is relevant
            //     //      a new property can be used to identify how deep of a context is relevant.
            //     const def = {
            //         swagger: '2.0',
            //         info: { title: '', version: '' },
            //         consumes: ['application/x-www-form-urlencoded'],
            //         paths: {
            //             '/': {
            //                 post: {
            //                     parameters: {
            //
            //                     }
            //                 }
            //             }
            //         },
            //         definitions: {
            //             File: { type: 'file' },
            //             Folder: {
            //                 type: 'array'
            //             }
            //         }
            //     };
            //     def.definitions.Folder.items = def.definitions.File;
            //     const [ , err ] = Enforcer.v2_0.Swagger(def);
            //     expect(err).to.match(/at definitions > Folder > items\s+asdfasdf/);
            //     expect(err.count).to.equal(1);
            // })

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
                                type: 'taco'
                            }
                        }
                    }
                });
                expect(err).to.match(/at: additionalProperties > properties > x > type\s+Value must be one of/);
            });

        });

        describe('allOf', () => {

            it('it does not need a type specified', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ allOf: [ { type: 'string' } ] });
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

            it('validates that items are of the same type', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    allOf: [{ type: 'string' }, { type: 'number' }]
                });
                expect(err).to.match(/at: allOf\s +All items must be of the same type/);
            });

            it('validates that items are of the same format', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    allOf: [{ type: 'string', format: 'date' }, { type: 'string', format: 'date-time' }]
                });
                expect(err).to.match(/at: allOf\s +All items must be of the same format/);
            });

            it('allows missing formats', () => {
                const [ , err ] = Enforcer.v2_0.Schema({
                    allOf: [
                        { type: 'string', format: 'date' },
                        { type: 'string' }
                    ]
                });
                expect(err).to.equal(undefined);
            });

            it('allows circular references at schemas', async () => {
                await assert.wontReject(() => Enforcer(util.copy(allOfCircular)), /Maximum call stack size exceeded/);
            });

            describe('merges', () => {

                it('chooses first default', () => {
                    const [ schema ] = Enforcer.v2_0.Schema({
                        allOf: [
                            { type: 'string' },
                            { type: 'string', default: 'a' },
                            { type: 'string', default: 'b' },
                            { type: 'string' },
                        ]
                    });
                    const [ value, , warning ] = schema.allOfMerged;
                    expect(value.default).to.equal('a');
                    expect(warning).to.match(/Using first default/);
                });

                describe('enum', () => {

                    it('will limit enum to matching set', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'string', enum: ['a', 'b', 'c', 'd'] },
                                { type: 'string', enum: ['b', 'c'] },
                                { type: 'string' }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.enum).to.deep.equal(['b', 'c']);
                    });

                    it('will limit enum to matching set for dates', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'string', format: 'date', enum: ['2000-01-01', '2000-01-02', '2000-01-03', '2000-01-04'] },
                                { type: 'string', format: 'date', enum: ['2000-01-02', '2000-01-03'] },
                                { type: 'string' }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.format).to.equal('date');
                        expect(value.enum).to.deep.equal([new Date('2000-01-02'), new Date('2000-01-03')]);
                    });

                    it('will produce an error if no enums overlap', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'string', enum: ['a', 'b', 'c', 'd'] },
                                { type: 'string', enum: ['e', 'f'] },
                                { type: 'string' }
                            ]
                        });
                        const [ , err ] = schema.allOfMerged;
                        expect(err).to.match(/Enum values across schemas have nothing in common/);
                    });

                });

                it('chooses first example', () => {
                    const [ schema ] = Enforcer.v2_0.Schema({
                        allOf: [
                            { type: 'string' },
                            { type: 'string', example: 'a' },
                            { type: 'string', example: 'b' },
                            { type: 'string' },
                        ]
                    });
                    const [ value, , warning ] = schema.allOfMerged;
                    expect(value.example).to.equal('a');
                    expect(warning).to.match(/Using first example/);
                });

                describe('array', () => {

                    it('merges maxItems', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'array', items: { type: 'string' }, maxItems: 5 },
                                { type: 'array', items: { type: 'string' }, maxItems: 2 },
                                { type: 'array', items: { type: 'string' } },
                                { type: 'array', items: { type: 'string' }, maxItems: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.maxItems).to.equal(2);
                    });

                    it('merges minItems', () => {
                        const items = { type: 'string' };
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'array', items, minItems: 5 },
                                { type: 'array', items, minItems: 2 },
                                { type: 'array', items },
                                { type: 'array', items, minItems: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.minItems).to.equal(8);
                    });

                    it('merges uniqueItems', () => {
                        const items = { type: 'string' };
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'array', items },
                                { type: 'array', items, uniqueItems: true },
                                { type: 'array', items },
                                { type: 'array', items }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.uniqueItems).to.equal(true);
                    });

                    it('merges items', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                {
                                    type: 'array',
                                    items: { type: 'string' }
                                },
                                {
                                    type: 'array',
                                    items: { type: 'string', maxLength: 80 }
                                }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.items.type).to.equal('string');
                        expect(value.items.maxLength).to.equal(80);
                    });

                });

                describe('numeric', () => {

                    it('merges maximum', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'integer', maximum: 5 },
                                { type: 'integer', maximum: 2 },
                                { type: 'integer' },
                                { type: 'integer', maximum: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.maximum).to.equal(2);
                    });

                    it('merges maximum date string', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'string', format: 'date', maximum: '2000-01-05' },
                                { type: 'string', format: 'date', maximum: '2000-01-02' },
                                { type: 'string', format: 'date' },
                                { type: 'string', format: 'date', maximum: '2000-01-08' }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.maximum.toISOString().substring(0, 10)).to.equal('2000-01-02');
                    });

                    it('merges minimum', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'integer', minimum: 5 },
                                { type: 'integer', minimum: 2 },
                                { type: 'integer' },
                                { type: 'integer', minimum: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.minimum).to.equal(8);
                    });

                    it('merges exclusive maximum (ignored)', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'integer', maximum: 5, exclusiveMaximum: true },
                                { type: 'integer', maximum: 2 },
                                { type: 'integer' },
                                { type: 'integer', maximum: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.maximum).to.equal(2);
                        expect(value.exclusiveMaximum).not.to.equal(true)
                    });

                    it('merges exclusive maximum (applied)', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'integer', maximum: 5 },
                                { type: 'integer', maximum: 2, exclusiveMaximum: true },
                                { type: 'integer' },
                                { type: 'integer', maximum: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.maximum).to.equal(2);
                        expect(value.exclusiveMaximum).to.equal(true)
                    });

                    it('merges exclusive minimum (ignored)', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'integer', minimum: 5, exclusiveMinimum: true },
                                { type: 'integer', minimum: 2 },
                                { type: 'integer' },
                                { type: 'integer', minimum: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.minimum).to.equal(8);
                        expect(value.exclusiveMinimum).not.to.equal(true)
                    });

                    it('merges exclusive minimum (applied)', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'integer', minimum: 5 },
                                { type: 'integer', minimum: 2 },
                                { type: 'integer' },
                                { type: 'integer', minimum: 8, exclusiveMinimum: true }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.minimum).to.equal(8);
                        expect(value.exclusiveMinimum).to.equal(true)
                    });

                    it('merges multiple of number', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'integer', multipleOf: 4 },
                                { type: 'integer', multipleOf: 2 },
                                { type: 'integer' },
                                { type: 'integer', multipleOf: 6 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.multipleOf).to.equal(12);
                    });

                });

                describe('string', () => {

                    it('merges maxLength', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'string', maxLength: 5 },
                                { type: 'string', maxLength: 2 },
                                { type: 'string' },
                                { type: 'string', maxLength: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.maxLength).to.equal(2);
                    });

                    it('merges minLength', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'string', minLength: 5 },
                                { type: 'string', minLength: 2 },
                                { type: 'string' },
                                { type: 'string', minLength: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.minLength).to.equal(8);
                    });

                });

                describe('object', () => {

                    describe('additionalProperties', () => {

                        it('merges true and object to object', () => {
                            const [ schema ] = Enforcer.v2_0.Schema({
                                allOf: [
                                    {
                                        type: 'object',
                                        additionalProperties: true
                                    },
                                    {
                                        type: 'object',
                                        additionalProperties: {
                                            type: 'string'
                                        }
                                    }
                                ]
                            });
                            const [ value ] = schema.allOfMerged;
                            expect(value.additionalProperties.toObject()).to.deep.equal({ type: 'string' });
                        });

                        it('merges two objects', () => {
                            const [ schema ] = Enforcer.v2_0.Schema({
                                allOf: [
                                    {
                                        type: 'object',
                                        additionalProperties: {
                                            type: 'number',
                                            minimum: 0
                                        }
                                    },
                                    {
                                        type: 'object',
                                        additionalProperties: {
                                            type: 'number',
                                            maximum: 10
                                        }
                                    }
                                ]
                            });
                            const [ value ] = schema.allOfMerged;
                            const additional = value.additionalProperties;
                            expect(additional.type).to.equal('number');
                            expect(additional.maximum).to.equal(10);
                            expect(additional.minimum).to.equal(0);
                        });

                        it('cannot merges false and true', () => {
                            const [ schema ] = Enforcer.v2_0.Schema({
                                allOf: [
                                    {
                                        type: 'object',
                                        additionalProperties: false
                                    },
                                    {
                                        type: 'object',
                                        additionalProperties: true
                                    }
                                ]
                            });
                            const [ , err ] = schema.allOfMerged;
                            expect(err).to.match(/Conflict with additionalProperties/);
                        });

                        it('cannot merges false and object', () => {
                            const [ schema ] = Enforcer.v2_0.Schema({
                                allOf: [
                                    {
                                        type: 'object',
                                        additionalProperties: false
                                    },
                                    {
                                        type: 'object',
                                        additionalProperties: {
                                            type: 'string'
                                        }
                                    }
                                ]
                            });
                            const [ , err ] = schema.allOfMerged;
                            expect(err).to.match(/Conflict with additionalProperties/);
                        });

                    });

                    it('merges properties with the same name', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        a: { type: 'string', maxLength: 20 },
                                        c: { type: 'number', minimum: 0 }
                                    }
                                },
                                {
                                    type: 'object',
                                    properties: {
                                        a: { type: 'string', minLength: 10 },
                                        b: { type: 'string', format: 'date' }
                                    }
                                },
                                {
                                    type: 'object',
                                    properties: {
                                        c: { type: 'number', maximum: 10 }
                                    }
                                },
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        const properties = value.properties;
                        expect(properties.a.type).to.equal('string');
                        expect(properties.a.minLength).to.equal(10);
                        expect(properties.a.maxLength).to.equal(20);

                        expect(properties.b.type).to.equal('string');
                        expect(properties.b.format).to.equal('date');

                        expect(properties.c.type).to.equal('number');
                        expect(properties.c.minimum).to.equal(0);
                        expect(properties.c.maximum).to.equal(10);
                    });

                    it('required property conflict tends to true', () => {
                        const properties = {
                            a: { type: 'string' },
                            b: { type: 'string' },
                            c: { type: 'string' },
                            d: { type: 'string' }
                        };
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'object', properties, required: ['a'] },
                                { type: 'object', properties },
                                { type: 'object' },
                                { type: 'object', properties, required: ['b', 'c'] }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.required).to.deep.equal(['a', 'b', 'c']);
                    });

                    it('merges maxProperties', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'object', maxProperties: 5 },
                                { type: 'object', maxProperties: 2 },
                                { type: 'object' },
                                { type: 'object', maxProperties: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.maxProperties).to.equal(2);
                    });

                    it('merges minProperties', () => {
                        const [ schema ] = Enforcer.v2_0.Schema({
                            allOf: [
                                { type: 'object', minProperties: 5 },
                                { type: 'object', minProperties: 2 },
                                { type: 'object' },
                                { type: 'object', minProperties: 8 }
                            ]
                        });
                        const [ value ] = schema.allOfMerged;
                        expect(value.minProperties).to.equal(8);
                    });

                });

                it('handles nested allOf', () => {
                    const [ schema ] = Enforcer.v2_0.Schema({
                        allOf: [
                            {
                                allOf: [
                                    { type: 'number' },
                                    { type: 'number', minimum: 0 }
                                ]
                            },
                            {
                                allOf: [
                                    { type: 'number', maximum: 10 },
                                    { type: 'number', multipleOf: 2.5 }
                                ]
                            },
                            { type: 'number', multipleOf: 5 }
                        ]
                    });
                    const [ value ] = schema.allOfMerged;
                    expect(value.type).to.equal('number');
                    expect(value.minimum).to.equal(0);
                    expect(value.maximum).to.equal(10);
                    expect(value.multipleOf).to.equal(5);
                });

                it('merges multiple not values', () => {
                    const [ schema ] = Enforcer.v3_0.Schema({
                        allOf: [
                            {
                                not: { type: 'string', minLength: 5 }
                            },
                            {
                                not: { type: 'string', maxLength: 10 }
                            }
                        ]
                    });
                    const [ value ] = schema.allOfMerged;
                    expect(value.not.type).to.equal('string');
                    expect(value.not.maxLength).to.equal(10);
                    expect(value.not.minLength).to.equal(5);
                });

            })

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

            it('can allow null if x-nullable', () => {
                const [, err] = Enforcer.v2_0.Schema({
                    type: 'string',
                    'x-nullable': true,
                    default: null
                });
                expect(err).to.be.undefined;
            });

            it('can allow null if nullable', () => {
                const [, err] = Enforcer.v3_0.Schema({
                    type: 'string',
                    nullable: true,
                    default: null
                });
                expect(err).to.be.undefined;
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

                describe('discriminator examples', function () {

                    it('will deserialize a valid discriminator example', async () => {
                        Enforcer.config.examplesWarnAdditionalProperty = false
                        const options = {
                            fullResult: true,
                            componentOptions: {
                                exceptionSkipCodes: ['WPAS002']
                            }
                        };
                        const def = util.copy(allOf3Def);
                        def.components.schemas.Cat.allOf[1].properties.birthDate.format = 'date'
                        def.components.schemas.Pet.example = {
                            petType: 'cat',
                            birthDate: '2000-01-01',
                            huntingSkill: 'stealth'
                        };
                        const [ value, error, warning ] = await Enforcer(def, options)
                        expect(error).to.equal(undefined)
                        expect(warning).to.equal(undefined)
                        expect(value.components.schemas.Pet.example).to.deep.equal({
                            petType: 'cat',
                            birthDate: new Date('2000-01-01'),
                            huntingSkill: 'stealth'
                        })

                        const def2 = util.copy(allOf3Def);
                        def2.components.schemas.Pet.example = {
                            petType: 'cat',
                            birthDate: 25,
                            huntingSkill: 'stealth'
                        };
                        const result2 = await Enforcer(def2, options)
                        expect(result2.warning).to.match(/Expected a string\. Received: 25/i)
                    });

                    it('will warn of an invalid discriminator example', async () => {
                        const options = {
                            fullResult: true,
                            componentOptions: {
                                exceptionSkipCodes: ['WPAS002']
                            }
                        };
                        const def = util.copy(allOf3Def);
                        def.components.schemas.Pet.example = {
                            petType: 'cat',
                            birthDate: 25,
                            huntingSkill: 'stealth'
                        };
                        const [ , , warning ] = await Enforcer(def, options)
                        expect(warning).to.match(/Expected a string\. Received: 25/i)
                    });
                });

                it('requires mapping to resolve to schema instance', async () => {
                    const def = util.copy(allOf3Def);
                    const options = {
                        componentOptions: {
                            exceptionSkipCodes: ['WPAS002']
                        }
                    };
                    def.components.schemas.Pet.discriminator.mapping.cow = '#/components/schemas/Cow';
                    await assert.willReject(() => Enforcer(def, options), /Reference cannot be resolved: #\/components\/schemas\/Cow/)
                });

                it('properly maps external references using the new ref parser', async () => {
                    Enforcer.config.useNewRefParser = true;
                    try {
                        const docPath = path.resolve(__dirname, '..', 'test-resources', 'discriminator-mapping', 'openapi.yml');
                        const [ openapi, err ] = await Enforcer(docPath, {fullResult: true});
                        expect(err).to.equal(undefined);

                        const catSchema = openapi.paths['/cats'].get.responses[200].content['application/json'].schema;
                        const petSchema = openapi.paths['/pets'].get.responses[200].content['application/json'].schema;
                        expect(catSchema).to.equal(petSchema.discriminator.mapping.cat);
                        expect(catSchema).to.equal(petSchema.oneOf[0]);
                        expect(petSchema.oneOf[1]).to.equal(petSchema.discriminator.mapping.dog);
                        Enforcer.config.useNewRefParser = false;
                    } catch (err) {
                        Enforcer.config.useNewRefParser = false;
                        throw err;
                    }
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

            it('can allow null if x-nullable', () => {
                const [, err] = Enforcer.v2_0.Schema({
                    type: 'string',
                    'x-nullable': true,
                    enum: ['a', 'b', null]
                });
                expect(err).to.be.undefined;
            });

            it('can allow null if nullable', () => {
                const [, err] = Enforcer.v3_0.Schema({
                    type: 'string',
                    nullable: true,
                    enum: ['a', 'b', null]
                });
                expect(err).to.be.undefined;
            });

            it('cannot allow null if not nullable and not x-nullable', () => {
                const [, err] = Enforcer.v3_0.Schema({
                    type: 'string',
                    enum: ['a', 'b', null]
                });
                expect(err).to.match(/Value must be a string. Received: null/);
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

            it('can be a nested object', () => {
                const [ , err, warning ] = Enforcer.v2_0.Schema({
                    type: "object",
                    required: [ "x" ],
                    properties: {
                        x: { type: "object" }
                    },
                    default: {
                        x: {}
                    }
                });
                expect(err).to.be.undefined;
                expect(warning).to.be.undefined;
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

            it('warns of additional properties value', () => {
                Enforcer.config.examplesWarnAdditionalProperty = true
                const [ , , warning ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    properties: {
                        a: { type: 'number' }
                    },
                    example: {
                        b: 5
                    }
                });
                expect(warning).to.match(/Property is an additional property/);
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
                expect(warning).to.match(/at: format\s+Non standard format "foo" used for type "string"/);
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

        describe('nullable', () => {

            it('is not allowed for v2', () => {
                const [ , err ] = Enforcer.v2_0.Schema({ type: 'string', nullable: true });
                expect(err).to.match(/Property not allowed: nullable/);
            });

            it('is allowed for v3', () => {
                const [ , err ] = Enforcer.v3_0.Schema({ type: 'string', nullable: true });
                expect(err).to.be.undefined;
            });

        });

        describe('oneOf', () => {

            it('it does not screw up value when deserialize example', () => {
                const [ , err, warn ] = Enforcer.v3_0.Schema({
                    type: 'object',
                    required: ['f'],
                    properties: {
                        'f': {
                            type: 'array',
                            items: {
                                oneOf: [
                                    {
                                        type: 'object',
                                        required: ['n', 'n1', 'v'],
                                        properties: {
                                            n: {
                                                type: 'string',
                                                enum: ['f1']
                                            },
                                            n1: {
                                                type: 'string',
                                            },
                                            v: {
                                                type: 'array',
                                                items: {
                                                    type: 'string'
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: 'object',
                                        required: ['n', 'n1', 'v'],
                                        properties: {
                                            n: {
                                                type: 'string',
                                                enum: ['f2']
                                            },
                                            n1: {
                                                type: 'number',
                                            },
                                            v: {
                                                type: 'array',
                                                items: {
                                                    type: 'boolean'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    example: {
                        'f': [
                            {
                                n: 'f1',
                                n1: "sdfs",
                                v: ['one', 'two']
                            }
                        ]
                    }
                });
                expect(err).to.be.undefined;
                expect(warn).to.be.undefined;
            });

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
                                    type: 'taco'
                                }
                            }
                        }
                    }
                });
                expect(err).to.match(/at: properties > x > properties > y > type\s+Value must be one of/);
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

            it('must be included in defined property or allowed through additional properties', () => {
                const def = {
                    type: 'object',
                    required: ['a', 'd'],
                    additionalProperties: false,
                    properties: {
                        a: { type: 'number' },
                    }
                };
                const [ , err ] = Enforcer.v3_0.Schema(def);
                expect(err).to.match(/at: required > d\s+Property is listed as required but is not defined in the schema properties and additional properties are not allowed/);
                expect(err.count).to.equal(1);
            });

            it('will warn if additionalProperties are allowed but required property is not found in listed properties', () => {
                const def = {
                    type: 'object',
                    required: ['a', 'd'],
                    additionalProperties: true,
                    properties: {
                        a: { type: 'number' },
                    }
                };
                const [ , err, warn ] = Enforcer.v3_0.Schema(def);
                expect(err).to.equal(undefined);
                expect(warn).to.match(/Required property not specified as a property/);
            });

            it('can ignore warnings for unspecified required additional properties', () => {
                const def = {
                    type: 'object',
                    required: ['a', 'd'],
                    additionalProperties: true,
                    properties: {
                        a: { type: 'number' },
                    }
                };
                const [ , err, warn ] = Enforcer.v3_0.Schema(def, null, { exceptionSkipCodes: ['WSCH007'] });
                expect(err).to.equal(undefined);
                expect(warn).to.equal(undefined);
            });

            it('can escalate warnings for unspecified required additional properties', () => {
                const def = {
                    type: 'object',
                    required: ['a', 'd'],
                    additionalProperties: true,
                    properties: {
                        a: { type: 'number' },
                    }
                };
                const [ , err ] = Enforcer.v3_0.Schema(def, null, { exceptionEscalateCodes: ['WSCH007'] });
                expect(err).to.match(/Required property not specified as a property/);
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

        describe('nullable', () => {

            it('skips deserialization for null nullable values', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    nullable: true
                });
                const [value] = schema.deserialize(null);
                expect(value).to.equal(null);
            });

        });

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
                const [, err] = schema.deserialize({});
                expect(err).to.match(/Expected a binary octet string/);
            });

            it('does not allow null', () => {
                const [, err] = schema.deserialize(null);
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

            it('does allow number if not strict', () => {
                const [value, err] = schema.deserialize(1, { strict: false });
                expect(value).to.equal(true);
                expect(err).to.equal(undefined);
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
                const [, err] = schema.serialize({});
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [, err] = schema.deserialize(null);
                expect(err).to.match(/Expected a base64 string/);
            });

            it('does allow line returns', () => {
                const [value] = schema.deserialize("TQ\n==\n");
                expect(value).to.be.an.instanceof(Buffer);
            });

            it('does allow spaces and tabs', () => {
                const [value] = schema.deserialize("\tTQ \t==");
                expect(value).to.be.an.instanceof(Buffer);
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
                expect(value).to.deep.equal(d);
            });

            it('does not allow a date string', () => {
                const [,err] = schema.deserialize(iso.substr(0, 10));
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDThh:mm:ss.sssZ/);
            });

            it('allows a date-time string with Z', () => {
                const [value] = schema.deserialize(iso);
                expect(value).to.deep.equal(new Date(iso));
            });

            it('allows a date-time string with +- offset', () => {
                const iso = '2000-01-01T00:00:00.000+00:00';
                const [value] = schema.deserialize(iso);
                expect(value).to.deep.equal(new Date(iso));
            });

            it('allows a date-time string with deci-seconds', () => {
                const iso = '2000-01-01T00:00:00.1Z';
                const [value] = schema.deserialize(iso);
                expect(value).to.deep.equal(new Date(iso));
            });

            it('allows a date-time string with nano-seconds', () => {
                const iso = '2000-01-01T00:00:00.123456789Z';
                const [value] = schema.deserialize(iso);
                expect(value).to.deep.equal(new Date(iso));
            });

            it('allows a date-time string with - offset', () => {
                const iso = '2000-02-03T23:13:10.000-05:30';
                const [value] = schema.deserialize(iso);
                expect(value).to.deep.equal(new Date(iso));
            });

            it('does not allow a number', () => {
                const [, err] = schema.deserialize(1);
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDThh:mm:ss.sssZ/);
            });

            it('does not allow a boolean', () => {
                const [, err] = schema.deserialize(true);
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDThh:mm:ss.sssZ/);
            });

            it('does not allow an object', () => {
                const [, err] = schema.deserialize({});
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDThh:mm:ss.sssZ/);
            });

            it('does not allow null', () => {
                const [, err] = schema.deserialize(null);
                expect(err).to.match(/Expected a date-time string of the format YYYY-MM-DDThh:mm:ss.sssZ/);
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

            it('does allow string integer when not strict', () => {
                const [value, err] = schema.deserialize('123', { strict: false });
                expect(value).to.equal(123);
                expect(err).to.equal(undefined);
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
                const [, err] = schema.deserialize({});
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

            it('does allow string number when not strict', () => {
                const [value, err] = schema.deserialize('123.7', { strict: false });
                expect(value).to.equal(123.7);
                expect(err).to.equal(undefined);
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

            it('can produce errors for invalid object properties', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'object',
                    properties: {
                        a: { type: 'number' }
                    }
                });
                const [,err] = schema.deserialize({a: 'hello'});
                expect(err).to.match(/Expected a number. Received: "hello"/);
            });

            it('can deserialize with allOf', async () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    allOf: [
                        { type: 'object', properties: { a: { type: 'string', format: 'date' } } },
                        { type: 'object', properties: { b: { type: 'string', format: 'date' } } },
                        { type: 'object', properties: { c: { type: 'string' } } }
                    ]
                });
                const [ value ] = schema.deserialize({
                    a: '2000-01-01',
                    b: '2000-01-01',
                    c: '2000-01-01'
                });
                expect(value.a).to.be.an.instanceof(Date);
                expect(value.b).to.be.an.instanceof(Date);
                expect(value.c).to.be.a('string');
            });

            it('can discriminate with allOf', async () => {
                const enforcer = await Enforcer(allOf2Def);
                const schema = enforcer.definitions.Pet;
                const birthDate = '2000-01-01';

                const [ value ] = schema.deserialize({ petType: 'Dog', birthDate });
                expect(value.birthDate).to.be.an.instanceof(Date);

                const [ value2 ] = schema.deserialize({ petType: 'Cat', birthDate });
                expect(value2.birthDate).to.be.a('string');
            });

            it('will produce error for anyOf with no discriminator and too much ambiguity', async () => {
                const def = util.copy(anyOfDef)
                delete def.components.schemas.Pet.discriminator
                const enforcer = await Enforcer(def);
                const schema = enforcer.components.schemas.Pet;
                const [ , err ] = schema.deserialize({ birthDate: '2000-01-01' });
                expect(err).to.match(/too many schemas match/);
            });

            it('can determine anyOf with discriminator', async () => {
                const enforcer = await Enforcer(anyOfDef);
                const schema = enforcer.components.schemas.Pet;
                const birthDate = '2000-01-01';

                const [ value ] = schema.deserialize({ petType: 'Dog', birthDate });
                expect(value.birthDate).to.be.an.instanceof(Date);

                const [ value2 ] = schema.deserialize({ petType: 'Cat', birthDate });
                expect(value2.birthDate).to.be.a('string');
            });

            it('can guess for anyOf with more defined properties and no discriminator', async () => {
                const def = util.copy(anyOfDef)
                delete def.components.schemas.Pet.discriminator
                const enforcer = await Enforcer(def);
                const schema = enforcer.components.schemas.Pet;
                const [ , err ] = schema.deserialize({ packSize: 5, birthDate: '2000-01-01' });
                expect(err).to.equal(undefined);
            });

        });

        describe('allOf', () => {

            it('number', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    allOf: [
                        { type: 'number' },
                        { type: 'number', minimum: 0 }
                    ]
                });
                const deserialized = schema.deserialize(1);
                expect(deserialized.value).to.equal(1)
            })

        });

        describe('oneOf', () => {
            const anyTypeDef = {
                "oneOf": [
                    { "type": "string" },
                    { "type": "number" },
                    { "type": "boolean" },
                    {
                        "type": "array",
                        "items": {
                            "oneOf": [
                                { "type": "string" },
                                { "type": "number" },
                                { "type": "boolean" },
                                { "type": "object" }
                            ]
                        }
                    },
                    { "type": "object" }
                ]
            };

            it('oneOf any type as string', async () => {
                const [ schema ] = Enforcer.v3_0.Schema(anyTypeDef);
                const deserialized = schema.deserialize('hello');
                expect(deserialized.value).to.equal('hello')
            });

            it('oneOf any type as number', async () => {
                const [ schema ] = Enforcer.v3_0.Schema(anyTypeDef);
                const deserialized = schema.deserialize(1);
                expect(deserialized.value).to.equal(1)
            });

            it('oneOf any type as boolean', async () => {
                const [ schema ] = Enforcer.v3_0.Schema(anyTypeDef);
                const deserialized = schema.deserialize(true);
                expect(deserialized.value).to.equal(true)
            });

        });

    });

    describe('discriminate', () => {

        describe('dereference mapping', () => {

            it.skip('can dereference mapped values', () => {

            })

        });

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
                    paths: {},
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
        const dog = {
            type: 'object',
            properties: {
                name: { type: 'string', 'x-variable': 'first' },
                packSize: { type: 'integer', default: 5 },
                type: { type: 'string' }
            }
        };
        const person = {
            type: 'object',
            properties: {
                firstName: { type: 'string', 'x-variable': 'first' },
                lastName: { type: 'string', 'x-variable': 'last' },
                fullName: { type: 'string', 'x-template': '{first} {last}' },
                age: { type: 'integer', 'x-variable': 'age' },
                type: { type: 'string' }
            }
        };

        it('can populate a primitive', () => {
            const [ schema ] = Enforcer.v2_0.Schema({ type: 'string', 'x-variable': 'name' });
            const [ value ] = schema.populate({ name: 'Bob' });
            expect(value).to.equal('Bob');
        });

        it('can populate an array if items exist', () => {
            const [ schema ] = Enforcer.v2_0.Schema({ type: 'array', items: person });
            const [ value ] = schema.populate({ first: 'Bob', last: 'Smith', age: 25 }, [{ firstName: 'Tim' }, {}]);
            expect(value).to.deep.equal([
                {
                    firstName: 'Tim',
                    lastName: 'Smith',
                    fullName: 'Bob Smith',
                    age: 25
                },
                {
                    firstName: 'Bob',
                    lastName: 'Smith',
                    fullName: 'Bob Smith',
                    age: 25
                }
            ]);
        });

        it('can populate a date', () => {
            const [ schema ] = Enforcer.v2_0.Schema({ type: 'string', format: 'date', 'x-variable': 'myDate' });
            const [ value ] = schema.populate({ myDate: new Date('2000-01-01T00:00:00.000Z')  });
            expect(value).to.deep.equal(new Date('2000-01-01T00:00:00.000Z'))
        });

        describe('object', () => {

            it('can populate an object', () => {
                const [ schema ] = Enforcer.v2_0.Schema(person);
                const [ value ] = schema.populate({ first: 'Bob', last: 'Smith', age: 25 });
                expect(value).to.deep.equal({
                    firstName: 'Bob',
                    lastName: 'Smith',
                    fullName: 'Bob Smith',
                    age: 25
                });
            });

            it('will ignore missing requires', () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string' },
                        age: { type: 'number', default: 5 }
                    }
                });
                const [ value ] = schema.populate();
                expect(value).to.deep.equal({ age: 5 })
            });

            it('can handle nested population', () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    type: 'object',
                    additionalProperties: {
                        type: 'object',
                        properties: {
                            x: { type: 'number', default: 5 }
                        }
                    }
                });
                const [ value ] = schema.populate(undefined, { a: {} });
                expect(value).to.deep.equal({ a: { x: 5 } });
            });

            it('can populate with allOf', () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    allOf: [
                        {
                            type: 'object',
                            properties: {
                                a: { type: 'string', default: 'A' }
                            }
                        },{
                            type: 'object',
                            properties: {
                                b: { type: 'string', default: 'B' }
                            }
                        }
                    ]
                });
                const [ value ] = schema.populate();
                expect(value).to.deep.equal({ a: 'A', b: 'B' });
            });

        });

        it('it can limit depth', () => {
            const def = util.copy(person);
            def.properties.spouse = def;
            const [ schema ] = Enforcer.v2_0.Schema(def);
            const [ value, , warning ] = schema.populate({ first: 'Bob', last: 'Smith', age: 25 }, {}, { depth: 3 });
            expect(value).to.haveOwnProperty('spouse');
            expect(value.spouse).to.haveOwnProperty('spouse');
            expect(value.spouse.spouse).not.to.haveOwnProperty('spouse');
            expect(warning).to.match(/Reached maximum depth/);
        });

        it('can use enforcer value to stop nested population', () => {
            const def = util.copy(person);
            def.properties.spouse = def;
            def.properties.bestFriend = def;
            const [ schema ] = Enforcer.v2_0.Schema(def);
            const [ value ] = schema.populate(
                { first: 'Bob', last: 'Smith', age: 25 },
                { bestFriend: Value({ firstName: 'Tom' }, { populate: false }) },
                { depth: 3 });
            expect(value.spouse).to.haveOwnProperty('spouse');
            expect(value.bestFriend).to.deep.equal({ firstName: 'Tom' });
        });

        describe('anyOf or oneOf discrimination', () => {
            const def = {
                openapi: '3.0.0',
                info: { title: '', version: '' },
                paths: {},
                components: {
                    schemas: {
                        something: {
                            oneOf: [
                                { $ref: '#/components/schemas/dog' },
                                { $ref: '#/components/schemas/person' }
                            ],
                            discriminator: { propertyName: 'type' }
                        },
                        dog,
                        person
                    }
                }
            };

            it('can discriminate between oneOf through initial value', async () => {
                const enforcer = await Enforcer(def);
                const schema = enforcer.components.schemas.something;
                const [ dogValue ] = schema.populate({ first: 'Bob' }, { type: 'dog' });
                expect(dogValue).to.deep.equal({ name: 'Bob', packSize: 5, type: 'dog' })
            });

            it('cannot discriminate between oneOf without initial value', async () => {
                const enforcer = await Enforcer(def);
                const schema = enforcer.components.schemas.something;
                const [ , err ] = schema.populate({ first: 'Bob', type: 'dog' });
                expect(err).to.match(/Discriminator property "type" as "undefined" did not map to a schema/)
            });

        });

        describe('integer', () => {

            it('will populate default', () => {
                const [ schema ] = Enforcer.v2_0.Schema({ type: 'number', default: 5 });
                const [ value ] = schema.populate();
                expect(value).to.equal(5);
            });

            it('will not populate x-template', () => {
                const [ schema ] = Enforcer.v2_0.Schema({type: 'number', 'x-template': ':myNumber'});
                const [ value ] = schema.populate({ myNumber: 5 });
                expect(value).to.be.undefined; // x-template only works for strings
            });

            it('will populate x-variable', () => {
                const [ schema ] = Enforcer.v2_0.Schema({ type: 'number', 'x-variable': 'myNumber' });
                const [ value ] = schema.populate({ myNumber: 5 });
                expect(value).to.equal(5);
            });

            it('will have x-variable overwrite default', () => {
                const [ schema ] = Enforcer.v2_0.Schema({ type: 'number', default: 5, 'x-variable': 'myNumber' });
                const [ value ] = schema.populate({ myNumber: 6 });
                expect(value).to.equal(6);
            });

            it('will use default when x-variable is not specified', () => {
                const [ schema ] = Enforcer.v2_0.Schema({ type: 'number', default: 5, 'x-variable': 'myNumber' });
                const [ value ] = schema.populate({ type: 'number', default: 5, 'x-variable': 'myNumber' });
                expect(value).to.equal(5);
            });

            it('does not validate or format with x-variable', () => {
                const obj = {};
                const [ schema ] = Enforcer.v2_0.Schema({type: 'number', 'x-variable': 'myNumber'});
                const [ value ] = schema.populate({ myNumber: obj });
                expect(value).to.equal(obj);
            });

        });

        describe('string', () => {

            it('will set default', () => {
                const [ schema ] = Enforcer.v2_0.Schema({ type: 'string', default: 'hello' });
                const [ value ] = schema.populate();
                expect(value).to.equal('hello');
            });

            it('will set x-template', () => {
                const [ schema ] = Enforcer.v2_0.Schema({ type: 'string', 'x-template': '{varName}' });
                const [ value ] = schema.populate({ varName: 'hello' });
                expect(value).to.equal('hello');
            });

            it('will set x-template multiple', () => {
                const [ schema ] = Enforcer.v2_0.Schema({ type: 'string', 'x-template': '{greeting}, {name}!' });
                const [ value ] = schema.populate({greeting: 'Hello', name: 'Bob'});
                expect(value).to.equal('Hello, Bob!');
            });

            it('will set x-variable', () => {
                const [ schema ] = Enforcer.v2_0.Schema({type: 'string', 'x-variable': 'varName'});
                const [ value ] = schema.populate({varName: 'hello'});
                expect(value).to.equal('hello');
            });

        });

        describe('date', () => {

            it('keeps original x-variable value', () => {
                const obj = {};
                const [ schema ] = Enforcer.v2_0.Schema({
                    type: 'string',
                    format: 'date',
                    'x-variable': 'myDate'
                });
                const [ value ] = schema.populate({ myDate: obj });
                expect(value).to.equal(obj);
            });

            it('has default as date object', () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    type: 'string',
                    format: 'date',
                    default: '2000-01-01'
                });
                const [ value ] = schema.populate({ myDate: 'hello' });
                expect(value).to.deep.equal(new Date('2000-01-01T00:00:00.000Z'));
            });

            it('x-template', () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    type: 'string',
                    format: 'date',
                    'x-template': '{year}-{month}-01'
                });
                const [ value ] = schema.populate({ year: '2000', month: '01' });
                expect(value).to.equal('2000-01-01');
            });

        });

    });

    describe('random', () => {

        it('can select random enum', () => {
            const enumValues = ['a', 'b', 'c'];
            const [ schema ] = Enforcer.v3_0.Schema({ type: 'string', enum: enumValues });
            const [ value ] = schema.random();
            expect(value).to.be.oneOf(enumValues);
        });

        describe('array', () => {

            it('can produce random array', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'array', items: { type: 'number' } });
                const [ value ] = schema.random();
                expect(value).to.be.an('array');
                value.forEach(v => {
                    expect(v).to.be.a('number');
                });
            });

            it('can produce an array with min items', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'array', minItems: 100, items: { type: 'number' } });
                const [ value ] = schema.random();
                expect(value.length).to.be.at.least(100);
            });

            it('can produce an array with max items', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'array', maxItems: 0, items: { type: 'number' } });
                const [ value ] = schema.random();
                expect(value.length).to.equal(0);
            });

            it('can produce random array within length bounds', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'array', minItems: 5, maxItems: 5, items: { type: 'number' } });
                const [ value ] = schema.random();
                expect(value.length).to.equal(5);
            });

            it('can produce array with unique items', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'array',
                    minItems: 5,
                    maxItems: 5,
                    uniqueItems: true,
                    items: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 4
                    }
                });
                const [ value ] = schema.random(undefined, { uniqueItemRetry: Number.MAX_SAFE_INTEGER });
                value.sort();
                expect(value).to.deep.equal([0, 1, 2, 3, 4]);
            });

        });

        describe('binary', () => {

            it('can produce a random buffer', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string', format: 'binary' });
                const [ value ] = schema.random();
                expect(value).to.be.instanceof(Buffer);
            });

            it('can produce a random binary within length bounds', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string', format: 'binary', minLength: 8, maxLength: 8 });
                const [ value ] = schema.random();
                expect(value.length).to.equal(1);
            });

        });

        describe('boolean', () => {

            it('can produce random boolean', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'boolean' });
                const [ value ] = schema.random();
                expect(value).to.be.oneOf([true, false]);
            });

        });

        describe('byte', () => {

            it('can produce a random buffer', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string', format: 'binary' });
                const [ value ] = schema.random();
                expect(value).to.be.instanceof(Buffer);
            });

            it('can produce a random binary within length bounds', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string', format: 'byte', minLength: 4, maxLength: 4 });
                const [ value ] = schema.random();
                expect(value.length).to.equal(1);
            });

        });

        describe('date and date-time', () => {

            it('can produce a random date', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string', format: 'date' });
                const [ value ] = schema.random();
                expect(value).to.be.a('date');
            });

            it('can produce a random date within bounds', () => {
                const str = '2000-01-01T00:00:00.000Z';
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'date-time',
                    minimum: str,
                    maximum: str
                });
                const [ value ] = schema.random();
                expect(value.toISOString()).to.equal(str);
            });

        });

        describe('integer', () => {

            it('can produce random integer below zero', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'number',
                    minimum: -3,
                    maximum: 0,
                    multipleOf: 1
                });

                for (let i=0; i<5; i++) {
                    const [ value ] = schema.random();
                    expect(value).to.be.greaterThan(-4);
                    expect(value).to.be.lessThan(1);
                }
            });

            it('can produce random integer if maximum not set and minimum is high', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'number',
                    minimum: 1000000000000,
                    multipleOf: 1
                });

                const [ value ] = schema.random();
                expect(value).to.be.greaterThan(1000000000000 - 1);
            });

            it('can produce random integer', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'integer'
                });
                const [ value ] = schema.random();
                expect(value).to.be.a('number');
                expect(value % 1).to.equal(0);
            });

            it('can produce random integer within bounds', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'integer',
                    minimum: 1,
                    maximum: 1
                });
                const [ value ] = schema.random();
                expect(value).to.equal(1);
            });

            it('can produce random integer within bounds with exclusive maximum and minimum', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'integer',
                    minimum: 1,
                    maximum: 3,
                    exclusiveMinimum: true,
                    exclusiveMaximum: true
                });
                const [ value ] = schema.random();
                expect(value).to.equal(2);
            });

            it('can produce multipleOf', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'integer',
                    multipleOf: 3
                });
                const [ value ] = schema.random();
                expect(value % 3).to.equal(0);
            });

        });

        describe('number', () => {

            it('can produce random number', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'number'
                });
                const [ value ] = schema.random();
                expect(value).to.be.a('number');
            });

            it('can produce random number within bounds', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'number',
                    minimum: 1.5,
                    maximum: 1.5
                });
                const [ value ] = schema.random();
                expect(value).to.equal(1.5);
            });

            it('can produce random number within bounds with exclusive maximum and minimum', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'number',
                    minimum: 1,
                    maximum: 2,
                    exclusiveMinimum: true,
                    exclusiveMaximum: true
                });
                const [ value ] = schema.random();
                expect(value).to.be.greaterThan(1);
                expect(value).to.be.lessThan(2);
            });

            it('can produce multipleOf', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    type: 'number',
                    multipleOf: .5
                });
                const [ value ] = schema.random();
                expect(value % .5).to.equal(0);
            });

        });

        describe('object', () => {

            it('can produce a random object', () => {
                const def = {
                    type: 'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'boolean' },
                        c: { type: 'string' }
                    }
                };
                const [ schema ] = Enforcer.v3_0.Schema(def);
                const [ value ] = schema.random();
                expect(value).to.be.an('object');

            });

            it('can produce a random object from a circular schema', () => {
                const def = {
                    type: 'object',
                    required: ['a', 'b'],
                    properties: {
                        a: { type: 'integer' }
                    }
                };
                def.properties.b = def;
                const [ schema ] = Enforcer.v3_0.Schema(def);
                const [ value ] = schema.random();
                expect(value).to.be.an('object');
            });

            it('can produce random object within property count bounds', () => {
                const def = {
                    type: 'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'boolean' },
                        c: { type: 'string' }
                    },
                    minProperties: 1,
                    maxProperties: 1
                };
                const [ schema ] = Enforcer.v3_0.Schema(def);
                const [ value ] = schema.random();
                const keys = Object.keys(value);
                expect(keys.length).to.equal(1);
            });

            it('will have all required properties', () => {
                const def = {
                    type: 'object',
                    required: ['a', 'd'],
                    properties: {
                        a: { type: 'number' }
                    }
                };
                const [ schema ] = Enforcer.v3_0.Schema(def);
                const [ value ] = schema.random();
                expect(value).to.haveOwnProperty('a');
                expect(value).to.haveOwnProperty('d');
            });

            it('can produce additional properties from required by not defined', () => {
                const def = {
                    type: 'object',
                    required: ['a']
                };
                const [ schema ] = Enforcer.v3_0.Schema(def);
                const [ value ] = schema.random();
                expect(value).to.haveOwnProperty('a');
            });

            it('can produce allOf object', () => {
                const [ schema ] = Enforcer.v3_0.Schema({
                    allOf: [
                        {
                            type: "object",
                            required: ['a'],
                            properties: {
                                a: {
                                    allOf: [
                                        { type: "integer", minimum: 1 },
                                        { type: "integer", multipleOf: 2 }
                                    ]
                                }
                            }
                        },
                        {
                            type: 'object',
                            properties: {
                                a: { type: "integer", maximum: 3 }
                            }
                        }
                    ]
                });
                const [ value ] = schema.random();
                expect(value.a).to.equal(2);
            });

            it('can produce oneOf or anyOf object', () => {
                const def = {
                    oneOf: [
                        { type: 'number' },
                        { type: 'boolean' }
                    ]
                };
                const [ schema ] = Enforcer.v3_0.Schema(def);
                const [ value ] = schema.random();
                expect(typeof value).to.be.oneOf(['boolean', 'number'])
            });

            it('cannot produce not object', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ not: { type: 'string' } });
                const [ , , warn ] = schema.random();
                expect(warn).to.match(/Cannot generate random value for schema with not/);
            });

        });

        describe('string', () => {

            it('can produce random string by pattern', () => {
                const spec = {
                    allOf: [
                        {
                            type: 'object',
                            required: ['petType'],
                            properties: {
                                petType: { type: 'string', pattern: '^[a-z]{5}[0-9]{3}$' }
                            },
                        }
                    ]
                }
                const { value: schema} = new Enforcer.v3_0.Schema(spec);
                const { error, value, warning} = schema.random();
                expect(value.petType).to.match(/^[a-z]{5}[0-9]{3}$/)
                expect(warning).to.be.undefined;
                expect(error).to.be.undefined;
            });

            it('can produce random string', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string' });
                const [ value ] = schema.random();
                expect(value).to.be.a('string');
            });

            it('can produce random string within bounds', () => {
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string', minLength: 5, maxLength: 5 });
                const [ value ] = schema.random();
                expect(value.length).to.equal(5);
            });

        });

    });

    describe('serialize', () => {

        describe('nullable', () => {

            it('skips serialization for null nullable values', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    nullable: true
                });
                const [value] = schema.serialize(null);
                expect(value).to.equal(null);
            });

        });

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
                const [, err] = schema.serialize({});
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(null);
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
                expect(err).to.match(/Unable to serialize to a boolean/);
            });

            it('does not allow 0', () => {
                const [, err] = schema.serialize(0);
                expect(err).to.match(/Unable to serialize to a boolean/);
            });

            it('does not allow string', () => {
                const [, err] = schema.serialize('hello');
                expect(err).to.match(/Unable to serialize to a boolean/);
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize({});
                expect(err).to.match(/Unable to serialize to a boolean/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(null);
                expect(err).to.match(/Unable to serialize to a boolean/);
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
                const [, err] = schema.serialize({});
                expect(err).to.match(/Expected a Buffer instance/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(null);
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
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow an object', () => {
                const [, err] = schema.serialize({});
                expect(err).to.match(/Expected a valid Date instance or date formatted string/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(null);
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
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Expected a valid Date instance or an ISO date formatted string/);
            });

            it('does not allow an object', () => {
                const [, err] = schema.serialize({});
                expect(err).to.match(/Expected a valid Date instance or an ISO date formatted string/);
            });

            it('does not allow null', () => {
                const [, err] = schema.serialize(null);
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
                expect(err).to.match(/Unable to serialize to an integer/);
            });

            it('does not allow string integer', () => {
                const [, err] = schema.serialize('123');
                expect(err).to.match(/Unable to serialize to an integer/);
            });

            it('does not allow string decimal', () => {
                const [, err] = schema.serialize('123.7');
                expect(err).to.match(/Unable to serialize to an integer/);
            });

            it('does not allow date object', () => {
                const [, err] = schema.serialize(new Date('2000-01-01T00:00:00.000Z'));
                expect(err).to.match(/Unable to serialize to an integer/);
            });

            it('does not allow true', () => {
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Unable to serialize to an integer/);
            });

            it('does not allow false', () => {
                const [, err] = schema.serialize(false);
                expect(err).to.match(/Unable to serialize to an integer/);
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize({});
                expect(err).to.match(/Unable to serialize to an integer/);
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
                expect(err).to.match(/Unable to serialize to a number/);
            });

            it('does not allow date object', () => {
                const [, err] = schema.serialize(new Date('2000-01-01T00:00:00.000Z'));
                expect(err).to.match(/Unable to serialize to a number/);
            });

            it('does not allow true', () => {
                const [, err] = schema.serialize(true);
                expect(err).to.match(/Unable to serialize to a number/);
            });

            it('does not allow false', () => {
                const [, err] = schema.serialize(false);
                expect(err).to.match(/Unable to serialize to a number/);
            });

            it('does not allow object', () => {
                const [, err] = schema.serialize({});
                expect(err).to.match(/Unable to serialize to a number/);
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

            it('can produce errors for invalid object properties', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'object',
                    properties: {
                        a: { type: 'number' }
                    }
                });
                const [,err] = schema.serialize({a: 'hello'});
                expect(err).to.match(/Unable to serialize to a number. Received: "hello"/);
            });

            it('can serialize with allOf', () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    allOf: [
                        { type: 'object', properties: { a: { type: 'string', format: 'date' } } },
                        { type: 'object', properties: { b: { type: 'string', format: 'date' } } },
                        { type: 'object', properties: { c: { type: 'string', format: 'date-time' } } }
                    ]
                });
                const date = new Date('2000-01-01T00:00:00.000Z');
                const [ value ] = schema.serialize({
                    a: date,
                    b: date,
                    c: date
                });
                expect(value).to.deep.equal({
                    a: '2000-01-01',
                    b: '2000-01-01',
                    c: '2000-01-01T00:00:00.000Z'
                });
            });

            it('can discriminate with allOf', async () => {
                const enforcer = await Enforcer(allOf2Def);
                const schema = enforcer.definitions.Pet;
                const birthDate = new Date('2000-01-01T00:00:00.000Z');

                const [ value ] = schema.serialize({ petType: 'Dog', birthDate });
                expect(value.birthDate).to.equal('2000-01-01');

                const [ , err ] = schema.serialize({ petType: 'Cat', birthDate });
                expect(err).to.match(/at: 1 > birthDate\s+Unable to serialize to a string/);
            });

            it('will produce error for anyOf with too much ambiguity', async () => {
                const enforcer = await Enforcer(anyOfDef);
                const schema = enforcer.components.schemas.Pet;
                schema.anyOf[0].properties.birthDate.format = 'date';
                const [ , err ] = schema.serialize({ birthDate: new Date('2000-01-01') });
                expect(err).to.match(/Discriminator property "petType" as "undefined" did not map to a schema/);
            });

            it('can determine anyOf with discriminator', async () => {
                const enforcer = await Enforcer(anyOfDef);
                const schema = enforcer.components.schemas.Pet;
                const birthDate = new Date('2000-01-01T00:00:00.000Z');

                const [ value ] = schema.serialize({ petType: 'Dog', birthDate });
                expect(value.birthDate).to.equal('2000-01-01');

                const [ , err ] = schema.serialize({ petType: 'Cat', birthDate });
                expect(err).to.match(/at: birthDate\s+Unable to serialize to a string/);
            });

            it('can guess for anyOf with more defined properties and no discriminator', async () => {
                const def = util.copy(anyOfDef)
                delete def.components.schemas.Pet.discriminator
                const enforcer = await Enforcer(def);
                const schema = enforcer.components.schemas.Pet;
                schema.anyOf[0].properties.birthDate.format = 'date';
                const [ , err ] = schema.deserialize({ packSize: 5, birthDate: '2000-01-01' });
                expect(err).to.equal(undefined);
            });

        });

        describe('oneOf', () => {

            it('can serialize number or boolean', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    oneOf: [
                        { type: 'number' },
                        { type: 'boolean' }
                    ]
                });
                const [value] = schema.serialize(1);
                expect(value).to.equal(1);
            });

            it('can deserialize a number or an object', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    oneOf: [
                        { type: 'string' },
                        {
                            type: 'object',
                            properties: {
                                x: { type: 'string' }
                            }
                        }
                    ]
                });
                const [value1] = schema.serialize({ x: '123' });
                expect(value1).to.deep.equal({ x: '123' });

                const [value2] = schema.serialize('123');
                expect(value2).to.equal('123');
            });

        });

    });

    describe('validate', () => {

        describe('skip codes', () => {

            it('shows warning for unknown format', () => {
                const [, , warning] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'email'
                });
                expect(warning).to.match(/Non standard format "email" used for type "string"/)
            });

            it('can skip warning for unknown format', () => {
                const [, , warning] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'email'
                }, null, { exceptionSkipCodes: ['WSCH001'] });
                expect(warning).to.equal(undefined);
            });

        });

        describe('nullable', () => {

            it('skips validation for null nullable values', () => {
                const [schema] = Enforcer.v3_0.Schema({
                    type: 'string',
                    nullable: true
                });
                const errors = schema.validate(null);
                expect(errors).to.be.undefined;
            });

        });

        describe('array', () => {
            const base = { type: 'array', items: { type: 'number' } };

            it('is array', () => {
                const [ schema ] = Enforcer.v2_0.Schema(base);
                const errors = schema.validate(5);
                expect(errors).to.match(/Expected an array/);
            });

            describe('max items 10 no min items', () => {
                let schema;
                before(() => {
                    const def = Object.assign({}, base, { maxItems: 10 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('zero items', () => {
                    const errors = schema.validate([]);
                    expect(errors).to.be.undefined;
                });

                it('11 items', () => {
                    const errors = schema.validate([1,2,3,4,5,6,7,8,9,10,11]);
                    expect(errors).to.match(/Too many items in the array/);
                });

            });

            describe('min items 2 no max items', () => {
                let schema;
                before(() => {
                    const def = Object.assign({}, base, { minItems: 2 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('zero items', () => {
                    const errors = schema.validate([]);
                    expect(errors).to.match(/Too few items in the array/);
                });

                it('3 items', () => {
                    const errors = schema.validate([1,2,3]);
                    expect(errors).to.be.undefined;
                });

            });

            describe('unique items', () => {
                let schema;
                before(() => {
                    const def = Object.assign({}, base, { uniqueItems: true });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('unique', () => {
                    const errors = schema.validate([1,2,3]);
                    expect(errors).to.be.undefined;
                });

                it('duplicate', () => {
                    const errors = schema.validate([1,2,1]);
                    expect(errors).to.match(/Array items must be unique/);
                });

            });

            describe('enum', () => {
                let schema;
                before(() => {
                    const def = Object.assign({}, base, { enum: [[1,2], [3,4]] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum 1', () => {
                    const errors = schema.validate([1,2]);
                    expect(errors).to.be.undefined;
                });

                it('in enum 2', () => {
                    const errors = schema.validate([3,4]);
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate([1,2,1]);
                    expect(errors).to.match(/did not meet enum requirements/);
                });

            });

        });

        describe('binary', () => {
            const base = { type: 'string', format: 'binary' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            it('value is a buffer', () => {
                const errors = schema.validate(Buffer.from(['00110011'], 'binary'));
                expect(errors).to.be.undefined;
            });

            it('value is not a buffer', () => {
                const errors = schema.validate('00110011');
                expect(errors).to.match(/Expected value to be a buffer/);
            });

            describe('min length', () => {
                before(() => {
                    const def = Object.assign({}, base, { minLength: 8 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('below minimum', () => {
                    const errors = schema.validate(Buffer.from([]));
                    expect(errors).to.match(/Expected binary length to be greater than or equal to 8/);
                });

                it('at minimum', () => {
                    const errors = schema.validate(Buffer.from(['00110011'], 'binary'));
                    expect(errors).to.be.undefined;
                });

            });

            describe('max length', () => {
                before(() => {
                    const def = Object.assign({}, base, { maxLength: 8 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('above max', () => {
                    const errors = schema.validate(Buffer.from([51, 51]));
                    expect(errors).to.match(/Expected binary length to be less than or equal to 8/);
                });

                it('at max', () => {
                    const errors = schema.validate(Buffer.from([51], 'binary'));
                    expect(errors).to.be.undefined;
                });

            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: ['00110011'] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate(Buffer.from([51], 'binary'));
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate(Buffer.from([52], 'binary'));
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('boolean', () => {
            const base = { type: 'boolean' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            it('is true', () => {
                const errors = schema.validate(true);
                expect(errors).to.be.undefined;
            });

            it('is false', () => {
                const errors = schema.validate(false);
                expect(errors).to.be.undefined;
            });

            it('is zero', () => {
                const errors = schema.validate(0);
                expect(errors).to.match(/Expected a boolean/);
            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: [true] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate(true);
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate(false);
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('byte', () => {
            const base = { type: 'string', format: 'byte' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            it('is buffer', () => {
                const errors = schema.validate(Buffer.from('Aa==', 'base64'));
                expect(errors).to.be.undefined;
            });

            it('is not buffer', () => {
                const errors = schema.validate('Aa==');
                expect(errors).to.match(/expected value to be a buffer/i);
            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: ['AQ=='] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate(Buffer.from('AQ==', 'base64'));
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate(Buffer.from('BQ==', 'base64'));
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('date', () => {
            const base = { type: 'string', format: 'date' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            it('is date object', () => {
                const errors = schema.validate(new Date());
                expect(errors).to.be.undefined;
            });

            it('is not date object', () => {
                const errors = schema.validate('abc');
                expect(errors).to.match(/expected a valid date object/i);
            });

            describe('minimum', () => {
                before(() => {
                    const def = Object.assign({}, base, { minimum: '2000-01-02' });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('above minimum', () => {
                    const errors = schema.validate(new Date('2000-01-03'));
                    expect(errors).to.be.undefined;
                });

                it('at minimum', () => {
                    const errors = schema.validate(new Date('2000-01-02'));
                    expect(errors).to.be.undefined;
                });

                it('below minimum', () => {
                    const errors = schema.validate(new Date('2000-01-01'));
                    expect(errors).to.match(/greater than or equal/);
                });

            });

            describe('maximum', () => {
                before(() => {
                    const def = Object.assign({}, base, { maximum: '2000-01-02' });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('above maximum', () => {
                    const errors = schema.validate(new Date('2000-01-03'));
                    expect(errors).to.match(/less than or equal/);
                });

                it('at maximum', () => {
                    const errors = schema.validate(new Date('2000-01-02'));
                    expect(errors).to.be.undefined;
                });

                it('below maximum', () => {
                    const errors = schema.validate(new Date('2000-01-01'));
                    expect(errors).to.be.undefined;
                });

            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: ['2000-01-01'] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate(new Date('2000-01-01'));
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate(new Date('2001-02-02'));
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('date-time', () => {
            const base = { type: 'string', format: 'date-time' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            it('is date object', () => {
                const errors = schema.validate(new Date());
                expect(errors).to.be.undefined;
            });

            it('is not date object', () => {
                const errors = schema.validate('abc');
                expect(errors).to.match(/expected a valid date object/i);
            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: ['2000-01-01T01:02:00.000Z'] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate(new Date('2000-01-01T01:02:00.000Z'));
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate(new Date('2000-01-01T00:00:00.000Z'));
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('integer', () => {
            const base = { type: 'integer' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            it('is an integer', () => {
                const errors = schema.validate(5);
                expect(errors).to.be.undefined;
            });

            it('is a number with decimal', () => {
                const errors = schema.validate(1.5);
                expect(errors).to.match(/Expected an integer/);
            });

            describe('multiple of', () => {
                before(() => {
                    const def = Object.assign({}, base, { multipleOf: 2 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('is multiple of 2', () => {
                    const errors = schema.validate(4);
                    expect(errors).to.be.undefined;
                });

                it('is not a multiple of 2', () => {
                    const errors = schema.validate(5);
                    expect(errors).to.match(/Expected a multiple/);
                });

            });

            describe('minimum', () => {
                before(() => {
                    const def = Object.assign({}, base, { minimum: 2 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('above minimum', () => {
                    const errors = schema.validate(3);
                    expect(errors).to.be.undefined;
                });

                it('at minimum', () => {
                    const errors = schema.validate(2);
                    expect(errors).to.be.undefined;
                });

                it('below minimum', () => {
                    const errors = schema.validate(1);
                    expect(errors).to.match(/greater than or equal/);
                });

            });

            describe('exclusive minimum', () => {
                before(() => {
                    const def = Object.assign({}, base, { minimum: 2, exclusiveMinimum: true });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('above minimum', () => {
                    const errors = schema.validate(3);
                    expect(errors).to.be.undefined;
                });

                it('at minimum', () => {
                    const errors = schema.validate(2);
                    expect(errors).to.match(/greater than 2/);
                });

                it('below minimum', () => {
                    const errors = schema.validate(1);
                    expect(errors).to.match(/greater than 2/);
                });

            });

            describe('maximum', () => {
                before(() => {
                    const def = Object.assign({}, base, { maximum: 2 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('above maximum', () => {
                    const errors = schema.validate(3);
                    expect(errors).to.match(/less than or equal/);
                });

                it('at maximum', () => {
                    const errors = schema.validate(2);
                    expect(errors).to.be.undefined;
                });

                it('below maximum', () => {
                    const errors = schema.validate(1);
                    expect(errors).to.be.undefined;
                });

            });

            describe('exclusive maximum', () => {
                before(() => {
                    const def = Object.assign({}, base, { maximum: 2, exclusiveMaximum: true });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('above maximum', () => {
                    const errors = schema.validate(3);
                    expect(errors).to.match(/less than 2/);
                });

                it('at maximum', () => {
                    const errors = schema.validate(2);
                    expect(errors).to.match(/less than 2/);
                });

                it('below maximum', () => {
                    const errors = schema.validate(1);
                    expect(errors).to.be.undefined;
                });

            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: [1] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate(1);
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate(2);
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('number', () => {
            const base = { type: 'number' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            it('is a number', () => {
                const errors = schema.validate(1.2);
                expect(errors).to.be.undefined;
            });

            it('is not a number', () => {
                const errors = schema.validate('a');
                expect(errors).to.match(/Expected a number/);
            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: [1.2] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate(1.2);
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate(1.3);
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('object', () => {
            const base = { type: 'object' };
            let schema;
            before(() => {
                const def = Object.assign({}, base);
                [ schema ] = Enforcer.v2_0.Schema(def);
            });

            describe('minimum properties', () => {
                before(() => {
                    const def = Object.assign({}, base, { minProperties: 1 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('more than minimum', () => {
                    const errors = schema.validate({ a: 1, b: 2 });
                    expect(errors).to.be.undefined;
                });

                it('same as minimum', () => {
                    const errors = schema.validate({ a: 1 });
                    expect(errors).to.be.undefined;
                });

                it('less than minimum', () => {
                    const errors = schema.validate({});
                    expect(errors).to.match(/greater than or equal/);
                });

            });

            describe('maximum properties', () => {
                before(() => {
                    const def = Object.assign({}, base, { maxProperties: 1 });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('more than maximum', () => {
                    const errors = schema.validate({ a: 1, b: 2 });
                    expect(errors).to.match(/less than or equal/);
                });

                it('same as maximum', () => {
                    const errors = schema.validate({ a: 1 });
                    expect(errors).to.be.undefined;
                });

                it('less than maximum', () => {
                    const errors = schema.validate({});
                    expect(errors).to.be.undefined;
                });

            });

            describe('properties', () => {
                before(() => {
                    const def = Object.assign({}, base, {
                        properties: {
                            x: { type: 'number' },
                            y: { type: 'boolean' }
                        }
                    });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('valid property values 1', () => {
                    const errors = schema.validate({ x: 1 });
                    expect(errors).to.be.undefined;
                });

                it('valid property values 2', () => {
                    const errors = schema.validate({ x: 1, y: true });
                    expect(errors).to.be.undefined;
                });

                it('invalid property value', () => {
                    const errors = schema.validate({ y: 0 });
                    expect(errors).to.match(/Expected a boolean/);
                });

            });

            describe('enum', () => {
                before(() => {
                    const def = Object.assign({}, base, { enum: [{ x: 1 }] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('in enum', () => {
                    const errors = schema.validate({ x: 1 });
                    expect(errors).to.be.undefined;
                });

                it('not in enum 1', () => {
                    const errors = schema.validate({ x: 2 });
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

                it('not in enum 2', () => {
                    const errors = schema.validate({ y: 1 });
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

            describe('required', () => {
                before(() => {
                    const def = Object.assign({}, base, { required: ['name'] });
                    [ schema ] = Enforcer.v2_0.Schema(def);
                });

                it('has required property', () => {
                    const errors = schema.validate({ name: true });
                    expect(errors).to.be.undefined;
                });

                it('missing required property', () => {
                    const errors = schema.validate({ age: true });
                    expect(errors).to.match(/required properties missing/);
                });

            });

            describe('readOnly and writeOnly', () => {
                let schema

                before(() => {
                    const def = Object.assign({}, base, {
                        properties: {
                            any: {
                                type: 'boolean'
                            },
                            read: {
                                type: 'boolean',
                                readOnly: true
                            },
                            write: {
                                type: 'boolean',
                                writeOnly: true
                            }
                        }
                    });
                    [ schema ] = Enforcer.v3_0.Schema(def);
                });

                it('will not allow writing to properties that are readOnly', () => {
                    const errors = schema.validate({ any: true, read: true, write: true }, { readWriteMode: 'write' });
                    expect(errors).to.match(/Cannot write to read only properties: read/)
                });

                it('will allow writing to properties that are not readOnly', () => {
                    const errors = schema.validate({ any: true, write: true }, { readWriteMode: 'write' });
                    expect(errors).to.be.undefined;
                });

                it('will not allow reading from properties that are writeOnly', () => {
                    const errors = schema.validate({ any: true, read: true, write: true }, { readWriteMode: 'read' });
                    expect(errors).to.match(/Cannot read from write only properties: write/)
                });

                it('will allow reading from properties that are not writeOnly', () => {
                    const errors = schema.validate({ any: true, read: true }, { readWriteMode: 'read' });
                    expect(errors).to.be.undefined;
                });

            });

            describe('allOf', () => {
                before(() => {
                    [ schema ] = Enforcer.v2_0.Schema({
                        allOf: [
                            { type: 'object', properties: { x: { type: 'number' }} },
                            { type: 'object', properties: { y: { type: 'string' }} }
                        ]
                    });
                });

                it('both valid', () => {
                    const errors = schema.validate({ x: 2, y: 'hello' });
                    expect(errors).to.be.undefined;
                });

                it('first invalid', () => {
                    const errors = schema.validate({ x: true, y: 'hello' });
                    expect(errors.count).to.equal(1);
                    expect(errors).to.match(/at: 0 > x\s+Expected a number/);
                });

                it('second invalid', () => {
                    const errors = schema.validate({ x: 2, y: 4 });
                    expect(errors.count).to.equal(1);
                    expect(errors).to.match(/at: 1 > y\s+Expected a string/);
                });

                describe('discriminator', () => {
                    let enforcer;
                    before(async () => {
                        enforcer = await Enforcer({
                            swagger: '2.0',
                            info: { title: '', version: '' },
                            paths: {},
                            definitions: {
                                Animal: {
                                    type: 'object',
                                    required: ['animalType'],
                                    properties: {
                                        animalType: { type: 'string' }
                                    },
                                    discriminator: 'animalType'
                                },
                                Cat: {
                                    allOf: [
                                        { '$ref': '#/definitions/Pet' },
                                        Object.assign({}, schemas.Cat, { additionalProperties: true })
                                    ]
                                },
                                Dog: {
                                    allOf: [
                                        { '$ref': '#/definitions/Pet' },
                                        Object.assign({}, schemas.Dog, { additionalProperties: true })
                                    ]
                                },
                                Pet: {
                                    allOf: [
                                        { '$ref': '#/definitions/Animal' },
                                        {
                                            type: 'object',
                                            required: ['petType'],
                                            properties: {
                                                petType: { type: 'string' }
                                            },
                                            discriminator: 'petType'
                                        }
                                    ]
                                }
                            }
                        });
                    });

                    it('valid Dog from Pet', () => {
                        const schema = enforcer.definitions.Pet;
                        const errors = schema.validate({ animalType: 'Pet', petType: 'Dog', packSize: 2 });
                        expect(errors).to.be.undefined;
                    });

                    it('invalid Dog from Pet', () => {
                        const schema = enforcer.definitions.Pet;
                        const errors = schema.validate({ animalType: 'Pet', petType: 'Dog', packSize: 'a' });
                        expect(errors).to.match(/Expected an integer/);
                    });

                    it('undefined discriminator', () => {
                        const schema = enforcer.definitions.Pet;
                        const errors = schema.validate({ petType: 'Mouse' });
                        expect(errors).to.match(/One or more required properties missing: animalType/);
                        expect(errors).to.match(/Discriminator property "petType" as "Mouse" did not map to a schema/);
                        expect(errors.count).to.equal(2);
                    });

                    it('valid Cat from Pet', () => {
                        const schema = enforcer.definitions.Pet;
                        const errors = schema.validate({ animalType: 'Pet', petType: 'Cat', huntingSkill: 'sneak' });
                        expect(errors).to.be.undefined;
                    });

                    it('invalid Cat from Pet', () => {
                        const schema = enforcer.definitions.Pet;
                        const errors = schema.validate({ animalType: 'Pet', petType: 'Cat', huntingSkill: 1 });
                        expect(errors).to.match(/expected a string/i);
                    });

                    it('valid Dog from Animal', () => {
                        const schema = enforcer.definitions.Animal;
                        const errors = schema.validate({ animalType: 'Pet', petType: 'Dog', packSize: 2 });
                        expect(errors).to.be.undefined;
                    });

                    it('invalid Dog from Animal', () => {
                        const schema = enforcer.definitions.Animal;
                        const errors = schema.validate({ animalType: 'Pet', petType: 'Dog', packSize: 'big' });
                        expect(errors).to.match(/packSize\s+Expected an integer/)
                    });

                });

            });

            describe('anyOf', () => {
                before(() => {
                    [ schema ] = Enforcer.v3_0.Schema({
                        anyOf: [
                            { type: 'number' },
                            { type: 'boolean' },
                        ]
                    });
                });

                it('valid 1', () => {
                    const errors = schema.validate(5);
                    expect(errors).to.be.undefined;
                });

                it('valid 2', () => {
                    const errors = schema.validate(true);
                    expect(errors).to.be.undefined;
                });

                it('invalid', () => {
                    const errors = schema.validate({ x: 'abc' });
                    expect(errors).to.match(/Expected a number/);
                    expect(errors).to.match(/Expected a boolean/);
                    expect(errors.count).to.equal(2);
                });

            });

            describe('oneOf', () => {
                before(() => {
                    [ schema ] = Enforcer.v3_0.Schema({
                        oneOf: [
                            { type: 'object', properties: { x: { type: 'number', minimum: 2, maximum: 10 } }},
                            { type: 'object', properties: { x: { type: 'number', maximum: 5 } }},
                        ]
                    });
                });

                it('found 0', () => {
                    const errors = schema.validate({ x: 11 });
                    expect(errors).to.match(/Did not validate against exactly one schema/);
                });

                it('found 1', () => {
                    const errors = schema.validate({ x: 6 });
                    expect(errors).to.be.undefined;
                });

                it('found 2', () => {
                    const errors = schema.validate({ x: 3 });
                    expect(errors).to.match(/Did not validate against exactly one schema/);
                });

            });

        });

        describe('string', () => {
            const base = { type: 'string' };
            let schema;

            describe('enum', () => {
                before(() => {
                    [ schema ] = Enforcer.v3_0.Schema(Object.assign({}, base, { enum: ['abc'] }));
                });

                it('in enum', () => {
                    const errors = schema.validate('abc');
                    expect(errors).to.be.undefined;
                });

                it('not in enum', () => {
                    const errors = schema.validate('def');
                    expect(errors).to.match(/did not meet enum requirements/i);
                });

            });

        });

        describe('not', () => {
            it('not valid', () => {
                const [ schema ] = Enforcer.v3_0.Schema({not: {type: 'string' }});
                const errors = schema.validate('abc');
                expect(errors).to.match(/Value should not validate against schema/i);
            });

            it('valid', () => {
                const [ schema ] = Enforcer.v3_0.Schema({not: {type: 'string' }});
                const errors = schema.validate(true);
                expect(errors).to.be.undefined;
            });
        });

    });

    describe('hooks', function () {
        describe('beforeDeserialize', function () {
            function hook (value, schema, exception) {
                if (value === 'foo') {
                    exception.message('No foo allowed')
                } else if (schema.type === 'string' && schema.format === 'date' && value === '0000-00-00') {
                    return {
                        value: new Date(0),
                        done: true // if done then don't allow any other deserialize functions to run, we are done
                    }
                } else {
                    // we didn't make any changes so pass along the unchanged value and let other deserializers work on it
                    return {
                        value,
                        done: false
                    }
                }
            }

            before (() => {
                Enforcer.v3_0.Schema.hook('beforeDeserialize', hook)
            })

            after (() => {
                Enforcer.v3_0.Schema.unhook('beforeDeserialize', hook)
            })

            it('will run hooks', () => {
                const [ schema1 ] = Enforcer.v3_0.Schema({
                    type: 'string',
                    format: 'date'
                });
                const [ schema2 ] = Enforcer.v3_0.Schema({
                    type: 'string'
                });

                const [ value1 ] = schema1.deserialize('0000-00-00')
                expect(+value1).to.equal(0)

                const [ value2 ] = schema2.deserialize('0000-00-00')
                expect(value2).to.equal('0000-00-00')

                const [ , error ] = schema2.deserialize('foo')
                expect(error).to.match(/No foo allowed/)
            })

            it('will not run hooks on schema v2 unless added', () => {
                const [ schema ] = Enforcer.v2_0.Schema({
                    type: 'string',
                    format: 'date'
                });

                try {
                    schema.deserialize('0000-00-00')
                    throw Error('foo')
                } catch (e) {
                    expect(e).not.to.match(/foo/)
                }
            })
        });

        describe('afterDeserialize', function () {
            it('will run hooks', () => {
                let run = false

                function hook () {
                    run = true
                }
                Enforcer.v3_0.Schema.hook('afterDeserialize', hook)
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string' });
                schema.deserialize('foo')
                expect(run).to.equal(true)
                Enforcer.v3_0.Schema.unhook('afterDeserialize', hook)
            })
        });

        describe('beforeSerialize', function () {
            it('will run hooks', () => {
                let run = false

                function hook () {
                    run = true
                }
                Enforcer.v3_0.Schema.hook('beforeSerialize', hook)
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string' });
                schema.serialize('foo')
                expect(run).to.equal(true)
                Enforcer.v3_0.Schema.unhook('beforeSerialize', hook)
            })
        });

        describe('afterSerialize', function () {
            it('will run hooks', () => {
                let run = false

                function hook () {
                    run = true
                }
                Enforcer.v3_0.Schema.hook('afterSerialize', hook)
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string' });
                schema.serialize('foo')
                expect(run).to.equal(true)
                Enforcer.v3_0.Schema.unhook('afterSerialize', hook)
            })
        });

        describe('beforeValidate', function () {
            it('will run hooks', () => {
                let run = false

                function hook () {
                    run = true
                }
                Enforcer.v3_0.Schema.hook('beforeValidate', hook)
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string' });
                schema.validate('foo')
                expect(run).to.equal(true)
                Enforcer.v3_0.Schema.unhook('beforeValidate', hook)
            })
        });

        describe('afterValidate', function () {
            it('will run hooks', () => {
                let run = false

                function hook () {
                    run = true
                }
                Enforcer.v3_0.Schema.hook('afterValidate', hook)
                const [ schema ] = Enforcer.v3_0.Schema({ type: 'string' });
                schema.validate('foo')
                expect(run).to.equal(true)
                Enforcer.v3_0.Schema.unhook('afterValidate', hook)
            })
        });
    });

    it('using toObject converts nested components too', () => {
        const [ schema ] = new Enforcer.v3_0.Schema({
            type: 'object',
            properties: {
                x: { type: 'string' }
            }
        });
        expect(schema).to.be.instanceOf(Enforcer.v3_0.Schema);
        expect(schema.properties.x).to.be.instanceOf(Enforcer.v3_0.Schema);

        const obj = schema.toObject();
        expect(obj).not.to.be.instanceOf(Enforcer.v3_0.Schema);
        expect(obj.properties.x).not.to.be.instanceOf(Enforcer.v3_0.Schema);
    });

});
