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
import { Xml as XmlBase } from './Xml'
import { IXml3, IXml3Definition, IXml3SchemaProcessor, IXmlValidatorsMap3 as IValidatorsMap } from './IXml'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IXml3Definition, IXml3> | null = null

export class Xml extends XmlBase implements IXml3 {
  public extensions: Record<string, any> = {}
  public name?: string
  public namespace?: string
  public prefix?: string
  public attribute?: boolean
  public wrapped?: boolean

  constructor (definition: IXml3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'XML3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#xml-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#xml-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#xml-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#xml-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IXml3SchemaProcessor): ISDSchemaDefinition<IXml3Definition, IXml3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IXml3Definition, IXml3> = {
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

  static create (definition?: Partial<IXml3Definition> | Xml | undefined): Xml {
    return new Xml(Object.assign({}, definition) as IXml3Definition)
  }

  static async createAsync (definition?: Partial<IXml3Definition> | Xml | string | undefined): Promise<Xml> {
    if (definition instanceof Xml) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IXml3Definition>)
    }
  }

  static createDefinition<T extends Partial<IXml3Definition>> (definition?: T | undefined): IXml3Definition & T {
    return Object.assign({}, definition) as IXml3Definition & T
  }

  static validate (definition: IXml3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IXml3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
