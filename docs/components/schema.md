# Schema

## API

### Schema.defineDataFormat

This is a static method that is used to define custom data formats, their serialization and deserialization, and their validation.

**Parameters**

- *type* [`string`] - The type to assign the custom format to. This is the data type to use when the value is serialized and must be one of `boolean`, `integer`, `number`, or `string`.

- *format* [`string`] - The name of the format.

- *configuration* [`object`] - An object defining how to serialize, deserialize, validate, etc.

    - *deserialize* [`function`] - The function to call to deserialize the value. It receives two parameters: `exception` for reporting errors and `value` which contains the serialized value. This function should return the deserialized value. Within the function `this` is the schema instance.

    - *isCollection* [`boolean] - If this value is a collection then it allows the schema properties `maxItems` and `minItems`. Defaults to `false`.
    
    - *isNumeric* [`boolean`] - If this value is numeric then it allows the schema properties `maximum`, `minimum`, `exclusiveMaximum`, `exclusiveMinimum`, and `multipleOf`. Defaults to `true` if the type is `integer` or `number`, otherwise `false`.

    - *isObject* [`boolean`] - If this value is an object then it allows the schema properties `maxProperties` and `minProperties`. Defaults to `false`.

    - *random* [`function`] - The function to call to generate a random deserialized value. It receives one parameter, `exception` for reporting errors. The function should return the deserialized value. Within the function `this` is the schema instance.

    - *serialize* [`function`] - The function to call to serialize the value. It receives two parameters: `exception` for reporting errors and `value` which contains the deserialized value. This function should return the serialized value. Within the function `this` is the schema instance.

    - *validate* [`function`] - The function to call to validate the deserialized value. It receives two parameters: `exception` for reporting errors and `value` which contains the deserialized value. This function does not need to return anything.

Returns `undefined`.

**Example**

This example shows how you might define a decimal type that uses exact decimal values. The example omits many validations and scenarios for simplicity sake.

```js
class Decimal {
  constructor (value) {
    const array = value.split('.');
    this.characteristic = array[0];
    this.mantissa = array[1];
  }

  valueOf () {
    return +this.characteristic + +this.mantissa / Math.pow(10, this.mantissa.length);
  }

  toString () {
      return this.characteristic + '.' + this.mantissa;
  }
}

const Schema = require('openapi-enforcer').v3_0.Schema;

Schema.defineDataFormat('string', 'decimal', {
    // define how to deserialize a value
    deserialize (exception, value) => new Decimal(value),

    // is numeric - allows schema maximum, minimum, exclusiveMaximum, etc.
    isNumeric: true,

    // generate a random value
    random: (exception) => new Decimal(String(Math.random() * 100)),

    // define how to serialize a value
    serialize (exception, value) => value.toString(),

    // define validation function for deserialized value
    validate (exception, value) {
        if (this.hasOwnProperty('minimum') && this.minimum > +value) {
            exception.message('Value must be above the minimum of ' + 
                this.minimum + '. Received: ' + value);
        }
    }
});
```

Then, within your OAS document you might have something like this:

```yaml
components:
    schemas:
        Decimal:
            type: 'string'
            format: 'decimal'
```

## Deserialize

Schema instances can deserialize values. Deserialization is the process of extracting a data structure from a scalar value. For example, the string `2000-01-01` as a date string would be deserialized to `new Date('2000-01-01')` which gives you a date object instaead of a date string.

Note that the deserialization process keeps validation to a minimum. It won't care if a decimal number was provided for an `integer` type, but it will care if `"hello"` is provided as an `integer`.

Exactly what happens during deserialization is determined by a combination of the value to be deserialized and how it should be deserialized. Refer to the following table for details.

### Coercion

Some values will not deserialize without coercion. This is intentional to reduce the number of false deserializations. In other words it reduces logic errors.

Coercion can be enabled for specific values using the [EnforcerValue](#) constructor:

```js
// TODO: this example is poor because it bypasses definition validation

const enforcer = require('openapi-enforcer');

const definition = {
    swagger: '2.0',
    // ...
    definitions: {
        Number: {
            type: 'number'
        }
    }
}

enforcer(definition)
    .then(openapi => {
        const schema = openapi.definitions.Number;
        let exception;
        let value;

        [ value, exception ] = schema.deserialize("1");
        // value: undefined
        // exception: Expected a number. Received: "1"

        const input = Value("1", { coerce: true });
        [ value, exception] = schema.deserialize(input);
        // value: 1
        // exception: undefined
    });
```

#### Booleans

The values `true` and `false` are already scalar values and valid for data transmission.

| Format | Scalar Value | Needs Coercion | Deserialized Value |
| ------ | ------------ | -------------- | ------------------ |
| N/A | `true` | No | `true` |
| N/A | `false` | No | `false` |
| N/A | `""` (empty string) | Yes | `false` |
| N/A | `"false"` | Yes | `false` |
| N/A | non-empty string | Yes | `true` |
| N/A | falsy value | Yes | `false` |
| N/A | truthy value | Yes | `true` |

#### Integers

A number is already a scalar value and is valid for data transmission.

Integer deserialization does not care if a number has decimals; [validation](#validate) will take care of that.

| Format | Scalar Value | Needs Coercion | Deserialized Value |
| ------ | ------------ | -------------- | ------------------ |
| N/A | 1 | No | 1 |
| N/A | 1.5 | No | 1.5 |
| N/A | "1.5" | Yes | 1.5 |

#### Numbers

A number is already a scalar value and is valid for data transmission.

| Format | Scalar Value | Needs Coercion | Deserialized Value |
| ------ | ------------ | -------------- | ------------------ |
| N/A | 1 | No | 1 |
| N/A | "1" | Yes | 1 |
| N/A | "1.5" | Yes | 1.5 |

#### Strings

A string can represent a literal string or it is also often used to represent non-scalar values.

| Format | Scalar Value | Needs Coercion | Deserialized Value |
| ------ | ------------ | -------------- | ------------------ |
| binary | `"00000011"` | No | `Buffer<[3]>` |
| byte | 1 | No | 1 |
| date | 1 | No | 1 |
| date-time | 1 | No | 1 |

## Serialize

#### Strings

A string can represent a literal string or it is also often used to represent non-scalar values.

| Format | Deserialized Value | Needs Coercion | Serialized Value |
| ------ | ------------ | -------------- | ------------------ |
| binary | `false` | Yes | `"00000000"` |
| binary | `true` | Yes | `"00000001"` |
| binary | `256` | Yes | `"0000000100000000"` |

