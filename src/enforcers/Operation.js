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
const EnforcerRef   = require('../enforcer-ref');
const Exception     = require('../exception');
const Result        = require('../result');
const util          = require('../util');
const Value         = require('../schema/value');

const requestKeys = ['body', 'headers', 'method', 'path', 'query'];
const rxInteger = /^\d+$/;
const rxNumber = /^\d+(?:\.\d+)?$/;

module.exports = {
    init: function (data) {
        const { major, parent, plugins, root } = data;

        plugins.push(() => {
            if (!this.parameters) this.parameters = [];

            // create a parameter map
            this.parametersMap = {};
            if (parent && parent.result && parent.result.parameters) buildParametersMap(this.parametersMap, parent.result.parameters);
            buildParametersMap(this.parametersMap, this.parameters);

            // create an all parameters object
            this.allParameters = [];
            Object.keys(this.parametersMap).forEach(at => {
                const atMap = this.parametersMap[at];
                Object.keys(atMap).forEach(name => {
                    this.allParameters.push(atMap[name]);
                });
            });

            // if this doesn't have produces but root does then this has root produces
            if (major === 2 && !this.produces && root.result.produces) {
                this.produces = root.result.produces
            }
        });
    },

    prototype: {

        /**
         * The the possible response mime types for the response code and accepts string.
         * @param {string, number} code
         * @param {string} accepts The allowed media type string. Example: text/html, application/xhtml+xml, application/xml;q=0.9, text/*;q=0.8
         * @returns {EnforcerResult<string[]>}
         */
        getResponseContentTypeMatches: function (code, accepts) {
            const exception = new Exception('Unable to determine acceptable response content types');
            const response = this.responses[code] || this.responses.default;
            let matches;
            if (!response) {
                exception.message('Invalid response code');
                exception.code = 'NO_CODE';
            } else if (this.produces) {
                matches = util.findMediaMatch(accepts, this.produces);
                if (!matches.length) {
                    exception.message('Operation does not produce acceptable type');
                    exception.code = 'NO_MATCH';
                }
            } else if (response.content) {
                matches = util.findMediaMatch(accepts, Object.keys(response.content));
                if (!matches.length) {
                    exception.message('Operation does not produce acceptable type');
                    exception.code = 'NO_MATCH';
                }
            } else {
                exception.message('Response mime types not defined');
                exception.code = 'NO_TYPES_SPECIFIED';
            }
            return new Result(matches, exception);
        },

        /**
         * Take the input parameters and deserialize and validate them.
         * @param {object} request
         * @param {string|object} [request.body] The request body
         * @param {Object<string,string>} [request.headers={}] The request headers
         * @param {object} [request.path={}] The path and query string
         * @param {string} [request.query=''] The request query string.
         * @param {object} [options]
         * @param {boolean,string[]} [options.allowOtherQueryParameters=false] Allow query parameter data that is not specified in the OAS document
         * @param {boolean} [options.pathParametersProcessed=false] Set to true if the path parameters have already been parsed, deserialized, and validated
         */
        request: function (request, options) {
            // process options
            if (!options) options = {};
            if (options && typeof options !== 'object') throw Error('Invalid options. Expected an object. Received: ' + options);
            options = Object.assign({}, options);
            if (!options.hasOwnProperty('allowOtherQueryParameters')) options.allowOtherQueryParameters = false;
            if (options.allowOtherQueryParameters) {
                if (Array.isArray(options.allowOtherQueryParameters)) {
                    if (options.allowOtherQueryParameters.length === 0) {
                        options.allowOtherQueryParameters = false;
                    } else {
                        options.allowOtherQueryParameters.forEach(item => {
                            if (typeof item !== 'string') throw Error('Invalid option allowOtherQueryParameters. The value must be a boolean or an array of strings.')
                        })
                    }
                } else if (typeof options.allowOtherQueryParameters !== 'boolean') {
                    throw Error('Invalid option allowOtherQueryParameters. The value must be a boolean or an array of strings.');
                }
            }

            // validate input parameters
            if (!request || typeof request !== 'object') throw Error('Invalid request. Expected a non-null object. Received: ' + request);
            request = this.toRequestObject(request);
            if (!request.hasOwnProperty('headers')) request.headers = {};
            if (!request.hasOwnProperty('path')) request.path = {};
            if (!request.hasOwnProperty('query')) request.query = '';
            if (!util.isObjectStringMap(request.headers)) throw Error('Invalid request headers. Expected an object with string keys and string values');
            if (!options.pathParametersProcessed && !util.isObjectStringMap(request.path)) throw Error('Invalid request path. Expected an object with string keys and string values');
            if (typeof request.query !== 'string') throw Error('Invalid request query. Expected a string');

            // build request objects
            const req = {
                header: util.lowerCaseObjectProperties(request.headers),
                path: request.path,
                query: util.parseQueryString(decodeURI(request.query))
            };
            if (request.body !== undefined) req.body = request.body;
            const cookie = req.header.cookie || '';
            const query = request.query;
            req.cookie = cookie ? util.parseCookieString(cookie) : {};
            delete req.header.cookie;

            const exception = Exception('Request has one or more errors');
            exception.statusCode = 400;

            const parameters = this.parametersMap;
            const result = {
                cookie: {},
                headers: {},
                path: request.path,
                query: {}
            };

            // if formData is expected for the body then make sure that the body is a non-null object
            if (parameters.formData && (!request.body || typeof request.body !== 'object')) throw Error('Parameters in "formData" require that the provided body be a non-null object');

            // check for unknown path parameters
            if (options.pathParametersProcessed) {
                const unknownPathParameters = [];
                Object.keys(request.path).forEach(key => {
                    if (!parameters.path.hasOwnProperty(key)) unknownPathParameters.push(key)
                });
                if (unknownPathParameters.length) {
                    const message = 'Received unexpected parameter' +
                        (unknownPathParameters.length === 1 ? '' : 's') + ': ' +
                        unknownPathParameters.join(', ');
                    exception.nest('In path parameters').message(message);
                }
            }

            // begin processing parameters
            const inArray = ['cookie', 'header', 'query'];
            if (!options.pathParametersProcessed) inArray.push('path');
            if (parameters.formData) inArray.push('formData');
            inArray.forEach(at => {

                const isFormData = at === 'formData';
                const child = isFormData ? exception.nest('In body') : exception.nest('In ' + at + ' parameters');
                const reqKey = isFormData ? 'body' : at;
                const input = req[reqKey] || {};
                const missingRequired = [];
                const potentialCausesForUnknownParameters = [];
                const unknownParameters = (() => {
                    if (at === 'cookie' || at === 'header') return [];
                    const keys = Object.keys(input);
                    if (at === 'query') {
                        const allowed = options.allowOtherQueryParameters;
                        if (Array.isArray(allowed)) return keys.filter(item => !allowed.includes(item));
                        return allowed ? [] : keys;
                    }
                    return keys;
                })();

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
                            deserializeAndValidate(child.at(key), parameter.schema, data, '', v => output[key] = v);

                        } else if (parameter.in === 'query' && parameter.style === 'form' && parameter.explode && type === 'object') {
                            const data = parameter.parse(query, input);
                            if (data.error) {
                                const exception = new Exception('In ' + at + ' parameter "' + key + '"');
                                exception.message(data.error);
                                potentialCausesForUnknownParameters.push(exception);
                            } else {
                                deserializeAndValidate(child.at(key), parameter.schema, data, '', value => {
                                    Object.keys(value).forEach(key => util.arrayRemoveItem(unknownParameters, key));
                                    output[key] = value;
                                })
                            }

                        } else if (parameter.in === 'query' && parameter.style === 'deepObject' && type === 'object') {
                            const data = parameter.parse(query, input);
                            if (data.error) {
                                const exception = new Exception('In ' + at + ' parameter "' + key + '"');
                                exception.push(data.error);
                                potentialCausesForUnknownParameters.push(exception);
                            } else {
                                deserializeAndValidate(child.at(key), parameter.schema, data, '', value => {
                                    Object.keys(value).forEach(k => util.arrayRemoveItem(unknownParameters, key + '[' + k + ']'));
                                    output[key] = value;
                                });
                            }

                        } else if (parameter.required) {
                            missingRequired.push(key);
                        }

                        if (!output.hasOwnProperty(key) && parameter.schema.hasOwnProperty('default')) {
                            output[key] = util.copy(parameter.schema.default);
                        }
                    });

                    result[reqKey === 'header' ? 'headers' : reqKey] = Value.extract(output);
                }

                // add exception for any unknown query parameters
                if (unknownParameters.length) {
                    const message = 'Received unexpected parameter' +
                        (unknownParameters.length === 1 ? '' : 's') + ': ' +
                        unknownParameters.join(', ');
                    if (potentialCausesForUnknownParameters.length) {
                        const subChild = child.nest(message).nest('Possible causes');
                        potentialCausesForUnknownParameters.forEach(err => subChild.push(err));
                    } else {
                        child.message(message);
                    }
                }

                //
                if (missingRequired.length) {
                    child.message('Missing required parameter' + (missingRequired.length > 1 ? 's' : '') +
                        ': ' + missingRequired.join(', '));
                }
            });

            if (req.hasOwnProperty('body')) {
                let value = req.body;

                // v2 parameter in body
                if (parameters.body) {
                    const parameter = getBodyParameter(parameters);
                    value = primitiveBodyDeserialization(value, parameter.schema);
                    deserializeAndValidate(exception.nest('In body'), parameter.schema, { value }, 'write',value => {
                        result.body = Value.extract(value);
                    });

                // v3 requestBody
                } else if (this.requestBody) {
                    const { content, contentType, matches } = findRequestBodyMediaTypeMatches(this, req);
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
                                value = primitiveBodyDeserialization(value, media.schema);
                                deserializeAndValidate(child.nest('For Content-Type ' + mediaType), media.schema, { value }, 'write', value => {
                                    result.body = Value.extract(value);
                                    passed = true;
                                });
                            }

                            // if the media type was an exact match or if the schema passed then stop executing
                            if (contentType === mediaType || passed) break;
                        }

                        // if nothing passed then add all exceptions
                        if (!passed) exception.push(child);

                    } else {
                        exception.message('Content-Type not accepted');
                        exception.statusCode = 415;
                    }

                } else if (!parameters.formData) {
                    exception.message('Body is not allowed');
                }
            } else if (parameters.body && getBodyParameter(parameters).required) {
                exception.message('Missing required parameter: body');
            } else if (this.requestBody && this.requestBody.required) {
                exception.message('Missing required request body');
            } else {
                let bodySchema;
                if (parameters.body) {
                    bodySchema = getBodyParameter(parameters).schema
                } else if (this.requestBody) {
                    const { content, matches } = findRequestBodyMediaTypeMatches(this, req);
                    const length = matches.length;
                    for (let i = 0; i < length; i++) {
                        const type = matches[i];
                        const schema = content[type].schema;
                        if (schema && schema.hasOwnProperty('default')) {
                            bodySchema = schema;
                            break;
                        }
                    }
                }
                if (bodySchema && bodySchema.hasOwnProperty('default')) result.body = util.copy(bodySchema.default)
            }

            return new Result(result, exception);
        },

        response: function (code, body, headers = {}) {
            const exception = new Exception('Response invalid');
            const warning = new Exception('Response has one or more warnings');
            const hasBody = body !== undefined;
            const response = (() => {
                const codeString = String(code)
                const codeChar = codeString[0]
                return this.responses[code] || this.responses[codeChar + 'XX'] || this.responses.default;
            })()
            const result = { headers: {} };
            const major = this.enforcerData.major;
            const skipCodes = this.enforcerData.options.exceptionSkipCodes;
            const escalateCodes = this.enforcerData.options.exceptionEscalateCodes;

            if (!util.isPlainObject(headers) && util.isObject(headers)) headers = Object.create({}, headers);
            if (!util.isObject(headers)) throw Error('Invalid headers input parameter. Must be a plain object');
            headers = util.lowerCaseObjectProperties(headers);

            if (response) {
                if (hasBody) {
                    if (major === 2) {
                        const schema = response.schema;
                        if (!schema) {
                            result.body = body;
                        } else if (schema.type === 'file') {
                            result.schema = schema;
                            result.body = body;
                        } else {
                            body = schema.formalize(body);
                            let err = schema.validate(body, { readWriteMode: 'read' });
                            if (!err) [body, err] = schema.serialize(body);
                            if (err) {
                                exception.at('body').merge(err);
                            } else {
                                result.schema = schema;
                                result.body = body;
                            }
                        }

                    } else if (major === 3) {
                        const content = response.content;
                        if (!content) {
                            result.body = body;

                        } else {
                            const definedTypes = Object.keys(content);
                            let contentType;
                            if (headers.hasOwnProperty('content-type')) {
                                const type = headers['content-type'].split(';')[0].trim();
                                if (content.hasOwnProperty(type)) {
                                    contentType = type;
                                } else if (!skipCodes.WOPE001) {
                                    (escalateCodes.WOPE001 ? exception : warning).message('Content type specified is not defined as a possible mime-type: ' + type + '. [WOPE001]');
                                }
                            } else if (definedTypes.length === 1) {
                                contentType = definedTypes[0];
                            } else {
                                exception.message('Unable to determine content type to use. Please specify this value in the header object');
                            }

                            const schema = contentType && content[contentType] && content[contentType].schema;
                            if (schema) {
                                body = schema.formalize(body);
                                let err = schema.validate(body, { readWriteMode: 'read' });
                                if (!err) [body, err] = schema.serialize(body);
                                if (err) {
                                    exception.at('body').merge(err);
                                } else {
                                    result.schema = schema;
                                    result.body = body;
                                }
                            } else {
                                result.body = body;
                            }
                        }
                    }
                }

                // validate and serialize headers
                const headerKeys = Object.keys(headers);
                if (response.headers) {
                    Object.keys(response.headers).forEach(key => {
                        const lowerKey = key.toLowerCase();
                        const header = response.headers[key];
                        const schema = header.schema;
                        let value;

                        if (headers.hasOwnProperty(lowerKey)) {
                            value = headers[lowerKey];
                        } else if (schema.hasOwnProperty('default')) {
                            value = util.copy(schema.default);
                        }

                        if (value !== undefined) {
                            util.arrayRemoveItem(headerKeys, lowerKey);
                            value = schema.formalize(value);
                            let err = schema.validate(value);
                            if (!err) [value, err] = schema.serialize(value);
                            if (!err) [value, err] = header.stringify(value);
                            if (err) {
                                exception.at('headers').at(key).merge(err);
                            } else {
                                result.headers[key] = value;
                            }
                        } else if (header.required) {
                            exception.at('headers').at(key).message('Missing required header: ' + key);
                        }
                    });
                }
                headerKeys.forEach(key => {
                    const value = headers[key];
                    if (typeof value !== 'string' && !skipCodes.WOPE002) {
                        (escalateCodes.WOPE002 ? exception : warning)
                            .at('headers')
                            .at(key)
                            .message('Value has no schema and is not a string. [WOPE002]');
                    }
                });

            } else {
                exception.message('Invalid response code: ' + code);
            }

            // extract SchemaValue values
            if (result.hasOwnProperty('body')) result.body = Value.extract(result.body);
            if (result.headers) {
                Object.keys(result.headers).forEach(key => {
                    result.headers[key] = Value.extract(result.headers[key]);
                });
            }

            return new Result(result, exception, warning);
        },

        toRequestObject: function (req) {
            const result = {};
            requestKeys.forEach(key => {
                if (key in req) result[key] = req[key]
            });
            return result;
        }
    },

    validator: function ({ major, definition: componentDefinition }) {
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
                            exception.message('The operationId must be unique');
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
                    allowed: ({ options, parent }) => major === 3 && !!options.requestBodyAllowedMethods[parent.key || 'post']
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
                    errors: ({ definition, warn, options, parent }) => {
                        if (definition.length >= 120 && !options.exceptionSkipCodes.WOPE003 && !util.schemaObjectHasSkipCode(componentDefinition, 'WOPE003')) {
                            (options.exceptionEscalateCodes.WOPE003 ? exception : warn).message('Value should be less than 120 characters. [WOPE003]');
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

    parametersValidation: ({ exception, parent, root, definition }) => {
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
            exception.message('Only one body parameter allowed');
        }

        if (hasBody && hasFormData) {
            exception.message('Cannot have parameters in "body" and "formData" simultaneously');
        }

        if (duplicates.length) {
            exception.message('Parameter name must be unique per location. Duplicates found: ' + duplicates.join(', '));
        }

        if (hasFile) {
            // parameter might be defined within operation (that can have consumes) or path (that cannot have consumes)
            const consumes = parent.validator === module.exports.validator
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
                exception.message('Parameters of type "file" require the consumes property to be set to either "multipart/form-data" or "application/x-www-form-urlencoded"')
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

function deserializeAndValidate(exception, schema, data, readWriteMode, success) {
    if (!data.error) data = schema.deserialize(data.value);
    if (!data.error) data.error = schema.validate(data.value, { readWriteMode });
    if (data.error) {
        if (exception) exception.push(data.error);
    } else {
        success(data.value);
    }
}

function findRequestBodyMediaTypeMatches (context, req) {
    const contentType = req.header.hasOwnProperty('content-type') ? req.header['content-type'].split(';')[0].trim() : '*/*';
    const content = context.requestBody.content;
    const mediaTypes = Object.keys(content);
    const matches = util.findMediaMatch(contentType, mediaTypes);
    return {
        content,
        contentType,
        matches
    }
}

function primitiveBodyDeserialization (value, schema) {
    if (typeof value === 'string') {
        if (schema.type === 'boolean') {
            if (value === 'true') value = true;
            if (!value || value === 'false') value = false;
        } else if (schema.type === 'integer') {
            if (rxInteger.test(value)) value = parseInt(value);
        } else if (schema.type === 'number') {
            if (rxNumber.test(value)) value = parseFloat(value);
        }
    }
    return value;
}
