import { Exception } from './Exception'

export class Result <T=any> {
  error: Exception | undefined
  value: T | undefined
  warning: Exception | undefined
  e: Exception | undefined
  v: T | undefined
  w: Exception | undefined

  constructor (value: T | undefined, error?: Exception, warning?: Exception) {
    // if (error === undefined || !error.hasException) error = undefined
    // if (warning === undefined || !warning.hasException) warning = undefined
    // if (error !== undefined) value = undefined

    this.error = error
    this.value = value
    this.warning = warning
    this.e = error
    this.v = value
    this.w = warning
  }

  * [Symbol.iterator] (): unknown {
    yield this.value
    yield this.error
    yield this.warning
  }
}
