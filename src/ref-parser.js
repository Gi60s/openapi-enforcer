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
    this.$refs = {};
    map.set(this, {
        bundled: null,
        dereferenced: null,
        loads: {},
        refs: this.$refs,
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

    const parseMap = new Map();
    if (typeof source === 'string') {
        const loaded = await load(basePath, source, exception, loads);
        this.$refs.root = await parse(path.dirname(loaded.path), loaded.value, loaded.value, that, parseMap, exception.at(loaded.path));
    } else {
        this.$refs.root = await parse(basePath, source, source, that, parseMap, exception.at('root object'));
    }

    return new Result(this.$refs.root, exception);
};

function defer () {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}

async function parse (basePath, source, value, that, map, exception) {
    if (Array.isArray(value)) {
        const existing = map.get(value);
        if (existing) return existing;

        const result = [];
        map.set(value, result);
        const promises = value.map(async (item, index) => {
            result[index] = await parse(basePath, source, item, that, map, exception.at(String(index)));
        });
        await Promise.all(promises);
        return result;

    } else if (typeof value === 'object') {
        const existing = map.get(value);
        if (existing) return existing;

        if (value.hasOwnProperty('$ref')) {
            const [, internalPath] = value.$ref.split('#');
            if (value.$ref.startsWith('#/')) {
                return traverse(source, internalPath, exception);
            } else {
                const loaded = await load(basePath, value.$ref, exception, that.loads);
                const childException = exception.at(loaded.path);
                const source = await parse(path.dirname(loaded.path), source, loaded.value, that, map, childException);
                this.$refs[loaded.path] = source;
                return traverse(source, internalPath, childException);
            }
        } else {
            let result = {};
            map.set(value, result);
            const promises = Object.keys(value).map(async key => {
                result[key] = await parse(basePath, source, value[key], that, map, exception.at(key));
            });
            await Promise.all(promises);
            return result;
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
 * @param {object} loads
 * @returns {Promise<{path: string, value: *}|undefined>}
 */
async function load (basePath, ref, exception, loads) {
    // determine the load path and method
    const { loadPath, loadMethod } = resolvePath(basePath, ref);

    // if already loaded or loading then return that promise
    if (loads[loadPath]) return loads[loadPath];

    // store deferred promise
    const deferred = defer();
    loads[loadPath] = deferred.promise;

    // load content
    const value = await loadMethod(loadPath, exception.at(loadPath));
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
