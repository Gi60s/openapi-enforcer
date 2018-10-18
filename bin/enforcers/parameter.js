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
const Component     = require('../definition-validator').component;
const Exception     = require('../exception');
const Ignored       = require('../../ignored');
const Result        = require('../result');
const Schema        = require('./schema');
const Super         = require('./super');
const util          = require('../util');

const rxFalse = /^false/i;
const rxTrue = /^true$/i;
const rxLabel = /^\./;
const schemaProperties = ['default', 'enum', 'exclusiveMaximum', 'exclusiveMinimum', 'format', 'items',
    'maximum', 'maxItems', 'maxLength', 'minimum', 'minItems', 'minLength', 'multipleOf',
    'pattern', 'type', 'uniqueItems'];

module.exports = Super(ParameterEnforcer);

function ParameterEnforcer(data) {
    const { definition, major, raw, warn } = data;

    if (definition.in === 'header' && definition.name !== definition.name.toLowerCase()) {
        warn('Header names are case insensitive and their lower case equivalent will be used');
    }

    // v2 - set schema for non-body parameters from schema-like attributes
    if (major === 2 && definition.in !== 'body') {

        // TODO: type might be file which is not really supported in Schema - shouldn't be a problem but I need to test it
        const def = {};
        schemaProperties.forEach(key => {
            if (definition.hasOwnProperty(key)) def[key] = definition[key]
        });
        if (def.type === 'file') def.type = 'string';

        const newRaw = Object.assign({}, raw);
        newRaw.value = def;
        newRaw.result = { value: def };
        this.schema = Component(Schema, newRaw);

    // v3 - set schema from content schema
    } else if (major === 3 && definition.content) {
        const key = Object.keys(definition.content)[0];
        if (definition.content[key].schema) this.schema = definition.content[key].schema;
    }
}


/**
 * Parse input. Does not validate.
 * @param {string} value
 * @param {object} [query={}]
 * @returns {EnforcerResult}
 */
ParameterEnforcer.prototype.parse = function(value, query) {
    const { major } = this.enforcerData;
    const schema = this.schema;
    const type = schema && schema.type;

    const exception = Exception('Unable to parse value');

    if (major === 2) {
        if (this.collectionFormat === 'multi') {
            if (!query) query = util.parseQueryString(value);
            const values = query[this.name];
            if (values) {
                const result = [];
                values.forEach((value, index) => {
                    if (!value && !this.allowEmptyValue) {
                        exception.at(index)('Empty value not allowed');
                    } else if (this.schema.items) {
                        result.push(v2Parse(this, this.schema.items, exception.at(index), value));
                    } else {
                        result.push(value);
                    }
                });
                return new Result(result, exception);
            } else {
                return new Result(null, exception);
            }

        } else if (query && query.hasOwnProperty(this.name)) {
            const ar = query[this.name];
            if (ar.length) {
                return new Result(v2Parse(this, this.schema, exception, ar[ar.length - 1]), exception);
            } else {
                return new Result(v2Parse(this, this.schema, exception, undefined), exception);
            }

        } else {
            return new Result(v2Parse(this, this.schema, exception, value), exception);
        }


    } else if (major === 3) {
        const explode = this.explode;
        const style = this.style;
        let parsed;

        // in case the query string has not been parsed, parse it now
        if (!query) {
            if (this.in === 'query') {
                query = util.parseQueryString(value);
            } else if (this.in === 'cookie') {
                query = util.parseCookieString(value);
            }
        }

        if (style === 'deepObject') {
            const rx = RegExp('(?:^|&)' + this.name + '\\[([^\\]]+)\\](?:=([^&]*))?', 'g');
            const result = {};
            let match;
            let hasValue = false;
            while (match = rx.exec(value)) {
                hasValue = true;
                result[match[1]] = match[2];
            }
            if (hasValue) parsed = result;

        } else if (style === 'form') {
            if (explode && type === 'object') {
                const result = objectExploded('&', '=', '&' + value);
                if (result) {
                    parsed = {};
                    Object.keys(result).forEach(name => {
                        if (schema.additionalProperties || (schema.properties && schema.properties.hasOwnProperty(name))) {
                            parsed[name] = result[name];
                        }
                    });
                }
            } else if (query.hasOwnProperty(this.name)) {
                const ar = query[this.name];
                if (type === 'array') {
                    if (explode) {
                        parsed = ar;
                    } else if (ar.length > 0) {
                        parsed = ar[ar.length - 1].split(',');
                    }
                } else if (type === 'object') {
                    const result = objectFlattened(',', ar[ar.length - 1]);
                    if (result) parsed = result;
                } else if (ar.length > 0) {
                    parsed = ar[ar.length - 1];
                }
            }

        } else if (style === 'label') {
            if (rxLabel.test(value)) {
                if (type === 'array') {
                    parsed = value.substr(1).split(explode ? '.' : ',');
                } else if (type === 'object') {
                    parsed = explode
                        ? objectExploded('.', '=', value)
                        : objectFlattened(',', value.substr(1));
                } else {
                    parsed = value.substr(1);
                }
            }

        } else if (style === 'matrix') {
            const name = this.name;
            const rx = RegExp('^;' + name + '(?:=|$)');
            if (type === 'array') {
                if (explode) {
                    const result = arrayExploded(';', '=', name, value.substr(1));
                    if (result) parsed = result;
                } else {
                    parsed = value.substr(name.length + 2).split(',');
                }
            } else if (type === 'object') {
                if (explode || rx.test(value)) {
                    const result = explode
                        ? objectExploded(';', '=', value)
                        : objectFlattened(',', value.substr(name.length + 2));
                    if (result) parsed = result;
                }
            } else if (rx.test(value)) {
                parsed = value.substr(name.length + 2);
            }

        } else if (style === 'pipeDelimited') {
            const ar = query[this.name];
            if (ar.length > 0) {
                parsed = explode
                    ? ar
                    : delimited(type, '|', ar[ar.length - 1])
            }

        } else if (style === 'simple') {
            if (type === 'array') {
                parsed = value.split(',');
            } else if (type === 'object') {
                parsed = explode
                    ? objectExploded(',', '=', ',' + value)
                    : objectFlattened(',', value);
            } else {
                parsed = value;
            }

        } else if (style === 'spaceDelimited') {
            const ar = query[this.name];
            if (ar.length > 0) {
                parsed = explode
                    ? ar
                    : delimited(type, ' ', ar[ar.length - 1])
            }
        }

        // parse array items and object properties
        if (parsed !== undefined) {
            if (type === 'array') {
                parsed = parsed.map((v, i) => parsePrimitive(this, schema.items, exception.at(i), v));
            } else if (type === 'object') {
                Object.keys(parsed).forEach(key => {
                    if (schema.properties && schema.properties[key]) {
                        parsed[key] = parsePrimitive(this, schema.properties[key], exception.at(key), parsed[key]);
                    } else if (typeof schema.additionalProperties === 'object') {
                        parsed[key] = parsePrimitive(this, schema.additionalProperties, exception.at(key), parsed[key]);
                    }
                });
            } else {
                parsed = parsePrimitive(this, schema, exception, parsed)
            }
        } else if (parsed === undefined) {
            exception('The value is not formatted properly');
        }

        return new Result(parsed, exception);
    }
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
        return value.split(delimiter);
    } else if (type === 'object') {
        return objectFlattened(delimiter, value);
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
    if (offset !== value.length) return;
    return result;
}

function objectFlattened(delimiter, value) {
    const result = {};
    const ar = value.split(delimiter);
    const length = ar.length;

    if (length % 2 !== 0) return;
    for (let i = 1; i < length; i += 2) {
        result[ar[i - 1]] = ar[i];
    }
    return result;
}

function parsePrimitive(parameter, schema, exception, value) {
    if (!value) {
        if (parameter.allowEmptyValue) return new Ignored(value);
        exception('Empty value not allowed');

    } else if (schema.type === 'boolean') {
        if (rxTrue.test(value)) return true;
        if (rxFalse.test(value)) return false;
        exception('Expected "true" or "false". Received: ' + value)

    } else if (schema.type === 'integer') {
        const num = +value;
        if (!isNaN(num)) return num;
        exception('Expected an integer. Received: ' + value);

    } else if (schema.type === 'number') {
        const num = +value;
        if (!isNaN(num)) return num;
        exception('Expected a number. Received: ' + value);

    } else if (schema.type === 'string') {
        return value;
    }

    return value;
}

function v2Parse(parameter, schema, exception, value) {
    if (schema.type === 'array') {
        let values;
        switch (schema.collectionFormat || parameter.collectionFormat) {
            case 'csv':
                values = value.split(',');
                break;
            case 'pipes':
                values = value.split('|');
                break;
            case 'ssv':
                values = value.split(' ');
                break;
            case 'tsv':
                values = value.split('\t');
                break;
            // multi is not a valid collectionFormat for itemsObject: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
        }
        return values.map((value, index) => schema.items ? v2Parse(parameter, schema.items, exception.at(index), value) : value);
    } else {
        return parsePrimitive(parameter, schema, exception, value);
    }
}