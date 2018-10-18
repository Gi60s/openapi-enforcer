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
const Exception     = require('../../exception');
const Coerce       = require('../../../coerce');
const populate      = require('./populate');
const random        = require('./random');
const serial        = require('./serialize');
const Super         = require('../super');
const validate      = require('./validate');

const store = new WeakMap();

module.exports = Super(Schema);

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
}

/**
 * Take a serialized (ready for HTTP transmission) value and deserialize it.
 * Converts strings of binary, byte, date, and date-time to JavaScript equivalents.
 * @param {*} value
 * @returns {{ error: Exception|null, value: * }}
 */
Schema.prototype.deserialize = function(value) {
    let coerce = false;
    if (Coerce.isCoercedValue(value)) {
        coerce = true;
        value = value.value;
    }
    return serial.deserialize(this, value, coerce);
};

/**
 * Get discriminator key and schema.
 * @param {*} value
 * @returns {{ key: string, schema: Schema }}
 */
Schema.prototype.getDiscriminator = function(value) {
    const { definition, enforcer } = store.get(this);
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
    let coerce = false;
    if (Coerce.isCoercedValue(value)) {
        coerce = true;
        value = value.value;
    }
    return serial.serialize(this, value, coerce);
};

/**
 * Check to see if the value is valid for this schema.
 * @param {*} value
 * @returns {Exception|null}
 */
Schema.prototype.validate = function(value) {
    return validate(this, value);
};