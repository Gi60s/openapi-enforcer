---
title: EnforcerException
subtitle: API Reference
---

This class is used to generate error reports when one or more errors occur within the system. It is capable of accurately targeting errors within nested objects.

This example shows two errors:

1. One at `one > two > a` as `Error 1`
2. Another at `one > two > b > 0` as `Error 2`

```js
const { Exception } = require('openapi-enforcer')

const exception = new Exception('Header 1')
const subException = exception.at('one').at('two')
subException.at('a').message('Error 1');
subException.at('b').at(0).message('Error 2');

console.log(exception)
// Header 1
//   at: one > two
//     at: a
//       Error 1
//     at: b > 0
//       Error 2
```

# Instance Properties

## count

`EnforcerException.count : number`

The number of *messages* added to an EnforcerException, including those added to any child EnforcerException instances.

**Example**

```js
const { Exception } = require('openapi-enforcer')

const parent = new Exception('Header 1')
parent.message('Parent message')

const child = parent.at('x')
child.message('Child message')

console.log(parent.count) // 2
console.log(child.count)  // 1
```

## hasException

`EnforcerException.hasException : boolean`

Whether an EnforcerException instance has any messages or not.

**Example**

```js
const { Exception } = require('openapi-enforcer')

const exception = new Exception('Header 1')
console.log(exception.hasException) // false

exception.message('Failed to compute')
console.log(exception.hasException) // true
```

# Instance Methods

## at

`EnforcerException.prototype.at ( path: string ) : EnforcerException`

Use this method to create a child exception that indicates a sub path. This differs from the `nest` function in that it creates a shared Exception space where the provided `path` is the key.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **path** | The label for the sub path being created. | `string` | |

**Returns:** The child EnforcerException instance

**Example**


```js
const { Exception } = require('openapi-enforcer')
const exception = new Exception('Header 1')

const subPathException = exception.at('some path')
subPathException.message('No soup for you')

console.log(exception)
// Header 1
//   at: some path
//     No soup for you
```

## nest

`EnforcerException.prototype.nest ( header: string ) : EnforcerException`

Use this method to create a child exception. Unlike the `at` function, this will not share messages with other nested exceptions that share the same `header` value.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **header** | The label for the sub EnforcerException instance being created. | `string` | |

**Returns:** The child EnforcerException instance

**Example**

```js
const { Exception } = require('openapi-enforcer')
const exception = new Exception('There was an error')

const subException = exception.nest('Could not do action X')
subException.message("I'm a teapot")
subException.message('Too busy to comply')

console.log(exception)
// There was an error
//   Could not do action X
//     I'm a teapot
//     Too busy to comply
```

## merge

`EnforcerException.prototype.merge ( exception: EnforcerException ) : EnforcerException`

Copy the child EnforcerInstances and messages from one EnforcerInstance into another.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **exception** | The EnforcerException instance to copy from. | `EnforcerException` | |

**Returns:** The EnforcerException instance that was copied into

**Example**

```js
const { Exception } = require('openapi-enforcer')

const exceptionA = new Exception('Header A')
exceptionA.message('Message a')

const exceptionB = new Exception('Header B')
exceptionB.message('Message b')

exceptionA.merge(exceptionB)

console.log(exceptionA)
// Header A
//   Message a
//   Message b
```

## message

`EnforcerException.prototype.message ( message: string ) : EnforcerException`

Add a message to the EnforcerException instance. Once a message is added then the EnforcerException instance is considered to have an exception.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **message** | The message to add. | `string` | |

**Returns:** The EnforcerException instance that the message was added to

**Example**

```js
const { Exception } = require('openapi-enforcer')

const exception = new Exception('Header 1')
exception.message('Message 1')

console.log(exception)
// Header 1
//   Message 1
```

## push

`EnforcerException.prototype.push ( value: string|EnforcerException ) : EnforcerException`

This method can be used to add a message (`string`) or an EnforcerInstance object to another EnforcerInstance.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **value** | The message or EnforcerInstance to add. | `string` or `EnforcerException` | |

**Returns:** The EnforcerException instance that the value was added to

**Example**

```js
const { Exception } = require('openapi-enforcer')

const child = new Exception('Header 2')
child.message('Message 2')

const parent = new Exception('Header 1')
parent.push('Message 1')
parent.push(child)

console.log(exception)
// Header 1
//   Header 2
//     Message 2
//   Message 1
```

## toString

`EnforcerException.prototype.toString () : string`

Get the error message that represents the EnforcerException instance. If the EnforcerException instance and its children have no messages then this will return an empty string, otherwise it will show the error(s) in an organized hierarchy.

**Parameters:**

None

**Returns:** a `string`
