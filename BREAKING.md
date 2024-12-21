# Breaking Changes

## Binary Type Formatter

```
SchemaTypeFormat/BinaryTypeFormat
```

For schema's of type `string` and format `binary`, ArrayBuffer is not being used instead of Buffer. This allows for the
browser and NodeJs to both serialize and deserialize.

