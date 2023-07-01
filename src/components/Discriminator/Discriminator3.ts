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
import { IDiscriminator3, IDiscriminator3Definition, IDiscriminator3SchemaProcessor, IDiscriminatorValidatorsMap3 as IValidatorsMap } from './IDiscriminator'
// <!# Custom Content Begin: HEADER #!>
import { ISchema3Definition } from '../Schema'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IDiscriminator3Definition, IDiscriminator3> | null = null

export class Discriminator extends DiscriminatorBase implements IDiscriminator3 {
  public propertyName!: string
  public mapping?: Record<string, string>

  constructor (definition: IDiscriminator3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'DISCRIMINATOR3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#discriminator-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#discriminator-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#discriminator-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#discriminator-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IDiscriminator3SchemaProcessor): ISDSchemaDefinition<IDiscriminator3Definition, IDiscriminator3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IDiscriminator3Definition, IDiscriminator3> = {
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

      if (processor.parent !== null) {
        const parentDefinition = processor.parent.definition as ISchema3Definition
        processor.store.discriminatorSchemas.push({
          definition,
          processor: processor.parent,
          used: parentDefinition.anyOf !== undefined || parentDefinition.oneOf !== undefined
        })
      }

      processor.lastly.addSingleton(Discriminator.id, (mode) => {
        // if there is no OpenAPI document then we can't make a fair assessment for the validity, so we skip
        if (processor.store.documentRoot === undefined) return

        processor.store.discriminatorSchemas
          .forEach(s => {
            if (mode === 'validate') {
              if (!s.used) {
                exception.add({
                  code: 'DISCRIMINATOR_ILLEGAL',
                  id,
                  level: 'error',
                  locations: [processor.getLocation()],
                  metadata: {},
                  reference
                })
                // return
              }

              //
              // const parentDefinition = processor.parent?.definition
              // const anyOfOneOf = parentDefinition?.anyOf !== undefined
              //   ? 'anyOf'
              //   : parentDefinition?.oneOf !== undefined ? 'oneOf' : ''
              // const parentDefinitionAnyOneOfCollection = (parentDefinition?.[anyOfOneOf] ?? []) as ISchema3Definition[]
              // const requiredPropertyName = s.definition.propertyName
              //
              // working here - make sure each anyOf/oneOf has discriminator property name. As required = no warning, as property or additional property = warning, no additional property = error
              // if (anyOfOneOf !== undefined && requiredPropertyName !== undefined) {
              //   parentDefinitionAnyOneOfCollection.forEach(itemSchema => {
              //     const schema = getNormalizedSchema(itemSchema, { [requiredPropertyName]: '' })
              //
              //     // TODO: a problem here is what if the schema is an anyOf, allOf, or oneOf? This won't work. I need to determine the final schema
              //     if (!(schema?.required ?? []).includes(requiredPropertyName)) {
              //
              //
              //       if (schema?.properties?.[requiredPropertyName] === undefined ||)
              //     }
              //   })
              //
              //   const requiredProperties = getSchemaPropertyValue(parentDefinition as ISchema3Definition,
              //     [anyOfOneOf, 'require'])
              //
              //   const hasRequiredProperty = parentDefinitionAnyOneOfCollection.require
              //     ?.find(propertyName => propertyName === requiredPropertyName) !== undefined
              //   if (!hasRequiredProperty) {
              //
              //   } else if ()
              //
              //   // if ( && parentDefinition?.[anyOfOneOf]?.properties?.[s.definition.propertyName] === undefined)
              //
              //   exception.add({
              //     code: 'DISCRIMINATOR_REQUIRED_PROPERTY',
              //     id,
              //     level: 'error',
              //     locations: [getLocation(parentDefinition[anyOfOneOf], 'properties', 'value')],
              //     metadata: { propertyName: s.definition.propertyName },
              //     reference
              //   })
              // }
              //
              // if (s.definition.mapping !== undefined) {
              //
              //   const mapping = s.definition.mapping
              //   const rootNode = getLocation(s.definition)?.root.node as any
              //   Object.keys(mapping)
              //     .forEach(key => {
              //       const ref = mapping[key]
              //       const match = traverseFromNode(s.definition, ref) ?? rootNode?.components?.schemas?.[ref]
              //       if (match === undefined || parentDefinition[anyOfOneOf].find((s: any) => s === match) === undefined) {
              //         exception.add({
              //           code: 'DISCRIMINATOR_MAPPING_INVALID',
              //           id,
              //           level: 'error',
              //           locations: [getLocation(mapping, key, 'value')],
              //           metadata: { anyOfOneOf, value: ref },
              //           reference
              //         })
              //       }
              //     })
              // }
            }
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

  static create (definition?: Partial<IDiscriminator3Definition> | Discriminator | undefined): Discriminator {
    if (definition instanceof Discriminator) {
      return new Discriminator(Object.assign({}, definition as unknown) as IDiscriminator3Definition)
    } else {
      return new Discriminator(Object.assign({
        propertyName: ''
      }, definition) as IDiscriminator3Definition)
    }
  }

  static async createAsync (definition?: Partial<IDiscriminator3Definition> | Discriminator | string | undefined): Promise<Discriminator> {
    if (definition instanceof Discriminator) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IDiscriminator3Definition>)
    }
  }

  static createDefinition<T extends Partial<IDiscriminator3Definition>> (definition?: T | undefined): IDiscriminator3Definition & T {
    return Object.assign({
      propertyName: ''
    }, definition) as IDiscriminator3Definition & T
  }

  static validate (definition: IDiscriminator3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IDiscriminator3Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
