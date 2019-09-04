---
title: Create an API
subtitle: Guide
---

To generate an API and it's scaffolding from an OpenAPI document:

1. Install the [OpenAPI Enforcer CLI](https://www.npmjs.com/package/openapi-enforcer-cli): `npm install -g openapi-enforcer-cli`

2. Read up on the [OpenAPI Enforcer Middleware](https://www.npmjs.com/package/openapi-enforcer-middleware) documentation on how to map controllers and operations to your OpenAPI document's paths.

2. Run the command: `openapi-enforcer create-api <path-to-oas-doc> <out-dir>`

    - `<path-to-oas-doc>` is the file path to your OpenAPI document.
    
    - `<out-dir>` is the directory where you'd like to create your API.

At this point your API will be ready to accept requests and return mocked responses.

It is fairly trivial at this point to implement actual responses to overwrite your automatically mocked responses. You can read up about that in the [OpenAPI Enforcer Middleware](https://www.npmjs.com/package/openapi-enforcer-middleware) documentation.
