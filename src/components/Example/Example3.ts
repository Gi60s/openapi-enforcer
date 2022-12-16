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
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IExample3Definition, I.IExample3> | null = null

interface IValidatorsMap {
  summary: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  value: ISchema.IProperty<any>
  externalValue: ISchema.IProperty<ISchema.IString>
}

const validators: IValidatorsMap = {
  summary: {
    name: 'summary',
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
  value: {
    name: 'value',
    schema: {
      type: 'any'
    }
  },
  externalValue: {
    name: 'externalValue',
    schema: {
      type: 'string'
    }
  }
}

export class Example extends EnforcerComponent<I.IExample3Definition> implements I.IExample3 {
  [extension: `x${string}`]: any

  constructor (definition: I.IExample3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'EXAMPLE3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#example-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#example-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#example-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#example-object'
  }

  static getSchemaDefinition (_data: I.IExampleSchemaProcessor): ISchema.ISchemaDefinition<I.IExample3Definition, I.IExample3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IExample3Definition, I.IExample3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.summary,
        validators.description,
        validators.value,
        validators.externalValue
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IExample3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get summary (): string | undefined {
    return this.getProperty('summary')
  }

  set summary (value: string | undefined) {
    this.setProperty('summary', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get value (): any | undefined {
    return this.getProperty('value')
  }

  set value (value: any | undefined) {
    this.setProperty('value', value)
  }

  get externalValue (): string | undefined {
    return this.getProperty('externalValue')
  }

  set externalValue (value: string | undefined) {
    this.setProperty('externalValue', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
