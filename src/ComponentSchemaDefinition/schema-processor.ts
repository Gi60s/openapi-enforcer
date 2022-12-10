import { ISchemaProcessor } from './ISchemaProcessor'
import { ExceptionStore, IVersion } from '../components/IComponent'
import { Chain } from '../Chain/Chain'
import { Lastly } from '../Lastly/Lastly'
import { EnforcerComponent } from '../components/Component'

const store = new WeakMap<any, ISchemaProcessor<any, any>>()

export function findAncestor<T> (data: ISchemaProcessor, componentName: string): T | undefined {
  return undefined
}

export function generateChildProcessorData<Definition, Built> (data: ISchemaProcessor, key: string, ctor: any): ISchemaProcessor<Definition, Built> {
  const built: any = {}
  const child: ISchemaProcessor<Definition, Built> = {
    built,
    chain: data.chain.add(data),
    children: {},
    constructor: ctor as EnforcerComponent<any, any>,
    definition: (data.definition as Record<string, any>)[key] as Definition,
    exception: data.exception,
    id: ctor.id as string,
    key,
    lastly: data.lastly,
    name: ctor.name,
    reference: ctor.spec[data.version],
    store: data.store,
    version: data.version
  }
  return child
}

export function getExistingProcessorData<Definition=any, Built=any> (definition: any): ISchemaProcessor<Definition, Built> | undefined {
  return store.get(definition) as ISchemaProcessor<Definition, Built>
}

export function initializeProcessorData<Definition, Built> (definition: Definition, ctor: any, version?: IVersion): ISchemaProcessor<Definition, Built> {
  const determinedVersion = version === undefined
    ? getHighestVersion(Object.keys(ctor.spec) as IVersion[])
    : version
  const built: any = {}
  const result: ISchemaProcessor<Definition, Built> = {
    built,
    chain: new Chain<ISchemaProcessor>(),
    children: {},
    constructor: ctor as EnforcerComponent<Definition, Built>,
    definition,
    exception: new ExceptionStore(),
    id: ctor.id,
    key: '',
    lastly: new Lastly(),
    name: ctor.name,
    reference: ctor.spec[determinedVersion],
    store: {
      operations: [],
      securitySchemes: {}
    },
    version: determinedVersion
  }
  store.set(definition, result)
  return result
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
