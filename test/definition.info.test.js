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
const Info          = require('../bin/definition/info');

describe('definitions/info', () => {

    it('allows a valid tag info', () => {
        const [ err ] = definition(2, Info, { title: 'hi', version: '1.0' });
        expect(err).to.be.undefined;
    });

    it('requires the "title" property', () => {
        const [ err ] = definition(2, Info, {});
        expect(err).to.match(/Missing required properties: title, version/);
    });

    it('can have description property', () => {
        const [, def ] = definition(2, Info, { title: 'a', version: '1.0', description: 'b' });
        expect(def).to.deep.equal({ title: 'a', description: 'b', version: '1.0' })
    });

    it('can have contact property', () => {
        const [, def ] = definition(2, Info, { title: 'a', version: '1.0', contact: { name: 'Bob', url: 'b' } });
        expect(def).to.deep.equal({ title: 'a', version: '1.0', contact: { name: 'Bob', url: 'b' } })
    });

    it('will validate contact property', () => {
        const [ err ] = definition(2, Info, { title: 'a', contact: { name: 'Bob', url: 'b', zmail: 'fake@fake.com' } });
        expect(err).to.match(/Property not allowed: zmail/);
    });

    it('can have license property', () => {
        const [, def ] = definition(2, Info, { title: 'a', version: '1.0', license: { name: 'Bob', url: 'b' } });
        expect(def).to.deep.equal({ title: 'a', version: '1.0', license: { name: 'Bob', url: 'b' } })
    });

    it('will validate license property', () => {
        const [ err ] = definition(2, Info, { title: 'a', version: '1.0', contact: { name: true } });
        expect(err).to.match(/Value for property "name" must be a string./);
    });

});