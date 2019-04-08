# OpenApi

The top level class.

## API

- Instance Methods

  - [OpenApi.prototype.path()](#openapiprototypepath)

  - [OpenApi.prototype.request()](#openapiprototyperequest)

### OpenApi.prototype.path

Get path parameters and operation from a method and path.

**Parameters:**

- *method* - A `string` for the HTTP method to use.

- *path* - A `string` for the request path.

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to an `object` with two properties:

- *operation* - The [Operation component](operation.md) that is tied to this path.

- *params* - An `object` of key value pairs for each path parameter and it's deserialized and validated value.

```js
const OpenAPI = require('openapi-enforcer').v3_0.OpenApi

const openapi = new OpenAPI({
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

### OpenApi.prototype.request

Deserialize and validate a request.

**Parameters:**

- *request* - The request `object`.

  - *body* - A `string` or `object` for the request body. If an object is provided then it should already be deserialized as far a `JSON.parse` would deserialize.

  - *header* - An `object` of key value pairs where the key is the header name and the value is the header value.

  - *method* - A `string` for the HTTP method to use.

  - *path* - A `string` that contains the full path (after domain and port) including query parameter string.

- *options* - An `object`

  - *allowOtherQueryParameters* - A `boolean` or an array of `string` values that indicates whether query parameters that are not specified in the OAS definition should be allowed. If an array of `string` values is provided then the `string` values provided will be allowed. Defaults to `false`.

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to an `object` with these properties:

- *body* - The deserialized and validated request body

- *cookie* - An `object` map of cookie names and deserialized and validated values. 

- *header* - An `object` map of header names and deserialized and validated values.

- *operation* - The [Operation component](operation.md) object associated with the request.

- *path* - An `object` map of path parameter names and deserialized and validated values.

- *query* - An `object` map of query parameter names and deserialized and validated values.

- *response* - A small wrapper around the `function` [Operation.prototype.response()](operation.md#operationprototyperesponse). This will automatically set the response header `content-type` based on the request `accept` header unless you specifically set a response `content-type`.

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
