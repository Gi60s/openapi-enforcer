---
title: EnforcerException
subtitle: Guide
---

This class is used to generate detailed reports about what problems exist and where. Take this example.

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

## Examples

#### Create an EnforcerException Instance

```js
const { Exception } = require('openapi-enforcer')
const exception = new Exception('Header 1')
```

#### Create a Sub Path for an EnforcerException

Use the [`EnforcerException.prototype.at`](#enforcerexceptionprototypeat) function to create a child EnforcerException instance.

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

#### Create a Nested Exception

This method for creating a child exception does not indicate a new path, but rather a new grouping of exceptions.

Use [`EnforcerException.prototype.nest`](#enforcerexceptionprototypenest).

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

## API

- Instance Properties

  - [EnforcerException.count](#enforcerexceptioncount)

  - [EnforcerException.hasException](#enforcerexceptionhasexception)

- Instance Methods

  - [EnforcerException.prototype.at()](#enforcerexceptionprototypeat)

  - [EnforcerException.prototype.clearCache()](#enforcerexceptionprototypeclearcache)

  - [EnforcerException.prototype.nest()](#enforcerexceptionprototypenest)

  - [EnforcerException.prototype.merge()](#enforcerexceptionprototypemerge)

  - [EnforcerException.prototype.message()](#enforcerexceptionprototypemessage)

  - [EnforcerException.prototype.push()](#enforcerexceptionprototypepush)

### EnforcerException.count

The number of *messages* added to an EnforcerException, including those added to any child EnforcerException instances.

```js
const { Exception } = require('openapi-enforcer')

const parent = new Exception('Header 1')
parent.message('Parent message')

const child = parent.at('x')
child.message('Child message')

console.log(parent.count) // 2
console.log(child.count)  // 1
```

### EnforcerException.hasException

Whether an EnforcerException instance has any messages or not.

```js
const { Exception } = require('openapi-enforcer')

const exception = new Exception('Header 1')
console.log(exception.hasException) // false

exception.message('Failed to compute')
console.log(exception.hasException) // true
```

### EnforcerException.prototype.at

Use this method to create a child exception that indicates a followed path.

**Parameters:**

- *path* - The label for the path being followed.

**Returns:** The child EnforcerException instance

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

### EnforcerException.prototype.clearCache

**This method has been deprecated due to caching being disabled.**

You probably won't need to call this method as it is used internally, but if you care to know more then keep reading.

Several properties are cached when creating, modifying, and reading EnforcerException instances. Obviously this is for performance enhancements, but caching can lead to stale data. Whenever a modification is made to an EnforcerException instance it clears it's own cache and notifies its parent EnforcerException objects. (That plural indicator is not a typo, an EnforcerException instance may have several parents.)

**Parameters:** None

**Returns:** The EnforcerException instance who's cache was just cleared

```js
const { Exception } = require('openapi-enforcer')
const exception = new Exception('There was an error')
exception.clearCache()
```

### EnforcerException.prototype.nest

This method for creating a child exception does not indicate a new path, but rather a new grouping of exceptions.

**Parameters:**

- *header* - The label for the next EnforcerException instance

**Returns:** The child EnforcerException instance

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

### EnforcerException.prototype.merge

Copy the child EnforcerInstances and messages from one EnforcerInstance into another.

**Parameters:**

- *exception* - The EnforcerException instance to copy from

**Returns:** The EnforcerException instance that was copied into

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

### EnforcerException.prototype.message

Add a message to the EnforcerException instance. Once a message is added then the EnforcerException instance is considered to have an exception.

**Parameters:**

- *message* - The message to add

**Returns:** The EnforcerException instance that the message was added to

```js
const { Exception } = require('openapi-enforcer')

const exception = new Exception('Header 1')
exception.message('Message 1')

console.log(exception)
// Header 1
//   Message 1
```

### EnforcerException.prototype.push

This method can be used to add a message (`string`) or an EnforcerInstance object to another EnforcerInstance.

**Parameters:**

- *value* - The message or EnforcerInstance to add

**Returns:** The EnforcerException instance that the value was added to

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
