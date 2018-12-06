# Operation

## API

- Instance Methods

    - [Operation.prototype.request()](#operationprototype)

### Operation.prototype.request

**This probably isn't the method you're looking for. Check out [OpenAPI.prototype.request()](./openapi.md#openapiprototyperequest)**

Parse and validate an incomming request.

**Parameters:**

- *request* - The request object

  - *body* - A `string` or `object` for the request body. If an object is provided then it should already be deserialized as far a `JSON.parse` would deserialize.

  - *header* - An `object` of key value pairs where the key is the header name and the value is the header value.

  - *path* - An `object` containing all of the path parameter names and values. The values should not be deserialized.

  - *query* - The full query string as a `string`.

- *options*- An `object`

  - *allowOtherQueryParameters* - A `boolean` that indicates whether query parameters that are not specified in the OAS definition should be allowed. Defaults to `false`.

  - *pathParametersValueMap* - An `object` map containing already deserialized path parameters. Used internall for performance optimization. Defaults to `{}`.

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to the deserialized and validatated request object.

**This probably isn't the method you're looking for. Check out [OpenAPI.prototype.request()](./openapi.md#openapiprototyperequest)**