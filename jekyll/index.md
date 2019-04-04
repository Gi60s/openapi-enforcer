---
layout: page
title: Open API Enforcer
permalink: /
---

The Open API Enforcer is a library that provides tools that make it easy to work with the Open API Specification.

- [Validate](./api/#enforcer) your OAS documents.
- [Serialize](./components/schema.md#schemaprototypeserialize), [deserialize](./components/schema.md#schemaprototypedeserialize), and [validate values](./components/schema.md#schemaprototypevalidate) against OAS [schemas](./components/schema.md).
- Identify the [operation](./components/operation.md) associated with a [request](./components/openapi.md#openapiprototyperequest).
- Parse, deserialize, and validate request parameters.
- Facilitated [response building](./components/schema.md#schemaprototypepopulate).
- Generate [random valid values](./components/schema.md#schemaprototyperandom) for a [schema](./components/schema.md).
- [Plugin environment](./extend-components.md) for custom document validation and extended functionality including [custom data type formats](./components/schema.md#schemadefinedataformat).

## Install

```sh
$ npm install openapi-enforcer
```
