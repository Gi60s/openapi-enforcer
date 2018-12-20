# Open API Enforcer Documentation

The Open API Enforcer is a library that makes it easy to work with the Open API Specification (OAS), offering these features:

- [Validate](#enforcer) your OAS documents.
- [Serialize](./components/schema.md#schemaprototypeserialize), [deserialize](./components/schema.md#schemaprototypedeserialize), and [validate values](./components/schema.md#schemaprototypevalidate) against OAS schemas.
- Identify the [operation](./components/operation.md) associated with a [request](./components/openapi.md#openapiprototyperequest).
- Request parsing and validating.
- Facilitated [response building](./components/schema.md#schemaprototypepopulate).
- Generate [random valid values](./components/schema.md#schemaprototyperandom) for a schema.
- [Plugin environment](./extend-components.md) for custom document validation and extended functionality including [custom data type formats](./components/schema.md#schemadefinedataformat).

## API

### Enforcer

This function will dereference your OAS document, validate it, produce warnings where appropriate, and generate an [OpenAPI component](./components/openapi.md) for an OAS 3.x.x document or a [Swagger component](./components/swagger.md) for Swagger 2.0.

**Parameters:**

- *definition* - A `string` file path to the OAS definition or an `object`.

- *options* - Some options for building the enforcer instance

    - *hideWarnings* - Log warning messages to the console when validating your OAS document.
    
**Throws:** A detailed error message with all errors in your OAS document. 
    
**Returns:** A Promise that resolves to an [OpenAPI component](./components/openapi.md) for an OAS 3.x.x document or a [Swagger component](./components/swagger.md) for Swagger 2.0.

**Example 1: Invalid Definition**

```js
const Enforcer = require('openapi-enforcer')

const definition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.3.4'
    },
    paths: {
        '/person/{id}': {}
    }
}

Enforcer(definition)
    .catch(err => {
        console.error(err)
        // Error: One or more errors exist in the OpenApi definition
        //   at: paths
        //     at: /person/{id}
        //       Path parameter definitions inconsistent
        //         at: get
        //           Definition missing path parameters: id
    })
```

**Example 2: Valid Definition**

```js
const definition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.3.4'
    },
    paths: {
        '/person/{id}': {
            get: {
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Success'
                    }
                }
            },
        }
    }
};

Enforcer(definition)
    .then(openapi => {
        const isOpenApiInstance = openapi instanceof Enforcer.v3_0.OpenApi
        console.log(isOpenApiInstance);  // true
    })
```

### Enforcer.dereference

Resolves all of the `$ref` values in a definition and returns the dereferenced object.

**Parameters:**

- *definition* - A `string` for the file path to the OAS definition or an `object` to dereference.

**Returns:** A promise that resolves to the dereferenced object.

### Enforcer.Enforcer

A static reference to the [Enforcer function](#enforcer). This is helpful if you're using destructuring when you require this package.

**Destructure Example**

```js
const { Enforcer, v2_0, v3_0 } = require('openapi-enforcer');
```

### Enforcer.Exception

A static reference to the the [EnforcerException class](./enforcer-exception.md).

### Enforcer.Result

A static reference to the the [EnforcerResult class](./enforcer-result.md).

### Enforcer.v2_0

An object containing class constructors for all [components](./components/README.md) that are part of the Swagger 2.0 specification:

- Contact
- Example
- ExternalDocumentation
- Header
- Info
- Items
- License
- [Operation](./components/operation.md)
- Parameter
- PathItem
- Paths
- Reference
- Response
- Responses
- [Schema](./components/schema.md)
- SecurityRequirement
- SecurityScheme
- [Swagger](./components/swagger.md)
- Tag
- Xml

### Enforcer.v3_0

An object containing class constructors for all [components](./components/README.md) that are part of the Open API Specification (OAS) 3 specification:

- Callback
- Components
- Contact
- Encoding
- Example
- ExternalDocumentation
- Header
- Info
- License
- Link
- MediaType
- OAuthFlow
- OAuthFlows
- [OpenApi](./components/openapi.md)
- [Operation](./components/operation.md)
- Parameter
- PathItem
- Paths
- Reference
- RequestBody
- Response
- Responses
- [Schema](./components/schema.md)
- SecurityRequirement
- SecurityScheme
- Server
- ServerVariable
- Tag
- Xml
