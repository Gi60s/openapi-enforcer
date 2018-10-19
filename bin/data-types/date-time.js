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
const rx        = require('../rx');
const util      = require('../util');

exports.deserialize = function ({ exception, value }) {
    if (!rx.dateTime.test(value)) {
        exception('Value is not date-time string of the format YYYY-MM-DDTmm:hh:ss.sssZ');
    } else {
        const date = util.getDateFromValidDateString('date-time', value);
        if (!date) {
            exception('Value is not a valid date-time');
        } else {
            return date;
        }
    }
};

exports.random = function ({ schema }) {
    // TODO: random
    throw Error('TODO');
};

exports.serialize = function ({ coerce, exception, value }) {
    const originalValue = value;
    const type = typeof value;
    if (type === 'string' && (rx.date.test(value) || rx.dateTime.test(value))) value = new Date(value);
    if (coerce && type === 'number' && !isNaN(value)) value = new Date(Number(value));
    if (util.isDate(value)) {
        return value.toISOString();
    } else {
        exception('Expected a valid Date instance or date formatted string. Received: ' + util.smart(originalValue));
    }
};

exports.validate = function ({ exception, value }) {
    if (!util.isDate(value)) {
        exception('Expected a valid date object. Received: ' + util.smart(value));
    } else {
        util.validateMaxMin(exception, schema, schema.format, 'maximum', 'minimum', false, value, schema.maximum, schema.minimum);
    }
};