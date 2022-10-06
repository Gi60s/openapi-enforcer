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
const EnforcerRef       = require('../enforcer-ref');
const Exception         = require('../exception');
const NewRefParser      = require('../ref-parser');
const Result            = require('../result');
const runDeserialize    = require('../schema/deserialize');
const runPopulate       = require('../schema/populate');
const runRandom         = require('../schema/random');
const runSerialize      = require('../schema/serialize');
const runValidate       = require('../schema/validate');
const util              = require('../util');
const Value             = require('../schema/value');

const freeze = util.freeze;
const rxHttp = /^https?:\/\//;
const populateInjectors = {
    colon: buildInjector(() => /:([_$a-z][_$a-z0-9]*)/ig),
    doubleHandlebar: buildInjector(() => /{{([_$a-z][_$a-z0-9]*)}}/ig),
    handlebar: buildInjector(() => /{([_$a-z][_$a-z0-9]*)}/ig)
};

const typeProperties = [
    { type: 'array', properties: ['items', 'maxItems', 'minItems', 'uniqueItems'] },
    { type: 'number', properties: ['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multpleOf'] },
    { type: 'object', properties: ['additionProperties', 'maxProperties', 'minProperties', 'properties'] },
    { type: 'string', properties: ['maxLength', 'minLength', 'pattern'] }
]

const prototype = {

    /**
     * Take a serialized (ready for HTTP transmission) value and deserialize it.
     * Converts strings of binary, byte, date, and date-time to JavaScript equivalents.
     * @param {*} value
     * @param {object} [options]
     * @param {boolean} [options.strict=true] Whether to be strict on input when deserializing.
     * @returns {EnforcerResult<*>}
     */
    deserialize: function(value, options) {
        if (!options) options = {};
        if (!options.hasOwnProperty('strict')) options.strict = true;
        const exception = Exception('Unable to deserialize value');
        const result = runDeserialize(exception, new Map(), this, util.copy(value), options);
        return new Result(result, exception);
    },

    /**
     * Get discriminator key and schema.
     * @param {*} value
     * @param {boolean=false} details
     * @returns {Schema|{ key:string, name:string, schema:Schema }}
     */
    discriminate: function (value, details) {
        const { major, root } = this.enforcerData;
        const discriminator = this.discriminator;
        const openapi = root.result;
        let key;
        let name;
        let schema;

        if (!discriminator) return undefined;

        if (major === 2) {
            key = discriminator;
            name = discriminator && value && value.hasOwnProperty(discriminator) ? value[discriminator] : undefined;
            if (name) schema = openapi.definitions && openapi.definitions[name];

        } else if (major === 3) {
            key = discriminator.propertyName;
            name = discriminator && value && value.hasOwnProperty(discriminator.propertyName) ? value[discriminator.propertyName] : undefined;
            if (name) {
                const mapping = discriminator.mapping;
                schema = mapping && mapping.hasOwnProperty(name)
                    ? mapping[name]
                    : openapi.components && openapi.components.schemas && openapi.components.schemas[name];
            }
        }
        return details
            ? { key, name, schema }
            : schema;
    },

    /**
     * Take a non plain object and convert it into a plain object far enough so that validation and serialization can occur.
     * @param {*} value
     * @returns {*}
     */
    formalize: function (value) {
        return this.enforcerData.context.Schema.formalize(value);
    },

    /**
     * Populate a value from a list of parameters.
     * @param {object} [params]
     * @param {*} [value]
     * @param {object} [options]
     * @param {boolean} [options.copy=false]
     * @param {boolean} [options.conditions=true]
     * @param {boolean} [options.defaults=true]
     * @param {number} [options.depth=100]
     * @param {string} [options.replacement='handlebar']
     * @param {boolean} [options.templateDefaults=true]
     * @param {boolean} [options.templates=true]
     * @param {boolean} [options.variables=true]
     * @returns {EnforcerResult<*>}
     */
    populate: function(params, value, options = {}) {
        if (params === undefined || params === null) params = {};
        if (!params || !util.isObject(params)) throw Error('Invalid params specified. Must be a plain object');

        if (!options || !util.isObject(options)) throw Error('Invalid options specified. Must be a plain object');
        if (!options.hasOwnProperty('copy')) options.copy = false;
        if (!options.hasOwnProperty('conditions')) options.conditions = true;
        if (!options.hasOwnProperty('defaults')) options.defaults = true;
        if (!options.hasOwnProperty('depth')) options.depth = 100;
        if (!options.hasOwnProperty('replacement')) options.replacement = 'handlebar';
        if (!options.hasOwnProperty('templateDefaults')) options.templateDefaults = true;
        if (!options.hasOwnProperty('templates')) options.templates = true;
        if (!options.hasOwnProperty('variables')) options.variables = true;

        if (!util.isInteger(options.depth) || options.depth < 0) {
            throw Error('Invalid depth specified. Expected a non-negative integer');
        }
        if (!populateInjectors.hasOwnProperty(options.replacement)) {
            throw Error('Invalid replacement type specified. Expected one of: ' + Object.keys(populateInjectors).join(', '));
        }

        options.injector = populateInjectors[options.replacement];
        if (!params) params = {};
        if (options.copy) value = util.copy(value);
        const root = { value };

        // validate the value
        const exception = Exception('Unable to populate value');
        const warn = Exception('One or more warnings found while populating value');
        runPopulate(exception, warn, options.depth - 1, this, params, root, 'value', options);

        return new Result(root.value, exception, warn);
    },

    /**
     * Produce a random value for the schema.
     * @param {*} [value] An initial value to add random values to.
     * @param {object} [options]
     * @param {number} [options.additionalPropertiesPossibility=0]
     * @param {number} [options.arrayVariation=4]
     * @param {boolean} [options.copy=false]
     * @param {number} [options.defaultPossibility=.25]
     * @param {number} [options.definedPropertyPossibility=.80]
     * @param {number} [options.maxDepth=10]
     * @param {number} [options.numberVariation=1000]
     * @param {number} [options.uniqueItemRetry=5]
     * @returns {EnforcerResult<*>}
     */
    random: function (value, options = {}) {
        if (!options || !util.isObject(options)) throw Error('Invalid options specified. Must be a plain object');
        if (!options.hasOwnProperty('additionalPropertiesPossibility')) options.additionalPropertiesPossibility = 0;
        if (!options.hasOwnProperty('arrayVariation')) options.arrayVariation = 4;
        if (!options.hasOwnProperty('copy')) options.copy = false;
        if (!options.hasOwnProperty('defaultPossibility')) options.defaultPossibility = .25;
        if (!options.hasOwnProperty('definedPropertyPossibility')) options.definedPropertyPossibility = .80;
        if (!options.hasOwnProperty('maxDepth')) options.maxDepth = 10;
        if (!options.hasOwnProperty('numberVariation')) options.numberVariation = 1000;
        if (!options.hasOwnProperty('uniqueItemRetry')) options.uniqueItemRetry = 5;

        if (options.additionalPropertiesPossibility < 0 || options.additionalPropertiesPossibility > 1) throw Error('The option "additionalPropertiesPossibility" must be between 0 and 1 inclusive');
        if (options.defaultPossibility < 0 || options.defaultPossibility > 1) throw Error('The option "defaultPossibility" must be between 0 and 1 inclusive');
        if (options.definedPropertyPossibility < 0 || options.definedPropertyPossibility > 1) throw Error('The option "definedPropertyPossibility" must be between 0 and 1 inclusive');

        const exception = Exception('Unable to generate random value');
        const warn = Exception('One or more warnings found while generating random value');
        const root = { root: options.copy ? util.copy(value) : value };
        runRandom(exception, warn, new Map(), this, root, 'root', options, 0);
        return new Result(root.root, exception, warn);
    },

    /**
     * Take a deserialized (not ready for HTTP transmission) value and serialize it.
     * Converts Buffer and Date objects into string equivalent.
     * @param value
     * @returns {EnforcerResult<*>}
     */
    serialize: function (value) {
        const exception = Exception('Unable to serialize value');
        const result = runSerialize(exception, new Map(), this, util.copy(value));
        return new Result(result, exception);
    },

    /**
     * Check to see if the value is valid for this schema.
     * @param {*} value
     * @param {object} [options]
     * @param {string} [options.readWriteMode] Can be undefined, "read", or "write"
     * @returns {EnforcerException|undefined}
     */
    validate: function(value, options) {
        const exception = Exception('Invalid value');
        if (!options) options = {}
        runValidate(exception, new Map(), this, value, options);
        if (exception.hasException) return exception;
    }
};

module.exports = {
    init: function (data) {
        const { exception, major, plugins, refParser, staticData, warn, options, definition: componentDefinition } = data;
        const skipCodes = options.exceptionSkipCodes;
        const escalateCodes = options.exceptionEscalateCodes;

        // run data type validator
        const dataTypes = staticData.dataTypes;
        const dataType = (dataTypes && dataTypes[this.type] && dataTypes[this.type][this.format]) || null;
        if (dataType && dataType.validator) dataType.validator.call(this, data);

        if (this.allOf) {
            const mergeException = new Exception('Unable to merge allOf schemas');
            const mergeWarning = new Exception('One or more warnings produced while merging allOf schemas');
            const allOfDef = merge(mergeException, mergeWarning, this.allOf.map(v => v.toObject()), dataTypes, major, skipCodes, escalateCodes);
            const allOfData = {
                exception: mergeException,
                warning: mergeWarning
            };

            if (!mergeException.hasException) {
                const serializedException = new Exception('Unable to serialize merged schemas');
                const serialized = serializeSchema(allOfDef, serializedException, dataTypes);
                if (serializedException.hasException) {
                    mergeException.push(serializedException);
                } else {
                    const [ schema, err ] = new data.context.Schema(serialized);
                    if (err) {
                        err.title = 'One or more error exist when all schemas are considered';
                        mergeException.push(err)
                    } else {
                        allOfData.value = schema;
                    }
                }
            }

            Object.defineProperty(this, 'allOfMerged', {
                get: () => new Result(allOfData.value, allOfData.exception, allOfData.warning)
            });
        }

        // If there are required properties not defined in properties and additionalProperties are allowed then warn of additional properties
        if (this.required && this.required.length > 0 && this.additionalProperties !== false) {
            const additionalRequiredProperties = this.required.slice(0);
            Object.keys(this.properties || {}).forEach(key => {
                const index = additionalRequiredProperties.indexOf(key)
                if (index !== -1) additionalRequiredProperties.splice(index, 1);
            })
            if (additionalRequiredProperties.length > 0 && !skipCodes.WSCH007 && !util.schemaObjectHasSkipCode(componentDefinition, 'WSCH007')) {
                const e = escalateCodes.WSCH007 ? exception : warn;
                if (additionalRequiredProperties.length === 1) {
                    e.message('Required property not specified as a property but allowed via additionalProperties: ' + additionalRequiredProperties[0] + ' [WSCH007]')
                } else {
                    e.message('Required properties not specified as a property but allowed via additionalProperties: ' + additionalRequiredProperties.join(', ') + ' [WSCH007]')
                }
            }

        }

        plugins.push(() => {
            // if there is a discriminator with mappings then resolve those references
            const discriminator = this.discriminator;
            if (major === 3 && refParser && discriminator && discriminator.mapping) {
                const useNewRefParser = refParser instanceof NewRefParser;
                const schemaDef = data.definition;
                const instanceMap = this.enforcerData.defToInstanceMap;
                Object.keys(discriminator.mapping).forEach(key => {
                    const value = discriminator.mapping[key];
                    let definition;
                    if (useNewRefParser) {
                        const ref = rxHttp.test(value) || value.indexOf('/') !== -1
                            ? value
                            : '#/components/schemas/' + value;
                        const sourceNode = refParser.getSourceNode(schemaDef);
                        definition = refParser.resolvePath(sourceNode, ref);
                    } else {
                        const ref = rxHttp.test(value) || value.indexOf('/') !== -1
                            ? value
                            : '#/components/schemas/' + value;
                        definition = refParser.$refs.get(ref);
                    }
                    setProperty(discriminator.mapping, key, instanceMap.get(definition));
                });
            }

            // deserialize and validate enum, default, and example
            if (this.hasOwnProperty('enum')) {
                const child = exception.at('enum');
                const value = this.enum.map((value, index) => {
                    return deserializeAndValidate(this, child.at(index), value, {
                        enum: false,
                        escalateCodes,
                        skipCodes
                    });
                });
                Object.freeze(value);
                setProperty(this, 'enum', value);
            }
            if (this.hasOwnProperty('default')) {
                const value = deserializeAndValidate(this, exception.at('default'), this.default, {});
                setProperty(this, 'default', freeze(value));
            }
            if (this.hasOwnProperty('example')) {
                // TODO: should this produce an error or a warning? It's currently set to warn.
                const childException = new Exception('Example not valid. [WSCH006]')
                const value = deserializeAndValidate(this, childException, this.example, {
                    isExample: true
                });
                if (childException.hasException && !skipCodes.WSCH006 && !util.schemaObjectHasSkipCode(componentDefinition, 'WSCH006')) {
                    (escalateCodes.WSCH006 ? exception : warn).at('example').push(childException);
                }
                setProperty(this, 'example', freeze(value));
            }
        });
    },

    prototype,

    statics: function (scope) {
        const warnings = {};
        const constructors = new Set();
        const dataTypes = scope.dataTypes = {
            boolean: {},
            integer: {},
            number: {},
            string: {}
        };
        const hooks = scope.hooks = {
            afterDeserialize: [],
            afterSerialize: [],
            afterValidate: [],
            beforeDeserialize: [],
            beforeSerialize: [],
            beforeValidate: [],
        }
        scope.dataTypeConstructors = function () {
            return Array.from(constructors.values());
        };
        return {
            defineDataTypeFormat: function (type, format, definition) {
                // validate input parameters
                if (!dataTypes.hasOwnProperty(type)) throw Error('Invalid type specified. Must be one of: ' + Object.keys(dataTypes).join(', '));
                if (!format || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string');
                if (dataTypes.hasOwnProperty(format)) throw Error('Format "' + format + '" is already defined');

                if (definition !== null) {
                    if (typeof definition !== 'object' ||
                        typeof definition.deserialize !== 'function' ||
                        typeof definition.serialize !== 'function' ||
                        typeof definition.validate !== 'function'
                        || (definition.random &&  typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.');

                    if (definition.constructors) {
                        definition.constructors.forEach(fn => {
                            if (typeof fn !== 'function') throw Error('Invalid constructor specified. Expected a function, received: ' + fn);
                            constructors.add(fn);
                        })
                    } else {
                        const key = type + '-' + format;
                        if (!warnings[key]) {
                            warnings[key] = true;
                            console.warn('WARNING: Data type definition missing recommended "constructors" property for type "' + type + '" and format "' + format + '".');
                        }
                    }
                }

                // store the definition
                dataTypes[type][format] = Object.assign({}, definition, { type, format });
            },

            extractValue: Value.extract,

            formalize: function (value) {
                if (value instanceof this.constructor.Value) {
                    value.value = util.toPlainObject(value.value, {
                        preserve: scope.dataTypeConstructors()
                    });
                    return value;
                } else {
                    return util.toPlainObject(value, {
                        preserve: scope.dataTypeConstructors()
                    });
                }
            },

            hook: function (type, handler) {
                if (!hooks.hasOwnProperty(type)) throw Error('Invalid hook type. Choose one of: ' + Object.keys(hooks).join(', '))
                if (typeof handler !== 'function') throw Error('Invalid hook handler. Expected a function. Received: ' + util.smart(handler))
                hooks[type].push(handler)
            },

            unhook: function (type, handler) {
                const handlers = hooks[type] || []
                const index = handlers.indexOf(handler)
                if (index !== -1) handlers.splice(index, 1)
            },

            Value: Value
        }
    },

    validator: function (data) {
        const { major, options, definition: componentDefinition } = data;
        const skipCodes = options.exceptionSkipCodes;
        const escalateCodes = options.exceptionEscalateCodes;

        const maxOrMin = {
            weight: -8,
            allowed: ({ parent }) => numericish(parent.result),
            type: ({ parent }) => numericType(parent.result),
            deserialize: ({ exception, parent, result }) => {
                const value = runDeserialize(exception, new Map(), parent.result, result);
                return exception.hasException ? result : value;
            },
            errors: ({ exception, parent, result }) => {
                runValidate(exception, new Map(), parent.result, result, { maxMin: false })
            }
        };

        const maxOrMinItems = {
            allowed: ({ parent }) => parent.definition.type === 'array',
            type: 'number',
            errors: ({ exception, result }) => {
                if (!util.isInteger(result) || result < 0) {
                    exception.message('Value must be a non-negative integer');
                }
            }
        };

        const maxOrMinLength = {
            allowed: ({ parent }) => parent.definition.type === 'string' && !numericish(parent.result),
            type: 'number',
            errors: ({ exception, result }) => {
                if (!util.isInteger(result) || result < 0) {
                    exception.message('Value must be a non-negative integer');
                }
            }
        };

        const maxOrMinProperties = {
            allowed: ({ parent }) => parent.definition.type === 'object',
            type: 'number',
            errors: ({ exception, result }) => {
                if (!util.isInteger(result) || result < 0) {
                    exception.message('Value must be a non-negative integer');
                }
            }
        };

        return {
            type: 'object',
            properties: {
                additionalProperties: EnforcerRef('Schema', {
                    allowed: ({parent}) => parent.definition.type === 'object',
                    type: ['boolean', 'object'],    // either boolean or object
                    default: true
                }),
                allOf: {
                    type: 'array',
                    items: EnforcerRef('Schema'),
                    errors: ({ exception, definition }) => {
                        const types = {};
                        const formats = {};
                        let formatKey = '';
                        definition.forEach(def => {
                            if (def.hasOwnProperty('type')) {
                                if (!types[def.type]) types[def.type] = true;
                                if (def.hasOwnProperty('format')) {
                                    formatKey = def.format;
                                    formats[def.format] = formats[def.format] ? formats[def.format] + 1 : 1;
                                }
                            }
                        });

                        const formatCount = Object.keys(formats).length;
                        if (definition.length === 0) exception.message('Must have at least one item');
                        if (Object.keys(types).length > 1) exception.message('All items must be of the same type');
                        if (formatCount > 1) exception.message('All items must be of the same format');
                    }
                },
                anyOf: {
                    allowed: ({major}) => major === 3,
                    type: 'array',
                    items: EnforcerRef('Schema')
                },
                default: {
                    freeForm: true,
                    type: ({ parent, definition }) => {
                        const def = parent.definition;
                        const types = [];
                        if (def.type !== undefined) {
                            types.push(def.type);
                        } else if (def.anyOf || def.oneOf) {
                            const schema = util.determineSchemaFromSchemas(def.anyOf ?? def.oneOf, definition);
                            if (schema === null) {
                                if (Array.isArray(definition)) {
                                    types.push('array');
                                } else if (typeof definition === 'object') {
                                    types.push('object');
                                } else {
                                    types.push(typeof definition);
                                }
                            } else if (schema.type !== undefined) {
                                types.push(schema.type);
                            }
                        } else if (def.allOf) {
                            const length = def.allOf.length;
                            for (let i = 0; i < length; i++) {
                                const s = def.allOf[i];
                                if (s.type !== undefined) {
                                    types.push(s.type);
                                    break;
                                }
                            }
                        }

                        if (def.nullable === true || def['x-nullable'] === true) types.push('null');
                        return types;
                    }
                },
                deprecated: {
                    allowed: ({major}) => major === 3,
                    type: 'boolean',
                    default: false
                },
                description: {
                    type: 'string'
                },
                discriminator: {
                    allowed: ({ parent }) => {
                        return parent && parent.validator === module.exports.validator &&
                            (parent.definition.type === 'object' || parent.definition.anyOf || parent.definition.oneOf);
                    },
                    type: ({ major }) => major === 2 ? 'string' : 'object',
                    properties: {
                        propertyName: {
                            type: 'string',
                            required: true,
                            errors: ({ definition, parent }) => {
                                const def = parent.parent.definition;
                                if (def.type === 'object' && (!def.required || !def.required.includes(definition))) {
                                    parent.parent.exception.message('Property "' + definition + '" must be required because it is used as the discriminator property')
                                }
                            }
                        },
                        mapping: {
                            type: 'object',
                            additionalProperties: {
                                type: 'string',
                                errors: ({ exception, parent, refParser, result }) => {
                                    if (refParser) {
                                        let schema;
                                        if (refParser instanceof NewRefParser) {
                                            try {
                                                const ref = rxHttp.test(result) || result.indexOf('/') !== -1
                                                    ? result
                                                    : '#/components/schemas/' + result;
                                                const sourceNode = refParser.getSourceNode(parent.definition);
                                                schema = refParser.resolvePath(sourceNode, ref);
                                            } catch (err) {
                                                exception.message('Reference cannot be resolved: ' + result);
                                            }
                                        } else {
                                            try {
                                                const ref = rxHttp.test(result) || result.indexOf('/') !== -1
                                                    ? result
                                                    : '#/components/schemas/' + result;
                                                schema = refParser.$refs.get(ref)
                                            } catch (err) {
                                                const extra = '. If you are using multiple files to define your OpenAPI document then this ' +
                                                    'may be a limitation of the original dereference function. You can try the ' +
                                                    'custom reference parser (in beta) to see if this resolves the issue.';
                                                exception.message('Reference cannot be resolved: ' + result + extra);
                                            }
                                        }

                                        if (schema) {
                                            const def = parent.parent.parent.definition;
                                            if (def.anyOf && !def.anyOf.includes(schema)) {
                                                exception.message('Mapping reference must exist in anyOf: ' + result);
                                            } else if (def.oneOf && !def.oneOf.includes(schema)) {
                                                exception.message('Mapping reference must exist in oneOf: ' + result);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    errors: ({ exception, major, parent, definition }) => {
                        if (major === 2) {
                            if (!parent.definition.required || !parent.definition.required.includes(definition)) {
                                exception.message('Value "' + definition + '" must be found in the parent\'s required properties list.');
                            }
                            if (!parent.definition.properties || !parent.definition.properties.hasOwnProperty(definition)) {
                                exception.message('Value "' + definition + '" must be found in the parent\'s properties definition.');
                            }

                        } else if (major === 3 && definition.hasOwnProperty('propertyName') && definition.type === 'object') {
                            if (!parent.definition.required || !parent.definition.required.includes(definition.propertyName)) {
                                exception.message('Value "' + definition.propertyName + '" must be found in the parent\'s required properties list.');
                            }
                            if (!parent.definition.properties || !parent.definition.properties.hasOwnProperty(definition.propertyName)) {
                                exception.message('Value "' + definition.propertyName + '" must be found in the parent\'s properties definition.');
                            }
                        }
                    }
                },
                enum: {
                    weight: -7,
                    type: 'array',
                    items: {
                        allowed: ({ parent }) => !!(parent && parent.parent),
                        type: ({ parent }) => {
                            const def = parent.parent.definition;
                            const types = [ def.type ];
                            if (def.nullable === true || def['x-nullable'] === true) types.push('null');
                            return types;
                        },
                        freeForm: true
                    }
                },
                example: {
                    allowed: true,
                    freeForm: true
                },
                exclusiveMaximum: {
                    allowed: ({ parent }) => numericish(parent.result),
                    type: 'boolean',
                    errors: ({ exception, definition, parent }) => {
                        if (definition && !parent.definition.hasOwnProperty('maximum')) {
                            exception.message('Cannot use exclusiveMaximum without defining a maximum');
                        }
                    }
                },
                exclusiveMinimum: {
                    allowed: ({ parent }) => numericish(parent.result),
                    type: 'boolean',
                    errors: ({ exception, definition, parent }) => {
                        if (definition && !parent.definition.hasOwnProperty('minimum')) {
                            exception.message('Cannot use exclusiveMinimum without defining a minimum');
                        }
                    }
                },
                externalDocs: EnforcerRef('ExternalDocumentation'),
                format: {
                    weight: -9,
                    allowed: ({ parent }) => ['boolean', 'integer', 'number', 'string'].includes(parent.definition.type),
                    type: 'string',
                    errors: ({ exception, parent, warn }) => {
                        const format = parent.definition.format;
                        if (format) {
                            const type = parent.definition.type;
                            const dataTypes = parent.staticData.dataTypes;
                            const formats = dataTypes[type];
                            const enums = formats ? Object.keys(formats) : [];
                            if (!enums.includes(format) && !skipCodes.WSCH001 && !util.schemaObjectHasSkipCode(componentDefinition, 'WSCH001')) {
                                (escalateCodes.WSCH001 ? exception : warn).message('Non standard format "' + format + '" used for type "' +  type + '". [WSCH001]');
                            }
                        }
                    }
                },
                items: EnforcerRef('Schema', {
                    allowed: ({parent}) => {
                        return parent.definition.type === 'array'
                    },
                    required: ({ parent }) => parent.definition.type === 'array'
                }),
                maximum: maxOrMin,
                maxItems: maxOrMinItems,
                maxLength: maxOrMinLength,
                maxProperties: maxOrMinProperties,
                minimum: maxOrMin,
                minItems: maxOrMinItems,
                minLength: maxOrMinLength,
                minProperties: maxOrMinProperties,
                multipleOf: {
                    allowed: ({ parent }) => ['integer', 'number'].includes(parent.definition.type),
                    type: 'number'
                },
                not: EnforcerRef('Schema', { allowed: major === 3 }),
                nullable: {
                    allowed: ({major}) => major === 3,
                    type: 'boolean',
                    default: false
                },
                oneOf: {
                    allowed: ({major}) => major === 3,
                    type: 'array',
                    items: EnforcerRef('Schema')
                },
                pattern: {
                    allowed: ({ parent }) => parent.definition.type === 'string',
                    type: 'string',
                    deserialize: ({ exception, result }) => {
                        if (!result) {
                            exception.message('Value must be a non-empty string');
                            return /./;
                        } else {
                            return new RegExp(result);
                        }
                    },
                    errors: ({ exception, result }) => {
                        if (!result) exception.message('Value must be a non-empty string');
                    }
                },
                properties: {
                    weight: -5,
                    allowed: ({parent}) => parent.definition.type === 'object',
                    type: 'object',
                    additionalProperties: EnforcerRef('Schema')
                },
                readOnly: {
                    allowed: isSchemaProperty,
                    type: 'boolean',
                    default: false,
                    errors: ({ major, parent, definition }) => {
                        if (major === 2 && definition && parent && parent.parent && parent.parent.parent && parent.parent.parent.definition.required && parent.parent.parent.definition.required.includes(parent.key) && !skipCodes.WSCH002 && !util.schemaObjectHasSkipCode(componentDefinition, 'WSCH002')) {
                            // note, this restriction is only in place for major version 2
                            parent[escalateCodes.WSCH002 ? 'exception' : 'warn'].message('Property should not be marked as both read only and required. [WSCH002]');
                        }
                    }
                },
                required: {
                    weight: 1,
                    allowed: ({parent}) => parent.definition.type === 'object',
                    type: 'array',
                    items: { type: 'string' },
                    errors: ({ definition, exception, parent }) => {
                        const additionalProperties = parent.definition.additionalProperties;
                        const parentProperties = parent.definition.properties;
                        definition.forEach(key => {
                            if ((!parentProperties || !parentProperties[key]) && !additionalProperties) {
                                exception.at(key).message('Property is listed as required but is not defined in the schema properties and additional properties are not allowed.')
                            }
                        })
                    }
                },
                title: 'string',
                type: {
                    weight: -10,
                    type: 'string',
                    default: ({ parent }) => {
                        const def = parent.definition

                        // if schema has allOf, anyOf, not, or oneOf then dont set a type
                        if (def.hasOwnProperty('allOf') || def.hasOwnProperty('anyOf') ||
                            def.hasOwnProperty('not') || def.hasOwnProperty('oneOf')) return

                        // attempt to use sibling properties to determine type
                        for (let i = typeProperties.length; i--; i >= 0) {
                            const type = typeProperties[i].type
                            const props = typeProperties[i].properties
                            for (let j = props.length; j--; j >= 0) {
                                if (props[j] in def) return type
                            }
                        }

                        // attempt to use default value to determine type
                        if ('default' in def) {
                            const value = def.default
                            if (Array.isArray(value)) return 'array'
                            switch (typeof value) {
                                case 'boolean': return 'boolean'
                                case 'number': return 'number'
                                case 'object': return 'object'
                                case 'string': return 'string'
                            }
                        }

                        // attempt to use enum to determine type
                        if ('enum' in def) {
                            const first = def.enum[0]
                            if (Array.isArray(first)) return 'array'
                            switch (typeof first) {
                                case 'boolean': return 'boolean'
                                case 'number': return 'number'
                                case 'object': return 'object'
                                case 'string': return 'string'
                            }
                        }
                    },
                    enum: ({ definition, exception, parent }) => {
                        const schemaValidator = module.exports.validator;
                        let allowFile = major === 2;
                        let node = parent.parent;
                        while (allowFile && node) {
                            if (node.validator === schemaValidator) allowFile = false;
                            node = node.parent;
                        }
                        if (definition === 'file' && major === 2 && !allowFile) {
                            exception.message('Value can only be "file" for non-nested schemas')
                        }
                        return allowFile
                            ? ['array', 'boolean', 'file', 'integer', 'number', 'object', 'string']
                            : ['array', 'boolean', 'integer', 'number', 'object', 'string'];
                    }
                },
                uniqueItems: {
                    allowed: ({parent}) => parent.definition.type === 'array',
                    type: 'boolean'
                },
                writeOnly: {
                    allowed: (data) => data.major === 3 && !!isSchemaProperty(data),
                    type: 'boolean',
                    default: false
                },
                xml: EnforcerRef('Xml')
            },

            errors: (data) => {
                const { exception, definition, result, warn } = data;

                // warn if type is not defined and should be
                if (!definition.hasOwnProperty('allOf') && !definition.hasOwnProperty('anyOf') &&
                    !definition.hasOwnProperty('not') && !definition.hasOwnProperty('oneOf')) {

                    if (!('type' in definition) && !skipCodes.WSCH005 && !util.schemaObjectHasSkipCode(componentDefinition, 'WSCH005')) {
                        (escalateCodes.WSCH005 ? exception : warn).message('Schemas with an indeterminable type cannot serialize, deserialize, or validate values. [WSCH005]');
                    }
                }

                if (!minMaxValid(result.minItems, result.maxItems)) {
                    exception.message('Property "minItems" must be less than or equal to "maxItems"');
                }

                if (!minMaxValid(result.minLength, result.maxLength)) {
                    exception.message('Property "minLength" must be less than or equal to "maxLength"');
                }

                if (!minMaxValid(result.minProperties, result.maxProperties)) {
                    exception.message('Property "minProperties" must be less than or equal to "maxProperties"');
                }

                if (result.required && result.hasOwnProperty('maxProperties') && result.required.length > result.maxProperties) {
                    exception.message('There are more required properties than is allows by "maxProperties" contraint');
                }

                if (!minMaxValid(result.minimum, result.maximum, result.exclusiveMinimum, result.exclusiveMaximum)) {
                    const msg = result.exclusiveMinimum || result.exclusiveMaximum ? '' : 'or equal to ';
                    exception.message('Property "minimum" must be less than ' + msg + '"maximum"');
                }

                if (result.hasOwnProperty('properties')) {
                    Object.keys(result.properties).forEach(key => {
                        const v = result.properties[key];
                        if (v.readOnly && v.writeOnly) {
                            exception.at('properties').at(key).message('Cannot be marked as both readOnly and writeOnly');
                        }
                    });
                }

                // validate that zero or one composite has been defined
                const composites = [];
                ['allOf', 'anyOf', 'oneOf', 'not'].forEach(composite => {
                    if (result.hasOwnProperty(composite)) composites.push(composite);
                });
                if (composites.length > 1) {
                    exception.message('Cannot have multiple composites: ' + composites.join(', '));
                }
            }
        };
    }
};

function allOfMergeExclusiveNumberDefault (allOf, key) {
    const exclusiveKey = 'exclusive' + key[0].toUpperCase() + key.substring(1);
    const object = {};
    object[exclusiveKey] = false;
    return allOf.map(schema => {
        return schema.hasOwnProperty(key) && !schema.hasOwnProperty(exclusiveKey)
            ? Object.assign({}, object, schema)
            : schema;
    });
}

/**
 * Accepts a function that returns a regular expression. Uses the regular expression to extract parameter names from strings.
 * @param {function} rxGenerator
 * @returns {function}
 */
function buildInjector(rxGenerator) {
    return function(value, data) {
        const rx = rxGenerator();
        let match;
        let result = '';
        let offset = 0;
        while ((match = rx.exec(value))) {
            const property = match[1];
            result += value.substring(offset, match.index) + (data[property] !== undefined ? data[property] : match[0]);
            offset = match.index + match[0].length;
        }
        return result + value.substr(offset);
    };
}

/**
 *
 * @param schema
 * @param exception
 * @param value
 * @param {object} options
 * @param {boolean} [options.enum] Set to false to skip enum validation.
 * @param {boolean} [options.isExample] If the passed in value is an example then set this to true.
 * @param {boolean} [options.maxMin] Set to false to skip max min validation.
 * @param {'read', 'write} [options.readWriteMode] Set to 'read' if in read only mode or to 'write' if write only mode.
 * @returns {*}
 */
function deserializeAndValidate(schema, exception, value, options) {
    let error;
    [ value, error ] = schema.deserialize(value);
    if (!error) {
        const exception = Exception('Invalid value');
        runValidate(exception, new Map(), schema, value, options);
        if (exception.hasException) error = exception;
    }
    if (error) exception.push(error);
    return value;
}

function getMergeTypes (schemas, types = {}, formats = {}) {
    schemas.forEach(schema => {
        if (schema.hasOwnProperty('format')) formats[schema.format] = true;
        if (schema.hasOwnProperty('type')) types[schema.type] = true;
        if (schema.hasOwnProperty('allOf')) getMergeTypes(schema.allOf, types, formats);
    });
    return {
        formats: Object.keys(formats),
        types: Object.keys(types)
    }
}

function isSchemaProperty({ parent }) {
    return parent && parent.parent && parent.parent.key === 'properties' &&
        parent.parent.parent && parent.parent.parent.validator === module.exports.validator;
}

function merge (exception, warning, schemas, dataTypes, major, skipCodes, escalateCodes) {
    const { types, formats } = getMergeTypes(schemas);
    if (types.length > 1) return exception.message('All items must be of the same type. Found: ' + types.join(', '));
    if (formats.length > 1) return exception.message('All items must be of the same format. Found: ' + formats.join(', '));

    // create a definition object that only contains skip code information
    const skipCodeDefinition = {}
    schemas.forEach(schema => {
        if (typeof schema === 'object' && schema !== null) {
            const definitionSkipCodes = schema['x-enforcer-exception-skip-codes'];
            if (definitionSkipCodes !== undefined) {
                if (skipCodeDefinition['x-enforcer-exception-skip-codes'] === undefined) {
                    skipCodeDefinition['x-enforcer-exception-skip-codes'] = '';
                }
                skipCodeDefinition['x-enforcer-exception-skip-codes'] += ' ' + definitionSkipCodes;
            }
        }
    })

    const type = types[0];
    const format = formats[0];
    const dataType = formats.length > 0 ? dataTypes[type][formats[0]] : null;
    const isNumeric = dataType ? dataType.isNumeric : false;
    const result = {};
    if (type) result.type = type;
    if (format) result.format = format;

    // set default
    const defaults = Array.from(new Set(schemas.filter(schema => schema.hasOwnProperty('default')).map(schema => schema.default)));
    if (defaults.length > 1 && !skipCodes.WSCH003 && !util.schemaObjectHasSkipCode(skipCodeDefinition, 'WSCH003')) {
        (escalateCodes.WSCH003 ? exception : warning).message('Two or more defaults found. Using first default. [WSCH003]');
    }
    if (defaults.length > 0) result.default = defaults[0];

    // set enum
    let enumMapsCount = 0;
    const enumException = exception.at('enum');
    const enumArrays = [];
    schemas.forEach((schema, index) => {
        if (schema.hasOwnProperty('enum')) {
            enumMapsCount++;
            if (dataType && dataType.serialize) {
                const data = schema.enum.map(value => dataType.serialize({
                    exception: enumException.at(index),
                    schema,
                    value
                }));
                enumArrays.push(data);
            } else {
                enumArrays.push(schema.enum);
            }
        }
    });
    const enumMap = {};
    enumArrays.forEach(values => {
        values.forEach(value => {
            if (!enumMap[value]) {
                enumMap[value] = 1;
            } else {
                enumMap[value]++;
            }
        })
    });
    const enumMapKeys = Object.keys(enumMap);
    const enumValues = enumMapKeys.filter(key => enumMap[key] === enumMapsCount);
    if (enumMapsCount) {
        if (enumValues.length === 0) {
            exception.message('Enum values across schemas have nothing in common');
        } else {
            result.enum = enumValues;
        }
    }

    // set example
    const examples = Array.from(new Set(schemas.filter(schema => schema.hasOwnProperty('example')).map(schema => schema.example)));
    if (examples.length > 1 && !skipCodes.WSCH004 && !util.schemaObjectHasSkipCode(skipCodeDefinition, 'WSCH004')) {
        (escalateCodes.WSCH004 ? exception : warning).message('Two or more examples found. Using first example. [WSCH004]');
    }
    if (examples.length > 0) result.example = examples[0];

    // allOf, oneOf, anyOf, not, nullable
    const allOf = [];
    const oneOf = [];
    const anyOf = [];
    const not = [];
    const nullable = { hasTrue: false, hasFalse: false };
    schemas.forEach(schema => {
        if (schema.allOf) allOf.push.apply(allOf, schema.allOf);
        if (schema.oneOf) allOf.push.apply(oneOf, schema.oneOf);
        if (schema.anyOf) allOf.push.apply(anyOf, schema.anyOf);
        if (schema.not) not.push(schema.not);
        if (schema.hasOwnProperty('nullable')) {
            nullable[schema.nullable ? 'hasTrue' : 'hasFalse'] = true;
        }
    });
    if (allOf.length) Object.assign(result, merge(exception.at('allOf'), warning.at('allOf'), allOf, dataTypes, major, skipCodes, escalateCodes));
    if (oneOf.length) result.oneOf = oneOf;
    if (anyOf.length) result.anyOf = anyOf;
    if (not.length === 1) result.not = not[0];
    if (not.length > 1) result.not = merge(exception.at('not'), warning.at('not'), not, dataTypes, major, skipCodes, escalateCodes);
    if (nullable.hasTrue && nullable.hasFalse) {
        exception.message('Unable to merge conflicting nullable values');
    } else if (nullable.hasTrue) {
        result.nullable = true;
    } else if (nullable.hasFalse) {
        result.nullable = false;
    }

    mergeProperty(result, schemas, 'readOnly', mergeTendToTrue);
    mergeProperty(result, schemas, 'writeOnly', mergeTendToTrue);

    // discriminator
    if (major === 2) {
        const namesMap = {};
        schemas.forEach(schema => {
            if (schema.discriminator) namesMap[schema.discriminator] = true;
        });
        const names = Object.keys(namesMap);
        if (names.length === 1) result.discriminator = names[0];
        if (names.length > 1) exception.message('Unable to merge multiple discriminator values into one');

    } else if (major === 3) {
        const namesMap = {};
        const mappings = {};
        const mappingConflicts = [];
        schemas.forEach(schema => {
            if (schema.discriminator) {
                const discriminator = schema.discriminator;
                namesMap[discriminator.propertyName] = true;
                if (discriminator.mapping) {
                    Object.keys(discriminator.mapping).forEach(key => {
                        const value = discriminator.mapping[key];
                        if (mappings.hasOwnProperty(key)) {
                            if (mappings[key] !== value) {
                                mappingConflicts.push(key);
                            }
                        } else {
                            mappings[key] = value;
                        }
                    })
                }
            }
        });
        const names = Object.keys(namesMap);
        if (names.length === 1) result.discriminator = names[0];
        // if (names.length === 1) result.discriminator = {
        //     propertyName: names[0],
        //     mapping: mappings
        // };
        if (names.length > 1) exception.message('Unable to merge multiple discriminator values into one');
        if (mappingConflicts.length > 0) exception.message('Conflicting discriminator mappings attempt to map different values to same name');
    }

    if (type === 'array') {
        const itemsArray = schemas
            .filter(schema => schema.hasOwnProperty('items'))
            .map(schema =>  schema.items);
        result.items = merge(exception.at('items'), warning.at('items'), itemsArray, dataTypes, major, skipCodes, escalateCodes);

        mergeProperty(result, schemas, 'maxItems', (a, b) => {
            return { value: a < b ? a : b };
        });
        mergeProperty(result, schemas, 'minItems', (a, b) => {
            return { value: a > b ? a : b };
        });
        mergeProperty(result, schemas, 'uniqueItems', mergeTendToTrue);

    } else if (type === 'integer' || type === 'number' || isNumeric) {
        mergeProperty(result, schemas, 'maximum', (a, b) => {
            return { value: a < b ? a : b };
        });
        mergeProperty(result, schemas, 'minimum', (a, b) => {
            return { value: a > b ? a : b };
        });
        mergeProperty(result, schemas, 'multipleOf', (a, b) => {
            return { value: util.leastCommonMultiple(a, b) };
        });
        mergeProperty(result, allOfMergeExclusiveNumberDefault(schemas, 'maximum'), 'exclusiveMaximum',(a, b, ai, bi, items) => {
            const valueA = items[ai].maximum;
            const valueB = items[bi].maximum;
            if (a === true && valueA <= valueB) return { index: ai, value: true };
            if (b === true && valueB <= valueA) return { index: bi, value: true };
            return valueA <= valueB
                ? { index: ai, value: false }
                : { index: bi, value: false }
        });
        mergeProperty(result, allOfMergeExclusiveNumberDefault(schemas, 'minimum'), 'exclusiveMinimum', (a, b, ai, bi, items) => {
            const valueA = items[ai].minimum;
            const valueB = items[bi].minimum;
            if (a === true && valueA >= valueB) return { index: ai, value: true };
            if (b === true && valueB >= valueA) return { index: bi, value: true };
            return valueA >= valueB
                ? { index: ai, value: false }
                : { index: bi, value: false }
        });

    } else if (type === 'object') {
        // merge additional properties
        const additionalPropertiesHas = { 'true': false, 'false': false };
        const additionalPropertyObjects = schemas
            .filter(schema => {
                const additional = schema.additionalProperties;
                if (!schema.hasOwnProperty('additionalProperties')) return false;
                if (additional === false) additionalPropertiesHas.false = true;
                if (additional === true) additionalPropertiesHas.true = true;
                return typeof additional === 'object';
            })
            .map(schema => schema.additionalProperties);
        if (additionalPropertiesHas.false && (additionalPropertiesHas.true || additionalPropertyObjects.length)) {
            exception.message('Conflict with additionalProperties');
        } else if (additionalPropertyObjects.length === 1) {
            result.additionalProperties = additionalPropertyObjects[0];
        } else if (additionalPropertyObjects.length > 1) {
            result.additionalProperties = merge(exception.at('additionalProperties'), warning.at('additionalProperties'), additionalPropertyObjects, dataTypes, major, skipCodes, escalateCodes);
        }

        // gather data for defined properties and required properties
        const propsException = exception.at('properties');
        const propsWarning = exception.at('properties');
        const propsArrays = {};
        const requiredMap = {};
        schemas.forEach(schema => {
            if (schema.hasOwnProperty('properties')) {
                Object.keys(schema.properties)
                    .forEach(key => {
                        if (!propsArrays[key]) propsArrays[key] = [];
                        propsArrays[key].push(schema.properties[key]);
                    });
            }
            if (schema.hasOwnProperty('required')) {
                schema.required.forEach(name => {
                    requiredMap[name] = true;
                })
            }
        });

        // merge individual properties
        Object.keys(propsArrays).forEach(key => {
            const items = propsArrays[key];
            if (items.length > 0) {
                if (!result.properties) result.properties = {};
                if (items.length === 1) {
                    result.properties[key] = items[0];
                } else {
                    result.properties[key] = merge(propsException.at(key), propsWarning.at(key), items, dataTypes, major, skipCodes, escalateCodes);
                }
            }
        });

        // merge required
        const required = Object.keys(requiredMap);
        if (required.length) result.required = required;

        mergeProperty(result, schemas, 'maxProperties', (a, b) => {
            return { value: a < b ? a : b };
        });
        mergeProperty(result, schemas, 'minProperties', (a, b) => {
            return { value: a > b ? a : b };
        });


    } else if (type === 'string') {
        const patterns = schemas.filter(schema => schema.hasOwnProperty('pattern'));
        if (patterns.length === 1) {
            result.patterns = patterns[0];
        } else if (patterns.length > 1) {
            exception.message('Unable to merge multiple patterns');
        }

        mergeProperty(result, schemas, 'maxLength', (a, b) => {
            return { value: a < b ? a : b };
        });
        mergeProperty(result, schemas, 'minLength', (a, b) => {
            return { value: a > b ? a : b };
        });
    }

    // serialize appropriate values
    // if (type === 'string' && dataType) {
    //     const schema = { type, format };
    //     ['default', 'maximum', 'minimum', 'multipleOf'].forEach(key => {
    //         if (result.hasOwnProperty(key)) {
    //             result[key] = dataType.serialize({ exception, schema, value: result[key] });
    //         }
    //     });
    // }

    return result;
}

function mergeProperty (store, items, property, evaluator) {
    const length = items.length;
    const matches = [];
    for (let i = 0; i < length; i++) {
        if (items[i].hasOwnProperty(property)) {
            const value = items[i][property];
            matches.push({ index: i, value: value });
        }
    }
    if (matches.length === 1) {
        store[property] = matches[0].value;
    } else if (matches.length > 1) {
        const length = matches.length;
        let result = matches[0].value;
        let index = matches[0].index;
        for (let i = 1; i < length; i++) {
            const data = evaluator(result, matches[i].value, index, matches[i].index, items);
            if (data !== undefined) {
                result = data.value;
                index = data.index;
            }
        }
        store[property] = result;
    }
}

function mergeTendToTrue (a, b) {
    return { value: a === true || b === true };
}

function minMaxValid(minimum, maximum, exclusiveMinimum, exclusiveMaximum) {
    if (minimum === undefined || maximum === undefined) return true;
    minimum = minimum.valueOf();
    maximum = maximum.valueOf();
    return minimum < maximum || (!exclusiveMinimum && !exclusiveMaximum && minimum === maximum);
}

function numericish(schema) {
    if (['number', 'integer'].includes(schema.type)) return true;
    const dataTypes = schema.enforcerData.staticData.dataTypes;
    const dataType = dataTypes[schema.type] && dataTypes[schema.type][schema.format];
    return !!(dataType && dataType.isNumeric);
}

function numericType (schema) {
    const dataTypes = schema.enforcerData.staticData.dataTypes;
    const dataType = dataTypes[schema.type] && dataTypes[schema.type][schema.format];
    if (dataType && dataType.isNumeric) {
        switch (schema.type) {
            case 'boolean':
                return 'boolean';
            case 'string':
                return 'string';
            case 'integer':
            case 'number':
            default:
                return 'number';
        }
    } else {
        return 'number';
    }
}

function serializeSchema (schema, exception, dataTypes, serializedSchemas) {
    if (schema.pattern) {
        schema.pattern = schema.pattern.source;
    }
    if (!serializedSchemas) {
        serializedSchemas = [schema];
    } else if (!serializedSchemas.includes(schema)) {
        serializedSchemas.push(schema);
    } else {
        return schema;
    }
    if (schema.type === 'array' && schema.items) {
        schema.items = serializeSchema(schema.items, exception.at('items'), dataTypes, serializedSchemas);
    } else if (schema.type === 'object') {
        if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
            schema.additionalProperties = serializeSchema(schema.additionalProperties, exception.at('additionalProperties'), dataTypes, serializedSchemas)
        }
        if (schema.properties) {
            const childException = exception.at('properties');
            Object.keys(schema.properties)
                .forEach(key => {
                    schema.properties[key] = serializeSchema(schema.properties[key], childException.at(key), dataTypes, serializedSchemas)
                });
        }
    } else {
        const dataType = dataTypes.hasOwnProperty(schema.type) &&
            dataTypes[schema.type].hasOwnProperty(schema.format) &&
            dataTypes[schema.type][schema.format];
        if (dataType && dataType.serialize) {
            ['default', 'maximum', 'minimum', 'multipleOf'].forEach(key => {
                if (schema.hasOwnProperty(key)) {
                    schema[key] = dataType.serialize({
                        exception: exception.at(key),
                        schema,
                        value: schema[key]
                    })
                }
            })
        }
    }
    return schema;
}

function setProperty(object, property, value) {
    Object.defineProperty(object, property, {
        configurable: true,
        enumerable: true,
        value
    });
}
