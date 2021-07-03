
# To Do List

In this section we can write down what still needs to be done with a proceeding empty checkbox and then put
an `X` in the box when that item is complete.

## Component Schema Testing

Each of the components is programmed to validate definitions, but we need to go through the spec
and write tests ensuring that the validator does what we expect it to. Below is a list of components:

- [X] Callback
- [ ] Components
- [ ] Contact
- [ ] Definitions
- [ ] Discriminator
- [ ] Encoding
- [ ] Example
- [ ] ExternalDocumentation
- [ ] Header
- [ ] Info
- [ ] Items
- [ ] License
- [ ] Link
- [ ] MediaType
- [ ] OAuthFlow
- [ ] OAuthFlows
- [ ] OpenAPI
- [ ] Operation
- [ ] Parameter
- [ ] PathItem
- [ ] Paths
- [ ] Reference
- [ ] RequestBody
- [ ] Response
- [ ] Responses
- [ ] Schema
- [ ] SecurityRequirement
- [ ] SecurityScheme
- [ ] Server
- [ ] ServerVariable
- [ ] Swagger
- [ ] Tag
- [ ] Xml

## Component Methods

Many of these component methods are a carry over from v1. You can see what they
should do by looking at the documentation: https://byu-oit.github.io/openapi-enforcer/api/components

### Base Class

This is the class that all other classes inherit from.

Implement the following methods:

- [ ] `toObject`

Test the following methods:

- [ ] `toObject`

### OpenAPI / Swagger

Implement the following methods:

- [ ] `path`
- [ ] `request`
- [X] Static `load`

Test the following methods:

- [ ] `path`
- [ ] `request`
- [ ] Static `load`

### Operation

Implement the following methods:

- [ ] `getResponseContentTypeMatches`
- [ ] `request`
- [ ] `response`

Test the following methods:

- [ ] `getResponseContentTypeMatches`
- [ ] `request`
- [ ] `response`

### Schema

Implement the following methods:

- [ ] `deserialize`
- [ ] `discriminate`
- [ ] `populate`
- [ ] `random`
- [ ] `serialize`
- [ ] `validate`
- [ ] Static `defineDataTypeFormat`
- [ ] Static `hook`
- [ ] Static `unhook`

Test the following methods:

- [ ] `deserialize`
- [ ] `discriminate`
- [ ] `populate`
- [ ] `random`
- [ ] `serialize`
- [ ] `validate`
- [ ] Static `defineDataTypeFormat`
- [ ] Static `hook`
- [ ] Static `unhook`

# Potential Usage Examples

This is how I think I'd like it to be used.

```js
import { OpenAPI } from 'openapi-enforcer'

// configure defaults
config({
  version: '3.0.2'
})

// add hooks
OpenAPI.on('validate', function (data, component) {
  
})

// load, dereference, validate, and build
// Defaults to deserialize and validate
let openapi = await OpenAPI.load('./path/to/openapi.yml', { dereference: true, validate: true })
```