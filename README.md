# OpenAPI-Enforcer

Tools for using the Open API Specification (OAS)

**Supports OAS 2.0 (formerly Swagger) and OAS 3.x.x**

## Features

- Create an API.
- Validate your OAS documents.
- Serialize, deserialize, and validate values against OAS schemas.
- Identify the operation associated with a request.
- Parse, deserialize, and validate request parameters.
- Facilitated response building.
- Generate random valid values for a schema.
- Plugin environment for custom document validation and extended functionality including custom data type formats.

## Website - [openapi-enforcer.com](https://openapi-enforcer.com/)

## Installation

```shell
npm install openapi-enforcer
```

## Examples

### Loading and Validating a Document

Use the Enforcer to load and resolve all $ref values and then to validate the complete document.

```js
const Enforcer = require('openapi-enforcer')

async function run () {
  const [openapi, error, warning] = await Enforcer('./path/to/openapi.yml', {
    fullResult: true
  })
  if (error !== undefined) console.error(error)
  if (warning !== undefined) console.warn(warning)
  if (openapi !== undefined) console.log('Document is valid')
}

run.catch(console.error)
```

### Processing an Incoming Request

```js
const Enforcer = require('openapi-enforcer')

async function run () {
  // Because we don't specify `fullResult: true`, any errors will throw an exception and
  // warnings will be logged to the console.
  const openapi = await Enforcer('./path/to/openapi.yml')

  // If the request is valid then the req object will contain the parsed and validated request.
  // If it is invalid then the error will contain details about what was wrong with the
  // request and these details are safe to return to the client that made the request.
  const [ req, error ] = openapi.request({
    method: 'POST',
    path: '/tasks',
    // the body should be parsed by a JSON.parse() prior to passing in (if applicable).
    body: { task: 'Buy Milk', quantity: 2 }
  })

  // You can use the req.operation property to look at the properties from your OpenAPI document.
  // A good use of this is to look at the operationId you defined there to determine which path
  // is being used to handle the request.
  if (req.operaton.operationId === 'my-operation-id') {
    // ... additional request processing
  }
}

run.catch(console.error)
```

### Producing a Valid Result

```js
const Enforcer = require('openapi-enforcer')

async function run () {
  const openapi = await Enforcer('./path/to/openapi.yml')

  const [ req ] = openapi.request({
    method: 'POST',
    path: '/tasks',
    // the body should be parsed by a JSON.parse() prior to passing in (if applicable).
    body: { task: 'Buy Milk', quantity: 2 }
  })

  const body = { id: 1, task: 'Buy Milk', quantity: 2, dateCompleted: null }
  const headers = {}

  // This will validate the response code, body, and headers. It will also correctly serialize
  // the body and headers for sending to the client that made the request. Using this method
  // you'll never send back a response that does not match what your OpenAPI document defines.
  const [ res, error ] = req.response(200, body, headers)
  console.log(res.body, res.headers)
}

run.catch(console.error)
```
