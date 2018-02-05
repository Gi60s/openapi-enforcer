/**
 *  @license
 *    Copyright 2016 Brigham Young University
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
const rx        = require('./rx');

exports.byte = v => typeof v === 'string' && rx.byte.test(v) && v.length % 4 === 0;

exports.binary = v => typeof v === 'string' && rx.binary.test(v);

exports.boolean = (value, strict) => {
    if (strict && typeof value !== 'boolean') return false;
    return rx.boolean.test(value);
};

exports.date = v => typeof v === 'string' && rx.date.test(v);

exports.dateTime = v => typeof v === 'string' && rx.dateTime.test(v);

exports.integer = (value, strict) => {
    if (strict && (typeof value !== 'number' || isNaN(value))) return false;
    return rx.integer.test(value);
};

exports.number = (value, strict) => {
    if (strict && (typeof value !== 'number' || isNaN(value))) return false;
    return rx.number.test(value);
};