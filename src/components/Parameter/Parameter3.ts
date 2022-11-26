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
import { IParameterSchemaProcessor } from '../IInternalTypes'
import {
  Example3,
  IExample3,
  IExample3Definition,
  IMediaType3,
  IMediaType3Definition,
  IParameter3,
  IParameter3Definition,
  ISchema3,
  ISchema3Definition,
  MediaType3,
  Schema3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IParameter3Definition, IParameter3> | null = null

export class Parameter extends EnforcerComponent<IParameter3Definition, IParameter3> implements IParameter3 {
  [extension: `x${string}`]: any

  constructor (definition: IParameter3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#parameter-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#parameter-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#parameter-object'
  }

  static getSchemaDefinition (_data: IParameterSchemaProcessor): ISchema.ISchemaDefinition<IParameter3Definition, IParameter3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const name: ISchema.IProperty<ISchema.IString> = {
      name: 'name',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const _in: ISchema.IProperty<ISchema.IString> = {
      name: 'in',
      required: true,
      schema: {
        type: 'string',
        enum: ['cookie', 'header', 'path', 'query']
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const required: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'required',
      schema: {
        type: 'boolean'
      }
    }

    const deprecated: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    }

    const allowEmptyValue: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'allowEmptyValue',
      schema: {
        type: 'boolean'
      }
    }

    const style: ISchema.IProperty<ISchema.IString> = {
      name: 'style',
      schema: {
        type: 'string',
        enum: ['deepObject', 'form', 'label', 'matrix', 'pipeDelimited', 'simple', 'spaceDelimited']
      }
    }

    const explode: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'explode',
      schema: {
        type: 'boolean'
      }
    }

    const allowReserved: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'allowReserved',
      schema: {
        type: 'boolean'
      }
    }

    const schema: ISchema.IProperty<ISchema.IComponent<ISchema3Definition, ISchema3>> = {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3
      }
    }

    const example: ISchema.IProperty<any> = {
      name: 'example',
      schema: {
        type: 'any'
      }
    }

    const examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IExample3Definition, IExample3>>> = {
      name: 'examples',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Example3
        }
      }
    }

    const content: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IMediaType3Definition, IMediaType3>>> = {
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

    const result: ISchema.ISchemaDefinition<IParameter3Definition, IParameter3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        name,
        _in,
        description,
        required,
        deprecated,
        allowEmptyValue,
        style,
        explode,
        allowReserved,
        schema,
        example,
        examples,
        content
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IParameter3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
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
