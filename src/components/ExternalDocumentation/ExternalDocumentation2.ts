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
import { IExternalDocumentationSchemaProcessor } from '../IInternalTypes'
import {
  IExternalDocumentation2,
  IExternalDocumentation2Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IExternalDocumentation2Definition, IExternalDocumentation2> | null = null

interface IValidatorsMap {
  description: ISchema.IProperty<ISchema.IString>
  url: ISchema.IProperty<ISchema.IString>
}

const validators: IValidatorsMap = {
  description: {
    name: 'description',
    schema: {
      type: 'string'
    }
  },
  url: {
    name: 'url',
    required: true,
    schema: {
      type: 'string'
    }
  }
}

export class ExternalDocumentation extends EnforcerComponent<IExternalDocumentation2Definition, IExternalDocumentation2> implements IExternalDocumentation2 {
  [extension: `x${string}`]: any

  constructor (definition: IExternalDocumentation2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'EXTERNAL_DOCUMENTATION2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#external-documentation-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: IExternalDocumentationSchemaProcessor): ISchema.ISchemaDefinition<IExternalDocumentation2Definition, IExternalDocumentation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IExternalDocumentation2Definition, IExternalDocumentation2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.description,
        validators.url
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IExternalDocumentation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get url (): string {
    return this.getProperty('url')
  }

  set url (value: string) {
    this.setProperty('url', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
