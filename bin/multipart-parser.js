/**
 *  @license
 *    Copyright 2017 Brigham Young University
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
const rxEmptyLine = /^ *$/;
const rxHeader = /^([^:]+): ?([\s\S]*?)$/;
const rxBoundary = /^boundary=([\s\S]+?)$/i;

const rx = {
    boundary: /^boundary=([\s\S]+?)$/,
    emptyLine: /^ *$/m,
    fieldName: /^name=(["'])([\s\S]+?)\1$/,
    fileName: /^filename=(["'])([\s\S]+?)\1$/,
    newLineEnd: /(?:\r\n|\r|\n)$/,
    newLineStart: /^(?:\r\n|\r|\n)/,
    spaceEnd: /\s+$/,
    spaceStart: /^\s+/
};

module.exports = function(headers, content) {
    const fields = [];
    const boundaryId = getBoundaryId(headers);
    if (boundaryId) scanBoundary(content, boundaryId, fields);

    const result = {};
    fields.forEach(field => {
        if (field.name) {
            if (!result[field.name]) result[field.name] = [];
            result[field.name].push(field);
        }
    });

    return result;
};

function find(array, filter, index) {
    const count = array.length;
    const hasIndex = arguments.length > 2;
    const fn = filter instanceof RegExp
        ? v => {
            const match = filter.exec(v);
            if (!match) return;
            if (hasIndex) return match[index];
            return match;
        }
        : v => v === filter;

    for (let i = 0; i < count; i++) {
        const result = fn(array[i]);
        if (result) return result;
    }
}

function findEmptyLine(str) {
    const rxNl = /\r\n|\r|\n/g;
    let match;
    let offset = 0;
    while (match = rxNl.exec(str)) {
        const sub = str.substring(offset, match.index);
        if (rx.emptyLine.test(sub)) return match;
        offset = match.index + match[0].length;
    }
}

function getBoundaryId(headers) {
    if (headers['content-type']) {
        const items = splitHeaderValue(headers['content-type']);
        if (!find(items, 'multipart/form-data')) return;

        const length = items.length;
        for (let i = 0; i < length; i++) {
            const match = rxBoundary.exec(items[i]);
            if (match) return match[1];
        }
    }
}

function scanBoundary(content, boundaryId, fields) {
    const rxEnd = new RegExp('^--' + boundaryId + '--$', 'm');
    let match;

    match = rxEnd.exec(content);
    if (!match) return;

    const boundary = content.substr(0, match.index);
    const sections = boundary.split(new RegExp('^--' + boundaryId + '$', 'm'));

    sections.forEach(section => {
        section = trimNewLine(section);
        const match = findEmptyLine(section);
        if (match) {
            const headers = scanHeaders(trimNewLine(section.substr(0, match.index)));
            const value = trimNewLine(section.substr(match.index + match.length));
            const field = { headers: headers, content: value };
            let hasSubBoundary;

            if (headers['content-disposition']) {
                const hValues = splitHeaderValue(headers['content-disposition']);
                field.name = find(hValues, rx.fieldName, 2);
                field.filename = find(hValues, rx.fileName, 2);
                field.disposition = hValues[0];
            }

            if (headers['content-type']) {
                const boundaryId = find(splitHeaderValue(headers['content-type']), rx.boundary, 1);
                if (boundaryId) {
                    hasSubBoundary = true;
                    const subFields = [];
                    const subValue = trimNewLine(value.substr(boundaryId.length + 2));
                    scanBoundary(subValue, boundaryId, subFields);
                    subFields.forEach(f => {
                        f.name = field.name;
                        fields.push(f);
                    });
                }
            }

            if (!hasSubBoundary) fields.push(field);
        }
    });
}

function scanHeaders(content) {
    const lines = content.split(/\r\n|\r|\n/);
    const headers = {};
    let line;
    while (line = lines.shift()) {
        const match = rxHeader.exec(line);
        if (match) {
            const name = match[1].toLowerCase();
            headers[name] = match[2];
        }
    }
    return headers;
}

function splitHeaderValue(value) {
    return value.split(/; (?=(?:[^"\\]*(?:\\.|"(?:[^"\\]*\\.)*[^"\\]*"))*[^"]*$)/);
}

function trimNewLine(str) {
    return str.replace(rx.newLineStart, '').replace(rx.newLineEnd, '');
}
