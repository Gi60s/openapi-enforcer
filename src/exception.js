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
const util = require('util');

let inspect = util.inspect.custom || 'inspect';

module.exports = EnforcerException;

/**
 * Create an EnforcerException instance
 * @param {string} [header]
 * @returns {EnforcerException}
 * @constructor
 */
function EnforcerException (header) {
    if (!(this instanceof EnforcerException)) return new EnforcerException(header);
    this.header = header;
    this.children = {
        at: {},
        nest: [],
        message: []
    };
}

EnforcerException.prototype.at = function (key) {
    const at = this.children.at;
    if (!at[key]) {
        at[key] = new EnforcerException('');
    }
    return at[key];
};

EnforcerException.prototype.clearCache = function () {
    return this;
};

EnforcerException.prototype[inspect] = function () {
    if (this.hasException) {
        return '[ EnforcerException: ' + toString(this, null, '  ') + ' ]';
    } else {
        return '[ EnforcerException ]';
    }
};

EnforcerException.prototype.nest = function (header) {
    const exception = new EnforcerException(header);
    this.children.nest.push(exception);
    return exception;
};

EnforcerException.prototype.merge = function (exception) {
    const thisChildren = this.children;
    const thatChildren = exception.children;
    const at = thisChildren.at;
    let addedMessage = false;

    Object.keys(thatChildren.at).forEach(key => {
        if (!at[key]) {
            at[key] = thatChildren.at[key];
        } else {
            at[key].merge(thatChildren.at[key]);
        }
    });

    thatChildren.nest.forEach(exception => {
        thisChildren.nest.push(exception);
    });
    thatChildren.message.forEach(message => {
        thisChildren.message.push(message);
        addedMessage = true;
    });

    return this;
};

EnforcerException.prototype.message = function (message) {
    this.children.message.push(message);
    return this;
};

EnforcerException.prototype.push = function (value) {
    const type = typeof value;
    if (type === 'string' && value.length) {
        this.children.message.push(value);
    } else if (type === 'object' && value instanceof EnforcerException) {
        this.children.nest.push(value);
    } else {
        throw Error('Can only push string or EnforcerException instance');
    }
    return this;
};

EnforcerException.prototype.toString = function () {
    return toString(this, null, '');
};

Object.defineProperties(EnforcerException.prototype, {
    count: {
        get: function () {
            const children = this.children;
            return children.message.length +
                children.nest.reduce((count, exception) => count + exception.count, 0) +
                Object.keys(children.at).reduce((count, key) => count + children.at[key].count, 0);
        }
    },

    hasException: {
        get: function () {
            const children = this.children;

            if (children.message.length) {
                return true

            } else {
                // if nested objects have exception then exception exists
                const nest = children.nest;
                const length = nest.length;
                for (let i = 0; i < length; i++) {
                    if (nest[i].hasException) {
                        return true
                    }
                }

                const keys = Object.keys(children.at);
                const length2 = keys.length;
                for (let i = 0; i < length2; i++) {
                    if (children.at[keys[i]].hasException) {
                        return true
                    }
                }
            }
            return false
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
