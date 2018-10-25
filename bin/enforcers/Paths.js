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
const ComponentRef  = require('../component-ref');
const util          = require('../util');

const rxPathParam = /{([^}]+)}/;

module.exports = {
    init: function (data) {
        const pathParsers = {};
        const pathEquivalencies = {};
        Object.keys(definition).forEach(pathKey => {
            const path = definition[pathKey];
            const pathLength = pathKey.split('/').length - 1;

            // figure out path parameter names from the path key
            const parameterNames = [];
            const rxParamNames = new RegExp(rxPathParam, 'g');
            let match;
            while (match = rxParamNames.exec(pathKey)) {
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
                if (pathParametersMissing.length) child('Path missing defined parameters: ' + pathParametersMissing.join(', '));

                const stringCount = parameterNames.length;
                const definitionParametersMissing = [];
                for (let i = 0; i < stringCount; i++) {
                    const name = parameterNames[i];
                    if (!definitionParameters.includes(name)) definitionParametersMissing.push(name);
                }
                if (definitionParametersMissing.length) child('Definition missing path parameters: ' + definitionParametersMissing.join(', '));
            });

            // build search regular expression
            const rxFind = /{([^}]+)}/g;
            let subStr;
            let rxStr = '';
            let offset = 0;
            let equivalencyKey = '';
            while (match = rxFind.exec(pathKey)) {
                subStr = pathKey.substring(offset, match.index);
                equivalencyKey += '0'.repeat(subStr.split('/').length) + '1';
                rxStr += escapeRegExp(subStr) + '([\\s\\S]+?)';
                offset = match.index + match[0].length;
            }
            subStr = pathKey.substr(offset);
            if (subStr) equivalencyKey += '0'.repeat(subStr.split('/').length);
            rxStr += escapeRegExp(subStr);
            const rx = new RegExp('^' + rxStr + '$');

            // store equivalency information
            if (!pathEquivalencies[equivalencyKey]) pathEquivalencies[equivalencyKey] = [];
            pathEquivalencies[equivalencyKey].push(pathKey);

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
                    path
                };
            };

            if (!pathParsers[pathLength]) pathParsers[pathLength] = [];
            pathParsers[pathLength].push(parser);
        });

        const equivalencyException = exception.nest('Equivalent paths are not allowed');
        Object.keys(pathEquivalencies).forEach(key => {
            const array = pathEquivalencies[key];
            if (array.length > 1) {
                const conflicts = equivalencyException.nest('Equivalent paths:');
                array.forEach(conflicts);
            }
        });

        this.enforcerData.pathParsers = pathParsers;
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
            pathString = util.edgeSlashes(pathString.split('?')[0], true, false);

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
        return {
            required: true,
            type: 'object',
            additionalProperties: ComponentRef('Path'),
            errors: ({ exception, value }) => {
                Object.keys(value).forEach(key => {
                    if (key[0] !== '/' || key[1] === '/') {
                        exception.at(key)('Path must begin with a single forward slash')
                    }
                })
            }
        }
    }
};


function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}