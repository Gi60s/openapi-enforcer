import { ExceptionStore } from '../Exception/ExceptionStore'
import { ILastly } from '../Lastly/ILastly'
import { Chain } from '../Chain/Chain'
import { IComponentClass, IVersion } from './IComponent'

export type ISchemaProcessorChain = Chain<ISchemaProcessor>

export interface ISchemaProcessor<Definition=any, Built=any, Metadata=Record<string, any>> {
  cmp: ISchemaProcessorComponentData<Definition, Built, Metadata>
  context: ISchemaProcessorContextData
  root: ISchemaProcessorRootData<Definition, Built, Metadata>
}

export interface ISchemaProcessorComponentData<Definition=any, Built=any, Metadata=any> {
  built: Built
  constructor: IComponentClass<Definition, Built>
  definition: Definition
  id: string // all uppercase with underscores to separate words - used for error IDs
  metadata: Metadata
  name: string
  reference: string // reference to documentation
}

export interface ISchemaProcessorContextData<Definition=any, Built=any> {
  built: Built
  chain: ISchemaProcessorChain
  children: { [p: string]: ISchemaProcessor<any, any, any> }
  definition: Definition
  key: string
}

export interface ISchemaProcessorRootData<Definition, Built, Metadata> {
  exception: ExceptionStore
  lastly: ILastly<ISchemaProcessor<Definition, Built, Metadata>>
  major: number
  map: Map<any, ISchemaProcessorMapItem[]>
  metadata: {
    securitySchemes: Record<string, ISchemaProcessor<ISecuritySchemeDefinition, ISecurityScheme>>
  }
  version: IVersion
}

interface ISchemaProcessorMapItem {
  definition: any
  instance: any
}
