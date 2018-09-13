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
const OpenAPI       = require('../bin/definition-validators/open-api');

describe.only('definitions/open-api', () => {

    it('TODO', () => {
        throw Error("TODO");
    });

    describe('basePath', () => {

        it('is not allowed in v3', () => {

        });

        it('must be a string', () => {

        });

        it('must start with a leading slash (/)', () => {

        });

    });

    describe('components', () => {

        it('is not allowed for v2', () => {

        });

        it('can be an object', () => {

        });

        it('must be an object', () => {

        });

        describe('callbacks', () => {

            it('can be an object of callbacks', () => {

            });

            it('must be an object of callbacks', () => {

            });

        });

        describe('examples', () => {

            it('can be an object of examples', () => {

            });

            it('must be an object of examples', () => {

            });

        });

        describe('links', () => {

            it('can be an object of links', () => {

            });

            it('must be an object of links', () => {

            });

        });

        describe('headers', () => {

            it('can be an object of headers', () => {

            });

            it('must be an object of headers', () => {

            });

        });

        describe('parameters', () => {

            it('can be an object of parameters', () => {

            });

            it('must be an object of parameters', () => {

            });

        });

        describe('requestBodies', () => {

            it('can be an object of requestBodies', () => {

            });

            it('must be an object of requestBodies', () => {

            });

        });

        describe('responses', () => {

            it('can be an object of responses', () => {

            });

            it('must be an object of responses', () => {

            });

        });

        describe('schemas', () => {

            it('can be an object of schemas', () => {

            });

            it('must be an object of schemas', () => {

            });

        });

        describe('securitySchemes', () => {

            it('can be an object of securitySchemes', () => {

            });

            it('must be an object of securitySchemes', () => {

            });

        });

    });

    describe('consumes', () => {

        it('is not valid for v3', () => {
            const [ err ] = definition(3, OpenAPI, {
                consumes: []
            });
            expect(err).to.match(/Property not allowed: consumes/);
        });

        it('can be an array of strings for v2', () => {
            const [ err ] = definition(2, OpenAPI, {
                consumes: ['application/json']
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ err ] = definition(2, OpenAPI, {
                consumes: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be an array of strings', () => {
            const [ err ] = definition(2, OpenAPI, {
                consumes: [1]
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('definitions', () => {

        it('is not allowed for v3', () => {

        });

        it('can be an object', () => {

        });

        it('must be an object', () => {

        });

        it('must have valid schemas per key', () => {

        });

    });

    describe('externalDocs', () => {

        it('can be a valid external document', () => {

        });

        it('must be a valid external document', () => {

        });

    });

    describe('host', () => {

        it('is not allowed in v3', () => {

        });

        it('can be a string', () => {

        });

        it('must be a string', () => {

        });

        it('must not include scheme', () => {

        });

        it('must not include sub paths', () => {

        });

        it('can include the port', () => {

        });

    });

    describe('info', () => {

        it('is allowed for v2', () => {

        });

        it('is allowed for v3', () => {

        });

    });

    describe('paths', () => {

        it('is required', () => {

        });

        it('must be an object', () => {

        });

        it('can be used to define valid path item objects', () => {

        });

    });

    describe('openapi', () => {

        it('is not allowed for v2', () => {

        });

        it('can be a semantic version number string', () => {

        });

        it('must be a semantic version number string', () => {

        });

    });

    describe('parameters', () => {

        it('is not valid for v3', () => {

        });

        it('can be an object of parameter definitions', () => {

        });

        it('must be an object', () => {

        });

        it('must be a parameter definition per key', () => {

        });

    });

    describe('produces', () => {

        it('is not valid for v3', () => {
            const [ err ] = definition(3, OpenAPI, {
                produces: []
            });
            expect(err).to.match(/Property not allowed: produces/);
        });

        it('can be an array of strings for v2', () => {
            const [ err ] = definition(2, OpenAPI, {
                produces: ['application/json']
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ err ] = definition(2, OpenAPI, {
                produces: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be an array of strings', () => {
            const [ err ] = definition(2, OpenAPI, {
                produces: [1]
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('responses', () => {

        it('is not valid for v3', () => {

        });

        it('can be an object of response definitions', () => {

        });

        it('must be an object', () => {

        });

        it('must be a response definition per key', () => {

        });

    });

    describe('schemes', () => {

        it('is not allowed on v3', () => {

        });

        it('can be an array of strings', () => {

        });

        it('must be an array of strings', () => {

        });

        it('must have items from enum values', () => {

        });

    });

    describe('security', () => {

        it('can be an array of strings', () => {

        });

        it('must be an array', () => {

        });

        it('must have a string for each item', () => {

        });

    });

    describe('securityDefinitions', () => {

        it('is not valid for v3', () => {

        });

        it('can be an object of securityDefinitions definitions', () => {

        });

        it('must be an object', () => {

        });

        it('must be a securityDefinitions definition per key', () => {

        });

    });

    describe('servers', () => {

        it('is not allowed in v2', () => {

        });

        it('can be an array', () => {

        });

        it('must be an array', () => {

        });

        it('must contain valid server definitions', () => {

        });

    });

    describe('swagger', () => {

        it('is not allowed in v3', () => {

        });

        it('can be 2.0', () => {

        });

        it('must be 2.0', () => {

        });

    });

    describe('tags', () => {

        it('can be an array of tag objects', () => {

        });

        it('must be an array', () => {

        });

        it('must have a tag object for each item', () => {

        });

    });

});