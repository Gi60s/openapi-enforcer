import {
  Data,
  OASComponent,
  Dereferenced,
  Version,
  DefinitionException,
  Referencable,
  ComponentSchema, ExtendedComponent
} from './'
import * as E from '../DefinitionException/methods'
import { Operation } from './Operation'
import { Server } from './v3/Server'
import { PathItem2 as Definition2, PathItem3 as Definition3 } from './helpers/DefinitionTypes'

export const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

type Definition = Definition2 | Definition3

interface ComponentsMap {
  Operation: ExtendedComponent
  Parameter: ExtendedComponent
}

export function schemaGenerator (components: ComponentsMap, methods: string[], data: Data): ComponentSchema {
  return {
    allowsSchemaExtensions: true,
    validator: {
      after (data) {
        const {
          built,
          definition,
          exception,
          key
        } = data.context
        const { reference } = data.component

        const length = methods.length
        let hasMethod = false
        for (let i = 0; i < length; i++) {
          if (methods[i] in built) {
            hasMethod = true
            break
          }
        }
        if (!hasMethod) {
          const pathMissingMethods = E.pathMissingMethods(key, {
            definition,
            locations: [{ node: definition }],
            reference
          })
          exception.message(pathMissingMethods)
        }
      }
    },
    properties: [
      {
        name: 'parameters',
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: true,
            component: components.Parameter
          }
        }
      },
      {
        name: 'delete',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'description',
        versions: ['3.x.x'],
        schema: {
          type: 'string'
        }
      },
      {
        name: 'get',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'head',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'options',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'patch',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'put',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'post',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'trace',
        versions: ['3.x.x'],
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'servers',
        versions: ['3.x.x'],
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: false,
            component: Server
          }
        }
      },
      {
        name: 'summary',
        versions: ['3.x.x'],
        schema: {
          type: 'string'
        }
      }
    ]
  }
}

export class PathItem<HasReference=Dereferenced> extends OASComponent {
  extensions!: Record<string, any>
  delete?: Operation<HasReference>
  get?: Operation<HasReference>
  head?: Operation<HasReference>
  options?: Operation<HasReference>
  parameters?: Array<Referencable<HasReference, any>> // Parameter.Parameter<HasReference> - see inheriting classes for specifics
  patch?: Operation<HasReference>
  put?: Operation<HasReference>
  post?: Operation<HasReference>

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (Component: ExtendedComponent, definition: Definition, version?: Version, data?: Data) {
    super(Component, definition, version, data)
  }

  static validate (definition: Definition, version?: Version, data?: Data): DefinitionException {
    return super.validate(definition, version, data)
  }
}
