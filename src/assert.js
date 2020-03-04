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
/**
 * This file is intended to help with tests and requires that dev dependencies be installed fot it to work.
 */
const expect    = require('chai').expect;

exports.deepEqual = function(v1, v2) {
    if (v1 && typeof v1 === 'object' && typeof v1.toObject === 'function') v1 = v1.toObject();
    if (v2 && typeof v2 === 'object' && typeof v2.toObject === 'function') v2 = v2.toObject();
    expect(v1).to.deep.equal(v2);
};

exports.willReject = async function(callback, error) {
    return callback()
        .then(
            () => { throw Error('Expected a rejection'); },
            err => {
                // console.error(err.stack);
                expect(err.toString()).to.match(error)
            }
        )
};

exports.wontReject = function(callback, error) {
    return callback()
        .catch(
            err => {
                if (!error) {
                    throw new Error('Expected no rejection')
                } else {
                    expect(err.toString()).to.not.match(error)
                }
            }
        )
};
