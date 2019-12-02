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

const Exception = require('./exception');
const fs        = require('fs');
const http      = require('http');
const https     = require('https');
const path      = require('path');
const Result    = require('./result');
const url       = require('url');
const yaml      = require('js-yaml');

const rxHttp = /^https?:\/\//i;
const rxYaml = /\.ya?ml$/i;
const rxJson = /\.json$/i;

module.exports = dereference;

/**
 * @typedef ParserData
 * @property {EnforcerException} exception The exception object at the current node.
 * @property {string|number|undefined} key The key of the parent that arrived to this node.
 * @property {object} loads A map of HTTP or file paths that have been loaded.
 * @property {WeakMap} map A map of references, used to handle circular referencing.
 * @property {ParserData} parent The parent parse data object.
 * @property {string} path The HTTP or file path to the root node for this node.
 * @property {string|object} source The source object or string.
 * @property {object} result The result object.
 * @property {ParserData} root The root parser data object.
 * @property {EnforcerException} warning The exception object at the current node.
 */

/**
 * Dereference a source.
 * @param {string|object} source
 * @returns {Promise<EnforcerResult>}
 */

async function dereference (source) {
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
}

RefParser.prototype.dereference = async function (source) {
    const exception = new Exception('Unable to dereference definition for one or more reasons');
    const warning = new Exception('One or more warnings encountered while while dereferencing definition');

    const data = {
        exception: exception,
        key: undefined,
        path: typeof source === 'string' ? source : process.cwd(),
        parent: null,
        shared: this.$refs,
        warning: warning
    };

    let obj;
    if (typeof source === 'string') {
        obj = await load(data.path, source, exception, data.shared.refs)
    } else {
        obj = {
            path: process.cwd(),
            value: source
        }
    }

    const value = await parse(obj && obj.value, data);
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
 * @param {string} resourcePath
 * @param {ParserData} data
 * @returns {Promise<{path: string, value: *}|undefined>}
 */
async function load (resourcePath, { exception, loads }) {
    // if already loaded or loading then return that promise
    if (loads[resourcePath]) return loads[resourcePath];

    // store deferred promise
    const deferred = defer();
    loads[resourcePath] = deferred.promise;

    // load content
    const loadMethod = rxHttp.test(resourcePath) ? httpLoad : fileLoad;
    const data = await loadMethod(resourcePath, exception);

    // determine content type
    let type = data ? data.type : undefined;
    if (!type && rxYaml.test(resourcePath)) type = 'yaml';
    if (!type && rxJson.test(resourcePath)) type = 'json';

    try {
        if (data) {
            if (type === 'yaml') {
                deferred.resolve(yaml.safeLoad(data.content));
            } else if (type === 'json') {
                deferred.resolve(JSON.parse(data.content));
            } else if (!type) {
                let obj;
                try {
                    obj = yaml.safeLoad(data.content);
                    type = 'yaml';
                } catch (err) {}
                if (!type) {
                    try {
                        obj = JSON.parse(data.content);
                        type = 'json';
                    } catch (err) {}
                }
                if (!type) {
                    exception.message('Unable to parse document "' + resourcePath + '". Please verify that it is either a YAML or JSON document.');
                    deferred.resolve();
                } else {
                    deferred.resolve(obj);
                }
            }
        }
    } catch (err) {
        exception.message(err.toString());
        deferred.resolve();
    }

    return deferred.promise;
}

/**
 * Load a URL.
 * @param {string} url
 * @param {EnforcerException} exception
 * @returns {Promise<{ content: string, type: string }|undefined>}
 */
function httpLoad (url, exception) {
    return new Promise((resolve, reject) => {
        const protocol = url.toLowerCase().startsWith('https') ? https : http;
        const req = protocol.get(url, res => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            if (statusCode !== 200) {
                exception.message('Unable to load resource: ' + url);
                res.resume();
                resolve();
                return
            }

            let type;
            if (/^application\/json/.test(contentType)) type = 'json';
            if (/^(?:text|application)\/(?:x-)?yaml/.test(contentType)) type = 'yaml';

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({
                    content: rawData,
                    type: type
                });
            });
        });
        req.on('error', err => {
            exception.message(err.toString());
            resolve();
        })
    })
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
