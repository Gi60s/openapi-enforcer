---
title: EnforcerResult
subtitle: API Reference
---

Related: [How to read an EnforcerResult object](../guide/enforcer-result.md)

## EnforcerResult

`EnforcerResult ( value [, error [, warning ] ] ) : Promise < OpenAPI | Swagger >`

Create an EnforcerResult instance.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **value** | The success value for the EnforcerResult instance. | any | |
| error | An [EnforcerException](./enforcer-exception.md) instance that may or may not have any exceptions. If an exception (message) does exist for this object then the EnforcerResult value will be `undefined`. | [EnforcerException](./enforcer-exception.md) | undefined |
| warning | An [EnforcerException](./enforcer-exception.md) instance that may or may not have any exceptions. | [EnforcerException](./enforcer-exception.md) | undefined |

**Returns** an EnforcerResult instance.

**Example without Error

```js
const { Exception, Result } = require('openapi-enforcer')
const error = new Exception('Exception header')
const warning = new Exception('Exception header')

const [ val, err, warn ] = new Result('Hello', error, warning)
console.log(err)      // undefined
console.log(val)      // 'Hello'
console.log(warning)  // undefined
```

**Example with Error**

```js
const { Exception, Result } = require('openapi-enforcer')
const error = new Exception('Exception header')
error.message('An error')
const warning = new Exception('Exception header')

const [ val, err, warn ] = new Result('Hello', error, warning)
console.log(err)      // Exception header
                      //   An error
console.log(val)      // undefined because the EnforcerException had a message
console.log(warning)  // undefined
```
