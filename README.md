
# OpenAPI-Enforcer

**Supports OpenAPI 2.0 (formerly Swagger) and OpenAPI 3.0.0**

Features

- Connect middleware*
- Request parsing and validating*
- Response building, formatting, and validating*
- Schema validation

\* *Some features coming soon*

**THIS IS A WORK IN PROGRESS - SUBJECT TO CHANGE**

# Table of Contents

- [API](#api)
    - [new Enforcer](#new-enforcer--definition--options--)
        - [options](#options)
    - [enforcer.errors](#enforcererrors--schema-value-)
    - [enforcer.format](#enforcerformat--schema-value-)
    - [enforcer.populate](#enforcerpopulate--schema-params--value--)
    - [enforcer.validate](#enforcervalidate--schema-value-)

# API

## new Enforcer ( definition [, options ] ) 

Create an OpenAPI enforcer instance.

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| definition | An openapi document or a string representing the version to use. | `string` or `object` | |
| options | The configuration options to apply to the instance. | `object` | `{}` |

Returns: An instance of the OpenAPI Enforcer

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

### Options

The `options` object defines options for several functions. Those options are broken into their specific categories.

```js
const options = {
    populate: {     // options apply to enforcer.populate
        autoFormat: false,
        copy: false,
        defaults: true,
        ignoreMissingRequired: true,
        replacement: 'handlebar',
        templateDefaults: true,
        templates: true,
        variables: true
    },
    
    request: {      // options apply to enforce.middleware and enforce.request
        purge: true,
        strict: true
    },
    
    validate: {     // options apply to enforce.errors and enforce.validate
        
    }
}
```

#### options.populate.autoFormat

If set to `true` then values will automatically be [formatted](#enforcerformat--schema-value-) while populating.

Default: `false` 

#### options.populate.copy

When executing [`enforcer.populate(schema, params [, initialValue ])`](#enforcerpopulate--schema-params--value--) and providing an `initialValue` you have the option to either mutate (modify) that value or to create a copy of the value and mutate that. Mutation is faster, but if you do not want to change the passed in `initialValue` then you should set this value to `true`. 

Default: `false`

#### options.populate.defaults

Allow populated values to be built from a schema's `default` value. 

[More about default, x-template, and x-variable](#about-default-x-template-and-x-variable).

Default: `true`

#### options.populate.ignoreMissingRequired

When executing [`enforcer.populate(schema, params [, initialValue ])`](#enforcerpopulate--schema-params--value--) there will be times where an object with required properties is missing values for those required properties. If this value is set to `false` then [`enforcer.populate`](#enforcerpopulate--schema-params--value--) will not add the object to the populated value. If set to `true` then partially completed objects will still be added to the populated value.

Default: `true`

#### options.populate.replacement

The template [parameter replacement](#parameter-replacement) format to use. This can be one of `'handlebar'`, `'doubleHandlebar'`, or `'colon'`. 

| Format | Example |
| ------ | ------- |
| handlebar | `{param}` |
| doubleHandlebar | `{{param}}` |
| colon | `:param` |

Default: `'handlebar'`

#### options.populate.templateDefaults

If this is set to `true` and a default is being use to populate a value and the default value is a string then the value will act as an `x-template` value. This can be useful because `default` values generally appear in generated documentation but you may still want to perform an `x-template` transformation on the value.

#### options.populate.templates

Allow populated values to be built from a schema's `x-template` value. 

[More about default, x-template, and x-variable](#about-default-x-template-and-x-variable).

Default: `true`

#### options.populate.variables

Allow populated values to be built from a schema's `x-variable` value. 

[More about default, x-template, and x-variable](#about-default-x-template-and-x-variable).

Default: `true`

#### options.request.strict

If data is provided in the request body or query parameters that is not defined in the OpenAPI document then a 400 error will be generated.

Default: `false`

#### options.request.files

TODO: move this to request function - files and fields should be in body

The OpenAPI Enforcer does not support request body parsing. Use existing tools like [body-parser](https://www.npmjs.com/package/body-parser) or [formidable](https://www.npmjs.com/package/formidable) for that.

If a request's body has `multipart/form-data` content with binary file uploads then the data associated

If a request is sending one or more files then the request parser/validator needs to know where those files are being stored on the request object. Validation on 

```js
const Enforcer = require('openapi-enforcer');
const express = require('express');
const formidable = require('formidable');

const options = {
    request: { files: 'files' }
};
const enforcer = new Enforcer({ openapi: '3.0.0' }, options);

const app = express();

// middleware to parse multipart/form-data 
app.use(function (req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) return next(err);
        req.body = Object.assign({}, fields, files);
        next();
    });
});

app.use(enforcer.middleware());
```

Default: `'files'`



## enforcer.errors ( schema, value )

Validate a value against a schema and receive a detailed report where errors exist and why.

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

## enforcer.format ( schema, value )

Format a value to match the schema. This works for primitives, arrays, and objects. Arrays and objects will be traversed and their values also formatted recursively.

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to format to. | `object` |
| value | The value to format. | Any |

Returns: The formatted value.

Can format:

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

const value = enforcer.format(schema, {
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

## enforcer.populate ( schema, params [, value ] )

Build a value from a schema. While traversing the schema the final populated value may be derived from the provided value in combination with the schema's `default` value, the `x-template` value, or the `x-variable` value.

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to build from | `object` |
| params | A map of keys to values. These values are used to help build the final value | `object` |
| value | An initial value to start with. | Any |

Returns: The populated value.

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

## enforcer.validate ( schema, value )

Validate that the value adheres to the schema or throw an `Error`. This function calls [`enforcer.errors`](#enforcererrors--schema-value-) and if any errors occur then it packages them into a single `Error` instance and throws the `Error`.

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| schema | The schema to build from | `object` |
| params | A map of keys to values. These values are used to help build the final value | `object` |
| value | An initial value to start with. | Any |

Returns: Nothing.

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