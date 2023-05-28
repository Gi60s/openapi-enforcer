/*
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!   IMPORTANT   !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *  A portion of this file has been created from a template. You can only edit
 *  content in some regions within this file. Look for a region that begins with
 *  // <!# Custom Content Begin: *** #!>
 *  and ends with
 *  // <!# Custom Content End: *** #!>
 *  where the *** is replaced by a string of some value. Within these custom
 *  content regions you can edit the file without worrying about a loss of your
 *  code.
 */

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Components as ComponentsBase } from './Components'
import { IComponents3, IComponents3Definition, IComponents3SchemaProcessor, IComponentsValidatorsMap3 as IValidatorsMap } from './IComponents'
// <!# Custom Content Begin: HEADER #!>
const rxPropertyName = /^[a-zA-Z0-9._-]+$/
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IComponents3Definition, IComponents3> | null = null

export class Components extends ComponentsBase implements IComponents3 {
  public extensions: Record<string, any> = {}
  public schemas?: Record<string, ISchema3>
  public responses?: Record<string, IResponse3>
  public parameters?: Record<string, IParameter3>
  public examples?: Record<string, IExample3>
  public requestBodies?: Record<string, IRequestBody3>
  public headers?: Record<string, IHeader3>
  public securitySchemes?: Record<string, ISecurityScheme3>
  public links?: Record<string, ILink3>
  public callbacks?: Record<string, ICallback3>

  constructor (definition: IComponents3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'COMPONENTS3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#components-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#components-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#components-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IComponents3SchemaProcessor): ISDSchemaDefinition<IComponents3Definition, IComponents3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IComponents3Definition, IComponents3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.schemas,
        validators.responses,
        validators.parameters,
        validators.examples,
        validators.requestBodies,
        validators.headers,
        validators.securitySchemes,
        validators.links,
        validators.callbacks
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = (data) => {
      const { definition, exception } = data
      const { reference, id } = data.component
      const properties: Array<keyof I.IComponents3Definition> = ['schemas', 'responses',
        'parameters', 'examples', 'requestBodies', 'headers', 'securitySchemes', 'links', 'callbacks']
      properties.forEach(key => {
        const definitionSet = definition[key]
        if (definitionSet !== undefined) {
          Object.keys(definitionSet).forEach(name => {
            if (!rxPropertyName.test(name)) {
              exception.add({
                id,
                code: 'COMPONENT_NAME_INVALID',
                level: 'error',
                locations: [Loader.getLocation(definitionSet, name, 'key')],
                metadata: {
                  componentsNamespace: key,
                  propertyName: name
                },
                reference
              })
            }
          })
        }
      })
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IComponents3Definition> | Components | undefined): Components {
    return new Components(Object.assign({}, definition) as IComponents3Definition)
  }

  static async createAsync (definition?: Partial<IComponents3Definition> | Components | string | undefined): Promise<Components> {
    if (definition instanceof Components) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IComponents3Definition>)
    }
  }

  static createDefinition<T extends Partial<IComponents3Definition>> (definition?: T | undefined): IComponents3Definition & T {
    return Object.assign({}, definition) as IComponents3Definition & T
  }

  static validate (definition: IComponents3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IComponents3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
    schemas: {
      name: 'schemas',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Schema3
        }
      }
    },
    responses: {
      name: 'responses',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Response3
        }
      }
    },
    parameters: {
      name: 'parameters',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Parameter3
        }
      }
    },
    examples: {
      name: 'examples',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Example3
        }
      }
    },
    requestBodies: {
      name: 'requestBodies',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: RequestBody3
        }
      }
    },
    headers: {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Header3
        }
      }
    },
    securitySchemes: {
      name: 'securitySchemes',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: SecurityScheme3
        }
      }
    },
    links: {
      name: 'links',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Link3
        }
      }
    },
    callbacks: {
      name: 'callbacks',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Callback3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
