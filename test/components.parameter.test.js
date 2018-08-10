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


const Exception     = require('../bin/exception');
const expect        = require('chai').expect;
const Parameter     = require('../bin/components/parameter');
const util          = require('../bin/util');

describe('components/parameter', () => {

    describe('definition', () => {

        it('accepts valid definition', () => {
            const { exception } = getParameter(2, { in: 'path', required: true, name: 'x', type: 'string' });
            expect(exception).to.be.false;
        });

        describe('"name" property', () => {

            it('requires "name" property', () => {
                const { exception } = getParameter(2, { in: 'path', required: true, type: 'string' });
                expect(exception).to.match(/Missing required property: name/);
            });

            it('requires "name" property to be a non-empty string', () => {
                const { exception } = getParameter(2, { in: 'path', required: true, name: 1, type: 'string' });
                expect(exception).to.match(/Value for property "name" must be a string/);
            });

        });

        describe('"in" property', () => {

            it('requires "in" property', () => {
                const { exception } = getParameter(2, { required: true, name: 'x', type: 'string' });
                expect(exception).to.match(/Missing required property: in/);
            });

            it('requires valid "in" property', () => {
                const { exception } = getParameter(2, { in: 'foo', required: true, name: 'x', type: 'string' });
                expect(exception).to.match(/Property "in" has invalid value/);
            });

        });

        describe('"required" property', () => {

            it('requires that "required" be a boolean', () => {
                const { exception } = getParameter(2, { in: 'query', required: 1, name: 'x', type: 'string' });
                expect(exception).to.match(/Value for property "required" must be a boolean/);
            });

            it('requires that "required" be true when "in" is "path"', () => {
                const { exception } = getParameter(2, { in: 'path', required: false, name: 'x', type: 'string' });
                expect(exception).to.match(/Value must be true/);
            });

            it('allows "required" to be false for non "path"', () => {
                const { exception } = getParameter(2, { in: 'query', required: false, name: 'x', type: 'string' });
                expect(exception).to.be.false;
            });

            it('defaults to false', () => {
                const { parameter } = getParameter(2, { in: 'query', name: 'x', type: 'string' });
                expect(parameter.required).to.be.false;
            });

        });

        describe('"allowEmptyValue" property', () => {

            it('is valid for "query"', () => {
                const { exception } = getParameter(2, { in: 'query', name: 'x', type: 'string', allowEmptyValue: true });
                expect(exception).to.be.false;
            });

            it('is not valid for "path"', () => {
                const { exception } = getParameter(2, { in: 'path', required: true, name: 'x', type: 'string', allowEmptyValue: true });
                expect(exception).to.match(/Property not allowed: allowEmptyValue/);
            });

            it('defaults to false', () => {
                const { parameter } = getParameter(2, { in: 'query', name: 'x', type: 'string' });
                expect(parameter.allowEmptyValue).to.be.false;
            });

        });

        // describe('v2', () => {
        //
        //
        //
        // });

    });

});

function getParameter(version, definition) {
    const exception = Exception('');
    const parameter = new Parameter({ version }, exception, definition, new WeakMap());
    return { exception: exception.hasException ? exception: false, parameter };
}