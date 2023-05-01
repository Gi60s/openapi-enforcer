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

type IValidatorsMap = I.IExternalDocumentationValidatorsMap2

let cachedSchema: Icsd.ISchemaDefinition<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> | null = null

export class ExternalDocumentation extends EnforcerComponent<I.IExternalDocumentation2Definition> implements I.IExternalDocumentation2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IExternalDocumentation2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'EXTERNAL_DOCUMENTATION2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#external-documentation-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IExternalDocumentationSchemaProcessor): Icsd.ISchemaDefinition<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: Icsd.ISchemaDefinition<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> = {
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
      return new ExternalDocumentation(Object.assign({}, definition as unknown) as I.IExternalDocumentation2Definition)
    } else {
      return new ExternalDocumentation(Object.assign({
        url: ''
      }, definition) as I.IExternalDocumentation2Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IExternalDocumentation2Definition> | ExternalDocumentation | string | undefined): Promise<ExternalDocumentation> {
    if (definition instanceof ExternalDocumentation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IExternalDocumentation2Definition>)
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

  static async validateAsync (definition: I.IExternalDocumentation2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
