---
title: EnforcerResult
subtitle: Guide
---

An EnforcerResult is an object that allows destructuring from an iterable or a plain object. 

The object has the properties:

- *error* - An [EnforcerException object](./enforcer-exception.md). If there is no error then this value will be `undefined`.

- *value* - The success value. This value will be `undefined` if an error occurred.

- *warning* - An [EnforcerException object](./enforcer-exception.md) with warnings that do not prevent successful operation. If there is no warning exception then this value will be `undefined`.

The iterable has the same values as the object in order of:

1) *value*

2) *error*

3) *warning*

## Read Entire Object

Probably the most well known method for reading a result, you can get the entire object and then access the properties off of that object.

```js
const result = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(result.error)
console.log(result.value)
console.log(result.warning)
```

## Destructure by Properties

Default destructuring requires the original property names to be used. You can specify as many or as few properties as you'd like to extract. It is also possible to specify the name of the extracted property.

**Specify all Properties**

```js
const { error, value, warning } = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(error)
console.log(value)
console.log(warning)
```

**Specify some Properties**

```js
const { value } = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(value)
```

**Specify Properties with Different Name**

In this example:

- `error` is renamed to `e`
- `value` is renamed to `schema`
- `warning` is not renamed

```js
const { error: e, value: schema, warning } = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(e)
console.log(schema)
console.log(warning)
```

## Destructure by Index

You can choose the names of the value, but the order is important. The order is 1) the value, 2) the error, 3) the warning.

It is not a requirement to get all three values.

**Get All Three Properties**

```js
const [ schema, err, warning ] = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(err)
console.log(schema)
console.log(warning)
```

**Get Just the Value**

```js
const [ schema ] = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(schema)
```

**Get Just the Error**

```js
const [ , err ] = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(err)
```

**Get Just the Warning**

```js
const [ , , warning ] = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(warning)
```

**Run the Iterator Multiple Times**

The iterator loops, allowing you to destructure by index indefinitely.

```js
const [ schema, error, warning, schema2, error2, warning2, schema3 ] = new Enforcer.v2_0.Schema({ type: 'string' })
console.log(schema === schema2 && schema === schema3) // true
console.log(error === error2) // true
console.log(warning === warning2) // true
```
