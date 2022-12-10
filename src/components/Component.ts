import { IComponentSpec, IVersion } from './IComponent'
import { ISchemaProcessor } from '../ComponentSchemaDefinition/ISchemaProcessor'
import { ISchemaDefinition } from '../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { generateChildProcessorData, initializeProcessorData } from '../ComponentSchemaDefinition/schema-processor'

type IHookStoreItem = Record<string, Array<(newValue: any, oldValue: any) => void>>

type SchemaGenerator = (data: ISchemaProcessor) => ISchemaDefinition<any, any>

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

type ISchemaDefinitionMap<Definition extends object, Built extends EnforcerComponent<Definition, any>> =
  WeakMap<Definition, WeakMap<Built, ISchemaDefinition<any, any>>>

const componentMap = new WeakMap<any, IComponentMapData>()
const definitionSchemaMap: ISchemaDefinitionMap<any, any> = new WeakMap()

export interface EnforcerComponent<Definition, Built> {
  new (definition: Definition, version?: IVersion, data?: IParentData): Built
  getSchemaDefinition: (data: ISchemaProcessor<Definition, Built>) => ISchemaDefinition<Definition, Built>
  id: string
  spec: IComponentSpec
  validate: (definition: any, version?: IVersion, data?: ISchemaProcessor<Definition, Built>) => ExceptionStore
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EnforcerComponent<Definition, Built> {
  constructor (definition: Definition, version?: IVersion, data?: IParentData) {
    const ctor = this.constructor as EnforcerComponent<Definition, Built>
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
    buildComponentFromDefinition<Definition, Built>(processorData)
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

  static get spec (): IComponentSpec {
    throw new Error('Property "spec" not implemented')
  }

  static getSchemaDefinition (data: ISchemaProcessor<any, any>): ISchemaDefinition<any, any> {
    throw new Error('Function "getSchema" not implemented')
  }

  static validate<Definition, Built> (definition: any, version?: IVersion, data?: IParentData): ExceptionStore {
    const ctor = this as unknown as EnforcerComponent<Definition, Built>
    const processorData = data !== undefined
      ? generateChildProcessorData<Definition, Built>(data.parent, data.key, ctor)
      : initializeProcessorData<Definition, Built>(definition, ctor, version)
    return validateComponentDefinition<Definition, Built>(processorData)
  }
}

function buildComponentFromDefinition<Definition, Built> (data: ISchemaProcessor<Definition, Built>): void {
  const ctor = data.constructor
  const schema = ctor.getSchemaDefinition(data)
  const spec = ctor.spec
  // TODO: build out this function
}

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
    // TODO: this wont work because as we run recursively deeper this may not be defined early enough
    const schema = ctor.getSchemaDefinition(data)
    if (previousConstructors === undefined) {
      const ctorMap = new WeakMap()
      ctorMap.set(ctor, schema)
      definitionSchemaMap.set(definition, ctorMap)
    } else {
      previousConstructors.set(ctor, schema)
    }
  }
  return exception
}

function generateSchema (componentClass: IComponentClass<any, any>, generator: SchemaGenerator, data?: ISchemaProcessor): IComponentSchemaObject {
  const processorData = data !== undefined
    ? data
    : {} as ISchemaProcessor

  const componentMapInitialized = definitionSchemaMap.has(componentClass)
  const componentSchemaMap = componentMapInitialized
    ? definitionSchemaMap.get(componentClass) as WeakMap<any, IComponentSchemaObject>
    : new WeakMap<any, IComponentSchemaObject>()
  if (!componentMapInitialized) {
    definitionSchemaMap.set(componentClass, componentSchemaMap)
  }

  const existingSchema = componentSchemaMap.get(processorData.definition)
  if (existingSchema !== undefined) return existingSchema

  const schema = generator(processorData)
  componentSchemaMap.set(processorData.definition, schema)
  return schema
}
