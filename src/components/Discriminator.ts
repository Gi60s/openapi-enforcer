import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import * as Schema from './Schema'
import { addExceptionLocation, no } from '../util'
import { lookupLocation, getReferenceNode, traverse } from '../loader'
import * as E from '../Exception/methods'

export interface Definition {
  propertyName: string
  mapping?: Record<string, string>
}

export class Discriminator extends OASComponent {
  readonly propertyName!: string
  readonly mapping?: Record<string, Schema.Schema>

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing', Discriminator, definition, version, arguments[2])
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
              data.root.component.finally.push(() => {
                const { definition, exception } = data
                // if there is no mapping data then nothing to validate or build here
                if (definition === undefined) return

                const loc = lookupLocation(definition)
                let rootNodePath = loc?.source
                const hasRootNodePath = typeof rootNodePath === 'string'
                if (!hasRootNodePath) rootNodePath = 'In process assignment'

                Object.keys(definition)
                  .forEach(key => {
                    const ref = definition[key]

                    // lookup the node by reference if loaded, otherwise traverse off the root node
                    const node = hasRootNodePath
                      ? getReferenceNode(data.loadCache, rootNodePath as string, ref, new Exception(''))
                      : traverse(data.root.built, ref, rootNodePath as string, exception.at(key))

                    if (node !== undefined) {
                      // if build mode then look up the built Schema instance
                      if (data.mode === 'build') {
                        const store = data.map.get(Schema.Schema)
                        const found = store?.find(item => item.definition === node)
                        if (found !== undefined) data.built[key] = found.instance

                        // if validate mode then the node object is sufficient
                      } else {
                        data.built[key] = node
                      }
                    } else if (hasRootNodePath) {
                      // If the node wasn't found and it had a root path then it's possible that the
                      // object was not dereferenced, so we'll check that by looking at associated
                      // allOf/anyOf/oneOf for a match before producing an exception message. If a match
                      // is found then it has not been dereferenced.
                      const ancestor = data.chain[1]
                      const ancestorKey = ['allOf', 'anyOf', 'oneOf'].find(k => ancestor?.definition?.[k] !== undefined)
                      let isDereferenced: boolean = true
                      if (ancestorKey !== undefined) {
                        const items: any[] = ancestor.definition[ancestorKey]
                        const length = items.length
                        for (let i = 0; i < length; i++) {
                          if (items[i]?.$ref === ref) {
                            isDereferenced = false
                            break
                          }
                        }
                      }

                      if (isDereferenced) {
                        const refNotResolved = E.refNotResolved(ref, rootNodePath as string)
                        addExceptionLocation(refNotResolved, lookupLocation(definition, key, 'value'))
                        exception.message(refNotResolved)
                      }
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
