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
import { IXml2, IXml2Definition, IXml2SchemaProcessor, IXmlValidatorsMap2 as IValidatorsMap } from './IXml'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IXml2Definition, IXml2> | null = null

export class Xml extends XmlBase implements IXml2 {
  public extensions: Record<string, any> = {}
  public name?: string
  public namespace?: string
  public prefix?: string
  public attribute?: boolean
  public wrapped?: boolean

  constructor (definition: IXml2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'xml'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#xml-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IXml2SchemaProcessor): ISDSchemaDefinition<IXml2Definition, IXml2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IXml2Definition, IXml2> = {
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

  static create (definition?: Partial<IXml2Definition> | Xml | undefined): Xml {
    return new Xml(Object.assign({}, definition) as IXml2Definition)
  }

  static async createAsync (definition?: Partial<IXml2Definition> | Xml | string | undefined): Promise<Xml> {
    if (definition instanceof Xml) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IXml2Definition>)
    }
  }

  static createDefinition<T extends Partial<IXml2Definition>> (definition?: T | undefined): IXml2Definition & T {
    return Object.assign({}, definition) as IXml2Definition & T
  }

  static validate (definition: IXml2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IXml2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
