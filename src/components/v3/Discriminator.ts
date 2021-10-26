import { OASComponent, Version, Exception, ComponentSchema, Reference } from '../index'
import * as Schema from '../Schema'
import { lookupLocation, getReferenceNode, traverse } from '../../loader'
import * as E from '../../Exception/methods'

export interface Definition {
  propertyName: string
  mapping?: Record<string, string>
}

const schemaDiscriminator: ComponentSchema<Definition> = {
  allowsSchemaExtensions: false,
  properties: [
    {
      name: 'propertyName',
      required: true,
      schema: { type: 'string' }
    },
    {
      name: 'mapping',
      schema: {
        type: 'object',
        allowsSchemaExtensions: false,
        additionalProperties: {
          type: 'string'
        }
      }
    }
  ],
  builder: {
    after (componentData) {
      const { definition: componentDef } = componentData.context
      const { mapping } = componentDef

      if (mapping !== undefined) {
        componentData.root.lastly.push((rootData) => {
          const data = componentData.context.children.mapping
          const { loadCache, map, version } = data.root
          const { definition } = data.context

          const loc = lookupLocation(definition)
          const hasRootNodePath = typeof loc?.source === 'string'
          const rootNodePath = loc?.source ?? 'In process assignment'

          Object.keys(definition)
            .forEach(key => {
              const ref = definition[key]
              const { built } = data.context.built

              // lookup the node by reference if loaded, otherwise traverse off the root node
              const node = hasRootNodePath
                ? getReferenceNode(loadCache, rootNodePath, ref) // passing in new exception because we're ignoring an errors here
                : traverse(rootData.context.built, ref)

              if (node === undefined) {
                // @ts-expect-error
                built[key] = new Reference({ $ref: ref }, version, data)
              } else {
                const store = map.get(Schema.Schema)
                const found = store?.find(item => item.definition === node)
                if (found === undefined) {
                  // @ts-expect-error
                  built[key] = new Reference({ $ref: ref }, version, data)
                } else {
                  built[key] = found.instance
                }
              }
            })
        })
      }
    }
  },
  validator: {
    after (componentData) {
      const { definition: componentDef } = componentData.context
      const { mapping } = componentDef
      const ancestor = componentData.context.chain[0]

      if (mapping !== undefined) {
        componentData.root.lastly.push((rootData) => {
          const data = componentData.context.children.mapping
          const { loadCache } = data.root
          const { definition, exception } = data.context

          const loc = lookupLocation(definition)
          const hasRootNodePath = typeof loc?.source === 'string'
          const rootNodePath = loc?.source ?? 'In process assignment'

          Object.keys(definition)
            .forEach(key => {
              const ref = definition[key]

              // lookup the node by reference if loaded, otherwise traverse off the root node
              const node = hasRootNodePath
                ? getReferenceNode(loadCache, rootNodePath, ref)
                : traverse(rootData.context.built, ref)

              if (node !== undefined) {
                data.context.built[key] = node
              } else if (hasRootNodePath) {
                // If the node wasn't found and it had a root path then it's possible that the
                // object was not dereferenced, so we'll check that by looking at associated
                // allOf/anyOf/oneOf for a match before producing an exception message. If a match
                // is found then it has not been dereferenced.
                const ancestorKey = ['allOf', 'anyOf', 'oneOf'].find(k => ancestor?.context.definition[k] !== undefined)
                let isDereferenced: boolean = true
                if (ancestorKey !== undefined) {
                  const items: any[] = ancestor.context.definition[ancestorKey]
                  const length = items.length
                  for (let i = 0; i < length; i++) {
                    if (items[i]?.$ref === ref) {
                      isDereferenced = false
                      break
                    }
                  }
                }

                if (!isDereferenced) {
                  const refNotResolved = E.refNotResolved(ref, rootNodePath, {
                    definition,
                    locations: [{ node: definition, key, type: 'value' }]
                  })
                  exception.message(refNotResolved)
                }
              }
            })
        })
      }
    }
  }
}

export class Discriminator extends OASComponent {
  readonly propertyName!: string
  readonly mapping?: Record<string, Schema.Schema>

  constructor (definition: Definition, version?: Version) {
    super(Discriminator, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#discriminator-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#discriminator-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#discriminator-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#discriminator-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaDiscriminator
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
