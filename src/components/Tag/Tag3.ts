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

let cachedSchema: ISchema.ISchemaDefinition<I.ITag3Definition, I.ITag3> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
}

export class Tag extends EnforcerComponent<I.ITag3Definition> implements I.ITag3 {
  [S.Extensions]: Record<string, any> = {}

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

    const validators = getValidatorsMap()
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

  static create (definition?: Partial<I.ITag3Definition> | Tag | undefined): Tag {
    if (definition instanceof Tag) {
      return new Tag(Object.assign({}, definition))
    } else {
      return new Tag(Object.assign({
        name: ''
      }, definition) as I.ITag3Definition)
    }
  }

  static createDefinition<T extends Partial<I.ITag3Definition>> (definition?: T | undefined): I.ITag3Definition & T {
    return Object.assign({
      name: ''
    }, definition) as I.ITag3Definition & T
  }

  static validate (definition: I.ITag3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get name (): string {
    return this[GetProperty]('name')
  }

  set name (value: string) {
    this[SetProperty]('name', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get externalDocs (): I.IExternalDocumentation3 | undefined {
    return this[GetProperty]('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation3 | undefined) {
    this[SetProperty]('externalDocs', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

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
        component: I.ExternalDocumentation3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
