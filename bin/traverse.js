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
const Message   = require('./message');
const util      = require('./util');

/**
 * Traverse a schema and perform operation on each level in the schema.
 * @param {object} config
 * @param {function} config.handler
 * @param {object} config.schema
 * @param {object} config.version
 * @param {object} [config.data={}]
 * @param {object} [config.settings]
 * @param {*} [config.value]
 * @returns {{ data: object, message: function}}
 */
module.exports = function(config) {
    // validate configuration
    validateConfiguration(config);
    if (!config.hasOwnProperty('schema')) throw Error('Missing required configuration property: schema');
    if (typeof config.schema !== 'object') throw Error('Configuration property "schema" must be an object');

    const message = new Message('');
    return traverse(message, config.schema, config.value, {
        data: config.data || {},
        handler: config.handler,
        settings: config.settings,
        version: config.version
    });
};

/**
 * Traverse a schema and perform operation on each level in the schema.
 * @param {object} config
 * @param {function} config.handler
 * @param {object} config.schema
 * @param {object} config.version
 * @param {object} [config.data={}]
 * @param {object} [config.options]
 * @param {*} [config.value]
 * @returns {{ data: object, message: function}}
 */
exports.matches = function(config) {
    // validate configuration
    validateConfiguration(config);
    if (!config.hasOwnProperty('schemas')) throw Error('Missing required configuration property: schemas');
    if (!Array.isArray(config.schemas)) throw Error('Configuration property "schema" must be an array of objects');

    const message = new Message('');
    matches(message, config.schemas, config.value, {
        data: config.data || {},
        handler: config.handler,
        options: config.options,
        version: config.version
    });
    
    return {
        data: data,
        message: content => {
            message.header = content;
            return message;
        }
    }
}


function discriminator(version, schema, defaultValue) {
    return function(value) {
        if (typeof value === undefined) value = defaultValue;
        const discSchema = schema && typeof value !== undefined
            ? version.getDiscriminatorSchema(schema, value)
            : null;
        
        // TODO: the discriminator should fall back to searching matches - need error check first

        return [];
    }
}

function matches(message, schemas, value, config) {
    const length = schemas.length;
    const matches = [];
    for (let i = 0; i < length; i++) {
        const result = traverse(message.nest(i), schemas[i], value, config);
        if (result.match) matches.push(schemas[i])
    }
    return matches;
}

// TODO: figure out return values
function traverse(message, schema, value, config) {
    if (!schema) return true;

    const settings = config.settings;
    const param = {
        again: () => {
            const result = traverse(message, param.schema, param.value, config);
            Object.assign(param, result);
        },
        message: message,
        schema: schema,
        type: util.schemaType(schema),
        value: value
    };

    // anyOf
    if (settings.anyOf && schema.anyOf) {
        param.discriminate = discriminator(config.version, schema, value);
        param.modifier = 'anyOf';
        config.handler(param);

    // oneOf
    } else if (settings.oneOf && schema.oneOf) {
        param.discriminate = discriminator(config.version, schema, value);
        param.modifier = 'oneOf';
        config.handler(param);

    // allOf
    } else if (settings.allOf && schema.allOf) {
        param.modifier = 'allOf';
        config.handler(param);

    // not
    } else if (settings.not && schema.not) {
        param.modifier = 'not';
        config.handler(param);

    // array
    } else if (settings.array && param.type === 'array') {
        config.handler(param);

        if (schema.items && Array.isArray(value)) {
            value.forEach((v, i) => {
                traverse(message.nest(i), schema.items, v, config);
            });
        }

    // object
    } else if (settings.object && param.type === 'object') {
        config.handler(param);

        if (value) {
            Object.keys(value).forEach(key => {
                const s = schema.properties[key] || schema.additionalProperties;
                if (typeof s === 'object') {
                    traverse(message.nest(key), s, value[key], config);
                }
            });
        }

    // schema
    } else {
        if (param.type === 'string') param.format = util.schemaFormat(schema);
        config.handler(param)
    }

    return param;
}

function validateConfiguration(config) {
    if (!config || typeof config !== 'object') throw Error('Expected an object. Received: ' + config);
    if (!config.hasOwnProperty('handler')) throw Error('Missing required configuration property: handler');
    if (!config.hasOwnProperty('version')) throw Error('Missing required configuration property: version');
    if (typeof config.handler !== 'function') throw Error('Configuration property "handler" must be a function');
    if (typeof config.version !== 'object') throw Error('Configuration property "version" must be an object');
    if (config.data && typeof config.data !== 'object') throw Error('Configuration property "data" must be an object');
    config.settings = Object.assign({}, config.settings, config.version.defaults.traverse);
    if (config.settings && typeof config.settings !== 'object') throw Error('Configuration property "settings" must be an object');
}