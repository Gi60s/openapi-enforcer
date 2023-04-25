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
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IParameter3Definition, I.IParameter3> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  _in: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  required: ISchema.IProperty<ISchema.IBoolean>
  deprecated: ISchema.IProperty<ISchema.IBoolean>
  allowEmptyValue: ISchema.IProperty<ISchema.IBoolean>
  style: ISchema.IProperty<ISchema.IString>
  explode: ISchema.IProperty<ISchema.IBoolean>
  allowReserved: ISchema.IProperty<ISchema.IBoolean>
  schema: ISchema.IProperty<ISchema.IComponent<I.ISchema3Definition, I.ISchema3>>
  example: ISchema.IProperty<any>
  examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IExample3Definition, I.IExample3>>>
  content: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IMediaType3Definition, I.IMediaType3>>>
}

export class Parameter extends EnforcerComponent<I.IParameter3Definition> implements I.IParameter3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IParameter3Definition, version?: IVersion) {
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
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object'
  }

  static getSchemaDefinition (_data: I.IParameterSchemaProcessor): ISchema.ISchemaDefinition<I.IParameter3Definition, I.IParameter3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IParameter3Definition, I.IParameter3> = {
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

  static create (definition?: Partial<I.IParameter3Definition> | Parameter | undefined): Parameter {
    if (definition instanceof Parameter) {
      return new Parameter(Object.assign({}, definition as unknown) as I.IParameter3Definition)
    } else {
      return new Parameter(Object.assign({
        name: '',
        in: 'cookie'
      }, definition) as I.IParameter3Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IParameter3Definition> | Parameter | string | undefined): Promise<Parameter> {
    if (definition instanceof Parameter) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IParameter3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IParameter3Definition>> (definition?: T | undefined): I.IParameter3Definition & T {
    return Object.assign({
      name: '',
      in: 'cookie'
    }, definition) as I.IParameter3Definition & T
  }

  static validate (definition: I.IParameter3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IParameter3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get name (): string {
    return this.getProperty('name')
  }

  set name (value: string) {
    this.setProperty('name', value)
  }

  get in (): 'cookie'|'header'|'path'|'query' {
    return this.getProperty('in')
  }

  set in (value: 'cookie'|'header'|'path'|'query') {
    this.setProperty('in', value)
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

  get style (): 'deepObject'|'form'|'label'|'matrix'|'pipeDelimited'|'simple'|'spaceDelimited' | undefined {
    return this.getProperty('style')
  }

  set style (value: 'deepObject'|'form'|'label'|'matrix'|'pipeDelimited'|'simple'|'spaceDelimited' | undefined) {
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
