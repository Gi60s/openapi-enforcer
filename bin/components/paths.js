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
const Path      = require('./path');
const util      = require('../util');

const store = new WeakMap();
const rxPathParam = /{([^}]+)}/;

module.exports = Paths;

function Paths(version, enforcer, exception, definition, map) {

    // if this definition has already been processed then return result
    const existing = map.get(definition);
    if (existing) return existing;
    map.set(definition, this);

    if (!util.isPlainObject(definition)) {
        exception('Must be a plain object');
    } else {
        const pathParsers = {};
        store.set(this, {
            enforcer,
            pathParsers
        });
        Object.keys(definition).forEach(path => {
            const pathLength = path.split('/').length - 1;
            let match;

            // build the path object
            const pathObject = new Path(version, enforcer, exception.at(path), definition[path], map);

            // figure out path parameter names
            const parameterNames = [];
            const rxParamNames = new RegExp(rxPathParam, 'g');
            while (match = rxParamNames.exec(path)) {
                parameterNames.push(match[1]);
            }

            // build search regular expression
            const rxFind = /{([^}]+)}/g;
            let rxStr = '';
            let offset = 0;
            while (match = rxFind.exec(path)) {
                rxStr += path.substring(offset, match.index) + '([\\s\\S]+?)';
                offset = match.index + match[0].length;
            }
            rxStr += path.substr(offset);
            const rx = new RegExp('^' + rxStr + '$');

            // define parser function
            const parser = path => {

                // check if this path is a match
                const match = rx.exec(path);
                if (!match) return undefined;

                // get path parameter strings
                const pathParams = {};
                parameterNames.forEach((name, index) => pathParams[name] = match[index + 1]);

                return {
                    params: pathParams,
                    path: pathObject
                };
            };

            if (!pathParsers[pathLength]) pathParsers[pathLength] = [];
            pathParsers[pathLength].push(parser);
        });
    }
}

/**
 * Find the Path object for the provided path.
 * @param {string} path
 * @returns {{ params: object, path: Path }|undefined}
 */
Paths.prototype.findMatch = function(path) {
    // normalize the path
    path = util.edgeSlashes(path.split('?')[0], true, false);

    // get all parsers that fit the path length
    const pathLength = path.split('/').length - 1;
    const parsers = store.get(this)[pathLength];

    // if the parser was not found then they have a bad path
    if (!parsers) return;

    // find the right parser and run it
    const length = parsers.length;
    for (let i = 0; i < length; i++) {
        const parser = parsers[i];
        const results = parser(path);
        if (results) return results;
    }
};