import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException, LocationInput } from '../../Exception'
import { OASComponent, componentValidate } from '../index'
import { Server } from './Server'
import { Link3 as Definition } from '../helpers/definition-types'
import { traverse } from '../../utils/loader'
import rx from '../../utils/rx'
import { ILink } from '../interfaces/ILink'

let schemaLink: ComponentSchema<Definition>

export class Link extends OASComponent implements ILink {
  extensions!: Record<string, any>
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, string>
  requestBody?: any
  server?: Server

  constructor (definition: Definition, version?: Version) {
    super(Link, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#link-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#link-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#link-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#link-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (schemaLink === undefined) {
      schemaLink = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        validator: {
          after (data) {
            const root = data.root
            const { built, definition, exception } = data.context

            // validate that there is no conflict operationRef and operationId
            if (built.operationRef !== undefined && built.operationId !== undefined) {
              const locations: LocationInput[] = [
                { node: definition, key: 'operationRef', type: 'key' },
                { node: definition, key: 'operationId', type: 'key' }
              ]
              exception.add.linkOperationConflict(data, locations)
            }

            // validate that operationRef or operationId are set
            if (built.operationRef === undefined && built.operationId === undefined) {
              exception.add.linkOperationMissing(data, { type: 'value' })
            }

            // if operationId is set then validate that it can be found
            if (built.operationId !== undefined) {
              root.lastly.push(() => {
                // if an operationId is used and the root is an openapi or swagger definition then make
                // sure that the operation id is found in the paths
                const rootDefinition = root.data.context.definition
                if (root.metadata.operationIdMap[built.operationId] === undefined && (rootDefinition.openapi !== undefined || rootDefinition.swagger !== undefined)) {
                  exception.at('operationId').add.linkedOperationNotFound(data, { key: 'operationId', type: 'value' }, 'operationId', built.operationId)
                }
              })
            }

            // if operationRef is set then validate that it can be found
            if (built.operationRef !== undefined) {
              root.lastly.push(() => {
                // if the ref is local then check for local path
                if ((built.operationRef as string).startsWith('#/')) {
                  const operation = traverse(root.data.context.built, built.operationRef)
                  if (operation === undefined) {
                    exception.at('operationRef').add.linkedOperationNotFound(data, { key: 'operationRef', type: 'value' }, 'operationRef', built.operationRef)
                  }
                } else if (!rx.url.test(built.operationRef)) {
                  exception.at('operationRef').add.invalidUrl(data, { key: 'operationRef', type: 'value' }, built.operationRef)
                }
              })
            }
          }
        },
        properties: [
          {
            name: 'description',
            schema: { type: 'string' }
          },
          {
            name: 'operationRef',
            schema: { type: 'string' }
          },
          {
            name: 'operationId',
            schema: { type: 'string' }
          },
          {
            name: 'parameters',
            schema: {
              type: 'object',
              allowsSchemaExtensions: false,
              additionalProperties: {
                // Read about Runtime Expression Syntax at https://swagger.io/docs/specification/links/
                schema: {
                  type: 'any'
                }
              }
            }
          },
          {
            name: 'requestBody',
            // Read about Runtime Expression Syntax at https://swagger.io/docs/specification/links/
            schema: {
              type: 'any'
            }
          },
          {
            name: 'server',
            schema: {
              type: 'component',
              allowsRef: false,
              component: Server
            }
          }
        ]
      })
    }
    return schemaLink
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}

// TODO: Should we add functionality around link expressions? For example, a way to auto populate a property on the response object that has links populated dynamically?
