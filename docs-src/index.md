---
title: OpenAPI Enforcer 
navOrder: guide api contributing changes
toc: false
---

The OpenAPI Enforcer is a library that provides tools that make it easy to work with the OpenAPI specification.

- [Create an API](./guide/create-api.md).
- [Validate](./guide/validate-document.md) your OpenAPI documents.
- [Serialize](./api/components/schema.md#serialize), [deserialize](./api/components/schema.md#deserialize), and [validate values](./api/components/schema.md#validate) against OpenAPI [schemas](./api/components/schema.md).
- Identify the [operation](./api/components/operation.md) associated with a [request](./api/components/openapi.md#request).
- Parse, deserialize, and validate [request](./api/components/openapi.md#request) parameters.
- Facilitated [response building](./api/components/schema.md#populate).
- Generate [random valid values](./api/components/schema.md#random) for a [schema](./api/components/schema.md).
- [Plugin environment](./guide/component-plugins.md) for custom document validation and extended functionality including [custom data type formats](./api/components/schema.md#definedatatypeformat).

## Install

```sh
$ npm install openapi-enforcer
```
