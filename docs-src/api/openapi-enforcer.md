---
title: OpenAPI Enforcer
subtitle: API

---


## Enforcer

`Enforcer ( definition [, options ] ) : Promise < OpenAPI | Swagger >`

This function will dereference your OpenAPI document, validate it, produce warnings where appropriate, and return a Promise that resolves to an [OpenAPI component](./components/openapi.md) for an OpenAPI specification 3.x.x document or a [Swagger component](./components/swagger.md) for Swagger 2.0.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **definition** | The OpenAPI document specification. If a `string` is provided then it is the file path to the OpenAPI definition. If an `object` is provided then that will be used as the OpenAPI document. | `string` or `object` | |
| options | Configuration options. See below. | `object` | |

**Options Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| fullResult | Get back a full [Enforcer Result](./enforcer-result.md) object. Enabling this will also cause warnings not to output to the console. | `boolean` | `false` |
| hideWarnings | Do not log warning messages to the console when validating your OpenAPI document. If the `fullResult` option is set to `true` then warnings will not show regardless of this setting. | `boolean` | `false` |
| componentOptions | Options to pass along to the enforcer components | `object` | See Component Options below. |

**Component Options**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| apiSuggestions | Set to `false` to disable API suggestions. When enabled, warnings will be generated where your API goes against standards, indicating what the standard is along with a source reference. | `boolean` | `true` |
| disablePathNormalization | Set to `true` to stop removing trailing slashes for incoming requests and from your paths definitions. | `boolean` | `false` | 
| exceptionSkipCodes | An array of `string` values for all exception and warning codes to ignore. See the [Guide for Exceptions and Warnings](../guide/exceptions.md) for more details. | `string[]` | `[]` |
| exceptionEscalateCodes | An array of `string` values for all exception warning codes that should be escalated to errors. See the [Guide for Exceptions and Warnings](../guide/exceptions.md) for more details. | `string[]` | `[]` |
| requestBodyAllowedMethods | An `object` specifying which request methods to allow (or disallow) a request body for. The object you provide here will merge with the default value. | `object` | ` { post: true, put: true, options: true, head: true, patch: true } `
| production | A `boolean` that when set to `true` will reduce the number of validations run on your OpenAPI document. This will allow your app to load a little faster for production. Do not use this setting if you are not sure that the OpenAPI document is valid otherwise other runtime errors are sure to occur. | `boolean` | `false` |   
    
**Returns:** A Promise

  - that will resolve to an [OpenAPI component](./components/openapi.md) for an OpenAPI specification 3.x.x document or a [Swagger component](./components/swagger.md) for Swagger 2.0
  - or will reject with an [EnforcerException](./enforcer-exception.md) Error.

**Example 1: Invalid Definition**

```js
const Enforcer = require('openapi-enforcer')

const definition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.3.4'
    },
    paths: {
        '/person/{id}': {}
    }
}

Enforcer(definition)
    .catch(err => {
        console.error(err.message)
        // One or more warnings exist in the OpenApi definition
        //   at: paths > /person/{id}
        //     No methods defined
    })
```

**Example 2: Valid Definition**

```js
const definition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.3.4'
    },
    paths: {
        '/person/{id}': {
            get: {
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Success'
                    }
                }
            },
        }
    }
};

Enforcer(definition)
    .then(openapi => {
        const isOpenApiInstance = openapi instanceof Enforcer.v3_0.OpenApi
        console.log(isOpenApiInstance);  // true
    })
```

## Enforcer.config

Set global configuration options for all Enforcer instances.

| Option | Description | Default |
| ------ | ----------- | ------- |
| useNewRefParser | Use the custom built ref parser to resolve multi file discriminator references. This feature is currently in beta. Please report issues on github. https://github.com/byu-oit/openapi-enforcer/issues | `false` |

**Example**

```js
const Enforcer = require('openapi-enforcer');
Enforcer.config.useNewRefParser = true; // use custom ref parser
```

## Enforcer.bundle

`Enforcer.bundle ( definition ) : Promise <object>`

Resolves all of the `$ref` values in a definition, reorganizes `$ref` values to meet the OpenAPI specification, and returns an object that can be stringified with `JSON.stringify`.

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **definition** | A `string` for the file path to the OpenAPI definition or an `object` to bundle. | `string` or `object` | |

**Parameters:**

- *definition* - A `string` for the file path to the OpenAPI definition or an `object` to bundle.

**Returns:** A Promise that resolves to the bundled `object`.

## Enforcer.dereference

`Enforcer.dereference ( definition ) : Promise <object>`

Resolves all of the `$ref` values in a definition and returns the dereferenced object.

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **definition** | A `string` for the file path to the OpenAPI definition or an `object` to dereference. | `string` or `object` | |

**Parameters:**

- *definition* - A `string` for the file path to the OpenAPI definition or an `object` to dereference.

**Returns:** A Promise that resolves to the dereferenced `object`.

## Enforcer.Enforcer

`Enforcer.Enforcer : Enforcer`

A static reference to the [Enforcer function](#enforcer). This is helpful if you're using destructuring when you require this package.

**Destructure Example**

```js
const { Enforcer } = require('openapi-enforcer');
```

## Enforcer.Exception

`Enforcer.Exception : EnforcerException`

A static reference to the the [EnforcerException class](./enforcer-exception.md).

## Enforcer.Result

`Enforcer.Result : EnforcerResult`

A static reference to the the [EnforcerResult class](./enforcer-result.md).

## Enforcer.v2_0

`Enforcer.v2_0 : object`

An object containing class constructors for all [components](./components/index.md) that are part of the Swagger 2.0 specification:

{% include v2_0-components.html %}

**Example: Creating Schema**

```js
const Enforcer = require('openapi-enforcer')
const [ schema ] = Enforcer.v2_0.Schema({ type: 'string' })
```

## Enforcer.v3_0

`Enforcer.v3_0 : object`

An object containing class constructors for all [components](./components/index.md) that are part of the OpenAPI specification (OAS) 3 specification:

{% include v3_0-components.html %}

**Example: Creating Schema**

```js
const Enforcer = require('openapi-enforcer')
const [ schema ] = Enforcer.v3_0.Schema({ type: 'string' })
```

