import { IVersion } from '../components/IComponent'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { Lastly } from '../Lastly/Lastly'
import { EnforcerComponent } from '../components/Component'
import {
  IComponent,
  IDefinition,
  IOperation,
  IOperationDefinition,
  ISecurityScheme,
  ISecuritySchemeDefinition
} from '../components/IInternalTypes'
import { ILastly } from '../Lastly/ILastly'
import { ISchema, ISchemaDefinition } from './IComponentSchemaDefinition'

type EnforcerComponentClass = typeof EnforcerComponent<any>

export class SchemaProcessor<Definition extends IDefinition = IDefinition, Built=any> {
  public built: Built
  public component: {
    constructor: EnforcerComponentClass
    id: string
    name: string
    reference: string
    schema: ISchema
  }

  public definition: Definition
  public exception: ExceptionStore
  public key: string
  public lastly: ILastly
  public schema: ISchema
  public store: {
    operations: Array<SchemaProcessor<IOperationDefinition, IOperation>>
    securitySchemes: Record<string, SchemaProcessor<ISecuritySchemeDefinition, ISecurityScheme>>
  }

  public version: IVersion
  public parent: SchemaProcessor | null
  public root: SchemaProcessor

  constructor (definition: Definition, built: any, ctor: EnforcerComponentClass, version?: IVersion, parent?: SchemaProcessor)
  constructor (definition: Definition, built: any, ctor: null, version: IVersion, parent: SchemaProcessor)
  constructor (definition: Definition, built: any, ctor: EnforcerComponentClass | null, version?: IVersion, parent?: SchemaProcessor) {
    this.built = built
    this.definition = definition
    this.exception = parent?.exception ?? new ExceptionStore()
    this.key = ''
    this.lastly = parent?.lastly ?? new Lastly()
    this.schema = { type: 'any' }
    this.store = parent?.store ?? {
      operations: [],
      securitySchemes: {}
    }
    this.version = parent?.version !== undefined
      ? parent.version
      : version !== undefined
        ? version
        : ctor !== null
          ? getHighestVersion((Object.keys(ctor.spec) as IVersion[]).filter(v => typeof ctor.spec[v] === 'string'))
          : '2.0'

    this.root = parent?.root ?? this as unknown as SchemaProcessor
    this.parent = parent ?? null

    let schema: ISchema | null = null
    if (ctor === null) {
      this.component = parent?.component ?? {
        constructor: EnforcerComponent,
        id: '',
        name: '',
        reference: '',
        schema: { type: 'any' }
      }
    } else {
      this.component = {
        constructor: ctor,
        id: ctor.id,
        name: ctor.name,
        reference: ctor.spec[this.version] as string,
        schema: { type: 'any' }
      }

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      Object.defineProperty(this.component, 'schema', {
        get (): ISchemaDefinition<any, any> {
          if (schema === null) schema = _this.component.constructor.getSchemaDefinition(this)
          return schema as ISchemaDefinition<any, any>
        }
      })

      Object.defineProperty(this, 'schema', {
        get (): ISchemaDefinition<any, any> {
          if (schema === null) schema = _this.component.constructor.getSchemaDefinition(this)
          return schema as ISchemaDefinition<any, any>
        }
      })
    }
  }

  createChild (key: string, definition: IDefinition, built: any, component: EnforcerComponentClass | null, schema?: ISchema): SchemaProcessor {
    if (component !== null) {
      const child = new SchemaProcessor<any, any>(definition, null, component, this.version, this)
      child.key = key
      return child
    } else {
      const child = new SchemaProcessor<any, any>(definition, built, null, this.version, this)
      child.key = key
      child.schema = schema as ISchema
      return child
    }
  }

  getLocation (position: 'key' | 'value' | 'both' = 'both'): any[] {
    return this.parent === null
      ? [this.definition]
      : [this.parent.definition, this.key, position]
  }

  /**
   * Go up one or more parents and return that SchemaProcessor instance.
   * @param {number} [num=1]
   * @returns SchemaProcessor | undefined
   */
  up (num: number = 1): SchemaProcessor | undefined {
    if (num < 1) return this
    let p = this.parent
    for (let i = 1; i < num; i++) {
      if (p === null) return
      p = p.parent
    }
    return p === null ? undefined : p
  }

  /**
   * Go up one or more parents and return that SchemaProcessor instance that is for a component that matches the
   * provided component name.
   * @param {string} componentName
   * @returns SchemaProcessor | undefined
   */
  upTo<Definition=IDefinition, Built=IComponent> (componentName: string): SchemaProcessor<Definition, Built> | undefined {
    let p = this.parent
    while (p !== null) {
      if (p.component.schema === p.schema && p.component.name === componentName) return p as SchemaProcessor<Definition, Built>
      p = p.parent
    }
  }
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
