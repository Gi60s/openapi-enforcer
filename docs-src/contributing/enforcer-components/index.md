---
title: Enforcer Components
subtitle: Contributing
description: Enforcer components validate the parts of your Open API documents and define additional functionality.
---

Enforcer components validate the parts of your Open API documents and define additional functionality. There are many enforcer component types and together they work to validate an entire Open API document.

1. Each enforcer component is tied to an Open API schema component for [version 2](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) and [version 3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schema).

2. Each enforcer component is capable of supporting all versions of the Open API. Current [version 2](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) and [version 3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schema) are supported, but this can be expanded for future specifications.

3. Each enforcer component is made up of four parts:

    1. [The component validator](#the-component-validator) validates your Open API document for this component.
    
    2. [The init function](#the-init-function) will run after the Open API document passes validation and will generate an instance of the component.
    
    3. [The prototype](#the-prototype) adds functionality to each instance of the component.
    
    4. [Statics](#statics) are properties or functions that get attached to the constructor and do not need an instance of the component to be accessed.
    
4. Each enforcer component exists in the `srcs/enforcers` directory.

### Example Enforcer Component 

The following example is derived solely as generic example of what an enforcer component could look like. It is not built for a schema that currently exists in the Open API specification.

If a specification required, 1) an object, 2. with the required `title` property as a string, and 3. with no additional properties, then a value that matches that schema would look something like this:

**Example Value Following Schema**

```json
{
  "title": "my title"
}
```

**Example Enforcer Component Definition**

The following enforcer component example:

1. Validates that the value matches the schema requirements we've defined.

2. Adds functionality for an implemented instance

3. Has a single static method

4. Has a constructor (the init function)

```js
module.exports = {
    // constructor
    init: function (data) {
        // Can be used for late validations, to
        // add, modify, delete properties, etc.
    },

    // instance specific properties
    prototype: {
        upperCaseTitle: function () {
            return this.title.toUpperCase()
        }
    },
    
    // function that returns static properties
    statics: function (scope) {
        return {
            isUpperCase: function (value) {
                return value.toUpperCase() === value
            }
        }
    },

    // schema validator
    validator: function (data) {
        return {
            type: 'object',
            properties: {
                title: {
                    required: true,
                    type: 'string'
                }
            }
        }
    }
};
``` 

# The Component Validator

The component validator is a function that validates a part of your Open API specification document.

For example, the Open API defines an Info Object for both [version 2](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#infoObject) and [version 3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#infoObject) define the info object like this:

| Field Name | Type | Description |
| ----- | ---- | ----------- |
| title | string | **Required.** The title of the application. |
| description | string | A short description of the application. |
| termsOfService | string | The Terms of Service for the API. |
| contact | *Contact Object* | The contact information for the exposed API. |
| license | *License Object* | The license information for the exposed API. |
| version | string | **Required.** The version of the application API. |

The validator function that matches this definition looks like this:

```js
const EnforcerRef  = require('../enforcer-ref');

module.exports = {
    init: function (data) {},
    prototype: {},

    validator: function () {
        return {
            type: 'object',
            properties: {
                title: {
                    required: true,
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                termsOfService: {
                    type: 'string'
                },
                contact: EnforcerRef('Contact'),
                license: EnforcerRef('License'),
                version: {
                    required: true,
                    type: 'string'
                }
            }
        }
    }
};
```

## Creating a Component Validator

A component validator follows all the same [validator rules](#validator-rules) as a normal validator definition with the exception that a component validator must be an object at the root level.

```js
validator: function () {
    return {
        type: 'object'
    }
}
```

## Validator Rules

A validator is an object that defines the validation rules to apply against an Open API specification's component.

All validators must define a type property or the value will not be validated. The value can be a `string`, an `array of strings`, or a [processor function](#processor-function). Acceptable type string values are:

- `'array'`
- `'boolean'`
- `'null'`
- `'number'`
- `'object'`
- `'string'`

## Processor Function

Many validator rules accept a processor function in place of static values. A processor function receives the [data object](#validator-data-object) and must return a value that is valid for that validator rule.

For example in the Open API specification there is a concept of a schema object. In [version 2](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema-object) the `discriminator` property must be a `string`, but in [version 3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#schema-object) it must be an `object`. To accommodate both types of data, the validator is defined like this:

```js
module.exports = {
    validator: function () {
        return {
            type: 'object',
            properties: {
                discriminator: {
                    type: function (data) {
                        return data.major === 2 ? 'string' : 'object'
                    }
                }
            }
        }
    }
}
```

## Validator Data Object

This object is passed in wherever a validator processor function exists.

**For the validator data object it is essential to understand the concept of a Node.**

The Open API definition object is a definition composed of sub definitions that are also composed of sub definitions that are also composed of sub definitions, etc. This creates a tree structure where each branch in the tree is a *node*. When we speak of *nodes* in the properties below we're speaking of the position it occupies within that tree.
 
**Data Object Properties**

- *context* - This is an object that has a reference to all of the enforcer component constructor functions for that specific major version. These can be used to instantiate new component instance or to access the static properties for the constructor function.

- *definition* - The definition object for this node in the tree.

- *definitionType* - This node's definition value's type. This is not the same as the Open API types. Potential values include: `array`, `boolean`, `decoratedObject`, `null`, `number`, `string`, `object`, `undefined`. Most of these types are common to JavaScript, but in this case an `object` is a plain object and a `decoratedObject` is a non plain object.

- *defToInstanceMap* - A data map that can be used to get the component instance that was created from a definition component.

- *exception* - The [EnforcerException](../../api/enforcer-exception.md) instance for this node in the tree. Use this object to add error messages at the current node.

- *key* - The name of the property (or array index value) that this node exists at within the parent node.

- *major* - The Open API specification major version number. Currently this can be the value `2` or `3`.

- *map* - A map from all definition values to an array of validators and component instances tied to it. Internally this is used to recursively validate the definition while avoiding endless loops.

- *minor* - The Open API specification minor version number.

- *options* - Configuration options passed in to create the component instance.

- *parent* - The parent node's data object.

- *patch* - The Open API specification patch version number.

- *plugins* - An array of functions that will all be called in turn after this node's instance is built. Each function will receive an object with these properties: *enforcers* (same object as the *context* property above), *exception*, *key*, *major*, *minor*, *parent*, *patch*, *root*, *warn*.

- *refParser* - The ref parser used to dereference the definition.

- *result* - The result object that is being generated for the node's instance. For example, the root of the Open API definition will become either a [Swagger](../../api/components/swagger.md) or an [OpenAPI](../../api/components/openapi.md) instance.

- *root* - The root node's data object.

- *staticData* - This object stores data that is defined by and used by [statics](#statics).

- *usedDefault* - A boolean that indicates whether the value for this node was explicitly provided or if it came from a default value.

- *validator* - The validator function that is specifically be used for this node.

- *warn* - The [EnforcerException](../../api/enforcer-exception.md) instance for this node in the tree that is used to generate warning messages for this node.

# The Init Function

# The Prototype

# Statics



