/**
 *  @license
 *    Copyright 2019 Brigham Young University
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

const axios     = require('axios').default;
const Exception = require('./exception');
const fs        = require('fs');
const path      = require('path');
const Result    = require('./result');
const url       = require('url');
const util      = require('./util');
const yaml      = require('js-yaml');

const rxHttp = /^https?:\/\//i;
const rxYaml = /\.ya?ml$/i;
const rxJson = /\.json$/i;

module.exports = RefParser;

/**
 * @typedef ParserData
 * @property {EnforcerException} exception The exception object at the current node.
 * @property {string|number|undefined} key The key of the parent that arrived to this node.
 * @property {object} loads A map of HTTP or file paths that have been loaded.
 * @property {ParserData} parent The parent parse data object.
 * @property {object} refs A map of file paths to their results.
 */

/**
 * Dereference a source.
 * @param {string|object} source
 * @returns {Promise<EnforcerResult>}
 */

const map = new WeakMap();

function RefParser (source) {
    this.$refs = {};
    map.set(this, {
        bundled: null,
        dereferenced: null,     // will hold dereference() returned EnforcerResult
        loads: {},              // a map of loaded resources
        refs: this.$refs,
        sourceMap: { '': [] },  // a map of source paths to nodes within the source
        source
    });
}

RefParser.prototype.dereference = async function () {
    const that = map.get(this);
    if (that.dereferenced) return that.dereferenced;

    const exception = new Exception('Unable to dereference definition for one or more reasons');
    const { source } = that;

    const basePath = typeof source === 'string'
        ? path.dirname(source)
        : process.cwd();

    if (typeof source === 'string') {
        const loaded = await load(basePath, source, exception, that);
        that.refs.root = await parse(path.dirname(loaded.path), loaded.path, loaded.value, loaded.value, that, new Map(), [], exception.at(loaded.path));
    } else {
        const copy = util.copy(source);
        that.refs.root = await parse(basePath, '', copy, copy, that, new Map(), [], exception.at('root object'));
    }

    that.dereferenced = new Result(this.$refs.root, exception);
    return that.dereferenced;
};

RefParser.prototype.getSourcePath = function (node) {
    const that = map.get(this);
    if (!that.dereferenced) throw Error('You must first call the dereference function before looking up node source paths.');
    if (that.dereferenced.error) throw Error('Cannot get source path for a node when dereference has failed.');

    const sourceMap = that.sourceMap;
    const keys = Object.keys(sourceMap);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (sourceMap[key].includes(node)) return key;
    }
};

function defer () {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}

async function parse (basePath, fullPath, source, value, that, map, chain, exception) {
    // console.log('Parse:\n  B: ' + basePath + '\n  S: ' + Object.keys(source));
    if (Array.isArray(value)) {
        const existing = map.has(value);
        if (existing) return existing;
        map.set(value, value);
        that.sourceMap[fullPath].push(value);

        const promises = value.map(async (item, index) => {
            value[index] = await parse(basePath, fullPath, source, item, that, map, chain, exception.at(String(index)));
        });
        await Promise.all(promises);
        return value;

    } else if (typeof value === 'object') {
        if (value.hasOwnProperty('$ref')) {
            const infiniteLoop = chain.includes(value);
            if (infiniteLoop) {
                exception.message('Unresolvable infinite loop');
                return;
            }

            const [, internalPath] = value.$ref.split('#');
            let newBasePath = basePath;
            let newFullPath = fullPath;
            let newSource = source;
            let result;

            if (value.$ref.startsWith('#/')) {
                result = traverse(source, internalPath, exception);
            } else {
                const loaded = await load(basePath, value.$ref, exception, that);
                const childException = exception.at(loaded.path);
                newFullPath = loaded.path;
                newBasePath = path.dirname(newFullPath);
                newSource = await parse(newBasePath, newFullPath, loaded.value, loaded.value, that, map, chain, childException);
                that.refs[loaded.path] = newSource;
                result = newSource
                    ? traverse(newSource, internalPath, childException)
                    : undefined;
            }

            return parse(newBasePath, newFullPath, newSource, result, that, map, chain.concat([ value ]), exception);

        } else {
            const existing = map.get(value);
            if (existing) return existing;
            map.set(value, value);

            that.sourceMap[fullPath].push(value);
            const promises = Object.keys(value).map(async key => {
                value[key] = await parse(basePath, fullPath, source, value[key], that, map, chain, exception.at(key));
            });
            await Promise.all(promises);
            return value;
        }

    } else {
        return value;
    }
}

/**
 * Load a file or URL and parse to object.
 * @param {string} basePath
 * @param {string} ref
 * @param {EnforcerException} exception
 * @param {object} that
 * @returns {Promise<{path: string, value: *}|undefined>}
 */
async function load (basePath, ref, exception, that) {
    const { loads, sourceMap } = that;

    // determine the load path and method
    const { loadPath, loadMethod } = resolvePath(basePath, ref);
    // console.log('load:\n  B: ' + basePath + '\n  R: ' + ref + '\n  L: ' + loadPath);

    // if already loaded or loading then return that promise
    if (loads[loadPath]) return loads[loadPath];

    // store deferred promise
    const deferred = defer();
    loads[loadPath] = deferred.promise;

    // load content
    const value = await loadMethod(loadPath, exception.at(loadPath));
    sourceMap[loadPath] = [];
    deferred.resolve({
        path: loadPath,
        value
    });

    return deferred.promise;
}

/**
 * Load a URL.
 * @param {string} url
 * @param {EnforcerException} exception
 * @returns {Promise<*|undefined>}
 */
function httpLoad (url, exception) {
    const transformResponse = [res => res]; // stop response body from being parsed
    return axios.get(url, { transformResponse })
        .then(res => {
            const contentType = res.headers['content-type'];
            if (res.status < 200 || res.status >= 300) {
                exception.message('Unable to load resource due to unexpected response status code ' + res.status + ' for URL: ' + url );
            } else {
                let type;
                if (/^application\/json/.test(contentType)) type = 'json';
                if (/^(?:text|application)\/(?:x-)?yaml/.test(contentType)) type = 'yaml';

                const result = parseString(res.data, type, exception.nest('Unable to parse resource: ' + url));
                res.data = result.value;
            }
            return res.data
        })
        .catch(err => {
            exception.message('Unexpected error: ' + err.message);
        });
}

/**
 * Load a file.
 * @param {string} filePath
 * @param {EnforcerException} exception
 * @returns {Promise<{ type: string, value: object }|undefined>}
 */
function fileLoad (filePath, exception) {
    return new Promise((resolve) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err && (err.code === "ENOENT" || err.code === 'ENOTDIR')) {
                exception.message('Unable to find referenced file: ' + filePath);
                resolve();
            } else if (err) {
                exception.message('Unable to read file "' + filePath + '": ' + err.toString());
                resolve();
            } else {
                let type;
                if (rxJson.test(filePath)) type = 'json';
                if (rxYaml.test(filePath)) type = 'yaml';

                const result = parseString(data, type, exception.nest('Unable to parse file: ' + filePath));
                resolve(result.value);
            }
        })
    })
}

function parseString (content, type, exception) {
    let value;
    if (type === 'json') {
        try {
            value = JSON.parse(content);
        } catch (err) {
            exception.message(err.toString());
        }
    } else if (type === 'yaml') {
        try {
            value = yaml.safeLoad(content);
        } catch (err) {
            exception.message(err.toString());
        }
    } else {
        try {
            value = JSON.parse(content);
            type = 'json';
        } catch (err) {
            try {
                value = yaml.safeLoad(content);
                type = 'yaml';
            } catch (err) {
                exception.message('Not valid JSON or YAML');
            }
        }
    }
    return {
        type,
        value
    }
}

function pendingRefListener (refObj) {

}

function pendingRefUpdate (refObj, replacementObj) {

}

function resolvePath (basePath, ref) {
    const [refPath] = ref.split('#');
    if (rxHttp.test(basePath) || rxHttp.test(ref)) {
        return {
            loadPath: url.resolve(basePath, refPath),
            loadMethod: httpLoad
        };
    } else {
        return {
            loadPath: path.resolve(basePath, refPath),
            loadMethod: fileLoad
        };
    }
}

function traverse (obj, path, exception) {
    if (!path) return obj;

    if (!path.startsWith('/')) {
        exception.message('References must start with #/');
        return;
    }

    const keys = path.substring(1).split('/');
    let o = obj;
    while (keys.length) {
        const key = keys.shift();
        if (key !== '#') {
            if (o && typeof o === 'object' && key in o) {
                o = o[key];
            } else {
                exception.message('Cannot resolve reference: #' + path);
                return;
            }
        }
    }
    return o;
}
