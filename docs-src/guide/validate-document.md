---
title: Validate a Document
subtitle: Guide
---

It is possible to validate an entire OpenAPI document or just parts of it. Errors and warnings are returned through an [EnforcerResult object](./enforcer-result.md)

### Validate from a File

This example will read a file, resolve all `$ref`s, and produce an [EnforcerResult object](./enforcer-result.md). This is an asynchronous operation.

```js
const Enforcer = require('openapi-enforcer')

// JSON and YAML files accepted
Enforcer('/path/to/oas-doc.yml', { fullResult: true })
    .then(function ({ error, warning }) {
        if (!error) {
            console.log('No errors with your document')
            if (warning) console.warn(warning)
        } else {
            console.error(error)
        }
    })
```

### Validate from an Object

This example will resolve all `$ref`s and produce an [EnforcerResult object](./enforcer-result.md). This is an asynchronous operation.

```js
const Enforcer = require('openapi-enforcer')
const doc = require('./oas-doc.json')

// doc is already loaded into memory as an object
Enforcer(doc, { fullResult: true })
    .then(function ({ error, warning }) {
        if (!error) {
            console.log('No errors with your document')
            if (warning) console.warn(warning)
        } else {
            console.error(error)
        }
    })
```

### Validate Part of a Document

This example WILL NOT resolve `$ref`s, so if you need to do that be sure to use the [Enforcer.dereference](../api/openapi-enforcer.md#enforcerdereference) function first.

This example also requires that you know which version of the OpenAPI specification your document uses.

```js
const Enforcer = require('openapi-enforcer')
const doc = require('./oas-doc.json')

// doc is already loaded into memory as an object
const { error, warning } = Enforcer.v3_0.Schema(doc.components.schemas.Cat)
if (!error) {
    console.log('No errors with your document')
    if (warning) console.warn(warning)
} else {
    console.error(error)
}
```
