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
const Enforcer      = require('../index');

describe('request', () => {

    describe('request object normalization', () => {
        let enforcer;

        before(() => {
            enforcer = new Enforcer({
                swagger: '2.0',
                paths: {
                    '/hello': {
                        get: {
                            'parameters': [
                                { name: 'name', type: 'string', in: 'query' },
                                { name: 'a', type: 'string', in: 'cookie' }
                            ]
                        }
                    }
                }
            }, { request: { throw: true }});
        });

        it('invalid parameter', () => {
            expect(() => enforcer.request(5)).to.throw(Error);
        });

        it('as string path', () => {
            const result = enforcer.request('/hello');
            expect(result.path).to.equal('/hello');
        });

        it('as string path with query parameter', () => {
            const result = enforcer.request('/hello?name=Bob');
            expect(result.path).to.equal('/hello');
            expect(result.request.query).to.deep.equal({ name: 'Bob' });
        });

        it('cookie as an object', () => {
            const result = enforcer.request({
                path: '/hello',
                cookies: { a: 1 }
            });
            expect(result.request.cookies).to.deep.equal({ a: '1' });
        })
    });

});