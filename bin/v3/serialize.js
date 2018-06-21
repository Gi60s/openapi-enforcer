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
const serial    = require('../v2/serialize');

exports.deserialize = deserialize;
exports.serialize = serialize;

// TODO: add oneOf and anyOf support
function deserialize(exception, schema, value) {
    if (schema.oneOf) {

    } else if (schema.anyOf) {

    } else {
        return serial.deserialize(exception, schema, value);
    }
}

// TODO: add oneOf and anyOf support
function serialize(exception, schema, value) {
    if (schema.oneOf) {

    } else if (schema.anyOf) {

    } else {
        return serial.serialize(exception, schema, value);
    }
}