/* eslint-disable import/no-duplicates */
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ISchemaDefinition, ISchemaBase } from './ISchema'

// <!# Custom Content Begin: HEADER #!>
import {
  ISchemaHookType,
  ISchemaHookHandler,
  ISchemaHookResult,
  ISchemaPopulateOptions, ISchemaRandomOptions, ISchemaValidateOptions, ISchemaSchemaProcessor,
  ISchemaValidatorsMap2, ISchemaValidatorsMap3, ISchemaValidatorsMap3a,
  ISchema,
  ISchema2, ISchema2Definition,
  ISchema3, ISchema3Definition,
  ISchema3a, ISchema3aDefinition
} from './ISchema'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { Result } from '../../Result'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { II18nMessageCode } from '../../i18n/i18n'
import { ILocation } from '../../Locator/ILocator'
import { IExceptionData, IExceptionLevel, IExceptionLocation } from '../../Exception/IException'
import { arrayGetIntersection } from '../../util'

type ISchemaDefinitionResult = ISDSchemaDefinition<ISchema2Definition, ISchema2> | ISDSchemaDefinition<ISchema3Definition, ISchema3> | ISDSchemaDefinition<ISchema3aDefinition, ISchema3a>
type IValidatorsMap = ISchemaValidatorsMap2 | ISchemaValidatorsMap3 | ISchemaValidatorsMap3a
type IDefinition = ISchema2Definition | ISchema3Definition | ISchema3aDefinition

const derivedDefinitionMap = new WeakMap<ISchemaDefinition, ISchemaDefinition>()
// <!# Custom Content End: HEADER #!>

export abstract class Schema extends EnforcerComponent<ISchemaDefinition> implements ISchemaBase {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  protected constructor (definition: ISchemaDefinition, version?: IVersion, processor?: SchemaProcessor) {
    super(definition, version, processor)
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  // <!# Custom Content Begin: METHODS #!>
  hook (type: ISchemaHookType, handler: ISchemaHookHandler): ISchemaHookResult {
    return {
      done: false,
      hasException: false,
      value: null
    }
  }

  deserialize (value: string, options: { strict: boolean } | undefined): any {
    return null
  }

  abstract discriminate (value: object): { key: string, name: string, schema: ISchema }

  populate (params: Record<string, any>, value: object, options?: ISchemaPopulateOptions): Result<object> {
    return new Result({})
  }

  random (value: any, options?: ISchemaRandomOptions): Result<object> {
    return new Result({})
  }

  serialize (value: any): Result {
    return new Result({})
  }

  unhook (type: ISchemaHookType, handler: ISchemaHookHandler): void {

  }

  validate (value: any, options?: ISchemaValidateOptions): ExceptionStore | undefined {
    return undefined
  }

  static commonSchemaDefinition (processor: ISchemaSchemaProcessor, validators: IValidatorsMap, result: ISchemaDefinitionResult): void {
    const { definition, exception } = processor
    const type = determineSchemaType(definition)
    const ctor = processor.component.constructor

    const additionalProperties = validators.additionalProperties
    additionalProperties.notAllowed = type !== 'object' ? 'PROPERTY_NOT_ALLOWED_UNLESS_OBJECT' : undefined

    // TODO: type may be string and format may make it numeric, so do a numeric type lookup here
    validators.maximum.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined
    validators.minimum.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined
    validators.multipleOf.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined

    result.validate = () => {
      const { definition } = processor

      const derived: ISchemaDefinition = Object.assign({}, definition, { type })
      derivedDefinitionMap.set(definition, derived)

      const isTypeExempt = ('allOf' in definition) || ('anyOf' in definition) || ('oneOf' in definition) || ('not' in definition)
      if (!isTypeExempt) {
        if (type === undefined) {
          exception.add({
            code: 'SCHEMA_TYPE_INDETERMINATE',
            id: ctor.id,
            level: 'error',
            locations: [{ node: definition }],
            metadata: {}
          })
        } else if (!('type' in definition)) {
          exception.add({
            code: 'SCHEMA_TYPE_NOT_SPECIFIED',
            id: ctor.id,
            level: 'warn',
            locations: [{ node: definition, key: 'type' }],
            metadata: {
              determinedType: type
            }
          })
        }
      }

      if (Array.isArray(definition.allOf) && definition.allOf.length === 0) {
        exception.add({
          code: 'SCHEMA_ALLOF_EMPTY_ARRAY',
          id: `${ctor.id}.allOf.arrayEmpty`,
          level: 'warn',
          locations: [{ node: definition, key: 'allOf', filter: 'value' }],
          metadata: {}
        })
      }

      // allOf conflict checks will not check child properties or items for conflicts
      /*
      type?: string
      format?: string
      maximum?: [ number, boolean ] // value, exclusive
      minimum?: [ number, boolean ] // value, exclusive
      maxLength?: number
      minLength?: number
      maxItems?: number
      minItems?: number
      maxProperties?: number
      minProperties?: number
      uniqueItems?: boolean
      enum?: any
      multipleOf?: number
      readonly?: boolean
      writeonly?: boolean
       */
      const allOf = ((definition.allOf ?? []) as IDefinition[]).filter((s: any) => !('$ref' in s))
      const allOfLength = allOf.length
      if (allOfLength > 0) {
        const typeArrays: string[][] = []
        const typeLocations: IExceptionLocation[] = []
        const formats: string[] = []
        const formatLocations: IExceptionLocation[] = []
        const maxMinDefinitions: IDefinition[] = []
        const maxMinLengthDefinitions: IDefinition[] = []
        const maxMinItemsDefinitions: IDefinition[] = []
        const maxMinPropertiesDefinitions: IDefinition[] = []

        if (Array.isArray(definition.type)) {
          typeArrays.push(definition.type)
          typeLocations.push({ node: definition, key: 'type', filter: 'value' })
        } else if (definition.type !== undefined) {
          typeArrays.push([definition.type])
          typeLocations.push({ node: definition, key: 'type', filter: 'value' })
        }
        if (definition.format !== undefined) {
          const format = definition.format
          if (!formats.includes(format)) formats.push(format)
          formatLocations.push({ node: definition, key: 'format', filter: 'value' })
        }
        if (definition.maximum !== undefined || definition.minimum !== undefined) {
          maxMinDefinitions.push(definition)
        }
        if (definition.maxLength !== undefined || definition.minLength !== undefined) {
          maxMinLengthDefinitions.push(definition)
        }
        if (definition.maxItems !== undefined || definition.minItems !== undefined) {
          maxMinItemsDefinitions.push(definition)
        }
        if (definition.maxProperties !== undefined || definition.minProperties !== undefined) {
          maxMinPropertiesDefinitions.push(definition)
        }

        allOf.forEach(def => {
          if (Array.isArray(def.type)) {
            typeArrays.push(def.type)
            typeLocations.push({ node: def, key: 'type', filter: 'value' })
          } else if (def.type !== undefined) {
            typeArrays.push([def.type])
            typeLocations.push({ node: def, key: 'type', filter: 'value' })
          }
          if (def.format !== undefined) {
            if (!formats.includes(def.format)) formats.push(def.format)
            formatLocations.push({ node: def, key: 'format', filter: 'value' })
          }
          if (def.maximum !== undefined || def.minimum !== undefined) {
            maxMinDefinitions.push(def)
          }
          if (def.maxLength !== undefined || def.minLength !== undefined) {
            maxMinLengthDefinitions.push(def)
          }
          if (def.maxItems !== undefined || def.minItems !== undefined) {
            maxMinItemsDefinitions.push(def)
          }
          if (def.maxProperties !== undefined || def.minProperties !== undefined) {
            maxMinPropertiesDefinitions.push(def)
          }
        })

        const typesIntersection = arrayGetIntersection(...typeArrays)
        if (typesIntersection.length === 0 && typeArrays.length > 0) {
          exception.add({
            id: `${ctor.id}.allOf.type.conflict`,
            code: 'SCHEMA_ALLOF_CONFLICT',
            level: 'error',
            locations: typeLocations,
            metadata: {
              propertyName: 'type',
              values: typeArrays
            }
          })
        }

        if (formats.length > 1) {
          exception.add({
            id: `${ctor.id}.allOf.format.conflict`,
            code: 'SCHEMA_ALLOF_CONFLICT',
            level: 'error',
            locations: formatLocations,
            metadata: {
              propertyName: 'format',
              values: formats
            }
          })
        }

        const maxMinLocations = getMaxMinConflictLocations(maxMinDefinitions, 'number')
        if (maxMinLocations.length > 0) {
          exception.add({
            id: `${ctor.id}.allOf.maxMin.crossConflict`,
            code: 'SCHEMA_ALLOF_CROSS_CONFLICT',
            level: 'error',
            locations: maxMinLocations,
            metadata: {
              propertyName1: 'maximum',
              propertyName2: 'minimum'
            }
          })
        }

        const maxMinLengthLocations = getMaxMinConflictLocations(maxMinLengthDefinitions, 'length')
        if (maxMinLengthLocations.length > 0) {
          exception.add({
            id: `${ctor.id}.allOf.maxMinLength.crossConflict`,
            code: 'SCHEMA_ALLOF_CROSS_CONFLICT',
            level: 'error',
            locations: maxMinLengthLocations,
            metadata: {
              propertyName1: 'maxLength',
              propertyName2: 'minLength'
            }
          })
        }

        const maxMinItemsLocations = getMaxMinConflictLocations(maxMinItemsDefinitions, 'items')
        if (maxMinItemsLocations.length > 0) {
          exception.add({
            id: `${ctor.id}.allOf.maxMinItems.crossConflict`,
            code: 'SCHEMA_ALLOF_CROSS_CONFLICT',
            level: 'error',
            locations: maxMinItemsLocations,
            metadata: {
              propertyName1: 'maxItems',
              propertyName2: 'minItems'
            }
          })
        }

        const maxMinPropertiesLocations = getMaxMinConflictLocations(maxMinPropertiesDefinitions, 'properties')
        if (maxMinPropertiesLocations.length > 0) {
          exception.add({
            id: `${ctor.id}.allOf.maxMinProperties.crossConflict`,
            code: 'SCHEMA_ALLOF_CROSS_CONFLICT',
            level: 'error',
            locations: maxMinPropertiesLocations,
            metadata: {
              propertyName1: 'maxProperties',
              propertyName2: 'minProperties'
            }
          })
        }
      }

      // if (Array.isArray(definition.allOf)) {
      //   const allOf = (definition.allOf as IDefinition[]).filter((s: any) => !('$ref' in s))
      //
      //     // first check that any properties that must be equal are equal
      //   ;(allOfMustBeEqualProperties as Array<keyof IDefinition>).forEach(key => {
      //     const conflicts: IAllOfData[] = []
      //     let hasConflicts = false
      //     allOf.forEach((definition, index) => {
      //       // it should always get the derived schema because it was set already during the validator of the child schema
      //       const schema = derivedDefinitionMap.get(definition) ?? definition
      //       if (key in schema) {
      //         const value = schema[key]
      //         if (derived[key] === undefined) derived[key] = value
      //         conflicts.push({ definition, value })
      //         if (index > 0 && !deepEqual(conflicts[0].value, value)) hasConflicts = true
      //       }
      //     })
      //
      //     if (hasConflicts) {
      //       exception.add({
      //         code: 'SCHEMA_ALL_CONFLICT',
      //         id: ctor.id,
      //         level: 'error',
      //         locations: conflicts.map(conflict => getLocation(conflict.definition, key, 'value')),
      //         metadata: {
      //           propertyName: key,
      //           values: Array.from(new Set(conflicts.map(c => c.value)))
      //         }
      //       })
      //     }
      //   })
      //
      //   if (derived.type === 'object') {
      //     const conflicts: IAllOfData[] = []
      //     allOfDeepObjectComparison(allOf, conflicts)
      //   }
      // }

      // TODO: additional validations
    }
  }
  // <!# Custom Content End: METHODS #!>
}

// <!# Custom Content Begin: FOOTER #!>
function determineSchemaType (definition: ISchemaDefinition | ISchema): 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string' | Array<'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'> | undefined {
  if (definition.type !== undefined) return definition.type
  if ('items' in definition ||
    'maxItems' in definition ||
    'minItems' in definition ||
    'uniqueItems' in definition ||
    Array.isArray(definition.default) ||
    Array.isArray(definition.enum?.[0])) return 'array'
  if ('additionalProperties' in definition ||
    'discriminator' in definition ||
    'properties' in definition ||
    'maxProperties' in definition ||
    'minProperties' in definition ||
    'required' in definition ||
    (typeof definition.default === 'object' && definition.default !== null) ||
    (typeof definition.enum?.[0] === 'object' && definition.enum[0] !== null)) return 'object'
  if ('maximum' in definition ||
    'minimum' in definition ||
    'exclusiveMaximum' in definition ||
    'exclusiveMinimum' in definition ||
    'multipleOf' in definition ||
    typeof definition.default === 'number' ||
    typeof definition.enum?.[0] === 'number') return 'number'
  if ('maxLength' in definition ||
    'minLength' in definition ||
    'pattern' in definition ||
    typeof definition.default === 'string' ||
    typeof definition.enum?.[0] === 'string') return 'string'
  if (typeof definition.default === 'boolean' ||
    typeof definition.enum?.[0] === 'boolean') return 'boolean'
}

function getMaxMinConflictLocations (items: IDefinition[], set: 'number' | 'length' | 'items' | 'properties'): IExceptionLocation[] {
  const { maxKey, minKey } = (() => {
    switch (set) {
      case 'number': return { maxKey: 'maximum', minKey: 'minimum' }
      case 'length': return { maxKey: 'maxLength', minKey: 'minLength' }
      case 'items': return { maxKey: 'maxItems', minKey: 'minItems' }
      case 'properties': return { maxKey: 'maxProperties', minKey: 'minProperties' }
    }
  })()
  let lowestMaximum: { definition: IDefinition, value: number, exclusive: boolean } | undefined
  let highestMinimum: { definition: IDefinition, value: number, exclusive: boolean } | undefined

  items.forEach(item => {
    const max = item[maxKey as 'maximum']
    if (max !== undefined && (lowestMaximum === undefined || lowestMaximum.value > max)) {
      lowestMaximum = { definition: item, value: max, exclusive: (set === 'number' && item.exclusiveMaximum) ?? false }
    }

    const min = item[minKey as 'minimum'] as number
    if (min !== undefined && (highestMinimum === undefined || highestMinimum.value < min)) {
      highestMinimum = { definition: item, value: min, exclusive: (set === 'number' && item.exclusiveMinimum) ?? false }
    }
  })

  // if there either isn't a minimum or maximum then there are no conflicts
  if (lowestMaximum === undefined || highestMinimum === undefined) return []

  const locations: IExceptionLocation[] = []
  items.forEach(item => {
    const max = item[maxKey as 'maximum']
    if (max !== undefined && highestMinimum !== undefined && highestMinimum.definition !== item && (highestMinimum.value > max || (highestMinimum.value === max && highestMinimum.exclusive))) {
      locations.push({ node: item, key: maxKey, filter: 'value' })
    }

    const min = item[minKey as 'minimum'] as number
    if (min !== undefined && lowestMaximum !== undefined && lowestMaximum.definition !== item && (lowestMaximum.value < min || (lowestMaximum.value === min && lowestMaximum.exclusive))) {
      locations.push({ node: item, key: minKey, filter: 'value' })
    }
  })

  return locations
}
// <!# Custom Content End: FOOTER #!>
