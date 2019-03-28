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
const assert                = require('../src/assert');
const expect                = require('chai').expect;
const ExternalDocumentation = require('../').v2_0.ExternalDocumentation;

describe('enforcer/external-documentation', () => {

    it('allows a valid external-documentation object', () => {
        const [ , err ] = new ExternalDocumentation({ url: 'hi' });
        expect(err).to.be.undefined;
    });

    it('requires the "url" property', () => {
        const [ , err ] = new ExternalDocumentation({});
        expect(err).to.match(/Missing required property: url/);
        expect(err.count).to.equal(1);
    });

    it('can have description property', () => {
        const [ def ] = new ExternalDocumentation({ url: 'a', description: 'b' });
        assert.deepEqual(def, { url: 'a', description: 'b' });
    });

    it('can have extension property', () => {
        const [ def ] = new ExternalDocumentation({ url: 'a', 'x-prop': 'b' });
        assert.deepEqual(def, { url: 'a', 'x-prop': 'b' })
    });

    it('cannot have other property', () => {
        const [ , err ] = new ExternalDocumentation({ url: 'a', other: 'b' });
        expect(err).to.match(/Property not allowed: other/);
        expect(err.count).to.equal(1);
    });

});
