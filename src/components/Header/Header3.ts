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
import { IHeaderSchemaProcessor } from '../IInternalTypes'
import {
  Example3,
  IExample3,
  IExample3Definition,
  IHeader3,
  IHeader3Definition,
  IMediaType3,
  IMediaType3Definition,
  ISchema3,
  ISchema3Definition,
  MediaType3,
  Schema3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IHeader3Definition, IHeader3> | null = null

interface IValidatorsMap {
  description: ISchema.IProperty<ISchema.IString>
  required: ISchema.IProperty<ISchema.IBoolean>
  deprecated: ISchema.IProperty<ISchema.IBoolean>
  allowEmptyValue: ISchema.IProperty<ISchema.IBoolean>
  style: ISchema.IProperty<ISchema.IString>
  explode: ISchema.IProperty<ISchema.IBoolean>
  allowReserved: ISchema.IProperty<ISchema.IBoolean>
  schema: ISchema.IProperty<ISchema.IComponent<ISchema3Definition, ISchema3>>
  example: ISchema.IProperty<any>
  examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IExample3Definition, IExample3>>>
  content: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IMediaType3Definition, IMediaType3>>>
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

export class Header extends EnforcerComponent<IHeader3Definition, IHeader3> implements IHeader3 {
  [extension: `x${string}`]: any

  constructor (definition: IHeader3Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: IHeaderSchemaProcessor): ISchema.ISchemaDefinition<IHeader3Definition, IHeader3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IHeader3Definition, IHeader3> = {
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

  static validate (definition: IHeader3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
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

  get schema (): ISchema3 | undefined {
    return this.getProperty('schema')
  }

  set schema (value: ISchema3 | undefined) {
    this.setProperty('schema', value)
  }

  get example (): any | undefined {
    return this.getProperty('example')
  }

  set example (value: any | undefined) {
    this.setProperty('example', value)
  }

  get examples (): Record<string, IExample3> | undefined {
    return this.getProperty('examples')
  }

  set examples (value: Record<string, IExample3> | undefined) {
    this.setProperty('examples', value)
  }

  get content (): Record<string, IMediaType3> | undefined {
    return this.getProperty('content')
  }

  set content (value: Record<string, IMediaType3> | undefined) {
    this.setProperty('content', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
