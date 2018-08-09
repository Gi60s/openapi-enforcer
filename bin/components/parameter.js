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
const Result        = require('../result');
const Schema        = require('./schema');
const util          = require('../util');
const normalize     = require('../map-normalizer');
const querystring   = require('querystring');

const rxFalse = /^false/i;
const rxTrue = /^true$/i;

module.exports = Parameter;

const schemaProperties = ['default', 'enum', 'exclusiveMaximum', 'exclusiveMinimum', 'format', 'items', 'maximum', 'minimum', 'maxItems', 'minItems', 'maxLength', 'minLength', 'multipleOf', 'pattern', 'type', 'uniqueItems'];
const validationsMap = {
    name: {
        required: () => true,
        type: () => 'string',
        ignore: (ctx, version, value) => {
            if (typeof value === 'string') value = value.toLowerCase();
            return version === 3 && ctx.in === 'header' && (value === 'accept' || value === 'content-type' || value === 'authorization')
        }
    },
    in: {
        required: () => true,
        type: () =>'string',
        enum: (ctx, version) => version === 2
            ? ['body', 'formData', 'header', 'query', 'path']
            : ['cookie', 'header', 'path', 'query'],
    },
    description: {
        type: () => 'string'
    },
    required: {
        required: ctx => ctx.in === 'path',
        type: () => 'boolean',
        default: () => false,
        errors: (ctx, version, value) => ctx.in === 'path' && value !== true ? 'Value must be true when property "in" is set to "path"' : ''
    },
    deprecated: {
        allowed: () => version === 3,
        type: () => 'boolean'
    },
    schema: {
        allowed: (ctx, version) => version === 3 || ctx.in === 'body',
        isPlainObject: true,
        errors: (ctx, version) => version === 3 && ctx.hasOwnProperty('content') ? 'Cannot have both "schema" and "content"' : ''
    },
    type: {
        allowed: (ctx, version) => version === 2 && ctx.in !== 'body',
        required: () => true,
        enum: () => ['array', 'boolean', 'file', 'integer', 'number', 'string']
    },
    format: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'integer' || ctx.type === 'number' || ctx.type === 'string'),
        enum: ctx => {
            if (ctx.type === 'integer') return ['int32', 'int64'];
            if (ctx.type === 'number') return ['float', 'double'];
            return ['binary', 'byte', 'date', 'date-time', 'password'];
        }
    },
    allowEmptyValue: {
        allowed: ctx => ctx.in === 'query' || ctx.in === 'formData',
        type: () => 'boolean',
        default: () => false
    },
    items: {
        allowed: (ctx, version) => version === 2,
        required: ctx => ctx.type === 'array',
    },
    collectionFormat: {
        allowed: (ctx, version) => version === 2 && ctx.type === 'array',
        enum: () => ['csv', 'ssv', 'tsv', 'pipes', 'multi'],
        default: () => 'csv'
    },
    default: {
        allowed: (ctx, version) => version === 2,
        errors: ctx => ctx.required ? 'Cannot have both "default" and "required"' : ''
    },
    maximum: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'number' || ctx.type === 'integer' || (ctx.type === 'string' && ctx.format.startsWith('date'))),
        type: ctx => ctx.type === 'string' && ctx.format.startsWith('date') ? 'string' : 'number'
    },
    exclusiveMaximum: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'number' || ctx.type === 'integer' || (ctx.type === 'string' && ctx.format.startsWith('date'))),
        type: () => 'boolean',
        default: () => false
    },
    minimum: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'number' || ctx.type === 'integer' || (ctx.type === 'string' && ctx.format.startsWith('date'))),
        type: ctx => ctx.type === 'string' && ctx.format.startsWith('date') ? 'string' : 'number'
    },
    exclusiveMinimum: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'number' || ctx.type === 'integer' || (ctx.type === 'string' && ctx.format.startsWith('date'))),
        type: () => 'boolean',
        default: () => false
    },
    maxLength: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'string' || ctx.type === 'file'),
        type: () => 'number',
        errors: (ctx, version, value) => value < 0 || Math.round(value) !== value ? 'Property "maxLength" must be a non-negative integer' : ''
    },
    minLength: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'string' || ctx.type === 'file'),
        type: () => 'number',
        errors: (ctx, version, value) => value < 0 || Math.round(value) !== value ? 'Property "maxLength" must be a non-negative integer' : ''
    },
    pattern: {
        allowed: (ctx, version) => version === 2 && ctx.type === 'string',
        type: () => 'string',
        errors: (ctx, version, value) => !value ? 'Property "pattern" must be a non-empty string' : ''
    },
    maxItems: {
        allowed: (ctx, version) => version === 2 && ctx.type === 'array',
        type: () => 'number',
        errors: (ctx, version, value) => value < 0 || Math.round(value) !== value ? 'Property "maxLength" must be a non-negative integer' : ''
    },
    minItems: {
        allowed: (ctx, version) => version === 2 && ctx.type === 'array',
        type: () => 'number',
        errors: (ctx, version, value) => value < 0 || Math.round(value) !== value ? 'Property "maxLength" must be a non-negative integer' : ''
    },
    uniqueItems: {
        allowed: (ctx, version) => version === 2 && ctx.type === 'array',
        type: () => 'boolean',
        default: () => false
    },
    enum: {
        allowed: (ctx, version) => version === 2,
        isArray: true
    },
    multipleOf: {
        allowed: (ctx, version) => version === 2 && (ctx.type === 'number' || ctx.type === 'integer'),
        type: () => 'number'
    },
    style: {
        allowed: (ctx, version) => version === 3,
        type: () => 'string',
        default: ctx => {
            switch (ctx.in) {
                case 'cookie': return 'form';
                case 'header': return 'simple';
                case 'path': return 'simple';
                case 'query': return 'form';
            }
        },
        enum: ctx => {
            switch (ctx.in) {
                case 'cookie': return ['form'];
                case 'header': return ['simple'];
                case 'path': return ['simple', 'label', 'matrix'];
                case 'query': return ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'];
            }
        }
    },
    explode: {
        allowed: (ctx, version) => version === 3,
        type: () => 'boolean',
        default: ctx => ctx.style === 'form'
    },
    allowReserved: {
        allowed: (ctx, version) => version === 3 && ctx.in === 'query',
        type: () => 'boolean',
        default: ctx => ctx.style === 'form'
    },
    example: {
        allowed: (ctx, version) => version === 3,
        isPlainObject: true
    },
    examples: {
        allowed: (ctx, version) => version === 3,
        isPlainObject: true
    },
    content: {
        allowed: (ctx, version) => version === 3,
        isPlainObject: true,
        errors: ctx => ctx.hasOwnProperty('schema') ? 'Cannot have both "schema" and "content" properties' : ''
    }
};

function Parameter(version, enforcer, exception, definition, map) {

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
        return;
    }

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    this.version = version;

    // validate and normalize the definition
    normalize(this, version, exception, definition, validationsMap);

    if (version === 2) {
        // build a schema definition from parameter properties
        const def = {};
        schemaProperties.forEach(key => {
            if (definition.hasOwnProperty(key)) def[key] = definition[key];
        });
        this.schema = new Schema(version, enforcer, exception, def, map);

    } else if (version === 3) {
        if (definition.hasOwnProperty('schema')) {
            schemaAndExamples(this, version, exception, definition, map);
        } else if (definition.hasOwnProperty('content')) {
            const child = exception.at('content');
            const mediaTypes = Object.keys(definition.content);
            if (mediaTypes.length !== 1) {
                child('Must have exactly one media type. Found ' + mediaTypes.join(', '));
            } else {
                const mt = mediaTypes[0];
                schemaAndExamples(this, version, exception.at('content/' + mt), definition.content[mt], map);
            }
        } else {
            exception('Missing required property "schema" or "content"');
        }
    }
}

/**
 * Parse input. Does not validate.
 * @param {Parameter} parameter
 * @param {string} value
 * @returns {EnforcerResult}
 */
Parameter.prototype.parse = function(parameter, value) {
    const exception = Exception('Unable to parse value');
    let result;

    if (this.version === 2) {
        if (this.type === 'array') {
            switch (this.collectionFormat) {
                case 'csv': return Result(exception, value.split(','));
                case 'pipes': return Result(exception, value.split('|'));
                case 'ssv': return Result(exception, value.split(' '));
                case 'tsv': return Result(exception, value.split('\t'));
                case 'multi': return Result(exception, value);
            }

        } else if (this.type === 'boolean') {
            if (rxTrue.test(value)) return Result(exception, true);
            if (rxFalse.test(value)) return Result(exception, false);
            return Result(exception('Expected "true" or "false". Received: ' + value));

        } else if (this.type === 'integer') {
            const num = +value;
            if (isNaN(num)) exception('Expected an integer. Received: ' + value);
            return Result(exception, num);

        } else if (this.type === 'number') {
            const num = +value;
            if (isNaN(num)) exception('Expected a number. Received: ' + value);
            return Result(exception, num);

        } else if (this.type === 'string') {
            return Result(exception, value);
        }

    } else if (this.version === 3) {
        if (this.in === 'query') {

        } else {

        }





        if (this.style === 'deepObject') {
            const rx = RegExp('(?:^|&)' + this.name + '\\[([^\\]]+)\\](?:=([^&]*))?', 'g');
            const result = {};
            let match;
            let hasValue = false;
            while (match = rx.exec(value)) {
                hasValue = true;
                result[match[1]] = match[2];
            }
            return hasValue ? { match: true, value: result } : { match: false };

        } else if (this.style === 'form') {

        } else if (this.style === 'label') {

        } else if (this.style === 'matrix') {

        } else if (this.style === 'pipeDelimited') {

        } else if (this.style === 'simple') {

        } else if (this.style === 'spaceDelimited') {

        }


        // TODO: not yet implemented
        exception('Version 3 not yet implemented');
    }

    return new Result(exception, result);
};


function arrayExploded(setDelimiter, valueDelimiter, name, value) {
    const ar = value.split(setDelimiter);
    const length = ar.length;
    const result = [];
    for (let i = 0; i < length; i++) {
        const set = ar[i].split(valueDelimiter);
        if (set[0] === name) {
            result.push(set[1]);
        } else {
            return false;
        }
    }
    return result;
}

function delimited(type, delimiter, value) {
    if (type === 'array') {
        return { match: true, value: value.split(delimiter) };

    } else if (type === 'object') {
        const parsed = objectFlattened(delimiter, value);
        return parsed ? { match: true, value: parsed } : { match: false };
    }
}

function objectExploded(setDelimiter, valueDelimiter, value) {
    const str = 's([^v]+)v([^s]+)?';
    const rx = RegExp(str.replace(/v/g, valueDelimiter).replace(/s/g, setDelimiter), 'g');
    const result = {};
    let match;
    let offset = 0;
    while (match = rx.exec(value)) {
        result[match[1]] = match[2] || '';
        offset = match.index + match[0].length;
    }
    if (offset !== value.length) return false;
    return result;
}

function objectFlattened(delimiter, value) {
    const result = {};
    const ar = value.split(delimiter);
    const length = ar.length;

    if (length % 2 !== 0) return false;
    for (let i = 1; i < length; i += 2) {
        result[ar[i - 1]] = ar[i];
    }
    return result;
}

function schemaAndExamples(context, version, enforcer, exception, definition, map) {
    if (definition.hasOwnProperty('schema')) {
        context.schema = new Schema(version, enforcer, exception.at('schema'), definition.schema, map);
    }

    if (definition.hasOwnProperty('example') && definition.hasOwnProperty('examples')) {
        exception('Properties "example" and "examples" are mutually exclusive');
    } else if (definition.hasOwnProperty('example')) {
        context.example = definition.example;
        if (context.schema) {
            const error = context.schema.validate(definition.example);
            if (error) exception.at('example')(error);
        }
    } else if (definition.hasOwnProperty('examples')) {
        context.examples = {};
        Object.keys(definition.examples).forEach(key => {
            context.examples[key] = definition.examples[key];
            if (context.schema) {
                const error = context.schema.validate(definition.examples[key]);
                if (error) exception.at('examples/' + key)(error);
            }
        });
    }
}