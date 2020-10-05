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

module.exports = Enforcer;

const dataTypeFormats       = require('./src/data-type-formats');
const Exception             = require('./src/exception');
const NewRefParser          = require('./src/ref-parser');
const OldRefParser          = require('json-schema-ref-parser');
const Result                = require('./src/result');
const Super                 = require('./src/super');
const util                  = require('./src/util');

/**
 * Create an Enforcer instance.
 * @param {string, object} definition
 * @param {object} [options]
 * @param {boolean} [options.hideWarnings=false] Set to true to hide warnings from the console.
 * @param {boolean} [options.fullResult=false] Set to true to get back a full result object with the value, warnings, and errors.
 * @param {boolean} [options.experimentalDereference=false] A soon to be default option for improved dereferencing.
 * @param {object} [options.componentOptions] Options that get sent along to components.
 * @returns {Promise<OpenApi|Swagger>|Promise<Result<OpenApi|Swagger>>}
 */
async function Enforcer(definition, options) {
    let openapi;
    let warnings = Exception('One or more warnings exist int he OpenAPI definition');

    // normalize options
    options = Object.assign({}, options);
    if (!options.hasOwnProperty('hideWarnings')) options.hideWarnings = false;
    if (!options.hasOwnProperty('fullResult')) options.fullResult = false;
    if (!options.hasOwnProperty('componentOptions')) options.componentOptions = {};

    let exception;
    definition = util.copy(definition);
    const useNewRefParser = Enforcer.config.useNewRefParser;
    const refParser = useNewRefParser ? new NewRefParser(definition) : new OldRefParser();
    if (useNewRefParser) {
        const [ dereferenceValue, dereferenceErr ] = await refParser.dereference();
        definition = dereferenceValue;
        exception = dereferenceErr;
    } else {
        definition = await refParser.dereference(definition);
    }

    if (!exception) {
        exception = Exception('One or more errors exist in the OpenAPI definition');
        const hasSwagger = definition.hasOwnProperty('swagger');
        if (!hasSwagger && !definition.hasOwnProperty('openapi')) {
            exception.message('Missing required "openapi" or "swagger" property');

        } else {
            const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(definition.swagger || definition.openapi);
            if (!match) {
                exception.at(hasSwagger ? 'swagger' : 'openapi').message('Invalid value');

            } else {
                const major = +match[1];
                const validator = major === 2
                    ? Enforcer.v2_0.Swagger
                    : Enforcer.v3_0.OpenApi;
                [ openapi, exception, warnings ] = validator(definition, refParser, options.componentOptions);
            }
        }
    }

    if (options.fullResult) return new Result(openapi, exception, warnings);
    if (!options.hideWarnings && warnings && warnings.hasException) console.warn(warnings.toString());
    if (exception && exception.hasException) throw Error(exception.toString());
    return openapi;
}

Enforcer.config = {
    useNewRefParser: false
};

Enforcer.bundle = function (definition) {
    if (Enforcer.config.useNewRefParser) {
        const refParser = new NewRefParser(definition);
        return refParser.bundle();
    } else {
        const refParser = new OldRefParser();
        return refParser.bundle(definition);
    }
};

Enforcer.dereference = function (definition) {
    if (Enforcer.config.useNewRefParser) {
        const refParser = new NewRefParser(definition);
        return refParser.dereference();
    } else {
        const refParser = new OldRefParser();
        return refParser.dereference(definition);
    }
};

Enforcer.Enforcer = Enforcer;

Enforcer.Exception = Exception;

Enforcer.Result = Result;

Enforcer.toPlainObject = util.toPlainObject;

const v2_0 = Enforcer.v2_0 = {};
Object.defineProperty(v2_0, 'version', { value: '2.0' });
Object.assign(v2_0, {
    Contact: Super(v2_0, 'Contact'),
    ExternalDocumentation: Super(v2_0, 'ExternalDocumentation'),
    Header: Super(v2_0, 'Header'),
    Info: Super(v2_0, 'Info'),
    License: Super(v2_0, 'License'),
    Operation: Super(v2_0, 'Operation'),
    Parameter: Super(v2_0, 'Parameter'),
    PathItem: Super(v2_0, 'PathItem'),
    Paths: Super(v2_0, 'Paths'),
    Reference: Super(v2_0, 'Reference'),
    Response: Super(v2_0, 'Response'),
    Responses: Super(v2_0, 'Responses'),
    Schema: Super(v2_0, 'Schema'),
    SecurityRequirement: Super(v2_0, 'SecurityRequirement'),
    SecurityScheme: Super(v2_0, 'SecurityScheme'),
    Swagger: Super(v2_0, 'Swagger'),
    Tag: Super(v2_0, 'Tag'),
    Xml: Super(v2_0, 'Xml')
});

const v3_0 = Enforcer.v3_0 = {};
Object.defineProperty(v3_0, 'version', { value: '3.0' });
Object.assign(v3_0, {
    Callback: Super(v3_0, 'Callback'),
    Components: Super(v3_0, 'Components'),
    Contact: Super(v3_0, 'Contact'),
    Encoding: Super(v3_0, 'Encoding'),
    Example: Super(v3_0, 'Example'),
    ExternalDocumentation: Super(v3_0, 'ExternalDocumentation'),
    Header: Super(v3_0, 'Header'),
    Info: Super(v3_0, 'Info'),
    License: Super(v3_0, 'License'),
    Link: Super(v3_0, 'Link'),
    MediaType: Super(v3_0, 'MediaType'),
    OAuthFlow: Super(v3_0, 'OAuthFlow'),
    OAuthFlows: Super(v3_0, 'OAuthFlows'),
    OpenApi: Super(v3_0, 'OpenApi'),
    Operation: Super(v3_0, 'Operation'),
    Parameter: Super(v3_0, 'Parameter'),
    PathItem: Super(v3_0, 'PathItem'),
    Paths: Super(v3_0, 'Paths'),
    Reference: Super(v3_0, 'Reference'),
    RequestBody: Super(v3_0, 'RequestBody'),
    Response: Super(v3_0, 'Response'),
    Responses: Super(v3_0, 'Responses'),
    Schema: Super(v3_0, 'Schema'),
    SecurityRequirement: Super(v3_0, 'SecurityRequirement'),
    SecurityScheme: Super(v3_0, 'SecurityScheme'),
    Server: Super(v3_0, 'Server'),
    ServerVariable: Super(v3_0, 'ServerVariable'),
    Tag: Super(v3_0, 'Tag'),
    Xml: Super(v3_0, 'Xml')
});

Object.defineProperty(Enforcer, 'version', {
    configurable: false,
    value: require('./package.json').version
});

[Enforcer.v2_0.Schema, Enforcer.v3_0.Schema].forEach(Schema => {
    Schema.defineDataTypeFormat('integer', 'int32', null);
    Schema.defineDataTypeFormat('integer', 'int64', null);
    Schema.defineDataTypeFormat('number', 'float', null);
    Schema.defineDataTypeFormat('number', 'double', null);
    Schema.defineDataTypeFormat('string', 'binary', dataTypeFormats.binary);
    Schema.defineDataTypeFormat('string', 'byte', dataTypeFormats.byte);
    Schema.defineDataTypeFormat('string', 'date', dataTypeFormats.date);
    Schema.defineDataTypeFormat('string', 'date-time', dataTypeFormats.dateTime);
});
