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
const Enforcer      = require('../../index');
const expect        = require('chai').expect;

describe.only('schema.validate', () => {

    const definition = {
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0'
        },
        paths: {},
        components: {
            schemas: createSchemas(3)
        }
    };

    let enforcer;

    before(() => {
        enforcer = new Enforcer(definition);
    });

    describe('array', () => {
        const base = { type: 'array', items: { type: 'number' } };

        it('is array', () => {
            const exception = enforcer.validate(base, 5, { throw: false });
            expect(exception).to.match(/expected an array/i);
        });

        describe('max items 10 no min items', () => {
            const schema = extend(base, { maxItems: 10 });

            it('zero items', () => {
                const exception = enforcer.validate(schema, [], { throw: false });
                expect(exception).to.be.null;
            });

            it('11 items', () => {
                const exception = enforcer.validate(schema, [1,2,3,4,5,6,7,8,9,10,11], { throw: false });
                expect(exception).to.match(/too many items in the array/i);
            });

        });

        describe('min items 2 no max items', () => {
            const schema = extend(base, { minItems: 2 });

            it('zero items', () => {
                expect(() => enforcer.validate(schema, [])).to.throw(/too few items in the array/i);
            });

            it('3 items', () => {
                const exception = enforcer.validate(schema, [1,2,3]);
                expect(exception).to.be.null;
            });

        });

        describe('unique items', () => {
            const schema = extend(base, { uniqueItems: true });

            it('unique', () => {
                const exception = enforcer.validate(schema, [1,2,3]);
                expect(exception).to.be.null;
            });

            it('duplicate', () => {
                expect(() => enforcer.validate(schema, [1,2,1])).to.throw(/array items must be unique/i);
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: [[1,2], [3,4]] });

            it('in enum 1', () => {
                expect(enforcer.validate(schema, [1,2])).to.be.null;
            });

            it('in enum 2', () => {
                expect(enforcer.validate(schema, [3,4])).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, [1,2,1])).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('binary', () => {
        const base = { type: 'string', format: 'binary' };

        it('value is a buffer', () => {
            expect(enforcer.validate(base, Buffer.from(['00110011'], 'binary'))).to.be.null;
        });

        it('value is not a buffer', () => {
            expect(() => enforcer.validate(base, '00110011')).to.throw(/expected value to be a buffer/i);
        });

        describe('min length', () => {
            const schema = extend(base, { minLength: 8 });

            it('below minimum', () => {
                expect(() => enforcer.validate(schema, Buffer.from([]))).to.throw(/expected binary length/i);
            });

            it('at minimum', () => {
                expect(enforcer.validate(schema, Buffer.from(['00110011'], 'binary'))).to.be.null;
            });

        });

        describe('max length', () => {
            const schema = extend(base, { maxLength: 8 });

            it('above max', () => {
                expect(() => enforcer.validate(schema, Buffer.from([51, 51]))).to.throw(/expected binary length/i);
            });

            it('at max', () => {
                expect(enforcer.validate(schema, Buffer.from([51], 'binary'))).to.be.null;
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['00110011'] }); // 00110011 => 51

            it('in enum', () => {
                expect(enforcer.validate(schema, Buffer.from([51], 'binary'))).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, Buffer.from([52], 'binary'))).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('boolean', () => {
        const base = { type: 'boolean' };

        it('is true', () => {
            expect(enforcer.validate(base, true)).to.be.null;
        });

        it('is false', () => {
            expect(enforcer.validate(base, false)).to.be.null;
        });

        it('is zero', () => {
            expect(() => enforcer.validate(base, 0)).to.throw(/Expected a boolean/);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: [true] });

            it('in enum', () => {
                expect(enforcer.validate(schema, true)).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, false)).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('byte', () => {
        const base = { type: 'string', format: 'byte' };

        it('is buffer', () => {
            expect(enforcer.validate(base, Buffer.from('Aa==', 'base64'))).to.be.null;
        });

        it('is not buffer', () => {
            expect(() => enforcer.validate(base, 'Aa==')).to.throw(/expected value to be a buffer/i);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['AQ=='] });

            it('in enum', () => {
                expect(enforcer.validate(schema, Buffer.from('AQ==', 'base64'))).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, Buffer.from('BQ==', 'base64'))).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('date', () => {
        const base = { type: 'string', format: 'date' };

        it('is date object', () => {
            expect(enforcer.validate(base, new Date())).to.be.null;
        });

        it('is not date object', () => {
            expect(() => enforcer.validate(base, 'abc')).to.throw(/expected a valid date object/i);
        });

        describe('minimum', () => {
            const schema = extend(base, { minimum: '2000-01-02' });

            it('above minimum', () => {
                expect(enforcer.validate(schema, new Date('2000-01-03'))).to.be.null;
            });

            it('at minimum', () => {
                expect(enforcer.validate(schema, new Date('2000-01-02'))).to.be.null;
            });

            it('below minimum', () => {
                expect(() => enforcer.validate(schema, new Date('2000-01-01'))).to.throw(/greater than or equal/);
            });

        });

        describe('maximum', () => {
            const schema = extend(base, { maximum: '2000-01-02' });

            it('above maximum', () => {
                expect(() => enforcer.validate(schema, new Date('2000-01-03'))).to.throw(/less than or equal/);
            });

            it('at maximum', () => {
                expect(enforcer.validate(schema, new Date('2000-01-02'))).to.be.null;
            });

            it('below maximum', () => {
                expect(enforcer.validate(schema, new Date('2000-01-01'))).to.be.null;
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['2000-01-01'] });

            it('in enum', () => {
                expect(enforcer.validate(schema, new Date('2000-01-01'))).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, new Date('2001-02-02'))).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('date-time', () => {
        const base = { type: 'string', format: 'date-time' };

        it('is date object', () => {
            expect(enforcer.validate(base, new Date())).to.be.null;
        });

        it('is not date object', () => {
            expect(() => enforcer.validate(base, 'abc')).to.throw(/expected a valid date object/i);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['2000-01-01T01:02:00.000Z'] });

            it('in enum', () => {
                expect(enforcer.validate(schema, new Date('2000-01-01T01:02:00.000Z'))).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, new Date('2000-01-01T00:00:00.000Z'))).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('integer', () => {
        const base = { type: 'integer' };

        it('is an integer', () => {
            expect(enforcer.validate(base, 5)).to.be.null;
        });

        it('is a number with decimal', () => {
            expect(() => enforcer.validate(base, 1.5)).to.throw(/Expected an integer/);
        });

        describe('multiple of', () => {
            const schema = extend(base, { multipleOf: 2 });

            it('is multiple of 2', () => {
                expect(enforcer.validate(schema, 4)).to.be.null;
            });

            it('is not a multiple of 2', () => {
                expect(() => enforcer.validate(schema, 5)).to.throw(/Expected a multiple/);
            });

        });

        describe('minimum', () => {
            const schema = extend(base, { minimum: 2 });

            it('above minimum', () => {
                expect(enforcer.validate(schema, 3)).to.be.null;
            });

            it('at minimum', () => {
                expect(enforcer.validate(schema, 2)).to.be.null;
            });

            it('below minimum', () => {
                expect(() => enforcer.validate(schema, 1)).to.throw(/greater than or equal/);
            });

        });

        describe('exclusive minimum', () => {
            const schema = extend(base, { minimum: 2, exclusiveMinimum: true });

            it('above minimum', () => {
                expect(enforcer.validate(schema, 3)).to.be.null;
            });

            it('at minimum', () => {
                expect(() => enforcer.validate(schema, 2)).to.throw(/greater than 2/);
            });

            it('below minimum', () => {
                expect(() => enforcer.validate(schema, 1)).to.throw(/greater than 2/);
            });

        });

        describe('maximum', () => {
            const schema = extend(base, { maximum: 2 });

            it('above maximum', () => {
                expect(() => enforcer.validate(schema, 3)).to.throw(/less than or equal/);
            });

            it('at maximum', () => {
                expect(enforcer.validate(schema, 2)).to.be.null;
            });

            it('below maximum', () => {
                expect(enforcer.validate(schema, 1)).to.be.null;
            });

        });

        describe('exclusive maximum', () => {
            const schema = extend(base, { maximum: 2, exclusiveMaximum: true });

            it('above maximum', () => {
                expect(() => enforcer.validate(schema, 3)).to.throw(/less than 2/);
            });

            it('at maximum', () => {
                expect(() => enforcer.validate(schema, 2)).to.throw(/less than 2/);
            });

            it('below maximum', () => {
                expect(enforcer.validate(schema, 1)).to.be.null;
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: [1] });

            it('in enum', () => {
                expect(enforcer.validate(schema, 1)).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, 2)).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('number', () => {
        const base = { type: 'number' };

        it('is a number', () => {
            expect(enforcer.validate(base, 1.2)).to.be.null;
        });

        it('is not a number', () => {
            expect(() => enforcer.validate(base, 'a')).to.throw(/Expected a number/);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: [1.2] });

            it('in enum', () => {
                expect(enforcer.validate(schema, 1.2)).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, 1.3)).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('object', () => {
        const base = { type: 'object' };

        describe('minimum properties', () => {
            const schema = extend(base, { minProperties: 1 });

            it('more than minimum', () => {
                expect(enforcer.validate(schema, { a: 1, b: 2 })).to.be.null;
            });

            it('same as minimum', () => {
                expect(enforcer.validate(schema, { a: 1 })).to.be.null;
            });

            it('less than minimum', () => {
                expect(() => enforcer.validate(schema, {})).to.throw(/greater than or equal/);
            });

        });

        describe('maximum properties', () => {
            const schema = extend(base, { maxProperties: 1 });

            it('more than maximum', () => {
                expect(() => enforcer.validate(schema, { a: 1, b: 2 })).to.throw(/less than or equal/);
            });

            it('same as maximum', () => {
                expect(enforcer.validate(schema, { a: 1 })).to.be.null;
            });

            it('less than maximum', () => {
                expect(enforcer.validate(schema, {})).to.be.null;
            });

        });

        describe('properties', () => {
            const schema = extend(base, {
                properties: {
                    x: { type: 'number' },
                    y: { type: 'boolean' }
                }
            });

            it('valid property values 1', () => {
                expect(enforcer.validate(schema, { x: 1 })).to.be.null;
            });

            it('valid property values 2', () => {
                expect(enforcer.validate(schema, { x: 1, y: true })).to.be.null;
            });

            it('invalid property value', () => {
                expect(() => enforcer.validate(schema, { y: 0 })).to.throw(/Expected a boolean/);
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: [{ x: 1 }] });

            it('in enum', () => {
                expect(enforcer.validate(schema, { x: 1 })).to.be.null;
            });

            it('not in enum 1', () => {
                expect(() => enforcer.validate(schema, { x: 2 })).to.throw(/did not meet enum requirements/i);
            });

            it('not in enum 2', () => {
                expect(() => enforcer.validate(schema, { y: 1 })).to.throw(/did not meet enum requirements/i);
            });

        });

        describe('required', () => {
            const schema = extend(base, { required: ['name'] });

            it('has required property', () => {
                expect(enforcer.validate(schema, { name: true })).to.be.null;
            });

            it('missing required property', () => {
                expect(() => enforcer.validate(schema, { age: true })).to.throw(/required properties missing/);
            });

        });

        describe('allOf', () => {
            const schema = {
                allOf: [
                    { type: 'object', properties: { x: { type: 'number' }} },
                    { type: 'object', properties: { y: { type: 'string' }} }
                ]
            };

            it('both valid', () => {
                expect(enforcer.validate(schema, { x: 2, y: 'hello' })).to.be.null;
            });

            it('first invalid', () => {
                expect(() => enforcer.validate(schema, { x: true, y: 'hello' })).to.throw(/x:\n +expected a number/i);
            });

            it('second invalid', () => {
                expect(() => enforcer.validate(schema, { x: 2, y: 4 })).to.throw(/y:\n +expected a string/i);
            });

            describe('discriminator', () => {
                const schemas = definition.components.schemas;

                it('valid Dog from Pet', () => {
                    expect(enforcer.validate(schemas.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 2 })).to.be.null;
                });

                it('invalid Dog from Pet', () => {
                    expect(() => enforcer.validate(schemas.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 'a' })).to.throw(/expected a number/i);
                });

                it('undefined discriminator', () => {
                    expect(() => enforcer.validate(schemas.Pet, { petType: 'Mouse' })).to.throw(/Unable to map discriminator schema/);
                });

                it('valid Cat from Pet', () => {
                    expect(enforcer.validate(schemas.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 'sneak' })).to.be.null;
                });

                it('invalid Cat from Pet', () => {
                    expect(() => enforcer.validate(schemas.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 1 })).to.throw(/expected a string/i);
                });

                it('valid Dog from Animal', () => {
                    expect(enforcer.validate(schemas.Animal, { animalType: 'Pet', petType: 'Dog', packSize: 2 })).to.be.null;
                });

            });

        });

        describe('anyOf', () => {
            const schema = {
                anyOf: [
                    { type: 'number' },
                    { type: 'boolean' },
                ]
            };

            it('valid 1', () => {
                expect(enforcer.validate(schema, 5)).to.be.null;
            });

            it('valid 2', () => {
                expect(enforcer.validate(schema, true)).to.be.null;
            });

            it('invalid', () => {
                expect(() => enforcer.validate(schema, { x: 'abc' })).to.throw(/Did not validate against one or more anyOf schemas/i);
            });

        });

        describe('oneOf', () => {
            const schema = {
                oneOf: [
                    { type: 'object', properties: { x: { type: 'number', minimum: 2, maximum: 10 } }},
                    { type: 'object', properties: { x: { type: 'number', maximum: 5 } }},
                ]
            };

            it('found 0', () => {
                expect(() => enforcer.validate(schema, { x: 11 })).to.throw(/Did not validate against exactly one oneOf schema/i);
            });

            it('found 1', () => {
                expect(enforcer.validate(schema, { x: 6 })).to.be.null;
            });

            it('found 2', () => {
                expect(() => enforcer.validate(schema, { x: 3 })).to.throw(/Did not validate against exactly one oneOf schema/i);
            });

        });

    });

    describe('string', () => {
        const base = { type: 'string' };

        describe('enum', () => {
            const schema = extend(base, { enum: ['abc'] });

            it('in enum', () => {
                expect(enforcer.validate(schema, 'abc')).to.be.null;
            });

            it('not in enum', () => {
                expect(() => enforcer.validate(schema, 'def')).to.throw(/did not meet enum requirements/i);
            });

        });

    });

    describe('multiple errors', () => {
        const base = { type: 'number', minimum: 10, multipleOf: 5 };

        it('error', () => {
            try {
                enforcer.validate(base, 8);
                throw Error('nope');
            } catch (e) {
                expect(e).to.match(/greater than or equal/);
                expect(e).to.match(/multiple of/);
            }

        });


    });

    describe('v2', () => {
        let enforcer;

        const definition = {
            swagger: '2.0',
            info: {
                title: 'test',
                version: '1.0.0'
            },
            paths: {},
            definitions: createSchemas(2)
        };

        before(() => {
            enforcer = Enforcer(definition);
        });

        describe('object discriminator', () => {

            it('valid Dog from Pet', () => {
                expect(enforcer.validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 2 })).to.be.null;
            });

            it('invalid Dog from Pet', () => {
                expect(() => enforcer.validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 'a' })).to.throw(/expected a number/i);
            });

            it('undefined discriminator', () => {
                expect(() => enforcer.validate(definition.definitions.Pet, { petType: 'Mouse' })).to.throw(/Unable to map discriminator schema/);
            });

            it('valid Cat from Pet', () => {
                expect(enforcer.validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 'sneak' })).to.be.null;
            });

            it('invalid Cat from Pet', () => {
                expect(() => enforcer.validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 1 })).to.throw(/expected a string/i);
            });

            it('valid Dog from Animal', () => {
                expect(enforcer.validate(definition.definitions.Animal, { animalType: 'Pet', petType: 'Dog', packSize: 2 })).to.be.null;
            });

        });
    });

});

function extend(base, extra) {
    return Object.assign({}, base, extra);
}

function createSchemas(version) {
    const Animal = {
        type: 'object',
        discriminator: 'animalType',
        required: ['animalType'],
        properties: {
            animalType: { type: 'string' },
            hasFur: { type: 'boolean' }
        }
    };

    const Pet = {
        type: 'object',
        allOf: [
            Animal,
            {
                type: 'object',
                discriminator: 'petType',
                required: ['petType'],
                properties: {
                    name: { type: 'string' },
                    petType: { type: 'string' }
                }
            }
        ]
    };

    const Cat = {
        allOf: [
            Pet,
            {
                type: 'object',
                required: ['huntingSkill'],
                properties: {
                    huntingSkill: { type: 'string' }
                }
            }
        ]
    };

    const Dog = {
        allOf: [
            Pet,
            {
                type: 'object',
                required: ['packSize'],
                properties: {
                    packSize: { type: 'number' }
                }
            }
        ]
    };

    if (version === 3) {
        Animal.discriminator = {
            propertyName: 'animalType'
        };
        Pet.allOf[1].discriminator = {
            propertyName: 'petType'
        };
    }

    return {
        Animal: Animal,
        Pet: Pet,
        Cat: Cat,
        Dog: Dog
    };
}