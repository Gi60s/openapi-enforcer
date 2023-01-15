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

let cachedSchema: ISchema.ISchemaDefinition<I.IInfo3Definition, I.IInfo3> | null = null

interface IValidatorsMap {
  title: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  termsOfService: ISchema.IProperty<ISchema.IString>
  contact: ISchema.IProperty<ISchema.IComponent<I.IContact3Definition, I.IContact3>>
  license: ISchema.IProperty<ISchema.IComponent<I.ILicense3Definition, I.ILicense3>>
  version: ISchema.IProperty<ISchema.IString>
}

const validators: IValidatorsMap = {
  title: {
    name: 'title',
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
  termsOfService: {
    name: 'termsOfService',
    schema: {
      type: 'string'
    }
  },
  contact: {
    name: 'contact',
    schema: {
      type: 'component',
      allowsRef: false,
      component: I.Contact3
    }
  },
  license: {
    name: 'license',
    schema: {
      type: 'component',
      allowsRef: false,
      component: I.License3
    }
  },
  version: {
    name: 'version',
    required: true,
    schema: {
      type: 'string'
    }
  }
}

export class Info extends EnforcerComponent<I.IInfo3Definition> implements I.IInfo3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IInfo3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'INFO3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#info-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#info-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#info-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#info-object'
  }

  static getSchemaDefinition (_data: I.IInfoSchemaProcessor): ISchema.ISchemaDefinition<I.IInfo3Definition, I.IInfo3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IInfo3Definition, I.IInfo3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.title,
        validators.description,
        validators.termsOfService,
        validators.contact,
        validators.license,
        validators.version
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IInfo3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get title (): string {
    return this[GetProperty]('title')
  }

  set title (value: string) {
    this[SetProperty]('title', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get termsOfService (): string | undefined {
    return this[GetProperty]('termsOfService')
  }

  set termsOfService (value: string | undefined) {
    this[SetProperty]('termsOfService', value)
  }

  get contact (): I.IContact3 | undefined {
    return this[GetProperty]('contact')
  }

  set contact (value: I.IContact3 | undefined) {
    this[SetProperty]('contact', value)
  }

  get license (): I.ILicense3 | undefined {
    return this[GetProperty]('license')
  }

  set license (value: I.ILicense3 | undefined) {
    this[SetProperty]('license', value)
  }

  get version (): string {
    return this[GetProperty]('version')
  }

  set version (value: string) {
    this[SetProperty]('version', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>