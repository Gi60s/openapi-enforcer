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
const expect        = require('chai').expect;
const Enforcer      = require('../');

describe('enforcer/paths', () => {

    function validPathObject (parameters) {
        const result = {
            get: {
                responses: {
                    default: {
                        description: ''
                    }
                }
            }
        };
        if (parameters) result.parameters = parameters;
        return result;
    }

    it('must be an object', () => {
        const [ , err ] = Enforcer.v2_0.Paths([]);
        expect(err).to.match(/Value must be a plain object/);
    });

    it('can be used to define valid path item objects', () => {
        const [ , err ] = Enforcer.v2_0.Paths({
            '/': validPathObject()
        });
        expect(err).to.be.undefined;
    });

    it('requires that each path start with a slash', () => {
        const [ , err ] = Enforcer.v2_0.Paths({
            'abc': validPathObject()
        });
        expect(err).to.match(/Path must begin with a single forward slash/);
    });

    it('requires that each path start with a single slash', () => {
        const [ , err ] = Enforcer.v2_0.Paths({
            '//abc': validPathObject()
        });
        expect(err).to.match(/Path must begin with a single forward slash/);
    });

    it('allows different paths', () => {
        const [ , err ] = Enforcer.v2_0.Paths({
            '/a': validPathObject(),
            '/b': validPathObject(),
            '/a/{a}': validPathObject([
                { name: 'a', in: 'path', required: true, type: 'string' }
            ]),
            '/a/b': validPathObject()
        });
        expect(err).to.be.undefined;
    });

    it('will identify variable path duplications', () => {
        const [ , err ] = Enforcer.v2_0.Paths({
            '/a/b/{c}/d/{e}': validPathObject([
                { name: 'c', in: 'path', required: true, type: 'string' },
                { name: 'e', in: 'path', required: true, type: 'string' }
            ]),
            '/a/b/{x}/d/{y}': validPathObject([
                { name: 'x', in: 'path', required: true, type: 'string' },
                { name: 'y', in: 'path', required: true, type: 'string' }
            ]),
            '/a/b/{a}/d/{e}': validPathObject([
                { name: 'a', in: 'path', required: true, type: 'string' },
                { name: 'e', in: 'path', required: true, type: 'string' }
            ]),
            '/a/b/{x}/d/{y}/{z}': validPathObject([
                { name: 'x', in: 'path', required: true, type: 'string' },
                { name: 'y', in: 'path', required: true, type: 'string' },
                { name: 'z', in: 'path', required: true, type: 'string' }
            ]),
            '/a/b/{a}/d/{b}/{c}': validPathObject([
                { name: 'a', in: 'path', required: true, type: 'string' },
                { name: 'b', in: 'path', required: true, type: 'string' },
                { name: 'c', in: 'path', required: true, type: 'string' }
            ]),
        });
        expect(err).to.match(/Equivalent paths are not allowed/);
        expect(err.count).to.equal(5);
    });

    it('correctly prioritizes path selection', () => {
        const [ paths ] = Enforcer.v2_0.Paths({
            '/a/{a}': validPathObject([
                { name: 'a', in: 'path', required: true, type: 'string' }
            ]),
            '/a/b': validPathObject()
        });

        const x = paths.findMatch('/a/b');
        expect(x.path).to.equal(paths['/a/b']);

        const y = paths.findMatch('/a/c');
        expect(y.path).to.equal(paths['/a/{a}']);
    });

});