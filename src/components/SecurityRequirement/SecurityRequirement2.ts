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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.ISecurityRequirement2Definition, I.ISecurityRequirement2> | null = null

const additionalProperties: ISchema.IArray<ISchema.IString> = {
  type: 'array',
  items: {
    type: 'string'
  }
}

export class SecurityRequirement extends EnforcerComponent<I.ISecurityRequirement2Definition> implements I.ISecurityRequirement2 {
  items!: Record<string, string[]>

  constructor (definition: I.ISecurityRequirement2Definition, version?: IVersion) {
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

  static id: string = 'SECURITY_REQUIREMENT2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#security-requirement-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.ISecurityRequirementSchemaProcessor): ISchema.ISchemaDefinition<I.ISecurityRequirement2Definition, I.ISecurityRequirement2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.ISecurityRequirement2Definition, I.ISecurityRequirement2> = {
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

  static create (definition?: Partial<I.ISecurityRequirement2Definition> | SecurityRequirement | undefined): SecurityRequirement {
    return new SecurityRequirement(Object.assign({}, definition) as I.ISecurityRequirement2Definition)
  }

  static async createAsync (definition?: Partial<I.ISecurityRequirement2Definition> | SecurityRequirement | string | undefined): Promise<SecurityRequirement> {
    if (definition instanceof SecurityRequirement) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISecurityRequirement2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISecurityRequirement2Definition>> (definition?: T | undefined): I.ISecurityRequirement2Definition & T {
    return Object.assign({}, definition) as I.ISecurityRequirement2Definition & T
  }

  static validate (definition: I.ISecurityRequirement2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISecurityRequirement2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
