import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import { OASComponent, componentValidate } from '../index'
import { Schema } from './Schema'
import { lookupLocation, getReferenceNode, traverse } from '../../utils/loader'
import * as E from '../../DefinitionException/methods'
import { Discriminator3 as Definition } from '../helpers/definition-types'

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

  static get schema (): ComponentSchema<Definition> {
    if (schemaDiscriminator === undefined) {
      schemaDiscriminator = new ComponentSchema<Definition>({
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
                const { loadCache, map } = data.root
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

                    const store = map.get(Schema)
                    const found = node !== undefined
                      ? store?.find(item => item.definition === node)
                      : undefined
                    if (found !== undefined) {
                      mapping[key] = found.instance
                    } else {
                      throw Error('To build components all references must be resolved. Could not find reference "' + String(ref) + '"' +
                        (hasRootNodePath ? 'from "' + rootNodePath + '"' : '') + '.')
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
                    } else if (loadOptions.dereference) {
                      const refNotResolved = E.refNotResolved(data, { key, type: 'value' }, ref, rootNodePath)
                      exception.message(refNotResolved)
                    }
                  })
              })
            }
          }
        }
      })
    }
    return schemaDiscriminator
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}
