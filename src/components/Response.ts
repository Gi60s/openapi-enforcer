import { OASComponent } from './index'
import { Component, ComponentSchema } from './helpers/builder-validator-types'
import { getAncestorComponent } from './helpers/traversal'
import * as E from '../DefinitionException/methods'
import * as V from './helpers/common-validators'
import { Response2 as Definition2, Response3 as Definition3 } from './helpers/definition-types'

const rxLinkName = /^[a-zA-Z0-9.\-_]+$/

interface ComponentsMap {
  Link: Component | undefined
  Header: Component | undefined
  MediaType: Component | undefined
  Operation: Component | undefined
  Schema: Component | undefined
  Swagger: Component | undefined
}

export function schemaGenerator (components: ComponentsMap): ComponentSchema {
  return new ComponentSchema<any, any>({
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'description',
        required: true,
        schema: {
          type: 'string'
        }
      },
      {
        name: 'content',
        versions: ['3.x.x'],
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            schema: {
              type: 'component',
              allowsRef: false,
              component: components.MediaType as Component
            }
          }
        }
      },
      {
        name: 'schema',
        versions: ['2.0'],
        schema: {
          type: 'component',
          allowsRef: true,
          component: components.Schema as Component
        }
      },
      {
        name: 'examples',
        versions: ['2.0'],
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            schema: { type: 'any' }
          }
        }
      },
      {
        name: 'headers',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            schema: {
              type: 'component',
              allowsRef: true,
              component: components.Header as Component
            }
          }
        }
      },
      {
        name: 'links',
        versions: ['3.x.x'],
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            schema: {
              type: 'component',
              allowsRef: true,
              component: components.Link as Component
            }
          }
        }
      }
    ],
    validator: {
      after (data) {
        const { built, definition, exception } = data.context
        const { reference } = data.component
        const { major } = data.root

        if (major === 2) {
          if ('examples' in built) {
            const exampleMediaTypes = Object.keys(built.examples ?? {})

            // Validate that the key matches the Operation produces value, whether inherited or explicit.
            const operation = getAncestorComponent(data, components.Operation as Component)
            const swagger = getAncestorComponent(data, components.Swagger as Component)
            const produces: string[] = [].concat(operation?.context.built.produces ?? [], swagger?.context.built.produces ?? [])
            exampleMediaTypes.forEach(type => {
              if (!produces.includes(type)) {
                const exampleMediaTypeNotProduced = E.exampleMediaTypeNotProduced(data, { node: (definition as Definition2).examples, key: type, type: 'key' }, type, produces)
                exception.at('examples').at(type).message(exampleMediaTypeNotProduced)
              }
            })

            if (built.schema !== undefined) {
              if (!('$ref' in built.schema)) {
                const schema = new (components.Schema as Component)(built.schema, '2.0')
                V.examplesMatchSchema(data, schema)
              }
            } else {
              V.examplesMatchSchema(data, null)
            }
          }
        } else if (major === 3) {
          if ('links' in built) {
            const keys = Object.keys(built.links ?? {})
            keys.forEach(key => {
              if (!rxLinkName.test(key)) {
                const invalidResponseLinkKey = E.invalidResponseLinkKey(data, { node: (definition as Definition3).links, key, type: 'key' }, key)
                exception.at('links').at(key).message(invalidResponseLinkKey)
              }
            })
          }

          if ('headers' in built) {
            const contentTypeKey = Object.keys(built.headers ?? {}).find(key => key.toLowerCase() === 'content-type')
            if (contentTypeKey !== undefined) {
              const valueIgnored = E.valueIgnored(data, { node: definition.headers, key: contentTypeKey, type: 'key' }, contentTypeKey, 'Response headers should not include Content-Type. The content type is already part of the Response definition.')
              exception.at('headers').message(valueIgnored)
            }
          }
        }
      }
    }
  })
}

export class Response extends OASComponent {
  extensions!: Record<string, any>
  description!: string
}
