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

module.exports = Message;

function Message(content) {
    this.content = content;
    this.children = [];
}

Message.prototype.nest = function(header) {
    const message = new Message(header);
    this.children.push(message);
    return message;
};

Message.prototype.push = function(message) {
    this.children.push(message);
};

Message.prototype.flatten = function() {
    return flatten([], '', this);
};

Message.prototype.toString = function() {
    return Message.hasChildren(this)
        ? toString('', this)
        : '';
};


Message.hasChildren = function(exception) {
    const children = exception.children;
    const length = children.length;
    for (let i = 0; i < length; i++) {
        if (typeof children[i] === 'string') return true;
        if (Message.hasChildren(children[i])) return true;
    }
    return false;
};


function flatten(errors, prefix, exception) {
    if (!Message.hasChildren(exception)) return errors;

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
        } else if (Message.hasChildren(child)) {
            result += '\n  ' + prefix + toString(prefix + '  ', child);
        }
    });
    return result;
}