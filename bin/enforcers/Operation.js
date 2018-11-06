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
const EnforcerRef  = require('../enforcer-ref');

const requestBodyAllowedMethods = { post: true, put: true, options: true, head: true, patch: true };

module.exports = {
    init: function (data) {
        const { definition, parent } = data;

        const parameters = [];
        const parametersMap = {};

        let parametersProcessed = false;

        Object.defineProperties(this, {
            parameters: {
                get: function() {
                    let o;
                    if (!parametersProcessed) o = this.parametersMap;
                    return parameters;
                }
            },
            parametersMap: {
                get: function() {
                    if (!parametersProcessed) {

                        // build the parameters map
                        if (parent) buildParametersMap(parametersMap, parent.result.value.parameters);
                        buildParametersMap(parametersMap, definition.parameters);

                        // overwrite the parameters array
                        Object.keys(parametersMap).forEach(at => {
                            Object.keys(parametersMap[at]).forEach(name => {
                                parameters.push(parametersMap[at][name]);
                            })
                        });

                        parametersProcessed = true;
                    }
                    return parametersMap;
                }
            }
        });
    },

    prototype: {
        /**
         * Take the input parameters and deserialize and validate them.
         * @param {object} request
         * @param {string|object} [request.body] The request body
         * @param {Object<string,string>} [request.header={}] The request headers
         * @param {object} [request.path={}] The path and query string
         * @param {string} [request.query=''] The request query string.
         * @param {object} [options]
         * @param {boolean} [options.allowOtherQueryParameters=false] Allow query parameter data that is not specified in the OAS document
         * @param {boolean} [options.bodyDeserializer] A function to call to deserialize the body into it's expected type.
         * @param {Object<string,string>} [options.pathParametersValueMap] A map of the already parsed out path parameters.
         */
        request: function (request, options) {

            // validate input parameters
            if (!request || typeof request !== 'object') throw Error('Invalid request. Expected a non-null object. Received: ' + request);
            request = Object.assign({}, request);
            if (!request.hasOwnProperty('header')) request.header = {};
            if (!request.hasOwnProperty('path')) request.path = {};
            if (!request.hasOwnProperty('query')) request.query = '';
            if (request.hasOwnProperty('body') && !(typeof request.body === 'string' || typeof request.body === 'object')) throw Error('Invalid body provided');
            if (!util.isObjectStringMap(request.header)) throw Error('Invalid request headers. Expected an object with string keys and string values');
            if (!util.isObjectStringMap(request.path)) throw Error('Invalid request path. Expected an object with string keys and string values');
            if (typeof request.query !== 'string') throw Error('Invalid request query. Expected a string');

            if (!options) options = {};
            if (options && typeof options !== 'object') throw Error('Invalid options. Expected an object. Received: ' + options);
            options = Object.assign({}, options);
            if (!options.hasOwnProperty('allowOtherQueryParameters')) options.allowOtherQueryParameters = false;

            // build request objects
            const req = {
                header: util.lowerCaseObjectProperties(request.header),
                path: request.path,
                query: util.parseQueryString(request.query)
            };
            if (request.hasOwnProperty('body')) req.body = request.body;
            const cookie = req.header.cookie || '';
            const query = request.query;
            req.cookie = cookie ? util.parseCookieString(cookie) : {};
            delete req.header.cookie;

            const exception = Exception('Request has one or more errors');
            exception.statusCode = 400;

            const parameters = this.parametersMap;
            const result = {
                cookie: {},
                header: {},
                path: {},
                query: {}
            };

            // if formData is expected for the body then make sure that the body is a non-null object
            if (parameters.formData && (!request.body || typeof request.body !== 'object')) throw Error('Parameters in "formData" require that the provided body be a non-null object');

            // begin processing parameters
            const inArray = ['cookie', 'header', 'path', 'query'];
            if (parameters.formData) inArray.push('formData');
            inArray.forEach(at => {
                const isFormData = at === 'formData';
                const allowUnknownParameters = at === 'cookie' || at === 'header' || (at === 'query' && options.allowOtherQueryParameters);
                const child = isFormData ? exception.nest('In body') : exception.nest('In ' + at + ' parameters');
                const reqKey = isFormData ? 'body' : at;
                const input = req[reqKey] || {};
                const missingRequired = [];
                const unknownParameters = allowUnknownParameters ? [] : Object.keys(input);
                const potentialCausesForUnknownParameters = [];

                if (parameters[at]) {
                    const output = {};

                    Object.keys(parameters[at]).forEach(key => {
                        const parameter = parameters[at][key];
                        const type = parameter.schema && parameter.schema.type;
                        if (input.hasOwnProperty(key)) {
                            util.arrayRemoveItem(unknownParameters, key);
                            const data = at === 'query'
                                ? parameter.parse(query, input)
                                : at === 'cookie'
                                    ? parameter.parse(cookie, input)
                                    : parameter.parse(input[key]);
                            deserializeAndValidate(child.at(key), parameter.schema, data, v => output[key] = v);

                        } else if (parameter.in === 'query' && parameter.style === 'form' && parameter.explode && type === 'object') {
                            const data = parameter.parse(query, input);
                            if (data.error) {
                                const exception = new Exception('In ' + at + ' parameter "' + key + '"');
                                exception(data.error);
                                potentialCausesForUnknownParameters.push(exception);
                            } else {
                                deserializeAndValidate(child.at(key), parameter.schema, data, value => {
                                    Object.keys(value).forEach(key => util.arrayRemoveItem(unknownParameters, key));
                                    output[key] = value;
                                })
                            }

                        } else if (parameter.in === 'query' && parameter.style === 'deepObject' && type === 'object') {
                            const data = parameter.parse(query, input);
                            if (data.error) {
                                const exception = new Exception('In ' + at + ' parameter "' + key + '"');
                                exception(data.error);
                                potentialCausesForUnknownParameters.push(exception);
                            } else {
                                deserializeAndValidate(child.at(key), parameter.schema, data, value => {
                                    Object.keys(value).forEach(k => util.arrayRemoveItem(unknownParameters, key + '[' + k + ']'));
                                    output[key] = value;
                                });
                            }

                        } else if (parameter.required) {
                            missingRequired.push(key);
                        }
                    });

                    result[reqKey] = output;
                }

                // add exception for any unknown query parameters
                if (unknownParameters.length) {
                    const message = 'Received unexpected parameter' +
                        (unknownParameters.length === 1 ? '' : 's') + ': ' +
                        unknownParameters.join(', ');
                    if (potentialCausesForUnknownParameters.length) {
                        const subChild = child.nest(message).nest('Possible causes');
                        potentialCausesForUnknownParameters.forEach(err => subChild(err));
                    } else {
                        child(message);
                    }
                }

                //
                if (missingRequired.length) {
                    child('Missing required parameter' + (missingRequired.length > 1 ? 's' : '') +
                        ': ' + missingRequired.join(', '));
                }
            });

            if (req.hasOwnProperty('body')) {
                const value = req.body;

                // v2 parameter in body
                if (parameters.body) {
                    const parameter = getBodyParameter(parameters);
                    deserializeAndValidate(exception.nest('In body'), parameter.schema, { value }, value => {
                        result.body = value;
                    });

                    // v3 requestBody
                } else if (this.requestBody) {
                    const contentType = req.header['content-type'] || '*/*';
                    const content = this.requestBody.content;
                    const mediaTypes = Object.keys(content);
                    const matches = util.findMediaMatch(contentType, mediaTypes);
                    const length = matches.length;

                    // one or more potential matches
                    if (length) {
                        const child = new Exception('In body');

                        // find the first media type that matches the request body
                        let passed = false;
                        for (let i = 0; i < length; i++) {
                            const mediaType = matches[i];
                            const media = content[mediaType];
                            if (media.schema) {
                                deserializeAndValidate(child.nest('For Content-Type ' + mediaType), media.schema, { value }, value => {
                                    result.body = value;
                                    passed = true;
                                });
                            }

                            // if the media type was an exact match or if the schema passed then stop executing
                            if (contentType === mediaType || passed) break;
                        }

                        // if nothing passed then add all exceptions
                        if (!passed) exception(child);

                    } else {
                        exception('Content-Type not accepted');
                    }

                } else if (!parameters.formData) {
                    exception('Body is not allowed');
                }
            } else if (parameters.body && getBodyParameter(parameters).required) {
                exception('Missing required parameter: body');
            } else if (this.requestBody && this.requestBody.required) {
                exception('Missing required request body');
            }

            return new Result(result, exception);
        }
    },

    validator: function ({ major }) {
        return {
            type: 'object',
            properties: {
                callbacks: {
                    allowed: major === 3,
                    type: 'object',
                    additionalProperties: EnforcerRef('Callback')
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
                externalDocs: EnforcerRef('ExternalDocumentation'),
                operationId: {
                    type: 'string',
                    errors: (data) => {
                        const { exception, root, definition } = data;
                        if (!root.__operationIdMap) root.__operationIdMap = {};
                        if (root.__operationIdMap[definition]) {
                            exception('The operationId must be unique');
                        } else {
                            root.__operationIdMap[definition] = data;
                        }
                    }
                },
                parameters: {
                    type: 'array',
                    items: EnforcerRef('Parameter'),
                    errors: module.exports.parametersValidation
                },
                produces: {
                    allowed: major === 2,
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                requestBody: EnforcerRef('RequestBody', {
                    // for easy unit testing default key to post if there is no parent key
                    allowed: ({ parent }) => major === 3 && !!requestBodyAllowedMethods[parent.key || 'post']
                }),
                responses: EnforcerRef('Responses', { required: true }),
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
                    items: EnforcerRef('SecurityRequirement')
                },
                servers: {
                    allowed: major === 3,
                    type: 'array',
                    items: EnforcerRef('Server')
                },
                summary: {
                    type: 'string',
                    errors: ({ definition, warn }) => {
                        if (definition.length >= 120) {
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
        }
    },

    parametersValidation: ({ exception, parent, root, validator, definition }) => {
        const length = definition.length;
        const duplicates = [];
        let bodiesCount = 0;
        let hasBody = false;
        let hasFormData = false;
        let hasFile = false;
        for (let i = 0; i < length; i++) {
            const p1 = definition[i];

            // make sure that in body and in formData are not both present
            if (p1.in === 'body') {
                bodiesCount++;
                hasBody = true;
            }
            if (p1.in === 'formData') {
                hasFormData = true;
                if (p1.type === 'file') hasFile = true;
            }

            // check for duplicate names within same parameter "in" definition
            for (let j = 0; j < length; j++) {
                const p2 = definition[j];
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
                ? parent.definition.consumes || root.definition.consumes
                : root.definition.consumes;
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
    }
};

function buildParametersMap(map, parameters) {
    if (parameters) {
        parameters.forEach(parameter => {
            const at = parameter.in;
            const name = at === 'header' ? parameter.name.toLowerCase() : parameter.name;
            if (!map.hasOwnProperty(at)) map[at] = {};
            map[at][name] = parameter;
        })
    }
}

function getBodyParameter(parameters) {
    const key = Object.keys(parameters.body)[0];
    return parameters.body[key];
}

function deserializeAndValidate(exception, schema, data, success) {
    if (!data.error) data = schema.deserialize(data.value);
    if (!data.error) data.error = schema.validate(data.value);
    if (data.error) {
        if (exception) exception(data.error);
    } else {
        success(util.unIgnoreValues(data.value));
    }
}