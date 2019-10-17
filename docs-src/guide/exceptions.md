---
title: Exceptions and Warnings
subtitle: Guide
---

## Exceptions vs Warnings

Exceptions are critical errors that will prevent the OpenAPI Enforcer from using your OpenAPI definition.

Warnings will still allow the OpenAPI Enforcer to run smoothly, but they provide details about things you may want to take notice of.

Currently, [all warnings can be ignored](../api/openapi-enforcer.md#enforcer) in their entirety or on a warning specific basis (documented below).

## How to Ignore Some Exceptions and Warnings

Not all exceptions and warnings can be safely ignored. For those that can you will see the exception or warning code at the end of the exception / warning message, surrounded by square brackets.

Take the following OpenAPI definition, and run it through the enforcer:

**openapi.yml**

```yaml
openapi: "3.0.0"
info:
  title: My API
  version: "1.0.0"
paths:
  /emails:
    post:
      summary: Save an email address to the server if it does not already exist and it is also a corperate email address, as identified by the domain.
      responses:
        201:
          description: Saved
          content:
            application/json:
              schema:
                type: string
                format: email
```

**index.js**

```js
const Enforcer = require('openapi-enforcer')

Enforcer('./openapi.yml')
```

**Output**

```
One or more warnings exist in the OpenApi definition
  at: paths > /emails > post
    at: responses > 201
      at: content > application/json > schema > format
        Non standard format "email" used for type "string". [WSCH001]
      A 201 response for a POST request should return a location header (https://tools.ietf.org/html/rfc7231#section-4.3.3) and this is not documented in your OpenAPI document. [WRES001]
    at: summary
      Value should be less than 120 characters. [WOPE003]
```

Notice that the warnings have an associated warning code, wrapped in square brackets at the end of each warning message. In this case we see the codes:

- `WSCH001`
- `WRES001`
- `WOPE003`

Now, imagine we want to ignore some of those warnings, we can do so by defining which codes to ignore in the `componentOptions`.

**index.js Updated**

```js
const Enforcer = require('openapi-enforcer')

const options = {
    componentOptions: {
        exceptionSkipCodes: ['WSCH001', 'WOPE003']
    }
}
Enforcer('./openapi.yml', options)
```

Only those exceptions / warnings we specified will now no longer show up:

```
One or more warnings exist in the OpenApi definition
  at: paths > /emails > post > responses > 201
    A 201 response for a POST request should return a location header (https://tools.ietf.org/html/rfc7231#section-4.3.3) and this is not documented in your OpenAPI document. [WRES001]
```
