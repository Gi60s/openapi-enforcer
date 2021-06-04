import Adapter from '../adapter'
import { ExceptionMessageData, Level } from './types'
import * as Config from '../config'

const { inspect } = Adapter()
const exceptionMap = new WeakMap<Exception, ExceptionPreReport>()
const levels: Level[] = ['error', 'warn', 'opinion', 'ignore']

interface ExceptionData<T> {
  at: Record<string, T>
  messages: ExceptionMessageData[]
}

interface ExceptionPreReport {
  children: Array<{
    at: string
    data: ExceptionPreReport
  }>
  exception: Exception
  hasException: {
    error: boolean
    warn: boolean
    opinion: boolean
    ignore: boolean
  }
  messages: {
    error: ExceptionMessageData[]
    warn: ExceptionMessageData[]
    opinion: ExceptionMessageData[]
    ignore: ExceptionMessageData[]
  }
  parent: ExceptionPreReport | null
}

export class Exception {
  public header: string | undefined
  public data: ExceptionData<Exception> = { at: {}, messages: [] }

  constructor (header?: string) {
    this.header = header
  }

  public at (key: string | number): Exception {
    const at = this.data.at
    if (!(key in at)) at[key] = new Exception()
    return at[key]
  }

  public message (data: ExceptionMessageData): Exception {
    this.data.messages.push(data)
    return this
  }

  get '0' (): ErrorReport | undefined {
    const config = Config.get().exceptions
    const data = runPreReport(config, this, null)
    exceptionMap.set(this, data)
    if (!data.hasException.error) return

    const prefix = ' '.repeat(2)
    const header = this.header ?? ''
    return new ErrorReport('error', data, header, prefix, config.lineDelimiter)
  }

  get '1' (): WarningReport | undefined {
    const config = Config.get().exceptions
    const data = getCachedPreReport(this)
    if (!data.hasException.warn) return

    const prefix = ' '.repeat(2)
    const header = this.header ?? ''
    return new WarningReport('warn', data, header, prefix, config.lineDelimiter)
  }

  get '2' (): OpinionReport | undefined {
    const config = Config.get().exceptions
    const data = getCachedPreReport(this)
    if (!data.hasException.opinion) return

    const prefix = ' '.repeat(2)
    const header = this.header ?? ''
    return new OpinionReport('opinion', data, header, prefix, config.lineDelimiter)
  }

  get '3' (): IgnoredReport | undefined {
    const config = Config.get().exceptions
    const data = getCachedPreReport(this)
    if (!data.hasException.ignore) return

    const prefix = ' '.repeat(2)
    const header = this.header ?? ''
    return new IgnoredReport('ignore', data, header, prefix, config.lineDelimiter)
  }

  get error (): ErrorReport | undefined {
    return getReportByType('error', this)
  }

  get hasError (): boolean {
    return this.error !== undefined
  }

  get ignored (): IgnoredReport | undefined {
    return getReportByType('ignore', this)
  }

  get length (): 4 {
    return 4
  }

  get opinion (): OpinionReport | undefined {
    return getReportByType('opinion', this)
  }

  get warning (): WarningReport | undefined {
    return getReportByType('warn', this)
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

// overwrite exception iterator, use array iterator
Exception.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

class ExceptionReport {
  public readonly message: string
  public readonly messageDetails: Array<{
    data: ExceptionMessageData
    path: string[]
  }>

  constructor (level: Level, data: ExceptionPreReport, header: string, prefix: string, lineDelimiter: string) {
    this.message = 'Nothing to report'
    this.messageDetails = []
    const reportMessage = getReport(this, level, lineDelimiter, data, prefix, [])
    if (this.messageDetails.length > 0) {
      switch (level) {
        case 'error':
          header = header.replace('[TYPE]', 'errors')
          break
        case 'warn':
          header = header.replace('[TYPE]', 'warnings')
          break
        case 'opinion':
          header = header.replace('[TYPE]', 'opinions')
          break
        case 'ignore':
          header = header.replace('[TYPE]', 'ignored items')
          break
      }
      this.message = header + reportMessage
    }
  }

  get count (): number {
    return this.messageDetails.length
  }

  get hasException (): boolean {
    return this.messageDetails.length > 0
  }

  toString (): string { return this.message }

  [inspect] (): string {
    if (this.hasException) {
      return '[ EnforcerException: ' + this.message + ' ]'
    } else {
      return '[ EnforcerException ]'
    }
  }
}

export class ErrorReport extends ExceptionReport {}
export class WarningReport extends ExceptionReport {}
export class OpinionReport extends ExceptionReport {}
export class IgnoredReport extends ExceptionReport {}

function getCachedPreReport (exception: Exception): ExceptionPreReport {
  const config = Config.get().exceptions
  const existing = exceptionMap.get(exception)
  const data = existing ?? runPreReport(config, exception, null)
  if (existing === undefined) exceptionMap.set(exception, data)
  return data
}

function getReportByType (level: Level, exception: Exception): ExceptionReport | undefined {
  const config = Config.get().exceptions
  const data = runPreReport(config, exception, null)
  if (!data.hasException[level]) return

  const prefix = ' '.repeat(2)
  const header = exception.header ?? ''
  return new ErrorReport(level, data, header, prefix, config.lineDelimiter)
}

function runPreReport (fullConfig: Required<Config.ExceptionConfiguration>, context: Exception, parent: ExceptionPreReport | null): ExceptionPreReport {
  const data = context.data
  const result: ExceptionPreReport = {
    children: [],
    exception: context,
    hasException: {
      error: false,
      warn: false,
      opinion: false,
      ignore: false
    },
    messages: {
      error: [],
      warn: [],
      opinion: [],
      ignore: []
    },
    parent
  }

  // sort messages into groups
  data.messages
    .forEach(message => {
      const code = message.code

      // if message level has not been modified and it is not an error then check to see if it should be changed
      if (message.originalLevel === undefined && message.level !== 'error') {
        if (fullConfig?.codes?.[code] !== undefined) {
          // overwrite the level if specified in the global config
          message.level = fullConfig.codes[code]
        }
      }

      if (message.active !== false) {
        const level = message.level
        result.messages[level].push(message)
        result.hasException[level] = true
      }
    })

  // filter out the children that have messages
  const at = data.at
  Object.keys(at).forEach(key => {
    const data = runPreReport(fullConfig, at[key], result)
    levels.forEach((level: Level) => {
      if (data.hasException[level]) result.hasException[level] = true
    })
    result.children.push({
      at: key,
      data: runPreReport(fullConfig, at[key], result)
    })
  })

  return result
}

function getReport (report: ExceptionReport, level: Level, lineDelimiter: string, data: ExceptionPreReport, prefix: string, path: string[]): string {
  const prefixPlus = prefix + '  '
  let result: string = ''

  const { children, hasException, messages, parent } = data
  if (hasException[level]) {
    children.forEach(child => {
      const { hasException } = child.data
      if (hasException[level]) {
        const at = child.at
        if (parent?.children.length === 1) {
          result += ' > '
        } else {
          result += lineDelimiter + prefixPlus + 'at: '
        }
        result += at + ' ' + getReport(report, level, lineDelimiter, child.data, prefixPlus, path.concat([at]))
      }
    })

    messages[level].forEach(message => {
      result += lineDelimiter + prefixPlus + message.message
      if (message.locations !== undefined) {
        result += ' [' + message.locations.map(l => {
          let str = l.source !== undefined
            ? String(l.source) + ':'
            : ''
          str += String(l.start.line) + ':' + String(l.start.column)
          return str
        }).join(', ') + ']'
      }
      report.messageDetails.push({
        data: message,
        path: path
      })
    })
  }

  return result
}
