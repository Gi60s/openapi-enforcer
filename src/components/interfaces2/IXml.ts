import { IEnforcerExtensionDefinition } from './IIndex'

interface IXmlBase {
  extensions: Record<string, any>
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml2 extends IXmlBase {}
export interface IXml3 extends IXmlBase {}

interface IXmlBaseDefinition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface IXml2Definition extends IXmlBaseDefinition {}
export interface IXml3Definition extends IXmlBaseDefinition {}
