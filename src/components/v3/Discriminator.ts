import { OASComponent, Version, DefinitionException, ComponentSchema, Reference } from '../index'
import { Schema } from './Schema'
import { lookupLocation, getReferenceNode, traverse } from '../../utils/loader'
import * as E from '../../DefinitionException/methods'
import { Discriminator3 as Definition } from '../helpers/DefinitionTypes'

let schemaDiscriminator: ComponentSchema<Definition>

export class Discriminator extends OASComponent {
  propertyName!: string
  mapping?: Record<string, Schema>

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
    if (schemaDiscriminator === undefined) {
      schemaDiscriminator = {
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
                schema: { type: 'string' }
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
                    const { built } = componentData.context
                    const mapping = built.mapping ?? {}

                    // lookup the node by reference if loaded, otherwise traverse off the root node
                    const node = hasRootNodePath
                      ? getReferenceNode(loadCache, rootNodePath, ref) // passing in new exception because we're ignoring an errors here
                      : traverse(rootData.context.built, ref)

                    if (node === undefined) {
                      // @ts-expect-error
                      mapping[key] = new Reference({ $ref: ref }, version, data)
                    } else {
                      const store = map.get(Schema)
                      const found = store?.find(item => item.definition === node)
                      if (found === undefined) {
                        // @ts-expect-error
                        mapping[key] = new Reference({ $ref: ref }, version, data)
                      } else {
                        mapping[key] = found.instance
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

            if (mapping !== undefined) {
              componentData.root.lastly.push((rootData) => {
                const data = componentData.context.children.mapping
                const { loadCache, loadOptions } = data.root
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
                    } else if (loadOptions.dereference === true) {
                      const refNotResolved = E.refNotResolved(ref, rootNodePath, {
                        definition,
                        locations: [{ node: definition, key, type: 'value' }]
                      })
                      exception.message(refNotResolved)
                    }
                  })
              })
            }
          }
        }
      }
    }
    return schemaDiscriminator
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}
