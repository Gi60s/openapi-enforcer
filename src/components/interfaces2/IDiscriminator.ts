import { ISchema3 } from './ISchema'
import { IEnforcerExtensionDefinition } from './IIndex'

export interface IDiscriminator3 {
  propertyName: string
  mapping?: Record<string, ISchema3>
}

export interface IDiscriminator3Definition {
  'x-enforcer'?: IEnforcerExtensionDefinition
  propertyName: string
  mapping?: Record<string, string>
}
