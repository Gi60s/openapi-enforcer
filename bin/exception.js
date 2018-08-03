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

function OpenAPIException(header, isHeader) {
    const positionals = [];
    const headers = [];
    const messages = [];
    let cached = false;
    let hasException;

    function exception(message) {
        return exception.message(message);
    }

    exception.header = header;
    exception.isHeader = arguments.length === 2 ? isHeader : true;

    exception.at = function(at) {
        const exception = OpenAPIException(at, false);
        positionals.push(exception);
        cached = false;
        return exception;
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
        cached = false;
        return exception;
    };

    exception.message = function(message) {
        if (!message) {
            return;
        } else if (typeof message === 'string') {
            messages.push(message);
        } else if (message.isHeader) {
            headers.push(message);
        } else {
            positionals.push(message);
        }
        cached = false;
        return exception;
    };

    exception.nest = function(header) {
        const exception = OpenAPIException(header, true);
        headers.push(exception);
        cached = false;
        return exception;
    };

    exception.toString = function() {
        if (!this.hasException) return '';
        let { prefix, positional, top } = arguments.length === 0 ? { prefix: '', positional: -1, top: true } : arguments[0];

        let result = '';
        if (!top && positional < 1) result += '\n';
        if (positional <= 0) result += prefix;
        if (positional === 0) result += 'at: /';
        if (positional > 0) result += '/';
        result += this.header;

        positionals.forEach(pos => {
            result += pos.toString({ positional: positional + 1, prefix: prefix + '  '});
        });

        headers.forEach(header => {
            result += header.toString({ positional: -1, prefix: prefix + '  ' });
        });

        messages.forEach(message => {
            result += '\n  ' + prefix + message;
        });

        return result;
    };

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