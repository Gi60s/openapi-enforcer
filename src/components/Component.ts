import { IComponentSpec, IVersion } from './IComponent'
import { HookGetProperty, HookSetProperty } from './Symbols'
import { ISchemaProcessor } from '../ComponentSchemaDefinition/ISchemaProcessor'
import { ISchema, ISchemaDefinition } from '../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { generateChildProcessorData, initializeProcessorData } from '../ComponentSchemaDefinition/schema-processor'
import { getLocation } from '../Locator/Locator'
import { getMessage } from '../i18n/i18n'

export const GetProperty = Symbol('GetProperty')
export const SetProperty = Symbol('GetProperty')

interface IComponentMapData {
  defaultValues: Record<string, any>
  getHooks: Record<string, Array<(currValue: any, originalValue: any) => any>>
  propertyValues: Record<string, any>
  processorData: ISchemaProcessor<any, any>
  setHooks: Record<string, Array<(currValue: any, originalValue: any) => any>>
}

interface IParentData {
  parent: ISchemaProcessor<any, any>
  key: string
}

type ISchemaDefinitionMap<Definition extends object, Built extends EnforcerComponent<Definition>> =
  WeakMap<Definition, WeakMap<Built, ISchemaDefinition<any, any>>>

const componentMap = new WeakMap<any, IComponentMapData>()
const definitionSchemaMap: ISchemaDefinitionMap<any, any> = new WeakMap()

export class EnforcerComponent<Definition> {
  constructor (definition: Definition, version?: IVersion, data?: IParentData) {
    const ctor = this.constructor as typeof EnforcerComponent
    const processorData = data !== undefined
      ? generateChildProcessorData(data.parent, data.key, definition, ctor)
      : initializeProcessorData(definition, ctor, version)
    componentMap.set(this, {
      defaultValues: {},
      getHooks: {},
      propertyValues: {},
      processorData,
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

  static getSchemaDefinition (data: ISchemaProcessor<any, any>): ISchemaDefinition<any, any> {
    throw new Error(getMessage('NOT_IMPLEMENTED'))
  }

  static validate<Definition, Built extends typeof EnforcerComponent<Definition>> (definition: any, version?: IVersion, data?: IParentData): ExceptionStore {
    const processorData = data !== undefined
      ? generateChildProcessorData<Definition, Built>(data.parent, data.key, definition, this)
      : initializeProcessorData<Definition, Built>(definition, this, version)
    return validateComponentDefinition<Definition, Built>(processorData)
  }
}

// function buildComponentFromDefinition<Definition, Built> (data: ISchemaProcessor<Definition, Built>): void {
//   const ctor = data.constructor
//   const schema = ctor.getSchemaDefinition(data)
//   const spec = ctor.spec
// }

function validateComponentDefinition<Definition, Built> (data: ISchemaProcessor<Definition, Built>): ExceptionStore {
  const { constructor: ctor, definition, exception, id, version } = data
  const spec = data.constructor.spec
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
        expectedType: data.constructor.name,
        value: definition
      },
      reference: data.reference
    })
  } else {
    // check that this definition and schema have not already been evaluated
    const previousConstructors = definitionSchemaMap.get(definition)
    const existingSchemaDefinition = previousConstructors?.get(ctor)
    if (existingSchemaDefinition !== undefined) return exception

    // store new schema validation
    const schema = ctor.getSchemaDefinition(data)
    if (previousConstructors === undefined) {
      const ctorMap = new WeakMap()
      ctorMap.set(ctor, schema)
      definitionSchemaMap.set(definition, ctorMap)
    } else {
      previousConstructors.set(ctor, schema)
    }

    // process schema
    const d = { definition }
    validateDefinition(data, d, 'definition', schema)
  }
  return exception
}

function validateDefinition (data: ISchemaProcessor<any, any>, definition: any, key: string, schema: ISchema): void {
  const { exception, id, reference } = data
  const { type: expectedType, nullable } = schema
  const value = definition[key]
  const actualType = Array.isArray(value) ? 'array' : typeof value

  // TODO: add logic for determining if ref is allowed
  // if ('$ref' in value) {
  //   const isValidatingComponentDefinition = data.definition === value
  //   if (!isValidatingComponentDefinition || schema.)
  // }

  if (expectedType === 'any') return
  if (value === null && nullable === true) return
  if (schema.ignored === true) return
  if (actualType !== (expectedType === 'component' ? 'object' : expectedType)) {
    exception.add({
      id,
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: [getLocation(definition, key, 'value')],
      metadata: {
        expectedType,
        value
      },
      reference
    })
  }

  if (expectedType === 'array') {
    if (!Array.isArray(value)) {
      exception.add({
        id,
        code: 'VALUE_TYPE_INVALID',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        metadata: {
          expectedType,
          value
        },
        reference
      })
    } else {
      value.forEach(v => {
        validateDefinition(data, value, v, schema.items)
      })
    }
  } else if (expectedType === 'boolean') {
    // nothing more to validate
  } else if (expectedType === 'component') {
    // TODO: add a check to see if the value was a $ref
    schema.component.validate(value, data.version, { key, parent: data })
  } else if (expectedType === 'number') {
    const v = value as number
    if (schema.integer === true && String(v) !== String(Math.round(v))) {
      exception.add({
        id,
        code: 'VALUE_TYPE_INVALID',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        metadata: {
          expectedType,
          value
        },
        reference
      })
    }
    if (schema.minimum !== undefined && v < schema.minimum) {
      exception.add({
        id,
        code: 'VALUE_OUT_OF_RANGE_MIN',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        metadata: {
          minimum: schema.minimum,
          value
        },
        reference
      })
    }
    if (schema.maximum !== undefined && v > schema.maximum) {
      exception.add({
        id,
        code: 'VALUE_OUT_OF_RANGE_MAX',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        metadata: {
          maximum: schema.maximum,
          value
        },
        reference
      })
    }
  } else if (expectedType === 'oneOf') {
    const length = schema.oneOf.length
    let found = false
    for (let i = 0; i < length; i++) {
      const item = schema.oneOf[i]
      if (item.condition(data)) {
        found = true
        validateDefinition(data, definition, key, item.schema)
      }
    }
    if (!found) {
      exception.add({
        id,
        code: 'SCHEMA_NOT_MET',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        metadata: {
          value
        },
        reference
      })
    }
  } else if (expectedType === 'object') {
    schema.properties?.forEach(({ name, notAllowed, required }) => {
      if (value[name] === undefined && required === true && notAllowed === undefined) {
        exception.add({
          id,
          code: 'PROPERTY_MISSING',
          level: 'error',
          locations: [getLocation(definition, key, 'value')],
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
        const property = schema.properties?.find(p => p.name === key)
        if (property === undefined) {
          if (schema.additionalProperties !== undefined) {
            validateDefinition(data, value, key, schema.additionalProperties)
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
          validateDefinition(data, value, key, property.schema)
        }
      }
    })
  } else if (expectedType === 'string') {
    // nothing more to validate
  }
}
