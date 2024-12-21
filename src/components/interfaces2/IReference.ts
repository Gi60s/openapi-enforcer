import { IEnforcerExtensionDefinition } from './IIndex'

export interface IReferenceDefinition {
  'x-enforcer'?: IEnforcerExtensionDefinition
  $ref: string
}
