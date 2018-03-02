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
const param         = require('../../bin/v3/param-style');

describe('v3/param-style', () => {

    describe('form', () => {

        const variations = [
            { b: '', a: '' },
            { b: 'age=15&', a: '' },
            { b: '', a: '&name=Bob' },
            { b: 'age=15&', a: '&name=Bob' }
        ];

        variations.forEach((v, i) => {
            describe('variation #' + i, () => {

                it('faulty', () => {
                    expect(param.form('string', false, 'color', v.b + 'blue' + v.a).match).to.equal(false);
                });

                it('empty', () => {
                    expect(param.form('string', false, 'color', v.b + 'color=' + v.a).value).to.equal('');
                });

                it('primitive', () => {
                    expect(param.form('string', false, 'color', v.b + 'color=blue' + v.a).value).to.equal('blue');
                });

                it('array', () => {
                    const actual = param.form('array', false, 'color', v.b + 'color=blue,black,brown' + v.a).value;
                    expect(actual).to.deep.equal(['blue', 'black', 'brown']);
                });

                it('array overwrite', () => {
                    const actual = param.form('array', false, 'color', v.b + 'color=blue,black,brown&color=orange' + v.a).value;
                    expect(actual).to.deep.equal(['orange']);
                });

                it('array exploded', () => {
                    const actual = param.form('array', true, 'color', v.b + 'color=blue&color=black&color=brown' + v.a).value;
                    expect(actual).to.deep.equal(['blue', 'black', 'brown']);
                });

                it('object', () => {
                    const actual = param.form('object', false, 'color', v.b + 'color=R,100,G,200,B,150' + v.a).value;
                    expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
                });

                it('object exploded', () => {
                    const actual = param.form('object', true, 'color', v.b + 'R=100&G=200&B=150' + v.a).value;
                    expect(actual.R).to.equal('100');
                    expect(actual.G).to.equal('200');
                    expect(actual.B).to.equal('150');
                });

            })
        });

    });

    describe('label', () => {

        it('faulty', () => {
            expect(param.label('string', false, 'blue').match).to.equal(false);
        });

        it('empty', () => {
            expect(param.label('string', false, '.').value).to.equal('');
        });

        it('primitive', () => {
            expect(param.label('string', false, '.blue').value).to.equal('blue');
        });

        it('array', () => {
            const actual = param.label('array', false, '.blue.black.brown').value;
            expect(actual).to.deep.equal(['blue', 'black', 'brown']);
        });

        it('object', () => {
            const actual = param.label('object', false, '.R.100.G.200.B.150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

        it('object exploded', () => {
            const actual = param.label('object', true, '.R=100.G=200.B=150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

    });

    describe('matrix', () => {

        it('faulty', () => {
            expect(param.matrix('string', false, 'color', 'blue').match).to.equal(false);
        });

        it('empty', () => {
            expect(param.matrix('string', false, 'color', ';color=').value).to.equal('');
        });

        it('primitive', () => {
            expect(param.matrix('string', false, 'color', ';color=blue').value).to.equal('blue');
        });

        it('array', () => {
            const actual = param.matrix('array', false, 'color', ';color=blue,black,brown').value;
            expect(actual).to.deep.equal(['blue', 'black', 'brown']);
        });

        it('array exploded', () => {
            const actual = param.matrix('array', true, 'color', ';color=blue;color=black;color=brown').value;
            expect(actual).to.deep.equal(['blue', 'black', 'brown']);
        });

        it('object', () => {
            const actual = param.matrix('object', false, 'color', ';color=R,100,G,200,B,150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

        it('object exploded', () => {
            const actual = param.matrix('object', true, 'color', ';R=100;G=200;B=150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

    });

    describe('simple', () => {

        it('primitive', () => {
            expect(param.simple('string', false, 'blue').value).to.equal('blue');
        });

        it('array', () => {
            const actual = param.simple('array', false, 'blue,black,brown').value;
            expect(actual).to.deep.equal(['blue', 'black', 'brown']);
        });

        it('object', () => {
            const actual = param.simple('object', false, 'R,100,G,200,B,150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

        it('object exploded', () => {
            const actual = param.simple('object', true, 'R=100,G=200,B=150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

    });

    describe('spaceDelimited', () => {

        it('primitive', () => {
            expect(param.spaceDelimited('string', 'blue').match).to.equal(false);
        });

        it('array', () => {
            const actual = param.spaceDelimited('array', 'blue black brown').value;
            expect(actual).to.deep.equal(['blue', 'black', 'brown']);
        });

        it('object', () => {
            const actual = param.spaceDelimited('object', 'R 100 G 200 B 150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

    });

    describe('pipeDelimited', () => {

        it('primitive', () => {
            expect(param.pipeDelimited('string', 'blue').match).to.equal(false);
        });

        it('array', () => {
            const actual = param.pipeDelimited('array', 'blue|black|brown').value;
            expect(actual).to.deep.equal(['blue', 'black', 'brown']);
        });

        it('object', () => {
            const actual = param.pipeDelimited('object', 'R|100|G|200|B|150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

    });

    describe('deepObject', () => {

        it('object exploded', () => {
            const actual = param.deepObject('color', 'color[R]=100&color[G]=200&color[B]=150').value;
            expect(actual).to.deep.equal({ R: '100', G: '200', B: '150' });
        });

    });

});