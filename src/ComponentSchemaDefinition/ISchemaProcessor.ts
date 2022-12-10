import { ExceptionStore } from '../Exception/ExceptionStore'
import { ILastly } from '../Lastly/ILastly'
import { Chain } from '../Chain/Chain'
import { IVersion } from '../components/IComponent'
import { ISecurityScheme2, ISecurityScheme2Definition, ISecurityScheme3, ISecurityScheme3Definition } from '../components/SecurityScheme'
import { IDefinition, IComponent, IOperation, IOperationDefinition } from '../components/IInternalTypes'
import { EnforcerComponent } from '../components/Component'

type ISecurityScheme = ISecurityScheme2 | ISecurityScheme3
type ISecuritySchemeDefinition = ISecurityScheme2Definition | ISecurityScheme3Definition

export type ISchemaProcessorChain = Chain<ISchemaProcessor>

export interface ISchemaProcessor<Definition=IDefinition, Built=IComponent> {
  built: Built
  chain: ISchemaProcessorChain
  children: { [p: string]: ISchemaProcessor }
  constructor: EnforcerComponent<Definition, Built>
  definition: Definition
  exception: ExceptionStore
  id: string // all uppercase with underscores to separate words - used for error IDs
  key: string
  lastly: ILastly
  name: string
  reference: string // reference to documentation
  store: { // store data useful for lastly operations
    operations: Array<ISchemaProcessor<IOperationDefinition, IOperation>>
    securitySchemes: Record<string, ISchemaProcessor<ISecuritySchemeDefinition, ISecurityScheme>>
  }
  version: IVersion
}

// export interface ISchemaProcessor<Definition=any, Built=any, Metadata=Record<string, any>> {
//   cmp: ISchemaProcessorComponentData<Definition, Built, Metadata>
//   context: ISchemaProcessorContextData
//   root: ISchemaProcessorRootData<Definition, Built, Metadata>
// }
//
// export interface ISchemaProcessorComponentData<Definition=any, Built=any, Metadata=any> {
//   built: Built
//   constructor: IComponentClass<Definition, Built>
//   definition: Definition
//   id: string // all uppercase with underscores to separate words - used for error IDs
//   metadata: Metadata
//   name: string
//   reference: string // reference to documentation
// }
//
// export interface ISchemaProcessorContextData<Definition=any, Built=any> {
//   built: Built
//   chain: ISchemaProcessorChain
//   children: { [p: string]: ISchemaProcessor<any, any, any> }
//   definition: Definition
//   key: string
// }
//
// export interface ISchemaProcessorRootData<Definition, Built, Metadata> {
//   exception: ExceptionStore
//   lastly: ILastly<ISchemaProcessor<Definition, Built, Metadata>>
//   major: number
//   map: Map<any, ISchemaProcessorMapItem[]>
//   metadata: {
//     operations: IOperation[]
//     securitySchemes: Record<string, ISchemaProcessor<ISecuritySchemeDefinition, ISecurityScheme>>
//   }
//   version: IVersion
// }
//
// interface ISchemaProcessorMapItem {
//   definition: any
//   instance: any
// }
