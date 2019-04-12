---
layout: page
title: Schema Value
subtitle: API
permalink: /api/schema-value
toc: true
---

The [Schema component](../api/components/schema) has functions for serialization, deserialization, and validation to name a few. Generally those functions affect the entire value passed in as a parameter, but that doesn't have to be the case in all scenarios.

The [Schema component Value](../api/components/schema#value) is used to wrap a value and modify what parts should be excluded from serialization, deserialization, and validation.

**Example with Partial Deserialization**

```js
const Enforcer = require('openapi-enforcer')
const Schema = Enforcer.v3_0.Schema

const [ schema ] = new Schema({
    type: 'object',
    properties: {
        x: {
            type: 'string',
            format: 'date'
        },
        y: {
            type: 'string',
            format: 'date'
        }
    }
})

// deserialize part of the object
let [ value ] = schema.deserialize({
    x: '2000-01-01',
    y: new Schema.Value('2001-01-01', { serialize: false })
})

// convert the value back into a plain object
value = Schema.extractValue(value)

console.log(value)
// {
//     x: [Date],
//     y: '2001-01-01'
// }
```

# Create a Schema Value

`Schema.Value ( value [, options ]) : SchemaValue`

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **value** | The value to wrap | any | |
| options | See below. | any | |

**Options Parameter**

| Property | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| populate | Whether to effect [population](./schema#populate) on the value. | `boolean` | `true` |
| serialize | Whether to effect [serialization](./schema#serialize) or [deserialization](./schema#deserialize) on the value. | `boolean` | `true` |
| validate | Whether to effect [validation](./schema#validate) on the value. | `boolean` | `true` |

**Returns** the wrapped value.

**Example**

```js
const Enforcer = require('openapi-enforcer')
const Schema = Enforcer.v3_0.Schema

// convert value to SchemaValue instance
const schemaValue = new Schema.Value('hello', {
    populate: true,   // default true
    serialize: true,  // default true
    validate: true    // default true
})

// run your serialize, deserialize, validate, or populate here
// ... do stuff

// extract value from SchemaValue instance
const value = Schema.extractValue(schemaValue)

console.log(value)  // 'hello'
```

# Instance Methods

## attributes

`Schema.Value.prototype.attributes () : object`

Get the current attributes for the schema value instance.

**Parameters:** None

**Returns:** An object with the properties `populate`, `serialize`, `validate`, and `value`.

**Example**

```js
const Schema = Enforcer.v2_0.Schema

const value = Schema.value(1234, { validate: false })

console.log(value.attributes())
// {
//     populate: true,
//     serialize: true,
//     validate: false,
//     value: 1234
// }
```

## inherit

## extract

# Static Methods

## getAttributes

