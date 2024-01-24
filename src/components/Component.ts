import { IComponentSpec, IVersion } from './IComponent'
import { SchemaProcessor } from '../ComponentSchemaDefinition/SchemaProcessor'
import * as S from '../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { getLocation, load } from '../Loader'
import { getMessage } from '../i18n/i18n'
import { IDefinition } from './IInternalTypes'
import {
  ISDObject,
  ISDOneOf,
  ISDSchema,
  ISDSchemaDefinition
} from '../ComponentSchemaDefinition/IComponentSchemaDefinition'

type ISchemaDefinitionMap<Definition extends IDefinition, Built extends typeof EnforcerComponent<Definition>> =
  WeakMap<Definition, WeakMap<Built, ISDSchemaDefinition<any, any>>>

const definitionSchemaMap: ISchemaDefinitionMap<any, any> = new WeakMap()

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EnforcerComponent<Definition extends IDefinition> {
  readonly #defaultValues: Record<string, any>
  readonly #definition: Definition
  readonly #getHooks: Record<string, Array<(value: any) => any>>
  readonly #processor: SchemaProcessor
  readonly #propertyValues: Record<string, any>
  readonly #setHooks: Record<string, Array<(currValue: any, originalValue: any) => any>>

  constructor (definition: Definition, version?: IVersion, processor?: SchemaProcessor) {
    this.#defaultValues = {}
    this.#getHooks = {}
    this.#setHooks = {}
    this.#propertyValues = {}
    this.#definition = definition

    if (processor === undefined) {
      processor = new SchemaProcessor<Definition, any>('build', definition, this, this.constructor as typeof EnforcerComponent, version)
    }
    this.#processor = processor

    // buildComponentFromDefinition<Definition, Built>(processorData)
  }

  protected getParent<T = any> (componentName?: string): { component: T | undefined, keys: string[] } {
    if (componentName === undefined) {
      return {
        component: undefined,
        keys: []
      }
    } else {
      return {
        component: undefined,
        keys: []
      }
    }
  }

  /**
   * If you want to modify a property's retrieved value, call this function to define how the property value
   * should be modified.
   * @param key
   * @param callback
   */
  protected getPropertyHook<T> (key: string, callback: ((value: T) => T)): void {
    const hooks = this.#getHooks
    if (hooks[key] === undefined) hooks[key] = []
    hooks[key].push(callback)
  }

  /**
   * If you want to modify a property's set value, call this function to define how the property value should
   * be modified prior to setting.
   * @param key
   * @param callback
   */
  protected setPropertyHook<T> (key: string, callback: ((newValue: T, oldValue: T) => T)): void {
    const hooks = this.#setHooks
    if (hooks[key] === undefined) hooks[key] = []
    hooks[key].push(callback)
  }

  /**
   * Calling this function gets the value for this property, runs it through any defined get hooks, and returns
   * the final value.
   * @param {string} key
   * @protected
   */
  protected getProperty<T> (key: string): T {
    const hooks = this.#getHooks[key]
    const originalValue = this.#propertyValues[key] ?? this.#defaultValues as T
    let value = originalValue
    hooks?.forEach(hook => {
      value = hook(value)
    })
    return value
  }

  /**
   * Calling this function takes the value to be set for this property, runs it through any defined set hooks,
   * and then sets the property to this value.
   * @param key
   * @param value
   * @protected
   */
  protected setProperty<T> (key: string, value: T): void {
    const hooks = this.#setHooks[key]
    const record = this.#propertyValues
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
    '3.0.3': false,
    '3.1.0': false
  }

  static getSchemaDefinition (data: SchemaProcessor): ISDSchemaDefinition<any, any> {
    throw new Error(getMessage('NOT_IMPLEMENTED'))
  }

  static validate (definition: any, version?: IVersion, processor?: SchemaProcessor<any, any>): ExceptionStore {
    const isRoot = processor === undefined
    if (processor === undefined) {
      processor = new SchemaProcessor('validate', definition, {}, this, version)
      const location = getLocation(definition)
      if (location === undefined) load(definition)
    }

    const { constructor: ctor, exception, version: v } = processor
    const { id, reference } = processor.component
    const spec = this.spec

    if (spec[v] === undefined) {
      exception.add({
        component: id,
        context: 'version',
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
        component: id,
        context: 'version',
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
        component: id,
        context: 'version',
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
        component: id,
        context: 'definition',
        code: 'VALUE_TYPE_INVALID',
        level: 'error',
        locations: [{ node: definition }],
        metadata: {
          expectedType: processor.component.name,
          value: definition
        },
        reference
      })
    } else {
      const previouslyProcessed = validateDefinition(processor)

      if (!previouslyProcessed) {
        const schema = processor.schema as ISDSchemaDefinition<any, any>
        if (typeof schema.validate === 'function') {
          schema.validate(processor)
        }

        if (processor.after !== undefined) {
          processor.after()
        }

        if (isRoot) {
          processor.lastly.run()
        }
      }
    }

    return exception
  }
}

function validateChild (processor: SchemaProcessor, key: string, definition: any, schema: ISDSchema): void {
  if (schema.type === 'oneOf') {
    const length = schema.oneOf.length
    const oneOf = schema.oneOf
    let conditionMet = false
    for (let i = 0; i < length; i++) {
      const s = oneOf[i]
      if (s.condition(definition, key, processor)) {
        schema = s.schema
        conditionMet = true
        break
      }
    }
    if (!conditionMet) {
      const error = (schema as ISDOneOf).error
      if (typeof error === 'function') {
        error(processor)
      } else {
        const component = processor.component
        processor.exception.add({
          code: 'VALUE_TYPE_INVALID',
          component: component.name,
          context: key,
          level: 'error',
          locations: [{ node: definition, key, filter: 'value' }],
          metadata: {
            type: typeof definition,
            value: definition,
            allowedTypes: error
          },
          reference: component.reference
        })
      }
      return
    }
  }

  if (schema.type === 'component') {
    const child = processor.createChild(key, definition, {}, schema.component)
    schema.component.validate(definition, processor.version, child)
  } else {
    const child = processor.createChild(key, definition, {}, null, schema)
    validateDefinition(child)
  }
}

function validateDefinition (processor: SchemaProcessor): boolean {
  const { definition, exception, schema } = processor
  const { id, reference } = processor.component
  const parentDefinition = processor.parent?.definition

  if (schema === undefined) {
    exception.add({
      component: id,
      context: 'definition',
      code: 'SCHEMA_NOT_MET',
      level: 'error',
      locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
      metadata: {
        value: definition
      },
      reference
    })
    return false
  }

  // check that this definition and schema have not already been evaluated together - recursion break
  if (typeof definition === 'object' && definition !== null) {
    const previousSchemas = definitionSchemaMap.get(definition)
    const existingSchemaDefinition = previousSchemas?.get(schema)
    if (existingSchemaDefinition !== undefined) {
      processor.built = existingSchemaDefinition
      return true
    }

    if (previousSchemas === undefined) {
      const definitionsMap = new WeakMap()
      definitionsMap.set(schema, processor.built)
      definitionSchemaMap.set(definition, definitionsMap)
    } else {
      previousSchemas.set(schema, processor.built)
    }
  }

  const { type, nullable } = schema
  const expectedType = type === 'component' ? 'object' : type
  const actualType = Array.isArray(definition) ? 'array' : typeof definition

  if (schema.notAllowed !== undefined) {
    exception.add({
      component: id,
      context: processor.key,
      code: schema.notAllowed,
      level: 'error',
      locations: [{ node: parentDefinition, key: processor.key, filter: 'key' }],
      metadata: {
        propertyName: processor.key
      },
      reference
    })
    return false
  }

  if (definition === null) {
    if (nullable === true) {
      return false
    } else {
      exception.add({
        component: id,
        context: 'definition',
        code: 'NULL_INVALID',
        level: 'error',
        locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
        metadata: {},
        reference
      })
    }
  }

  if (actualType === 'object' && definition !== null && '$ref' in definition) {
    const key = processor.key
    const parentSchema = processor.parent?.schema as ISDObject
    const subSchema = processor.schema.type === 'oneOf'
      ? schema
      : parentSchema.properties?.find(s => s.name === key)?.schema ?? parentSchema.additionalProperties
    if (subSchema !== undefined && (!('allowsRef' in subSchema) || !subSchema.allowsRef)) {
      exception.add({
        component: id,
        context: '$ref',
        code: 'REF_NOT_ALLOWED',
        level: 'warn',
        locations: [{ node: definition, key: '$ref', filter: 'key' }],
        metadata: {
          definition
        },
        reference
      })
    }
  }

  if (schema.ignored === true) return false

  if (expectedType !== actualType && expectedType !== 'any' && expectedType !== 'oneOf') {
    exception.add({
      component: id,
      context: processor.key,
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
      metadata: {
        allowedTypes: expectedType,
        type: actualType,
        value: definition
      },
      reference
    })
    return false
  }

  if ('enum' in schema && schema.enum !== undefined && !schema.enum.includes(definition as never)) {
    exception.add({
      component: id,
      context: processor.key,
      code: 'ENUM_NOT_MET',
      level: 'error',
      locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
      metadata: {
        enum: schema.enum,
        value: definition
      },
      reference
    })
  }

  if (expectedType === 'any') return false
  if (type === 'array') {
    const value = definition as any[]
    value.forEach((def, index) => {
      validateChild(processor, String(index), def, schema.items)
    })
  } else if (type === 'object' || type === 'component') {
    const s = schema as ISDObject
    const value: any = definition
    s.properties?.forEach(({ name, notAllowed, required }) => {
      if (value[name] === undefined && required === true && notAllowed === undefined) {
        exception.add({
          component: id,
          context: processor.key,
          code: 'PROPERTY_MISSING',
          level: 'error',
          locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
          metadata: {
            propertyName: name
          },
          reference
        })
      }
    })
    Object.keys(value).forEach(key => {
      if (key === '$ref') return

      const v = value[key]
      if (v !== undefined) {
        const property = s.properties?.find(p => p.name === key)
        if (property === undefined) {
          if (s.additionalProperties !== undefined) {
            validateChild(processor, key, v, s.additionalProperties)
          } else {
            exception.add({
              component: id,
              context: key,
              code: 'PROPERTY_UNKNOWN',
              level: 'error',
              locations: [{ node: value, key, filter: 'key' }],
              metadata: {
                propertyName: key
              },
              reference
            })
          }
        } else if (property.notAllowed !== undefined) {
          exception.add({
            component: id,
            context: key,
            code: property.notAllowed,
            level: 'error',
            locations: [{ node: value, key, filter: 'key' }],
            metadata: {
              propertyName: key
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
        component: id,
        context: processor.key,
        code: 'VALUE_TYPE_INVALID',
        level: 'error',
        locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
        metadata: {
          expectedType: 'integer',
          value: definition
        },
        reference
      })
    }
    if (schema.minimum !== undefined && v < schema.minimum) {
      exception.add({
        component: id,
        context: processor.key,
        code: 'VALUE_OUT_OF_RANGE_MIN',
        level: 'error',
        locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
        metadata: {
          minimum: schema.minimum,
          value: definition
        },
        reference
      })
    }
    if (schema.maximum !== undefined && v > schema.maximum) {
      exception.add({
        component: id,
        context: processor.key,
        code: 'VALUE_OUT_OF_RANGE_MAX',
        level: 'error',
        locations: [{ node: parentDefinition, key: processor.key, filter: 'value' }],
        metadata: {
          exclusive: '',
          maximum: schema.maximum,
          value: definition
        },
        reference
      })
    }
  }

  return false
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
