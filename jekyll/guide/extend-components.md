# Extend Components

The OpenAPI Enforcer is built from components and each component can be extended to have additional custom functionality or additional custom validation.

## Add Custom Code to the Constructor

The `extend` function that exists for each component is a hook into the component's constructor. You can use it to completely rewrite how the the component works, to add functionality, or to add definition validation.

The steps are simple:

1. Get the component that you'd like to extend.

2. Call the `extend` function and add your callback function.

    - The callback function gets the context of the instance. Meaning `this` is the instance of the component being constructed

    - The callback function get's one parameter, `data` that is an object with the following properties:

        - *enforcers* - An object containing all other components for the version being used.

        - *exception* - An [EnforcerException](./enforcer-exception.md) object for reporting critical errors.

        - *key* - The object property name or array index used to get to this instance of the object from the parent component.

        - *major* - The major version number.

        - *minor* - The minor version number.

        - *parent* - The parent component instance.

        - *patch* - The patch version number.

        - *root* - The root component instance.

        - *warn* - An [EnforcerException](./enforcer-exception.md) object for reporting non critical warnings.

**Example**

```js
const Enforcer = require('openapi-enforcer')
const Info = Enforcer.v2_0.Info

Info.extend(function (data) {
    const { exception } = data
    if (this.title.length === 0) {
        exception.at('title').message('Value must not be empty')
    }
})

const [ , err ] = new Info({ title: '', version: '' })

console.log(err)
// One or more errors exist in the Info definition
//   at: title
//     Value must not be empty
```

## Add Component Functionality

Extending the prototype of a component will add methods to all instances of that component.

Note that if you add to the prototype of a v2_0 component that it does not add it to the v3_0 equivalent component. You'll need to add it to both separately if you want both to have the functionality.

**Example**

```js
const Enforcer = require('openapi-enforcer');
const Info2 = Enforcer.v2_0.Info;
const Info3 = Enforcer.v3_0.Info;

function titleInCaps() {
    return this.title.toUpperCase();
}

// add functionality to v2 and v3
Info2.prototype.titleInCaps = titleInCaps
Info3.prototype.titleInCaps = titleInCaps

// create an Info instance
const [ info ] = new Info2({ title: 'My Title', version: '1.0' });

// call the added function
console.log(info.titleInCaps()); // => MY TITLE
```