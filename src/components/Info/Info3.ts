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
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IInfoSchemaProcessor } from '../IInternalTypes'
import {
  Contact3,
  IContact3,
  IContact3Definition,
  IInfo3,
  IInfo3Definition,
  ILicense3,
  ILicense3Definition,
  License3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IInfo3Definition, IInfo3> | null = null

interface IValidatorsMap {
  title: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  termsOfService: ISchema.IProperty<ISchema.IString>
  contact: ISchema.IProperty<ISchema.IComponent<IContact3Definition, IContact3>>
  license: ISchema.IProperty<ISchema.IComponent<ILicense3Definition, ILicense3>>
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
      component: Contact3
    }
  },
  license: {
    name: 'license',
    schema: {
      type: 'component',
      allowsRef: false,
      component: License3
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

export class Info extends EnforcerComponent<IInfo3Definition, IInfo3> implements IInfo3 {
  [extension: `x${string}`]: any

  constructor (definition: IInfo3Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: IInfoSchemaProcessor): ISchema.ISchemaDefinition<IInfo3Definition, IInfo3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IInfo3Definition, IInfo3> = {
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

  static validate (definition: IInfo3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get title (): string {
    return this.getProperty('title')
  }

  set title (value: string) {
    this.setProperty('title', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get termsOfService (): string | undefined {
    return this.getProperty('termsOfService')
  }

  set termsOfService (value: string | undefined) {
    this.setProperty('termsOfService', value)
  }

  get contact (): IContact3 | undefined {
    return this.getProperty('contact')
  }

  set contact (value: IContact3 | undefined) {
    this.setProperty('contact', value)
  }

  get license (): ILicense3 | undefined {
    return this.getProperty('license')
  }

  set license (value: ILicense3 | undefined) {
    this.setProperty('license', value)
  }

  get version (): string {
    return this.getProperty('version')
  }

  set version (value: string) {
    this.setProperty('version', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
