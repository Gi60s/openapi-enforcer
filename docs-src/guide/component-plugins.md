---
title: Component Plugins
subtitle: Guide
---

The OpenAPI Enforcer is built from components and each component can be extended to have additional functionality and validation.
    
<details>
<summary bold>OpenAPI Specification 2.0 (formerly Swagger) Components</summary>
<div>{% import ../api/components/v2_0-components.md %}</div>
</details>

<details><summary bold>OpenAPI Specification 3.x.x Components</summary>
<div>
{% import ../api/components/v3_0-components.md %}
</div>
</details>

## Using the Extend Function

To customize a components behavior:

1. Get the component that you want to customize.

    Note that often you'll want to customize both the v2 and v3 versions of the components and you must do each separately. 

2. Call the static `extend` function on that component and add a callback function.
    
    The `extend` function takes a callback function as a parameter and that function receives an object with the following properties:
    
    | Property | Description |
    | -------- | ----------- |
    | enforcers | An object containing all other components for the version being used. If your using v2 components then this is the same object as `Enforcer.v2_0` and if you're using v3 components then this is the same object as `Enforcer.v3_0`. |
    | exception | An [EnforcerException](../api/enforcer-exception.md) object for reporting critical errors. |
    | key | The object property name or array index used to get to this instance of the object from the parent component. |
    | major | The OpenAPI specification major version number being used. For v2 components this will be `2` and for v3 components it will be `3`. |
    | minor | The OpenAPI specification minor version number being used. |
    | parent | The parent component instance that this component is a child of. |
    | patch | The OpenAPI specification patch version number being used. |
    | root | The root component instance. |
    | warn | An [EnforcerException](../api/enforcer-exception.md) object for reporting non critical warnings.
    
## Examples

### Add Custom Validation

This example adds a requirement that the Info component's title is not an empty string:

```js
const Enforcer = require('openapi-enforcer')

// 1. Get the component you want to customize
const Info = Enforcer.v2_0.Info

// 2. Call the extend function
Info.extend(function (data) {
    const { exception } = data
    if (this.title.length === 0) {
        exception.at('title').message('Value must not be empty')
    }
})

// test out the newly added validation
const [ , err ] = new Info({ title: '', version: '' })

console.log(err)
// One or more errors exist in the Info definition
//   at: title
//     Value must not be empty
```

### Add Custom Function

This example 

```js
const Enforcer = require('openapi-enforcer')
const Info2 = Enforcer.v2_0.Info
const Info3 = Enforcer.v3_0.Info

Info2.extend(function () {
    this.titleInCaps = titleInCaps
})

Info3.extend(function () {
    this.titleInCaps = titleInCaps
})

function titleInCaps() {
    return this.title.toUpperCase()
}
// create an Info instance
const [ info ] = new Info2({ title: 'My Title', version: '1.0' })

// call the added function
console.log(info.titleInCaps()) // => MY TITLE
```
