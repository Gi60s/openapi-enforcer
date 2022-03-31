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

    function validPathObject (parameters, verb = 'get') {
        const result = {
            [verb]: {
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

    it('allows duplicate paths, if verbs differ', () => {
        const [ , err, warning ] = Enforcer.v2_0.Paths({
            '/a/{e}': validPathObject([
                { name: 'e', in: 'path', required: true, type: 'string' }
            ]),
            '/a/{y}': validPathObject([
                { name: 'y', in: 'path', required: true, type: 'string' }
            ], 'put')
        });
        expect(err).to.equal(undefined);
        expect(warning).to.equal(undefined);
    });

    it('allows duplicate paths using case sensitivity (default)', () => {
        const [ , err ] = Enforcer.v2_0.Paths({
            '/a': validPathObject(),
            '/A': validPathObject()
        });
        expect(err).to.equal(undefined);
    });

    it('does not allow duplicate paths using case insensitivity', () => {
        const config = require('../index').config
        config.useCaseSensitivePaths = false
        const [ , err, warning ] = Enforcer.v2_0.Paths({
            '/a': validPathObject(),
            '/A': validPathObject()
        });
        expect(err).to.match(/Equivalent paths are not allowed/);
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

    it('produces warnings for trailing slash inconsistency', () => {
        const [ , err, warning ] = Enforcer.v2_0.Paths({
            '/a/': validPathObject(),
            '/b': validPathObject()
        });

        expect(err).to.equal(undefined);
        expect(warning).to.match(/Some defined paths end with slashes while some do not/);
    });

    it('does not consider path / and path /foo to have trailing slash inconsistency', () => {
        const [ , err, warning ] = Enforcer.v2_0.Paths({
            '/': validPathObject(),
            '/foo': validPathObject()
        });

        expect(err).to.equal(undefined);
        expect(warning).to.equal(undefined);
    });

    it('does not consider path / and path /foo/ to have trailing slash inconsistency', () => {
        const [ , err, warning ] = Enforcer.v2_0.Paths({
            '/': validPathObject(),
            '/foo/': validPathObject()
        });

        expect(err).to.equal(undefined);
        expect(warning).not.to.match(/Some defined paths end with slashes while some do not/);
    });

    it('path normalization will identify conflicting paths', () => {
        const [ , err ] = Enforcer.v2_0.Paths({
            '/a': validPathObject(),
            '/a/': validPathObject()
        });
        expect(err).to.match(/These paths are defined more than once/);
    });

    it('path without normalization allows near conflicting paths', () => {
        const [ paths ] = Enforcer.v2_0.Paths({
            '/a': validPathObject(),
            '/a/': validPathObject()
        }, null, { disablePathNormalization: true });

        const x = paths.findMatch('/a');
        expect(x.path).to.equal(paths['/a']);

        const y = paths.findMatch('/a/');
        expect(y.path).to.equal(paths['/a/']);
    });

    it('removes trailing slashes from path definitions when using path normalization', () => {
        const [ paths ] = Enforcer.v2_0.Paths({
            '/a': validPathObject(),
            '/b/': validPathObject()
        });

        expect(paths).to.haveOwnProperty('/a');
        expect(paths).to.haveOwnProperty('/b');
        expect(paths).not.to.haveOwnProperty('/b/');
    });

    it('keeps trailing slashes on path definitions when not using path normalization', () => {
        const [ paths ] = Enforcer.v2_0.Paths({
            '/a': validPathObject(),
            '/b/': validPathObject()
        }, null, { disablePathNormalization: true });

        expect(paths).to.haveOwnProperty('/a');
        expect(paths).not.to.haveOwnProperty('/b');
        expect(paths).to.haveOwnProperty('/b/');
    });

});
