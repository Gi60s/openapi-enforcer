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
const definition    = require('../bin/definition/index').normalize;
const expect        = require('chai').expect;
const Tag           = require('../bin/definition/tag');

describe('definitions/tag', () => {

    it('allows a valid tag object', () => {
        const [ err ] = definition(2, Tag, { name: 'hi' });
        expect(err).to.be.undefined;
    });

    it('requires the "name" property', () => {
        const [ err ] = definition(2, Tag, {});
        expect(err).to.match(/Missing required property: name/);
    });

    it('can have description property', () => {
        const [ err, def ] = definition(2, Tag, { name: 'a', description: 'b' });
        expect(def).to.deep.equal({ name: 'a', description: 'b' })
    });

    it('can have externalDocs property', () => {
        const [ err, def ] = definition(2, Tag, { name: 'a', externalDocs: { url: 'b' } });
        expect(def).to.deep.equal({ name: 'a', externalDocs: { url: 'b' } })
    });

    it('requires nested definition to be valid', () => {
        const [ err ] = definition(2, Tag, { name: 'a', externalDocs: { a: 'b' } });
        expect(err).to.match(/Missing required property: url/);
    });

    it('can have extension property', () => {
        const [ err, def ] = definition(2, Tag, { name: 'a', 'x-prop': 'b' });
        expect(def).to.deep.equal({ name: 'a', 'x-prop': 'b' })
    });

    it('cannot have other property', () => {
        const [ err ] = definition(2, Tag, { name: 'a', other: 'b' });
        expect(err).to.match(/Property not allowed: other/);
    });

});