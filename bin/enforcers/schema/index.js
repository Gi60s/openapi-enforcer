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
const BinaryByte    = require('../../data-types/binary-byte');
const Exception     = require('../../exception');
const populate      = require('./populate');
const random        = require('./random');
const serial        = require('./serialize');
const Super         = require('../super');
const validate      = require('./validate');
const Value         = require('../../../value');

const store = new WeakMap();
const globalDataTypeFormats = {   // global types can be overwritten by local types
    boolean: {},
    integer: {},
    number: {},
    string: {
        binary: BinaryByte.binary,
        byte: BinaryByte.byte,
        date: require('../../data-types/date'),
        'date-time': require('../../data-types/date-time')
    }
};

module.exports = Super(Schema, {
    dataTypeFormats: {}
});

function Schema({ exception, definition, warn }) {

    // validate the default value
    if (definition.hasOwnProperty('default')) {
        const error = this.validate(definition.default);
        if (error) exception.at('default')(error);
    }

    // validate enum values
    if (definition.hasOwnProperty('enum')) {
        definition.enum.forEach((value, index) => {
            const error = this.validate(value);
            if (error) exception.at('enum').at(index)(error);
        })
    }

    // validate the example
    if (definition.hasOwnProperty('example')) {
        const error = this.validate(definition.example);
        if (error) warn.at('example')(error);
    }

    this.dataTypeFormats.types = {};
    this.dataTypeFormats.deserialize = (exception, value) => callDataTypeFormatFunction('deserialize', this, exception, value);
    this.dataTypeFormats.serialize = (exception, value) => callDataTypeFormatFunction('serialize', this, exception, value);
    this.dataTypeFormats.validate = (exception, value) => callDataTypeFormatFunction('validate', this, exception, value);

    // merge global data types into (currently empty) data types object
    Object.keys(globalDataTypeFormats).forEach(key => {
        this.dataTypeFormats.types[key] = Object.assign({}, globalDataTypeFormats[key]);
    });
}

// Plugins can define data type formats
Schema.prototype.defineDataType = function (type, format, definition) {
    const types = this.dataTypeFormats.types;

    // validate input parameters
    if (!types.hasOwnProperty(type)) throw Error('Invalid type specified. Must be one of: ' + Object.keys(types).join(', '));
    if (!format || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string');
    if (types[type].hasOwnProperty(format)) throw Error('Format "' + format + '" is already defined for type ' + type);
    if (!definition || typeof definition !== 'object' ||
        typeof definition.deserialize !== 'function' ||
        typeof definition.serialize !== 'function' ||
        typeof definition.validate !== 'function'
        || (definition.random &&  typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.');

    // store the definition
    types[type][format] = definition;
};

/**
 * Take a serialized (ready for HTTP transmission) value and deserialize it.
 * Converts strings of binary, byte, date, and date-time to JavaScript equivalents.
 * @param {*} value
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.deserialize = function(value) {
    return serial.deserialize(this, value);
};

/**
 * Get discriminator key and schema.
 * @param {*} value
 * @returns {{ key: string, schema: Schema }}
 */
Schema.prototype.getDiscriminator = function(value) {
    const { definition, enforcer } = store.get(this);   // TODO: get rid of this, the values exist on the prototype
    const version = enforcer.version;
    if (version === 2) {
        const discriminator = definition.discriminator;
        const key = discriminator && value && value.hasOwnProperty(discriminator) ? value[discriminator] : undefined;
        if (!key) return { key: undefined, schema: undefined };
        const schema = enforcer.definition && enforcer.definition.definitions && enforcer.definition.definitions[key];
        return { key, schema };

    } else if (version === 3) {
        const discriminator = definition.discriminator;
        const key = discriminator && value && value.hasOwnProperty(discriminator.propertyName) ? value[discriminator.propertyName] : undefined;
        if (!key) return { key: undefined, schema: undefined };

        const mapping = discriminator.mapping;
        const schema = mapping && mapping[key];
        return { key, schema };
    }
};

/**
 * Populate a value from a list of parameters.
 * @param {object} params
 * @param {*} [value]
 * @param {object} [options]
 * @param {boolean} [options.copy=false]
 * @param {boolean} [options.conditions=true]
 * @param {boolean} [options.defaults=true]
 * @param {string} [options.replacement='handlebar']
 * @param {boolean} [options.reportErrors=false]
 * @param {boolean} [options.templateDefaults=true]
 * @param {boolean} [options.templates=true]
 * @param {boolean} [options.variables=true]
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.populate = function(params, value, options) {
    return populate.populate(this, params, value, options);
};

/**
 * Produce a random value for the schema.
 * @param {*} value An initial value to add random values to.
 * @param {object} [options]
 * @param {boolean} [options.skipInvalid=false]
 * @param {boolean} [options.throw=true]
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.random = function(value, options) {
    return random(this, value, options);
};

/**
 * Take a deserialized (not ready for HTTP transmission) value and serialize it.
 * Converts Buffer and Date objects into string equivalent.
 * @param value
 * @returns {*}
 */
Schema.prototype.serialize = function(value) {
    return serial.serialize(this, value);
};

/**
 * Check to see if the value is valid for this schema.
 * @param {*} value
 * @returns {Exception|null}
 */
Schema.prototype.validate = function(value) {
    return validate(this, value);
};



Schema.defineDataTypeFormat = function (type, format, definition) {
    // validate input parameters
    if (!globalDataTypeFormats.hasOwnProperty('type')) throw Error('Invalid type specified. Must be one of: ' + Object.keys(globalDataTypes).join(', '));
    if (!format || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string');
    if (globalDataTypeFormats.hasOwnProperty(format)) throw Error('Format "' + format + '" is already defined');
    if (!definition || typeof definition !== 'object' ||
        typeof definition.deserialize !== 'function' ||
        typeof definition.serialize !== 'function' ||
        typeof definition.validate !== 'function'
        || (definition.random &&  typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.');

    // store the definition
    globalDataTypeFormats[format] = definition;
};


function callDataTypeFormatFunction(mode, schema, exception, originalValue) {
    const format = schema.format;
    const map = schema.dataTypeFormats.types[schema.type] && schema.dataTypeFormats.types[schema.type][schema.format];
    const fn = format && typeof map === 'object' && typeof map[mode] === 'function' ? map[mode] : null;
    if (fn) {
        const { coerce, serialize, validate, value } = Value.getAttributes(originalValue);
        return fn({
            coerce,
            exception,
            serialize,
            schema: this,
            validate,
            value
        });
    }
}