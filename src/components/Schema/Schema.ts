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
import { IExceptionLocation } from '../../Exception/IException'
import { arrayGetIntersection } from '../../util'

type ISchemaDefinitionResult = ISDSchemaDefinition<ISchema2Definition, ISchema2> | ISDSchemaDefinition<ISchema3Definition, ISchema3> | ISDSchemaDefinition<ISchema3aDefinition, ISchema3a>
type IValidatorsMap = ISchemaValidatorsMap2 | ISchemaValidatorsMap3 | ISchemaValidatorsMap3a
type IDefinition = ISchemaDefinition

interface IAllOfData {
  definition: IDefinition | null
  mergedDefinition: IDefinition
  hasExceptions: boolean
  typeLocations: IExceptionLocation[]
  formatLocations: IExceptionLocation[]
  itemsLocations: IExceptionLocation[]
  additionalPropertiesLocations: IExceptionLocation[]
  propertiesLocations: Record<string, IExceptionLocation[]>
  maxMinConflictData: ICrossConflictData
  maxMinLengthConflictData: ICrossConflictData
  maxMinItemsConflictData: ICrossConflictData
  maxMinPropertiesConflictData: ICrossConflictData
}

interface ICrossConflictData {
  hasConflict: boolean
  locations: IExceptionLocation[]
  minLocations: IExceptionLocation[]
  maxLocations: IExceptionLocation[]
  lowestMaximum?: IMinMaxData
  highestMinimum?: IMinMaxData
  conflictingMinimumLocations?: IExceptionLocation[]
  conflictingMaximumLocations?: IExceptionLocation[]
}

interface IMinMaxData {
  definition: IDefinition
  location: IExceptionLocation
  key: string
  value: number
  exclusive: boolean
}

const allOfDataMap = new WeakMap<ISchemaDefinition, IAllOfData>()
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

      const applicators: string[] = []
      ;(processor.version === '2.0' ? ['allOf'] : ['allOf', 'anyOf', 'oneOf', 'not'])
        .forEach(applicator => {
          if (applicator in definition) applicators.push(applicator)
        })

      const isTypeExempt = applicators.length > 0
      if (!isTypeExempt) {
        if (type === undefined) {
          exception.add({
            component: ctor.id,
            context: 'type',
            code: 'SCHEMA_TYPE_INDETERMINATE',
            level: 'error',
            locations: [{ node: definition }],
            metadata: {}
          })
        } else if (!('type' in definition)) {
          exception.add({
            component: ctor.id,
            context: 'type',
            code: 'SCHEMA_TYPE_NOT_SPECIFIED',
            level: 'warn',
            locations: [{ node: definition, key: 'type' }],
            metadata: {
              determinedType: type
            }
          })
        }
      }

      if (applicators.length > 1) {
        exception.add({
          component: ctor.id,
          context: 'definition',
          code: 'SCHEMA_APPLICATOR_CONFLICT',
          level: 'error',
          locations: applicators
            .map(key => {
              return { node: definition, key, filter: 'key' }
            }),
          metadata: {
            applicators
          }
        })
      }

      const allOfIsArray = Array.isArray(definition.allOf)
      if (allOfIsArray && (definition.allOf as any[]).length === 0) {
        exception.add({
          component: ctor.id,
          context: 'allOf',
          code: 'SCHEMA_ALLOF_EMPTY_ARRAY',
          level: 'error',
          locations: [{ node: definition, key: 'allOf', filter: 'value' }],
          metadata: {}
        })
      }

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
      if (allOfIsArray) {
        const allOf = ((definition.allOf ?? []) as IDefinition[]).filter((s: any) => !('$ref' in s))
        validateAllOfSchemas(ctor.id, exception, definition, allOf)
      }

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

// function getMaxMinConflictLocations (items: IExceptionLocation[], set: 'number' | 'length' | 'items' | 'properties'): ICrossConflictData {
//   const result: ICrossConflictData = {
//     hasConflict: false,
//     locations: []
//   }
//   const { maxKey, minKey } = (() => {
//     switch (set) {
//       case 'number': return { maxKey: 'maximum', minKey: 'minimum' }
//       case 'length': return { maxKey: 'maxLength', minKey: 'minLength' }
//       case 'items': return { maxKey: 'maxItems', minKey: 'minItems' }
//       case 'properties': return { maxKey: 'maxProperties', minKey: 'minProperties' }
//     }
//   })()
//   let lowestMaximum: IMinMaxData | undefined
//   let highestMinimum: IMinMaxData | undefined
//
//   items.forEach(item => {
//     const def = item.node as IDefinition
//
//     const max = def[maxKey as 'maximum']
//     if (max !== undefined && (lowestMaximum === undefined || lowestMaximum.value > max)) {
//       lowestMaximum = { definition: def, value: max, exclusive: (set === 'number' && def.exclusiveMaximum) ?? false }
//       result.lowestMaximum = lowestMaximum
//     }
//
//     const min = def[minKey as 'minimum'] as number
//     if (min !== undefined && (highestMinimum === undefined || highestMinimum.value < min)) {
//       highestMinimum = { definition: def, value: min, exclusive: (set === 'number' && def.exclusiveMinimum) ?? false }
//       result.highestMinimum = highestMinimum
//     }
//   })
//
//   // if there either isn't a minimum or maximum then there are no conflicts
//   if (lowestMaximum === undefined || highestMinimum === undefined) return result
//
//   const locations = result.locations
//   items.forEach(item => {
//     const def = item.node as IDefinition
//
//     if (maxKey in def) {
//       locations.push({ node: def, key: maxKey, filter: 'value' })
//     }
//
//     if (minKey in def) {
//       locations.push({ node: def, key: minKey, filter: 'value' })
//     }
//
//     const max = def[maxKey as 'maximum']
//     if (max !== undefined && highestMinimum !== undefined && highestMinimum.definition !== def && (highestMinimum.value > max || (highestMinimum.value === max && highestMinimum.exclusive))) {
//       result.hasConflict = true
//     }
//
//     const min = def[minKey as 'minimum'] as number
//     if (min !== undefined && lowestMaximum !== undefined && lowestMaximum.definition !== def && (lowestMaximum.value < min || (lowestMaximum.value === min && lowestMaximum.exclusive))) {
//       result.hasConflict = true
//     }
//   })
//
//   return result
// }
//
// function getMaxMinConflictValues (locations: IExceptionLocation[], minKey: string, maxKey: string): { lowestMaximum: number, highestMinimum: number } {
//   let lowestMaximum = NaN
//   let highestMinimum = NaN
//   locations.forEach(loc => {
//     const node = loc.node as any
//     if (loc.key === minKey && (isNaN(highestMinimum) || highestMinimum < node[minKey])) highestMinimum = node[minKey]
//     if (loc.key === maxKey && (isNaN(lowestMaximum) || lowestMaximum > node[maxKey])) lowestMaximum = node[maxKey]
//   })
//   return { highestMinimum, lowestMaximum }
// }

function validateAllOfSchemas (componentId: string, exception: ExceptionStore, definition: IDefinition | null, allOf: IDefinition[]): IAllOfData {
  const allOfLength = allOf.length
  const typeLocations: IExceptionLocation[] = []
  const formatLocations: IExceptionLocation[] = []
  const itemsLocations: IExceptionLocation[] = []
  const additionalPropertiesLocations: IExceptionLocation[] = []
  const propertiesLocations: Record<string, IExceptionLocation[]> = {}
  const mergedData: IAllOfData = {
    definition: definition,
    mergedDefinition: {},
    hasExceptions: false,
    typeLocations,
    formatLocations,
    maxMinConflictData: { hasConflict: false, locations: [], minLocations: [], maxLocations: [] },
    maxMinLengthConflictData: { hasConflict: false, locations: [], minLocations: [], maxLocations: [] },
    maxMinItemsConflictData: { hasConflict: false, locations: [], minLocations: [], maxLocations: [] },
    maxMinPropertiesConflictData: { hasConflict: false, locations: [], minLocations: [], maxLocations: [] },
    itemsLocations,
    additionalPropertiesLocations,
    propertiesLocations
  }

  if (allOfLength > 0) {
    const typeArrays: string[][] = []
    const formats: string[] = []
    const minLocations: IExceptionLocation[] = []
    const maxLocations: IExceptionLocation[] = []
    const minLengthLocations: IExceptionLocation[] = []
    const maxLengthLocations: IExceptionLocation[] = []
    const minItemsLocations: IExceptionLocation[] = []
    const maxItemsLocations: IExceptionLocation[] = []
    const minPropertiesLocations: IExceptionLocation[] = []
    const maxPropertiesLocations: IExceptionLocation[] = []

    // const itemsDefinitions: IDefinition[] = []
    // const additionalPropertiesDefinitions: IDefinition[] = []
    // const propertiesDefinitions: Record<string, IDefinition[]> = {}

    if (definition !== null) {
      allOfDataMap.set(definition, mergedData)
    }

    if (definition !== null) {
      if (Array.isArray(definition.type)) {
        typeArrays.push(definition.type)
        typeLocations.push({
          node: definition,
          key: 'type',
          filter: 'value'
        })
      } else if (definition.type !== undefined) {
        typeArrays.push([definition.type])
        typeLocations.push({
          node: definition,
          key: 'type',
          filter: 'value'
        })
      }
      if (definition.format !== undefined) {
        const format = definition.format
        if (!formats.includes(format)) formats.push(format)
        formatLocations.push({
          node: definition,
          key: 'format',
          filter: 'value'
        })
      }
      if (definition.minimum !== undefined) {
        minLocations.push({ node: definition, key: 'minimum', filter: 'value' })
      }
      if (definition.maximum !== undefined) {
        maxLocations.push({ node: definition, key: 'maximum', filter: 'value' })
      }
      if (definition.minLength !== undefined) {
        minLengthLocations.push({ node: definition, key: 'minLength', filter: 'value' })
      }
      if (definition.maxLength !== undefined) {
        maxLengthLocations.push({ node: definition, key: 'maxLength', filter: 'value' })
      }
      if (definition.minItems !== undefined) {
        minItemsLocations.push({ node: definition, key: 'minItems', filter: 'value' })
      }
      if (definition.maxItems !== undefined) {
        maxItemsLocations.push({ node: definition, key: 'maxItems', filter: 'value' })
      }
      if (definition.minProperties !== undefined) {
        minPropertiesLocations.push({ node: definition, key: 'minProperties', filter: 'value' })
      }
      if (definition.maxProperties !== undefined) {
        maxPropertiesLocations.push({ node: definition, key: 'maxProperties', filter: 'value' })
      }
      if (typeof definition.items === 'object' && definition.items !== null && !('$ref' in definition.items)) {
        itemsLocations.push({ node: definition, key: 'items', filter: 'value' })
      }
      if (typeof definition.additionalProperties === 'object' && definition.additionalProperties !== null && !('$ref' in definition.additionalProperties)) {
        additionalPropertiesLocations.push({ node: definition, key: 'additionalProperties', filter: 'value' })
      }
      if (typeof definition.properties === 'object' && definition.properties !== null && !('$ref' in definition.properties)) {
        Object.keys(definition.properties).forEach(key => {
          if (propertiesLocations[key] === undefined) propertiesLocations[key] = []
          propertiesLocations[key].push({ node: definition.properties as Record<string, IDefinition>, key, filter: 'value' })
        })
      }

      // if (typeof definition.items === 'object' && definition.items !== null && !('$ref' in definition.items)) {
      //   itemsDefinitions.push(definition)
      // }
      // if (typeof definition.additionalProperties === 'object' && definition.additionalProperties !== null && !('$ref' in definition.additionalProperties)) {
      //   additionalPropertiesDefinitions.push(definition.additionalProperties)
      // }
      // if (typeof definition.properties === 'object' && definition.properties !== null && !('$ref' in definition.properties)) {
      //   Object.keys(definition.properties).forEach(key => {
      //     if (propertiesDefinitions[key] === undefined) propertiesDefinitions[key] = []
      //     propertiesDefinitions[key].push((definition.properties as Record<string, IDefinition>)[key])
      //   })
      // }
    }

    allOf.forEach(def => {
      const hasAllOfData = def.allOf !== undefined && allOfDataMap.has(def)
      const existingAllOfData = hasAllOfData ? allOfDataMap.get(def) as IAllOfData : null
      const def2 = hasAllOfData
        ? (allOfDataMap.get(def) as IAllOfData).mergedDefinition
        : def

      if (Array.isArray(def2.type)) {
        typeArrays.push(def2.type)
        if (def.type !== undefined) {
          typeLocations.push({
            node: def,
            key: 'type',
            filter: 'value'
          })
        }
        if (existingAllOfData !== null) {
          typeLocations.push(...existingAllOfData.typeLocations)
        }
      } else if (def2.type !== undefined) {
        typeArrays.push([def2.type])
        if (def.type !== undefined) {
          typeLocations.push({
            node: def,
            key: 'type',
            filter: 'value'
          })
        }
        if (existingAllOfData !== null) {
          typeLocations.push(...existingAllOfData.typeLocations)
        }
      }

      if (def2.format !== undefined) {
        if (!formats.includes(def2.format)) formats.push(def2.format)
        if (def.format !== undefined) {
          formatLocations.push({
            node: def,
            key: 'format',
            filter: 'value'
          })
        }
        if (existingAllOfData !== null) {
          formatLocations.push(...existingAllOfData.formatLocations)
        }
      }

      if (def2.items !== undefined) {
        if (typeof def.items === 'object' && def.items !== null && !('$ref' in def.items)) {
          itemsLocations.push({ node: def, key: 'items', filter: 'value' })
        }
        if (existingAllOfData !== null) {
          itemsLocations.push(...existingAllOfData.itemsLocations)
        }
      }

      if (def2.additionalProperties !== undefined) {
        if (typeof def.additionalProperties === 'object' && def.additionalProperties !== null && !('$ref' in def.additionalProperties)) {
          additionalPropertiesLocations.push({ node: def, key: 'additionalProperties', filter: 'value' })
        }
        if (existingAllOfData !== null) {
          additionalPropertiesLocations.push(...existingAllOfData.additionalPropertiesLocations)
        }
      }

      if (def2.properties !== undefined) {
        if (typeof def.properties === 'object' && def.properties !== null && !('$ref' in def.properties)) {
          Object.keys(def.properties).forEach(key => {
            if (propertiesLocations[key] === undefined) propertiesLocations[key] = []
            propertiesLocations[key].push({ node: def.properties as Record<string, IDefinition>, key, filter: 'value' })
          })
        }
        if (existingAllOfData !== null && def2.properties !== null) {
          Object.keys(def2.properties).forEach(key => {
            if (propertiesLocations[key] === undefined) propertiesLocations[key] = []
            propertiesLocations[key].push(...existingAllOfData.propertiesLocations[key])
          })
        }
      }

      ;[
        { key: 'minimum', k: 'maxMinConflictData', store: minLocations, type: 'minLocations' },
        { key: 'maximum', k: 'maxMinConflictData', store: maxLocations, type: 'maxLocations' },
        { key: 'minLength', k: 'maxMinLengthConflictData', store: minLengthLocations, type: 'minLocations' },
        { key: 'maxLength', k: 'maxMinLengthConflictData', store: maxLengthLocations, type: 'maxLocations' },
        { key: 'minItems', k: 'maxMinItemsConflictData', store: minItemsLocations, type: 'minLocations' },
        { key: 'maxItems', k: 'maxMinItemsConflictData', store: maxItemsLocations, type: 'maxLocations' },
        { key: 'minProperties', k: 'maxMinPropertiesConflictData', store: minPropertiesLocations, type: 'minLocations' },
        { key: 'maxProperties', k: 'maxMinPropertiesConflictData', store: maxPropertiesLocations, type: 'maxLocations' }
      ].forEach(({ key, k, store, type }) => {
        if ((def2 as any)[key] !== undefined) {
          if ((def as any)[key] !== undefined) {
            store.push({ node: def, key, filter: 'value' })
          }
          const conflictData = existingAllOfData?.[k as 'maxMinConflictData']
          if (conflictData?.hasConflict === false) {
            store.push(...conflictData[type as 'minLocations'])
          }
        }
      })
    })

    const typesIntersection = arrayGetIntersection(...typeArrays)
    if (typesIntersection.length === 0 && typeArrays.length > 0) {
      mergedData.hasExceptions = true
      exception.add({
        component: componentId,
        context: 'allOf',
        code: 'SCHEMA_ALLOF_CONFLICT',
        level: 'error',
        locations: typeLocations,
        metadata: {
          propertyName: 'type',
          values: typeArrays
        }
      })
    } else if (typesIntersection.length === 1) {
      mergedData.mergedDefinition.type = typesIntersection[0] as 'string' // could be a string array also
    }

    if (formats.length > 1) {
      mergedData.hasExceptions = true
      exception.add({
        component: componentId,
        context: 'allOf',
        code: 'SCHEMA_ALLOF_CONFLICT',
        level: 'error',
        locations: formatLocations,
        metadata: {
          propertyName: 'format',
          values: formats
        }
      })
    } else if (formats.length === 1) {
      mergedData.mergedDefinition.format = formats[0]
    }

    if (itemsLocations.length > 0) {
      const itemsDefinitions = itemsLocations.map(l => (l.node as IDefinition).items) as IDefinition[]
      const mergedItemsSchema = validateAllOfSchemas(componentId, exception, null, itemsDefinitions)
      if (mergedItemsSchema.hasExceptions) {
        mergedData.hasExceptions = true
      } else {
        mergedData.mergedDefinition.items = mergedItemsSchema.mergedDefinition
      }
    }

    if (additionalPropertiesLocations.length > 0) {
      const additionalPropertiesDefinitions = additionalPropertiesLocations.map(l => (l.node as IDefinition).additionalProperties) as IDefinition[]
      const mergedAdditionalPropertiesSchema = validateAllOfSchemas(componentId, exception, null, additionalPropertiesDefinitions)
      if (mergedAdditionalPropertiesSchema.hasExceptions) {
        mergedData.hasExceptions = true
      } else {
        mergedData.mergedDefinition.additionalProperties = mergedAdditionalPropertiesSchema.mergedDefinition
      }
    }

    Object.keys(propertiesLocations).forEach(key => {
      const propertyDefinitions = propertiesLocations[key].map(l => (l.node as IDefinition['properties'])?.[key]) as IDefinition[]
      const mergedPropertySchema = validateAllOfSchemas(componentId, exception, null, propertyDefinitions)
      if (mergedPropertySchema.hasExceptions) {
        mergedData.hasExceptions = true
      } else {
        if (mergedData.mergedDefinition.properties === undefined) mergedData.mergedDefinition.properties = {}
        mergedData.mergedDefinition.properties[key] = mergedPropertySchema.mergedDefinition
      }
    })

    // Object.keys(propertiesDefinitions).forEach(key => {
    //   const items = propertiesDefinitions[key]
    //   mergedData.mergedDefinition.properties = {}
    //   if (items.length > 0) {
    //     const propertyMergedSchema = validateAllOfSchemas(componentId, exception, null, items)
    //     if (propertyMergedSchema.hasExceptions) {
    //       mergedData.hasExceptions = true
    //     } else {
    //       if (mergedData.mergedDefinition.properties === undefined) mergedData.mergedDefinition.properties = {}
    //       mergedData.mergedDefinition.properties[key] = propertyMergedSchema.definition as IDefinition
    //     }
    //   }
    // })

    ;[
      {
        mergeKey: 'maxMinConflictData',
        minLocations: minLocations,
        maxLocations: maxLocations,
        minKey: 'minimum',
        maxKey: 'maximum'
      },
      {
        mergeKey: 'maxMinLengthConflictData',
        minLocations: minLengthLocations,
        maxLocations: maxLengthLocations,
        minKey: 'minLength',
        maxKey: 'maxLength'
      },
      {
        mergeKey: 'maxMinItemsConflictData',
        minLocations: minItemsLocations,
        maxLocations: maxItemsLocations,
        minKey: 'minItems',
        maxKey: 'maxItems'
      },
      {
        mergeKey: 'maxMinPropertiesConflictData',
        minLocations: minPropertiesLocations,
        maxLocations: maxPropertiesLocations,
        minKey: 'minProperties',
        maxKey: 'maxProperties'
      }
    ].forEach(({ mergeKey, minLocations, maxLocations, minKey, maxKey }) => {
      const minMaxConflicts = getMinMaxConflicts(minLocations, maxLocations)
      mergedData[mergeKey as 'maxMinConflictData'] = minMaxConflicts
      if (minMaxConflicts.hasConflict) {
        exception.add({
          component: componentId,
          context: 'allOf',
          code: 'SCHEMA_ALLOF_CROSS_CONFLICT',
          level: 'error',
          locations: [
            ...minMaxConflicts.conflictingMinimumLocations as IExceptionLocation[],
            ...minMaxConflicts.conflictingMaximumLocations as IExceptionLocation[]
          ],
          metadata: {
            propertyName1: minKey,
            propertyName2: maxKey,
            value1: minMaxConflicts.highestMinimum?.value,
            value2: minMaxConflicts.lowestMaximum?.value
          }
        })
      } else {
        if (minLocations.length > 0) {
          mergedData.mergedDefinition[minKey as 'minimum'] = minMaxConflicts.highestMinimum?.value
          if (minKey === 'minimum') {
            mergedData.mergedDefinition.exclusiveMinimum = minMaxConflicts.highestMinimum?.exclusive
          }
        }
        if (maxLocations.length > 0) {
          mergedData.mergedDefinition[maxKey as 'maximum'] = minMaxConflicts.lowestMaximum?.value
          if (maxKey === 'maximum') {
            mergedData.mergedDefinition.exclusiveMaximum = minMaxConflicts.lowestMaximum?.exclusive
          }
        }
      }
    })
  }

  return mergedData
}

export function getMinMaxConflicts (minLocations: IExceptionLocation[], maxLocations: IExceptionLocation[]): ICrossConflictData {
  const locations = [...minLocations, ...maxLocations]
  if (minLocations.length === 0 || maxLocations.length === 0) {
    return {
      hasConflict: false,
      locations,
      minLocations,
      maxLocations
    }
  }

  const minimums: IMinMaxData[] = minLocations.map(l => {
    const definition = l.node as IDefinition
    return {
      definition,
      location: l,
      key: l.key as string,
      value: definition[l.key as 'minimum'],
      exclusive: (l.key === 'minimum' && definition.exclusiveMinimum) ?? false
    }
  })

  minimums.sort((a, b) => {
    if (a.value < b.value) return 1
    if (a.value > b.value) return -1
    if (a.exclusive) return -1
    return 1
  })

  const maximums: IMinMaxData[] = maxLocations.map(l => {
    const definition = l.node as IDefinition
    return {
      definition,
      location: l,
      key: l.key as string,
      value: definition[l.key as 'maximum'],
      exclusive: (l.key === 'maximum' && definition.exclusiveMaximum) ?? false
    }
  })

  maximums.sort((a, b) => {
    if (a.value < b.value) return -1
    if (a.value > b.value) return 1
    if (a.exclusive) return -1
    return 1
  })

  const highestMinimum = minimums[0]
  const lowestMaximum = maximums[0]

  // determine which minimums are above the lowest maximum
  const conflictingMinimums = minimums.filter(v => lowestMaximum.exclusive
    ? v.value >= lowestMaximum.value
    : v.value > lowestMaximum.value)

  // determine which minimums are below the highest minimum
  const conflictingMaximums = maximums.filter(v => highestMinimum.exclusive
    ? v.value <= highestMinimum.value
    : v.value < highestMinimum.value)

  if (conflictingMinimums.length === 0) {
    return {
      hasConflict: false,
      locations,
      lowestMaximum,
      highestMinimum,
      minLocations,
      maxLocations
    }
  } else {
    return {
      hasConflict: true,
      conflictingMaximumLocations: conflictingMaximums.map(c => c.location),
      conflictingMinimumLocations: conflictingMinimums.map(c => c.location),
      locations,
      lowestMaximum,
      highestMinimum,
      minLocations,
      maxLocations
    }
  }
}
// <!# Custom Content End: FOOTER #!>
