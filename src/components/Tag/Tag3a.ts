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
import { ExternalDocumentation3a, IExternalDocumentation3a } from '../ExternalDocumentation'
import { Tag as TagBase } from './Tag'
import { ITag3a, ITag3aDefinition, ITag3aSchemaProcessor, ITagValidatorsMap3a as IValidatorsMap } from './ITag'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ITag3aDefinition, ITag3a> | null = null

export class Tag extends TagBase implements ITag3a {
  public extensions: Record<string, any> = {}
  public name!: string
  public description?: string
  public externalDocs?: IExternalDocumentation3a

  constructor (definition: ITag3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'tag'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#tag-object'
  }

  static getSchemaDefinition (_data: ITag3aSchemaProcessor): ISDSchemaDefinition<ITag3aDefinition, ITag3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ITag3aDefinition, ITag3a> = {
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

  static create (definition?: Partial<ITag3aDefinition> | Tag | undefined): Tag {
    if (definition instanceof Tag) {
      return new Tag(Object.assign({}, definition as unknown) as ITag3aDefinition)
    } else {
      return new Tag(Object.assign({
        name: ''
      }, definition) as ITag3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<ITag3aDefinition> | Tag | string | undefined): Promise<Tag> {
    if (definition instanceof Tag) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ITag3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<ITag3aDefinition>> (definition?: T | undefined): ITag3aDefinition & T {
    return Object.assign({
      name: ''
    }, definition) as ITag3aDefinition & T
  }

  static validate (definition: ITag3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ITag3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: ExternalDocumentation3a
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
