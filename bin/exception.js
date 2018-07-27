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




const prototype = {
    nest: function(header, meta) {
        const exception = new OpenAPIException(header, meta);
        this.children.push(exception);
        return exception;
    },

    push: function(message) {
        if (this.hasOwnProperty('hasException')) delete this.hasException;
        this.children.push(message);
    },

    flatten: function() {
        return flatten([], '', this);
    },

    toString: function() {
        return OpenAPIException.hasException(this)
            ? toString('', this)
            : '';
    }
};

function OpenAPIException(header, meta) {
    const exception = message => exception.push(message);
    Object.assign(exception, prototype, { header: header, children: [], meta: meta });
    Object.defineProperty(exception, 'hasException', {
        get: () => OpenAPIException.hasException(exception)
    });
    Object.defineProperty(exception, 'isOpenAPIException', {
        value: true,
        writable: false,
        configurable: false
    });
    return exception;
}

OpenAPIException.hasException = function(exception, ignoreCache) {
    if (ignoreCache || !exception.hasOwnProperty('hasException')) {
        exception.hasException = false;
        const children = exception.children;
        const length = children.length;
        for (let i = 0; i < length; i++) {
            if (typeof children[i] === 'string' || OpenAPIException.hasException(children[i])) {
                exception.hasException = true;
                break;
            }
        }
    }
    return exception.hasException;
};


function flatten(errors, prefix, exception) {
    if (!OpenAPIException.hasException(exception)) return errors;

    exception.children.forEach(child => {
        if (typeof child === 'string') {
            errors.push(prefix + exception.header + ': ' + child);
        } else {
            flatten(errors, prefix + exception.header + ': ', child);
        }
    });
    return errors;
}

function toString(prefix, exception) {
    let result = exception.header + ':';
    exception.children.forEach(child => {
        if (typeof child === 'string') {
            result += '\n  ' + prefix + child;
        } else if (OpenAPIException.hasException(child)) {
            result += '\n  ' + prefix + toString(prefix + '  ', child);
        }
    });
    return result;
}