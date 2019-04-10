---
layout: page
title: Open API Enforcer
permalink: /
---

The Open API Enforcer is a library that provides tools that make it easy to work with the Open API Specification.

- [Validate](./api/#enforcer) your OAS documents.
- [Serialize](api/components/schema.md#schemaprototypeserialize), [deserialize](api/components/schema.md#schemaprototypedeserialize), and [validate values](api/components/schema.md#schemaprototypevalidate) against OAS [schemas](api/components/schema.md).
- Identify the [operation](api/components/operation.md) associated with a [request](api/components/openapi.md#openapiprototyperequest).
- Parse, deserialize, and validate request parameters.
- Facilitated [response building](api/components/schema.md#schemaprototypepopulate).
- Generate [random valid values](api/components/schema.md#schemaprototyperandom) for a [schema](api/components/schema.md).
- [Plugin environment](./extend-components.md) for custom document validation and extended functionality including [custom data type formats](api/components/schema.md#schemadefinedataformat).

## Install

```sh
$ npm install openapi-enforcer
```
