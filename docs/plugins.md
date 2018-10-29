# Plugins

// TODO: validate the examples

It is possible to extend any of the [enforcer components](#) that make up the enforcer tree. Some of the things you can do with a plugin include:

1. Create additional validation rules ([using object composition](#object-composition))
2. Create custom [schema data type formats](#) ([using object composition](#object-composition))
3. Add functionality to all instances of an enforcer component ([using inheritance](#inheritance))
4. Add data or functionality to just some instances of an enforcer component ([using object composition](#object-composition))

## Inheritance

Use inheritance to add functionality to all instances of an enforcer component. This is done by extending the enforcer component's prototype.

#### Example

Take this example of the [Info Object](#) component that is required to have a `title` property. We want to add a function that returns the title in all caps.

```js
const Enforcer = require('openapi-enforcer');
const Info = Enforcer.v2_0.Info;

// add functionality
Info.prototype.titleInCaps = function () {
    return this.title.toUpperCase();
}

// create an Info instance
const [ info ] = new Info({ title: 'My Title', version: '1.0' });

// call the added function
console.log(info.titleInCaps()); // => MY TITLE
```

## Object Composition

#### Example: Add Additional Custom Validation

In this example we add validation to ensure that the [Info Object](#) `title` always has the first letter capitalized.

```js
const Enforcer = require('openapi-enforcer');
const Info = Enforcer.v2_0.Info;

// add additional functionaly (in this case validation) to the Info enforcer
Info.extend(function (data) {
    const { exception } = data;
    const firstLetter = this.title[0];
    if (firstLetter < 'A' || firstLetter > 'Z') {
        exception('The title must have the first letter capitalized');
    }
});

// create a OpenAPI definition
const definition = {
    swagger: '2.0',
    info: {
        title: 'my title',
        version: '1.0'
    },
    paths: {}
};

// validate the definition
const [ , error ] = Enforcer.v2_0.OpenAPI(definition);
console.log(error); // TODO: add example output
```

#### Example: Add Data to an Instance

```js
const Enforcer = require('openapi-enforcer');
const Schema = Enforcer.v2_0.Schema;

Schema.extend(function (data) {
    const { parent } = data;

    // add a data property for the parent schema of this schema
    this.parentSchema = parent.enforcer === Schema
        ? parent.value
        : null;
});

const [ schemaX ] = Enforcer.v2_0.Schema({
    type: 'object',
    properties: {
        child: {
            type: 'string'
        }
    }
});

console.log(schemaX.parentSchema); // => null
console.log(schemaX.properties.child.parentSchema); // => schemaX
```