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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

type IValidatorsMap = I.IHeaderValidatorsMap3

let cachedSchema: Icsd.ISchemaDefinition<I.IHeader3Definition, I.IHeader3> | null = null

export class Header extends EnforcerComponent<I.IHeader3Definition> implements I.IHeader3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IHeader3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'HEADER3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#header-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#header-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#header-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#header-object'
  }

  static getSchemaDefinition (_data: I.IHeaderSchemaProcessor): Icsd.ISchemaDefinition<I.IHeader3Definition, I.IHeader3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: Icsd.ISchemaDefinition<I.IHeader3Definition, I.IHeader3> = {
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

  static create (definition?: Partial<I.IHeader3Definition> | Header | undefined): Header {
    return new Header(Object.assign({}, definition) as I.IHeader3Definition)
  }

  static async createAsync (definition?: Partial<I.IHeader3Definition> | Header | string | undefined): Promise<Header> {
    if (definition instanceof Header) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IHeader3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IHeader3Definition>> (definition?: T | undefined): I.IHeader3Definition & T {
    return Object.assign({}, definition) as I.IHeader3Definition & T
  }

  static validate (definition: I.IHeader3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IHeader3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get required (): boolean | undefined {
    return this.getProperty('required')
  }

  set required (value: boolean | undefined) {
    this.setProperty('required', value)
  }

  get deprecated (): boolean | undefined {
    return this.getProperty('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this.setProperty('deprecated', value)
  }

  get allowEmptyValue (): boolean | undefined {
    return this.getProperty('allowEmptyValue')
  }

  set allowEmptyValue (value: boolean | undefined) {
    this.setProperty('allowEmptyValue', value)
  }

  get style (): 'simple' | undefined {
    return this.getProperty('style')
  }

  set style (value: 'simple' | undefined) {
    this.setProperty('style', value)
  }

  get explode (): boolean | undefined {
    return this.getProperty('explode')
  }

  set explode (value: boolean | undefined) {
    this.setProperty('explode', value)
  }

  get allowReserved (): boolean | undefined {
    return this.getProperty('allowReserved')
  }

  set allowReserved (value: boolean | undefined) {
    this.setProperty('allowReserved', value)
  }

  get schema (): I.ISchema3 | undefined {
    return this.getProperty('schema')
  }

  set schema (value: I.ISchema3 | undefined) {
    this.setProperty('schema', value)
  }

  get example (): any | undefined {
    return this.getProperty('example')
  }

  set example (value: any | undefined) {
    this.setProperty('example', value)
  }

  get examples (): Record<string, I.IExample3> | undefined {
    return this.getProperty('examples')
  }

  set examples (value: Record<string, I.IExample3> | undefined) {
    this.setProperty('examples', value)
  }

  get content (): Record<string, I.IMediaType3> | undefined {
    return this.getProperty('content')
  }

  set content (value: Record<string, I.IMediaType3> | undefined) {
    this.setProperty('content', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

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
        component: I.Schema3
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
          component: I.Example3
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
          component: I.MediaType3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
