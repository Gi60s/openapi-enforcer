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

/*async function dereference (source) {
    const data = {
        exception: new Exception('Unable to dereference definition for one or more reasons'),
        key: undefined,
        loads: Object.create(null),
        map: new WeakMap(),
        parent: null,
        path: typeof source === 'string' ? source : process.cwd(),
        source: source,
        result: null,
        warning: new Exception('One or more warnings encountered while while dereferencing definition')
    };
    data.root = data;

    // if the source is a string the load the content
    if (typeof source === 'string') {
        const [ refPath, ref ] = source.split('#/');
        const obj = await load(refPath, data);
        data.source = obj
            ? traverse(obj, ref, data.exception)
            : null;
    }

    if (data.source) await parse(data);

    if (data.exception.hasException) {
        return Result(null, data.exception, data.warning);
    } else {
        const factory = {

            value: data.result
        };
        return Result(factory, data.exception, data.warning);
    }
}*/

const map = new WeakMap();

function RefParser (source) {
    map.set(this, {
        bundled: null,
        dereferenced: null,
        loads: {},
        source
    });
}

RefParser.prototype.dereference = async function () {
    const that = map.get(this);
    if (that.dereferenced) return that.dereferenced;

    const exception = new Exception('Unable to dereference definition for one or more reasons');
    const { loads, source } = that;

    const basePath = typeof source === 'string'
        ? path.dirname(source)
        : process.cwd();

    const loaded = typeof source === 'string'
        ? await load(basePath, source, exception, loads)
        : {
            exception: exception.nest('Within the source object'),
            value: source
        };

    const value = loaded.exception.hasException
        ? null
        : await parse(loaded, data);

    this.$refs.root = value;
    return Result(value, exception, warning);
};

function childData (data, key, path) {
    return {
        exception: data.exception.at(key),
        key: key,
        path: path || data.path,
        parent: data,
        root: data.root,
        shared: data.shared,
        warning: data.warning.at(key)
    }
}

function defer () {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}

async function parse (obj, data) {
    const { map } = data.shared;

    if (Array.isArray(obj)) {
        const existing = map.get(obj);
        if (existing) return existing;

        const result = [];
        map.set(obj, result);
        const promises = obj.map(async (item, index) => {
            result[index] = await parse(item, childData(data, index));
        });
        await Promise.all(promises);
        return result;

    } else if (typeof obj === 'object') {
        const existing = map.get(obj);
        if (existing) return existing;

        if (obj.hasOwnProperty('$ref')) {
            let loaded;
            console.log('$ref: ' + data.path + ' ' + obj.$ref);
            if (obj.$ref.startsWith('#/')) {
                loaded = await load(data.path, obj.$ref, data.exception, data.shared.refs);
            } else {

            }
            if (loaded) {
                console.log('Loaded: ' + data.path);
                const [, internalPath] = obj.$ref.split('#');
                const value = traverse(loaded.value, internalPath, data.exception.at(loaded.path));
                return parse(value, Object.assign({}, data, { path: loaded.path }))
            }
        } else {
            let result = {};
            map.set(obj, result);
            const promises = Object.keys(obj).map(async key => {
                result[key] = await parse(obj[key], childData(data, key));
            });
            await Promise.all(promises);
            return result;
        }

    } else {
        return obj;
    }
}

/**
 * Load a file or URL and parse to object.
 * @param {string} basePath
 * @param {string} ref
 * @param {ParserData} data
 * @returns {Promise<{path: string, value: *}|undefined>}
 */
async function load (basePath, ref, parentException, loads) {
    // determine the load path and method
    const { loadPath, loadMethod } = resolvePath(basePath, ref);

    // if already loaded or loading then return that promise
    if (loads[loadPath]) return loads[loadPath];

    // store deferred promise
    const deferred = defer();
    loads[loadPath] = deferred.promise;

    // load content
    const exception = parentException.nest('Unable to dereference file: ' + loadPath);
    const value = await loadMethod(loadPath, exception);
    deferred.resolve({ exception, value });

    return deferred.promise;
}

/**
 * Load a URL.
 * @param {string} url
 * @param {EnforcerException} exception
 * @returns {Promise<{ content: string, type: string }|undefined>}
 */
async function httpLoad (url, exception) {
    try {
        const res = await axios.get(url);
        const contentType = res.headers['content-type'];
        if (res.status < 200 || res.status >= 400) {
            exception.message('Unable to load resource: ' + url);
        } else {
            let type;
            if (/^application\/json/.test(contentType)) type = 'json';
            if (/^(?:text|application)\/(?:x-)?yaml/.test(contentType)) type = 'yaml';

            if (type === 'yaml') {

            }

            return {
                content: res.data,
                type: type
            };
        }
    } catch (err) {
        exception.message('Unexpected error: ' + err.message);
    }
}

/**
 * Load a file.
 * @param {string} filePath
 * @param {EnforcerException} exception
 * @returns {Promise<{ content: string, type: string }|undefined>}
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
                resolve({
                    content: data,
                    type: undefined
                });
            }
        })
    })
}

function resolvePath (basePath, ref) {
    const [refPath] = ref.split('#');
    if (rxHttp.test(basePath) || rxHttp.test(ref)) {
        return {
            loadPath: url.resolve(basePath, refPath),
            loadMethod: httpLoad
        };
    } else if (refPath) {
        return {
            loadPath: path.resolve(path.dirname(basePath), refPath),
            loadMethod: fileLoad
        };
    } else {
        return {
            loadPath: path.resolve(basePath),
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
            if (o.hasOwnProperty(key)) {
                o = o[key];
            } else {
                exception.message('Cannot resolve reference: #' + path);
                return;
            }
        }
    }
    return o;
}
