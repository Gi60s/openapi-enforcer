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

let cachedSchema: ISchema.ISchemaDefinition<I.IXml2Definition, I.IXml2> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  namespace: ISchema.IProperty<ISchema.IString>
  prefix: ISchema.IProperty<ISchema.IString>
  attribute: ISchema.IProperty<ISchema.IBoolean>
  wrapped: ISchema.IProperty<ISchema.IBoolean>
}

const validators: IValidatorsMap = {
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

export class Xml extends EnforcerComponent<I.IXml2Definition> implements I.IXml2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IXml2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'XML2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#xml-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IXmlSchemaProcessor): ISchema.ISchemaDefinition<I.IXml2Definition, I.IXml2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IXml2Definition, I.IXml2> = {
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

  static validate (definition: I.IXml2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
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

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
