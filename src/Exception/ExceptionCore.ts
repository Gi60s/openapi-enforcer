import { adapter } from '../utils/adapter'
import * as Config from '../utils/config'
import { lookupLocation } from '../utils/loader'
import { Location } from 'json-to-ast'

const { inspect, eol } = adapter
const exceptionMap = new WeakMap<ExceptionCore, PreReport>()
const levels: Level[] = ['error', 'warn', 'info', 'ignore']

interface ExceptionData<T> {
  at: Record<string, T>
  messages: Message[]
}

export type Level = Config.Level

export interface Message {
  alternateLevels: Level[]
  code: string
  definition?: any // component definition if available
  exception?: ExceptionCore
  level: Level
  locations?: Location[]
  message: string
  metadata: Record<string, any>
  reference: string
}

interface PreReport {
  activeChildrenCount: {
    error: number
    warn: number
    info: number
    ignore: number
  }
  children: Array<{
    at: string
    data: PreReport
  }>
  exception: ExceptionCore
  hasException: {
    error: boolean
    warn: boolean
    info: boolean
    ignore: boolean
  }
  messages: {
    error: Message[]
    warn: Message[]
    info: Message[]
    ignore: Message[]
  }
}

type ExceptionReportDetailsItem = Message & {
  breadcrumbs: string[]
}

export class ExceptionCore {
  public header: string | undefined
  public data: ExceptionData<ExceptionCore> = { at: {}, messages: [] }

  constructor (header?: string) {
    this.header = header
  }

  public at (key: string | number): ExceptionCore {
    const at = this.data.at
    if (!(key in at)) {
      at[key] = new ExceptionCore()
    }
    return at[key]
  }

  public message (message: Message): Message {
    // store the exception data
    this.data.messages.push(message)

    // adjust level as necessary
    const newLevel: Level | undefined = Config.get().exceptions?.levels?.[message.code] ?? message.definition?.['x-enforcer']?.exceptions?.[message.code]
    if (newLevel !== undefined && newLevel !== message.level) {
      if (message.alternateLevels.includes(newLevel)) {
        message.level = newLevel
      } else {
        this.message({
          alternateLevels: ['ignore', 'info', 'warn', 'error'],
          code: 'EXLECI',
          level: 'warn',
          message: 'Unable to change exception level for "' + message.code + '" to "' + (newLevel as string) + '". Accepted levels include: ' + message.alternateLevels.join(', '),
          metadata: {
            alternateLevels: message.alternateLevels,
            code: message.code,
            invalidLevel: newLevel,
            level: message.level
          },
          reference: ''
        })
      }
    }

    return message
  }

  get '0' (): ErrorReport | undefined {
    const config = Config.get().exceptions
    const data = runPreReport(config, this) // update the cache
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

  get '2' (): InfoReport | undefined {
    const data = getCachedPreReport(this)
    if (!data.hasException.info) return

    const header = this.header ?? ''
    return new InfoReport('info', data, header)
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

  get info (): InfoReport | undefined {
    return getReportByType('info', this)
  }

  get warning (): WarningReport | undefined {
    return getReportByType('warn', this)
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

// overwrite exception iterator, use array iterator
ExceptionCore.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

export class ExceptionReport {
  public readonly message: string
  public readonly exceptions: ExceptionReportDetailsItem[]

  constructor (level: Level, data: PreReport, header: string) {
    const { exceptions: config } = Config.get()
    this.message = 'Nothing to report'
    this.exceptions = []
    const extra = { footnotes: '' }
    const reportMessage = getReport(this, level, data, '  ', false, [], extra)
    if (this.exceptions.length > 0) {
      switch (level) {
        case 'error':
          header = header.replace('[TYPE]', 'errors')
          break
        case 'warn':
          header = header.replace('[TYPE]', 'warnings')
          break
        case 'info':
          header = header.replace('[TYPE]', 'info items')
          break
        case 'ignore':
          header = header.replace('[TYPE]', 'ignored items')
          break
      }
      this.message = header + reportMessage
      if (config.details === 'footnote' && extra.footnotes.length > 0) this.message += eol + eol + extra.footnotes
    }
  }

  getCodeCount (): Record<string, number> {
    const result: Record<string, number> = {}
    this.exceptions.forEach(exception => {
      const { code } = exception
      if (!(code in result)) result[code] = 0
      result[code]++
    })
    return result
  }

  hasCode (...codes: string[]): boolean {
    const length = codes.length
    for (let i = 0; i < length; i++) {
      const code = codes[i]
      const index = this.exceptions.findIndex(v => v.code === code)
      if (index === -1) return false
    }
    return true
  }

  get count (): number {
    return this.exceptions.length
  }

  get hasException (): boolean {
    return this.exceptions.length > 0
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
export class InfoReport extends ExceptionReport {}
export class IgnoredReport extends ExceptionReport {}

export function smart (value: any, addQuotationMarksToStrings = true): string {
  if (typeof value === 'string') {
    return addQuotationMarksToStrings
      ? '"' + value.replace(/"/g, '\\"') + '"'
      : value
  } else if (value instanceof Date) {
    return isNaN(+value) ? 'invalid date object' : value.toISOString()
  } else if (Array.isArray(value)) {
    return value.map(v => smart(v, addQuotationMarksToStrings)).join(', ')
  } else {
    return String(value)
  }
}

function getCachedPreReport (exception: ExceptionCore): PreReport {
  const config = Config.get().exceptions
  const existing = exceptionMap.get(exception)
  const data = existing ?? runPreReport(config, exception)
  if (existing === undefined) exceptionMap.set(exception, data)
  return data
}

function getReportByType (level: Level, exception: ExceptionCore): ExceptionReport | undefined {
  const config = Config.get().exceptions
  const data = runPreReport(config, exception)
  if (!data.hasException[level]) return

  const header = exception.header ?? ''
  return new ErrorReport(level, data, header)
}

function runPreReport (fullConfig: Required<Config.ExceptionConfiguration>, context: ExceptionCore): PreReport {
  const data = context.data
  const result: PreReport = {
    activeChildrenCount: {
      error: 0,
      warn: 0,
      info: 0,
      ignore: 0
    },
    children: [],
    exception: context,
    hasException: {
      error: false,
      warn: false,
      info: false,
      ignore: false
    },
    messages: {
      error: [],
      warn: [],
      info: [],
      ignore: []
    }
  }

  // sort messages into groups
  data.messages
    .forEach(message => {
      const level = message.level
      result.messages[level].push(message)
      result.hasException[level] = true
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

function getReport (report: ExceptionReport, level: Level, data: PreReport, indent: string, isContinue: boolean, path: string[], extra: { footnotes: string }): string {
  const indentPlus = indent + '  '
  const { exceptions: config } = Config.get()
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
            getReport(report, level, child.data, willContinue ? indent : indentPlus, willContinue, path.concat([key]), extra)
        } else if (isContinue) {
          result += ' > ' + key + getReport(report, level, child.data, indentPlus, false, path.concat([key]), extra)
        } else {
          result += eol + indent + 'at: ' + key +
            getReport(report, level, child.data, indentPlus, false, path.concat([key]), extra)
        }
      }
    })

    messages[level].forEach((message) => {
      const index = report.exceptions.length
      result += eol + indent + message.message

      if (config.details === 'all') {
        const indentPlus = indent + '  '
        result += eol + indentPlus + getExceptionDetailsReport(indentPlus, path, message)
      } else if (config.details === 'breadcrumbs') {
        result += eol + indent + '  breadcrumbs: /' + (path.length > 0 ? ' > ' + path.join(' > ') : '')
      } else if (config.details === 'code') {
        result += ' [' + message.code + ']'
      } else if (config.details === 'footnote') {
        const sIndex = '[' + String(index) + ']'
        const footnoteIndent = ' '.repeat(sIndex.length)
        result += ' ' + sIndex
        extra.footnotes += sIndex + getExceptionDetailsReport(footnoteIndent, path, message)
      } else if (config.details === 'locations' && message.locations !== undefined) {
        if (message.locations.length > 0) {
          result += ' (' + message.locations.map(l => {
            let s = ''
            if (l.source !== null) s += l.source + ':'
            s += String(l.start.line) + ':' + String(l.start.column)
            return s
          }).join(', ') + ')'
        }
      }

      if (message.exception !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        result += message.exception
          // @ts-expect-error
          .toString({ prefix: indent, skipTop: true, top: true })
      }

      // TODO: add for details equals 'locations', 'detailed', 'breadcrumbs', 'all', 'index'

      report.exceptions.push(Object.assign({}, message, { breadcrumbs: path }))
    })
  }

  return result
}

function getExceptionDetailsReport (indent: string, path: string[], message: Message): string {
  let result = ''

  // indent not added to first line only
  result += 'breadcrumbs: /' + (path.length > 0 ? ' > ' : '') + path.join(' > ') + eol +
    indent + 'code: ' + message.code
  if (message.locations !== undefined && message.locations.length > 0) {
    const indentPlus = indent + '  '
    result += eol + indent + 'locations:'
    message.locations.forEach(l => {
      result += eol + indentPlus
      if (l.source !== null) result += l.source + ':'
      result += String(l.start.line) + ':' + String(l.start.column)
    })
  }
  if (message.reference.length > 0) result += eol + indent + 'reference: ' + message.reference
  return result
}
