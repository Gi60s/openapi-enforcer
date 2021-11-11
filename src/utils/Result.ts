import { Exception } from './Exception'

export class Result<T=any> {
  readonly '0'?: T
  readonly '1'?: Exception
  readonly exception?: Exception

  constructor (value: T | undefined, exception?: Exception) {
    if (exception?.hasException) {
      this[0] = undefined
      this[1] = exception
    } else {
      this[0] = value
      this[1] = undefined
    }
  }

  get error (): Exception | undefined {
    return this[1]
  }

  get hasError (): boolean {
    return this[1] !== undefined
  }

  get value (): T | undefined {
    return this[0]
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

Result.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
