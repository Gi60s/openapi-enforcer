---
layout: page
title: EnforcerResult
subtitle: API Reference
permalink: /api/enforcer-result
toc: false
---

To learn how to read an EnforcerRead object [check out the guide](../guide/enforcer-result).

## Create an EnforcerResult Instance

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
