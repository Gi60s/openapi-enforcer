/**
 *  @license
 *    Copyright 2017 Brigham Young University
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
const SwaggerEnforcer   = require('../index');
const expect            = require('chai').expect;

describe('validate', () => {

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
    let validate;

    before(() => {
        enforcer = new SwaggerEnforcer(definition);
        validate = function(schema, value) {
            return enforcer.errors(schema, value);
        };
    });

    describe('array', () => {
        const base = { type: 'array', items: { type: 'number' } };

        it('is array', () => {
            const errors = validate(base, 5);
            expect(errors[0]).to.match(/expected an array/i);
        });

        describe('max items 10 no min items', () => {
            const schema = extend(base, { maxItems: 10 });

            it('zero items', () => {
                const errors = validate(schema, []);
                expect(errors).to.be.null;
            });

            it('11 items', () => {
                const errors = validate(schema, [1,2,3,4,5,6,7,8,9,10,11]);
                expect(errors[0]).to.match(/array length above maximum/i);
            });

        });

        describe('min items 2 no max items', () => {
            const schema = extend(base, { minItems: 2 });

            it('zero items', () => {
                const errors = validate(schema, []);
                expect(errors[0]).to.match(/array length below minimum/i);
            });

            it('3 items', () => {
                const errors = validate(schema, [1,2,3]);
                expect(errors).to.be.null;
            });

        });

        describe('unique items', () => {
            const schema = extend(base, { uniqueItems: true });

            it('unique', () => {
                const errors = validate(schema, [1,2,3]);
                expect(errors).to.be.null;
            });

            it('duplicate', () => {
                const errors = validate(schema, [1,2,1]);
                expect(errors[0]).to.match(/array values must be unique/i);
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: [[1,2], [3,4]] });

            it('in enum 1', () => {
                const errors = validate(schema, [1,2]);
                expect(errors).to.be.null;
            });

            it('in enum 2', () => {
                const errors = validate(schema, [3,4]);
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, [1,2,1]);
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('binary', () => {
        const base = { type: 'string', format: 'binary' };

        it('is binary', () => {
            const errors = validate(base, '00110011');
            expect(errors).to.be.null;
        });

        it('is not binary', () => {
            const errors = validate(base, 'abc');
            expect(errors[0]).to.match(/Expected a binary string/i);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['00110011'] });

            it('in enum', () => {
                const errors = validate(schema, '00110011');
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, '10101010');
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('boolean', () => {
        const base = { type: 'boolean' };

        it('is true', () => {
            const errors = validate(base, true);
            expect(errors).to.be.null;
        });

        it('is false', () => {
            const errors = validate(base, false);
            expect(errors).to.be.null;
        });

        it('is zero', () => {
            const errors = validate(base, 0);
            expect(errors[0]).to.match(/Expected a boolean/);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: [true] });

            it('in enum', () => {
                const errors = validate(schema, true);
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, false);
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('byte', () => {
        const base = { type: 'string', format: 'byte' };

        it('is byte', () => {
            const errors = validate(base, 'Aa==');
            expect(errors).to.be.null;
        });

        it('has invalid character', () => {
            const errors = validate(base, 'Aa%%');
            expect(errors[0]).to.match(/Expected a base64 string/i);
        });

        it('has invalid length', () => {
            const errors = validate(base, 'Aa=');
            expect(errors[0]).to.match(/Expected a base64 string/i);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['Aa=='] });

            it('in enum', () => {
                const errors = validate(schema, 'Aa==');
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, 'Bb==');
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('date', () => {
        const base = { type: 'string', format: 'date' };

        it('valid date', () => {
            const errors = validate(base, '2000-01-01');
            expect(errors).to.be.null;
        });

        it('invalid date', () => {
            const errors = validate(base, 'abc');
            expect(errors[0]).to.match(/full-date string/);
        });

        it('out of bounds date', () => {
            const errors = validate(base, '2000-02-31');
            expect(errors[0]).to.match(/date does not exist/);
        });

        describe('minimum', () => {
            const schema = extend(base, { minimum: '2000-01-02' });

            it('above minimum', () => {
                const errors = validate(schema, '2000-01-03');
                expect(errors).to.be.null;
            });

            it('at minimum', () => {
                const errors = validate(schema, '2000-01-02');
                expect(errors).to.be.null;
            });

            it('below minimum', () => {
                const errors = validate(schema, '2000-01-01');
                expect(errors[0]).to.match(/greater than or equal/);
            });

        });

        describe('maximum', () => {
            const schema = extend(base, { maximum: '2000-01-02' });

            it('above maximum', () => {
                const errors = validate(schema, '2000-01-03');
                expect(errors[0]).to.match(/less than or equal/);
            });

            it('at maximum', () => {
                const errors = validate(schema, '2000-01-02');
                expect(errors).to.be.null;
            });

            it('below maximum', () => {
                const errors = validate(schema, '2000-01-01');
                expect(errors).to.be.null;
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['2000-01-01'] });

            it('in enum', () => {
                const errors = validate(schema, '2000-01-01');
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, '2001-02-02');
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('date-time', () => {
        const base = { type: 'string', format: 'date-time' };

        it('valid date-time', () => {
            const errors = validate(base, '2000-01-01T00:00:00.000Z');
            expect(errors).to.be.null;
        });

        it('out of bounds time', () => {
            const errors = validate(base, '2000-01-01T24:00:00.000Z');
            expect(errors[0]).to.match(/time is invalid/);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: ['2000-01-01T00:00:00.000Z'] });

            it('in enum', () => {
                const errors = validate(schema, '2000-01-01T00:00:00.000Z');
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, '2001-01-01T00:00:00.000Z');
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('integer', () => {
        const base = { type: 'integer' };

        it('is an integer', () => {
            const errors = validate(base, 5);
            expect(errors).to.be.null;
        });

        it('is a number with decimal', () => {
            const errors = validate(base, 1.5);
            expect(errors[0]).to.match(/Expected an integer/);
        });

        describe('multiple of', () => {
            const schema = extend(base, { multipleOf: 2 });

            it('is multiple of 2', () => {
                const errors = validate(schema, 4);
                expect(errors).to.be.null;
            });

            it('is not a multiple of 2', () => {
                const errors = validate(schema, 5);
                expect(errors[0]).to.match(/Expected a multiple/);
            });

        });

        describe('minimum', () => {
            const schema = extend(base, { minimum: 2 });

            it('above minimum', () => {
                const errors = validate(schema, 3);
                expect(errors).to.be.null;
            });

            it('at minimum', () => {
                const errors = validate(schema, 2);
                expect(errors).to.be.null;
            });

            it('below minimum', () => {
                const errors = validate(schema, 1);
                expect(errors[0]).to.match(/greater than or equal/);
            });

        });

        describe('exclusive minimum', () => {
            const schema = extend(base, { minimum: 2, exclusiveMinimum: true });

            it('above minimum', () => {
                const errors = validate(schema, 3);
                expect(errors).to.be.null;
            });

            it('at minimum', () => {
                const errors = validate(schema, 2);
                expect(errors[0]).to.match(/greater than 2/);
            });

            it('below minimum', () => {
                const errors = validate(schema, 1);
                expect(errors[0]).to.match(/greater than 2/);
            });

        });

        describe('maximum', () => {
            const schema = extend(base, { maximum: 2 });

            it('above maximum', () => {
                const errors = validate(schema, 3);
                expect(errors[0]).to.match(/less than or equal/);
            });

            it('at maximum', () => {
                const errors = validate(schema, 2);
                expect(errors).to.be.null;
            });

            it('below maximum', () => {
                const errors = validate(schema, 1);
                expect(errors).to.be.null;
            });

        });

        describe('exclusive maximum', () => {
            const schema = extend(base, { maximum: 2, exclusiveMaximum: true });

            it('above maximum', () => {
                const errors = validate(schema, 3);
                expect(errors[0]).to.match(/less than 2/);
            });

            it('at maximum', () => {
                const errors = validate(schema, 2);
                expect(errors[0]).to.match(/less than 2/);
            });

            it('below maximum', () => {
                const errors = validate(schema, 1);
                expect(errors).to.be.null;
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: [1] });

            it('in enum', () => {
                const errors = validate(schema, 1);
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, 2);
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('number', () => {
        const base = { type: 'number' };

        it('is a number', () => {
            const errors = validate(base, 1.2);
            expect(errors).to.be.null;
        });

        it('is not a number', () => {
            const errors = validate(base, 'a');
            expect(errors[0]).to.match(/Expected a number/);
        });

        describe('enum', () => {
            const schema = extend(base, { enum: [1.2] });

            it('in enum', () => {
                const errors = validate(schema, 1.2);
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, 1.3);
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('object', () => {
        const base = { type: 'object' };

        describe('minimum properties', () => {
            const schema = extend(base, { minProperties: 1 });

            it('more than minimum', () => {
                const errors = validate(schema, { a: 1, b: 2 });
                expect(errors).to.be.null;
            });

            it('same as minimum', () => {
                const errors = validate(schema, { a: 1 });
                expect(errors).to.be.null;
            });

            it('less than minimum', () => {
                const errors = validate(schema, {});
                expect(errors[0]).to.match(/greater than or equal/);
            });

        });

        describe('maximum properties', () => {
            const schema = extend(base, { maxProperties: 1 });

            it('more than maximum', () => {
                const errors = validate(schema, { a: 1, b: 2 });
                expect(errors[0]).to.match(/less than or equal/);
            });

            it('same as maximum', () => {
                const errors = validate(schema, { a: 1 });
                expect(errors).to.be.null;
            });

            it('less than maximum', () => {
                const errors = validate(schema, {});
                expect(errors).to.be.null;
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
                const errors = validate(schema, { x: 1 });
                expect(errors).to.be.null;
            });

            it('valid property values 2', () => {
                const errors = validate(schema, { x: 1, y: true });
                expect(errors).to.be.null;
            });

            it('invalid property value', () => {
                const errors = validate(schema, { y: 0 });
                expect(errors[0]).to.match(/Expected a boolean/);
            });

        });

        describe('enum', () => {
            const schema = extend(base, { enum: [{ x: 1 }] });

            it('in enum', () => {
                const errors = validate(schema, { x: 1 });
                expect(errors).to.be.null;
            });

            it('not in enum 1', () => {
                const errors = validate(schema, { x: 2 });
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

            it('not in enum 2', () => {
                const errors = validate(schema, { y: 1 });
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

        describe('required', () => {
            const schema = extend(base, { required: ['name'] });

            it('has required property', () => {
                const errors = validate(schema, { name: true });
                expect(errors).to.be.null;
            });

            it('missing required property', () => {
                const errors = validate(schema, { age: true });
                expect(errors[0]).to.match(/required properties missing/);
            });

        });

        describe('allOf', () => {
            const schema = {
                allOf: [
                    { properties: { x: { type: 'number' }} },
                    { properties: { y: { type: 'string' }} }
                ]
            };

            it('both valid', () => {
                const errors = validate(schema, { x: 2, y: 'hello' });
                expect(errors).to.be.null;
            });

            it('first invalid', () => {
                const errors = validate(schema, { x: true, y: 'hello' });
                expect(errors.length).to.equal(1);
                expect(errors[0]).to.match(/x: expected a number/i);
            });

            it('second invalid', () => {
                const errors = validate(schema, { x: 2, y: 4 });
                expect(errors.length).to.equal(1);
                expect(errors[0]).to.match(/y: expected a string/i);
            });

            describe('discriminator', () => {
                const schemas = definition.components.schemas;

                it('valid Dog from Pet', () => {
                    const errors = validate(schemas.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 2 });
                    expect(errors).to.be.null;
                });

                it('invalid Dog from Pet', () => {
                    const errors = validate(schemas.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 'a' });
                    expect(errors[0]).to.match(/expected a number/i);
                });

                it('undefined discriminator', () => {
                    const errors = validate(schemas.Pet, { petType: 'Mouse' });
                    expect(errors[0]).to.match(/Undefined discriminator schema/);
                });

                it('valid Cat from Pet', () => {
                    const errors = validate(schemas.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 'sneak' });
                    expect(errors).to.be.null;
                });

                it('invalid Cat from Pet', () => {
                    const errors = validate(schemas.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 1 });
                    expect(errors[0]).to.match(/expected a string/i);
                });

                it('valid Dog from Animal', () => {
                    const errors = validate(schemas.Animal, { animalType: 'Pet', petType: 'Dog', packSize: 2 });
                    expect(errors).to.be.null;
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
                const errors = validate(schema, 5);
                expect(errors).to.be.null;
            });

            it('valid 2', () => {
                const errors = validate(schema, true);
                expect(errors).to.be.null;
            });

            it('invalid', () => {
                const errors = validate(schema, { x: 'abc' });
                expect(errors[0]).to.match(/Did not match any/i);
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
                const errors = validate(schema, { x: 11 });
                expect(errors[0]).to.match(/Did not match exactly one/i);
            });

            it('found 1', () => {
                const errors = validate(schema, { x: 6 });
                expect(errors).to.be.null;
            });

            it('found 2', () => {
                const errors = validate(schema, { x: 3 });
                expect(errors[0]).to.match(/Did not match exactly one/i);
            });

        });

    });

    describe('string', () => {
        const base = { type: 'string' };

        describe('enum', () => {
            const schema = extend(base, { enum: ['abc'] });

            it('in enum', () => {
                const errors = validate(schema, 'abc');
                expect(errors).to.be.null;
            });

            it('not in enum', () => {
                const errors = validate(schema, 'def');
                expect(errors[0]).to.match(/did not meet enum requirements/i);
            });

        });

    });

    describe('multiple errors', () => {
        const base = { type: 'number', minimum: 10, multipleOf: 5 };

        it('error', () => {
            const errors = enforcer.errors(base, 8);
            expect(errors.length).to.equal(2);
            expect(errors[0]).to.match(/greater than or equal/);
            expect(errors[1]).to.match(/multiple of/);
        });

        it('validate', () => {
            const err = Error('Not this one');
            try {
                enforcer.validate(base, 8);
                throw err;
            } catch (e) {
                expect(e.message).to.match(/one or more errors/i);
            }
        });


    });

    describe('v2', () => {
        let validate;

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
            const enforcer = SwaggerEnforcer(definition);
            validate = function(schema, value) {
                return enforcer.errors(schema, value);
            };
        });

        describe('object discriminator', () => {

            it('valid Dog from Pet', () => {
                const errors = validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 2 });
                expect(errors).to.be.null;
            });

            it('invalid Dog from Pet', () => {
                const errors = validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Dog', packSize: 'a' });
                expect(errors[0]).to.match(/expected a number/i);
            });

            it('undefined discriminator', () => {
                const errors = validate(definition.definitions.Pet, { petType: 'Mouse' });
                expect(errors[0]).to.match(/Undefined discriminator schema/);
            });

            it('valid Cat from Pet', () => {
                const errors = validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 'sneak' });
                expect(errors).to.be.null;
            });

            it('invalid Cat from Pet', () => {
                const errors = validate(definition.definitions.Pet, { animalType: 'Pet', petType: 'Cat', huntingSkill: 1 });
                expect(errors[0]).to.match(/expected a string/i);
            });

            it('valid Dog from Animal', () => {
                const errors = validate(definition.definitions.Animal, { animalType: 'Pet', petType: 'Dog', packSize: 2 });
                expect(errors).to.be.null;
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
        discriminator: version === 2
            ? 'animalType'
            : { propertyName: 'animalType' },
        properties: {
            classification: { type: 'string' },
            hasFur: { type: 'boolean' }
        },
        required: ['animalType']
    };

    const Pet = {
        type: 'object',
        allOf: [
            Animal,
            {
                type: 'object',
                discriminator: version === 2
                    ? 'petType'
                    : { propertyName: 'petType' },
                properties: {
                    name: { type: 'string' },
                    petType: { type: 'string' }
                },
                required: ['petType']
            }
        ]
    };

    const Cat = {
        type: 'object',
        allOf: [
            Pet,
            {
                type: 'object',
                properties: {
                    huntingSkill: { type: 'string' }
                },
                required: ['huntingSkill']
            }
        ]
    };

    const Dog = {
        type: 'object',
        allOf: [
            Pet,
            {
                type: 'object',
                properties: {
                    packSize: { type: 'number' }
                },
                required: ['packSize']
            }
        ]
    };

    return {
        Animal: Animal,
        Pet: Pet,
        Cat: Cat,
        Dog: Dog
    };
}