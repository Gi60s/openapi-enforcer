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
const expect        = require('chai').expect;
const multipart     = require('../bin/multipart-parser');

describe('multipart form-data parser', () => {

    describe('nested boundary', () => {
        const str = `--AaB03x
Content-Disposition: form-data; name="username"

Larry
--AaB03x
Content-Disposition: form-data; name="files"
Content-Type: multipart/mixed; boundary=BbC04y

--BbC04y
Content-Disposition: file; filename="file1.txt"
Content-Type: text/plain

... contents of file1.txt ...
--BbC04y
Content-Disposition: file; filename="file2.gif"
Content-Type: image/gif
Content-Transfer-Encoding: binary

... contents of file2.gif ...
--BbC04y--
--AaB03x--`;
        let result;

        before(() => {
            result = multipart({ 'content-type': 'multipart/form-data; boundary=AaB03x' }, str);
        });

        describe('username', () => {

            it ('has one value', () => {
                expect(result.username.length).to.equal(1);
            });

            it('is Larry', () => {
                expect(result.username[0].content).to.equal('Larry');
            });

        });

        it('has two files', () => {
            expect(result.files.length).to.equal(2);
        });

        describe('first file', () => {

            it('has filename file1.txt', () => {
                expect(result.files[0].filename).to.equal('file1.txt');
            });

            it('content', () => {
                expect(result.files[0].content).to.equal('... contents of file1.txt ...');
            });

        });

        describe('second file', () => {

            it('filename file2.txt', () => {
                expect(result.files[1].filename).to.equal('file2.gif');
            });

            it('content', () => {
                expect(result.files[1].content).to.equal('... contents of file2.gif ...');
            });

        });
    });

    describe('nested boundary \\r', () => {
        const str = '--AaB03x\rContent-Disposition: form-data; name="username"\r\rLarry\r--AaB03x\rContent-Disposition: form-data; name="files"\rContent-Type: multipart/mixed; boundary=BbC04y\r\r--BbC04y\rContent-Disposition: file; filename="file1.txt"\rContent-Type: text/plain\r\r... contents of file1.txt ...\r--BbC04y\rContent-Disposition: file; filename="file2.gif"\rContent-Type: image/gif\rContent-Transfer-Encoding: binary\r\r... contents of file2.gif ...\r--BbC04y--\r--AaB03x--';
        let result;

        before(() => {
            result = multipart({ 'content-type': 'multipart/form-data; boundary=AaB03x' }, str);
        });

        describe('username', () => {

            it ('has one value', () => {
                expect(result.username.length).to.equal(1);
            });

            it('is Larry', () => {
                expect(result.username[0].content).to.equal('Larry');
            });

        });

        it('has two files', () => {
            expect(result.files.length).to.equal(2);
        });

        describe('first file', () => {

            it('has filename file1.txt', () => {
                expect(result.files[0].filename).to.equal('file1.txt');
            });

            it('content', () => {
                expect(result.files[0].content).to.equal('... contents of file1.txt ...');
            });

        });

        describe('second file', () => {

            it('filename file2.txt', () => {
                expect(result.files[1].filename).to.equal('file2.gif');
            });

            it('content', () => {
                expect(result.files[1].content).to.equal('... contents of file2.gif ...');
            });

        });
    });

    describe('nested boundary \\r', () => {
        const str = '--AaB03x\rContent-Disposition: form-data; name="username"\r\rLarry\r--AaB03x\rContent-Disposition: form-data; name="files"\rContent-Type: multipart/mixed; boundary=BbC04y\r\r--BbC04y\rContent-Disposition: file; filename="file1.txt"\rContent-Type: text/plain\r\r... contents of file1.txt ...\r--BbC04y\rContent-Disposition: file; filename="file2.gif"\rContent-Type: image/gif\rContent-Transfer-Encoding: binary\r\r... contents of file2.gif ...\r--BbC04y--\r--AaB03x--';
        let result;

        before(() => {
            result = multipart({ 'content-type': 'multipart/form-data; boundary=AaB03x' }, str);
        });

        describe('username', () => {

            it ('has one value', () => {
                expect(result.username.length).to.equal(1);
            });

            it('is Larry', () => {
                expect(result.username[0].content).to.equal('Larry');
            });

        });

        it('has two files', () => {
            expect(result.files.length).to.equal(2);
        });

        describe('first file', () => {

            it('has filename file1.txt', () => {
                expect(result.files[0].filename).to.equal('file1.txt');
            });

            it('content', () => {
                expect(result.files[0].content).to.equal('... contents of file1.txt ...');
            });

        });

        describe('second file', () => {

            it('filename file2.txt', () => {
                expect(result.files[1].filename).to.equal('file2.gif');
            });

            it('content', () => {
                expect(result.files[1].content).to.equal('... contents of file2.gif ...');
            });

        });
    });

    describe('nested boundary \\r\\n', () => {
        const str = '--AaB03x\r\nContent-Disposition: form-data; name="username"\r\n\r\nLarry\r\n--AaB03x\r\nContent-Disposition: form-data; name="files"\r\nContent-Type: multipart/mixed; boundary=BbC04y\r\n\r\n--BbC04y\r\nContent-Disposition: file; filename="file1.txt"\r\nContent-Type: text/plain\r\n\r\n... contents of file1.txt ...\r\n--BbC04y\r\nContent-Disposition: file; filename="file2.gif"\r\nContent-Type: image/gif\r\nContent-Transfer-Encoding: binary\r\n\r\n... contents of file2.gif ...\r\n--BbC04y--\r\n--AaB03x--';
        let result;

        before(() => {
            result = multipart({ 'content-type': 'multipart/form-data; boundary=AaB03x' }, str);
        });

        describe('username', () => {

            it ('has one value', () => {
                expect(result.username.length).to.equal(1);
            });

            it('is Larry', () => {
                expect(result.username[0].content).to.equal('Larry');
            });

        });

        it('has two files', () => {
            expect(result.files.length).to.equal(2);
        });

        describe('first file', () => {

            it('has filename file1.txt', () => {
                expect(result.files[0].filename).to.equal('file1.txt');
            });

            it('content', () => {
                expect(result.files[0].content).to.equal('... contents of file1.txt ...');
            });

        });

        describe('second file', () => {

            it('filename file2.txt', () => {
                expect(result.files[1].filename).to.equal('file2.gif');
            });

            it('content', () => {
                expect(result.files[1].content).to.equal('... contents of file2.gif ...');
            });

        });
    });

    describe('multiple', () => {
        const str = `------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="title"

title
------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="first"

James
------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="last"

Speirs
------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="checkbox"

red
------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="checkbox"

blue
------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="checkbox"

green
------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="upload"; filename="1.png"
Content-Type: image/png

ï¿½PNG


IHDR%ï¿½Vï¿½PLTEï¿½ï¿½/ï¿½ï¿½
IDATxï¿½cb67|ï¿½IENDï¿½B\`ï¿½
------WebKitFormBoundaryS6GJNAturDfzobGg
Content-Disposition: form-data; name="upload"; filename="2.png"
Content-Type: image/png

ï¿½PNG


IHDR%ï¿½Vï¿½PLTEï¿½M\\58
IDATxï¿½cb67|ï¿½IENDï¿½B\`ï¿½
------WebKitFormBoundaryS6GJNAturDfzobGg--`;

        let result;

        before(() => {
            result = multipart({ 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryS6GJNAturDfzobGg' }, str);
        });

        it('title', () => {
            expect(result.title.length).to.equal(1);
            expect(result.title[0].content).to.equal('title');
        });

        it('first', () => {
            expect(result.first.length).to.equal(1);
            expect(result.first[0].content).to.equal('James');
        });

        it('last', () => {
            expect(result.last.length).to.equal(1);
            expect(result.last[0].content).to.equal('Speirs');
        });

        it('checkbox', () => {
            expect(result.checkbox.length).to.equal(3);
            expect(result.checkbox[0].content).to.equal('red');
            expect(result.checkbox[1].content).to.equal('blue');
            expect(result.checkbox[2].content).to.equal('green');
        });

        it('upload', () => {
            expect(result.upload.length).to.equal(2);
            expect(result.upload[0].filename).to.equal('1.png');
            expect(result.upload[1].filename).to.equal('2.png');
            expect(result.upload[1].headers['content-type']).to.equal('image/png');
        });

    });


});