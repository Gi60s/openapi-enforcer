import { ILocation } from '../Locator/ILocator'
import { II18nMessageCode } from '../i18n/i18n'

export interface IException {
  id: string
  code: II18nMessageCode
  level: IExceptionLevel
  locations?: Array<Partial<ILocation>>
  metadata: Record<string, any>
  reference: string
}

export interface IExceptionData {
  id: string
  code: II18nMessageCode
  level: IExceptionLevel
  levelOverwritten?: boolean
  locations: IExceptionLocation[]
  metadata?: Record<string, any>
  reference?: string
}

export interface IExceptionLocation {
  node: object
  key?: string | number
  filter?: 'key' | 'value' | 'both'
}

export type IExceptionLevel = 'ignore' | 'info' | 'warn' | 'error'

export interface IExceptionReportConfiguration {
  header?: string
  overwrite?: Record<string, IExceptionLevel>
}

export interface IExceptionReportItem {
  paths: string[]
  breadcrumbs: string[]
  exceptions: IException[]
}
