---
layout: page
title: Open API Enforcer
permalink: /
---

The Open API Enforcer is a library that provides tools that make it easy to work with the Open API Specification.

- [Validate](./guide/validate-document) your OAS documents.
- [Serialize](./api/components/schema#serialize), [deserialize](./api/components/schema#deserialize), and [validate values](./api/components/schema#validate) against OAS [schemas](./api/components/schema).
- Identify the [operation](./api/components/operation) associated with a [request](./api/components/openapi#request).
- Parse, deserialize, and validate [request](./api/components/openapi#request) parameters.
- Facilitated [response building](./api/components/schema#populate).
- Generate [random valid values](./api/components/schema#random) for a [schema](./api/components/schema).
- [Plugin environment](./guide/component-plugins) for custom document validation and extended functionality including [custom data type formats](./api/components/schema#definedatatypeformat).

## Install

```sh
$ npm install openapi-enforcer
```
