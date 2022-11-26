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
import { IResponseSchemaProcessor } from '../IInternalTypes'
import {
  Header3,
  IHeader3,
  IHeader3Definition,
  ILink3,
  ILink3Definition,
  IMediaType3,
  IMediaType3Definition,
  IResponse3,
  IResponse3Definition,
  Link3,
  MediaType3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IResponse3Definition, IResponse3> | null = null

export class Response extends EnforcerComponent<IResponse3Definition, IResponse3> implements IResponse3 {
  [extension: `x${string}`]: any

  constructor (definition: IResponse3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#response-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#response-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#response-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#response-object'
  }

  static getSchemaDefinition (_data: IResponseSchemaProcessor): ISchema.ISchemaDefinition<IResponse3Definition, IResponse3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IHeader3Definition, IHeader3>>> = {
      name: 'headers',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Header3
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

    const links: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ILink3Definition, ILink3>>> = {
      name: 'links',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: Link3
        }
      }
    }

    const result: ISchema.ISchemaDefinition<IResponse3Definition, IResponse3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        description,
        headers,
        content,
        links
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IResponse3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get description (): string {
    return this.getProperty('description')
  }

  set description (value: string) {
    this.setProperty('description', value)
  }

  get headers (): Record<string, IHeader3> | undefined {
    return this.getProperty('headers')
  }

  set headers (value: Record<string, IHeader3> | undefined) {
    this.setProperty('headers', value)
  }

  get content (): Record<string, IMediaType3> | undefined {
    return this.getProperty('content')
  }

  set content (value: Record<string, IMediaType3> | undefined) {
    this.setProperty('content', value)
  }

  get links (): Record<string, ILink3> | undefined {
    return this.getProperty('links')
  }

  set links (value: Record<string, ILink3> | undefined) {
    this.setProperty('links', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
