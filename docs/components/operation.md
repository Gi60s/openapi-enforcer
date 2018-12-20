# Operation

## API

- Instance Methods

    - [Operation.prototype.getResponseContentTypeMatches()](#operationprototypegetresponsecontenttypematches)

    - [Operation.prototype.request()](#operationprototyperequest)

    - [Operation.prototype.response()](#operationprototyperesponse)

### Operation.prototype.getResponseContentTypeMatches

For OpenAPI 3.x.x, the response body's definition is based on a mime type. This function allow you to find an appropriate response mime type based on an [HTTP Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) string that is generally passed in with the request.

**Parameters:**

- *code* - A `string` or `number` of the response code to return.

- *accepts* - The [HTTP Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) string to compare response mime types to.

**Returns:** An array of strings for each response mime type that matches the accept string.

### Operation.prototype.request

**This probably isn't the method you're looking for. Check out [OpenAPI.prototype.request()](./openapi.md#openapiprototyperequest)**

Parse and validate an incoming request.

**Parameters:**

- *request* - The request object

  - *body* - A `string` or `object` for the request body. If an object is provided then it should already be deserialized as far a `JSON.parse` would deserialize.

  - *header* - An `object` of key value pairs where the key is the header name and the value is the header value.

  - *path* - An `object` containing all of the path parameter names and values. The values should not be deserialized.

  - *query* - The full query string as a `string`.

- *options*- An `object`

  - *allowOtherQueryParameters* - A `boolean` that indicates whether query parameters that are not specified in the OAS definition should be allowed. Defaults to `false`.

  - *pathParametersValueMap* - An `object` map containing already deserialized path parameters. Used internally for performance optimization. Defaults to `{}`.

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to the deserialized and validated request object.

**This probably isn't the method you're looking for. Check out [OpenAPI.prototype.request()](./openapi.md#openapiprototyperequest)**

### Operation.prototype.response

Validate and serialize response data.

**Parameters:**

- *code* - The response code. (This can also be `default` if a `default` is provided.)

- *body* - The response body. If you do not want to provide a body use `undefined` or skip the parameter.

- *headers* - The response headers as an object of key value pairs. If you're using OpenAPI 3 and your response has multiple possible mime types then you can specify in the headers `content-type` property which mime type to use. Defaults to `{}`.

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to an object with properties `body` and `header`. If the `body` passed in was an object then the `body` result will also be an object, not a JSON string.

**Example with Body and Headers**

```js
const Operation = require('openapi-enforcer').v3_0.Operation;
const operation = new Operation({
    responses: {
        200: {
            description: 'Success',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string',
                        maxLength: 10
                    }
                }
            },
            headers: {
                expires: {
                    description: 'When the content expires',
                    schema: {
                        type: 'string',
                        format: 'date'
                    }
                }
            }
        }
    }
})

const [ response ] = operation.response(200, 'hello', {
    expires: new Date('2000-01-01T00:00:00.000Z')
})

console.log(response)
// {
//     body: 'hello',
//     headers: {
//         expires: '2000-01-01'
//     }
// }
```

**Examples without Body**

```js
const [ response ] = operation.response(200, undefined, {
    expires: new Date('2000-01-01T00:00:00.000Z')
})
```

```js
const [ response ] = operation.response(200, , {
    expires: new Date('2000-01-01T00:00:00.000Z')
})
```