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

const store = new WeakMap();

module.exports = EnforcerResult;

function EnforcerResult(exception, value) {
    if (!exception || !exception.hasException) exception = undefined;
    if (exception) value = undefined;

    this.error = exception;
    this.value = value;

    store.set(this, { remaining: 2 });
}

EnforcerResult.prototype[Symbol.iterator] = function() {
    return this;
};

EnforcerResult.prototype.next = function() {
    const data = store.get(this);
    if (data.remaining === 0) {
        return { done: false };
    } else {
        data.remaining--;
        return data.remaining === 1
            ? { done: false, value: this.error }
            : { done: false, value: this.value }
    }
};