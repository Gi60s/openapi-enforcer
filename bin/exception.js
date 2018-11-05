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

module.exports = OpenAPIException;

/**
 * @typedef {function} Exception
 * @property {string} header
 * @property {boolean} isHeader
 * @property {function} at
 * @property {function} first
 * @property {function} message
 * @property {function} nest
 * @property {function} toString
 * @property {boolean} hasException
 */

/**
 * @param {string} header
 * @param {boolean} [isHeader]
 * @param {Exception} [parent]
 * @returns {Exception}
 */
function OpenAPIException(header, isHeader, parent) {
    const positionals = [];
    const headers = [];
    const messages = [];
    const atMap = {};
    let cached = false;
    let cachedCount;
    let hasException;

    function exception(message) {
        return exception.message(message);
    }
    const self = exception;

    exception.header = header;
    exception.isHeader = arguments.length === 2 ? isHeader : true;
    exception.parent = parent;

    exception.at = function(at) {
        let exception = atMap[at];
        if (!exception) {
            exception = OpenAPIException(at, false, self);
            atMap[at] = exception;
            positionals.push(exception);
        }
        exception.clearCache();
        return exception;
    };

    exception.clearCache = function() {
        cached = false;
        cachedCount = undefined;
        if (exception.parent) exception.parent.clearCache();
    };

    exception.first = function(message) {
        if (!message) {
            return;
        } else if (typeof message === 'string') {
            messages.unshift(message);
        } else if (message.isHeader) {
            headers.unshift(message);
        } else {
            positionals.unshift(message);
        }
        exception.clearCache();
        return exception;
    };

    exception.message = function(message) {
        if (!message) {
            return;
        } else if (typeof message === 'string') {
            messages.push(message);
        } else if (message.isHeader) {
            message.parent = self;
            headers.push(message);
        } else {
            positionals.push(message);
        }
        exception.clearCache();
        return exception;
    };

    exception.nest = function(header) {
        const exception = OpenAPIException(header, true, self);
        headers.push(exception);
        exception.clearCache();
        return exception;
    };

    exception.toError = function() {
        if (!this.hasException) return null;
        return Error(exception.toString());
    };

    exception.toString = function() {
        if (!this.hasException) return '';
        let { prefix, positional, top } = arguments.length === 0 ? { prefix: '', positional: -1, top: true } : arguments[0];

        let result = '';
        if (!top && positional < 1) result += '\n';
        if (positional <= 0) result += prefix;
        if (positional === 0) result += 'at: ';
        if (positional > 0) result += ' > ';
        result += this.header;

        positionals.forEach(pos => {
            if (messages.length || exceptionInArray(headers)) positional = -1;
            result += pos.toString({ positional: positional + 1, prefix: prefix + (positional < 0 ? '  ' : '') });
        });

        headers.forEach(header => {
            result += header.toString({ positional: -1, prefix: prefix + '  ' });
        });

        messages.forEach(message => {
            result += '\n  ' + prefix + message;
        });

        return result;
    };

    Object.defineProperty(exception, 'count', {
        get: () => {
            if (cachedCount === undefined) {
                cachedCount = messages.length +
                    positionals.reduce((p, c) => p + c.count, 0) +
                    headers.reduce((p, c) => p + c.count, 0)
            }
            return cachedCount;
        }
    });

    Object.defineProperty(exception, 'hasException', {
        get: () => {
            if (!cached) {
                cached = true;
                hasException = false;
                if (messages.length > 0) {
                    hasException = true;
                } else {
                    let length = positionals.length;
                    for (let i = 0; i < length; i++) {
                        if (positionals[i].hasException) {
                            hasException = true;
                            break;
                        }
                    }

                    length = headers.length;
                    for (let i = 0; i < length; i++) {
                        if (headers[i].hasException) {
                            hasException = true;
                            break;
                        }
                    }
                }
            }
            return hasException;
        }
    });

    Object.defineProperty(exception, 'isOpenAPIException', {
        value: true,
        writable: false,
        configurable: false
    });

    return exception;
}

function exceptionInArray(exceptions) {
    const length = exceptions.length;
    for (let i = 0; i < length; i++) {
        if (exceptions[i].hasException) return true;
    }
    return false;
}