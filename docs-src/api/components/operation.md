---
title: Operation
subtitle: API Reference
---

# Instance Methods

## getResponseContentTypeMatches

`Operation.prototype.getResponseContentTypeMatches ( code, accepts ) : EnforcerResult < string[] >`

For OpenAPI 3.x.x, the response body's definition is based on a mime type. This function allow you to find an appropriate response mime type based on an [HTTP Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) string that is generally passed in with the request.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **code** | The response code to return. | `string` or `number` | |
| **accepts** | The [HTTP Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) string to compare response mime types to. An accept string with multiple options and quality is supported. | `string` | |

**Returns:** An [EnforcerResult](../enforcer-result.md) that 

- Resolves to array of strings for each response mime type that matches the accept string in closest match order, also taking accept quality into account.

- Fails because of one of three errors, each with a `code` property specified on the [exception object](../enforcer-exception.md):

    - *NO_CODE* - Indicates that the response code specified is not specifically defined and no default exists.
    
    - *NO_MATCH* - Indicates that a `produces` for OpenAPI v2 or a `content` for OpenAPI v3 exists, but none of their mime types are a match for the accept string passed in.
    
    - *NO_TYPES_SPECIFIED* - Indicates that there is no specified `produces` for OpenAPI v2 or no `content` for OpenAPI v3.

**Example: Get Allowed Mime Types 1**

```js
Enforcer('/path/to/oas-doc.yml')
    .then(enforcer => {
        // get the operation of interest
        const operation = enforcer.paths['/'].post
        const [ matches ] = operation.getResponseContentTypeMatches(200, 'text/*')
        console.log(matches)  // ['text/html', 'text/plain']
    })
```

**Example: Get Allowed Mime Types 2**

```js
const [ operation ] = Enforcer.v2_0.Operation({
    produces: ['application/json', 'text/html', 'text/plain'],
    responses: {
        200: { description: '' }
    }
})
const [ matches ] = operation.getResponseContentTypeMatches(200, 'text/*')

console.log(matches)  // ['text/html', 'text/plain']
```

**Example: No Matching MIME Type**

```js
const [ operation ] = Enforcer.v3_0.Operation({
    produces: ['text/html', 'text/plain'],
    responses: {
        200: { description: '' }
    }
})
const [ matches, err ] = operation.getResponseContentTypeMatches(200, 'application/json')

console.log(matches)  // undefined
console.log(err.code) // NO_MATCH
```

## request

`Operation.prototype.request ( request, options ) : EnforcerResult < object >`

<div class='alert-warning'>

This probably isn't the method you're looking for. Check out [OpenAPI request](./openapi.md#request) that is easier to use and accomplishes the same thing.

</div>

Parse and validate an incoming request.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **request** | The request object. See below | `object` | |
| **options** | An object. See below | `object` | |

**Request Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| body | The request body. If an object is provided then it should already be deserialized as far a `JSON.parse` would deserialize. | `string` or `object` | |
| headers | An `object` of key value pairs where the key is the header name and the value is the header value. | `object` | `{}` |
| path | An `object` containing all of the path parameter names and values. The values should not be deserialized. | `object` | `{}` |
| query | The full query string as a `string`. | `string` | |

**Options Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| allowOtherQueryParameters | A `boolean` or an array of `string` values that indicates whether query parameters that are not specified in the OpenAPI definition should be allowed. If an array of `string` values is provided then the `string` values provided will be allowed. | `string` or `boolean` | `false` |
| pathParametersProcessed | If path parameters have already been parsed, deserialized, and validated then set this value to `true` | `boolean` | `false` |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to the deserialized and validated request object.

<div class='alert-info'>

No example will be shown here. Instead check out [OpenAPI request](./openapi.md#request) that is easier to use and accomplishes the same thing.

</div>

## response

`Operation.prototype.response ( code [, body [, headers ] ] ) : EnforcerResult < object >`

Validate and serialize response data.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **code** | The response code. (This can also be `default` if a `default` is provided.) | `string` or `number` | |
| body | The response body. If you do not want to provide a body use `undefined` or skip the parameter. | any | |
| headers | The response headers as an object of key value pairs. If you're using OpenAPI 3 and your response has multiple possible mime types then you can specify in the headers `content-type` property which mime type to use. | `object` | `{}` |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to an object with properties `body`, `header`, and `schema`. If the `body` passed in was an object then the `body` result will also be an object, not a JSON string.

**Example with Body and Headers**

```js
const Operation = require('openapi-enforcer').v3_0.Operation;
const [ operation ] = new Operation({
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
//     schema: {
//         type: 'string',
//         deprecated: false,
//         maxLength: 10,
//         nullable: false
//     },
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

{% import to-object.md %}
