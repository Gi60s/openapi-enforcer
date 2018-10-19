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