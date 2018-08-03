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
const Result    = require('../result');
const util      = require('../util');

const rxFalse = /^false/i;
const rxTrue = /^true$/i;

module.exports = Parameter;

const validationsMap = {
    2: {
        collectionFormats: ['csv', 'multi', 'pipes', 'ssv', 'tsv'],
        in: ['body', 'formData', 'header', 'path', 'query'],
        schemaProperties: ['default', 'enum', 'exclusiveMaximum', 'exclusiveMinimum', 'format', 'items', 'maximum', 'minimum', 'maxItems', 'minItems', 'maxLength', 'minLength', 'multipleOf', 'pattern', 'uniqueItems'],
        types: ['array', 'boolean', 'file', 'integer', 'number', 'string']
    },
    3: {
        in: ['cookie', 'header', 'path', 'query'],
        styles: {
            cookie: ['form'],
            header: ['simple'],
            path: ['label', 'matrix', 'simple'],
            query: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject']
        }
    }
};

function Parameter(version, enforcer, exception, definition, map) {

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
    } else {
        const validations = validationsMap[version];

        // validate name
        if (!definition.hasOwnProperty('name')) {
            exception('Missing required property "name"');
        } else if (typeof definition.name !== 'string') {
            exception('Value for property "name" must be a string.');
        } else {
            this.name = definition.name;
        }

        // validate "in"
        if (!definition.hasOwnProperty('in')) {
            exception('Missing required property "in"')
        } else if (!validations.in.includes(definition.in)) {
            exception('Invalid value for property "in". Must be one of "' + validations.in.join('", "') + '". Received: ' + definition.in);
        } else {
            this.in = definition.in;
        }

        this.required = definition.hasOwnProperty('required') ? definition.required : this.in === 'path';
        this.allowEmptyValue = definition.hasOwnProperty('allowEmptyValue') ? definition.allowEmptyValue : false;

        if (version === 2) {
            const def = {};

            // validate type
            if (!definition.hasOwnProperty('type')) {
                exception('Missing required property "type"');
            } else if (!validations.types.includes(definition.type)) {
                exception('Invalid value for property "type". Must be one of "' + validations.types.join('", "') + '". Received: ' + definition.type);
            } else {
                def.type = definition.type;
            }

            // set collection format
            if (definition.type === 'array') {
                if (!definition.hasOwnProperty('collectionFormat')) {
                    this.collectionFormat = 'csv';
                } else if (!validations.collectionFormats.includes(definition.collectionFormat)) {
                    exception('Invalid value for property "collectionFormat". Must be one of "' + validations.collectionFormats.join('", "') + '". Received: ' + definition.collectionFormat);
                } else {
                    this.collectionFormat = definition.collectionFormat;
                }
            }

            // add additional parameter schema properties
            validations.schemaProperties.forEach(key => {
                if (definition.hasOwnProperty(key)) def[key] = definition[key];
            });

            this.schema = new Schema(version, enforcer, exception, def, map);

        } else if (version === 3) {
            if (!definition.hasOwnProperty('style')) {
                this.style = this.in === 'cookie' || this.in === 'query'
                    ? 'form'
                    : 'simple';
            } else if (!validations.styles[this.in].includes(definition.style)) {
                exception('Invalid style specified for parameter in "' + this.in + '". Expected on of "' + validations.styles[this.in].join('", "') + '". Received: ' + definition.style);
            } else {
                this.style = definition.style;
            }

            if (!definition.hasOwnProperty('explode')) {
                this.explode = this.style === 'form';
            } else {
                this.explode = definition.explode;
            }

            if (definition.hasOwnProperty('schema') && definition.hasOwnProperty('content')) {
                exception('Properties "schema" and "content" are mutually exclusive and cannot both be used on the same parameter object.')
            } else if (definition.hasOwnProperty('schema')) {
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

}

/**
 * Parse a value into it's deserialized equivalent.
 * @param {string} value
 * @returns {EnforcerResult}
 */
Parameter.prototype.parse = function(value) {
    const exception = Exception('Unable to parse parameter value');
    let result;

    if (this.version === 2) {
        if (type === 'array') {
            let array;

            // split the value into an array
            switch (this.collectionFormat) {
                case 'csv':
                    array = value.split(',');
                    break;
                case 'pipes':
                    array = value.split('|');
                    break;
                case 'ssv':
                    array = value.split(' ');
                    break;
                case 'tsv':
                    array = value.split('\t');
                    break;
            }
            result = array.map((v, i) => {
                const child = exception.at(i);
                let { error, value } = this.schema.deserialize(v);
                child(error || this.schema.validate(value));
                return value;
            });

        } else if (type === 'boolean') {
            let result;
            if (rxTrue.test(value)) {
                result = true;
            } else if (rxFalse.test(value)) {
                result = false;
            } else {
                result = value;
            }
            const error = this.schema.validate(result);
            if (error) exception(error);

        } else if (type === 'integer' || type === 'number') {
            const result = +value;
            const error = this.schema.validate(result);
            if (error) exception(error);

        } else if (type === 'string') {
            let [ error, val ] = this.schema.deserialize(value);
            exception(error || this.schema.validate(val));
            result = val;
        }

    } else if (this.version === 3) {
        // TODO: not yet implemented
        exception('Version 3 not yet implemented');
    }

    return new Result(exception, result);
};

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