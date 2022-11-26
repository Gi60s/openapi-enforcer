import { IComponentClass, IComponentInstance, IComponentSpec, IVersion } from './IComponent'
import { ISchemaProcessor, ISchemaProcessorComponentData } from '../ComponentSchemaDefinition/ISchemaProcessor'
import { ISchemaDefinition } from '../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { initializeProcessorData } from '../ComponentSchemaDefinition/schema-processor'

type IHookStoreItem = Record<string, Array<(newValue: any, oldValue: any) => void>>
type SchemaGenerator = (data: ISchemaProcessor, componentData: ISchemaProcessorComponentData) => ISchemaDefinition<any, any>
interface IComponentMapData {
  cached: Record<string, any>
  defaultValues: Record<string, any>
  propertyValues: Record<string, any>
  processorData: ISchemaProcessor<any, any>
  watches: IHookStoreItem
}

const componentMap = new WeakMap<any, IComponentMapData>()
const definitionSchemaMap = new WeakMap<any, WeakMap<any, ISchemaDefinition<any, any>>>()

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EnforcerComponent<Definition, Built> {
  constructor (definition: Definition, version?: IVersion, data?: ISchemaProcessor<Definition, Built>) {
    const ctor = this.constructor
    const spec: IComponentSpec = 'spec' in ctor
      ? (ctor as unknown as { spec: IComponentSpec }).spec
      : {
          '2.0': false,
          '3.0.0': false,
          '3.0.1': false,
          '3.0.2': false,
          '3.0.3': false
        }
    const determinedVersion = version === undefined
      ? getHighestVersion(Object.keys(spec) as IVersion[])
      : version
    const processorData = data ?? initializeProcessorData(definition, determinedVersion)
    componentMap.set(this, {
      cached: {},
      defaultValues: {},
      propertyValues: {},
      processorData,
      watches: {}
    })
    buildComponentFromDefinition<Definition, Built>(this.constructor, processorData)
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

  public watchProperty<T> (key: string, handler: (newValue: T, oldValue: T) => void): void {
    const data = componentMap.get(this) as IComponentMapData
    const record = data.watches
    if (record[key] === undefined) record[key] = []
    record[key].push(handler)
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

  static validate (definition: any, version?: IVersion, data?: ISchemaProcessor): ExceptionStore {
    return validateComponentDefinition(this, definition, version, data)
  }
}

function buildComponentFromDefinition<Definition, Built> (componentClass: IComponentClass<Definition, Built>, data: ISchemaProcessor): void {
  const schema = componentClass.getSchema(data)
  const spec = componentClass.spec
}

export function validateComponentDefinition<Definition, Built> (
  componentClass: any, // IComponentClass<Definition, Built>,
  definition: Definition,
  version?: IVersion,
  data?: ISchemaProcessor): ExceptionStore {

  const spec = componentClass.spec
  const exceptions = new ExceptionStore()
  const determinedVersion = version === undefined
    ? getHighestVersion(Object.keys(spec) as IVersion[])
    : version

  if (determinedVersion in spec) {
    if (data === undefined) data = generateProcessorData(definition, determinedVersion)
    const schema = generateSchema(componentClass, componentClass.getSchema, data)
    // TODO: validate definition against schema
  } else {
    exceptions.add({
      id: componentClass.name.toUpperCase() + '_VERSION_NOT_SUPPORTED',
      level: 'error',
      locations: [],
      message: 'The OpenAPI component class "' + componentClass.name + '" does not support OpenAPI specification version ' + determinedVersion,
      metadata: {
        supportedVersions: Object.keys(spec),
        version: determinedVersion
      }
    })
  }
  return exceptions
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

// function generateVersion (spec: IComponentSpec, version?: IVersion): IVersion {
//   const result = version === undefined
//     ? getHighestVersion(Object.keys(spec) as IVersion[])
//     : version
//   if (result in spec) return result
//
//
//   if (version === undefined) {
//     const keys = Object.keys(spec)
//     let highMajor: number | undefined
//     let highMinor: number | undefined
//     let highPatch: number | undefined
//     keys.forEach(key => {
//       const [major, minor, patch] = key.split('.').map(v => parseInt(v))
//       if (highMajor === undefined || major > highMajor) {
//         highMajor = major
//         highMinor = minor
//         highPatch = patch
//       } else if (major === highMajor) {
//         if (minor === undefined || (highMinor !== undefined && minor > highMinor)) {
//           highMinor = minor
//           highPatch = patch
//         } else if (minor === highMinor && (patch === undefined || (highPatch !== undefined && patch > highPatch))) {
//           highPatch = patch
//         }
//       }
//     })
//     result = [highMajor, highMinor, highPatch]
//       .filter(v => typeof v === 'number')
//       .join('.') as IVersion
//   } else {
//     result = version
//   }
//
//   if (result in spec) return
// }

function getHighestVersion (versions: IVersion[]): IVersion {
  let highMajor: number | undefined
  let highMinor: number | undefined
  let highPatch: number | undefined
  versions.forEach(key => {
    const [major, minor, patch] = key.split('.').map(v => parseInt(v))
    if (highMajor === undefined || major > highMajor) {
      highMajor = major
      highMinor = minor
      highPatch = patch
    } else if (major === highMajor) {
      if (minor === undefined || (highMinor !== undefined && minor > highMinor)) {
        highMinor = minor
        highPatch = patch
      } else if (minor === highMinor && (patch === undefined || (highPatch !== undefined && patch > highPatch))) {
        highPatch = patch
      }
    }
  })
  return [highMajor, highMinor, highPatch]
    .filter(v => typeof v === 'number')
    .join('.') as IVersion
}
