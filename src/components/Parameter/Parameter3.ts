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
import { Schema3, ISchema3 } from '../Schema'
import { Example3, IExample3 } from '../Example'
import { MediaType3, IMediaType3 } from '../MediaType'
import { Parameter as ParameterBase } from './Parameter'
import { IParameter3, IParameter3Definition, IParameter3SchemaProcessor, IParameterValidatorsMap3 as IValidatorsMap } from './IParameter'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IParameter3Definition, IParameter3> | null = null

export class Parameter extends ParameterBase implements IParameter3 {
  public extensions: Record<string, any> = {}
  public name!: string
  public in!: 'cookie' | 'header' | 'path' | 'query'
  public description?: string
  public required?: boolean
  public deprecated?: boolean
  public allowEmptyValue?: boolean
  public style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited'
  public explode?: boolean
  public allowReserved?: boolean
  public schema?: ISchema3
  public example?: any
  public examples?: Record<string, IExample3>
  public content?: Record<string, IMediaType3>

  constructor (definition: IParameter3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'PARAMETER3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#parameter-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#parameter-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IParameter3SchemaProcessor): ISDSchemaDefinition<IParameter3Definition, IParameter3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IParameter3Definition, IParameter3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators._in,
        validators.description,
        validators.required,
        validators.deprecated,
        validators.allowEmptyValue,
        validators.style,
        validators.explode,
        validators.allowReserved,
        validators.schema,
        validators.example,
        validators.examples,
        validators.content
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IParameter3Definition> | Parameter | undefined): Parameter {
    if (definition instanceof Parameter) {
      return new Parameter(Object.assign({}, definition as unknown) as IParameter3Definition)
    } else {
      return new Parameter(Object.assign({
        name: '',
        in: 'cookie'
      }, definition) as IParameter3Definition)
    }
  }

  static async createAsync (definition?: Partial<IParameter3Definition> | Parameter | string | undefined): Promise<Parameter> {
    if (definition instanceof Parameter) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IParameter3Definition>)
    }
  }

  static createDefinition<T extends Partial<IParameter3Definition>> (definition?: T | undefined): IParameter3Definition & T {
    return Object.assign({
      name: '',
      in: 'cookie'
    }, definition) as IParameter3Definition & T
  }

  static validate (definition: IParameter3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IParameter3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
    name: {
      name: 'name',
      required: true,
      schema: {
        type: 'string'
      }
    },
    _in: {
      name: 'in',
      required: true,
      schema: {
        type: 'string',
        enum: ['cookie', 'header', 'path', 'query']
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    required: {
      name: 'required',
      schema: {
        type: 'boolean'
      }
    },
    deprecated: {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    },
    allowEmptyValue: {
      name: 'allowEmptyValue',
      schema: {
        type: 'boolean'
      }
    },
    style: {
      name: 'style',
      schema: {
        type: 'string',
        enum: ['deepObject', 'form', 'label', 'matrix', 'pipeDelimited', 'simple', 'spaceDelimited']
      }
    },
    explode: {
      name: 'explode',
      schema: {
        type: 'boolean'
      }
    },
    allowReserved: {
      name: 'allowReserved',
      schema: {
        type: 'boolean'
      }
    },
    schema: {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3
      }
    },
    example: {
      name: 'example',
      schema: {
        type: 'any'
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
    content: {
      name: 'content',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: MediaType3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
