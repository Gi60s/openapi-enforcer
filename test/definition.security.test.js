/**
 *  @license
 *    Copyright 2019 Brigham Young University
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
const expect = require('chai').expect;
const Enforcer = require('../');

describe('security definitions', () => {

    describe('v2', () => {

        it('can have a valid security definition', () => {
            const def = {
                swagger: '2.0',
                info: { title: '', version: '' },
                paths: {},
                securityDefinitions: {
                    BasicAuth: { type: "basic" },
                    ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
                    OAuth2: {
                        type: "oauth2",
                        flow: "accessCode",
                        authorizationUrl: "https://example.com/oauth/authorize",
                        tokenUrl: "https://example.com/oauth/token",
                        scopes: {
                            read: "Grants read access",
                            write: "Grants write access",
                            admin: "Grants read and write access to administrative information"
                        }
                    }
                },
                security: [
                    { ApiKeyAuth: [] },
                    { OAuth2: ['read', 'write'] }
                ]
            };
            const [ , err ] = Enforcer.v2_0.Swagger(def);
            expect(err).to.be.undefined;
        });
    });

});