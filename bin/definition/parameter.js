/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, major 2.0 (the "License");
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
const Items     = require('./items');
const Schema    = require('./schema');

module.exports = Object.assign({}, Items, {
    name: {
        required: true,
        type: 'string',
        ignore: ({ definition, value, major }) => {
            if (typeof value === 'string') value = value.toLowerCase();
            return major === 3 && definition.in === 'header' && (value === 'accept' || value === 'content-type' || value === 'authorization')
        }
    },
    in: {
        required: true,
        type: 'string',
        enum: ({ definition, major }) => major === 2
            ? ['body', 'formData', 'header', 'query', 'path']
            : ['cookie', 'header', 'path', 'query'],
    },
    type: {
        allowed: ({ definition, major }) => major === 2 && definition.in !== 'body',
        required: true,
        enum: ['array', 'boolean', 'file', 'integer', 'number', 'string'],
        errors: ({ definition, value }) => value !== 'file' || definition.in === 'formData' ? false : 'Type "file" must be in "formData"'
    },
    description: 'string',
    required: {
        required: ({ definition }) => definition.in === 'path',
        type: 'boolean',
        default: false,
        enum: ({ definition }) => definition.in === 'path' ? [ true ] : [ true, false ]
    },
    deprecated: {
        allowed: ({ major }) => major === 3,
        type: 'boolean'
    },
    allowEmptyValue: {
        allowed: ({ definition }) => definition.in === 'query' || definition.in === 'formData',
        type: 'boolean',
        default: false
    },
    collectionFormat: { // overwrite items - can use 'multi'
        allowed: ({ definition, major }) => major === 2 && definition.type === 'array',
        enum: ({ definition }) => definition.in === 'formData' || definition.in === 'query'
            ? ['csv', 'ssv', 'tsv', 'pipes', 'multi']
            : ['csv', 'ssv', 'tsv', 'pipes'],
        default: 'csv'
    },
    schema: {
        allowed: ({ definition, major }) => major === 3 || definition.in === 'body',
        properties: Schema,
        errors: ({ definition, major }) => major === 3 && definition.hasOwnProperty('content') ? 'Cannot have both "schema" and "content"' : ''
    },
    style: {
        allowed: ({ major }) => major === 3,
        type: 'string',
        default: ({ definition }) => {
            switch (definition.in) {
                case 'cookie': return 'form';
                case 'header': return 'simple';
                case 'path': return 'simple';
                case 'query': return 'form';
            }
        },
        enum: ({ definition }) => {
            switch (definition.in) {
                case 'cookie': return ['form'];
                case 'header': return ['simple'];
                case 'path': return ['simple', 'label', 'matrix'];
                case 'query': return ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'];
            }
        },
        errors: ({ definition }) => {
            const style = definition.style;
            const type = definition.schema && definition.schema.type;
            if (!type || !style) return true;
            switch (definition.in) {
                case 'cookie':
                    return definition.explode && (type === 'array' || type === 'object')
                        ? 'Cookies do not support exploded style "' + style + '" with schema type: ' + type
                        : false;
                case 'header':
                case 'path':
                    return false;
                case 'query':
                    if (style === 'form') return false;
                    if (style === 'spaceDelimited' && type === 'array') return false;
                    if (style === 'pipeDelimited' && type === 'array') return false;
                    if (style === 'deepObject' && type === 'object') return false;
                    return 'Style "' + style + '" is incompatible with schema type: ' + type;
            }
        }
    },
    explode: {
        allowed: ({ major }) => major === 3,
        type: 'boolean',
        default: ({ definition }) => definition.style === 'form'
    },
    allowReserved: {
        allowed: ({ definition, major }) => major === 3 && definition.in === 'query',
        type: 'boolean',
        default: ({ definition }) => definition.style === 'form'
    },
    example: {
        allowed: ({ major }) => major === 3,
        isPlainObject: true
    },
    examples: {
        allowed: ({ major }) => major === 3,
        isPlainObject: true
    },
    content: {
        allowed: ({ major }) => major === 3,
        isPlainObject: true,
        errors: ({ definition }) => definition.hasOwnProperty('schema') ? 'Cannot have both "schema" and "content" properties' : ''
    }
});