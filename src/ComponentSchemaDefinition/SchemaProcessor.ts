import { IVersion } from '../components/IComponent'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { Lastly } from '../Lastly/Lastly'
import { EnforcerComponent } from '../components/Component'
import {
  IComponent,
  IDefinition, IDiscriminatorDefinition,
  IOperation,
  IOperationDefinition,
  ISecurityScheme,
  ISecuritySchemeDefinition
} from '../components/IInternalTypes'
import { ILastly } from '../Lastly/ILastly'
import { ISchema, ISchemaDefinition } from './IComponentSchemaDefinition'
import { getLocation } from '../Locator/Locator'
import { ILocation } from '../Locator/ILocator'
import * as S from './IComponentSchemaDefinition'

type EnforcerComponentClass = typeof EnforcerComponent<any>

export class SchemaProcessor<Definition=any, Built=any> {
  public built: Built
  public children: Record<string, SchemaProcessor>
  public component: {
    constructor: EnforcerComponentClass
    id: string
    name: string
    reference: string
    schema: ISchema
  }

  public _definition: Definition
  public exception: ExceptionStore
  public key: string
  public lastly: ILastly
  public _schema: ISchema
  public store: {
    discriminatorSchemas: Array<{
      definition: IDiscriminatorDefinition
      processor: SchemaProcessor<ISchemaDefinition<any, any>, ISchema>
      used: boolean
    }>
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
    this.children = {}
    this._definition = definition
    this.exception = parent?.exception ?? new ExceptionStore()
    this.key = ''
    this.lastly = parent?.lastly ?? new Lastly()
    this._schema = { type: 'any' }
    this.store = parent?.store ?? {
      discriminatorSchemas: [],
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

  createChild (key: string, definition: any, built: any, component: EnforcerComponentClass | null, schema?: ISchema): SchemaProcessor {
    if (component !== null) {
      const child = new SchemaProcessor<any, any>(definition, null, component, this.version, this)
      child.key = key
      this.children[key] = child
      return child
    } else {
      const child = new SchemaProcessor<any, any>(definition, built, null, this.version, this)
      child.key = key
      child._schema = schema as ISchema
      this.children[key] = child
      return child
    }
  }

  getLocation (position: 'key' | 'value' | 'both' = 'both'): ILocation | undefined {
    return this.parent === null
      ? getLocation(this._definition)
      : getLocation(this.parent._definition, this.key, position)
  }

  getSiblingValue (key: string): any | undefined {
    const parent = this.parent
    if (parent === undefined) return
    if (parent?.children[key] !== undefined) return parent?.children[key]?.definition

    const schema = parent?.schema
    if (schema?.type === 'object') {
      const propertySchema = schema.properties?.find(p => p.name === key)?.schema ?? schema.additionalProperties
      return propertySchema?.default
    }
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

  get definition (): Definition {
    if (this._definition !== undefined) return this._definition
    const schema = this._schema.type === 'oneOf' ? findOneOfSchema(this) : this._schema
    return schema?.default
  }

  get schema (): S.ISchema | undefined {
    const schema = this._schema
    return schema.type === 'oneOf'
      ? findOneOfSchema(this)
      : this._schema
  }
}

function findOneOfSchema (processor: SchemaProcessor): S.ISchema | undefined {
  const schema = processor._schema as S.IOneOf
  const length = schema.oneOf.length
  for (let i = 0; i < length; i++) {
    const item = schema.oneOf[i]
    if (item.condition(processor)) return item.schema
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
