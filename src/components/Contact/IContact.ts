import { IEnforcerExtensionDefinition } from '../interfaces2/IIndex'

interface IContactBase {
  extensions: Record<string, any>
  email?: string
  name?: string
  url?: string
}

export interface IContact2 extends IContactBase {}
export interface IContact3 extends IContactBase {}

interface IContactBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  name?: string
  url?: string
  email?: string
}

export interface IContact2Definition extends IContactBaseDefinition {}
export interface IContact3Definition extends IContactBaseDefinition {}
