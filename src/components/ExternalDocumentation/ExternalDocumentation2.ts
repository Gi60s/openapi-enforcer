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

let cachedSchema: ISchema.ISchemaDefinition<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> | null = null

interface IValidatorsMap {
  description: ISchema.IProperty<ISchema.IString>
  url: ISchema.IProperty<ISchema.IString>
}

export class ExternalDocumentation extends EnforcerComponent<I.IExternalDocumentation2Definition> implements I.IExternalDocumentation2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IExternalDocumentation2Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: I.IExternalDocumentationSchemaProcessor): ISchema.ISchemaDefinition<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> = {
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

  static create (definition?: Partial<I.IExternalDocumentation2Definition> | ExternalDocumentation | undefined): ExternalDocumentation {
    if (definition instanceof ExternalDocumentation) {
      return new ExternalDocumentation(Object.assign({}, definition))
    } else {
      return new ExternalDocumentation(Object.assign({
        url: ''
      }, definition) as I.IExternalDocumentation2Definition)
    }
  }

  static createDefinition<T extends Partial<I.IExternalDocumentation2Definition>> (definition?: T | undefined): I.IExternalDocumentation2Definition & T {
    return Object.assign({
      url: ''
    }, definition) as I.IExternalDocumentation2Definition & T
  }

  static validate (definition: I.IExternalDocumentation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get url (): string {
    return this[GetProperty]('url')
  }

  set url (value: string) {
    this[SetProperty]('url', value)
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
    url: {
      name: 'url',
      required: true,
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
