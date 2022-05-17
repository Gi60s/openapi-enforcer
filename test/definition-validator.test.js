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
const EnforcerRef   = require('../src/enforcer-ref');
const Enforcer      = require('../index');
const Super         = require('../src/super');

describe('definition-validator', () => {

    before(() => {
        const Enforcers = {};
        Object.defineProperty(Enforcers, 'version', { value: '0.0' });
        Object.assign(Enforcers, {
            X: {
                type: 'object',
                properties: {
                    a: {
                        type: 'number'
                    }
                }
            }
        })
    });

    describe('allowed', () => {

        it('defaults to allowed if property is defined', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: {}
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({ a: 1 });
        });

        it('defaults to disallowed if property is not defined', () => {
            const validator = {
                type: 'object',
                properties: {}
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1 });
            expect(err).to.match(/Property not allowed: a/);
        });

        it('will allow normally unallowed properties if using exception skip code EDEV001', () => {
            const validator = {
                type: 'object',
                properties: {}
            };
            validator.properties.child = validator;
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1, child: { b: 2 } }, null, {
                exceptionSkipCodes: [ 'EDEV001' ]
            });
            expect(err).to.equal(undefined);
        });

        it('can use literal to allow', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { allowed: true }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({ a: 1 });
        });

        it('can use literal to disallow', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { allowed: false }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1 });
            expect(err).to.match(/Property not allowed: a/);
        });

        it('can use literal to disallow multiple', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { allowed: false },
                    b: { allowed: false }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1, b: 1 });
            expect(err).to.match(/Properties not allowed: a, b/);
        });

        it('can use calculated to allow', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { allowed: function() { return true } }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({ a: 1 });
        });

        it('can use calculated to disallow', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { allowed: function() { return false } }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1 });
            expect(err).to.match(/Property not allowed: a/);
        });

        it('can disallow additional properties', () => {
            const validator = {
                type: 'object',
                additionalProperties: {
                    allowed: ({ key }) => key === 'a'
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1, b: 1 });
            expect(err).to.match(/Property not allowed: b/);
        });

    });

    describe('default', () => {

        it('will use default if value not provided', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { default: 0 },
                    b: { default: 0 }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({ a: 1, b: 0 });
        });

    });

    describe('EnforcerRef', () => {
        const B = {
            validator: {
                type: 'object',
                properties: {
                    i: { type: 'number' }
                }
            }
        };

        it('builds sub enforcers', () => {
            const Enforcers = createEnforcerMap({
                A: {
                    validator: {
                        type: 'object',
                        properties: {
                            x: EnforcerRef('B')
                        }
                    }
                },
                B: B
            });
            const [ value ] = new Enforcers.A({ x: { i: 1 } });
            expect(value).to.be.instanceOf(Enforcers.A);
            expect(value.x).to.be.instanceOf(Enforcers.B);
            expect(value.toObject()).to.deep.equal({ x: { i: 1 } });
        });

        it('validates with sub enforcers', () => {
            const Enforcers = createEnforcerMap({
                A: {
                    validator: {
                        type: 'object',
                        properties: {
                            x: EnforcerRef('B')
                        }
                    }
                },
                B: B
            });
            const [ , err ] = new Enforcers.A({ x: { i: true } });
            expect(err).to.match(/at: x > i\s+Value must be a number/);
        });

        describe('sub enforcer property attached validators', () => {

            it('can disallow', () => {
                const Enforcers = createEnforcerMap({
                    A: {
                        validator: {
                            type: 'object',
                            properties: {
                                x: EnforcerRef('B', {
                                    allowed: false
                                })
                            }
                        }
                    },
                    B: B
                });
                const [ , err ] = new Enforcers.A({ x: { i: 1 } });
                expect(err).to.match(/Property not allowed: x/);
            });

            it('can ignore', () => {
                const Enforcers = createEnforcerMap({
                    A: {
                        validator: {
                            type: 'object',
                            properties: {
                                x: EnforcerRef('B', {
                                    ignored: true
                                })
                            }
                        }
                    },
                    B: B
                });
                const [ value ] = new Enforcers.A({ x: { i: 1 } });
                expect(value).to.be.instanceOf(Enforcers.A);
                expect(value.toObject()).to.deep.equal({});
            });

            it('can require', () => {
                const Enforcers = createEnforcerMap({
                    A: {
                        validator: {
                            type: 'object',
                            properties: {
                                x: EnforcerRef('B', {
                                    required: true
                                })
                            }
                        }
                    },
                    B: B
                });
                const [ , err ] = new Enforcers.A({});
                expect(err).to.match(/Missing required property: x/);
            });

        });

        describe('sub enforcer additionalProperties attached validators', () => {

            it('can disallow', () => {
                const Enforcers = createEnforcerMap({
                    A: {
                        validator: {
                            type: 'object',
                            additionalProperties: EnforcerRef('B', {
                                allowed: false
                            })
                        }
                    },
                    B: B
                });
                const [ , err ] = new Enforcers.A({ x: { i: 1 }});
                expect(err).to.match(/Property not allowed: x/);
            });

            it('can ignore', () => {
                const Enforcers = createEnforcerMap({
                    A: {
                        validator: {
                            type: 'object',
                            additionalProperties: EnforcerRef('B', {
                                ignored: true
                            })
                        }
                    },
                    B: B
                });
                const [ value ] = new Enforcers.A({ x: { i: 1 } });
                expect(value).to.be.instanceOf(Enforcers.A);
                expect(value.toObject()).to.deep.equal({});
            });

        });

    });

    describe('enum', () => {

        it('allows an enum value', () => {
            const validator = { type: 'object', additionalProperties: { enum: [1, 2, 3] } };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ x: 1 });
            expect(value.toObject()).to.deep.equal({ x: 1 });
        });

        it('does not allow a non enum value', () => {
            const validator = { type: 'object', additionalProperties: { enum: [1, 2, 3] } };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ x: 4 });
            expect(err).to.match(/at: x\s+Value must be one of: 1, 2, 3/);
        });

    });

    describe('errors', () => {

        it('runs custom error after object properties', () => {
            const validator = {
                type: 'object',
                properties: { a: {} },
                errors: function({ exception }) { exception.message('Pass') }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1 });
            expect(err).to.match(/Pass/);
        });

        it('runs custom error for each property', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: {
                        errors: function({ exception }) { exception.message('Pass') }
                    }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1 });
            expect(err).to.match(/Pass/);
        });

        it('runs custom error after additional properties', () => {
            const validator = {
                type: 'object',
                additionalProperties: {
                    errors: function({ exception }) { exception.message('Pass') }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1 });
            expect(err).to.match(/Pass/);
        });

        it('runs custom error after each additional property', () => {
            const validator = {
                type: 'object',
                additionalProperties: {
                    errors: function({ exception }) { exception.message('Pass') }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ a: 1 });
            expect(err).to.match(/Pass/);
        });

    });

    describe('ignored', () => {

        it('defaults to not ignored', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({ a: 1 });
        });

        it('can use literal true', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { ignored: true }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({});
        });

        it('can use literal false', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { ignored: false }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({ a: 1 });
        });

        it('can use calculated value', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: {
                        ignored: () => true
                    }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1 });
            expect(value.toObject()).to.deep.equal({});
        });

        it('can be used within additional properties', () => {
            const validator = {
                type: 'object',
                additionalProperties: {
                    ignored: ({ key }) => key === 'a'
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: 1, b: 1 });
            expect(value.toObject()).to.deep.equal({ b: 1 });
        });

    });

    describe('items', () => {

        it('can define validator for array definition', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: {
                        type: 'array',
                        items: { type: 'number' }
                    }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ a: [ 1, 2 ] });
            expect(value.toObject()).to.deep.equal({ a: [1, 2] });
        });

    });

    describe('recursion', () => {

        it('handles recursive validators', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { type: 'number' }
                }
            };
            validator.properties.b = validator;
            const Enforcer = createEnforcer({ validator });
            const def = {
                a: 1,
                b: {
                    a: 2,
                    b: {
                        a: 'x'
                    }
                }
            };
            const [ , err ] = new Enforcer(def);
            expect(err).to.match(/at: b > b > a\s+Value must be a number. Received: "x"/);
        });

        it('handles recursive validation definitions', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { type: 'number' }
                }
            };
            validator.properties.b = validator;
            const Enforcer = createEnforcer({ validator });
            const def = {
                a: 1
            };
            def.b = def;
            const [ , err ] = new Enforcer(def);
            expect(err).to.be.undefined;
        });

    });

    describe('required', () => {

        it('defaults to not required', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: {}
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({});
            expect(err).to.be.undefined;
        });

        it('can be literal true', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { required: true }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({});
            expect(err).to.match(/Missing required property: a/);
        });

        it('can be literal false', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { required: false }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({});
            expect(err).to.be.undefined;
        });

        it('can be calculated', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { required: function() { return true } },
                    b: { required: function() { return false } }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({});
            expect(err).to.match(/Missing required property: a/);
        });

        it('can be have multiple required properties', () => {
            const validator = {
                type: 'object',
                properties: {
                    a: { required: true },
                    b: { required: true },
                    c: { required: true }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({});
            expect(err).to.match(/Missing required properties: a, b, c/);
        });

        it('is ignored for additional properties', () => {
            const validator = {
                type: 'object',
                additionalProperties: {
                    required: true
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({});
            expect(err).to.be.undefined;
        });

    });

    describe('type', () => {

        it('allows any type if type not specified', () => {
            const validator = { type: 'object', additionalProperties: {} };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ x: 1, y: true });
            expect(value.toObject()).to.deep.equal({ x: 1, y: true });
        });

        it('allows valid type via literal', () => {
            const validator = { type: 'object', additionalProperties: { type: 'number' } };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ x: 1 });
            expect(value.toObject()).to.deep.equal({ x: 1 });
        });

        it('does not allow invalid type via literal', () => {
            const validator = { type: 'object', additionalProperties: { type: 'number' } };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ x: true });
            expect(err).to.match(/at: x\s+Value must be a number/);
        });

        it('allows one of valid type via literals array', () => {
            const validator = { type: 'object', additionalProperties: { type: ['number', 'boolean'] } };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ x: 1, y: true });
            expect(value.toObject()).to.deep.equal({ x: 1, y: true });
        });

        it('does not allow invalid type via literals array', () => {
            const validator = { type: 'object', additionalProperties: { type: ['number', 'boolean'] } };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ x: {} });
            expect(err).to.match(/at: x\s+Value must be a number or a boolean/);
        });

        it('does not allow invalid type via many literals array', () => {
            const validator = { type: 'object', additionalProperties: { type: ['number', 'boolean', 'string'] } };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ x: {} });
            expect(err).to.match(/at: x\s+Value must be a number, a boolean, or a string/);
        });

        it('allows valid type via calculated', () => {
            const validator = { type: 'object',
                additionalProperties: {
                    type: function () { return ['number', 'boolean'] }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ value ] = new Enforcer({ x: 1, y: true });
            expect(value.toObject()).to.deep.equal({ x: 1, y: true });
        });

        it('does not allow type via calculated', () => {
            const validator = { type: 'object',
                additionalProperties: {
                    type: function () { return ['number', 'boolean'] }
                }
            };
            const Enforcer = createEnforcer({ validator });
            const [ , err ] = new Enforcer({ x: {} });
            expect(err).to.match(/at: x\s+Value must be a number or a boolean/);
        });

    });

    it('properly handles divergent schema re-validation', async () => {
        const def = {
            openapi: '3.0.0',
            info: { title: '', version: '' },
            paths: {
                '/': {
                    get: {
                        parameters: [{
                            in: 'query',
                            name: 'offset',
                            schema: {
                                $ref: '#/components/parameters/offsetParam'
                            }
                        }],
                        responses: {
                            200: { description: 'ok' }
                        }
                    }
                }
            },
            components: {
                parameters: {
                    offsetParam: {
                        name: 'offset',
                        in: 'query',
                        required: false,
                        foo: 'bar',
                        schema: { type: 'integer', minimum: 0, default: 0 }
                    }
                }
            }
        };
        const [ , err ] = await Enforcer(def, { fullResult: true });
        expect(err.count).to.equal(2);
        expect(err).to.match(/Property not allowed: foo/);
        expect(err).to.match(/Properties not allowed:/);
    })

});

function createEnforcer(config) {
    const Enforcers = {};
    Object.defineProperty(Enforcers, 'version', { value: '0.0' });
    Enforcers.Enforcer = Super(Enforcers, 'Enforcer', config);
    return Enforcers.Enforcer;
}

function createEnforcerMap(map) {
    const Enforcers = {};
    Object.defineProperty(Enforcers, 'version', { value: '0.0' });
    Object.keys(map).forEach(key => {
        Enforcers[key] = Super(Enforcers, key, map[key]);
    });
    return Enforcers;
}
