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
const Enforcer      = require('../');
const expect        = require('chai').expect;
const path          = require('path');
const Response2     = require('../').v2_0.Response;
const Response3     = require('../').v3_0.Response;

describe('enforcer/response', () => {

    it('allows a valid definition', () => {
        const [ , err ] = new Response2({
            description: 'hello'
        });
        expect(err).to.be.undefined;
    });

    it('requires a description', () => {
        const [ , err ] = new Response2({
        });
        expect(err).to.match(/Missing required property: description/);
        expect(err.count).to.equal(1);
    });

    describe('content', () => {

        it('is not allowed in v2', () => {
            const [ , err ] = new Response2({
                description: '',
                content: {
                    'text/plain': {}
                }
            });
            expect(err).to.match(/Property not allowed: content/);
            expect(err.count).to.equal(1);
        });

        it('is allowed in v3', () => {
            const [ , err ] = new Response3({
                description: '',
                content: {
                    'text/plain': {}
                }
            });
            expect(err).to.be.undefined;
        });

        it('warns for odd media type', () => {
            const [ , , warning ] = new Response3({
                description: '',
                content: {
                    'foo/plain': {}
                }
            });
            expect(warning).to.match(/Media type appears invalid/);
            expect(warning.count).to.equal(1);
        });

    });

    describe('examples', () => {

        it('accepts string', () => {
            const [ def ] = new Response2({
                description: '',
                examples: {
                    'text/plain': 'hello'
                }
            });
            expect(def.examples['text/plain']).to.equal('hello')
        });

        it('accepts object', () => {
            const [ def, err ] = new Response2({
                description: '',
                examples: {
                    'application/json': { x: 'hello' }
                }
            });
            assert.deepEqual(def.examples['application/json'], { x: 'hello' })
        });

        it('is not allowed for v3', () => {
            const [ , err ] = new Response3({
                description: 'hello',
                examples: {}
            });
            expect(err).to.match(/Property not allowed: examples/);
            expect(err.count).to.equal(1);
        });

    });

    describe('headers', () => {

        it('accepts a header', () => {
            const [ , err ] = new Response3({
                description: '',
                headers: {
                    'x-header': {
                        schema: {
                            type: 'string'
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('does not care about header case', async () => {
            const [ openapi, , warn ] = await Enforcer(path.resolve(__dirname, '..', 'test-resources', 'issue-60', 'openapi.yml'), { fullResult: true });
            expect(warn).to.equal(undefined);
            expect(openapi.paths['/cased'].post.responses[201].headers).to.haveOwnProperty('Location');
        });

        it('has style limited to "simple"', () => {
            const [ , err ] = new Response3({
                description: '',
                headers: {
                    'x-header': {
                        schema: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        style: 'form'
                    }
                }
            });
            console.error(err.toString());
            expect(err).to.match(/Value must be "simple"/);
            expect(err.count).to.equal(1);
        });

    });

    describe('links', () => {

        it('is not allowed for v2', () => {
            const [ , err ] = new Response2({
                description: '',
                links: {}
            });
            expect(err).to.match(/Property not allowed: links/);
        });

        it('is allowed for v3', () => {
            const [ , err ] = new Response3({
                description: '',
                links: {
                    abc: {}
                }
            });
            expect(err).to.be.undefined;
        });

        it('must meet naming conventions', () => {
            const [ , err ] = new Response3({
                description: '',
                links: {
                    '$hi': {}
                }
            });
            expect(err).to.match(/Invalid key used for link value/);
            expect(err.count).to.equal(1);
        });

    });

    describe('schema', () => {

        it('is allowed for v2', () => {
            const [ , err ] = new Response2({
                description: '',
                schema: {
                    type: 'string'
                }
            });
            expect(err).to.be.undefined;
        });

        it('is not allowed for v3', () => {
            const [ , err ] = new Response3({
                description: '',
                schema: {
                    type: 'string'
                }
            });
            expect(err).to.match(/Property not allowed: schema/);
        });

    });

});
