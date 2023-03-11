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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IXml3Definition, I.IXml3> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  namespace: ISchema.IProperty<ISchema.IString>
  prefix: ISchema.IProperty<ISchema.IString>
  attribute: ISchema.IProperty<ISchema.IBoolean>
  wrapped: ISchema.IProperty<ISchema.IBoolean>
}

export class Xml extends EnforcerComponent<I.IXml3Definition> implements I.IXml3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IXml3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'XML3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#xml-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#xml-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#xml-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#xml-object'
  }

  static getSchemaDefinition (_data: I.IXmlSchemaProcessor): ISchema.ISchemaDefinition<I.IXml3Definition, I.IXml3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IXml3Definition, I.IXml3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators.namespace,
        validators.prefix,
        validators.attribute,
        validators.wrapped
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IXml3Definition> | Xml | undefined): Xml {
    return new Xml(Object.assign({}, definition) as I.IXml3Definition)
  }

  static async createAsync (definition?: Partial<I.IXml3Definition> | Xml | string | undefined): Promise<Xml> {
    if (definition instanceof Xml) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IXml3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IXml3Definition>> (definition?: T | undefined): I.IXml3Definition & T {
    return Object.assign({}, definition) as I.IXml3Definition & T
  }

  static validate (definition: I.IXml3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IXml3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get name (): string | undefined {
    return this[GetProperty]('name')
  }

  set name (value: string | undefined) {
    this[SetProperty]('name', value)
  }

  get namespace (): string | undefined {
    return this[GetProperty]('namespace')
  }

  set namespace (value: string | undefined) {
    this[SetProperty]('namespace', value)
  }

  get prefix (): string | undefined {
    return this[GetProperty]('prefix')
  }

  set prefix (value: string | undefined) {
    this[SetProperty]('prefix', value)
  }

  get attribute (): boolean | undefined {
    return this[GetProperty]('attribute')
  }

  set attribute (value: boolean | undefined) {
    this[SetProperty]('attribute', value)
  }

  get wrapped (): boolean | undefined {
    return this[GetProperty]('wrapped')
  }

  set wrapped (value: boolean | undefined) {
    this[SetProperty]('wrapped', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    name: {
      name: 'name',
      schema: {
        type: 'string'
      }
    },
    namespace: {
      name: 'namespace',
      schema: {
        type: 'string'
      }
    },
    prefix: {
      name: 'prefix',
      schema: {
        type: 'string'
      }
    },
    attribute: {
      name: 'attribute',
      schema: {
        type: 'boolean'
      }
    },
    wrapped: {
      name: 'wrapped',
      schema: {
        type: 'boolean'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
