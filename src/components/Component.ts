import { IComponentClass, IComponentInstance, IComponentSpec, IVersion } from './IComponent'
import { ISchemaProcessor, ISchemaProcessorComponentData } from './ISchemaProcessor'
import { IComponentSchemaDefinition, IComponentSchemaObject } from './IComponentSchema'
import { ExceptionStore } from '../Exception/ExceptionStore'

type SchemaGenerator = (data: ISchemaProcessor, componentData: ISchemaProcessorComponentData) => IComponentSchemaObject

const definitionSchemaMap = new Map<IComponentClass<any, any>, WeakMap<any, IComponentSchemaObject>>()

// export interface EnforcerComponent {
//   getSchema: (data: ISchemaProcessorData) => IComponentSchemaObject
//   spec: IComponentSpec
//   validate: (definition: any, version?: IVersion) => ExceptionStore
// }

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export const EnforcerComponent: IComponentClass<any, any> = class EnforcerComponent<Definition, Built extends IComponentInstance> {
  constructor (definition: Definition, version?: IVersion, data?: ISchemaProcessor) {
    const ctor = this.constructor as IComponentClass<Definition, Built>
    const determinedVersion = version === undefined
      ? getHighestVersion(Object.keys(ctor.spec) as IVersion[])
      : version
    const processorData = data ?? generateProcessorData(definition, determinedVersion)
    buildComponentFromDefinition(this.constructor as IComponentClass<Definition, Built>, processorData)
  }

  static get spec (): IComponentSpec {
    throw new Error('Property "spec" not implemented')
  }

  static getSchema<Defintion, Built> (data: ISchemaProcessor): IComponentSchemaDefinition<Defintion, Built> {
    throw new Error('Function "getSchema" not implemented')
  }

  static validate<Definition> (definition: Definition, version?: IVersion, data?: ISchemaProcessor): ExceptionStore {
    return validateComponentDefinition(this, definition, version, data)
  }
}

function buildComponentFromDefinition<Definition, Built> (componentClass: IComponentClass<Definition, Built>, data: ISchemaProcessor): void {
  const schema = componentClass.getSchema(data)
  const spec = componentClass.spec
}

export function validateComponentDefinition<Definition, Built> (
  componentClass: IComponentClass<Definition, Built>,
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

function findAncestor<T> (data: ISchemaProcessor, component: string): T | undefined {
  return undefined
}

function generateProcessorData (definition: any, version: IVersion): ISchemaProcessor {
  return {} as unknown as ISchemaProcessor
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

function generateVersion (spec: IComponentSpec, version?: IVersion): IVersion {
  const result = version === undefined
    ? getHighestVersion(Object.keys(spec) as IVersion[])
    : version
  if (result in spec) return result


  if (version === undefined) {
    const keys = Object.keys(spec)
    let highMajor: number | undefined
    let highMinor: number | undefined
    let highPatch: number | undefined
    keys.forEach(key => {
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
    result = [highMajor, highMinor, highPatch]
      .filter(v => typeof v === 'number')
      .join('.') as IVersion
  } else {
    result = version
  }

  if (result in spec) return
}

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
