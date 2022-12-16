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
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.ITag3Definition, I.ITag3> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
}

const validators: IValidatorsMap = {
  name: {
    name: 'name',
    required: true,
    schema: {
      type: 'string'
    }
  },
  description: {
    name: 'description',
    schema: {
      type: 'string'
    }
  },
  externalDocs: {
    name: 'externalDocs',
    schema: {
      type: 'component',
      allowsRef: false,
      component: I.ExternalDocumentation3
    }
  }
}

export class Tag extends EnforcerComponent<I.ITag3Definition> implements I.ITag3 {
  [extension: `x${string}`]: any

  constructor (definition: I.ITag3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'TAG3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#tag-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#tag-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#tag-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#tag-object'
  }

  static getSchemaDefinition (_data: I.ITagSchemaProcessor): ISchema.ISchemaDefinition<I.ITag3Definition, I.ITag3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.ITag3Definition, I.ITag3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators.description,
        validators.externalDocs
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.ITag3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get name (): string {
    return this.getProperty('name')
  }

  set name (value: string) {
    this.setProperty('name', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get externalDocs (): I.IExternalDocumentation3 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation3 | undefined) {
    this.setProperty('externalDocs', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
