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
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { ExternalDocumentation as ExternalDocumentationBase } from './ExternalDocumentation'
import { IExternalDocumentation2, IExternalDocumentation2Definition, IExternalDocumentation2SchemaProcessor, IExternalDocumentationValidatorsMap2 as IValidatorsMap } from './IExternalDocumentation'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IExternalDocumentation2Definition, IExternalDocumentation2> | null = null

export class ExternalDocumentation extends ExternalDocumentationBase implements IExternalDocumentation2 {
  public extensions: Record<string, any> = {}
  public description?: string
  public url!: string

  constructor (definition: IExternalDocumentation2Definition, version?: IVersion) {
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
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IExternalDocumentation2SchemaProcessor): ISDSchemaDefinition<IExternalDocumentation2Definition, IExternalDocumentation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IExternalDocumentation2Definition, IExternalDocumentation2> = {
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

  static create (definition?: Partial<IExternalDocumentation2Definition> | ExternalDocumentation | undefined): ExternalDocumentation {
    if (definition instanceof ExternalDocumentation) {
      return new ExternalDocumentation(Object.assign({}, definition as unknown) as IExternalDocumentation2Definition)
    } else {
      return new ExternalDocumentation(Object.assign({
        url: ''
      }, definition) as IExternalDocumentation2Definition)
    }
  }

  static async createAsync (definition?: Partial<IExternalDocumentation2Definition> | ExternalDocumentation | string | undefined): Promise<ExternalDocumentation> {
    if (definition instanceof ExternalDocumentation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IExternalDocumentation2Definition>)
    }
  }

  static createDefinition<T extends Partial<IExternalDocumentation2Definition>> (definition?: T | undefined): IExternalDocumentation2Definition & T {
    return Object.assign({
      url: ''
    }, definition) as IExternalDocumentation2Definition & T
  }

  static validate (definition: IExternalDocumentation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IExternalDocumentation2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

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
