import { Schema } from './Schema/Schema3'
import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { IDiscriminator3, IDiscriminator3Definition } from './IDiscriminator'
import { IComponentSchemaObject } from '../IComponentSchema'
import { discriminatorMappingUnresolved } from '../../Exception/methods'
import { ISchemaProcessor } from '../ISchemaProcessor'

const schema: IComponentSchemaObject = {
  type: 'object',
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
        additionalProperties: { type: 'string' }
      }
    }
  ],
  build ({ cmp, context, root }) {
    const { definition } = cmp
    const { mapping } = definition

    if (mapping !== undefined) {
      root.lastly.push((root) => {
        const data = componentData.context.children.mapping
        const {loadCache, map} = data.root
        const {definition} = data.context

        const loc = lookupLocation(definition)
        const hasRootNodePath = typeof loc?.source === 'string'
        const rootNodePath = loc?.source ?? 'In process assignment'

        Object.keys(definition)
          .forEach(key => {
            const ref = definition[key]
            const {built} = componentData.context
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
              throw Error('To build components-old all references must be resolved. Could not find reference "' + String(ref) + '"' +
                (hasRootNodePath ? 'from "' + rootNodePath + '"' : '') + '.')
            }
          })
      })
    }
  },
  validate ({ cmp, root }) {
    const { definition } = cmp
    const { mapping } = definition

    if (mapping !== undefined) {
      root.lastly.push(() => {
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
              exception.add(discriminatorMappingUnresolved(data, key))
            }
          })
      })
    }
  }
}

export class Discriminator extends EnforcerComponent<IDiscriminator3Definition, Discriminator> implements IDiscriminator3 {
  propertyName!: string
  mapping?: Record<string, Schema>

  constructor (definition: IDiscriminator3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#discriminator-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#discriminator-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#discriminator-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#discriminator-object'
  }

  static getSchema (data: ISchemaProcessor): IComponentSchemaObject {
    return schema
  }

  static validate (definition: IDiscriminator3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }
}
