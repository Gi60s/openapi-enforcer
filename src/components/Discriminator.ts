import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import * as Schema from './Schema'
import { addExceptionLocation, no } from '../util'
import { lookupLocation, getReferenceNode } from '../loader'
import * as E from '../Exception/methods'

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
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#discriminator-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#discriminator-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#discriminator-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#discriminator-object'
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
              type: 'string'
            },
            build (data, componentDef) {
              // replace discriminator mapping references with objects or Schema instances
              data.root.finally.push(() => {
                console.log('==== ' + data.mode.toUpperCase() + ' FINALLY RUN ====')

                const { definition, exception } = data
                const loc = lookupLocation(definition)
                const rootNodePath = loc?.source
                Object.keys(definition)
                  .forEach(key => {
                    const ref = definition[key]
                    if (typeof rootNodePath === 'string') {
                      const node = getReferenceNode(data.loadCache, rootNodePath, ref, exception.at(key))
                      if (node !== undefined) {
                        console.log('Found node: ' + (ref as string))

                        // if build mode then look up the built Schema instance
                        if (data.mode === 'build') {
                          const store = data.map.get(Schema.Schema)
                          const found = store?.find(item => item.definition === node)
                          if (found !== undefined) data.built[key] = found.instance

                        // if validate mode then the node object is sufficient
                        } else {
                          data.built[key] = node
                        }
                      } else {
                        console.log('Node not found: ' + (ref as string))
                        // const refNotResolved = E.refNotResolved(ref, rootNodePath)
                        // addExceptionLocation(refNotResolved, lookupLocation(definition, key, 'value'))
                        // exception.message(refNotResolved)
                      }
                    } else {
                      console.log('Root node not found')
                      // const refNotResolved = E.refNotResolved(ref, 'unknown')
                      // addExceptionLocation(refNotResolved, loc)
                      // exception.message(refNotResolved)
                    }
                  })
              })
              return data.built
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
