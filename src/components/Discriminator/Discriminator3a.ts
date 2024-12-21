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
import { Discriminator as DiscriminatorBase } from './Discriminator'
import { IDiscriminator3a, IDiscriminator3aDefinition, IDiscriminator3aSchemaProcessor, IDiscriminatorValidatorsMap3a as IValidatorsMap } from './IDiscriminator'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IDiscriminator3aDefinition, IDiscriminator3a> | null = null

export class Discriminator extends DiscriminatorBase implements IDiscriminator3a {
  public extensions: Record<string, any> = {}
  public propertyName!: string
  public mapping?: Record<string, string>

  constructor (definition: IDiscriminator3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'discriminator'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#discriminator-object'
  }

  static getSchemaDefinition (_data: IDiscriminator3aSchemaProcessor): ISDSchemaDefinition<IDiscriminator3aDefinition, IDiscriminator3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IDiscriminator3aDefinition, IDiscriminator3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.propertyName,
        validators.mapping
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IDiscriminator3aDefinition> | Discriminator | undefined): Discriminator {
    if (definition instanceof Discriminator) {
      return new Discriminator(Object.assign({}, definition as unknown) as IDiscriminator3aDefinition)
    } else {
      return new Discriminator(Object.assign({
        propertyName: ''
      }, definition) as IDiscriminator3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IDiscriminator3aDefinition> | Discriminator | string | undefined): Promise<Discriminator> {
    if (definition instanceof Discriminator) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IDiscriminator3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IDiscriminator3aDefinition>> (definition?: T | undefined): IDiscriminator3aDefinition & T {
    return Object.assign({
      propertyName: ''
    }, definition) as IDiscriminator3aDefinition & T
  }

  static validate (definition: IDiscriminator3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IDiscriminator3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
    propertyName: {
      name: 'propertyName',
      required: true,
      schema: {
        type: 'string'
      }
    },
    mapping: {
      name: 'mapping',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'string'
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
