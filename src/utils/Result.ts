import { Exception, DefinitionException, ErrorReport, IgnoredReport, InfoReport, WarningReport } from '../Exception'

export class Result<T=any> {
  readonly '0'?: T
  readonly '1'?: ErrorReport<any>
  readonly '2'?: WarningReport<any>
  readonly '3'?: InfoReport<any>
  readonly '4'?: IgnoredReport<any>
  readonly exception?: Exception | DefinitionException

  constructor (value: T | undefined, exception?: Exception | DefinitionException) {
    const [error, warn, info, ignore] = exception ?? []
    if (error === undefined) this[0] = value
    if (error !== undefined) this[1] = error
    if (warn !== undefined) this[2] = warn
    if (info !== undefined) this[3] = info
    if (ignore !== undefined) this[4] = ignore
    if (exception !== undefined) this.exception = exception
  }

  get error (): ErrorReport<any> | undefined {
    return this[1]
  }

  get hasError (): boolean {
    return this[1] !== undefined
  }

  get ignored (): IgnoredReport<any> | undefined {
    return this[4]
  }

  get length (): 5 {
    return 5
  }

  get info (): InfoReport<any> | undefined {
    return this[3]
  }

  get value (): T | undefined {
    return this[0]
  }

  get warning (): WarningReport<any> | undefined {
    return this[2]
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

Result.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
