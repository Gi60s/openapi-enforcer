import { IComponentSpec, IVersion } from './IComponent'
import { HookGetProperty, HookSetProperty } from './Symbols'
import { SchemaProcessor } from '../ComponentSchemaDefinition/SchemaProcessor'
import * as S from '../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { getLocation } from '../Locator/Locator'
import { getMessage } from '../i18n/i18n'
import { IDefinition } from './IInternalTypes'

export const GetProperty = Symbol('GetProperty')
export const SetProperty = Symbol('GetProperty')

interface IComponentMapData {
  defaultValues: Record<string, any>
  getHooks: Record<string, Array<(currValue: any, originalValue: any) => any>>
  propertyValues: Record<string, any>
  processor: SchemaProcessor<any, any>
  setHooks: Record<string, Array<(currValue: any, originalValue: any) => any>>
}

type ISchemaDefinitionMap<Definition extends IDefinition, Built extends typeof EnforcerComponent<Definition>> =
  WeakMap<Definition, WeakMap<Built, S.ISchemaDefinition<any, any>>>

const componentMap = new WeakMap<any, IComponentMapData>()
const definitionSchemaMap: ISchemaDefinitionMap<any, any> = new WeakMap()

export class EnforcerComponent<Definition extends IDefinition> {
  constructor (definition: Definition, version?: IVersion, processor?: SchemaProcessor) {
    if (processor === undefined) {
      processor = new SchemaProcessor<Definition, any>(definition, this, this.constructor as typeof EnforcerComponent, version)
    }
    componentMap.set(this, {
      defaultValues: {},
      getHooks: {},
      propertyValues: {},
      processor,
      setHooks: {}
    })
    // buildComponentFromDefinition<Definition, Built>(processorData)
  }

  public [HookGetProperty]<T> (key: string, callback: (value: T) => T): void {
    const data = componentMap.get(this) as IComponentMapData
    const hooks = data.getHooks
    if (hooks[key] === undefined) hooks[key] = []
    hooks[key].push(callback)
  }

  public [HookSetProperty]<T> (key: string, callback: (currValue: T, originalValue: T) => T): void {
    const data = componentMap.get(this) as IComponentMapData
    const hooks = data.setHooks
    if (hooks[key] === undefined) hooks[key] = []
    hooks[key].push(callback)
  }

  protected [GetProperty]<T> (key: string): T {
    const data = componentMap.get(this) as IComponentMapData
    const hooks = data.getHooks[key]
    const originalValue = data.propertyValues[key] ?? data.defaultValues as T
    let value = originalValue
    hooks?.forEach(hook => {
      value = hook(value, originalValue)
    })
    return value
  }

  protected [SetProperty] (key: string, value: any): void {
    const data = componentMap.get(this) as IComponentMapData
    const hooks = data.setHooks[key]
    const record = data.propertyValues
    const originalValue = value
    let currValue = value
    hooks?.forEach(hook => {
      currValue = hook(currValue, originalValue)
    })
    record[key] = currValue
  }

  static id: string = 'BASE_COMPONENT'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false
  }

  static getSchemaDefinition (data: SchemaProcessor): S.ISchemaDefinition<any, any> {
    throw new Error(getMessage('NOT_IMPLEMENTED'))
  }

  static validate (definition: any, version?: IVersion, processor?: SchemaProcessor<any, any>): ExceptionStore {
    if (processor === undefined) {
      processor = new SchemaProcessor(definition, {}, this, version)
    }

    const { constructor: ctor, exception, version: v } = processor
    const { id, reference } = processor.component
    const spec = this.spec

    if (spec[v] === undefined) {
      exception.add({
        id,
        code: 'VERSION_NOT_IMPLEMENTED',
        level: 'error',
        locations: [],
        metadata: {
          supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
          version
        }
      })
    } else if (spec[v] === false) {
      exception.add({
        id,
        code: 'VERSION_NOT_SUPPORTED',
        level: 'error',
        locations: [],
        metadata: {
          componentName: ctor.name,
          supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
          version: version
        }
      })
    } else if (spec[v] === true) {
      exception.add({
        id,
        code: 'VERSION_MISMATCH',
        level: 'error',
        locations: [],
        metadata: {
          componentName: ctor.name,
          supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
          version: version
        }
      })
    } else if (typeof definition !== 'object' || definition === null) {
      exception.add({
        id,
        code: 'VALUE_TYPE_INVALID',
        level: 'error',
        locations: [getLocation(definition)],
        metadata: {
          expectedType: processor.component.name,
          value: definition
        },
        reference
      })
    } else {
      // check that this definition and schema have not already been evaluated
      const previousConstructors = definitionSchemaMap.get(definition)
      const existingSchemaDefinition = previousConstructors?.get(ctor)
      if (existingSchemaDefinition !== undefined) return exception

      // store new schema validation
      const schema = processor.schema as S.ISchemaDefinition<any, any>
      if (previousConstructors === undefined) {
        const ctorMap = new WeakMap()
        ctorMap.set(ctor, schema)
        definitionSchemaMap.set(definition, ctorMap)
      } else {
        previousConstructors.set(ctor, schema)
      }

      validateDefinition(processor)
    }

    return exception
  }
}

function validateChild (processor: SchemaProcessor, key: string, definition: any, schema: S.ISchema): void {
  if (schema.type === 'component') {
    const child = processor.createChild(key, definition, {}, schema.component)
    schema.component.validate(definition, processor.version, child)
  } else {
    const child = processor.createChild(key, definition, {}, null, schema)
    validateDefinition(child)
  }
}

function validateDefinition (processor: SchemaProcessor): void {
  const { definition, exception, schema } = processor
  const { id, reference } = processor.component
  const { type, nullable } = schema
  const expectedType = type === 'component' ? 'object' : type
  const actualType = Array.isArray(definition) ? 'array' : typeof definition

  if (schema.notAllowed !== undefined) {
    exception.add({
      id,
      code: 'PROPERTY_NOT_ALLOWED',
      level: 'error',
      locations: [processor.getLocation('key')],
      metadata: {
        propertyName: processor.key,
        reason: schema.notAllowed
      },
      reference
    })
    return
  }

  if (definition === null) {
    if (nullable === true) {
      return
    } else {
      exception.add({
        id,
        code: 'NULL_INVALID',
        level: 'error',
        locations: [processor.getLocation('value')],
        metadata: {},
        reference
      })
    }
  }

  if (actualType === 'object' && definition !== null && '$ref' in definition) {
    const key = processor.key
    const parentSchema = processor.parent?.schema as S.IObject
    const subSchema = parentSchema.properties?.find(s => s.name === key)?.schema ?? parentSchema.additionalProperties
    if (subSchema !== undefined && (!('allowsRef' in subSchema) || !subSchema.allowsRef)) {
      exception.add({
        id,
        code: 'REF_NOT_ALLOWED',
        level: 'warn',
        locations: [getLocation(definition, '$ref', 'key')],
        metadata: {
          definition
        },
        reference
      })
    }
  }

  if (schema.ignored === true) return

  if (expectedType !== actualType && expectedType !== 'any') {
    exception.add({
      id,
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: [processor.getLocation('value')],
      metadata: {
        actualType,
        expectedType,
        value: definition
      },
      reference
    })
  }

  if ('enum' in schema && schema.enum !== undefined && !schema.enum.includes(definition as never)) {
    exception.add({
      id,
      code: 'ENUM_NOT_MET',
      level: 'error',
      locations: [processor.getLocation('value')],
      metadata: {
        enum: schema.enum,
        value: definition
      },
      reference
    })
  }

  if (expectedType === 'any') return
  if (type === 'array') {
    const value = definition as any[]
    value.forEach((def, index) => {
      validateChild(processor, String(index), def, schema.items)
    })
  } else if (type === 'object' || type === 'component') {
    const s = schema as S.IObject
    const value: any = definition
    s.properties?.forEach(({ name, notAllowed, required }) => {
      if (value[name] === undefined && required === true && notAllowed === undefined) {
        exception.add({
          id,
          code: 'PROPERTY_MISSING',
          level: 'error',
          locations: [processor.getLocation('value')],
          metadata: {
            propertyName: name
          },
          reference
        })
      }
    })
    Object.keys(value).forEach(key => {
      const v = value[key]
      if (v !== undefined) {
        const property = s.properties?.find(p => p.name === key)
        if (property === undefined) {
          if (s.additionalProperties !== undefined) {
            validateChild(processor, key, v, s.additionalProperties)
          } else {
            exception.add({
              id,
              code: 'PROPERTY_UNKNOWN',
              level: 'error',
              locations: [getLocation(value, key, 'key')],
              metadata: {
                propertyName: key
              },
              reference
            })
          }
        } else if (property.notAllowed !== undefined) {
          exception.add({
            id,
            code: 'PROPERTY_NOT_ALLOWED',
            level: 'error',
            locations: [getLocation(value, key, 'key')],
            metadata: {
              propertyName: key,
              reason: property.notAllowed
            },
            reference
          })
        } else {
          validateChild(processor, key, v, property.schema)
        }
      }
    })
  } else if (type === 'number') {
    const v = definition as unknown as number
    if (schema.integer === true && String(v) !== String(Math.round(v))) {
      exception.add({
        id,
        code: 'VALUE_TYPE_INVALID',
        level: 'error',
        locations: [processor.getLocation('value')],
        metadata: {
          expectedType: 'integer',
          value: definition
        },
        reference
      })
    }
    if (schema.minimum !== undefined && v < schema.minimum) {
      exception.add({
        id,
        code: 'VALUE_OUT_OF_RANGE_MIN',
        level: 'error',
        locations: [processor.getLocation('value')],
        metadata: {
          minimum: schema.minimum,
          value: definition
        },
        reference
      })
    }
    if (schema.maximum !== undefined && v > schema.maximum) {
      exception.add({
        id,
        code: 'VALUE_OUT_OF_RANGE_MAX',
        level: 'error',
        locations: [processor.getLocation('value')],
        metadata: {
          maximum: schema.maximum,
          value: definition
        },
        reference
      })
    }
  } else if (type === 'oneOf') {
    const length = schema.oneOf.length
    let found = false
    for (let i = 0; i < length; i++) {
      const item = schema.oneOf[i]
      if (item.condition(processor)) {
        found = true
        validateChild(processor, processor.key, definition, item.schema)
        break
      }
    }
    if (!found) {
      exception.add({
        id,
        code: 'SCHEMA_NOT_MET',
        level: 'error',
        locations: [processor.getLocation('value')],
        metadata: {
          value: definition
        },
        reference
      })
    }
  }
}

// function buildComponentFromDefinition<Definition, Built> (data: ISchemaProcessor<Definition, Built>): void {
//   const ctor = data.constructor
//   const schema = ctor.getSchemaDefinition(data)
//   const spec = ctor.spec
// }
/*
function validateComponentDefinition (processor: SchemaProcessor): ExceptionStore {
  const { constructor: ctor, definition, exception, version } = processor
  const { id, reference } = processor.component
  const spec = processor.component.constructor.spec
  if (spec[version] === undefined) {
    exception.add({
      id,
      code: 'VERSION_NOT_IMPLEMENTED',
      level: 'error',
      locations: [],
      metadata: {
        supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
        version
      }
    })
  } else if (spec[version] === false) {
    exception.add({
      id,
      code: 'VERSION_NOT_SUPPORTED',
      level: 'error',
      locations: [],
      metadata: {
        componentName: ctor.name,
        supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
        version: version
      }
    })
  } else if (spec[version] === true) {
    exception.add({
      id,
      code: 'VERSION_MISMATCH',
      level: 'error',
      locations: [],
      metadata: {
        componentName: ctor.name,
        supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
        version: version
      }
    })
  } else if (typeof definition !== 'object' || definition === null) {
    exception.add({
      id,
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: [getLocation(definition)],
      metadata: {
        expectedType: processor.component.name,
        value: definition
      },
      reference
    })
  } else {
    // check that this definition and schema have not already been evaluated
    const previousConstructors = definitionSchemaMap.get(definition)
    const existingSchemaDefinition = previousConstructors?.get(ctor)
    if (existingSchemaDefinition !== undefined) return exception

    // store new schema validation
    const schema = processor.schema as ISchemaDefinition<any, any>
    if (previousConstructors === undefined) {
      const ctorMap = new WeakMap()
      ctorMap.set(ctor, schema)
      definitionSchemaMap.set(definition, ctorMap)
    } else {
      previousConstructors.set(ctor, schema)
    }

    validateObjectDefinition(processor)
  }
  return exception
} */

// function validateDefinition2 (data: SchemaProcessor, definition: any, key: string, schema: ISchema): void {
//   const { exception } = data
//   const { id, reference } = data.component
//   const { type: expectedType, nullable } = schema
//   const value = definition[key]
//   const actualType = Array.isArray(value) ? 'array' : typeof value
//
//   // TODO: fix this - it doesn't work yet
//   if (actualType === 'object' && '$ref' in value && (!('allowsRef' in schema) || !schema.allowsRef)) {
//     exception.add({
//       id,
//       code: 'REF_NOT_ALLOWED',
//       level: 'warn',
//       locations: [getLocation(value, '$ref', 'key')],
//       metadata: {
//         definition: value
//       },
//       reference
//     })
//   }
//
//   if (expectedType === 'any') return
//   if (value === null && nullable === true) return
//   if (schema.ignored === true) return
//   if (actualType !== (expectedType === 'component' ? 'object' : expectedType)) {
//     exception.add({
//       id,
//       code: 'VALUE_TYPE_INVALID',
//       level: 'error',
//       locations: [getLocation(definition, key, 'value')],
//       metadata: {
//         expectedType,
//         value
//       },
//       reference
//     })
//   }
//
//   if (expectedType === 'array') {
//     if (!Array.isArray(value)) {
//       exception.add({
//         id,
//         code: 'VALUE_TYPE_INVALID',
//         level: 'error',
//         locations: [getLocation(definition, key, 'value')],
//         metadata: {
//           expectedType,
//           value
//         },
//         reference
//       })
//     } else {
//       value.forEach(v => {
//         validateDefinition(data, value, v, schema.items)
//       })
//     }
//   } else if (expectedType === 'boolean') {
//     // nothing more to validate
//   } else if (expectedType === 'component') {
//     schema.component.validate(value, data.version, data)
//   } else if (expectedType === 'number') {
//     const v = value as number
//     if (schema.integer === true && String(v) !== String(Math.round(v))) {
//       exception.add({
//         id,
//         code: 'VALUE_TYPE_INVALID',
//         level: 'error',
//         locations: [getLocation(definition, key, 'value')],
//         metadata: {
//           expectedType,
//           value
//         },
//         reference
//       })
//     }
//     if (schema.minimum !== undefined && v < schema.minimum) {
//       exception.add({
//         id,
//         code: 'VALUE_OUT_OF_RANGE_MIN',
//         level: 'error',
//         locations: [getLocation(definition, key, 'value')],
//         metadata: {
//           minimum: schema.minimum,
//           value
//         },
//         reference
//       })
//     }
//     if (schema.maximum !== undefined && v > schema.maximum) {
//       exception.add({
//         id,
//         code: 'VALUE_OUT_OF_RANGE_MAX',
//         level: 'error',
//         locations: [getLocation(definition, key, 'value')],
//         metadata: {
//           maximum: schema.maximum,
//           value
//         },
//         reference
//       })
//     }
//   } else if (expectedType === 'oneOf') {
//     const length = schema.oneOf.length
//     let found = false
//     for (let i = 0; i < length; i++) {
//       const item = schema.oneOf[i]
//       if (item.condition(data)) {
//         found = true
//         validateDefinition(data, definition, key, item.schema)
//       }
//     }
//     if (!found) {
//       exception.add({
//         id,
//         code: 'SCHEMA_NOT_MET',
//         level: 'error',
//         locations: [getLocation(definition, key, 'value')],
//         metadata: {
//           value
//         },
//         reference
//       })
//     }
//   } else if (expectedType === 'object') {
//
//   } else if (expectedType === 'string') {
//     // nothing more to validate
//   }
// }
//
// function validateObjectDefinition (processor: SchemaProcessor) {
//   const { exception } = processor
//   const { id, reference } = processor.component
//   const schema = processor.schema as ISchemaObject
//   const value = processor.definition as Record<string, any>
//
//   schema.properties?.forEach(({ name, notAllowed, required }) => {
//     if (value[name] === undefined && required === true && notAllowed === undefined) {
//       exception.add({
//         id,
//         code: 'PROPERTY_MISSING',
//         level: 'error',
//         locations: [...processor.getLocation('value')],
//         metadata: {
//           propertyName: name
//         },
//         reference
//       })
//     }
//   })
//   Object.keys(value).forEach(key => {
//     const v = value[key]
//     if (v !== undefined) {
//       const property = schema.properties?.find(p => p.name === key)
//       if (property === undefined) {
//         if (schema.additionalProperties !== undefined) {
//           const child = processor.createChild(key, v, schema.additionalProperties)
//           validateDefinition(child)
//         } else {
//           exception.add({
//             id,
//             code: 'PROPERTY_UNKNOWN',
//             level: 'error',
//             locations: [getLocation(value, key, 'key')],
//             metadata: {
//               propertyName: key
//             },
//             reference
//           })
//         }
//       } else if (property.notAllowed !== undefined) {
//         exception.add({
//           id,
//           code: 'PROPERTY_NOT_ALLOWED',
//           level: 'error',
//           locations: [getLocation(value, key, 'key')],
//           metadata: {
//             propertyName: key,
//             reason: property.notAllowed
//           },
//           reference
//         })
//       } else {
//         validateDefinition(data, value, key, property.schema)
//       }
//     }
//   })
// }
