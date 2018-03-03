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
const copy      = require('../../bin/util').copy;
const expect    = require('chai').expect;
const v3        = require('../../bin/v3/index');

describe.only('v3/request', () => {
    const schema = {
        get: {},
        parameters: [
            {
                name: 'user',
                in: 'cookie',
                schema: {
                    type: 'object',
                    required: ['id', 'sessionStart'],
                    properties: {
                        id: { type: 'number' },
                        sessionStart: { type: 'string', format: 'date-time' }
                    }
                }
            },
            {
                name: 'petType',
                in: 'query'
            },
            {
                name: 'x-number',
                in: 'header',
                schema: { type: 'number' }
            }
        ]
    };
    let instance;

    before(() => {
        instance = new v3(null, {});
    });

    describe('cookie', () => {
        const ds = '2000-01-02T03:04:05.678Z';

        it('default style (form)', () => {
            const req = request({ cookie: { user: 'id=12345&sessionStart=' + ds } });
            const params = instance.parseRequestParameters(schema, req);
            expect(params.errors).to.be.null;
            expect(params.value.cookie.user).to.deep.equal({ id: '12345', sessionStart: ds });
        });

        it('cannot use matrix style', () => {
            const schema2 = modSchema(schema, { 'parameters.0': { style: 'matrix' } });
            const req = request({ cookie: { user: '' } });
            expect(() => instance.parseRequestParameters(schema2, req)).to.throw(/matrix style/);
        });

        it('cannot use label style', () => {
            const schema2 = modSchema(schema, { 'parameters.0': { style: 'label' } });
            const req = request({ cookie: { user: '' } });
            expect(() => instance.parseRequestParameters(schema2, req)).to.throw(/label style/);
        });

        it('cannot use simple style', () => {
            const schema2 = modSchema(schema, { 'parameters.0': { style: 'simple' } });
            const req = request({ cookie: { user: '' } });
            expect(() => instance.parseRequestParameters(schema2, req)).to.throw(/simple style/);
        });

        it('cannot use spaceDelimited style', () => {
            const schema2 = modSchema(schema, { 'parameters.0': { style: 'spaceDelimited' } });
            const req = request({ cookie: { user: '' } });
            expect(() => instance.parseRequestParameters(schema2, req)).to.throw(/spaceDelimited style/);
        });

        it('cannot use pipeDelimited style', () => {
            const schema2 = modSchema(schema, { 'parameters.0': { style: 'pipeDelimited' } });
            const req = request({ cookie: { user: '' } });
            expect(() => instance.parseRequestParameters(schema2, req)).to.throw(/pipeDelimited style/);
        });

        it('cannot use deepObject style', () => {
            const schema2 = modSchema(schema, { 'parameters.0': { style: 'deepObject' } });
            const req = request({ cookie: { user: '' } });
            expect(() => instance.parseRequestParameters(schema2, req)).to.throw(/deepObject style/);
        });

    });

});

function modSchema(source, mods) {
    const definition = copy(source);
    Object.keys(mods).forEach(path => {
        const paths = path.split('.');
        let obj = definition;
        while (paths.length > 0) {
            const p = paths.shift();
            if (p.length) obj = obj[p];
        }
        Object.assign(obj, mods[path]);
    });
    return definition;
}

function request(obj) {
    return Object.assign({
        body: obj.body || '',
        cookie: obj.cookie || {},
        header: obj.header || {},
        method: obj.method || 'get',
        path: obj.path || {},
        query: obj.query || ''
    });
}