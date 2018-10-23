# Schema

## Adding Custom Data Type Formats

It is possible to extend the custom data types to enable custom format deserialization, serialization, validation, and even random value generation.

When defining a custom data type format you must define handler functions for the `deserialize`, `serialize`, and `validate` properties. You can also optionally define the `random` handler function.

##### Define Custom Format for All Schema Instances

The define a custom data type format for all schema instances you can define them staticly.

```js
const Schema = require('openapi-enforcer/components/schema');

Schema.define('string', 'person-id', {
    deserialize() {},
});
```

##### Define Custom Format for Some Schema Instances

You may not want a custom data type format to exist for all schemas. If that is the case you can [extend](#) the schema instance.

```js
const Schema = require('openapi-enforcer/components/schema');

Schema.extend(function(data) {

});

Schema.define('string', 'person-id', {
    deserialize() {},
});
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

const { Schema, Value } = require('openapi-enforcer');

const schema = Schema(3, { type: 'number' });
let exception;
let value;

[ value, exception ] = schema.deserialize("1");
// value: undefined
// exception: Expected a number. Received: "1"

const input = Value("1", { coerce: true });
[ value, exception] = schema.deserialize(input);
// value: 1
// exception: undefined
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
