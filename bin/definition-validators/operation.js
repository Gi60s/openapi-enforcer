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
const OperationEnforcer     = require('../enforcers/operation');

module.exports = OperationObject;

const map = new WeakMap();
const requestBodyAllowedMethods = { post: true, put: true, options: true, head: true, patch: true };
const rxCode = /^[1-5]\d{2}$/;
const rxRange = /^[1-5](?:\d|X){2}$/;

function OperationObject(data) {
    const Callback = require('./callback');
    const ExternalDocumentation = require('./external-documentation');
    const Parameter = require('./parameter');
    const RequestBody = require('./request-body');
    const Response = require('./response');
    const SecurityRequirement = require('./security-requirement');
    const Server = require('./server');

    const { major, root } = data;

    if (!map.has(root)) map.set(root, []);
    const operationIds = map.get(root);

    Object.assign(this, {
        component: OperationEnforcer,
        type: 'object',
        properties: {
            callbacks: {
                allowed: major === 3,
                type: 'object',
                additionalProperties: Callback
            },
            consumes: {
                allowed: major === 2,
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            deprecated: {
                type: 'boolean',
                default: false
            },
            description: {
                type: 'string'
            },
            externalDocs: ExternalDocumentation,
            operationId: {
                type: 'string',
                errors: ({ exception, value }) => {
                    if (operationIds.includes(value)) {
                        exception('The operationId must be unique');
                    } else {
                        operationIds.push(value);
                    }
                }
            },
            parameters: {
                type: 'array',
                items: Parameter,
                errors: OperationObject.parametersValidation
            },
            produces: {
                allowed: major === 2,
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            requestBody: function(data) {
                const requestBody = new RequestBody(data);
                const key = data.parent.key || 'post';  // for easy unit testing default key to post if there is no parent key
                requestBody.allowed = major === 3 && !!requestBodyAllowedMethods[key];
                return requestBody;
            },
            responses: {
                required: true,
                type: 'object',
                additionalProperties: function (data) {
                    const response = new Response(data);
                    const { key } = data;
                    response.allowed = key === 'default' || rxCode.test(key) || (major === 3 && rxRange.test(key))
                        ? true
                        : 'Invalid response code.';
                    return response;
                },
                errors: ({ exception, value }) => {
                    if (Object.keys(value).length === 0) {
                        exception('Response object cannot be empty');
                    }
                }
            },
            schemes: {
                allowed: major === 2,
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['http', 'https', 'ws', 'wss']
                }
            },
            security: {
                type: 'array',
                items: SecurityRequirement
            },
            servers: {
                allowed: major === 3,
                type: 'array',
                items: Server
            },
            summary: {
                type: 'string',
                errors: ({ value, warn }) => {
                    if (value.length >= 120) {
                        warn('Value should be less than 120 characters');
                    }
                }
            },
            tags: {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        }
    });
}

OperationObject.parametersValidation = ({ exception, parent, root, validator, value }) => {
    const length = value.length;
    const duplicates = [];
    let bodiesCount = 0;
    let hasBody = false;
    let hasFormData = false;
    let hasFile = false;
    for (let i = 0; i < length; i++) {
        const p1 = value[i];

        // make sure that in body and in formData are not both present
        if (p1.in === 'body') {
            bodiesCount++;
            hasBody = true;
        }
        if (p1.in === 'formData') {
            hasFormData = true;
            if (p1.type === 'file') hasFile = true;
        }

        // check for duplicate names within same parameter "in" value
        for (let j = 0; j < length; j++) {
            const p2 = value[j];
            if (p1 !== p2 && p1.name === p2.name && p1.in === p2.in) {
                const description = p1.name + ' in ' + p1.in;
                if (!duplicates.includes(description)) duplicates.push(description);
            }
        }
    }

    if (bodiesCount > 1) {
        exception('Only one body parameter allowed');
    }

    if (hasBody && hasFormData) {
        exception('Cannot have parameters in "body" and "formData" simultaneously');
    }

    if (duplicates.length) {
        exception('Parameter name must be unique per location. Duplicates found: ' + duplicates.join(', '));
    }

    if (hasFile) {
        // parameter might be defined within operation (that can have consumes) or path (that cannot have consumes)
        const consumes = parent.validator.component === OperationEnforcer
            ? parent.value.consumes || root.value.consumes
            : root.value.consumes;
        const length = Array.isArray(consumes) ? consumes.length : 0;
        let consumesOk = false;
        for (let i = 0; i < length; i++) {
            const value = consumes[i];
            if (value === 'multipart/form-data' || value === 'application/x-www-form-urlencoded') {
                consumesOk = true;
                break;
            }
        }
        if (!consumesOk) {
            exception('Parameters of type "file" require the consumes property to be set to either "multipart/form-data" or "application/x-www-form-urlencoded"')
        }
    }
};