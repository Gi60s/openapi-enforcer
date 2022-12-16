import { IComponentSpec, IVersion } from './IComponent'
import { ISchemaProcessor } from '../ComponentSchemaDefinition/ISchemaProcessor'
import { ISchema, ISchemaDefinition } from '../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { generateChildProcessorData, initializeProcessorData } from '../ComponentSchemaDefinition/schema-processor'
import { getLocation } from '../Locator/Locator'
import { smart } from '../util'

type IHookStoreItem = Record<string, Array<(newValue: any, oldValue: any) => void>>

interface IComponentMapData {
  cached: Record<string, any>
  defaultValues: Record<string, any>
  propertyValues: Record<string, any>
  processorData: ISchemaProcessor<any, any>
  watches: IHookStoreItem
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
      ? generateChildProcessorData(data.parent, data.key, ctor)
      : initializeProcessorData(definition, ctor, version)
    componentMap.set(this, {
      cached: {},
      defaultValues: {},
      propertyValues: {},
      processorData,
      watches: {}
    })
    // buildComponentFromDefinition<Definition, Built>(processorData)
  }

  // cache values
  public cached<T> (id: string, callback: (...p: any[]) => T, ...params: any[]): T {
    const data = componentMap.get(this) as IComponentMapData
    const cache = data.cached
    if (cache[id] !== undefined) return cache?.[id]

    // eslint-disable-next-line node/no-callback-literal
    const value = callback(...params)
    cache[id] = value
    return value
  }

  public clearCache (id: string): void {
    const data = componentMap.get(this) as IComponentMapData
    const cache = data.cached
    if (cache[id] !== undefined) cache[id] = undefined
  }

  public hookGetProperty<T> (key: string, callback: (value: T) => T): void {

  }

  public hookSetProperty<T> (key: string, callback: (newValue: T, oldValue: T) => T): void {

  }

  public watchProperty<T> (key: string | string[], handler: (newValue: T, oldValue: T) => void): void {
    const data = componentMap.get(this) as IComponentMapData
    const record = data.watches
    const keys = Array.isArray(key) ? key : [key]
    keys.forEach(k => {
      if (record[k] === undefined) record[k] = []
      record[k].push(handler)
    })
  }

  protected getProperty<T> (key: string): T {
    const data = componentMap.get(this) as IComponentMapData
    return data.propertyValues[key] ?? data.defaultValues as T
  }

  protected setProperty (key: string, value: any): void {
    const data = componentMap.get(this) as IComponentMapData
    const record = data.propertyValues
    const oldValue = record?.[key]
    if (oldValue !== value) {
      record[key] = value
      const watches = data.watches[key]
      const length = watches?.length ?? 0
      for (let i = 0; i < length; i++) {
        watches[i](value, oldValue)
      }
    }
  }

  static get id (): string {
    throw new Error('Property "id" not implemented')
  }

  static get spec (): IComponentSpec {
    throw new Error('Property "spec" not implemented')
  }

  static getSchemaDefinition (data: ISchemaProcessor<any, any>): ISchemaDefinition<any, any> {
    throw new Error('Function "getSchema" not implemented')
  }

  static validate<Definition, Built extends typeof EnforcerComponent<Definition>> (definition: any, version?: IVersion, data?: IParentData): ExceptionStore {
    const processorData = data !== undefined
      ? generateChildProcessorData<Definition, Built>(data.parent, data.key, this)
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
  const { constructor: ctor, definition, exception, id, name, version } = data
  const spec = data.constructor.spec
  if (spec[version] === undefined) {
    exception.add({
      id: id + '_VERSION_NOT_SUPPORTED',
      level: 'error',
      locations: [],
      message: `The OpenAPIEnforcer does not support OpenAPI specification version ${version}.`,
      metadata: {
        supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
        version
      }
    })
  } else if (spec[version] === false) {
    exception.add({
      id: id + '_VERSION_MISMATCH',
      level: 'error',
      locations: [],
      message: `The OpenAPIEnforcer supports OpenAPI specification version ${version}, but the ${name} object does not support this version.`,
      metadata: {
        supportedVersions: Object.keys(spec).filter(k => typeof spec[k as IVersion] === 'string'),
        version: version
      }
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

  if (expectedType === 'any') return
  if (definition === null && nullable === true) return
  if (schema.ignored === true) return
  if (actualType !== (expectedType === 'component' ? 'object' : expectedType)) {
    exception.add({
      id: id + '_TYPE_INVALID',
      level: 'error',
      locations: [getLocation(definition, key, 'value')],
      message: 'The definition value ' + smart(value) + ' did not match the expected data type: ' +
        smart(expectedType === 'component' ? 'object' : expectedType),
      reference
    })
  }

  if (expectedType === 'array') {
    (value as any[]).forEach(v => {
      validateDefinition(data, value, v, schema.items)
    })
  } else if (expectedType === 'boolean') {
    // nothing more to validate
  } else if (expectedType === 'component') {
    // TODO: add a check to see if the value was a $ref
    schema.component.validate(value, data.version, { key, parent: data })
  } else if (expectedType === 'number') {
    const v = value as number
    if (schema.integer === true && String(v) !== String(Math.round(v))) {
      exception.add({
        id: id + '_TYPE_INVALID',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        message: 'The definition value ' + smart(value) + ' did not match the expected data type: "integer"',
        reference
      })
    }
    if (schema.minimum !== undefined && v < schema.minimum) {
      exception.add({
        id: id + '_VALUE_OUT_OF_RANGE_MIN',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        message: 'The definition value ' + smart(value) + ' must be greater than or equal to ' + String(schema.minimum),
        reference
      })
    }
    if (schema.maximum !== undefined && v > schema.maximum) {
      exception.add({
        id: id + '_VALUE_OUT_OF_RANGE_MAX',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        message: 'The definition value ' + smart(value) + ' must be less than or equal to ' + String(schema.maximum),
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
        id: id + '_CONDITION_NOT_MET',
        level: 'error',
        locations: [getLocation(definition, key, 'value')],
        message: 'The definition value ' + smart(value) + ' does not match any of the potential schemas.',
        reference
      })
    }
  } else if (expectedType === 'object') {
    schema.properties?.forEach(({ name, notAllowed, required }) => {
      if (value[name] === undefined && required === true && notAllowed === undefined) {
        exception.add({
          id: id + '_MISSING_REQUIRED_PROPERTY',
          level: 'error',
          locations: [getLocation(definition, key, 'value')],
          message: 'Required property ' + smart(name) + ' is missing.',
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
              id: id + '_UNKNOWN_PROPERTY',
              level: 'error',
              locations: [getLocation(value, key, 'key')],
              message: 'The property ' + smart(key) + ' is not allowed because it is not part of the spec.',
              reference
            })
          }
        } else if (property.notAllowed !== undefined) {
          exception.add({
            id: id + '_PROPERTY_NOT_ALLOWED',
            level: 'error',
            locations: [getLocation(value, key, 'key')],
            message: 'The property ' + smart(key) + ' is not allowed. ' + property.notAllowed,
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
