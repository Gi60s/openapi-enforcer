import Adapter from '../adapter'
import { ExceptionMessageData, Level } from './types'
import * as Config from '../config'

const { inspect, eol } = Adapter()
const exceptionMap = new WeakMap<Exception, ExceptionPreReport>()
const levels: Level[] = ['error', 'warn', 'opinion', 'ignore']

export interface ExceptionConfiguration {
  checkForDuplicates?: boolean
}

interface ExceptionData<T> {
  at: Record<string, T>
  messages: ExceptionMessageData[]
}

interface ExceptionPreReport {
  activeChildrenCount: {
    error: number
    warn: number
    opinion: number
    ignore: number
  }
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
}

export class Exception {
  public header: string | undefined
  public data: ExceptionData<Exception> = { at: {}, messages: [] }
  public config: Required<ExceptionConfiguration>

  constructor (header?: string, config?: ExceptionConfiguration) {
    if (config === undefined) config = {}
    if (config.checkForDuplicates === undefined) config.checkForDuplicates = false
    this.config = config as Required<ExceptionConfiguration>
    this.header = header
  }

  public at (key: string | number): Exception {
    const at = this.data.at
    if (!(key in at)) {
      at[key] = new Exception()
      at[key].config = this.config
    }
    return at[key]
  }

  public message (data: ExceptionMessageData): Exception {
    let isDuplicate: boolean = false
    if (this.config.checkForDuplicates) {
      isDuplicate = this.data.messages.find(m => {
        return m.code === data.code && m.level === data.level && m.message === data.message && m.reference === data.reference
      }) !== undefined
    }
    if (!isDuplicate) this.data.messages.push(data)
    return this
  }

  get '0' (): ErrorReport | undefined {
    const config = Config.get().exceptions
    const data = runPreReport(config, this)
    exceptionMap.set(this, data)
    if (!data.hasException.error) return

    const header = this.header ?? ''
    return new ErrorReport('error', data, header)
  }

  get '1' (): WarningReport | undefined {
    const data = getCachedPreReport(this)
    if (!data.hasException.warn) return

    const header = this.header ?? ''
    return new WarningReport('warn', data, header)
  }

  get '2' (): OpinionReport | undefined {
    const data = getCachedPreReport(this)
    if (!data.hasException.opinion) return

    const header = this.header ?? ''
    return new OpinionReport('opinion', data, header)
  }

  get '3' (): IgnoredReport | undefined {
    const data = getCachedPreReport(this)
    if (!data.hasException.ignore) return

    const header = this.header ?? ''
    return new IgnoredReport('ignore', data, header)
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

  constructor (level: Level, data: ExceptionPreReport, header: string) {
    this.message = 'Nothing to report'
    this.messageDetails = []
    const reportMessage = getReport(this, level, data, '  ', false, [])
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
  const data = existing ?? runPreReport(config, exception)
  if (existing === undefined) exceptionMap.set(exception, data)
  return data
}

function getReportByType (level: Level, exception: Exception): ExceptionReport | undefined {
  const config = Config.get().exceptions
  const data = runPreReport(config, exception)
  if (!data.hasException[level]) return

  const header = exception.header ?? ''
  return new ErrorReport(level, data, header)
}

function runPreReport (fullConfig: Required<Config.ExceptionConfiguration>, context: Exception): ExceptionPreReport {
  const data = context.data
  const result: ExceptionPreReport = {
    activeChildrenCount: {
      error: 0,
      warn: 0,
      opinion: 0,
      ignore: 0
    },
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
    }
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
    const data = runPreReport(fullConfig, at[key])
    levels.forEach((level: Level) => {
      if (data.hasException[level]) {
        result.hasException[level] = true
        result.activeChildrenCount[level]++
      }
    })
    result.children.push({ at: key, data })
  })

  return result
}

function getReport (report: ExceptionReport, level: Level, data: ExceptionPreReport, indent: string, isContinue: boolean, path: string[]): string {
  const indentPlus = indent + '  '
  let result: string = ''

  const { children, hasException, messages } = data
  if (hasException[level]) {
    children.forEach(child => {
      const { activeChildrenCount, messages, hasException } = child.data
      if (hasException[level]) {
        const key = child.at
        // determine whether we should add new lines or increase indent for child messages
        if (messages[level].length === 0) {
          const willContinue = activeChildrenCount[level] === 1
          result += (isContinue ? ' > ' : eol + indent + 'at: ') + key +
            getReport(report, level, child.data, willContinue ? indent : indentPlus, willContinue, path.concat([key]))
        } else if (isContinue) {
          result += ' > ' + key + getReport(report, level, child.data, indentPlus, false, path.concat([key]))
        } else {
          result += eol + indent + 'at: ' + key +
            getReport(report, level, child.data, indentPlus, false, path.concat([key]))
        }
      }
    })

    messages[level].forEach(message => {
      result += eol + indent + message.message
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
