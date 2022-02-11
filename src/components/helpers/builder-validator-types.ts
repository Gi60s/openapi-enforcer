import { Exception, DefinitionException } from '../../Exception'
import {
  Operation2 as OperationDefinition2,
  Operation3 as OperationDefinition3,
  SecurityScheme2 as SecuritySchemeDefinition2,
  SecurityScheme3 as SecuritySchemeDefinition3
} from './definition-types'
import { Chain } from './Chain'
import { Lastly } from './Lastly'
import { Schema, SchemaProperty } from '../index'
import { SecurityScheme } from '../SecurityScheme'
import { Operation } from '../Operation'

type OperationDefinition = OperationDefinition2 | OperationDefinition3
type SecuritySchemeDefinition = SecuritySchemeDefinition2 | SecuritySchemeDefinition3

export interface BuilderMetadata {
  [key: string]: any
  operationIdMap: {
    [operationId: string]: Operation // Array<BuilderData<Operation>>
  }
  securitySchemes: {
    [name: string]: SecurityScheme // BuilderData<SecurityScheme>
  }
}

export interface BuilderData<Definition=any, Built=any> {
  // unchanging values
  root: {
    data: BuilderData
    lastly: Lastly<BuilderData>
    loadCache: Record<string, any>
    loadOptions: {
      validate: boolean
    }
    major: number
    map: Map<any, MapItem[]>
    metadata: BuilderMetadata
    version: Version
  }

  // changes per component
  component: ComponentData<BuilderData, Built>

  // always changing values
  context: {
    built: Built
    chain: Chain<BuilderData>
    children: { [p: string]: BuilderData }
    definition: Definition
    exception: Exception
    key: string
    schema: Schema
  }
}

export interface Component<T=any> {
  new (definition: any, version?: Version, ...args: any[]): T
  spec: SpecMap
  readonly schema: ComponentSchema
  validate: (definition: any, version?: Version, ...args: any[]) => DefinitionException
}

export interface ComponentData<DataType=BuilderData|ValidatorData, Built=any> {
  built: Built
  cache: Record<string, any>
  constructor: Component
  data: DataType
  definition: any
  reference: string // component reference
  schema: ComponentSchema
}

export type Data<Definition=any, Built=any> = BuilderData<Definition, Built> | ValidatorData<Definition>

export interface MapItem {
  definition: any
  instance: any
}

export class ComponentSchema<Definition=any, Built extends Component=any> {
  public allowsSchemaExtensions: boolean // define whether the component allows "x-"" extensions
  public additionalProperties?: { namespace: string, schema: Schema }
  public properties?: SchemaProperty[]
  public hooks: {
    'after-build': Array<ComponentSchemaBuilderAfter<Definition, Built>>
    'before-build': Array<ComponentSchemaBuilderBefore<Definition, Built>>
    'after-validate': Array<ComponentSchemaValidatorAfter<Definition>>
    'before-validate': Array<ComponentSchemaValidatorBefore<Definition>>
  }

  constructor (config: ComponentSchemaConfig) {
    this.allowsSchemaExtensions = config.allowsSchemaExtensions ?? true
    if (config.additionalProperties !== undefined) this.additionalProperties = config.additionalProperties
    if (config.properties !== undefined) this.properties = config.properties
    this.hooks = {
      'after-build': [],
      'before-build': [],
      'after-validate': [],
      'before-validate': []
    }
    if (config.builder?.after !== undefined) this.hooks['after-build'].push(config.builder.after)
    if (config.builder?.before !== undefined) this.hooks['before-build'].push(config.builder.before)
    if (config.validator?.after !== undefined) this.hooks['after-validate'].push(config.validator.after)
    if (config.validator?.before !== undefined) this.hooks['before-validate'].push(config.validator.before)
  }

  adjustProperty (name: string, handler: (schema: SchemaProperty) => void): void {
    const schema = this.properties?.find(p => p.name === name)
    if (schema !== undefined) handler(schema)
  }

  hook (name: 'after-build', handler: ComponentSchemaBuilderAfter<Definition, Built>): void
  hook (name: 'before-build', handler: ComponentSchemaBuilderBefore<Definition, Built>): void
  hook (name: 'after-validate', handler: ComponentSchemaValidatorAfter<Definition>): void
  hook (name: 'before-validate', handler: ComponentSchemaValidatorBefore<Definition>): void
  hook (name: 'after-build' | 'before-build' | 'after-validate' | 'before-validate', handler: any): void {
    this.hooks[name].push(handler)
  }
}

export interface ComponentSchemaConfig<Definition=any, Built extends Component=any> {
  allowsSchemaExtensions: boolean // define whether the component allows "x-"" extensions
  additionalProperties?: {
    namespace: string
    schema: Schema
  }
  properties?: SchemaProperty[]
  builder?: {
    // Run post-build code. Errors can be produced here, but should generally not be as that is the job of the validator.
    after?: ComponentSchemaBuilderAfter<Definition, Built>

    // Run pre-build code. Returning false will stop follow-up building. Errors can be produced here, but should generally not be as that is the job of the validator.
    before?: ComponentSchemaBuilderBefore<Definition, Built>
  }
  validator?: {
    // Run additional custom validation code after component has proven valid and built. This will not run if the validation failed.
    after?: ComponentSchemaValidatorAfter<Definition>

    // Run custom code before validate. Returning false will stop follow-up validations.
    before?: ComponentSchemaValidatorBefore<Definition>
  }
}

export type ComponentSchemaBuilderAfter<Definition, Built> = (data: BuilderData<Definition, Built>) => void
export type ComponentSchemaBuilderBefore<Definition, Built> = (data: BuilderData<Definition, Built>) => boolean
export type ComponentSchemaValidatorAfter<Definition> = (data: ValidatorData<Definition>) => void
export type ComponentSchemaValidatorBefore<Definition> = (data: ValidatorData<Definition>) => boolean

export interface SpecMap {
  '2.0'?: string
  '3.0.0'?: string
  '3.0.1'?: string
  '3.0.2'?: string
  '3.0.3'?: string
}

export interface ValidatorMetadata {
  [key: string]: any
  operationIdMap: {
    [operationId: string]: Array<ValidatorData<OperationDefinition>>
  }
  securitySchemes: {
    [name: string]: ValidatorData<SecuritySchemeDefinition>
  }
}

export interface ValidatorData<Definition=any> {
  // unchanging values
  root: {
    data: ValidatorData
    lastly: Lastly<ValidatorData>
    loadCache: Record<string, any>
    loadOptions: {
      dereference: boolean
      validate: boolean
    }
    major: number
    map: Map<any, MapItem[]>
    metadata: ValidatorMetadata
    version: Version
  }

  // changes per component
  component: ComponentData<ValidatorData, any>

  // always changing values
  context: {
    built: Definition
    chain: Chain<ValidatorData>
    children: { [p: string]: ValidatorData }
    definition: Definition
    exception: DefinitionException
    key: string
    schema: Schema
  }
}

export type Version = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
