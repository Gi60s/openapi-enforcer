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
const expect        = require('chai').expect;
const Link          = require('../bin/definition-validators/link');

describe('definitions/link', () => {

    describe('description', () => {

        it('can be a string', () => {
            const [ err ] = definition(3, Link, {
                description: ''
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ err ] = definition(3, Link, {
                description: 1
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('operationId', () => {

        it('can be a string', () => {
            const [ err ] = definition(3, Link, {
                operationId: 'a'
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ err ] = definition(3, Link, {
                operationId: 1
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('is mutually exclusive of operationRef', () => {
            const [ err ] = definition(3, Link, {
                operationId: '',
                operationRef: ''
            });
            expect(err).to.match(/Must not define both operationId and operationRef/);
        });

    });

    describe('operationRef', () => {

        it('can be a string', () => {
            const [ err ] = definition(3, Link, {
                operationRef: 'a'
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ err ] = definition(3, Link, {
                operationRef: 1
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('is mutually exclusive of operationRef', () => {
            const [ err ] = definition(3, Link, {
                operationId: '',
                operationRef: ''
            });
            expect(err).to.match(/Must not define both operationId and operationRef/);
        });

    });

    describe('parameters', () => {

        it('can be an object', () => {
            const [ err ] = definition(3, Link, {
                parameters: {}
            });
            expect(err).to.be.undefined;
        });

        it('must be an object', () => {
            const [ err ] = definition(3, Link, {
                parameters: []
            });
            expect(err).to.match(/Value must be a plain object/);
        });

        it('can have any type of value', () => {
            const [ err ] = definition(3, Link, {
                parameters: {
                    a: 1,
                    b: '2',
                    c: true,
                    d: {},
                    f: []
                }
            });
            expect(err).to.be.undefined;
        });

    });

    describe('requestBody', () => {

        it('can be a string', () => {
            const [ err ] = definition(3, Link, {
                requestBody: 'a'
            });
            expect(err).to.be.undefined;
        });

        it('can be a number', () => {
            const [ err ] = definition(3, Link, {
                requestBody: 1
            });
            expect(err).to.be.undefined;
        });

        it('can be an object', () => {
            const [ err ] = definition(3, Link, {
                requestBody: {}
            });
            expect(err).to.be.undefined;
        });

    });

    describe('server', () => {

        it('can be a server definition', () => {
            const [ err ] = definition(3, Link, {
                server: {
                    url: 'a'
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be a server definition', () => {
            const [ err ] = definition(3, Link, {
                server: {}
            });
            expect(err).to.match(/Missing required property: url/);
        });

    });

});