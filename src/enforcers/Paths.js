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
const EnforcerRef  = require('../enforcer-ref');
const util          = require('../util');

const rxPathParam = /{([^}]+)}/;

module.exports = {
    init: function (data) {
        const { exception, result, plugins } = data;
        const pathParsers = {};
        const pathEquivalencies = {};
        const paramlessMap = {};

        if (!data.options.disablePathNormalization) {
            const keys = Object.keys(result);
            keys.forEach(key => {
                const normalized = util.edgeSlashes(key, true, false);
                if (normalized !== key) {
                    result[normalized] = result[key];
                    delete result[key];
                }
            });
        }

        plugins.push(() => {
            Object.keys(result).forEach((pathKey, index) => {
                const path = result[pathKey];
                const pathLength = pathKey.split('/').length - 1;

                // figure out path parameter names from the path key
                const parameterNames = [];
                const rxParamNames = new RegExp(rxPathParam, 'g');
                let match;
                while ((match = rxParamNames.exec(pathKey))) {
                    parameterNames.push(match[1]);
                }

                // make sure that the parameters found in the path string are all found in the path object parameters and vice versa
                const pathParamDeclarationException = exception.at(pathKey).nest('Path parameter definitions inconsistent');
                path.methods.forEach(method => {
                    const child = pathParamDeclarationException.at(method);
                    const definitionParameters = Object.keys(path[method].parametersMap.path || {});
                    const definitionCount = definitionParameters.length;
                    const pathParametersMissing = [];
                    for (let i = 0; i < definitionCount; i++) {
                        const name = definitionParameters[i];
                        if (!parameterNames.includes(name)) pathParametersMissing.push(name);
                    }
                    if (pathParametersMissing.length) child.message('Path missing defined parameters: ' + pathParametersMissing.join(', '));

                    const stringCount = parameterNames.length;
                    const definitionParametersMissing = [];
                    for (let i = 0; i < stringCount; i++) {
                        const name = parameterNames[i];
                        if (!definitionParameters.includes(name)) definitionParametersMissing.push(name);
                    }
                    if (definitionParametersMissing.length) child.message('Definition missing path parameters: ' + definitionParametersMissing.join(', '));
                });

                // build search regular expression
                const rxFind = /{([^}]+)}/g;
                let subStr;
                let paramlessStr = '';
                let rxStr = '';
                let offset = 0;
                let equivalencyKey = '';
                while ((match = rxFind.exec(pathKey))) {
                    subStr = pathKey.substring(offset, match.index);
                    equivalencyKey += '0'.repeat(subStr.split('/').length) + '1';
                    paramlessStr += subStr + '{}';
                    rxStr += escapeRegExp(subStr) + '([\\s\\S]+?)';
                    offset = match.index + match[0].length;
                }
                subStr = pathKey.substr(offset);
                if (subStr) {
                    equivalencyKey += '0'.repeat(subStr.split('/').length) + '0';
                    rxStr += escapeRegExp(subStr);
                    paramlessStr += subStr;
                }

                path.methods.forEach(method => {
                    equivalencyKey += method + equivalencyKey;

                    if (!paramlessMap[equivalencyKey]) paramlessMap[equivalencyKey] = [];
                    const paramless = paramlessMap[equivalencyKey];

                    if (!pathEquivalencies[equivalencyKey]) pathEquivalencies[equivalencyKey] = [];
                    if (pathEquivalencies[equivalencyKey].length === 0) pathEquivalencies[equivalencyKey].push(pathKey);
                    if (!paramless.includes(paramlessStr)) {
                        paramless.push(paramlessStr);
                    } else {
                        pathEquivalencies[equivalencyKey].push(pathKey);
                    }
                });

                const rx = new RegExp('^' + rxStr + '$');

                // define parser function
                const parser = pathString => {

                    // check if this path is a match
                    const match = rx.exec(pathString);
                    if (!match) return undefined;

                    // get path parameter strings
                    const pathParams = {};
                    parameterNames.forEach((name, index) => pathParams[name] = match[index + 1]);

                    return {
                        params: pathParams,
                        path,
                        pathKey
                    };
                };

                parser.weight = equivalencyKey + index;

                if (!pathParsers[pathLength]) pathParsers[pathLength] = [];
                pathParsers[pathLength].push(parser);
            });

            const equivalencyException = exception.nest('Equivalent paths are not allowed');
            Object.keys(pathEquivalencies).forEach(key => {
                const array = pathEquivalencies[key];
                if (array.length > 1) {
                    const conflicts = equivalencyException.nest('Equivalent paths:');
                    array.forEach(err => conflicts.push(err));
                }
            });

            Object.keys(pathParsers).forEach(key => {
                pathParsers[key].sort((a, b) => a.weight < b.weight ? -1 : 1);
            });
            this.enforcerData.pathParsers = pathParsers;
        });
    },

    prototype: {
        /**
         * Find the Path object for the provided path.
         * @param {string} pathString
         * @returns {{ params: object, path: Path }|undefined}
         */
        findMatch: function (pathString) {
            const { pathParsers } = this.enforcerData;

            // normalize the path
            pathString = pathString.split('?')[0]; // util.edgeSlashes(pathString.split('?')[0], true, false);

            // get all parsers that fit the path length
            const pathLength = pathString.split('/').length - 1;
            const parsers = pathParsers[pathLength];

            // if the parser was not found then they have a bad path
            if (!parsers) return;

            // find the right parser and run it
            const length = parsers.length;
            for (let i = 0; i < length; i++) {
                const parser = parsers[i];
                const results = parser(pathString);
                if (results) return results;
            }
        }
    },

    validator: function (data) {
        const disablePathNormalization = data.options.disablePathNormalization;
        const skipCodes = data.options.exceptionSkipCodes;
        const escalateCodes = data.options.exceptionEscalateCodes;

        return {
            required: true,
            type: 'object',
            additionalProperties: EnforcerRef('PathItem'),
            errors: ({ exception, definition, warn }) => {
                const normalizeException = exception.nest('These paths are defined more than once exist due to path normalization:');
                const paths = Object.keys(definition);
                const map = {};
                const includesTrailingSlashes = [];
                const omitsTrainingSlashes = [];

                paths.forEach(key => {
                    if (key[0] !== '/' || key[1] === '/') {
                        exception.at(key).message('Path must begin with a single forward slash')
                    }

                    if (!disablePathNormalization) {
                        const normalizedKey = util.edgeSlashes(key, true, false);
                        if (map[normalizedKey]) normalizeException.message(key + ' --> ' + normalizedKey);
                        if (normalizedKey !== key && !skipCodes.WPAS001) {
                            (escalateCodes.WPAS001 ? exception : warn).at(key).message('Path normalized from ' + key + ' to ' + normalizedKey + '. [WPAS001]');
                        }
                        map[key] = normalizedKey;
                    }

                    if (key !== '/') {
                        if (key[key.length - 1] === '/') {
                            includesTrailingSlashes.push(key);
                        } else {
                            omitsTrainingSlashes.push(key);
                        }
                    }
                });

                if (!paths.length && !skipCodes.WPAS002) {
                    (escalateCodes.WPAS002 ? exception : warn).message('No paths defined. [WPAS002]');
                }

                if (includesTrailingSlashes.length > 0 && omitsTrainingSlashes.length > 0) {
                    const child = (escalateCodes.WPAS003 ? exception : warn).nest('Some defined paths end with slashes while some do not. This inconsistency may confuse users of your API.');
                    const clean = child.nest('Paths without trailing slashes:');
                    const trailing = child.nest('Paths with trailing slashes:');
                    omitsTrainingSlashes.forEach(key => {
                        if (!skipCodes.WPAS003) clean.message(key + ' [WPAS003]');
                    });
                    includesTrailingSlashes.forEach(key => {
                        if (!skipCodes.WPAS003) trailing.message(key + ' [WPAS003]')
                    });
                }
            }
        }
    }
};


function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
