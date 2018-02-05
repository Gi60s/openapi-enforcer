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

describe('path', () => {

    const inside = {
        in: 'path',
        name: 'inside',
        type: 'string',
        required: true
    };

    const middle = {
        in: 'path',
        name: 'middle',
        type: 'string',
        required: true
    };

    const outside = {
        in: 'path',
        name: 'outside',
        type: 'string',
        required: true
    };

    const definition = {
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0'
        },
        paths: {
            '/abc': {
                get: {

                }
            },
            '/def/{inside}/{middle}/{outside}': {
                get: {
                    parameters: [ inside ]
                },
                parameters: [ middle ]
            }
        },
        parameters: [ outside ]
    };

    let enforcer;

    before(() => {
        enforcer = new SwaggerEnforcer(definition);
    });

    it('unknown path', () => {
        const path = enforcer.path('/xyz');
        expect(path).to.be.undefined;
    });

    describe('path without parameters', () => {
        let path;

        before(() => path = enforcer.path('/abc'));

        it('found path', () => {
            expect(path).not.to.be.null;
        });

        it('path matches', () => {
            expect(path.path).to.equal('/abc');
        });

        it('no parameters', () => {
            expect(path.params).to.deep.equal({});
        });

        it('has schema', () => {
            expect(path.schema).to.deep.equal(definition.paths['/abc']);
        });

    });

    describe('path with parameters', () => {
        let path;

        before(() => path = enforcer.path('/def/x/y/z'));

        it('found path', () => {
            expect(path).not.to.be.undefined;
        });

        it('path matches', () => {
            expect(path.path).to.equal('/def/{inside}/{middle}/{outside}');
        });

        it('no parameters', () => {
            expect(path.params).to.deep.equal({ inside: 'x', middle: 'y', outside: 'z' });
        });

        it('has schema', () => {
            expect(path.schema).to.deep.equal(definition.paths['/def/{inside}/{middle}/{outside}']);
        });

    });

    describe('parameter paths', () => {
        let swagger;

        const pathSchema = {
            responses: { '200': {} }
        };
        const def = {
            swagger: '2.0',
            paths: {
                '/static/path': pathSchema,
                '/{path}': pathSchema,
                '/param/{path}': pathSchema,
                '/param/{path}/value': pathSchema,
                '/param/{path}/value/{x}': pathSchema
            }
        };

        before(() => {
            swagger = new SwaggerEnforcer(def);
        });

        it('start with param', () => {
            expect(swagger.path('/abc')).to.deep.equal({
                params: { path: 'abc' },
                path: '/{path}',
                schema: pathSchema
            });
        });

        it('last param', () => {
            expect(swagger.path('/param/abc')).to.deep.equal({
                params: { path: 'abc' },
                path: '/param/{path}',
                schema: pathSchema
            });
        });

        it('middle param', () => {
            expect(swagger.path('/param/abc/value')).to.deep.equal({
                params: { path: 'abc' },
                path: '/param/{path}/value',
                schema: pathSchema
            });
        });

        it('multiple parameters', () => {
            expect(swagger.path('/param/abc/value/123')).to.deep.equal({
                params: { path: 'abc', x: '123' },
                path: '/param/{path}/value/{x}',
                schema: pathSchema
            });
        });

        it('sub pathing', () => {
            expect(swagger.path('/param/abc/value/123', 'responses/200')).to.deep.equal({
                params: { path: 'abc', x: '123' },
                path: '/param/{path}/value/{x}',
                schema: pathSchema.responses['200']
            });
        });

    });

});