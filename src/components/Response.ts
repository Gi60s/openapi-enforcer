import {
  Data,
  OASComponent,
  Dereferenced,
  Version,
  Exception,
  ComponentSchema, ExtendedComponent
} from './'
import { getAncestorComponent } from './helpers/traversal'
import * as E from '../Exception/methods'
import * as V from './helpers/common-validators'
import { Swagger } from './Swagger'
import * as Schema from './Schema'
import { Definition as Definition2 } from './v2/Response'
import { Definition as Definition3 } from './v3/Response'

const rxLinkName = /^[a-zA-Z0-9.\-_]+$/

export interface Definition {
  [key: `x-${string}`]: any
  description: string
}

interface ComponentsMap {
  Link: ExtendedComponent | unknown
  Header: ExtendedComponent | unknown
  MediaType: ExtendedComponent | unknown
  Operation: ExtendedComponent | unknown
  Schema: ExtendedComponent | unknown
}

export function schemaGenerator (components: ComponentsMap): ComponentSchema {
  return {
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
            type: 'component',
            allowsRef: false,
            component: components.MediaType as ExtendedComponent
          }
        }
      },
      {
        name: 'schema',
        versions: ['2.0'],
        schema: {
          type: 'component',
          allowsRef: true,
          component: components.Schema as ExtendedComponent
        }
      },
      {
        name: 'examples',
        versions: ['2.0'],
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'any'
          }
        }
      },
      {
        name: 'headers',
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            type: 'component',
            allowsRef: true,
            component: components.Header as ExtendedComponent
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
            type: 'component',
            allowsRef: true,
            component: components.Link as ExtendedComponent
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
            const operation = getAncestorComponent(data, components.Operation as ExtendedComponent)
            const swagger = getAncestorComponent(data, Swagger)
            const produces: string[] = [].concat(operation?.context.built.produces ?? [], swagger?.context.built.produces ?? [])
            exampleMediaTypes.forEach(type => {
              if (!produces.includes(type)) {
                const exampleMediaTypeNotProduced = E.exampleMediaTypeNotProduced(type, produces, {
                  definition,
                  locations: [{ node: (definition as Definition2).examples, key: type, type: 'key' }],
                  reference
                })
                exception.at('examples').at(type).message(exampleMediaTypeNotProduced)
              }
            })

            if (built.schema !== undefined) {
              if (!('$ref' in built.schema)) {
                const schema = new Schema.Schema(built.schema, '2.0')
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
                const invalidResponseLinkKey = E.invalidResponseLinkKey(key, {
                  definition,
                  locations: [{ node: (definition as Definition3).links, key, type: 'key' }],
                  reference
                })
                exception.at('links').at(key).message(invalidResponseLinkKey)
              }
            })
          }

          if ('headers' in built) {
            const contentTypeKey = Object.keys(built.headers ?? {}).find(key => key.toLowerCase() === 'content-type')
            if (contentTypeKey !== undefined) {
              const valueIgnored = E.valueIgnored(contentTypeKey, 'Response headers should not include Content-Type. The content type is already part of the Response definition.', {
                definition: definition,
                locations: [{ node: definition.headers, key: contentTypeKey, type: 'key' }],
                reference
              })
              exception.at('headers').message(valueIgnored)
            }
          }
        }
      }
    }
  }
}

export class Response extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly description!: string

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (Component: ExtendedComponent, definition: Definition2 | Definition3, version?: Version, data?: Data) {
    super(Component, definition, version, data)
  }

  static validate (definition: Definition, version?: Version, data?: Data): Exception {
    return super.validate(definition, version, data)
  }
}
