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

const rxNumber = /^(\d+)(\.\d+)?$/;

module.exports = {
    number
};

function number (exception, min, max, { decimalPlaces, multipleOf }) {
    if (!isNaN(multipleOf)) {
        min = Math.ceil(min / multipleOf);
        max = Math.floor(max / multipleOf);
        const index = Math.round(Math.random() * (max - min) / multipleOf);
        return index * multipleOf;
    } else {
        let value = '' + Math.random() * (max - min);

        if (!isNaN(decimalPlaces)) {
            if (decimalPlaces < 0) decimalPlaces = 0;
            const match = rxNumber.exec(value);
            const num = match[0];
            const dec = (match[1] ? match[1].substr(1) : '0') + '0';
            const lost = +dec[decimalPlaces + 1];
            const keep = lost < 5
                ? dec.substr(0, decimalPlaces)
                : dec.substr(0, decimalPlaces - 1) + (+(dec[decimalPlaces]) + 1);
            value = +(num + 'asdf')
        }

        return Number(value);
    }
};