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
const Enforcer      = require('../');
const expect        = require('chai').expect;

describe('definitions/open-api', () => {

    describe('basePath', () => {

        it('is not allowed in v3', () => {
            const [ value, err ] = oas(3, {
                basePath: '/'
            });
            expect(err).to.match(/Property not allowed: basePath/);
        });

        it('can be a string', () => {
            const [ , err ] = oas(2, {
                basePath: '/'
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ , err ] = oas(2, {
                basePath: 1
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('must start with a leading slash (/)', () => {
            const [ , err ] = oas(2, {
                basePath: 'some/place'
            });
            expect(err).to.match(/Value must start with a forward slash/);
        });

    });

    describe('components', () => {

        it('is not allowed for v2', () => {
            const [ , err ] = oas(2, {
                components: {}
            });
            expect(err).to.match(/Property not allowed: components/);
        });

        it('can be an object', () => {
            const [ , err ] = oas(3, {
                components: {}
            });
            expect(err).to.be.undefined;
        });

        it('must be an object', () => {
            const [ , err ] = oas(3, {
                components: 1
            });
            expect(err).to.match(/Value must be a plain object/);
        });

        describe('callbacks', () => {

            it('can be an object of callbacks', () => {
                const [ , err ] = oas(3, {
                    components: {
                        callbacks: {
                            abc: {
                                '{$request.body#/something}': {
                                    get: {
                                        responses: {
                                            200: {
                                                description: 'ok'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of callbacks', () => {
                const [ , err ] = oas(3, {
                    components: {
                        callbacks: {
                            abc: {
                                '{$request.body#/something}': {
                                    get: {}
                                }
                            }
                        }
                    }
                });
                expect(err).to.match(/Missing required property: responses/);
            });

        });

        describe('examples', () => {

            it('can be an object of examples', () => {
                const [ , err ] = oas(3, {
                    components: {
                        examples: {
                            myExample: {
                                summary: 'hello',
                                value: 1
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of examples', () => {
                const [ , err ] = oas(3, {
                    components: {
                        examples: {
                            myExample: {
                                summary: 1
                            }
                        }
                    }
                });
                expect(err).to.match(/Value must be a string/)
            });

        });

        describe('links', () => {

            it('can be an object of links', () => {
                const [ , err ] = oas(3, {
                    components: {
                        links: {
                            linkA: {
                                operationId: 'op'
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of links', () => {
                const [ , err ] = oas(3, {
                    components: {
                        links: {
                            linkA: {
                                operationId: 1
                            }
                        }
                    }
                });
                expect(err).to.match(/Value must be a string/)
            });

        });

        describe('headers', () => {

            it('can be an object of headers', () => {
                const [ , err ] = oas(3, {
                    components: {
                        headers: {
                            'x-header': {
                                schema: { type: 'string' }
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of headers', () => {
                const [ , err ] = oas(3, {
                    components: {
                        headers: {
                            'x-header': {
                                schema: 1
                            }
                        }
                    }
                });
                expect(err).to.match(/Value must be a plain object/);
            });

        });

        describe('parameters', () => {

            it('can be an object of parameters', () => {
                const [ , err ] = oas(3, {
                    components: {
                        parameters: {
                            paramA: {
                                name: 'a',
                                in: 'query',
                                schema: { type: 'string' }
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of parameters', () => {
                const [ , err ] = oas(3, {
                    components: {
                        parameters: {
                            paramA: {
                                name: 'a',
                                in: 'query'
                            }
                        }
                    }
                });
                expect(err).to.match(/Missing required property "content" or "schema"/);
            });

        });

        describe('requestBodies', () => {

            it('can be an object of requestBodies', () => {
                const [ , err ] = oas(3, {
                    components: {
                        requestBodies: {
                            bodyA: {
                                content: { 'application/json': {} }
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of requestBodies', () => {
                const [ , err ] = oas(3, {
                    components: {
                        requestBodies: {
                            bodyA: {}
                        }
                    }
                });
                expect(err).to.match(/Missing required property: content/);
            });

        });

        describe('responses', () => {

            it('can be an object of responses', () => {
                const [ , err ] = oas(3, {
                    components: {
                        responses: {
                            responseA: {
                                description: ''
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of responses', () => {
                const [ , err ] = oas(3, {
                    components: {
                        responses: {
                            responseA: {}
                        }
                    }
                });
                expect(err).to.match(/Missing required property: description/);
            });

        });

        describe('schemas', () => {

            it('can be an object of schemas', () => {
                const [ , err ] = oas(3, {
                    components: {
                        schemas: {
                            schemaA: {
                                type: 'string'
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

        });

        describe('securitySchemes', () => {

            it('can be an object of securitySchemes', () => {
                const [ , err ] = oas(3, {
                    components: {
                        securitySchemes: {
                            schemeA: { type: 'apiKey', name: 'x-header', in: 'header' }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('must be an object of securitySchemes', () => {
                const [ , err ] = oas(3, {
                    components: {
                        securitySchemes: {
                            schemeA: { type: 'apiKey' }
                        }
                    }
                });
                expect(err).to.match(/Missing required properties: in, name/);
            });

        });

    });

    describe('consumes', () => {

        it('is not valid for v3', () => {
            const [ , err ] = oas(3, {
                consumes: []
            });
            expect(err).to.match(/Property not allowed: consumes/);
        });

        it('can be an array of strings for v2', () => {
            const [ , err ] = oas(2, {
                consumes: ['application/json']
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ , err ] = oas(2, {
                consumes: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be an array of strings', () => {
            const [ , err ] = oas(2, {
                consumes: [1]
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('definitions', () => {

        it('is not allowed for v3', () => {
            const [ , err ] = oas(3, {
                definitions: {}
            });
            expect(err).to.match(/Property not allowed: definitions/);
        });

        it('can be an object', () => {
            const [ , err ] = oas(2, {
                definitions: {
                    def1: {
                        type: 'string'
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be an object', () => {
            const [ , err ] = oas(2, {
                definitions: []
            });
            expect(err).to.match(/Value must be a plain object/);
        });

    });

    describe('externalDocs', () => {

        it('can be a valid external document', () => {
            const [ , err ] = oas(2, {
                externalDocs: {
                    url: ''
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be a valid external document', () => {
            const [ , err ] = oas(2, {
                externalDocs: {}
            });
            expect(err).to.match(/Missing required property: url/);
        });

    });

    describe('host', () => {

        it('is not allowed in v3', () => {
            const [ , err ] = oas(3, {
                host: 'app.myserver.com'
            });
            expect(err).to.match(/Property not allowed: host/);
        });

        it('can be a string', () => {
            const [ , err ] = oas(2, {
                host: 'app.myserver.com'
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ , err ] = oas(2, {
                host: 1
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('must not include scheme', () => {
            const [ , err ] = oas(2, {
                host: 'https://app.myserver.com'
            });
            expect(err).to.match(/Value must not include the scheme: https:\/\//);
        });

        it('must not include sub paths', () => {
            const [ , err ] = oas(2, {
                host: 'app.myserver.com/abc'
            });
            expect(err).to.match(/Value must not include sub path: \/abc/);
        });

        it('can include the port', () => {
            const [ , err ] = oas(2, {
                host: 'app.myserver.com:3000'
            });
            expect(err).to.be.undefined;
        });

    });

    describe('info', () => {

        it('is required', () => {
            const [ , err ] = Enforcer.v2_0.Swagger({
                swagger: '2.0',
                paths: {}
            });
            expect(err).to.match(/Missing required property: info/);
        });

        it('can have a valid info object', () => {
            const [ , err ] = oas(2, {
                info: { title: '', version: '' }
            });
            expect(err).to.be.undefined;
        });

        it('must have a valid info object', () => {
            const [ , err ] = oas(2, {
                info: { title: '' }
            });
            expect(err).to.match(/Missing required property: version/);
        });

    });

    describe('openapi', () => {

        it('is not allowed for v2', () => {
            const [ , err ] = Enforcer.v2_0.Swagger({
                openapi: '3.0.0',
                info: { title: '', version: '' },
                paths: {}
            });
            expect(err).to.match(/Property not allowed: openapi/);
        });

        it('can be a semantic version number string', () => {
            const [ , err ] = Enforcer.v3_0.OpenApi({
                openapi: '3.0.0',
                info: { title: '', version: '' },
                paths: {}
            });
            expect(err).to.be.undefined;
        });

        it('must be a string', () => {
            const [ , err ] = Enforcer.v3_0.OpenApi({
                openapi: 1,
                info: { title: '', version: '' },
                paths: {}
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('must be a semantic version number string', () => {
            const [ , err ] = Enforcer.v3_0.OpenApi({
                openapi: '3.0',
                info: { title: '', version: '' },
                paths: {}
            });
            expect(err).to.match(/Value must be a semantic version number/);
        });

    });

    describe('parameters', () => {

        it('is not valid for v3', () => {
            const [ , err ] = oas(3, {
                parameters: {}
            });
            expect(err).to.match(/Property not allowed: parameters/);
        });

        it('can be an object of parameter definitions', () => {
            const [ , err ] = oas(2, {
                parameters: {
                    x: { name: 'x', in: 'query', type: 'string' }
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be an object', () => {
            const [ , err ] = oas(2, {
                parameters: []
            });
            expect(err).to.match(/Value must be a plain object/);
        });

        it('must be a parameter definition per key', () => {
            const [ , err ] = oas(2, {
                parameters: {
                    x: { name: 'x', type: 'string' }
                }
            });
            expect(err).to.match(/Missing required property: in/);
        });

    });

    describe('paths', () => {
        const validPathObject = {
            get: {
                responses: {
                    default: {
                        description: ''
                    }
                }
            }
        };

        it('is required', () => {
            const [ , err ] = Enforcer.v2_0.Swagger({
                swagger: '2.0',
                info: { title: '', version: '' }
            });
            expect(err).to.match(/Missing required property: paths/);
        });

        it('can be used to define valid path item objects', () => {
            const [ , err ] = oas(2, {
                paths: {
                    '/': validPathObject
                }
            });
            expect(err).to.be.undefined;
        });

    });

    describe('produces', () => {

        it('is not valid for v3', () => {
            const [ , err ] = oas(3, {
                produces: []
            });
            expect(err).to.match(/Property not allowed: produces/);
        });

        it('can be an array of strings for v2', () => {
            const [ , err ] = oas(2, {
                produces: ['application/json']
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ , err ] = oas(2, {
                produces: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be an array of strings', () => {
            const [ , err ] = oas(2, {
                produces: [1]
            });
            expect(err).to.match(/Value must be a string/);
        });

    });

    describe('responses', () => {

        it('is not valid for v3', () => {
            const [ , err ] = oas(3, {
                responses: {}
            });
            expect(err).to.match(/Property not allowed: responses/);
        });

        it('can be an object of response definitions', () => {
            const [ , err ] = oas(2, {
                responses: {
                    x: {
                        description: ''
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be an object', () => {
            const [ , err ] = oas(2, {
                responses: []
            });
            expect(err).to.match(/Value must be a plain object/);
        });

        it('must be a response definition per key', () => {
            const [ , err ] = oas(2, {
                responses: {
                    x: {}
                }
            });
            expect(err).to.match(/Missing required property: description/);
        });

    });

    describe('schemes', () => {

        it('is not allowed on v3', () => {
            const [ , err ] = oas(3, {
                schemes: []
            });
            expect(err).to.match(/Property not allowed: schemes/);
        });

        it('can be an array of strings', () => {
            const [ , err ] = oas(2, {
                schemes: ['http', 'https']
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ , err ] = oas(2, {
                schemes: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be an array of strings', () => {
            const [ , err ] = oas(2, {
                schemes: [1]
            });
            expect(err).to.match(/Value must be a string/);
        });

        it('must have items from enum values', () => {
            const [ , err ] = oas(2, {
                schemes: ['bob']
            });
            expect(err).to.match(/Value must be one of: http, https, ws, wss/);
        });

    });

    describe('security', () => {

        it('can be an array of strings', () => {
            const [ , err ] = oas(2, {
                security: [{ abc: [] }],
                securityDefinitions: {
                    abc: { type: 'basic' }
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ , err ] = oas(2, {
                security: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must have an object for each item', () => {
            const [ , err ] = oas(2, {
                security: [1]
            });
            expect(err).to.match(/Value must be a plain object/);
        });

        it('must have an array for each object property value', () => {
            const [ , err ] = oas(2, {
                security: [{ abc: {} }],
                securityDefinitions: {
                    abc: { type: 'basic' }
                }
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must be defined in securityDefinitions for v2', () => {
            const [ , err ] = oas(2, {
                security: [{ abc: [] }],
            });
            expect(err).to.match(/Security requirement name must be defined at the document root under the securityDefinitions/);
        });

        it('can be defined in components/securitySchemes for v3', () => {
            const [ , err ] = oas(3, {
                security: [{ abc: [] }],
                components: {
                    securitySchemes: {
                        abc: {
                            type: 'apiKey',
                            name: 'x-header',
                            in: 'header'
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be defined in components/securitySchemes for v3', () => {
            const [ , err ] = oas(3, {
                security: [{ abc: [] }],
            });
            expect(err).to.match(/Security requirement name must be defined at the document root under the components\/securitySchemes/);
        });

    });

    describe('securityDefinitions', () => {

        it('is not valid for v3', () => {
            const [ , err ] = oas(3, {
                securityDefinitions: {}
            });
            expect(err).to.match(/Property not allowed: securityDefinitions/);
        });

        it('can be an object of securityDefinitions definitions', () => {
            const [ , err ] = oas(2, {
                securityDefinitions: {
                    abc: { type: 'basic' }
                }
            });
            expect(err).to.be.undefined;
        });

        it('must be an object', () => {
            const [ , err ] = oas(2, {
                securityDefinitions: []
            });
            expect(err).to.match(/Value must be a plain object/);
        });

        it('must be a securityDefinitions definition per key', () => {
            const [ , err ] = oas(2, {
                securityDefinitions: {
                    abc: {}
                }
            });
            expect(err).to.match(/Missing required property: type/);
        });

    });

    describe('servers', () => {

        it('is not allowed in v2', () => {
            const [ , err ] = oas(2, {
                servers: []
            });
            expect(err).to.match(/Property not allowed: servers/);
        });

        it('can be an array or server objects', () => {
            const [ , err ] = oas(3, {
                servers: [{ url: '' }]
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ , err ] = oas(3, {
                servers: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must contain valid server definitions', () => {
            const [ , err ] = oas(3, {
                servers: [{}]
            });
            expect(err).to.match(/Missing required property: url/);
        });

    });

    describe('swagger', () => {

        it('is not allowed in v3', () => {
            const [ , err ] = oas(3, {
                swagger: '2.0'
            });
            expect(err).to.match(/Property not allowed/);
        });

        it('can be 2.0', () => {
            const [ , err ] = oas(2, {
                swagger: '2.0'
            });
            expect(err).to.be.undefined;
        });

        it('must be 2.0', () => {
            const [ , err ] = Enforcer.v2_0.Swagger({
                swagger: '3.0'
            });
            expect(err).to.match(/Value must be "2.0"/);
        });

    });

    describe('tags', () => {

        it('can be an array of tag objects', () => {
            const [ , err ] = oas(2, {
                tags: [{ name: 'a' }]
            });
            expect(err).to.be.undefined;
        });

        it('must be an array', () => {
            const [ , err ] = oas(2, {
                tags: {}
            });
            expect(err).to.match(/Value must be an array/);
        });

        it('must have a tag object for each item', () => {
            const [ , err ] = oas(2, {
                tags: [{}]
            });
            expect(err).to.match(/Missing required property: name/);
        });

    });

});

function oas(version, def) {
    const config = {
        info: { title: '', version: '1.0.0' },
        paths: {}
    };
    Object.assign(config, def);
    if (version === 2) {
        config.swagger = '2.0';
        return Enforcer.v2_0.Swagger(config);
    }  else {
        config.openapi = '3.0.0';
        return Enforcer.v3_0.OpenApi(config);
    }
}
