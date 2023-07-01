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
import { Schema3a, ISchema3a } from '../Schema'
import { Example3a, IExample3a } from '../Example'
import { MediaType3a, IMediaType3a } from '../MediaType'
import { Header as HeaderBase } from './Header'
import { IHeader3a, IHeader3aDefinition, IHeader3aSchemaProcessor, IHeaderValidatorsMap3a as IValidatorsMap } from './IHeader'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IHeader3aDefinition, IHeader3a> | null = null

export class Header extends HeaderBase implements IHeader3a {
  public extensions: Record<string, any> = {}
  public description?: string
  public required?: boolean
  public deprecated?: boolean
  public allowEmptyValue?: boolean
  public style?: 'simple'
  public explode?: boolean
  public allowReserved?: boolean
  public schema?: ISchema3a
  public example?: any
  public examples?: Record<string, IExample3a>
  public content?: Record<string, IMediaType3a>

  constructor (definition: IHeader3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'HEADER3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#header-object'
  }

  static getSchemaDefinition (_data: IHeader3aSchemaProcessor): ISDSchemaDefinition<IHeader3aDefinition, IHeader3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IHeader3aDefinition, IHeader3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
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

  static create (definition?: Partial<IHeader3aDefinition> | Header | undefined): Header {
    return new Header(Object.assign({}, definition) as IHeader3aDefinition)
  }

  static async createAsync (definition?: Partial<IHeader3aDefinition> | Header | string | undefined): Promise<Header> {
    if (definition instanceof Header) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IHeader3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IHeader3aDefinition>> (definition?: T | undefined): IHeader3aDefinition & T {
    return Object.assign({}, definition) as IHeader3aDefinition & T
  }

  static validate (definition: IHeader3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IHeader3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
        enum: ['simple']
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
        component: Schema3a
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
          component: Example3a
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
          component: MediaType3a
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
