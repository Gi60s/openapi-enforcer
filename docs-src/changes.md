---
title: Change History
toc: 2
---

## 1.10.0

- **Added a custom ref parser to provide sufficient context to OpenAPI v3 discriminator mappings.**

    The previous parser had limitations when discriminators existed outside the primary OpenAPI definition file.
    
- **Added a production option to improve load times for production.**

    This is accomplished by performing fewer validations on your OpenAPI definition, but your definition must still be valid otherwise runtime errors will occur.
    
## 1.9.0

- **Add default values to request inputs.**

    Previous versions incorrectly forgot to add default data to the request object. For example, now:
     
     1. If you OpenAPI document specified a query parameter with a default value and...
     2. the client's request did not include that query parameter...
     3. then producing a request object with the [OpenAPI#request function](https://byu-oit.github.io/openapi-enforcer/api/components/openapi#request) will return a processed request object will have the default value added automatically.
