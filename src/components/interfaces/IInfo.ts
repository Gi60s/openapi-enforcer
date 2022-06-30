import { IContact } from './IContact'
import { ILicense } from './ILicense'

export interface IInfo {
  extensions: Record<string, any>
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact
  license?: ILicense
  version: string
}
