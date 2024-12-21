import { IEnforcerExtensionDefinition } from './IIndex'

export interface IExample3 {
  extensions: Record<string, any>
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}

export interface IExample3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}
