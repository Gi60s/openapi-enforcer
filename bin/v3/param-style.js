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

exports.form = function(type, explode, name, value) {
    if (explode && type === 'object') {
        const result = objectExploded('&', '=', '&' + value);
        return result ? { match: true, value: result } : { match: false };
    }

    const rx = RegExp('(?:^|&)' + name + '=([^&]+)?', 'g');
    let result;
    let match;
    while (match = rx.exec(value)) {
        const value = match[1];

        if (type === 'array') {
            if (explode) {
                if (!result) result = [];
                result.push(value);
            } else {
                result = value.split(',');
            }

        } else if (type === 'object') {
            const parsed = objectFlattened(',', value);
            if (parsed) result = parsed;

        } else {
            result = value || '';
        }
    }
    return result === undefined ? { match: false } : { match: true, value: result };
};

exports.label = function(type, explode, value) {
    if (!/^\./.test(value)) {
        return { match: false };

    } else if (type === 'array') {
        return { match: true, value: value.substr(1).split('.') };

    } else if (type === 'object') {
        const parsed = explode
            ? objectExploded('.', '=', value)
            : objectFlattened('.', value.substr(1));
        return parsed ? { match: true, value: parsed } : { match: false };

    } else {
        return { match: true, value: value.substr(1) };
    }
};

exports.matrix = function(type, explode, name, value) {
    const rx = RegExp('^;' + name + '(?:=|$)');
    if (type === 'array') {
        if (explode) {
            const result = arrayExploded(';', '=', name, value.substr(1));
            return result ? { match: true, value: result } : { match: false };
        } else {
            return { match: true, value: value.substr(name.length + 2).split(',') };
        }
    } else if (type === 'object') {
        if (!explode && !rx.test(value)) return { match: false };
        const parsed = explode
            ? objectExploded(';', '=', value)
            : objectFlattened(',', value.substr(name.length + 2));
        return parsed ? { match: true, value: parsed } : { match: false };

    } else if (rx.test(value)) {
        return { match: true, value: value.substr(name.length + 2) };

    } else {
        return { match: false };
    }
};

exports.simple = function(type, explode, value) {
    if (type === 'array') {
        return { match: true, value: value.split(',') };

    } else if (type === 'object') {
        const parsed = explode
            ? objectExploded(',', '=', ',' + value)
            : objectFlattened(',', value);
        return parsed ? { match: true, value: parsed } : { match: false };

    } else {
        return { match: true, value: value || '' };
    }
};

exports.spaceDelimited = function(type, value) {
    return delimited(type, ' ', value);
};

exports.pipeDelimited = function(type, value) {
    return delimited(type, '|', value);
};

exports.deepObject = function(name, value) {
    const rx = RegExp('(?:^|&)' + name + '\\[([^\\]]+)\\]=([^&]+)', 'g');
    const result = {};
    let match;
    let hasValue = false;
    while (match = rx.exec(value)) {
        hasValue = true;
        result[match[1]] = match[2];
    }
    return hasValue ? { match: true, value: result } : { match: false };
};


function arrayExploded(setDelimiter, valueDelimiter, name, value) {
    const ar = value.split(setDelimiter);
    const length = ar.length;
    const result = [];
    for (let i = 0; i < length; i++) {
        const set = ar[i].split(valueDelimiter);
        if (set[0] === name) {
            result.push(set[1]);
        } else {
            return false;
        }
    }
    return result;
}

function delimited(type, delimiter, value) {
    if (type === 'array') {
        return { match: true, value: value.split(delimiter) };

    } else if (type === 'object') {
        const parsed = objectFlattened(delimiter, value);
        return parsed ? { match: true, value: parsed } : { match: false };

    } else {
        return { match: false };
    }
}

function objectExploded(setDelimiter, valueDelimiter, value) {
    const str = 's([^v]+)v([^s]+)?';
    const rx = RegExp(str.replace(/v/g, valueDelimiter).replace(/s/g, setDelimiter), 'g');
    const result = {};
    let match;
    let offset = 0;
    while (match = rx.exec(value)) {
        result[match[1]] = match[2] || '';
        offset = match.index + match[0].length;
    }
    if (offset !== value.length) return false;
    return result;
}

function objectFlattened(delimiter, value) {
    const result = {};
    const ar = value.split(delimiter);
    const length = ar.length;

    if (length % 2 !== 0) return false;
    for (let i = 1; i < length; i += 2) {
        result[ar[i - 1]] = ar[i];
    }
    return result;
}