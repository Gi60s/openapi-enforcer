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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { ExternalDocumentation as ExternalDocumentationBase } from './ExternalDocumentation'
import { IExternalDocumentation3a, IExternalDocumentation3aDefinition, IExternalDocumentation3aSchemaProcessor, IExternalDocumentationValidatorsMap3a as IValidatorsMap } from './IExternalDocumentation'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IExternalDocumentation3aDefinition, IExternalDocumentation3a> | null = null

export class ExternalDocumentation extends ExternalDocumentationBase implements IExternalDocumentation3a {
  public extensions: Record<string, any> = {}
  public description?: string
  public url!: string

  constructor (definition: IExternalDocumentation3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'externalDocumentation'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#external-documentation-object'
  }

  static getSchemaDefinition (_data: IExternalDocumentation3aSchemaProcessor): ISDSchemaDefinition<IExternalDocumentation3aDefinition, IExternalDocumentation3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IExternalDocumentation3aDefinition, IExternalDocumentation3a> = {
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

  static create (definition?: Partial<IExternalDocumentation3aDefinition> | ExternalDocumentation | undefined): ExternalDocumentation {
    if (definition instanceof ExternalDocumentation) {
      return new ExternalDocumentation(Object.assign({}, definition as unknown) as IExternalDocumentation3aDefinition)
    } else {
      return new ExternalDocumentation(Object.assign({
        url: ''
      }, definition) as IExternalDocumentation3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IExternalDocumentation3aDefinition> | ExternalDocumentation | string | undefined): Promise<ExternalDocumentation> {
    if (definition instanceof ExternalDocumentation) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IExternalDocumentation3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IExternalDocumentation3aDefinition>> (definition?: T | undefined): IExternalDocumentation3aDefinition & T {
    return Object.assign({
      url: ''
    }, definition) as IExternalDocumentation3aDefinition & T
  }

  static validate (definition: IExternalDocumentation3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IExternalDocumentation3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
