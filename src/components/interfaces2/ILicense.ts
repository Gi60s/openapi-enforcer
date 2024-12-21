import { IEnforcerExtensionDefinition } from './IIndex'

interface ILicenseBase {
  extensions: Record<string, any>
  name: string
  url?: string
}

export interface ILicense2 extends ILicenseBase {}
export interface ILicense3 extends ILicenseBase {}

interface ILicenseBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  name: string
  url?: string
}

export interface ILicense2Definition extends ILicenseBaseDefinition {}
export interface ILicense3Definition extends ILicenseBaseDefinition {}
