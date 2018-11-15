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
const base          = require('../validator-parameter-base');
const EnforcerRef   = require('../enforcer-ref');

module.exports = {
    init: function (data) {
        const { context, exception, major, warn } = data;
        if (major === 2) {
            const def = base.extractSchemaDefinition(this);
            const [schema, error, warning] = context.Schema(def);
            if (schema) this.schema = schema;
            if (error) exception.merge(error);
            if (warning) warn.merge(warning);
        }
    },

    prototype: {},

    validator: function (data) {
        const { major } = data;
        const validator = base.validator(data);

        validator.properties.required = {
            type: 'boolean',
            default: false
        };

        validator.properties.style = {
            weight: -5,
            allowed: major === 3,
            type: 'string',
            default: 'simple',
            enum: ['simple']
        };

        return validator;
    }
};
