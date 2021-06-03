import Adapter from '../adapter'
import { ExceptionMessageData, Level } from './types'
import { getConfig, ExceptionConfiguration } from '../config'

const { inspect } = Adapter()
const reportExceptionMap: WeakMap<ExceptionReport | ExceptionReportItem, Exception> = new WeakMap()

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
  // public from = E

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

  public report (config: ExceptionConfiguration = {}): ExceptionReport {
    const c = getConfig().exceptions
    const indentLength: number = arguments.length === 2 ? arguments[1] : 0
    const fullConfig: Required<ExceptionConfiguration> = {
      codes: Object.assign({}, c.codes, config.codes),
      lineDelimiter: config.lineDelimiter !== undefined ? config.lineDelimiter : c.lineDelimiter
    }

    // TODO: validate that only allowed codes are included in the fullConfig.codes

    const data = runPreReport(fullConfig, this, null)
    const prefix = ' '.repeat(indentLength)
    const header = this.header ?? ''
    return new ExceptionReport(this, data, header, prefix, fullConfig.lineDelimiter)
  }
}

export class ExceptionReport {
  readonly '0': ErrorReport | undefined
  readonly '1': WarningReport | undefined
  readonly '2': OpinionReport | undefined
  readonly '3': IgnoredReport | undefined

  constructor (exception: Exception, data: ExceptionPreReport, header: string, prefix: string, lineDelimiter: string) {
    reportExceptionMap.set(this, exception)

    let error: ErrorReport | undefined = new ErrorReport('error', data, header, prefix, lineDelimiter)
    if (!error.hasException) error = undefined
    if (error !== undefined) this[0] = error

    let warn: WarningReport | undefined = new WarningReport('warn', data, header, prefix, lineDelimiter)
    if (!warn.hasException) warn = undefined
    if (warn !== undefined) this[1] = warn

    let opinion: OpinionReport | undefined = new OpinionReport('opinion', data, header, prefix, lineDelimiter)
    if (!opinion.hasException) opinion = undefined
    if (opinion !== undefined) this[2] = opinion

    let ignore: IgnoredReport | undefined = new IgnoredReport('ignore', data, header, prefix, lineDelimiter)
    if (!ignore.hasException) ignore = undefined
    if (ignore !== undefined) this[3] = ignore

    Object.freeze(this)
  }

  get error (): ErrorReport | undefined {
    return this[0]
  }

  get e (): ErrorReport | undefined {
    return this[0]
  }

  get exception (): Exception {
    return reportExceptionMap.get(this) as Exception
  }

  get warn (): WarningReport | undefined {
    return this[1]
  }

  get w (): WarningReport | undefined {
    return this[1]
  }

  get opinion (): OpinionReport | undefined {
    return this[2]
  }

  get o (): OpinionReport | undefined {
    return this[2]
  }

  get ignore (): IgnoredReport | undefined {
    return this[3]
  }

  get i (): IgnoredReport | undefined {
    return this[3]
  }

  get length (): 4 {
    return 4
  }

  toString (): string {
    const parts: string[] = []
    const errorCount = this.error === undefined ? 0 : this.error.count
    const warningCount = this.warn === undefined ? 0 : this.warn.count
    const opinionCount = this.opinion === undefined ? 0 : this.opinion.count
    const ignoredCount = this.ignore === undefined ? 0 : this.ignore.count

    parts.push(errorCount === 1 ? '1 Error' : String(errorCount) + ' Errors')
    parts.push(warningCount === 1 ? '1 Warning' : String(warningCount) + ' Warnings')
    parts.push(opinionCount === 1 ? '1 Opinion' : String(opinionCount) + ' Opinions')
    parts.push(String(ignoredCount) + ' Ignored')

    return '[ ExceptionReport: ' + parts.join(', ') + ' ]'
  }

  [inspect] (): string {
    return this.toString()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  [Symbol.iterator] () {}
}

// Give the ExceptionReport the same iterator as the Array object
ExceptionReport.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

export class ExceptionReportItem {
  public readonly message: string
  public readonly messageDetails: Array<{
    data: ExceptionMessageData
    path: string[]
  }>

  constructor (level: Level, data: ExceptionPreReport, header: string, prefix: string, lineDelimiter: string) {
    this.message = 'Nothing to report'
    this.messageDetails = []
    const reportMessage = getReport(this, level, lineDelimiter, data, prefix, [])
    reportExceptionMap.set(this, data.exception)
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

  get exception (): Exception {
    return reportExceptionMap.get(this) as Exception
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

export class ErrorReport extends ExceptionReportItem {}
export class WarningReport extends ExceptionReportItem {}
export class OpinionReport extends ExceptionReportItem {}
export class IgnoredReport extends ExceptionReportItem {}

function runPreReport (fullConfig: Required<ExceptionConfiguration>, context: Exception, parent: ExceptionPreReport | null): ExceptionPreReport {
  const data = context.data
  const result: ExceptionPreReport = {
    children: [],
    exception: context,
    hasException: parent !== null ? parent.hasException : {
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
        result.messages[message.level].push(message)
        result.hasException[message.level] = true
      }
    })

  // filter out the children that have messages
  const at = data.at
  Object.keys(at).forEach(key => {
    result.children.push({
      at: key,
      data: runPreReport(fullConfig, at[key], result)
    })
  })

  return result
}

function getReport (report: ExceptionReportItem, level: Level, lineDelimiter: string, data: ExceptionPreReport, prefix: string, path: string[]): string {
  const prefixPlus = prefix + '  '
  let result: string = ''

  const { children, hasException, messages, parent } = data
  if (hasException[level]) {
    children.forEach(child => {
      const at = child.at
      if (parent?.children.length === 1) {
        result += ' > '
      } else {
        result += lineDelimiter + prefixPlus + 'at: '
      }
      result += at + ' ' + getReport(report, level, lineDelimiter, child.data, prefixPlus, path.concat([at]))
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
