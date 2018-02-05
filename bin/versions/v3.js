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
const multipart = require('../multipart-parser');
const validate  = require('../validate');

module.exports = Version;

function Version(definition) {
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
        purge: true,                // any provided request data (in query or form data) that is not specified in the swagger will be ignored
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

exports.initialize = function(swagger) {
    swagger.components = Object.assign({
        callbacks: {},
        examples: {},
        headers: {},
        links: {},
        parameters: {},
        requestBodies: {},
        responses: {},
        schemas: swagger.definitions || {},
        securitySchemes: {}
    }, swagger.components);
};

exports.request = function(context, request, strPath, store) {
    const errors = [];



    // find the matching path
    const path = this.path(request.path);
    if (!path) throw Error('Requested path not defined in the swagger document: ' + request.path);
    if (!path.schema[request.method]) throw Error('Requested method is not defined in the swagger document for this path: ' + request.method + ' ' + request.path);


    const options = store.defaults.request;
    const purge = options.purge;
    const strict = options.strict;
    const schema = path.schema;

    const formData = {};
    const header = {};
    const params = {};
    const query = {};
    const result = {
        formData: formData,
        header: header,
        path: params,
        query: query
    };

    // map parameters to object map for faster lookup
    const parameters = { formData: {}, header: {}, path: {}, query: {} };
    schema.parameters.forEach(param => {
        param.in === 'body'
            ? parameters.body = param
            : parameters[param.in][param.name] = param;
    });

    //////////////////////////////////
    //                              //
    //   STEP 1: PARSE PARAMETERS   //
    //                              //
    //////////////////////////////////

    // iterate through header
    Object.keys(request.header).forEach(name => {
        const schema = parameters.header[name];
        const value = request.header[name];
        if (schema && schema.in === 'header') {
            header[name] = parse(errors, 'Error in header at /' + name, schema, value)
        } else {
            header[name] = value;
        }
    });

    // parse body or formData (mutually exclusive)
    if (parameters.body) {
        result.body = parseSchema(errors, 'Error in body at ', parameters.body, request.body);
    } else if (header['content-type'] === 'application/x-www-form-urlencoded') {
        result.body = multipart(header, parameters.body);
    }

    // iterate through path parameters
    Object.keys(path.params).forEach(name => {
        const schema = parameters.path[name];
        const value = path.params[name];
        if (schema && schema.in === 'path') {
            path[name] = parse(errors, 'Error in path parameter at /' + name, schema, value)
        } else {
            path[name] = value;
        }
    });

    // iterate through query parameters
    request.query.forEach(item => {
        const name = item.name;
        const schema = parameters.query[name];
        const value = item.value;

        if (schema && schema.in === 'query') {
            if (schema.type === 'array' && schema.collectionFormat === 'multi') {
                if (!query[name]) query[name] = [];
                query[name].push(parse(errors, 'Error in query parameter at /' + name, schema.items, value));
            } else {
                query[name] = parse(errors, 'Error in query parameter at /' + name, schema, value);
            }

        } else if (strict) {
            errors.push('Query parameter not allowed: ' + name);

        } else if (!purge) {
            result[name] = item.value;
        }
    });



    //////////////////////////////////////
    //                                  //
    //   STEP 2: VALIDATE PARAMETERS    //
    //                                  //
    //////////////////////////////////////

    return result;
};



// parse external input
function parse(errors, prefix, schema, value) {
    let result;
    switch (schema.type) {
        case 'array':
            switch (schema.collectionFormat) {
                case 'ssv':
                    result = value.split(' ');
                    break;
                case 'tsv':
                    result = value.split('\t');
                    break;
                case 'pipes':
                    result = value.split('|');
                    break;
                case 'csv':
                default:
                    result = value.split(',');
                    break;
            }
            validate.array(errors, prefix, schema.items, result);
            return result.map((v, i) => parse(errors, prefix + '/' + i, schema.items, v));

        case 'boolean':
            if (value === 'false') return false;
            return !!value;

        case 'integer':
            result = +value;
            validate.integer(errors, prefix, schema, result);
            return result;

        case 'number':
            result = +value;
            validate.number(errors, prefix, schema, result);
            return result;

        case 'string':
            switch (schema.format) {
                case 'binary':
                    validate.binary(errors, prefix, schema, value);
                    return new Buffer(value, 'binary');

                case 'byte':
                    validate.byte(errors, prefix, schema, value);
                    return new Buffer(value, 'base64');

                case 'date':
                    validate.date(errors, prefix, schema, value);
                    return new Date(value + 'T00:00:00.000Z');

                case 'date-time':
                    validate.dateTime(errors, prefix, schema, value);
                    return new Date(value);

                default:
                    validate.string(errors, prefix, schema, value);
                    return value;
            }
    }
}

function parseSchema(errors, schema, value) {

}