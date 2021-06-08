import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import * as Schema from './Schema'
import { no } from '../util'
import { lookup, traverse } from '../loader'

export interface Definition {
  [extension: string]: any
  propertyName: string
  mapping?: Record<string, string>
}

export class Discriminator extends OASComponent {
  readonly [extension: string]: any
  readonly propertyName!: string
  readonly mapping?: Record<string, Schema.Schema>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Discriminator object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#discriminator-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#discriminator-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#discriminator-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#discriminator-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: no,
      properties: [
        {
          name: 'propertyName',
          required: () => true,
          schema: { type: 'string' }
        },
        {
          name: 'mapping',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'string',
              after (data, componentDef) {
                const { definition: ref } = data
                const loc = lookup(componentDef.mapping)
                const fromPath = loc?.source ?? ''
                data.root.finally.push(rootData => {
                  console.log('from: ' + fromPath)

                  // const node = traverse()
                  console.log(ref)
                })
              }

              // type: 'component',
              // allowsRef: false,
              // component: Schema.Schema,
              // after (data) {
              //   console.log('after')
              //
              //   data.finally.push(() => {
              //     const { chain, exception } = data
              //     const parent = chain[0].definition
              //     Object.keys(parent).forEach(key => {
              //       const value = parent[key]
              //       console.log(value)
              //     })
              //   })
              //
              //   // TODO: attempt lookup of mapping reference
              // }
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
