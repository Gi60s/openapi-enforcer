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
const bodyParser    = require('body-parser');
const busboy        = require('connect-busboy')();
const express       = require('express');
const formidable    = require('formidable');
const fs            = require('fs');
const multiparty    = require('multiparty');
const refParser     = require('json-schema-ref-parser');
const request       = require('request');
const Enforcer      = require('../index');
const yaml          = require('js-yaml');

describe.skip('middleware', () => {
    let domain;
    let handler;

    before(done => {

        const obj = yaml.safeLoad(fs.readFileSync(__dirname + '/swagger3.yml', 'utf8'));
        refParser.dereference(obj)
            .then(schema => {
                const enforcer = new Enforcer(schema);

                const app = express();

                app.use((req, res, next) => {
                    next();
                });

                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: true }));

                /*app.use((req, res, next) => {
                    const multipart = require('../bin-2/multipart-parser');
                    let data = '';
                    let biggest = 0;
                    req.on('data', buffer => {
                        data += buffer.toString();
                        const length = buffer.length;
                        for (let i = 0; i < length; i++) {
                            if (buffer[i] > biggest) biggest = buffer[i];
                        }
                    });
                    req.on('end', () => {
                        biggest;
                        req.body = multipart(req.headers, data);
                        next();
                    })
                });*/

                // demonstrate that connect-busboy, formidable, and multiparty all work
                app.use((req, res, next) => {
                    switch (req.headers.middleware) {
                        case 'busboy':
                            busboy(req, res, function(err) {
                                if (err) return next(err);

                                next();
                            });
                            break;
                        case 'formidable':
                            const form1 = new formidable.IncomingForm();
                            form1.multiples = true;
                            form1.parse(req, (err, fields, files) => {
                                if (err) return next(err);
                                req.body = Object.assign({}, fields, files);
                                next();
                            });
                            break;
                        case 'multiparty':
                            const form2 = new multiparty.Form();
                            form2.parse(req, (err, fields, files) => {
                                if (err) return next(err);
                                req.body = Object.assign({}, fields, files);
                                next();
                            });
                            break;
                        default:
                            next();
                    }
                });

                app.use(enforcer.middleware());

                app.use((req, res, next) => handler(req, res, next));

                const listener = app.listen(function(err) {
                    if (err) return done(err);
                    domain = 'http://localhost:' + listener.address().port;
                    done();
                });
            })
            .catch(done);
    });

    beforeEach(() => {
        handler = (req, res, next) => next();
    });

    /*it('GET /pets', done => {
        request({ method: 'GET', url: domain + '/pets' }, (err, res, body) => {
            done();
        });
    });*/

    it('busboy PUT /pets/{id}', done => {
        handler = (req, res, next) => {
            next();
        };

        const config = {
            method: 'PUT',
            url: domain + '/pets/1',
            formData: {
                name: 'Mittens',
                petType: 'Cat',
                //photo: fs.createReadStream(__dirname + '/cat.jpg'),
                photo: [
                    fs.createReadStream(__dirname + '/cat.jpg'),
                    fs.createReadStream(__dirname + '/swagger3.yml')
                ],
                kitten: 'false',
                multi: ['x', 'y', 'z']
            },
            headers: {
                middleware: 'multiparty',
                'content-type': 'multipart/form-data'
            }
        };

        request(config, (err, res, body) => {
            done();
        });
    });

});