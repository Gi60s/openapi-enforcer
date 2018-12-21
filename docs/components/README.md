# Components

A component is a class that validates a set of [Open API Specification (OAS)  rules](https://github.com/OAI/OpenAPI-Specification/tree/master/versions) as defined in https://github.com/OAI/OpenAPI-Specification/tree/master/versions.

Most components simply validate the definition provided to the component, but some also add functionality, for example the:

- [OpenAPI component](./openapi.md)
- [Operation component](./operation.md)
- [Schema component](./schema.md)
- [Swagger component](./swagger.md)

All components are [extensible](../extend-components.md), allowing you to [add custom validation rules and additional functionality](../extend-components.md). 