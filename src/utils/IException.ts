import { Location } from 'json-to-ast'

export interface IException<T> {
  header: string | undefined
  data: { at: Record<string, IException<T>>, messages: Array<IExceptionMessage<T>> }
  exceptionLevels: IExceptionLevelConfiguration

  adjustLevels: (exceptionLevels: IExceptionLevelConfiguration) => IException<T>
  at: (key: string | number) => IException<T>
  hasCode: (code: string, levels?: IExceptionLevel | IExceptionLevel[]) => boolean
  hasError: boolean
  length: 4
  message: (message: IExceptionMessage<T>) => IExceptionMessage<T>
  report: (level: IExceptionLevel, options?: { indent: string, includeHeader: boolean }) => IExceptionReport<T> | undefined

  '0': IExceptionReport<T> | undefined
  '1': IExceptionReport<T> | undefined
  '2': IExceptionReport<T> | undefined
  '3': IExceptionReport<T> | undefined
  [Symbol.iterator]: () => Iterator<any>

  error: IExceptionReport<T> | undefined
  warning: IExceptionReport<T> | undefined
  info: IExceptionReport<T> | undefined
  ignored: IExceptionReport<T> | undefined
}

export interface IExceptionConfiguration {
  // none - show only message
  // code - ex: Field is required. [codeX]
  // footnote - ex: Field is required [2]
  // locations - ex: Field is required \n my-file.js:20:7 (locations on following lines)
  // detailed - shows code, id, locations, breadcrumbs
  details: 'none' | 'all' | 'breadcrumbs' | 'code' | 'footnote' | 'locations'
  levels?: IExceptionLevelConfiguration
  message: 'text' | 'data' | 'json' // if "json" then details and locations settings are ignored
}

export type IExceptionLevel = 'ignore' | 'info' | 'warn' | 'error'

export type IExceptionLevelConfiguration = Record<string, IExceptionLevel>

export interface IExceptionMessage<T> {
  alternateLevels: IExceptionLevel[]
  additionalDetails?: string[]
  code: string
  definition?: any // component definition if available
  exception?: IException<T>
  level: IExceptionLevel
  locations?: Location[]
  message: string
  metadata: Record<string, any>
  reference: string
}

export interface IExceptionPreReport<T extends IException<T>> {
  activeChildrenCount: {
    error: number
    warn: number
    info: number
    ignore: number
  }
  children: Array<{
    at: string
    data: IExceptionPreReport<T>
  }>
  exception: IException<T>
  hasException: {
    error: boolean
    warn: boolean
    info: boolean
    ignore: boolean
  }
  messages: {
    error: Array<IExceptionMessage<T>>
    warn: Array<IExceptionMessage<T>>
    info: Array<IExceptionMessage<T>>
    ignore: Array<IExceptionMessage<T>>
  }
}

export interface IExceptionReport<T> {
  count: number
  exceptions: Array<IExceptionMessage<T> & { breadcrumbs: string[] }>
  hasException: boolean
  message: string

  getCodeCount: () => Record<string, number>
  hasCode: (...codes: string[]) => boolean
  toString: () => string
}
