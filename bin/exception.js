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

function OpenAPIException(header, meta) {
    const children = [];
    let cached = false;
    let hasException;

    function exception(message) {
        children.push(message);
        cached = false;
    }

    exception.header = header;
    exception.meta = meta;

    exception.nest = function(header, meta) {
        const exception = OpenAPIException(header, meta);
        children.push(exception);
        cached = false;
        return exception;
    };

    exception.toString = function(prefix) {
        if (!this.hasException) return '';
        if (!prefix) prefix = '';
        let result = header + ':';
        children.forEach(child => {
            if (typeof child === 'string') {
                result += '\n  ' + prefix + child;
            } else if (child.hasException) {
                result += '\n  ' + prefix + child.toString(prefix + '  ');
            }
        });
        return result;
    };

    Object.defineProperty(exception, 'hasException', {
        get: () => {
            if (!cached) {
                cached = true;
                hasException = false;
                const length = children.length;
                for (let i = 0; i < length; i++) {
                    if (typeof children[i] === 'string' || children[i].hasException) {
                        hasException = true;
                        break;
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