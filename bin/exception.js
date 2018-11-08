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
 * Create an OpenAPIException instance
 * @param header
 * @returns {OpenAPIException}
 * @constructor
 */
function OpenAPIException (header) {
    if (!(this instanceof OpenAPIException)) return new OpenAPIException(header);

    this.header = header;
    this.cache = undefined;
    this.children = {
        at: {},
        nest: [],
        message: []
    };
    this.inspect = function () {
        if (this.hasException) {
            return '[ OpenAPIException: ' + toString(this, null, '  ') + ' ]';
        } else {
            return '[ OpenAPIException ]';
        }
    };
}

OpenAPIException.prototype.at = function (key) {
    const at = this.children.at;
    if (!at[key]) {
        at[key] = new OpenAPIException('');
        this.cache = undefined;
    }
    return at[key];
};

OpenAPIException.prototype.nest = function (header) {
    const exception = new OpenAPIException(header);
    this.children.nest.push(exception);
    this.cache = undefined;
    return exception;
};

OpenAPIException.prototype.message = function (message) {
    this.children.message.push(message);
    this.cache = undefined;
    return this;
};

OpenAPIException.prototype.push = function (value) {
    const type = typeof value;
    if (type === 'string' && value.length) {
        this.children.message.push(value);
        this.cache = undefined;
    } else if (type === 'object' && value instanceof OpenAPIException) {
        this.children.nest.push(value);
        this.cache = undefined;
    } else {
        throw Error('Can only push string or OpenAPIException instance');
    }
    return this;
};

OpenAPIException.prototype.toString = function () {
    return toString(this, null, '');
};

Object.defineProperties(OpenAPIException.prototype, {
    count: {
        get: function () {
            if (!this.cache) this.cache = {};
            if (!this.cache.count) {
                const children = this.children;
                this.cache.count = children.message.length +
                    children.nest.reduce((count, exception) => count + exception.count, 0) +
                    Object.keys(children.at).reduce((count, key) => count + children.at[key].count, 0);
            }
            return this.cache.count;
        }
    },

    hasException: {
        get: function () {
            if (!this.cache) this.cache = {};

            const cache = this.cache;
            if (!cache.hasOwnProperty('hasException')) {
                const children = this.children;

                // if this has messages then an exception exists
                cache.hasException = false;
                if (children.message.length) {
                    cache.hasException = true;

                } else {
                    // if nested objects have exception then exception exists
                    const nest = children.nest;
                    const length = nest.length;
                    for (let i = 0; i < length; i++) {
                        if (nest[i].hasException) {
                            cache.hasException = true;
                            break;
                        }
                    }

                    // if nested ats have exception then exception exists
                    if (!cache.hasException) {
                        const keys = Object.keys(children.at);
                        const length = keys.length;
                        for (let i = 0; i < length; i++) {
                            if (children.at[keys[i]].hasException) {
                                cache.hasException = true;
                                break;
                            }
                        }
                    }
                }
            }

            return cache.hasException;
        }
    }
});

function toString (context, parent, prefix) {
    if (!context.hasException) return '';

    const prefixPlus = prefix + '  ';
    const children = context.children;
    let result = '';

    if (context.header) result += (parent ? prefix : '') + context.header;

    const at = children.at;
    const atKeys = Object.keys(at).filter(key => at[key].hasException);
    const singleAtKey = atKeys.length === 1;
    atKeys.forEach(key => {
        const exception = children.at[key];
        if (context.header || !singleAtKey || children.nest.length > 0 || children.message.length > 0) {
            result += '\n' + prefixPlus + 'at: ' + key + toString(exception, context, prefixPlus)
        } else {
            result += ' > ' + key + toString(exception, context, prefix)
        }
    });

    children.nest.forEach(exception => {
        if (exception.hasException) result += '\n' + toString(exception, context, prefixPlus);
    });

    children.message.forEach(message => {
        result += '\n' + prefixPlus + message;
    });

    return result;
}