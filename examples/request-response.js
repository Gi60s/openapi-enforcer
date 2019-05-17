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
const Enforcer = require('../');

const definition = {
    openapi: '3.0.0',
    info: {
        version: "1.0.0",
        title: "My API"
    },
    paths: {
        "/persons/{personId}": {
            put: {
                parameters: [
                    {
                        name: 'personId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'number'
                        }
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    birthdate: {
                                        type: 'string',
                                        format: 'date'
                                    },
                                    name: {
                                        type: 'string',
                                        minLength: 1
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'The person object',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        personId: {
                                            'x-variable': 'personId',
                                            type: 'number'
                                        },
                                        birthdate: {
                                            'x-variable': 'birthdate',
                                            type: 'string',
                                            format: 'date'
                                        },
                                        name: {
                                            'x-variable': 'name',
                                            type: 'string',
                                            minLength: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const enforcer = Enforcer(definition);

const req = enforcer.request({
    path: '/shapes/square?color=red,blue'
});

const schema = req.operation;
const responseObject = req.operation.responses[200]
.populate('application/json', {
    headers: ""
});
