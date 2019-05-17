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
const assert        = require('../src/assert');
const expect        = require('chai').expect;
const Enforcer      = require('../');

describe('enforcer/request-body', () => {

    it('allows a valid definition', () => {
        const [ , err ] = Enforcer.v3_0.RequestBody({
            content: {
                'application/json': {

                }
            }
        });
        expect(err).to.be.undefined;
    });

    it('is not allowed for GET method', () => {
        const [ , err ] = Enforcer.v3_0.PathItem({
            get: {
                requestBody: {
                    content: {
                        'application/json': {

                        }
                    }
                },
                responses: {
                    default: {
                        description: ''
                    }
                }
            }
        });
        expect(err).to.match(/Property not allowed: requestBody/);
    });

    it('can overwrite options to allow for GET method', () => {
        const [ , err ] = Enforcer.v3_0.PathItem({
            get: {
                requestBody: {
                    content: {
                        'application/json': {

                        }
                    }
                },
                responses: {
                    default: {
                        description: ''
                    }
                }
            }
        }, null, { requestBodyAllowedMethods: { get: true } });
        expect(err).to.equal(undefined)
    });

    it('can overwrite options to allow for GET method through root instantiation', async () => {
        const defintion = {
            openapi: '3.0.0',
            info: { title: '', version: '' },
            paths: {
                '/': {
                    get: {
                        requestBody: {
                            content: {
                                'application/json': {}
                            }
                        },
                        responses: {
                            default: {
                                description: ''
                            }
                        }
                    }
                }
            }
        };
        const [ , err ] = await Enforcer(defintion, {
            fullResult: true,
            componentOptions: {
                requestBodyAllowedMethods: { get: true }
            }
        });
        expect(err).to.equal(undefined)
    });

    describe('encoding', () => {

        it('is allowed with multipart mimetype', () => {
            const [ , err ] = Enforcer.v3_0.RequestBody({
                content: {
                    'multipart/mixed': {
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        },
                        encoding: {
                            a: {
                                contentType: 'text/plain'
                            }
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('is allowed with application/x-www-form-urlencoded mimetype', () => {
            const [ , err ] = Enforcer.v3_0.RequestBody({
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        },
                        encoding: {
                            a: {
                                contentType: 'text/plain'
                            }
                        }
                    }
                }
            });
            expect(err).to.be.undefined;
        });

        it('is not allowed for other mime types', () => {
            const [ , err ] = Enforcer.v3_0.RequestBody({
                content: {
                    'text/plain': {
                        schema: {
                            type: 'object',
                            properties: {
                                a: { type: 'string' }
                            }
                        },
                        encoding: {
                            a: {
                                contentType: 'text/plain'
                            }
                        }
                    }
                }
            });
            expect(err).to.match(/Mime type must be multipart\/\* or application\/x-www-form-urlencoded/);
        });

        describe('allowReserved', () => {

            it('is allowed with multipart mimetype', () => {
                const [ , err ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string' }
                                }
                            },
                            encoding: {
                                a: {
                                    contentType: 'text/plain',
                                    allowReserved: true
                                }
                            }
                        }
                    }
                });
                expect(err).to.be.undefined;
            });

            it('defaults to false', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string' }
                                }
                            },
                            encoding: {
                                a: {
                                    contentType: 'text/plain'
                                }
                            }
                        }
                    }
                });
                expect(def.content['application/x-www-form-urlencoded'].encoding.a.allowReserved).to.equal(false);
            });

            it('is ignored when not application/x-www-form-urlencoded mimetype', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string' }
                                }
                            },
                            encoding: {
                                a: {
                                    contentType: 'text/plain',
                                    allowReserved: true
                                }
                            }
                        }
                    }
                });
                assert.deepEqual(def.content['multipart/mixed'].encoding.a, { contentType: 'text/plain' });
            });

        });

        describe('contentType', () => {

            it('defaults to application/octet-stream for binary format', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'string', format: 'binary' }
                                }
                            },
                            encoding: {
                                a: {}
                            }
                        }
                    }
                });
                expect(def.content['multipart/mixed'].encoding.a.contentType).to.equal('application/octet-stream');
            });

            it('defaults to text/plain for primitives', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number' }
                                }
                            },
                            encoding: {
                                a: {}
                            }
                        }
                    }
                });
                expect(def.content['multipart/mixed'].encoding.a.contentType).to.equal('text/plain');
            });

            it('defaults to application/json for objects', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'object' }
                                }
                            },
                            encoding: {
                                a: {}
                            }
                        }
                    }
                });
                expect(def.content['multipart/mixed'].encoding.a.contentType).to.equal('application/json');
            });

            it('defaults to application/json for array with objects', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'array', items: { type: 'object' } }
                                }
                            },
                            encoding: {
                                a: {}
                            }
                        }
                    }
                });
                expect(def.content['multipart/mixed'].encoding.a.contentType).to.equal('application/json');
            });

            it('defaults to application/octet-stream for array with binary', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'array', items: { type: 'string', format: 'binary' } }
                                }
                            },
                            encoding: {
                                a: {}
                            }
                        }
                    }
                });
                expect(def.content['multipart/mixed'].encoding.a.contentType).to.equal('application/octet-stream');
            });

        });

        describe('explode', () => {

            it('is ignored is not application/x-www-form-urlencoded mime type', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'array', items: { type: 'string' } }
                                }
                            },
                            encoding: {
                                a: {
                                    explode: true
                                }
                            }
                        }
                    }
                });
                expect(def.content['multipart/mixed'].encoding.a).not.to.haveOwnProperty('explode');
            });

            it('defaults to true if style is form', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'array', items: { type: 'string' } }
                                }
                            },
                            encoding: {
                                a: {
                                    style: 'form'
                                }
                            }
                        }
                    }
                });
                expect(def.content['application/x-www-form-urlencoded'].encoding.a.explode).to.equal(true);
            });

            it('defaults to true if style is omitted', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'array', items: { type: 'string' } }
                                }
                            },
                            encoding: {
                                a: {}
                            }
                        }
                    }
                });
                expect(def.content['application/x-www-form-urlencoded'].encoding.a.explode).to.equal(true);
            });

        });

        describe('headers', () => {

            it('ignores headers if not multipart', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'application/x-www-form-urlencoded': {
                            encoding: {
                                a: {
                                    headers: {
                                        'x-header1': { schema: { type: 'string' } },
                                        'x-header2': { schema: { type: 'string' } }
                                    }
                                }
                            },
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'array', items: { type: 'string' } }
                                }
                            }
                        }
                    }
                });
                expect(def.content['application/x-www-form-urlencoded'].encoding.a).not.to.haveOwnProperty('headers')
            });

            it('ignores content type header', () => {
                const [ def ] = Enforcer.v3_0.RequestBody({
                    content: {
                        'multipart/mixed': {
                            schema: {
                                type: 'object',
                                properties: {
                                    a: { type: 'array', items: { type: 'string' } }
                                }
                            },
                            encoding: {
                                a: {
                                    headers: {
                                        'Content-type': { schema: { type: 'string' } },
                                        'x-header1': { schema: { type: 'string' } }
                                    }
                                }
                            }
                        }
                    }
                });
                const keys = Object.keys(def.content['multipart/mixed'].encoding.a.headers).map(v => v.toLowerCase());
                expect(keys.includes('content-type')).to.be.false;
            });

        });

    });

});
