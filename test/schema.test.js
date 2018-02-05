/**
 *  @license
 *    Copyright 2017 Brigham Young University
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
const SwaggerEnforcer   = require('../index');

describe('#schema', () => {
    let swagger;
    const def = {
        swagger: '2.0',
        definitions: {
            examples: {
                application: {
                    json: 6
                },
                'application/json/xml': 7
            }
        },
        paths: {}
    };

    before(() => {
        swagger = new SwaggerEnforcer(def);
    });

    it('defaults to get full schema', () => {
        expect(swagger.schema()).to.deep.equal(def);
    });

    it('empty path gets full schema', () => {
        expect(swagger.schema('')).to.deep.equal(def);
    });

    it('slash path gets full schema', () => {
        expect(swagger.schema('/')).to.deep.equal(def);
    });

    it('simple path', () => {
        expect(swagger.schema('/definitions')).to.deep.equal(def.definitions);
    });

    it('deep path', () => {
        expect(swagger.schema('/definitions/examples/application/json')).to.equal(def.definitions.examples.application.json);
    });

    it('compound key', () => {
        expect(swagger.schema('/definitions/examples/application//json//xml')).to.equal(def.definitions.examples['application/json/xml']);
    });

});