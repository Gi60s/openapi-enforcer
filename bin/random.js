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

exports.binary = function(schema) {

};

exports.boolean = function(schema) {
    const choices = [false, true];
    if (schema.default) choices.push(schema.default);
    return randomChoice(choices);
};

exports.byte = function(schema) {

};

exports.date = function(schema) {
    const d = exports.dateTime(schema);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

exports.dateTime = function(schema) {
    const value = randomMinMax(Date.now(), { max: schema.maximum, min: schema.minimum });
    return new Date(value);
};
exports['date-time'] = exports.dateTime;

exports.integer = function(schema) {

};

exports.number = function(schema) {

};

function randomChoice(choices, weight) {
    if (arguments.length < 2) weight = .5;
    const index = Math.floor(Math.random() * choices.length * (1 - weight));
    return choices[index];
}

function randomMinMax(mult, bound) {
    const hasMin = !isNaN(bound.min);
    const hasMax = !isNaN(bound.max);
    let min;
    let max;

    if (hasMin && hasMax) {
        min = bound.min;
        max = bound.max;
    } else if (hasMax) {
        max = bound.max;
        min = max - Math.round(mult * Math.random());
    } else if (hasMin) {
        min = bound.min;
        max = min + Math.round(mult * Math.random());
    } else {
        min = Math.round(mult * Math.random());
        max = Math.round(mult * Math.random());
        if (max > min) {
            const temp = min;
            min = max;
            max = temp;
        }
    }

    const diff = max - min;
    return min + Math.round(Math.random() * diff);
}
