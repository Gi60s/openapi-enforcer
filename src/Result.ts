import { ErrorReport, IgnoredReport, InfoReport, WarningReport } from './Exception/ExceptionReport'
import { ExceptionStore } from './Exception/ExceptionStore'

/**
 * **An object** that consists of a value, an error report, a warning report, an info report, and an ignored report.
 * If the error report indicates that one or more errors exist then the value will be undefined. If the error
 * report has no errors then it will be undefined and the value will be defined.
 *
 * A value can be defined regardless of results in the warning report, info report, and ignored report.
 *
 * contains either a value or an error report. If the error report indicates one or more errors then the
 * value
 */
export class Result<T=any> {
  readonly '0'?: T
  readonly '1'?: ErrorReport

  /**
   * If there are no warnings to report then this value will be undefined.
   * @type ExceptionReport
   */
  readonly '2'?: WarningReport
  readonly '3'?: InfoReport
  readonly '4'?: IgnoredReport
  readonly exceptionStore?: ExceptionStore

  /**
   * Create a {@link Result} instance.
   * @param value The resolved value. This value will automatically be converted to undefined if the exception has one or more error items.
   * @param exception The {@link ExceptionStore} attached to this result.
   */
  constructor (value: any | null | undefined, exceptionStore?: ExceptionStore) {
    const { error, warning, info, ignored } = exceptionStore ?? {}
    if (error === undefined) this[0] = value as T
    if (error !== undefined) this[1] = error
    if (warning !== undefined) this[2] = warning
    if (info !== undefined) this[3] = info
    if (ignored !== undefined) this[4] = ignored
    if (exceptionStore !== undefined) this.exceptionStore = exceptionStore
  }

  /**
   * If there are no error items to report then this value will be undefined and the {@link value} property will
   * contain the resolved value. If there are error items then the {@link value} property will be undefined.
   * @returns An {@link ExceptionReport} limited to just error items or undefined if there are no error items.
   */
  get error (): ErrorReport | undefined {
    return this[1]
  }

  /**
   * @returns A boolean that is true if there are one or more error items, otherwise returns false.
   */
  get hasError (): boolean {
    return this[1] !== undefined
  }

  /**
   * If there are no ignored items to report then this value will be undefined.
   * @returns An {@link ExceptionReport} limited to just ignored items or undefined if there are no ignored items.
   */
  get ignored (): IgnoredReport | undefined {
    return this[4]
  }

  /**
   * This value will always return 5 and is used to make the {@link Result} properties iterable.
   */
  get length (): 5 {
    return 5
  }

  /**
   * If there is are no info items to report then this value will be undefined.
   * @returns An {@link ExceptionReport} limited to just info items or undefined if there are no info items.
   */
  get info (): InfoReport | undefined {
    return this[3]
  }

  /**
   * @returns The resolved value if the {@link error} property is undefined. If the {@link error} property is not
   * undefined then that signifies that there is an {@link ExceptionReport} with one or more error items resulting
   * in an unvalidated result value.
   */
  get value (): T | undefined {
    return this[0]
  }

  /**
   * If there are no warning items to report then this value will be undefined.
   * @returns An {@link ExceptionReport} limited to just warning items or undefined if there are no warning items.
   */
  get warning (): WarningReport | undefined {
    return this[2]
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

Result.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
