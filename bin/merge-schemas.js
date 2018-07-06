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
const util      = require('./util');

module.exports = mergeSchemas;

function compatibleFormat(schema1, schema2) {
    const f1 = schema1.format;
    const f2 = schema2.format;

    if (!f1 || !f2 || f1 === f2) return f1;
    if (f1 === 'integer' && f2 === 'number') return 'integer';
    if (f1 === 'number' && f2 === 'integer') return 'integer';
    return null;
}

function compatibleType(schema1, schema2) {
    const t1 = schema1.type;
    const t2 = schema2.type;

    if (!t1 || !t2 || t1 === t2) return t1;
    if (t1 === 'integer' && t2 === 'number') return 'integer';
    if (t1 === 'number' && t2 === 'integer') return 'integer';
    return null;
}

function mergeSchemas(schemas, settings) {
    const length = schemas.length;
    const result = {};

    if (length === 0) return null;

    for (let i = 0; i < length; i++) {
        const schema = schemas[i];
        const type = util.schemaType(schema);

        if (settings.allOf && type === 'allOf') {

        } else if (settings.anyOf && type === 'anyOf') {

        } else if (settings.oneOf && type === 'oneOf') {

        } else {
            const mergedType = compatibleType(result, schema);
            if (mergedType === null) return null;
            result.type = mergedType;

            switch(mergedType) {
                case 'array':
                    break;
                case 'boolean':
                    break;
                case 'integer':
                    break;
                case 'number':
                    break;
                case 'object':
                    break;
                case 'string':
                    if (util.schemaFormat(result) !== util.schemaFormat(schema)) return null;

                    break;
            }
        }
    }
}