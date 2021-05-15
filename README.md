
# Usage

This is how I think I'd like it to be used.

```js
import { OpenAPI, hook, load, config } from 'openapi-enforcer'

// configure defaults
config({
  version: '3.0.2'
})

// add hooks
OpenAPI.on('validate', function (data, component) {
  
})

// load and dereference
const definition = await load('./path/to/openapi.yml', { dereference: true })

// validate and get errors
const errors = OpenAPI.validate(definition, '3.0.3')  // overwrite default version
if (errors) {
  console.error(errors)
} else {
  // will not validate - only builds
  const openapi = new OpenAPI(definition)
}
```


# Component Template

When making a new component, use the following as a template.

1. Copy this code into a new typescript file named the same as the component.
2. Replace `<Namespace>` with the name of your component
3. Update `readonly` properties, add functions, etc.
4. Update the buildSchema function, defining properties, and mapping nested component classes.

```ts
import { BaseComponent, BaseComponentContext } from './Super'
import * as Interfaces from '../Interfaces'

export default function (data: Interfaces.ComponentFactoryData): Interfaces.<Namespace>.Class {
    const schema = buildSchema()
    const components = data.components

    class <Namespace> extends BaseComponent implements Interfaces.<Namespace>.Object {
        // TODO: update this to have component's properties
        readonly title!: string;                        // required property
        readonly description?: string                   // optional property
        readonly nested?: Interfaces.<Nested>.Object    // nested component property

        constructor (definition: Interfaces.<Namespace>.Definition) {
            super(definition)
        }

        static [BaseComponentContext]: Interfaces.Super.Context = {
            components,
            Exception: data.Exception,
            options: data.options,
            validatorSchema: schema
        }
    }

    // TODO: update properties to match validator
    function buildSchema () : Interfaces.Validator.Type {
        return {
            type: 'object',
            required: ['title', 'version'],
            properties: {
                title: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                nested: {
                    type: 'object',
                    component: components.<Nested>  // component for this property
                }
            }
        }
    }

    return <Namespace>
}
```

# Interface Template

```ts
export namespace <Namespace> {
    export interface Class extends Super.Class<Definition,Object> {
        new (definition: Definition): Object
    }

    export interface Definition extends Super.Definition {
        encoding?: Components.Map<Encoding.Definition>
        example?: any
        examples?: Components.Map<Example.Definition>
        schema?: Schema.Definition
    }
    
    export interface Object extends Super.Object {
        readonly encoding?: Components.Map<Encoding.Object>
        readonly example?: any
        readonly examples?: Components.Map<Example.Object>
        readonly schema?: Schema.Object
    }
}
```

# Exception Codes

| Code | Type | Description |
| ---- | ---- | ----------- |
| `DVE-ENUM` | Definition validator error | The definition does not equal one of the enumerated values. |
| `DVE-PNAL` | Definition validator error | The definition has one or more properties that are not allowed. |
| `DVE-PREQ` | Definition validator error | The definition is missing one or more required properties. |
| `DVE-TYPE` | Definition validator error | The definition is of the wrong type. |
