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
const expect            = require('chai').expect;
const util              = require('../bin/util');

describe('util', () => {

    describe('copy', () => {

        it('can copy primitive', () => {
            expect(util.copy(5)).to.equal(5);
        });

        it('can copy Date', () => {
            const date = new Date();
            const copy = util.copy(date);
            expect(copy).to.not.equal(date);
            expect(copy.toISOString()).to.equal(date.toISOString());
        });

        it('can copy buffer', () => {
            const buffer = Buffer.from ? Buffer.from('abcdefg') : new Buffer('abcdefg');
            const copy = util.copy(buffer);
            expect(copy).to.not.equal(buffer);
            expect(copy.toString()).to.equal(buffer.toString());
        });

        it('can copy object', () => {
            const value = {
                a: 1,
                b: {
                    x: 'x',
                    y: {
                        y1: [ 1, 2, 3 ]
                    }
                }
            };
            const copy = util.copy(value);
            expect(copy).to.not.equal(value);
            expect(copy.b).to.not.equal(value.b);
            expect(copy.b.y).to.not.equal(value.b.y);
            expect(copy.b.y.y1).to.not.equal(value.b.y.y1);
            expect(copy).to.deep.equal(value);
        });

        it('can copy array', () => {
            const value = [ 1, {}, [ 2, 'a' ] ];
            const copy = util.copy(value);
            expect(copy).to.not.equal(value);
            expect(copy[1]).to.not.equal(value[1]);
            expect(copy[2]).to.not.equal(value[2]);
            expect(copy).to.deep.equal(value);
        });

        it('can copy circular', () => {
            const value = { array: [] };
            value.object = value;
            value.array.push(value.array);
            const copy = util.copy(value);
            expect(copy).to.not.equal(value);
            expect(copy.object).to.not.equal(value.object);
            expect(copy.array).to.not.equal(value.array);
            expect(copy).to.deep.equal(value);
        });

    });

    describe('media match', () => {

        it('no match', () => {
            const matches = util.findMediaMatch('text/plain', ['x/y', 'x/z']);
            expect(matches.length).to.equal(0);
        });

        it('text match', () => {
            const accept = 'text/html, application/xhtml';
            const store = ['text/plain', 'text/html'];
            const matches = util.findMediaMatch(accept, store);
            expect(matches).to.deep.equal(['text/html']);
        });

        it('wildcard subtype match', () => {
            const accept = 'text/*';
            const store = ['text/plain', 'text/html'];
            const matches = util.findMediaMatch(accept, store);
            expect(matches).to.deep.equal(['text/plain', 'text/html']);
        });

        it('wildcard type match', () => {
            const accept = '*/plain';
            const store = ['text/plain', 'something/plain'];
            const matches = util.findMediaMatch(accept, store);
            expect(matches).to.deep.equal(['text/plain', 'something/plain']);
        });

        it('multiple accept', () => {
            const accept = 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8';
            const store = ['text/plain', 'text/html', 'application/xml', 'application/xhtml'];
            const matches = util.findMediaMatch(accept, store);
            expect(matches).to.deep.equal(['text/html', 'application/xhtml', 'application/xml', 'text/plain']);
        });

        it('specified extension match', () => {
            const accept = 'application/json+abc';
            const store = ['application/json+xyz', 'application/json', 'application/json+abc'];
            const matches = util.findMediaMatch(accept, store);
            expect(matches).to.deep.equal(['application/json+abc', 'application/json']);
        });

        it('non specified extension match', () => {
            const accept = 'application/json';
            const store = ['application/json+xyz', 'application/json', 'application/json+abc'];
            const matches = util.findMediaMatch(accept, store);
            expect(matches).to.deep.equal(['application/json', 'application/json+xyz', 'application/json+abc']);
        });

    });

});