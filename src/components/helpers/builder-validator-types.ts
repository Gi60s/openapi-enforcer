import { DefinitionException } from '../../DefinitionException'
import { Exception } from '../../utils/Exception'
import {
  Operation2 as OperationDefinition2,
  Operation3 as OperationDefinition3,
  SecurityScheme2 as SecuritySchemeDefinition2,
  SecurityScheme3 as SecuritySchemeDefinition3
} from './definition-types'
import { Chain } from './Chain'
import { Lastly } from './Lastly'
import { EnforcerData, Schema, SchemaProperty } from '../index'
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
  component: {
    constructor: Component
    data: BuilderData
    definition: any
    reference: string // component reference
    schema: ComponentSchema
  }

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
  schemaGenerator: (data: Data) => ComponentSchema
  validate: (definition: any, version?: Version, ...args: any[]) => DefinitionException
}

export type Data<Definition=any, Built=any> = BuilderData<Definition, Built> | ValidatorData<Definition>

export interface MapItem {
  definition: any
  instance: any
}

export interface ComponentSchema<Definition=any, Built extends Component=any> {
  // define whether the component allows "x-"" extensions
  allowsSchemaExtensions: boolean
  additionalProperties?: {
    namespace: string
    schema: Schema
  }
  properties?: SchemaProperty[]
  builder?: {
    // Run post-build code. Errors can be produced here, but should generally not be as that is the job of the validator.
    after?: (data: BuilderData<Definition, Built>, enforcer: EnforcerData<Definition>) => void

    // Run pre-build code. Returning false will stop follow-up building. Errors can be produced here, but should generally not be as that is the job of the validator.
    before?: (data: BuilderData<Definition, Built>) => boolean
  }
  validator?: {
    // Run additional custom validation code after component has proven valid and built. This will not run if the validation failed.
    after?: (data: ValidatorData<Definition>) => void

    // Run custom code before validate. Returning false will stop follow-up validations.
    before?: (data: ValidatorData<Definition>) => boolean
  }
}

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
  component: {
    constructor: Component
    data: ValidatorData
    definition: any
    reference: string // component reference
    schema: ComponentSchema
  }

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
