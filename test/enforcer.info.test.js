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
const assert    = require('../src/assert');
const expect    = require('chai').expect;
const Info      = require('../').v2_0.Info;
const License   = require('../').v2_0.License;

describe('enforcer/info', () => {

    it('can have valid definition', () => {
        const [ value ] = new Info({
            title: 'Title',
            version: '1.0',
            license: {
                name: 'Apache-2.0'
            }
        });
        expect(value).to.be.instanceof(Info);
        expect(value.license).to.be.instanceof(License);
    });

    it('will report sub enforcer errors', () => {
        const [ , err ] = new Info({
            title: 'Title',
            version: '1.0',
            license: {
                name: 1
            }
        });
        expect(err).to.match(/at: license > name\s+Value must be a string/);
        expect(err.count).to.equal(1);
    });

    it('will report own errors', () => {
        const [ , err ] = new Info({
            title: 1,
            version: '1.0'
        });
        expect(err).to.match(/at: title\s+Value must be a string/);
        expect(err.count).to.equal(1);
    });

    it('requires the "title" property', () => {
        const [ , err ] = new Info({});
        expect(err).to.match(/Missing required properties: title, version/);
        expect(err.count).to.equal(1);
    });

    it('can have description property', () => {
        const [ def ] = new Info({ title: 'a', version: '1.0', description: 'b' });
        assert.deepEqual(def, { title: 'a', description: 'b', version: '1.0' })
    });

    it('can have contact property', () => {
        const [ def ] = new Info({ title: 'a', version: '1.0', contact: { name: 'Bob', url: 'b' } });
        assert.deepEqual(def, { title: 'a', version: '1.0', contact: { name: 'Bob', url: 'b' } })
    });

    it('will validate contact property', () => {
        const [ , err ] = new Info({ title: 'a', contact: { name: 'Bob', url: 'b', zmail: 'fake@fake.com' }, version: '1' });
        expect(err).to.match(/Property not allowed: zmail/);
        expect(err.count).to.equal(1);
    });

    it('can have license property', () => {
        const [ def ] = new Info({ title: 'a', version: '1.0', license: { name: 'Bob', url: 'b' } });
        assert.deepEqual(def, { title: 'a', version: '1.0', license: { name: 'Bob', url: 'b' } })
    });

    it('will validate license property', () => {
        const [ , err ] = new Info({ title: 'a', version: '1.0', contact: { name: true } });
        expect(err).to.match(/Value must be a string./);
        expect(err.count).to.equal(1);
    });

});
