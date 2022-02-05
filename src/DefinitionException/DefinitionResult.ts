import { DefinitionException, ErrorReport, WarningReport, InfoReport, IgnoredReport } from './index'

export class DefinitionResult<T=any> {
  readonly '0'?: T
  readonly '1'?: ErrorReport
  readonly '2'?: WarningReport
  readonly '3'?: InfoReport
  readonly '4'?: IgnoredReport
  readonly exception?: DefinitionException

  constructor (value: T | undefined, exception?: DefinitionException) {
    const [error, warn, info, ignore] = exception ?? []
    if (error === undefined) this[0] = value
    if (error !== undefined) this[1] = error
    if (warn !== undefined) this[2] = warn
    if (info !== undefined) this[3] = info
    if (ignore !== undefined) this[4] = ignore
    if (exception !== undefined) this.exception = exception
  }

  get error (): ErrorReport | undefined {
    return this[1]
  }

  get hasError (): boolean {
    return this[1] !== undefined
  }

  get ignored (): IgnoredReport | undefined {
    return this[4]
  }

  get length (): 5 {
    return 5
  }

  get info (): InfoReport | undefined {
    return this[3]
  }

  get value (): T | undefined {
    return this[0]
  }

  get warning (): WarningReport | undefined {
    return this[2]
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

DefinitionResult.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
