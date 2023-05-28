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
import { IComponents3a, IComponents3aDefinition, IComponents3aSchemaProcessor, IComponentsValidatorsMap3a as IValidatorsMap } from './IComponents'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IComponents3aDefinition, IComponents3a> | null = null

export class Components extends ComponentsBase implements IComponents3a {
  public extensions: Record<string, any> = {}
  public schemas?: Record<string, ISchema3a>
  public responses?: Record<string, IResponse3a>
  public parameters?: Record<string, IParameter3a>
  public examples?: Record<string, IExample3a>
  public requestBodies?: Record<string, IRequestBody3a>
  public headers?: Record<string, IHeader3a>
  public securitySchemes?: Record<string, ISecurityScheme3a>
  public links?: Record<string, ILink3a>
  public callbacks?: Record<string, ICallback3a>

  constructor (definition: IComponents3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'COMPONENTS3A'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#components-object'
  }

  static getSchemaDefinition (_data: IComponents3aSchemaProcessor): ISDSchemaDefinition<IComponents3aDefinition, IComponents3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IComponents3aDefinition, IComponents3a> = {
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
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IComponents3aDefinition> | Components | undefined): Components {
    return new Components(Object.assign({}, definition) as IComponents3aDefinition)
  }

  static async createAsync (definition?: Partial<IComponents3aDefinition> | Components | string | undefined): Promise<Components> {
    if (definition instanceof Components) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IComponents3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IComponents3aDefinition>> (definition?: T | undefined): IComponents3aDefinition & T {
    return Object.assign({}, definition) as IComponents3aDefinition & T
  }

  static validate (definition: IComponents3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IComponents3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
          component: Schema3a
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
          component: Response3a
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
          component: Parameter3a
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
          component: Example3a
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
          component: RequestBody3a
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
          component: Header3a
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
          component: SecurityScheme3a
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
          component: Link3a
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
          component: Callback3a
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
