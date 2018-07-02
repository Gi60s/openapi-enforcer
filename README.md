
# OpenAPI-Enforcer

**Supports OpenAPI 2.0 (formerly Swagger) and OpenAPI 3.x**

Features

- Validate a value against a schema
- Determine the schema for a provided path (allows path parameters)
- Serialization and deserialization for interprocess or network communication
- Request parsing and validating
- Response building, serializing, and validating
- Generate random valid values from a schema

# Table of Contents

- [Constructor](#constructor)
    - [Enforcer.prototype.deserialize](#enforcerprototypedeserialize)
    - [Enforcer.prototype.errors](#enforcerprototypeerrors)
    - [Enforcer.prototype.path](#enforcerprototypepath)
    - [Enforcer.prototype.populate](#enforcerprototypepopulate)
    - [Enforcer.prototype.random](#enforcerprototyperandom)
    - [Enforcer.prototype.request](#enforcerprototyperequest)
    - [Enforcer.prototype.response](#enforcerprototyperesponse)
    - [Enforcer.prototype.schema](#enforcerprototypeschema)
    - [Enforcer.prototype.serialize](#enforcerprototypeserialize)
    - [Enforcer.prototype.validate](#enforcerprototypevalidate)
- [Appendix](#appendix)
    - [About default, x-template, and x-variable](#about-default-x-template-and-x-variable)
    - [Error Throwing vs Reporting](#error-throwing-vs-reporting)
    - [Parameter Replacement](#parameter-replacement)

# Example

```js
const Enforcer = require('openapi-enforcer')

// define enforcer instance
const enforcer = new Enforcer('3.0.0')

// define the user schema
const userSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1
        },
        birthday: {
            type: 'string',
            format: 'date',
        }
    }
}

// check a value for any schema errors
const errors = enforcer.errors(userSchema, {
    name: 'Bob',
    birthday: new Date('2000-01-01')
 });
```

# Constructor

Create an OpenAPI enforcer instance.

`new Enforcer ( definition [, options ] )`

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| definition | An openapi document or a string representing the version to use. | `string` or `object` |
| options | The options to use for all functions within the instance. This options can be overwritten per function called. | `object` |
| options.deserialize | The default options to apply to deserialize functions |
| options.populate | The default [options to apply to populate](#populate-options) functions. | |
| options.request | The default options to apply to request functions | |
| options.serialize | The default options to apply to serialize functions | |

| Deserialize Option | Description | Default |
| ------------------ | ----------- | ------- |
| throw | Whether errors should be [thrown or reported](#error-throwing-vs-reporting). | `true` |



| options.deserialize.throw | Set to `true` to throw errors

deserialize: {
        throw: true
    },
    errors: {
        prefix: ''
    },
    populate: {
        copy: false,
        defaults: true,
        ignoreMissingRequired: true,
        oneOf: true,
        replacement: 'handlebar',
        templateDefaults: true,
        templates: true,
        throw: true,
        variables: true
    },
    request: {
        throw: true
    },
    serialize: {
        throw: true
    }

**Returns** an instance of the OpenAPI Enforcer

**Example 1 - Version as parameter**

```js
const Enforcer = require('openapi-enforcer');
const enforcer = new Enforcer('2.0');   // create an enforcer for OpenAPI version 2.0
```

**Example 2 - Object as parameter**

```js
const Enforcer = require('openapi-enforcer');
const enforcer = new Enforcer({ openapi: '3.0.0' });   // create an enforcer for OpenAPI version 3.0.0
```

**Example 3 - Using Discriminators**

If your OpenAPI document is using discriminators then you'll want to either include the entire swagger document as the input parameter or include at least the component schemas (OpenAPI 3.x) or definitions (OpenAPI 2.0).

```js
const Enforcer = require('openapi-enforcer');

const enforcer2 = new Enforcer({
    swagger: '2.0',
    definitions: {
        // ... named schemas here
    }
});

const enforcer3 = new Enforcer({
    openapi: '3.0.0',
    components: {
        schemas: {
            // ... named schemas here
        }
    }
});
```

## Enforcer.prototype.deserialize

When a value is sent over HTTP it is in a serialized state. Calling this function will deserialize a value into its deserialized equivalent.

`Enforcer.prototype.deserialize ( schema, value [, options ] )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to use to convert serialized values. | `object` |
| value | The value to deserialize. | Any |
| options | The deserialize options | `object` |

Returns the deserialized [value or the report](#error-throwing-vs-reporting).

```js
const Enforcer = require('openapi-enforcer');

// create the enforcer instance
const enforcer = new Enforcer({ openapi: '3.0.0' });

// define a schema that defines deserialization instructions
const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        integers: {
            type: 'array',
            items: {
                type: 'integer'
            }
        },
        date: {
            type: 'string',
            format: 'date-time'
        }
    }
};

const serializedValue = {
    integers: [1, '2', 3.1, '3.8'],
    date: '2000-01-01T01:02:03:456Z'
};

const deserialized = enforcer.deserialize(schema, serializedValue);
// {
//   integers: [1, 2, 3, 4],
//   date: <Date Object>
// }
```

### Deserialize Options

The [Enforcer.prototype.deserialize](#enforcerprototypedeserialize) `options` parameter can define these properties:

| Option | Description | Default |
| ------ | ----------- | ------- |
| throw | Whether errors should be [thrown or reported](#error-throwing-vs-reporting). | `true` |

### Default Deserialize Options

You can change the global defaults for how the [Enforcer.prototype.deserialize](#enforcerprototypedeserialize) works:

```js
const Enforcer = require('openapi-enforcer');

Enforcer.defaults.deserialize = {
    throw: true
}
```



## Enforcer.prototype.errors

Validate a value against a schema and receive a detailed report where errors exist and why.

`Enforcer.prototype.errors ( schema, value )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to validate the value against. | `object` |
| value | The value to validate. | Any |

Returns: An array of strings where each item in the array describes one error that was encountered.

```js
const Enforcer = require('openapi-enforcer');

// create the enforcer instance
const enforcer = new Enforcer({ openapi: '3.0.0' });

// define a schema to validate values against
const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        names: {
            type: 'array',
            items: {
                type: 'string',
                minLength: 1
            }
        },
        date: {
            type: 'string',
            format: 'date-time',
            maximum: '2000-01-01T00:00:00.000Z'
        }
    }
};

// get any errors and log to console
const errors = enforcer.errors(schema, {
    names: [ 'Bob', 'Jan', '' ],
    date: '2010-01-01T00:00:00.000Z',
    num: 8
});
// errors ==> [
//   /names/2: String length below minimum length of 1 with length of 0: ''
//   /date: Expected date-time to be less than or equal to 2000-01-01T00:00:00.000Z. Received: 2010-01-01T00:00:00.000Z
//   /num: Property not allowed
// ]
```

## Enforcer.prototype.path

Get the matching path's path parameters and schema.

**This function will not work if you haven't defined paths in your OpenAPI document that was passed into the constructor.**

`Enforcer.prototype.path ( path )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| path | The lookup path (optionally with path parameters) | `string` |

Returns: An object with the following properties:

- *path* - The path as defined in the OpenAPI document.
- *params* - The path parameters (still serialized)
- *schema* - The path schema as defined in the OpenAPI document.

```js
const pathItem = {
    get: {},
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
                type: 'number'
            }
        }
    ]
};

const definition = {
    openapi: '3.0.0',
    paths: {
        '/path/{id}': pathItem
    }
}

// create the enforcer instance
const enforcer = new Enforcer(definition);

const match = enforcer.path('/path/25');
// {
//     path: '/path/{id}',
//     params: {
//         id: 25
//     },
//     schema: { ... } <== operation object
// }
```

## Enforcer.prototype.populate

Build a value from a schema. While traversing the schema the final populated value may be derived from the provided value in combination with the schema's `default` value, the `x-template` value, or the `x-variable` value.

`Enforcer.prototype.populate ( { schema, options, params, value } )`

This function takes one parameter (an `object`) with the following properties:

| Property | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to build a value from. This property is required. | `object` |
| params | A map of keys to values. These values are used to help build the final value | `object` |
| options | The options to apply during the build phase. Any options specified here will overwrite defaults. | `object` |
| value | An initial value to start with. | Any |

Returns: The populated value.

### Populate Options

The [`Enforcer.prototype.populate`](#enforcerprototypepopulate) `options` parameter can define these properties:

| Option | Description | Default |
| ------ | ----------- | ------- |
| copy | When executing [`Enforcer.prototype.populate`](#enforcerprototypepopulate) and providing the `value` property, you have the option to either mutate (modify) that value or to create a copy of the value and mutate that. Mutation is faster, but if you do not want to change the passed in `value` then you should set this value to `true`. | `false` |
| defaults | Allow populated values to be built from a schema's `default` value. | `true` |
| ignoreMissingRequired | When executing [`Enforcer.prototype.populate`](#enforcerprototypepopulate) there will be times where an object with required properties is missing values for those required properties. If this value is set to `false` then [`Enforcer.prototype.populate`](#enforcerprototypepopulate) will not add the object to the populated value. If set to `true` then partially completed objects will still be added to the populated value. | `true` |
| replacement | The template [parameter replacement](#parameter-replacement) format to use. This can be one of `"handlebar"`, `"doubleHandlebar"`, or `"colon"`. | `"handlebar"` |
| templateDefaults | If this is set to `true` and a default is being use to populate a value and the default value is a string then the value will act as an `x-template` value. This can be useful because `default` values generally appear in generated documentation but you may still want to perform an `x-template` transformation on the value. | `true` |
| templates | Allow populated values to be built from a schema's `x-template` value. [More about default, x-template, and x-variable](#about-default-x-template-and-x-variable). | `true` |
| throw | Whether errors should be [thrown or reported](#error-throwing-vs-reporting). | `true` |
| variables | Allow populated values to be built from a schema's `x-variable` value. [More about default, x-template, and x-variable](#about-default-x-template-and-x-variable). | `true` |

### Default Populate Options

You can change the global defaults for how the [`Enforcer.prototype.populate`](#enforcerprototypepopulate) works like this:

```js
const Enforcer = require('openapi-enforcer');

Enforcer.defaults.populate = {
    copy: false,
    defaults: true,
    ignoreMissingRequired: true,
    replacement: 'handlebar',
    templateDefaults: true,
    templates: true,
    throw: true,
    variables: true
}
```

Alternatively you can specify the same options in the [constructor](#constructor) or when calling the [`Enforcer.prototype.populate`](#enforcerprototypepopulate) function.

## Enforcer.prototype.random

Create a value that is randomly generated but that meets the constraints of a provided schema. Works on simple primitives and complex objects.

`Enforcer.prototype.random ( schema )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to use to generate the random value. | `object` |

Returns: A random value that adheres to the provided schema.

## Enforcer.prototype.request

Parse and validate input parameters for a request.

`Enforcer.prototype.request ( { body, cookies, headers, method = 'get', path } )`

This function takes one parameter, an `object`, with the following properties:

| Property | Description | Type |
| --------- | ----------- | ---- |
| body | The request body. | `string` or `object` |
| cookies | The request cookies. An `object` with cookie names as keys and cookie values as the values. | `object` |
| headers | The request headers. An `object` with cookie names as keys and cookie values as the values. | `object` |
| method | The HTTP method. Defaults to `"get"`. | `string` |
| path | The request path. This should include the query string parameters if applicable. | `string` |

Returns an object with the following properties:

- *errors* - If any errors occurred this will be an array of strings, otherwise it will be `null`.

- *path* - The path as defined in the OpenAPI document.

- *request* - The request object, serialized and validated. If an error occurred this value will be `null`.

- *response* - The same function as [`enforcer.prototype.response`](#enforcerprototyperesponse) except that the `path` and `method` properties are already specified..

- *schema* - The path operation schema as defined in the OpenAPI document.

## Enforcer.prototype.response

Get functions that provide details and functionality that is associated to a request and its response.

`Enforcer.prototype.response ( { code, contentType, method = 'get', path } )`

This function takes one parameter, an `object`, with the following properties:

| Property | Description | Required |
| --------- | ----------- | ---- |
| code | The HTTP response status code to use. If omitted and the "default" response is defined then "default" will be used, otherwise it will use the first defined response status code. | No |
| contentType | The content type of the schema to use for the response. This can use wild cards or even specify multiple acceptable content types. For example: `"*/json"`, `"application/*"`, or `"text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8"`. If omitted then the first content type defined for the specified response code will be used. | No |
| path | The request path. This value can include path parameters. | Yes |
| method | The request method. Defaults to `"GET"`. | No |

Returns an object with the following properties:

- *data* - An object with the normalized response data. In the case that the `code` or `contentType` were either not specified or used indeterminate values, this object will have the determined values as well as the response body schema to be used. In short, it is an object with these properties:

    - *code* - The determined HTTP response code that aligns with the OpenAPI document.

    - *contentType* - The determined content type that aligns with the OpenAPI document.
    
    - *schema* - The response body schema to use for this response.

    Alternatively this value may be `undefined` or partially populated if the OpenAPI document does not have a response or content type match.

    ```js
    const response = enforcer.response({
        code: 200, 
        contentType: 'application/json', 
        path: '/' 
    });
    console.log(response.data);
    ```

- *errors* - A function that returns an array of errors for the body and headers.

    Signature: `errors ( { body, headers })`
    
    Takes a configuration object as it's parameter with the following properties:

    | Property | Description |
    | ---------| ----------- |
    | body | The response body to check for errors. |
    | headers | An object with key value pairs where the key is the header name and the value is the header value. Each header name that has an associated OpenAPI schema will be checked for errors. |

    Returns an array of strings if one or more errors occurred, otherwise returns `null`.

    ```js
    const response = enforcer.response({
        code: 200, 
        contentType: 'application/json', 
        path: '/' 
    });

    const errors = response.errors({
        body: {},
        headers: {
            'x-date': new Date()
        }
    });

    if (errors) console.error(errors.join('\n'));
    ```

- *example* - A function that produces an example response. If the OpenAPI document has one or more examples then one of those will be used, otherwise it will be generated using the [`Enforcer.prototype.random`](#enforcerprototyperandom) function.

    Signature: `example ( { name, ignoreDocumentExample=false } )`
    
    Takes a configuration object as it's parameter with the following properties:

    | Property | Description |
    | ---------| ----------- |
    | name | The name of the example to use when pulling from a named OpenAPI 3.x document example. Not relevant for OpenAPI 2.0. If the `ignoreDocumentExample` property is set to `true` then this value will be ignored. |
    | ignoreDocumentExample | If set to `true` then even if an example exists in the OpenAPI document, a random one will be generated instead. Defaults to `false` |

    Returns a value that can be used as an example.

    ```js
    const response = enforcer.response({
        code: 200, 
        contentType: 'application/json', 
        path: '/' 
    });
    const example = response.example();
    ```

- *populate* - A function that uses [`enforcer.prototype.populate`](#enforcerprototypepopulate) to build a response value using the response schema and a parameter map.

    Signature: `populate ( { body, headers, options, params } )`
    
    Takes a configuration object as it's parameter with the following properties:

    | Property | Description |
    | ---------| ----------- |
    | body | The initial body value. Omit this value if you want the body to be built from scratch. |
    | headers | An initial header object with header names and values as key value pairs. If the headers object does not define the `'content-type'` header then it will be set to the same value as the `contentType` option specified by the data object. |
    | options | Options to pass to the [`enforcer.prototype.populate`](#enforcerprototypepopulate) function. |
    | params | The parameter map to pass to [`enforcer.prototype.populate`](#enforcerprototypepopulate) |

    Returns an object with `headers` and `body` properties.

    ```js
    const response = enforcer.response({
        code: 200, 
        contentType: 'application/json', 
        path: '/' 
    });

    const populated = response.populate({
        params: {},
        body: {},
        headers: {}
    });
    ```

- *serialize* - A function that takes the status code, body, and headers and then validates and then serializes the body and headers to prepare them to send as an HTTP response. If validation fails an error will be thrown.

    Signature: `serialize ( { body, headers, options, skipValidation } )`
    
    Takes a configuration object as it's parameter with the following properties:

    | Property | Description |
    | ---------| ----------- |
    | body | The initial body value. Omit this value if you want the body to be built from scratch. |
    | headers | An initial header object with header names and values as key value pairs. If the headers object does not define the `'content-type'` header then it will be set to the same value as the contentType option. |
    | options | Options to pass to the [`enforcer.prototype.serialize`](#enforcerprototypeserialize) function. |
    | skipValidation | Skip validation prior to seraialization. This can save processing cycles if you have already used `Enforcer.prototype.response().errors()` to check for errors and have found none. Skipping validation when errors exist may still cause errors to occur. Defaults to `false`. |

    Returns an object with `headers` and `body` properties.

    ```js
    const response = enforcer.response({
        code: 200, 
        contentType: 'application/json', 
        path: '/' 
    });
    
    const data = response.serialize({
        body: { 
            num: 1, 
            date: new Date() 
        },
        headers: { 'x-header': 'some value' }
    });
    ```

## Enforcer.prototype.serialize

Serialize a value according to the schema. This works for primitives, arrays, and objects. Arrays and objects will be traversed and their values also be serialized recursively.

`Enforcer.prototype.serialize ( schema, value )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to serialize to. | `object` |
| value | The value to format. | Any |

Returns: The serialized value.

Can serialize:

- arrays and objects recursively
- binary from boolean, number, string, or Buffer
- boolean from any value
- byte from boolean, number, string, or Buffer
- date from Date, string, or number
- date-time from Date, string, or number
- integer from anything that !isNaN(value)
- number from anything that !isNaN(value)
- string from string, number, boolean, object, or Date

```js
const Enforcer = require('openapi-enforcer');
const enforcer = new Enforcer('3.0.0');

const schema = {
    type: 'object',
    properties: {
        time: {
            type: 'string',
            format: 'date-time'
        },
        public: {
            type: 'boolean'
        },
        seatsAvailable: {
            type: 'integer'
        }
    }
};

const value = enforcer.serialize(schema, {
    time: new Date(2000, 0, 1, 11), // formatted to ISO Date
    public: 1,                      // formatted to true
    seatsAvailable: 23.7            // formatted to integer
});
// value ==> {
//   startTime: '2000-01-01T11:00:00.000Z',
//   public: true,
//   seatsAvailable: 24
// }
```

## Enforcer.prototype.request

Pass in an object that is representative of an HTTP request to have it validated, parsed, and deserialized. The path must match one of the definition paths.

`Enforcer.prototype.request ( req )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| request | The request. If a string is provided then it will represent the request path and all other request properties will use defaults. | `object`, `string` |

**Request Object**

| Property | Description | Default | Type |
| -------- | ----------- | ------- | ---- |
| body | The parsed request body. This value will still be deserialized and validated, but not parsed. | `undefined` | Any |
| cookie | An object of cookie key value pairs where each value is a string. | `{}` | `object` |
| header | An object of header key value pairs where each value is a string. | `{}` | `object` |
| method | The HTTP method. | `"get"` | `string` |
| path | The request path, including query string parameters. | `""` | `string` |

Returns: A parsed, deserialized, and validated request object.

```js

// create the enforcer instance
const enforcer = new Enforcer({
    openapi: '3.0.0',
    paths: {
        '/path/{id}': {
            put: {
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    x: {
                                        type: 'number'
                                    },
                                    y: {
                                        type: 'integer'
                                    },
                                    d: {
                                        type: 'string',
                                        format: 'date-time'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'number'
                    }
                },
                {
                    name: 'date',
                    in: 'query',
                    explode: true,
                    schema: {
                        type: 'string',
                        format: 'date'
                    }
                }
            ]
        }
    }
});

// parse, deserialize, and validate request
const req = enforcer.request({
    body: {
        x: '123.4',     // value will be deserialized
        y: 2,           // already deserialized is OK too
        d: '2000-01-01T01:02:03.456Z'   // will be deserialized to Date object
    },
    header: {
        'content-type': 'application/json' // needed to identify body schema
    },
    method: 'put',
    path: '/path/25?date=2000-01-01&date=2000-01-02'
});

/*
req => {
    body: {
        x: 123.4,
        y: 2,
        d: <Date Object>
    },
    header: {
        'content-type': 'application/json'
    },
    method: 'put',
    path: {
        id: 25
    },
    query: {
        date: [
            <Date Object>,
            <Date Object>
        ]
    }
}
*/
```

## Enforcer.prototype.serialize

Serialize a value for sending via HTTP. This function does not validate the value prior to serialization so you may want to use [`Enforcer.prototype.errors`](#enforcerprototypeerrors) or [`Enforcer.prototype.validate`](#enforcerprototypevalidate) prior to serialization.

Signature: `Enforcer.prototype.validate ( schema, value )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to serialize from | `object` |
| value | The value to serialize | Any |

Returns a serialized value.

## Enforcer.prototype.validate

Validate that the value adheres to the schema or throw an `Error`. This function calls [`enforcer.errors`](#enforcererrors--schema-value-) and if any errors occur then it packages them into a single `Error` instance and throws the `Error`.

`Enforcer.prototype.validate ( schema, value )`

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to build from | `object` |
| params | A map of keys to values. These values are used to help build the final value | `object` |
| value | An initial value to start with. | Any |

Returns `undefined`.

```js
const OpenApiEnforcer = require('../index');

const enforcer = new OpenApiEnforcer({ openapi: '3.0.0' });

const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        names: {
            type: 'array',
            items: {
                type: 'string',
                minLength: 1
            }
        },
        date: {
            type: 'string',
            format: 'date-time',
            maximum: '2000-01-01T00:00:00.000Z'
        }
    }
};

enforcer.validate(schema, {
    names: [ 'Bob', 'Jan', '' ],
    date: '2010-01-01T00:00:00.000Z',
    num: 8
});
// Error: One or more errors found during schema validation: 
//   /names/2: String length below minimum length of 1 with length of 0: ''
//   /date: Expected date-time to be less than or equal to 2000-01-01T00:00:00.000Z. Received: 2010-01-01T00:00:00.000Z
//   /num: Property not allowed
//     at ...
```

## Appendix

### About default, x-template, and x-variable

The `default` attribute is part of the OpenAPI specification. The type of it's value must be the same as the schema type. For example, if the schema is of type string, default cannot be a number. When `default` is a string [it can behave](#options-populate-templatedefaults) like `x-template` and [substitute parameters](#parameter-replacement) into the string. The advantage of using `default` over `x-template` in this scenario is that the `default` value will often appear in OpenAPI documentation generators.

The `x-template` value must be a string that will have [parameter replacement](#parameter-replacement) occur on it. Parameters in the string may use handlebars, double handlebars, or colons depending on how the Enforcer instance has been [configured](#optionspopulatereplacement).

The `x-variable` will perform value substitution only.

If a conflict arises between the provided value, `default`, `x-template`, or `x-variable` then the following priority is observed:

1. The provided value
2. `x-variable`
3. `x-template`
4. `default`

```js
const Enforcer = require('openapi-enforcer');
const enforcer = new Enforcer('3.0.0');

const schema = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string',
            'x-variable': 'firstName'
        },
        lastName: {
            type: 'string',
            'x-variable': 'lastName'
        },
        fullName: {
            type: 'string',
            'x-template': '{firstName} {lastName}'
        },
        profileUrl: {
            type: 'string',
            default: 'https://your-domain.com/users/{id}'
        }
    }
};

const params = {
    id: 12345,
    firstName: 'Jan',
    lastName: 'Smith'
}

const value = enforcer.populate(schema, params);
// value ==> {
//   firstName: 'Jan',
//   lastName: 'Smith',
//   fullName: 'Jan Smith',
//   profileUrl: 'https://your-domain.com/users/12345'
// }
```

### Error Throwing vs Reporting

In some cases it is useful to receive an error in the return value instead of having it thrown. To this end, some of the functions in this library have the ability to either throw an error or return it. The functions that support this functionality will have a `throw` option that defaults to `true`.

If `throw` is set to `true` then an encountered error will be thrown. If no error is encountered then the value will returned normally.

If `throw` is set to `false` then it will return an object with two properties: `error` and `value`. If an error occured then `value` will be `null`, otherwise `error` will be `null`.

```js
const data = enforcer.deserialize(schema, value, { throw: false })
if (data.error) {
    console.error('Error: ' + data.error)
} else {
    console.log('Value:' + value)
}
```

### Parameter Replacement

Parameter replacement is when part of a string is populated with parameters. This applies to a schema's `x-template` value and potentially `default` value. There are three types of replacement:

1. handlebar (default)

    ```js
    const Enforcer = require('openapi-enforcer');
    const options = {
        populate: { replacement: 'handlebar' }
    };
    const enforcer = new Enforcer('3.0.0', options);

    const schema = {
        type: 'string',
        'x-template': '{name} is {age} years old'
    };

    const value = enforcer.populate(schema, { name: 'Bob', age: 25 });
    // value ===> 'Bob is 25 years old
    ```

2. doubleHandlebar

    ```js
    const Enforcer = require('openapi-enforcer');
    const options = {
        populate: { replacement: 'doubleHandlebar' }
    };
    const enforcer = new Enforcer('3.0.0', options);

    const schema = {
        type: 'string',
        'x-template': '{{name}} is {{age}} years old'
    };

    const value = enforcer.populate(schema, { name: 'Bob', age: 25 });
    // value ===> 'Bob is 25 years old
    ```

3. colon

    ```js
    const Enforcer = require('openapi-enforcer');
    const options = {
        populate: { replacement: 'colon' }
    };
    const enforcer = new Enforcer('3.0.0', options);

    const schema = {
        type: 'string',
        'x-template': ':name is :age years old'
    };

    const value = enforcer.populate(schema, { name: 'Bob', age: 25 });
    // value ===> 'Bob is 25 years old
    ```