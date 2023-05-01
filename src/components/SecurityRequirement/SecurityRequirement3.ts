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
import * as Icsd from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: Icsd.ISchemaDefinition<I.ISecurityRequirement3Definition, I.ISecurityRequirement3> | null = null

const additionalProperties: Icsd.IArray<Icsd.IString> = {
  type: 'array',
  items: {
    type: 'string'
  }
}

export class SecurityRequirement extends EnforcerComponent<I.ISecurityRequirement3Definition> implements I.ISecurityRequirement3 {
  items!: Record<string, string[]>

  constructor (definition: I.ISecurityRequirement3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    Object.keys(definition).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get () {
          return this.getProperty(key)
        },
        set (value) {
          this.setProperty(key, value)
        }
      })
    })
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SECURITY_REQUIREMENT3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-requirement-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-requirement-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-requirement-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-requirement-object'
  }

  static getSchemaDefinition (_data: I.ISecurityRequirementSchemaProcessor): Icsd.ISchemaDefinition<I.ISecurityRequirement3Definition, I.ISecurityRequirement3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: Icsd.ISchemaDefinition<I.ISecurityRequirement3Definition, I.ISecurityRequirement3> = {
      type: 'object',
      allowsSchemaExtensions: false,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.ISecurityRequirement3Definition> | SecurityRequirement | undefined): SecurityRequirement {
    return new SecurityRequirement(Object.assign({}, definition) as I.ISecurityRequirement3Definition)
  }

  static async createAsync (definition?: Partial<I.ISecurityRequirement3Definition> | SecurityRequirement | string | undefined): Promise<SecurityRequirement> {
    if (definition instanceof SecurityRequirement) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISecurityRequirement3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISecurityRequirement3Definition>> (definition?: T | undefined): I.ISecurityRequirement3Definition & T {
    return Object.assign({}, definition) as I.ISecurityRequirement3Definition & T
  }

  static validate (definition: I.ISecurityRequirement3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISecurityRequirement3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
