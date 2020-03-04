---
title: Schema
subtitle: API Reference
---

**Nullable Values**

The OpenAPI specification v2 does not allow for nullable values in schemas, but to accommodate for that need a property `x-nullable` can be defined on any schema to allow the `null` value.
   
# Instance Methods

## deserialize

`Schema.prototype.deserialize ( value [, options ] ) : EnforcerResult < any >`

Schema instances can deserialize values. Deserialization is the process of extracting a data structure from a scalar value. For example, the string `2000-01-01` as a date string would be deserialized to `new Date('2000-01-01')` which gives you a date object instead of a date string.

Note that the deserialization process keeps validation to a minimum. It won't care if a decimal number was provided for an `integer` type, but it will care if `"hello"` is provided as an `integer`.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **value** | The value to deserialize | any | |
| options | Deserialization options. See the options table below for details. | object | |

**Deserialization Options**

| Option | Description | Type | Default |
| ------ | ----------- | ---- | ------- |
| strict | Whether to enable strict deserialization. Setting to `false` will allow strings to deserialize for booleans, integers, and numbers. It will also allow booleans to deserialize from numbers. Keeping `true` will reduce false positives. | boolean | `true` |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to the deserialized value.

**Example**

```js
const Enforcer = require('openapi-enforcer')
const [ schema ] = new Enforcer.v3_0.Schema({ type: 'string', format: 'date-time' })

const [ value ] = schema.deserialize('2000-01-01T00:00:00.000Z')

console.log(value instanceof Date)  // true
console.log(value.getFullYear())    // 2000
```

## discriminate
 
`Schema.prototype.discriminate ( value [, details ]) : object`

Schemas that use discriminators allow polymorphism or schema selection functionality. This function is used to get the Schema instance that is referenced through the discriminator.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **value** | The object containing the discriminator property | `object` | |
| details | Whether to get back just the Schema instance (`false`) or the Schema instance, property name, and property value (`true`). | `boolean` | `false` |

**Returns:** The discriminator Schema instance if `details=false`, or and object with the properties `key` (discriminator property name), `name` (value property name), and `schema` (the Schema instance) if `details=true`.

**Example**

```js
const Enforcer = require('openapi-enforcer')

const definition = {
    swagger: '2.0',
    info: { title: '', version: '' },
    paths: {},
    definitions: {
        Cat: {
            allOf: [
                { '$ref': '#/definitions/Pet' },
                {
                    type: 'object',
                    properties: {
                        birthDate: { type: 'string' },
                        huntingSkill: { type: 'string' },
                    }
                }
            ]
        },
        Dog: {
            allOf: [
                { '$ref': '#/definitions/Pet' },
                {
                    type: 'object',
                    properties: {
                        birthDate: { type: 'string', format: 'date' },
                        packSize: { type: 'integer', minimum: 1 }
                    }
                }
            ]
        },
        Pet: {
            type: 'object',
            required: ['petType'],
            properties: {
                petType: { type: 'string' }
            },
            discriminator: 'petType'
        }
    }
}

Enforcer(definition)
    .then(enforcer => {
        const schema = enforcer.definitions.Pet
        const dogSchema = schema.discriminate({ petType: 'Dog' })
        console.log(dogSchema === enforcer.definitions.Dog)  // true
    })
```

## formalize

`Schema.prototype.formalize ( value ) : any`

This is a convenience function that calls the static [Schema.formalize](#formalize-1) function. Please see the documentation for [Schema.formalize](#formalize-1) for usage and examples.  

## populate
 
`Schema.prototype.populate ([ params [, value [, options ] ] ]) : EnforcerResult < any >`

This method is used to generate values using a combination of a parameters map and the schema definition.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| params | An object map, tying key value pairs to locations in the schema definition. | `object` | `{}` |
| value | An initial value to start with. Properties already defined in this value will not be overwritten during population. | any | |
| options | Options to apply during population. See below. | `object` | |

**Options Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| copy | Whether to copy the initial value (`true`) or mutate the initial value (`false`). | `boolean` | `false` |
| conditions |  Whether to check that the condition (`x-condition`) is met prior to population for a value. | `boolean` | `true` |
| defaults | Whether to apply default value (`x-default` then `default`) if no other value is specified. | `boolean` | `true` |
| depth | How deep to traverse an object that is being built. | `number` | `100` |
| replacement | The template replacement method to use. Options include `colon` (`:name`), `doubleHandlerBar` (`{{name}}`), or `handlebar` (`{name}`). | `string` | `'handlebar'` |
| templateDefaults | Whether to apply template replacement to default values. | `boolean` | `true` |
| templates | Whether to use templating (`x-template`) to populate the value. | `boolean` | `true` |
| variables | Whether to use variables (`x-variable`) to populate the value. | `boolean` | `true` |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to the populated value.

**Example**

```js
const Enforcer = require('openapi-enforcer')
const [ schema ] = new Enforcer.v3_0.Schema({
    type: 'object',
    properties: {
        age: {
            type: 'integer',
            'x-variable': 'age',
            'x-condition': 'above18'
        },
        firstName: {
            type: 'string',
            'x-variable': 'first'
        },
        fullName: {
            type: 'string',
            default: '{first} {last}'
        },
        lastName: {
            type: 'string',
            'x-variable': 'last'
        }
    }
})

const [ adult ] = schema.populate({
    above18: true,
    age: 25,
    first: 'Bob',
    last: 'Johnson'
})

const [ child ] = schema.populate({
    above18: false,
    age: 6,
    first: 'Tim',
    last: 'Turner'
})

console.log(adult)
// {
//     age: 25,
//     firstName: 'Bob',
//     fullName: 'Bob Johnson',
//     lastName: 'Johnson'
// }

console.log(child)
// {
//     firstName: 'Tim',
//     fullName: 'Tim Turner',
//     lastName: 'Turner'
// }
```

## random

`Schema.prototype.random ([ value [, options ] ]) : EnforcerResult < any >`

Generate a random value that complies with the schema definition.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| value | An initial value to use to begin adding randomly generated values to. | any | |
| options | Configuration options. See below. | `object` | |

**Options Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| additionalPropertiesPossibility | A number between `0` and `1` that signifies the possibility of additional properties being added to objects that allow them. In cases where the definition's `minProperties` has not been reached or if a property is required but not defined as a known property then that additional property will be added, regardless of the `additionalPropertiesPossibility` value. | `number` | `0` |
| arrayVariation | The maximum random array size. This value may be overwritten if the schema defines `minItems` or `maxItems` that do not fit this value. | `number` | `4` |
| copy | Whether the passed in value should be copied (`true`) or mutated (`false`). | `boolean`  | `false`  |
| defaultPossibility | A number between `0` and `1` that signifies the possibility of a default value being used when one exists. | `number` | `0.25` |
| definedPropertyPossibility | A number between `0` and `1` that signifies the possibility of setting a value for an object with a defined property. If the property is required then the random value will be set regardless of the `defaultPossibility` value. | `number` | `0.80`  |
| maxDepth | Maximum depth to build to for a random object or array. | `number` | `10` |
| numberVariation | The amount of variation to have between high and low numbers. This value will be overwritten if `minimum` and `maximum` are defined for the schema. | `number` | `1000` |
| uniqueItemRetry | The number of times to attempt to come up with a unique value for arrays that have `uniqueItems` set to `true`. | `number` | `5` |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to the random value.

**Example**

```js
const Enforcer = require('openapi-enforcer')
const [ schema ] = new Enforcer.v3_0.Schema({
    type: 'number',
    minimum: 0,
    multipleOf: 0.5
})

const [ value ] = schema.random()

console.log(value)  // 1.5
```

## serialize

`Schema.prototype.serialize ( value ) : EnforcerResult < any >`

Serialization is the process of converting a data structure to a scalar value. For example, the date object `new Date('2000-01-01')` would be serialized to the string `2000-01-01` if the `type=string` and `format=date`.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **value** | The value to serialize. | `any` | |

**Returns:** An [EnforcerResult](../enforcer-result.md) that resolves to the serialized value.

**Example**

```js
const Enforcer = require('openapi-enforcer')
const [ schema ] = new Enforcer.v3_0.Schema({ type: 'string', format: 'date' })

const [ value ] = schema.serialize(new Date('2000-01-01T00:00:00.000Z'))

console.log(value)  // '2000-01-01'
```

## validate

`Schema.prototype.validate ( value ) : EnforcerException | undefined`

Validate a deserialized value against the schema.

**Parameters:**

- *value* - The deserialized value to validate

**Returns:** An [EnforcerException](../enforcer-exception.md) object an the value is not valid, otherwise `undefined`.

**Example**

```js
const Enforcer = require('openapi-enforcer')
const [ schema ] = new Enforcer.v3_0.Schema({ type: 'string'  })

const err = schema.validate(123)
console.log(err)
// Invalid value
//   Expected a string. Received: 123
```

{% import to-object.md %}

# Static Methods

### defineDataTypeFormat

`Schema.defineDataTypeFormat ( type, format, configuration ) : undefined`

This is a static method that is used to define custom data formats, their serialization and deserialization, and their validation. If you have custom object classes that need special serialization, deserialization, and validation then this method is where you can define that.

Built into the system already is support for type `'string'` for formats `'binary'`, `'byte'`, `'date'`, and `'date-time'`.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| **type** | The type that this data format definition will apply to. This is directly tied to the OpenAPI document schemas `type` property, therefore this value must be one of `'boolean'`, `'integer'`, `'number'`, or `'string'` as defined in the OpenAPI specification. | `string` | |
| **format** | The name of the format that this type definition will apply to. | `string` | |
| **configuration** | The configuration instructions for this type and format. See below. | `object` | |

**Configuration Parameter**

| Property | Description | Type  | Default |
| --------- | ----------- | ---- | ------- |
| **constructors** | An array of functions to be recognized as constructors. | `Array < function >` |  |
| **deserialize** | The function to call to deserialize the value. It receives one parameter, an object, with properties `exception`, `schema`, and `value` which contains the serialized value. This function should return the deserialized value. | `function` |  |
| isNumeric | If this value is numeric then it allows the schema properties `maximum`, `minimum`, `exclusiveMaximum`, `exclusiveMinimum`, and `multipleOf`. Defaults to `true` if the type is `integer` or `number`, otherwise `false`. | `boolean` | See description |
| random | The function to call to generate a random deserialized value. It receives one parameter, an object, with properties `exception` and `schema`. The function should return the deserialized value. | `function` |  |
| **serialize** | The function to call to serialize the value. It receives one parameter, an object, with properties `exception`, `schema`, and `value` which contains the deserialized value. This function should return the serialized value. | `function` |  |
| **validate** | The function to call to validate the deserialized value. It receives one parameter, and object, with the properties `exception`, `schema`, and `value` which contains the deserialized value. This function does not need to return anything and can report errors via the `exception` object. | `function` |  |

**Returns:** `undefined`.

**Example**

This example shows how you might define a decimal type that uses exact decimal values (instead of floating point). The example omits many validations and scenarios for simplicity sake.

```js
// define the Decimal class
class Decimal {
  constructor (value) {
    const array = value.split('.')
    this.characteristic = array[0]
    this.mantissa = array[1] || '0'
  }

  valueOf () {
    return +this.characteristic + +this.mantissa / Math.pow(10, this.mantissa.length)
  }

  toString () {
      return this.characteristic + '.' + this.mantissa
  }
}

// define a "decimal" format
const Schema = require('openapi-enforcer').v3_0.Schema
Schema.defineDataTypeFormat('string', 'decimal', {
    constructors: [ Decimal ],
    
    // define how to deserialize a value
    deserialize: (exception, value) => new Decimal(value),

    // is numeric - allows schema maximum, minimum, exclusiveMaximum, etc.
    isNumeric: true,

    // generate a random value
    random: (exception) => new Decimal(String(Math.random() * 100)),

    // define how to serialize a value
    serialize: (exception, value) => value.toString(),

    // define validation function for deserialized value
    validate: (exception, value) => {
        if (this.hasOwnProperty('minimum') && this.minimum > +value) {
            exception.message('Value must be above the minimum of ' + 
                this.minimum + '. Received: ' + value)
        }
    }
})

// create a schema that uses the "decimal" format
const [ schema ] = new Schema({ type: 'string', format: 'decimal' })

// deserialize a "decimal"
const [ value ] = schema.deserialize('2.49')

console.log(value instanceof Decimal)   // true
console.log(+value)                     // 2.49
```

## extractValue

`Schema.extractValue ( value )`

This is an [alias for the `Schema.Value.extract` function](./schema-value/index.md).

## formalize

`Schema.formalize ( value ) : any`

A schema instance's [serialize](#serialize) and [validate](#validate) functions require that objects meet one of two criteria:

1. Objects must be plain objects, or
2. Objects must have a [defined schema data type](#definedatatypeformat) that defines serialization and validation.

To this end, `formalize` will correctly convert your non plain objects to a format that can be used by the [serialize](#serialize) and [validate](#validate) functions. In other words, this function will convert a non plain object to either a plain object equivalent or it maintain the defined type.

**Parameters:**

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| value | The value to formalize | any | |

**Returns** a formalized value.

**Example**

```js
function Person (name, birthdate) {
    this.name = name;
    this.birthdate = birthdate;
}

const person = new Person('bob', new Date('2000-01-01T00:00:00.000Z'))

const plainObject = Enforcer.v3_0.formalize(person)
```

## Value

`Schema.value ( value, options ) : any`

This is a sub class used only by the Schema and is used to provide more fine grained control over what parts of a value serialize, deserialize, validate, and populate.

[Navigate to Schema.Value documentation](./schema-value/index.md)
