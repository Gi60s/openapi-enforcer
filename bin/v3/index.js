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
const params        = require('./param-style');
const querystring   = require('querystring');
const util          = require('../util');

module.exports = Version;

function Version(enforcer, definition) {
    this.enforcer = enforcer;
    this.definition = definition;

    const components = definition.components || {};
    this.callbacks = components.callback || {};
    this.examples = components.examples || {};
    this.headers = components.headers || {};
    this.links = components.links || {};
    this.parameters = components.parameters || {};
    this.requestBodies = components.requestBodies || {};
    this.responses = components.responses || {};
    this.schemas = components.schemas || {};
    this.securitySchemes = components.securitySchemes || {};
}

Version.prototype.getDiscriminatorKey = function(schema, value) {
    const discriminator = schema.discriminator;
    if (discriminator && value.hasOwnProperty(discriminator.propertyName)) return value[discriminator.propertyName];
};

Version.prototype.getDiscriminatorSchema = function(schema, value) {
    const key = this.getDiscriminatorKey(schema, value);
    if (key) {
        const discriminator = schema.discriminator;
        const mapping = discriminator.mapping;
        if (mapping && mapping[key]) return mapping[key];

        const schemas = this.definition.components.schemas;
        if (schemas && schemas[key]) return schemas[key];
    }
};

Version.prototype.getParameterSchema = function(pathSchema, paramName) {

};

/**
 * Deserialize the request parameters.
 * @param {object} schema The path schema object.
 * @param {object} req
 * @param {object|string} req.body
 * @param {Object<string>} req.cookie
 * @param {Object<string>} req.header
 * @param {string} req.method
 * @param {object<string>} req.path
 * @param {string} req.query
 * @returns {{ error: Array<string>|null, value: null|{ body: string|object, cookie: object, header: object, path: object, query: object }}}
 */
Version.prototype.parseRequestParameters = function(schema, req) {
    const errors = [];
    const mSchema  = schema[req.method];
    const paramTypes = ['cookie', 'header', 'path', 'query'];
    const result = {
        cookie: {},
        header: {},
        path: {},
        query: {}
    };

    // build a parameter map
    const paramMap = {
        cookie: {},
        header: {},
        path: {},
        query: {}
    };
    [schema, mSchema].forEach(schema => {
        if (schema.parameters) {
            schema.parameters.forEach(param => {
                const store = paramMap[param.in];
                if (store) store[param.name] = param;
            });
        }
    });

    // body already parsed so just check it for errors
    if (mSchema.requestBody && req.body !== undefined) {
        const contentType = req.headers['content-type'] || '*/*';
        const requestBody = mSchema.requestBody;
        const key = util.findMediaMatch(contentType, Object.keys(requestBody.content));
        if (key) {
            const bodyErrors = this.enforcer.errors(requestBody.content[key].schema, req.body);
            if (bodyErrors) errors.push('One or more errors with body:\n\t' + bodyErrors.join('\n\t'));
            result.body = bodyErrors ? undefined : util.copy(req.body);
        }
    }

    // parse and validate cookie, headers, path, and query
    paramTypes.forEach(paramType => {
        const schemas = paramMap[paramType];
        const values = req[paramType];

        Object.keys(schemas).forEach(name => {
            const definition = schemas[name];
            if (!definition.schema && !definition.content) return;
            const schema = definition.schema || definition.content[Object.keys(definition.content)[0]];
            if (!schema) return;

            const at = definition.in;
            if (values.hasOwnProperty(name) || at === 'query') {
                const at = definition.in;
                const style = definition.style || defaultStyle(at);
                const explode = definition.hasOwnProperty('explode') ? definition.explode : style === 'form';
                const type = util.schemaType(schema);
                let parsed;
                let value = values[name];

                switch (style) {
                    case 'deepObject':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'query') throw Error('The deepObject style only works with query parameters. Error at ' + at + ' parameter "' + name + '"');
                        if (type !== 'object') throw Error('The deepObject style only works with objects but the parameter schema type is ' + type);
                        parsed = params.deepObject(name, req.query);
                        break;

                    case 'form':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'cookie' && at !== 'query') throw Error('The form style only works with cookie and query parameters. Error at ' + at + ' parameter "' + name + '"');
                        if (at === 'query') {
                            // TODO
                            /*if (explode)

                            if (explode && type === 'object') throw Error('The query parameter form style does not work with exploded objects. Error at ' + at + ' parameter "' + name + '"');
                            value = explode ? name + '=' + value.join('&' + name + '=') : value.pop();*/
                        }
                        parsed = params.form(type, explode, name, value);
                        break;

                    case 'label':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'path') throw Error('The label style only works with path parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.label(type, explode, value);
                        break;

                    case 'matrix':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'path') throw Error('The matrix style only works with path parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.matrix(type, explode, name, value);
                        break;

                    case 'pipeDelimited':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'query') throw Error('The pipeDelimited style only works with query parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.pipeDelimited(type, queryParseDelimited(name, '|', req.query));
                        break;

                    case 'simple':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'path' && at !== 'header') throw Error('The simple style only works with path and header parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.simple(type, explode, value);
                        break;

                    case 'spaceDelimited':
                        // throw Error because it's a problem with the swagger
                        if (at !== 'query') throw Error('The spaceDelimited style only works with query parameters. Error at ' + at + ' parameter "' + name + '"');
                        parsed = params.spaceDelimited(type, queryParseDelimited(name, '%20', req.query));
                        break;

                    default:
                        throw Error('Invalid parameter style: ' + style);
                }

                // parse was successful, now convert type, then validate data
                if (parsed.match) {
                    const typed = this.enforcer.deserialize(schema, parsed.value);
                    if (typed.errors) {
                        errors.push('Invalid type for ' + at + ' parameter "' + name + '":\n\t' + typed.errors.join('\n\t'));
                    } else {
                        const validationErrors = this.enforcer.errors(schema, typed.value);
                        if (validationErrors) {
                            errors.push('Invalid value for ' + at + ' parameter "' + name + '":\n\t' + validationErrors.join('\n\t'));
                        }
                    }

                    // store typed value
                    result[paramType][name] = typed.value;
                } else {
                    errors.push('Expected ' + at + ' parameter "' + name + '" to be formatted in ' +
                        (explode ? 'exploded ' : '') + style + ' style');
                }

            // value not provided - check if required
            } else if (definition.required) {
                errors.push('Missing required ' + at + ' parameter "' + name + '"');
            }
        });
    });

    const hasErrors = errors.length;
    return {
        errors: hasErrors ? errors : null,
        value: hasErrors ? null : result
    }
};


Version.defaults = {

    populate: {
        autoFormat: false,          // setting this value to true may hide some errors as values are auto formatted to their correct type
        copy: false,                // mode can be either copy or mutate. Mutate is faster but copy preserves the original object
        defaults: true,
        ignoreMissingRequired: true,
        oneOf: true,
        replacement: 'handlebar',
        templateDefaults: true,
        templates: true,
        variables: true
    },

    request: {
        purge: true,                // any provided request data (in query or form data) that is not specified in the open api will be ignored
        strict: true                // the request can only supply data (in query or form data) in the spec or an error is thrown
    },

    validate: {
        depth: Number.MAX_VALUE,    // validate to full depth

        boolean: true,

        // numbers
        integer: true,
        number: true,
        multipleOf: true,
        maximum: true,
        minimum: true,

        // strings
        binary: true,
        byte: true,
        date: true,
        dateExists: true,
        dateTime: true,
        maxLength: true,
        minLength: true,
        pattern: true,
        string: true,
        timeExists: true,

        // arrays
        array: true,
        items: true,
        maxItems: true,
        minItems: true,
        uniqueItems: true,

        // objects
        additionalProperties: true,
        allOf: true,
        anyOf: true,
        discriminator: true,
        maxProperties: true,
        minProperties: true,
        not: true,
        object: true,
        oneOf: true,
        properties: true,
        required: true,

        // general
        enum: true
    }

};

exports.getDiscriminatorSchema = function(definition, schema, value) {
    const discriminator = schema.discriminator;
    if (discriminator && value.hasOwnProperty(discriminator.propertyName)) {
        const key = value[discriminator.propertyName];
        const mapping = discriminator.mapping;
        if (mapping && mapping[key]) return mapping[key];

        const schemas = definition.components.schemas;
        if (schemas && schemas[key]) return schemas[key];
    }
};

exports.initialize = function(openapi) {
    openapi.components = Object.assign({
        callbacks: {},
        examples: {},
        headers: {},
        links: {},
        parameters: {},
        requestBodies: {},
        responses: {},
        schemas: openapi.definitions || {},
        securitySchemes: {}
    }, openapi.components);
};


function defaultStyle(paramType) {
    switch (paramType) {
        case 'cookie':
        case 'query':
            return 'form';
        case 'header':
        case 'path':
            return 'simple';
    }
}