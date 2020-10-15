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

exports.binary =    /^(?:[01]{8})+$/;
exports.boolean =   /^(?:true|false)$/;
exports.byte =      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
exports.date =      /^(\d{4})-(\d{2})-(\d{2})$/;
exports.dateTime =  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|([+-]\d{2}:?\d{2}))$/i;
exports.integer =   /^-?\d+$/;
exports.number =    /^-?\d+(?:\.\d+)?$/;

exports['date-time'] = exports.dateTime;
