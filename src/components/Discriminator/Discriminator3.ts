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
import { loadAsync, loadAsyncAndThrow } from '../../Loader/Loader'
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IDiscriminator3Definition, I.IDiscriminator3> | null = null

interface IValidatorsMap {
  propertyName: ISchema.IProperty<ISchema.IString>
  mapping: ISchema.IProperty<ISchema.IObject<ISchema.IString>>
}

export class Discriminator extends EnforcerComponent<I.IDiscriminator3Definition> implements I.IDiscriminator3 {
  constructor (definition: I.IDiscriminator3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'DISCRIMINATOR3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#discriminator-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#discriminator-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#discriminator-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#discriminator-object'
  }

  static getSchemaDefinition (_data: I.IDiscriminatorSchemaProcessor): ISchema.ISchemaDefinition<I.IDiscriminator3Definition, I.IDiscriminator3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IDiscriminator3Definition, I.IDiscriminator3> = {
      type: 'object',
      allowsSchemaExtensions: false,
      properties: [
        validators.propertyName,
        validators.mapping
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = function (processor) {
      const { definition, exception } = processor
      const { id, reference } = processor.component

      const l = processor.getLocation()
      console.log(l)

      if (processor.parent !== null) {
        const parentDefinition = processor.parent.definition as I.ISchema3Definition
        processor.store.discriminatorSchemas.push({
          definition,
          processor: processor.parent,
          used: parentDefinition.anyOf !== undefined || parentDefinition.oneOf !== undefined
        })
      }

      processor.lastly.addSingleton(Discriminator.id, () => {
        // if there is no OpenAPI document then we can't make a fair assessment for the validity, so we skip
        if (processor.store.documentRoot === undefined) return

        processor.store.discriminatorSchemas
          .forEach(s => {
            if (!s.used) {
              exception.add({
                code: 'DISCRIMINATOR_ILLEGAL',
                id,
                level: 'error',
                locations: [processor.getLocation()],
                metadata: {},
                reference
              })
            } else if (s.definition.mapping !== undefined) {
              // TODO: check that each mapped item is listed if parent schema using oneOf or allOf
              throw Error('working here')
            }
          })

        // for any unused discriminators, look for a schema of type allOf that is using it
        processor.store.discriminatorSchemas
          .filter(s => !s.used)
          .forEach(({ definition, processor, used }) => {
            exception.add({
              code: 'DISCRIMINATOR_ILLEGAL',
              id,
              level: 'error',
              locations: [processor.getLocation()],
              metadata: {},
              reference
            })
          })
      })
      //
      //
      //
      //
      //
      // const openapi = processor.upTo('OpenAPI')
      // if (openapi === undefined) return
      //
      // const oneOfRefs = (processor.getSiblingValue('oneOf') ?? []) as string[]
      //
      // Object.keys(definition.mapping ?? {})
      //   .forEach(key => {
      //     const ref = definition.mapping?.[key] as string
      //
      //     if (!oneOfRefs.includes(ref)) {
      //       exception.add({
      //         id,
      //         code: 'DISCRIMINATOR_MAPPING_INVALID',
      //         level: 'error',
      //         locations: [getLocation(definition)],
      //         metadata: {
      //           expectedType: processor.component.name,
      //           value: definition
      //         },
      //         reference
      //       })
      //     }
      //
      //     // TODO: validate the the mapping paths have been loaded
      //   })
    }

    // Put your code here.

    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IDiscriminator3Definition> | Discriminator | undefined): Discriminator {
    if (definition instanceof Discriminator) {
      return new Discriminator(Object.assign({}, definition))
    } else {
      return new Discriminator(Object.assign({
        propertyName: ''
      }, definition) as I.IDiscriminator3Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IDiscriminator3Definition> | Discriminator | string | undefined): Promise<Discriminator> {
    if (definition instanceof Discriminator) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IDiscriminator3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IDiscriminator3Definition>> (definition?: T | undefined): I.IDiscriminator3Definition & T {
    return Object.assign({
      propertyName: ''
    }, definition) as I.IDiscriminator3Definition & T
  }

  static validate (definition: I.IDiscriminator3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IDiscriminator3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get propertyName (): string {
    return this[GetProperty]('propertyName')
  }

  set propertyName (value: string) {
    this[SetProperty]('propertyName', value)
  }

  get mapping (): Record<string, string> | undefined {
    return this[GetProperty]('mapping')
  }

  set mapping (value: Record<string, string> | undefined) {
    this[SetProperty]('mapping', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

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
