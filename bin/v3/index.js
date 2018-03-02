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
const params    = require('./param-style');
const parse     = require('../parse');
const util      = require('../util');
const validate  = require('../validate');

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
 * @returns {{ body: string|object, cookie: object, header: object, path: object, query: object }}
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
    const params = {
        cookie: {},
        header: {},
        path: {},
        query: {}
    };
    [schema, mSchema].forEach(schema => {
        if (schema.parameters) {
            schema.parameters.forEach(param => {
                const store = params[param.in];
                if (store) store[param.name] = param;
            });
        }
    });

    // parse and validate body
    // TODO: body doesn't need parsing or deserializing - it is already an object so just validate it
    if (mSchema.requestBody && req.body !== undefined   ) {
        const contentType = req.headers['content-type'] || '*/*';
        const requestBody = mSchema.requestBody;
        const key = util.findMediaMatch(contentType, Object.keys(requestBody.content));
        if (key) {
            const data = this.enforcer.deserialize(requestBody.content[key].schema, req.body);
            if (data.errors) {
                errors.push(data.errors);
            } else {
                result.body = data.value;
            }
        }
    }

    // parse and validate path



    // parse and validate cookie, headers, path, and query
    paramTypes.forEach(type => {
        const data = deserialize(params[type], req[type]);
        if (data.errors.length) {
            errors.push.apply(errors, data.errors);
        } else {
            result[type] = data.value;
        }
    });

    // validate that all required parameters were provided
/*
    paramTypes.forEach(type => {
        const from = req[type];
        const store = params[type];
        Object.keys(store).forEach(name => {
            if (store[name].required && !from.hasOwnProperty(name)) {
                errors.push('Missing required ' + type + ' parameter: ' + name);
            }
        });
    });
*/

    // if there are errors then return that
    if (errors.length > 0) {
        return {
            statusCode: 400,
            message: 'There are one or more errors in the request:\n\t' + errors.join('\n\t')
        };
    } else {
        return {
            body: result.body,
            cookie: result.cookie,
            header: result.header,
            path: result.path,
            query: result.query,
            statusCode: 200
        };
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

// deserialize request parameters
function deserialize(schemas, values) {
    const errors = [];
    const result = {};

    Object.keys(schemas).forEach(name => {
        const definition = schemas[name];
        if (!definition.schema && !definition.content) return;
        const schema = definition.schema || definition.content[Object.keys(definition.content)[0]];
        if (!schema) return;

        if (values.hasOwnProperty(name)) {
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
                    parsed = params.deepObject(name, value);
                    break;

                case 'form':
                    // throw Error because it's a problem with the swagger
                    if (at !== 'cookie' && at !== 'query') throw Error('The form style only works with cookie and query parameters. Error at ' + at + ' parameter "' + name + '"');
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
                    parsed = params.pipeDelimited(type, value);
                    break;

                case 'simple':
                    // throw Error because it's a problem with the swagger
                    if (at !== 'path' && at !== 'header') throw Error('The simple style only works with path and header parameters. Error at ' + at + ' parameter "' + name + '"');
                    parsed = params.simple(type, explode, value);
                    break;

                case 'spaceDelimited':
                    // throw Error because it's a problem with the swagger
                    if (at !== 'query') throw Error('The spaceDelimited style only works with query parameters. Error at ' + at + ' parameter "' + name + '"');
                    parsed = params.spaceDelimited(type, value);
                    break;
            }

            if (parsed.match) {
                const errors2 = [];
                const data = deserialize2(errors2, '', schema, parsed.value);
                if (errors2.length) {
                    errors.push('One or more errors with ' + at + ' parameter "' + name + '":\n\t' + errors2.join('\n\t'));
                } else {
                    result[name] = data;
                }
            } else {
                errors.push('Expected value to be formatted in ' +
                    (explode ? 'exploded ' : '') +
                    style + ' style for ' + at + ' parameter "' + name + '". Received: ' + value);
            }

        } else if (schema.required) {
            errors.push('Missing required parameter: ' + name);
        }
    });

    return {
        errors,
        value: result
    };
}

function deserialize2(errors, prefix, schema, value) {
    const type = util.schemaType(schema);
    let result;
    switch (type) {
        case 'array':
            if (Array.isArray(value)) return value.map((v,i) => deserialize2(errors, prefix + '/' + i, schema.items, v));
            errors.push(prefix + ': Expected an array. Received: ' + value);
            break;

        case 'boolean':
        case 'integer':
        case 'number':
            result = parse[type](value);
            if (result.error) errors.push(prefix + ': ' + result.error);
            return result.value;

        case 'string':
            switch (schema.format) {
                case 'binary':
                case 'byte':
                case 'date':
                case 'date-time':
                    result = parse[schema.format](value);
                    break;
                default:
                    result = { value: value };
            }
            if (result.error) errors.push(prefix + ': ' + result.error);
            return result.value;

        case 'object':
            if (value && typeof value === 'object') {
                const result = {};
                const additionalProperties = schema.additionalProperties;
                const properties = schema.properties || {};
                Object.keys(value).forEach(key => {
                    if (properties.hasOwnProperty(key)) {
                        result[key] = deserialize2(errors, prefix + '/' + key, properties[key], value[key]);
                    } else if (additionalProperties) {
                        result[key] = deserialize2(errors, prefix + '/' + key, additionalProperties, value[key]);
                    }
                });
                return result;
            }
            errors.push(prefix + ': Expected an object. Received: ' + value);
            return;

        default:
            errors.push(prefix + ': unknown schema type');
            return;
    }
}