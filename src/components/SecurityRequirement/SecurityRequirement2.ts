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
import { ISDSchemaDefinition, ISDArray, ISDString } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { SecurityRequirement as SecurityRequirementBase } from './SecurityRequirement'
import { ISecurityRequirement2, ISecurityRequirement2Definition, ISecurityRequirement2SchemaProcessor } from './ISecurityRequirement'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ISecurityRequirement2Definition, ISecurityRequirement2> | null = null

const additionalProperties: ISDArray<ISDString> = {
  type: 'array',
  items: {
    type: 'string'
  }
}

export class SecurityRequirement extends SecurityRequirementBase implements ISecurityRequirement2 {
  properties!: Record<string, string[] | undefined>

  constructor (definition: ISecurityRequirement2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
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
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: ISecurityRequirement2SchemaProcessor): ISDSchemaDefinition<ISecurityRequirement2Definition, ISecurityRequirement2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<ISecurityRequirement2Definition, ISecurityRequirement2> = {
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

  static create (definition?: Partial<ISecurityRequirement2Definition> | SecurityRequirement | undefined): SecurityRequirement {
    return new SecurityRequirement(Object.assign({}, definition) as ISecurityRequirement2Definition)
  }

  static async createAsync (definition?: Partial<ISecurityRequirement2Definition> | SecurityRequirement | string | undefined): Promise<SecurityRequirement> {
    if (definition instanceof SecurityRequirement) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ISecurityRequirement2Definition>)
    }
  }

  static createDefinition<T extends Partial<ISecurityRequirement2Definition>> (definition?: T | undefined): ISecurityRequirement2Definition & T {
    return Object.assign({}, definition) as ISecurityRequirement2Definition & T
  }

  static validate (definition: ISecurityRequirement2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ISecurityRequirement2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
