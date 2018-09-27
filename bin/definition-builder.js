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

module.exports = DefinitionBuilder;

function DefinitionBuilder(version) {
    if (version === 2) {
        this.swagger = '2.0';
    } else if (version === 3) {
        this.openapi = '3.0.0';
    }

    this.info = {
        title: '',
        version: '1.0'
    };

    this.paths = {};
}

/**
 * Define a path.
 * @param {string} path
 * @param {string} [method]
 * @returns {DefinitionBuilder}
 */
DefinitionBuilder.prototype.addPath = function(path, method) {
    if (!this.paths[path]) this.paths[path] = new Path(this);
    if (method && typeof method === 'string') this.paths[path].addResponse(method, 'default', { description: '' });
    return this;
};

/**
 * Add a path parameter
 * @param {string} path
 * @param {string} [method]
 * @param {...object} parameter
 * @returns {DefinitionBuilder}
 */
DefinitionBuilder.prototype.addParameter = function(path, method, parameter) {
    let start;
    let store;
    if (typeof method === 'string') {
        this.addPath(path, method);
        store = this.paths[path][method].parameters;
        start = 2;
    } else {
        this.addPath(path);
        store = this.paths[path].parameters;
        start = 1;
    }

    const length = arguments.length;
    for (let i = start; i < length; i++) store.push(arguments[i]);

    return this;
};

/**
 * Add a response example.
 * @param {string} path
 * @param {string} method
 * @param {string|number} code
 * @param {object} response
 * @returns {DefinitionBuilder}
 */
DefinitionBuilder.prototype.addResponse = function(path, method, code, response) {
    this.addPath(path, method);
    this.paths[path][method].addResponse(code, response);
    return this;
};

DefinitionBuilder.prototype.build = function() {
    return JSON.parse(JSON.stringify(this));
};

DefinitionBuilder.prototype.log = function() {
    console.log(JSON.stringify(this, null, 2));
    return this;
};

DefinitionBuilder.prototype.toJSON = function(key) {
    return key === 'root' ? undefined : this;
};



function Operation(definition) {
    this.root = definition;
    this.parameters = [];
    this.responses = {};
}

/**
 * Add one or more parameters to the operation.
 * @param {...object} parameter
 * @returns {Path}
 */
Operation.prototype.addParameter = function(parameter) {
    const length = arguments.length;
    for (let i = 0; i < length; i++) this.parameters.push(arguments[i]);
    return this;
};

/**
 * Add a response to the path.
 * @param {string|number} code
 * @param {object} response
 */
Operation.prototype.addResponse = function(code, response) {
    code = String(code);
    this.responses[code] = response;
};



function Path(definition) {
    this.root = definition;
    this.parameters = [];
}

/**
 * Add a method to the path.
 * @param {string} method
 * @returns {Path}
 */
Path.prototype.addMethod = function(method) {
    if (!this[method]) this[method] = new Operation(this.root);
    return this;
};

/**
 * Add one or more parameters to the path.
 * @param {string} [method] If omitted then the parameter(s) will be made path wide.
 * @param {...object} parameter
 * @returns {Path}
 */
Path.prototype.addParameter = function(method, parameter) {
    const length = arguments.length;
    if (typeof method === 'string') {
        this.addMethod(method);
        for (let i = 1; i < length; i++) this[method].addParameter(arguments[i]);
    } else {
        for (let i = 0; i < length; i++) this.parameters.push(arguments[i]);
    }
    return this;
};

/**
 * Add a response to the path.
 * @param {string} method
 * @param {string|number} code
 * @param {object} response
 */
Path.prototype.addResponse = function(method, code, response) {
    this.addMethod(method);
    this[method].addResponse(code, response);
};