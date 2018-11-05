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
const expect    = require('chai').expect;
const Link      = require('../').v3_0.Link;

describe('enforcer/link', () => {

    describe('description', () => {

        it('can be a string', () => {
            const [ , err ] = new Link({
                description: ''
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ , err ] = new Link({
                description: 1
            });
            expect(err).to.match(/Value must be a string/);
            expect(err.count).to.equal(1);
        });

    });

    describe('operationId', () => {

        it('can be a string', () => {
            const [ , err ] = new Link({
                operationId: 'a'
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ , err ] = new Link({
                operationId: 1
            });
            expect(err).to.match(/Value must be a string/);
            expect(err.count).to.equal(1);
        });

        it('is mutually exclusive of operationRef', () => {
            const [ , err ] = new Link({
                operationId: '',
                operationRef: ''
            });
            expect(err).to.match(/Must not define both operationId and operationRef/);
            expect(err.count).to.equal(1);
        });

    });

    describe('operationRef', () => {

        it('can be a string', () => {
            const [ , err ] = new Link({
                operationRef: 'a'
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ , err ] = new Link({
                operationRef: 1
            });
            expect(err).to.match(/Value must be a string/);
            expect(err.count).to.equal(1);
        });

        it('is mutually exclusive of operationRef', () => {
            const [ , err ] = new Link({
                operationId: '',
                operationRef: ''
            });
            expect(err).to.match(/Must not define both operationId and operationRef/);
            expect(err.count).to.equal(1);
        });

    });

    describe('parameters', () => {

        it('can be an object', () => {
            const [ , err ] = new Link({
                parameters: {}
            });
            expect(err).to.be.undefined;
        });

        it('must be an object', () => {
            const [ , err ] = new Link({
                parameters: []
            });
            expect(err).to.match(/Value must be a plain object/);
            expect(err.count).to.equal(1);
        });

        it('can have any type of value', () => {
            const [ , err ] = new Link({
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
            const [ , err ] = new Link({
                requestBody: 'a'
            });
            expect(err).to.be.undefined;
        });

        it('can be a number', () => {
            const [ , err ] = new Link({
                requestBody: 1
            });
            expect(err).to.be.undefined;
        });

        it('can be an object', () => {
            const [ , err ] = new Link({
                requestBody: {}
            });
            expect(err).to.be.undefined;
        });

    });

    describe('server', () => {

        it('can be a server definition', () => {
            const [ , err ] = new Link({
                server: {
                    url: 'a'
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be a server definition', () => {
            const [ , err ] = new Link({
                server: {}
            });
            expect(err).to.match(/Missing required property: url/);
            expect(err.count).to.equal(1);
        });

    });

});