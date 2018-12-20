# EnforcerResult

This class generates an object that allows destructuring into an array or a plain object. Most function calls provided within the [OpenAPI Enforcer](./README.md) will return this object.

The EnforcerResult is an object with three properties:

- *error* - An [EnforcerException object](./enforcer-exception.md) with detailed error report. If there is no error exception then this value will be `undefined`.
- *value* - The success value. This value will be `undefined` if an error exception occurred.
- *warning* - An [EnforcerException object](./enforcer-exception.md) with warnings that do not prevent successful operation. If there is no warning exception then this value will be `undefined`.

## Read the Results

The EnforcerResult object has been built to make it easy to get data out with the minimal amount of code.

For each of the below methods, assume the following:

```js
const Enforcer = require('openapi-enforcer')
```

1. Read as an entire object

    ```js
    const result = new Enforcer.v2_0.Schema({ type: 'string' })
    console.log(result.error)
    console.log(result.value)
    console.log(result.warning)
    ```

2. Destructure without renaming

    Default destructuring requires the original property names to be used.

    ```js
    const { error, value, warning } = new Enforcer.v2_0.Schema({ type: 'string' })
    console.log(error)
    console.log(value)
    console.log(warning)
    ```

3. Destructure with renaming

    It is possible to rename some or all of the destructured properties:

    ```js
    const { error: e, value: schema, warning } = new Enforcer.v2_0.Schema({ type: 'string' })
    console.log(e)
    console.log(schema)
    console.log(warning)
    ```

4. Destructure assignment

    You can select the names of the properties, but the order is important. The order is 1) the value, 2) the error, 3) the warning.

    It is not a requirement to get all three values.

    ```js
    const [ schema, err, warning ] = new Enforcer.v2_0.Schema({ type: 'string' })
    console.log(err)
    console.log(schema)
    console.log(warning)
    ```

    ```js
    const [ schema ] = new Enforcer.v2_0.Schema({ type: 'string' })
    console.log(schema)
    ```

    ```js
    const [ , err ] = new Enforcer.v2_0.Schema({ type: 'string' })
    console.log(schema)
    ```

## Create Your Own EnforcerResult Instance

It's possible to create your own EnforcerResult instance, but you'll also want to read up about the [EnforcerException object](./enforcer-exception.md).

```js
const { Exception, Result } = require('openapi-enforcer')
const error = new Exception('Exception header')
const warning = new Exception('Exception header')
const value = 'Hello'

const [ val, err, warn ] = new Result(value, error, warning)
console.log(err)      // undefined
console.log(val)      // 'Hello'
console.log(warning)  // undefined
```