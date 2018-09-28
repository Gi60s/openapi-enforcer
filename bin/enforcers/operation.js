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
const util          = require('../util');

module.exports = OperationEnforcer;

function OperationEnforcer({ definition, parent }) {
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
                    buildParametersMap(parametersMap, parent.parameters);
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
 * @param {string} [request.path='/'] The path and query string
 * @param {object} [options]
 * @param {boolean} [options.allowOtherQueryParameters=false] Allow query parameters that are not specified in the OAS document
 * @param {boolean} [options.allowOtherCookieParameters=true] Allow cookies that are not specified in the OAS document
 * @param {boolean} [options.bodyDeserializer] A function to call to deserialize the body into it's expected type.
 */
OperationEnforcer.prototype.request = function(request, options) {
    // validate request parameter and properties
    if (request.hasOwnProperty('body') && !(typeof request.body === 'string' || typeof request.body === 'object')) throw Error('Invalid body provided');
    if (request.hasOwnProperty('cookies') && typeof request.cookies !== 'string') throw Error('Invalid request cookies. Expected a string.');
    if (request.hasOwnProperty('headers') && !util.isObjectStringMap(request.headers)) throw Error('Invalid request headers. Expected an object with string keys and string values');
    if (request.hasOwnProperty('path') && typeof request.path !== 'string') throw Error('Invalid request path. Expected a string');

    // build request objects
    const [ path, query ] = request.path.split('?');
    const req = { path, query };
    req.header = request.headers ? util.lowerCaseObjectProperties(request.headers) : {};
    req.cookie = req.header.cookies || '';
    delete req.header.cookies;

    // normalize options
    options = Object.assign({ allowOtherQueryParameters: false }, options);

    const exception = Exception('Request has one or more errors');
    exception.statusCode = 400;

    const parameters = this.parametersMap;


    ['cookie', 'header', 'path', 'query'].forEach(at => {
        if (parameters[at]) {
            const child = exception.nest('In ' + at + ' parameters');
            const input = req[at];
            const output = {};
            const missingRequired = [];

            // TODO: allowOtherCookieParameters
            const unknownParameters = at === 'query' && !options.allowOtherQueryParameters
                ? Object.keys(input)
                : [];

            Object.keys(parameters[at].map).forEach(name => {
                // TODO: working here
                const key = at === 'header' ? headerNamesMap[name] : name;
                const parameter = parameters[at].map[name];
                const type = parameter.schema && parameter.schema.type;
                if (input.hasOwnProperty(key)) {
                    util.arrayRemoveItem(unknownParameters, key);
                    const data = (at === 'query' || at === 'cookie')
                        ? parameter.parse(queryString, input)
                        : parameter.parse(input[key]);
                    processInput(child.at(key), parameter, data, v => output[key] = v);

                } else if (parameter.in === 'query' && parameter.style === 'form' && parameter.explode && type === 'object') {
                    const data = parameter.parse(queryString, input);
                    processInput(null, parameter, data, value => {
                        Object.keys(value).forEach(key => util.arrayRemoveItem(unknownParameters, key));
                        output[key] = value;
                    })

                } else if (parameter.in === 'query' && parameter.style === 'deepObject' && type === 'object') {
                    const data = parameter.parse(queryString, input);
                    processInput(child.at(key), parameter, data, value => {
                        Object.keys(value).forEach(k => util.arrayRemoveItem(unknownParameters, key + '[' + k + ']'));
                        output[key] = value;
                    });

                } else if (parameter.required) {
                    missingRequired.push(key);
                }
            });

            req[at] = output;

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
        }
    })
};

function buildParametersMap(map, parameters) {
    if (parameters) {
        parameters.forEach(parameter => {
            if (!map.hasOwnProperty(parameter.in)) map[parameter.in] = {};
            map[parameter.in][parameter.name] = parameter;
        })
    }
}