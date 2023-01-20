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
import { EnforcerComponent, SetProperty, GetProperty } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IHeader3Definition, I.IHeader3> | null = null

interface IValidatorsMap {
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

const validators: IValidatorsMap = {
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

export class Header extends EnforcerComponent<I.IHeader3Definition> implements I.IHeader3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IHeader3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'HEADER3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#header-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#header-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#header-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#header-object'
  }

  static getSchemaDefinition (_data: I.IHeaderSchemaProcessor): ISchema.ISchemaDefinition<I.IHeader3Definition, I.IHeader3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IHeader3Definition, I.IHeader3> = {
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

  static createDefinition (definition?: Partial<I.IHeader3Definition> | undefined): I.IHeader3Definition {
    return Object.assign({}, definition) as I.IHeader3Definition
  }

  static validate (definition: I.IHeader3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get required (): boolean | undefined {
    return this[GetProperty]('required')
  }

  set required (value: boolean | undefined) {
    this[SetProperty]('required', value)
  }

  get deprecated (): boolean | undefined {
    return this[GetProperty]('deprecated')
  }

  set deprecated (value: boolean | undefined) {
    this[SetProperty]('deprecated', value)
  }

  get allowEmptyValue (): boolean | undefined {
    return this[GetProperty]('allowEmptyValue')
  }

  set allowEmptyValue (value: boolean | undefined) {
    this[SetProperty]('allowEmptyValue', value)
  }

  get style (): 'simple' | undefined {
    return this[GetProperty]('style')
  }

  set style (value: 'simple' | undefined) {
    this[SetProperty]('style', value)
  }

  get explode (): boolean | undefined {
    return this[GetProperty]('explode')
  }

  set explode (value: boolean | undefined) {
    this[SetProperty]('explode', value)
  }

  get allowReserved (): boolean | undefined {
    return this[GetProperty]('allowReserved')
  }

  set allowReserved (value: boolean | undefined) {
    this[SetProperty]('allowReserved', value)
  }

  get schema (): I.ISchema3 | undefined {
    return this[GetProperty]('schema')
  }

  set schema (value: I.ISchema3 | undefined) {
    this[SetProperty]('schema', value)
  }

  get example (): any | undefined {
    return this[GetProperty]('example')
  }

  set example (value: any | undefined) {
    this[SetProperty]('example', value)
  }

  get examples (): Record<string, I.IExample3> | undefined {
    return this[GetProperty]('examples')
  }

  set examples (value: Record<string, I.IExample3> | undefined) {
    this[SetProperty]('examples', value)
  }

  get content (): Record<string, I.IMediaType3> | undefined {
    return this[GetProperty]('content')
  }

  set content (value: Record<string, I.IMediaType3> | undefined) {
    this[SetProperty]('content', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
