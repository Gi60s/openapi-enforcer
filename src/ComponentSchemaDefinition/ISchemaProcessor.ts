import { ExceptionStore } from '../Exception/ExceptionStore'
import { ILastly } from '../Lastly/ILastly'
import { Chain } from '../Chain/Chain'
import { IVersion } from '../components/IComponent'
import { ISecurityScheme2, ISecurityScheme2Definition, ISecurityScheme3, ISecurityScheme3Definition } from '../components/SecurityScheme'
import { IDefinition, IComponent, IOperation, IOperationDefinition } from '../components/IInternalTypes'
import { EnforcerComponent } from '../components/Component'

type ISecurityScheme = ISecurityScheme2 | ISecurityScheme3
type ISecuritySchemeDefinition = ISecurityScheme2Definition | ISecurityScheme3Definition

export type ISchemaProcessorChain = Chain<ISchemaProcessor<any, any>>

export interface ISchemaProcessor<Definition=IDefinition, Built=IComponent> {
  built: Built
  chain: ISchemaProcessorChain
  children: { [p: string]: ISchemaProcessor }
  constructor: typeof EnforcerComponent<Definition>
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
