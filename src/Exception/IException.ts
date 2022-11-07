import { ILocation } from '../Locator/ILocator'

export interface IException {
  id: string
  level: IExceptionLevel
  locations?: Array<Partial<ILocation>>
  message: string
  metadata: Record<string, any>
  reference: string
}

export interface IExceptionData {
  id: string
  level: IExceptionLevel
  levelOverwritten?: boolean
  locations: Array<ILocation | undefined>
  message: string
  metadata?: Record<string, any>
  reference?: string
}

export type IExceptionLevel = 'ignore' | 'info' | 'warn' | 'error'

export interface IExceptionReportConfiguration {
  header?: string
  overwrite?: Record<string, IExceptionLevel>
}

export interface IExceptionReportItem {
  breadcrumbs: string[]
  exceptions: IException[]
}
