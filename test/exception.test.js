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
const Exception     = require('../bin/exception');

describe('OpenAPIException', () => {

    it('header only', () => {
        const exception = new Exception('header');
        expect('' + exception).to.equal('');
    });

    it('nested strings', () => {
        const exception = new Exception('header');
        exception.push('one');
        exception.push('two');
        exception.push('three');
        expect(exception.toString()).to.equal('header:\n  one\n  two\n  three');
    });

    it('nested exceptions', () => {
        const exception = new Exception('header');
        exception.nest('one');
        exception.nest('two');
        expect(String(exception)).to.equal('');
    });

    it('deep nested exceptions', () => {
        const exception = new Exception('header');
        exception.push('one');
        const n2 = exception.nest('two');
        const n3 = n2.nest('a');
        n3.push('x');
        exception.push('three');
        expect('' + exception).to.equal('header:\n  one\n  two:\n    a:\n      x\n  three');
    });

    it('flattened', () => {
        const exception = new Exception('header');
        exception.push('one');
        const n2 = exception.nest('two');
        const n3 = n2.nest('a');
        n3.push('x');
        exception.push('three');
        expect(exception.flatten()).to.deep.equal([
            'header: one',
            'header: two: a: x',
            'header: three'
        ]);
    });

});