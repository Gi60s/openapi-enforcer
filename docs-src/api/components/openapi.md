---
title: OpenAPI
subtitle: API Reference
---

This is the top level component that contains all other components within it.

# Instance Methods

## path

`OpenApi.prototype.path ( method, path ) : EnforcerResult < object >`

Get path parameters and operation from a method and path.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **method** | The HTTP method to use | `string` | |
| **path** | The request path | `string` | |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to an `object` with two properties:

- *operation* - The [Operation component](operation.md) that is tied to this path.

- *params* - An `object` of key value pairs for each path parameter and it's deserialized and validated value.

- *pathKey* - The `string` value for the path item as written in the OpenAPI document.

**Example**

```js
const OpenAPI = require('openapi-enforcer').v3_0.OpenApi

const [ openapi ] = OpenAPI({
  openapi: '3.0.0',
  info: { title: '', version: '' },
  paths: {
    '/{date}': {
      get: {
        parameters: [
          {
            name: 'date',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'date'
            }
          }
        ],
        ...
      }
    }
  }
})

const { operation, params } = openapi.path('get', '/2000-01-01')
console.log(params.date) // Date object
```

## request

`OpenApi.prototype.request ( request [, options ] ) : EnforcerResult < object >`

Deserialize and validate a request.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **request** | The request configuration. See below. | `object` | |
| options | The options configuration. See below | `object` | |

**Request Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| body | A `string` or `object` for the request body. If an object is provided then it should already be deserialized as far a `JSON.parse` would deserialize. | `string` or `object` | |
| headers | An `object` of key value pairs where the key is the header name and the value is the header value. | `object` | `{}` |
| method | The HTTP method to use. | `string` | `'get'` |
| path | The full path (after domain and port) including query parameter string. | `string` | `'/'` |
| query | An `object` of key value pairs where the key is the query parameter name and the value is the query parameter value. If a query string is included on the `path` property then this object will be ignored. | `object` | |

**Options Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| allowOtherQueryParameters | A `boolean` or an array of `string` values that indicates whether query parameters that are not specified in the OpenAPI definition should be allowed. If an array of `string` values is provided then the `string` values provided will be allowed. | `boolean` or `string` | `false` |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to an `object` with these properties:

- *body* - The deserialized and validated request body

- *cookie* - An `object` map of cookie names and deserialized and validated values. 

- *headers* - An `object` map of header names and deserialized and validated values.

- *operation* - The [Operation component](operation.md) object associated with the request.

- *path* - An `object` map of path parameter names and deserialized and validated values.

- *pathKey* - The path item's key value as written in the OpenAPI document.

- *query* - An `object` map of query parameter names and deserialized and validated values.

- *response* - A small wrapper around the `function` [Operation.prototype.response()](operation.md#response). This will automatically set the response header `content-type` based on the request `accept` header unless you specifically set a response `content-type`.

**Example**

```js
const OpenAPI = require('openapi-enforcer').v3_0.OpenApi

const openapi = new OpenAPI({
  openapi: '3.0.0',
  ... 
})

const req = openapi.request({
  method: 'get',
  path: '/path/abc?x=1',
})
```

{% import to-object.md %}
