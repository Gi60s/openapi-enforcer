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

import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
const rxPropertyName = /^[a-zA-Z0-9._-]+$/
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IComponents3Definition, I.IComponents3> | null = null

interface IValidatorsMap {
  schemas: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>>
  responses: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IResponse3Definition, I.IResponse3>>>
  parameters: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IParameter3Definition, I.IParameter3>>>
  examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IExample3Definition, I.IExample3>>>
  requestBodies: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IRequestBody3Definition, I.IRequestBody3>>>
  headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IHeader3Definition, I.IHeader3>>>
  securitySchemes: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ISecurityScheme3Definition, I.ISecurityScheme3>>>
  links: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ILink3Definition, I.ILink3>>>
  callbacks: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ICallback3Definition, I.ICallback3>>>
}

export class Components extends EnforcerComponent<I.IComponents3Definition> implements I.IComponents3 {
  [S.Extensions]: Record<string, any> = {}
  public schemas?: Record<string, I.ISchema3>
  public responses?: Record<string, I.IResponse3>
  public parameters?: Record<string, I.IParameter3>
  public examples?: Record<string, I.IExample3>
  public requestBodies?: Record<string, I.IRequestBody3>
  public headers?: Record<string, I.IHeader3>
  public securitySchemes?: Record<string, I.ISecurityScheme3>
  public links?: Record<string, I.ILink3>
  public callbacks?: Record<string, I.ICallback3>

  constructor (definition: I.IComponents3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object'
  }

  static getSchemaDefinition (_data: I.IComponentsSchemaProcessor): ISchema.ISchemaDefinition<I.IComponents3Definition, I.IComponents3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IComponents3Definition, I.IComponents3> = {
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

  static create (definition?: Partial<I.IComponents3Definition> | Components | undefined): Components {
    return new Components(Object.assign({}, definition) as I.IComponents3Definition)
  }

  static async createAsync (definition?: Partial<I.IComponents3Definition> | Components | string | undefined): Promise<Components> {
    if (definition instanceof Components) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IComponents3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IComponents3Definition>> (definition?: T | undefined): I.IComponents3Definition & T {
    return Object.assign({}, definition) as I.IComponents3Definition & T
  }

  static validate (definition: I.IComponents3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IComponents3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    schemas: {
      name: 'schemas',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: I.Schema3
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
          component: I.Response3
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
          component: I.Parameter3
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
          component: I.Example3
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
          component: I.RequestBody3
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
          component: I.Header3
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
          component: I.SecurityScheme3
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
          component: I.Link3
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
          component: I.Callback3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
