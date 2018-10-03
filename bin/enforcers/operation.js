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
const Exception     = require('../exception');
const Parameter     = require('./parameter');
const Result        = require('../result');
const util          = require('../util');

const store = new WeakMap();

module.exports = OperationEnforcer;

function OperationEnforcer(data) {
    store.set(this, data);
    const { definition, parent } = data;
    Object.assign(this, definition);

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
                    if (parent) buildParametersMap(parametersMap, parent.parameters);
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

}



/**
 * Take the input parameters and deserialize and validate them.
 * @param {object} request
 * @param {string|object} request.body The request body
 * @param {Object<string,string>} [request.headers={}] The request headers
 * @param {string} request.path The path and query string
 * @param {object} [options]
 * @param {boolean} [options.allowOtherFormDataParameters=false] Allow form data that is not specified in the OAS document
 * @param {boolean} [options.allowOtherQueryParameters=false] Allow query parameters that are not specified in the OAS document
 * @param {boolean} [options.allowOtherCookieParameters=true] Allow cookies that are not specified in the OAS document
 * @param {boolean} [options.bodyDeserializer] A function to call to deserialize the body into it's expected type.
 * @param {Object<string,string>} [options.pathParametersValueMap] A map of the already parsed out path parameters.
 */
OperationEnforcer.prototype.request = async function (request, options) {
    const { major } = store.get(this);

    // validate input parameters
    if (!request || typeof request !== 'object') throw Error('Invalid request. Expected a non-null object. Received: ' + request);
    if (typeof request.path !== 'string') throw Error('Invalid request path. Expected a string. Received: ' + request.path);
    if (request.hasOwnProperty('body') && !(typeof request.body === 'string' || typeof request.body === 'object')) throw Error('Invalid body provided');
    if (request.hasOwnProperty('headers') && !util.isObjectStringMap(request.headers)) throw Error('Invalid request headers. Expected an object with string keys and string values');
    if (request.hasOwnProperty('path') && typeof request.path !== 'string') throw Error('Invalid request path. Expected a string');

    if (!options) options = {};
    if (typeof options !== 'object') throw Error('Invalid options. Expected an object. Received: ' + options);
    if (!options.hasOwnProperty('allowOtherFormDataParameters')) options.allowOtherFormDataParameters = false;
    if (!options.hasOwnProperty('allowOtherQueryParameters')) options.allowOtherQueryParameters = false;
    if (!options.hasOwnProperty('allowOtherCookieParameters')) options.allowOtherCookieParameters = true;

    // build request objects
    const pathParts = request.path.split('?');
    const path = pathParts[0];
    const query = pathParts[1] ? decodeURIComponent(pathParts[1]) : '';
    const req = {
        header: request.headers ? util.lowerCaseObjectProperties(request.headers) : {},
        path: util.edgeSlashes(path, true, false),
        query: query ? util.parseQueryString(query) : {}
    };
    req.cookie = req.header.cookies || '';
    delete req.header.cookies;

    const exception = Exception('Request has one or more errors');
    exception.statusCode = 400;

    const parameters = this.parametersMap;

    const result = {
        cookie: {},
        header: {},
        path: {},
        query: {}
    };
    ['cookie', 'header', 'path', 'query'].forEach(at => {
        const allowUnknownParameters = options['allowOther' + util.ucFirst(at) + 'Parameters'] || false;
        const child = exception.nest('In ' + at + ' parameters');
        const input = req[at];
        const missingRequired = [];

        const unknownParameters = allowUnknownParameters || at === 'path'
            ? []
            : Object.keys(input);

        if (parameters[at]) {
            const output = {};

            Object.keys(parameters[at]).forEach(key => {
                const parameter = parameters[at][key];
                const type = parameter.schema && parameter.schema.type;
                if (input.hasOwnProperty(key)) {
                    util.arrayRemoveItem(unknownParameters, key);
                    const data = (at === 'query' || at === 'cookie')
                        ? parameter.parse(query, input)
                        : parameter.parse(input[key]);
                    deserializeAndValidate(child.at(key), parameter, data, v => output[key] = v);

                } else if (parameter.in === 'query' && parameter.style === 'form' && parameter.explode && type === 'object') {
                    const data = parameter.parse(query, input);
                    deserializeAndValidate(null, parameter, data, value => {
                        Object.keys(value).forEach(key => util.arrayRemoveItem(unknownParameters, key));
                        output[key] = value;
                    })

                } else if (parameter.in === 'query' && parameter.style === 'deepObject' && type === 'object') {
                    const data = parameter.parse(query, input);
                    deserializeAndValidate(child.at(key), parameter, data, value => {
                        Object.keys(value).forEach(k => util.arrayRemoveItem(unknownParameters, key + '[' + k + ']'));
                        output[key] = value;
                    });

                } else if (parameter.required) {
                    missingRequired.push(key);
                }
            });

            result[at] = output;
        }

        // add exception for any unknown query parameters
        if (unknownParameters.length) {
            child('Received unexpected parameter' +
                (unknownParameters.length === 1 ? '' : 's') + ': ' +
                unknownParameters.join(', '));
        }

        //
        if (missingRequired.length) {
            child('Missing required parameter' + (missingRequired.length > 1 ? 's' : '') +
                ': ' + missingRequired.join(', '));
        }
    });

    return new Result(exception, result);
};

function buildParametersMap(map, parameters) {
    if (parameters) {
        parameters.forEach(parameter => {
            if (!map.hasOwnProperty(parameter.in)) map[parameter.in] = {};
            map[parameter.in][parameter.name] = parameter;
        })
    }
}

function deserializeAndValidate(exception, parameter, data, success) {
    if (!data.error) data = parameter.schema.deserialize(data.value);
    if (!data.error) data.error = parameter.schema.validate(data.value);
    if (data.error) {
        if (exception) exception(data.error);
    } else {
        success(util.convertEmptyValues(data.value));
    }
}