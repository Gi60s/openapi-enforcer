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

describe('request', () => {

    describe('pre-processor', () => {
        let request;

        before(() => {
            const enforcer = new SwaggerEnforcer('3.0.0');
            request = enforcer.request.bind(enforcer);
        });

        it('invalid parameter throws error', () => {
            expect(() => request(123)).to.throw(/Expected an object or a string/);
        });

        describe('defaults get set', () => {
            let req;

            before(() => {
                req = request()
            });

            it('body', () => {
                expect(req.body).to.equal('');
            });

            it('method', () => {
                expect(req.method).to.equal('get');
            });

            it('header', () => {
                expect(req.header).to.deep.equal({});
            });

            it('path', () => {
                expect(req.path).to.deep.equal('/');
            });

            it('query', () => {
                expect(req.query).to.deep.equal({});
            });

        });

        describe('body', () => {

            it('as plain text', () => {
                const req = request({ body: '{ "a": 1 }' });
                expect(req.body).to.equal('{ "a": 1 }');
            });

            it('as object from string', () => {
                const req = request({ body: '{ "a": 1 }', header: 'content-type: application/json' });
                expect(req.body).to.deep.equal({ a: 1 });
            });

            it('as url encoded form-data', () => {
                const req = request({ body: 'a=1&a=2&b=3', header: 'content-type: application/x-www-form-urlencoded' });
                expect(req.body).to.deep.equal({ a: ['1', '2'], b: ['3'] });
            });

            it('as multipart form-data', () => {
                const body = '--AaB03x\r\nContent-Disposition: form-data; name="a"\r\n\r\n1\r\n--AaB03x--';
                const req = request({ body: body, header: 'content-type: multipart/form-data; boundary=AaB03x' });
                expect(req.body.a[0].content).to.equal('1');
            });

            it('invalid body', () => {
                expect(() => request({ body: 123 })).to.throw(/Invalid request body/);
            });

        });

        describe('header', () => {

            it('from string', () => {
                const req = request({ header: 'Content-Type: application/json\r\nAccept: */*' });
                expect(req.header).to.deep.equal({ 'content-type': 'application/json', accept: '*/*' });
            });

            it('from object with cased properties', () => {
                const req = request({ header: { 'Content-Type': 'application/json', Accept: '*/*' } });
                expect(req.header).to.deep.equal({ 'content-type': 'application/json', accept: '*/*' });
            });

            it('duplicates overwrite', () => {
                const req = request({ header: 'Accept: */*\r\naccept: text/plain' });
                expect(req.header).to.deep.equal({ accept: 'text/plain' });
            });

            it('object property values are strings', () => {
                expect(() => request({ header: { accept: 123 } })).to.throw(/Invalid request header specified/);
            });

            it('invalid header', () => {
                expect(() => request({ header: null })).to.throw(/Invalid request header specified/);
            });

        });

        describe('method', () => {

            it('lowercase', () => {
                const req = request({ method: 'get' });
                expect(req.method).to.equal('get');
            });

            it('uppercase', () => {
                const req = request({ method: 'GET' });
                expect(req.method).to.equal('get');
            });

            it('invalid', () => {
                expect(() => request({ method: '123' })).to.throw(/Invalid request method/);
            });

        });

        describe('query', () => {

            describe('string', () => {

                it('single', () => {
                    const req = request({ query: 'a=1' });
                    expect(req.query).to.deep.equal({ a: ['1'] });
                });

                it('multiple', () => {
                    const req = request({ query: 'a=1&a=2&b=3' });
                    expect(req.query).to.deep.equal({ a: ['1', '2'], b: ['3'] });
                });

            });

            describe('object', () => {

                it('empty object', () => {
                    const req = request({ query: {} });
                    expect(req.query).to.deep.equal({});
                });

                it('object with empty array', () => {
                    const req = request({ query: { a: [] } });
                    expect(req.query).to.deep.equal({ a: [] });
                });

                it('array with strings', () => {
                    const req = request({ query: { a: ['1', '2'] } });
                    expect(req.query).to.deep.equal({ a: ['1', '2'] });
                });

                it('array with undefined', () => {
                    const req = request({ query: { a: [undefined] } });
                    expect(req.query).to.deep.equal({ a: [undefined] });
                });

            });

            describe('from path', () => {

                it('empty path', () => {
                    const req = request({ path: '?a=1&a=2&b=3' });
                    expect(req.query).to.deep.equal({ a: ['1', '2'], b: ['3'] });
                });

                it('non-empty path', () => {
                    const req = request({ path: '/abc/123?a=1&a=2&b=3' });
                    expect(req.query).to.deep.equal({ a: ['1', '2'], b: ['3'] });
                });

                it('from path and query as string', () => {
                    const req = request({ path: '?a=1&a=2&b=3', query: 'b=4&c=5' });
                    expect(req.query).to.deep.equal({ a: ['1', '2'], b: ['4', '3'], c: ['5'] });
                });

                it('from path and query as object', () => {
                    const req = request({ path: '?a=1&a=2&b=3', query: { b: ['4'], c: ['5'] } });
                    expect(req.query).to.deep.equal({ a: ['1', '2'], b: ['4', '3'], c: ['5'] });
                });

            });

        });


    });

});