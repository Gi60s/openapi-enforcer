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

RefParser.prototype.bundle = async function () {
    const that = map.get(this);
    if (that.bundled) {
        const { value, error, warning } = that.bundled;
        return new Result(value, error, warning);
    }

    const exception = new Exception('Unable to bundle definition for one or more reasons');

    const [ dereferenced, error ] = await this.dereference();
    const bundled = util.copy(dereferenced)
    if (error) {
        exception.push(error);
    } else {
        const map = mapNodesAndPaths(bundled, null, '', '#', [])
        const duplicates = Array.from(map.keys())
            .map(key => {
                const data = map.get(key)
                return { node: key, refs: data }
            })
            .filter(v => v.refs.length > 1)

        // get the optimal references
        const version = getVersion(bundled)
        const priorities = version === 2
            ? ['definitions', 'parameters', 'responses', 'securityDefinitions', 'security', 'tags', 'externalDocs']
            : ['components/schemas', 'components/responses', 'components/parameters', 'components/examples', 'components/requestBodies', 'components/headers', 'components/securitySchemes', 'components/links', 'components/callbacks', 'components', 'security', 'servers', 'tags', 'externalDocs']
        duplicates.forEach(dup => {
            const refs = dup.refs
            refs.sort((a, b) => {
                const pathA = a.path
                const pathB = b.path
                let priorityA = priorities.findIndex(p => pathA.startsWith('#/' + p))
                let priorityB = priorities.findIndex(p => pathB.startsWith('#/' + p))
                if (priorityA === -1) priorityA = Number.MAX_SAFE_INTEGER
                if (priorityB === -1) priorityB = Number.MAX_SAFE_INTEGER

                if (priorityA < priorityB) {
                    return -1;
                } else if (priorityA > priorityB) {
                    return 1;
                } else {
                    return pathA.split('/').length < pathB.split('/').length ? -1 : 1;
                }
            })
            dup.ref = refs[0]
        })

        duplicates.sort((a, b) => {
            return a.ref.pathLength > b.ref.pathLength ? -1 : 1
        })

        duplicates.forEach(dup => {
            const refs = dup.refs;
            // console.log(dup.ref.path + ' <-- ' + refs.map(r => r.path).join(' && '))
            const length = refs.length;
            for (let i = 1; i < length; i++) {
                const ref = refs[i]
                ref.parent[ref.key] = { $ref: dup.ref.path }
            }
        })
    }

    that.bundled = new Result(bundled, exception);
    return that.bundled;
}

RefParser.prototype.dereference = async function () {
    const that = map.get(this);
    if (that.dereferenced) {
        const { value, error, warning } = that.dereferenced
        return new Result(value, error, warning)
    }

    const exception = new Exception('Unable to dereference definition for one or more reasons');
    const { source } = that;

    const basePath = typeof source === 'string'
        ? path.dirname(source)
        : process.cwd();

    let result;
    if (typeof source === 'string') {
        const loaded = await load(basePath, source, exception, that);
        result = await parse(path.dirname(loaded.path), loaded.path, loaded.value, loaded.value, that, new Map(), [], exception.at(loaded.path));
        that.refs[loaded.path] = result;
    } else {
        const copy = util.copy(source);
        result = await parse(basePath, '', copy, copy, that, new Map(), [], exception.at('root object'));
        that.refs[''] = result;
    }

    that.dereferenced = new Result(result, exception);
    return that.dereferenced;
};

RefParser.prototype.getSourceNode = function (node) {
    const fullPath = this.getSourcePath(node);
    return this.$refs[fullPath];
};

RefParser.prototype.getSourcePath = function (node) {
    const that = map.get(this);
    ensureDereferenced(that);

    const sourceMap = that.sourceMap;
    const keys = Object.keys(sourceMap);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
        const key = keys[i];
        if (sourceMap[key].includes(node)) return key;
    }
};

RefParser.prototype.resolvePath = function (node, ref) {
    const that = map.get(this);
    ensureDereferenced(that);

    const exception = new Exception('Could not resolve path from node');
    const [externalPath, internalPath] = ref.split('#');

    let result;
    if (!externalPath) {
        result = traverse(node, internalPath, exception);
    } else {
        const sourcePath = this.getSourcePath(node);
        if (!sourcePath) {
            exception.message('Unable to resolve source path for provided node.')
        } else {
            const dirPath = path.dirname(sourcePath);
            const newPath = rxHttp.test(dirPath)
                ? url.resolve(dirPath, externalPath)
                : path.resolve(dirPath, externalPath);
            if (this.$refs.hasOwnProperty(newPath)) {
                result = traverse(this.$refs[newPath], internalPath, exception);
            } else {
                exception.message('Unable to resolve paths that were not already resolved during dereference.')
            }
        }
    }

    if (exception.hasException) throw Error(exception.toString());
    return result;
};

function defer () {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}

function ensureDereferenced (that) {
    if (!that.dereferenced) throw Error('You must first call the dereference function before looking up node source.');
    if (that.dereferenced.error) throw Error('Cannot get source for a node when dereference has failed.');
}

function mapNodesAndPaths (node, parent, key, path, chain, map = new Map()) {
    if (node && typeof node === 'object') {
        // if we're in an endless loop then exit
        if (chain.includes(node)) return

        // add to loop watching chain
        chain = chain.slice();
        chain.push(node);

        const data = {
            key,
            parent,
            path,
            pathLength: chain.length
        }

        // store where this node resides in the tree
        const existing = map.get(node);
        if (existing) {
            existing.push(data);
            return map;
        } else {
            map.set(node, [data]);
        }

        if (Array.isArray(node)) {
            node.forEach((n, i) => {
                mapNodesAndPaths(n, node, i, path + '/' + i, chain, map);
            });
        } else {
            Object.keys(node).forEach(key => {
                mapNodesAndPaths(node[key], node, key, path + '/' + key, chain, map);
            });
        }
    }
    return map;
}

function getVersion (spec) {
    if (spec) {
        if (spec.swagger) return 2;
        if (spec.openapi) {
            const v = spec.openapi.split('.')[0];
            if (/^\d$/.test(v)) return +v;
        }
    }
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

    } else if (value && typeof value === 'object') {
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
