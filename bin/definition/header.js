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

module.exports = {
    properties: {
        collectionFormat: {
            allowed: ({ major, parent }) => major === 2 && parent.value.type === 'array',
            enum: ['csv', 'ssv', 'tsv', 'pipes'],
            default: 'csv'
        },
        content: {
            allowed: ({ major }) => major === 3,
            isPlainObject: true
        },
        example: {
            allowed: ({ major }) => major === 3
        },
        examples: {
            allowed: ({ major }) => major === 3,
            additionalProperties: Example
        },
        explode: {
            allowed: ({ major }) => major === 3,
            type: 'boolean',
            default: ({ parent }) => parent.value.style === 'form'
        },
        deprecated: {
            allowed: ({ major }) => major === 3,
            type: 'boolean'
        },
        description: 'string',
        required: {
            required: ({ parent }) => parent.value.in === 'path',
            type: 'boolean',
            default: ({ parent }) => parent.value.in === 'path',
            enum: ({ parent }) => parent.value.in === 'path' ? [ true ] : [ true, false ]
        },
        schema: Object.assign({}, Schema, {
            allowed: ({ major, parent }) => major === 3 || parent.value.in === 'body'
        }),
        style: {
            allowed: ({ major }) => major === 3,
            type: 'string',
            default: 'simple',
            enum: ({ parent }) => {
                switch (parent.value.in) {
                    case 'cookie': return ['form'];
                    case 'header': return ['simple'];
                    case 'path': return ['simple', 'label', 'matrix'];
                    case 'query': return ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'];
                }
            },
            errors: ({ exception, parent }) => {
                const style = parent.value.style;
                const type = parent.value.schema && parent.value.schema.type;
                if (!type || !style) return true;
                switch (parent.value.in) {
                    case 'cookie':
                        if (parent.value.explode && (type === 'array' || type === 'object')) {
                            exception('Cookies do not support exploded style "' + style + '" with schema type: ' + type);
                        }
                        break;
                    case 'header':
                    case 'path':
                        break;
                    case 'query':
                        if ((style !== 'form') &&
                            !(style === 'spaceDelimited' && type === 'array') &&
                            !(style === 'pipeDelimited' && type === 'array') &&
                            !(style === 'deepObject' && type === 'object')) {
                            exception('Style "' + style + '" is incompatible with schema type: ' + type);
                        }
                        break;
                }
            }
        }
    },

    errors: ({ exception, major, value }) => {
        if (major === 3) {
            if (value.hasOwnProperty('content') && value.hasOwnProperty('schema')) {
                exception('Cannot have both "schema" and "content" properties');
            }
            if (value.hasOwnProperty('example') && value.hasOwnProperty('examples')) {
                exception('Cannot have both "example" and "examples" properties');
            }
        }
    }
};