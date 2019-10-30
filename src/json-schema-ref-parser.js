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

const fs        = require('fs');
const http      = require('http');
const https     = require('https');
const path      = require('path');
const url       = require('url');
const yaml      = require('js-yaml');

const rxHttp = /^https?:\/\//i;
const rxYaml = /\.ya?ml$/i;
const rxJson = /\.json$/i;

module.exports = RefParser;

async function RefParser (source, exception, warning) {
    const data = {
        exception: exception,
        key: undefined,
        path: typeof source === 'string' ? source : process.cwd(),
        parent: null,
        shared: {
            circular: false,
            map: new WeakMap(),
            refs: Object.create(null)
        },
        warning: warning
    };

    let obj;
    if (typeof source === 'string') {
        obj = await load(data.path, source, exception, data.shared.refs)
    } else {
        obj = {
            path: process.cwd(),
            root: source,
            value: source
        }
    }

    return parse(obj.value, data);
}

function childData (data, key, path) {
    return {
        exception: data.exception.at(key),
        key: key,
        path: path || data.path,
        parent: data,
        shared: data.shared,
        warning: data.warning.at(key)
    }
}

async function parse (obj, data) {
    const { map } = data.shared;

    if (Array.isArray(obj)) {
        const existing = map.get(obj);
        if (existing) return existing;

        const result = [];
        map.set(obj, result);
        const promises = obj.map(async (item, index) => {
            const value = await parse(item, childData(data, index));
            result.push(value);
        });
        await Promise.all(promises);
        return result;

    } else if (typeof obj === 'object') {
        const existing = map.get(obj);
        if (existing) return existing;

        const result = {};
        map.set(obj, result);
        const promises = Object.keys(obj).map(async key => {
            if (key === '$ref') {
                const loaded = await load(data.path, obj.$ref, data.exception, data.shared.refs);
                result[data.key] = await parse(loaded.value, childData(data, key, loaded.path))
            } else {
                result[key] = await parse(obj[key], childData(data, key));
            }
        });
        await Promise.all(promises);
        return result;

    } else {
        return obj;
    }
}

/**
 * Load a file or URL and parse to object.
 * @param {string} basePath
 * @param {string} ref
 * @param {EnforcerException} exception
 * @param {object} refs
 * @returns {Promise<{path: string, root: object, value: *}|undefined>}
 */
async function load (basePath, ref, exception, refs) {
    const [refPath, internalPath] = ref.split('#');
    let data;
    let loadedPath;

    // http path
    if (rxHttp.test(basePath) || rxHttp.test(ref)) {
        loadedPath = url.resolve(basePath, refPath);
        if (!refs[loadedPath]) refs[loadedPath] = httpLoad(loadedPath, exception);
        data = await refs[loadedPath];

    // file path
    } else {
        loadedPath = path.resolve(basePath, refPath);
        refs[loadedPath] = fileLoad(loadedPath, exception);
        data = await refs[loadedPath];
    }

    let type = data ? data.type : undefined;
    if (!type && rxYaml.test(loadedPath)) type = 'yaml';
    if (!type && rxJson.test(loadedPath)) type = 'json';

    let obj;
    if (data) {
        if (type === 'yaml') {
            obj = yaml.safeLoad(data.content);
        } else if (type === 'json') {
            obj = JSON.parse(data.content);
        } else if (!type) {
            try {
                obj = yaml.safeLoad(data.content);
                type = 'yaml';
            } catch (err) {
            }
            if (!type) {
                try {
                    obj = JSON.parse(data.content);
                    type = 'json';
                } catch (err) {
                }
            }
            if (!type) {
                exception.message('Unable to parse document "' + refPath + '". Please verify that it is either a YAML or JSON document.');
            }
        }
    }

    const value = obj
        ? traverse(obj, internalPath, exception)
        : null;

    if (!exception.hasException) {
        return {
            path: loadedPath,
            root: obj,
            value: value
        }
    }
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
                })
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
            if (err && err.code === "ENOENT") {
                exception.message('Unable to find referenced file: ' + filePath);
            } else if (err) {
                exception.message('Unable to read file "' + filePath + '": ' + err.toString())
            } else {
                resolve({
                    content: data,
                    type: undefined
                });
            }
        })
    })
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
                exception.message('Cannot resolve reference: ' + path);
                return;
            }
        }
    }
    return o;
}
