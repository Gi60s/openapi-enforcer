import { adapter } from '../utils/adapter'
import * as Config from '../utils/config'
import { Location } from 'json-to-ast'
import { lookupLocation } from '../utils/loader'

const { inspect, eol } = adapter
const exceptionMap = new WeakMap<ExceptionBase<any>, PreReport<any>>()
const levels: Level[] = ['error', 'warn', 'info', 'ignore']

export type ExceptionLevelConfig = Config.ExceptionLevelConfig

interface ExceptionData<T extends ExceptionBase<T>> {
  at: Record<string, T>
  messages: Message[]
}

export interface LocationInput {
  node?: any // if node is not provided then the component definition is used for the node
  key?: string | number
  type?: 'value' | 'key' | 'both'
}

export type Level = Config.Level

export interface Message {
  alternateLevels: Level[]
  code: string
  definition?: any // component definition if available
  exception?: ExceptionBase<any>
  level: Level
  locations?: Location[]
  message: string
  metadata: Record<string, any>
  reference: string
}

interface PreReport<T extends ExceptionBase<T>> {
  activeChildrenCount: {
    error: number
    warn: number
    info: number
    ignore: number
  }
  children: Array<{
    at: string
    data: PreReport<T>
  }>
  exception: ExceptionBase<T>
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

export class ExceptionBase<T extends ExceptionBase<T>> {
  public header: string | undefined
  public data: ExceptionData<ExceptionBase<T>> = { at: {}, messages: [] }
  public exceptionLevels: ExceptionLevelConfig

  constructor (header?: string, exceptionLevels?: ExceptionLevelConfig) {
    this.header = header
    this.exceptionLevels = exceptionLevels ?? Config.get().exceptions?.levels ?? {}
  }

  public adjustLevels (exceptionLevels: ExceptionLevelConfig): ExceptionBase<T> {
    const store: Record<string, Message[]> = {}
    getMessagesByCode(this, store)

    Object.keys(exceptionLevels).forEach(code => {
      if (store[code] !== undefined) {
        const newLevel = exceptionLevels[code]
        store[code].forEach(message => {
          if (message.alternateLevels.includes(newLevel)) {
            message.level = newLevel
          }
        })
      }
    })

    return this
  }

  public at (key: string | number): ExceptionBase<T> {
    const at = this.data.at
    if (!(key in at)) {
      const Exception = this.constructor as typeof ExceptionBase
      at[key] = new Exception('', this.exceptionLevels)
    }
    return at[key]
  }

  public hasCode (code: string, levels?: Level | Level[]): boolean {
    const { at, messages } = this.data
    const lvl: Level[] | undefined = levels === undefined
      ? undefined
      : Array.isArray(levels) ? levels : [levels]

    let length = messages.length
    for (let i = 0; i < length; i++) {
      if (messages[i].code === code && (lvl === undefined || lvl.includes(messages[i].level))) return true
    }

    const keys = Object.keys(at)
    length = keys.length
    for (let i = 0; i < length; i++) {
      if (at[keys[i]].hasCode(code, lvl)) return true
    }

    return false
  }

  public message (message: Message): Message {
    // store the exception data
    this.data.messages.push(message)

    // adjust level as necessary
    const newLevel: Level | undefined = this.exceptionLevels?.[message.code] ?? message.definition?.['x-enforcer']?.exceptions?.[message.code]
    if (newLevel !== undefined && newLevel !== message.level) {
      if (message.alternateLevels.includes(newLevel)) {
        message.level = newLevel
      } else {
        // this.message({
        //   alternateLevels: ['ignore', 'info', 'warn', 'error'],
        //   code: 'EXLECI',
        //   level: 'warn',
        //   message: 'Unable to change exception level for "' + message.code + '" to "' + (newLevel as string) + '". Accepted levels include: ' + message.alternateLevels.join(', '),
        //   metadata: {
        //     alternateLevels: message.alternateLevels,
        //     code: message.code,
        //     invalidLevel: newLevel,
        //     level: message.level
        //   },
        //   reference: ''
        // })
      }
    }

    return message
  }

  public report (level: Level, options?: { indent: string, includeHeader: boolean }): ExceptionReport<T> | undefined {
    const config = Config.get().exceptions
    const data = runPreReport(config, this) // update the cache
    if (!data.hasException[level]) return

    const header = options?.includeHeader === false ? '' : this.header ?? ''
    const indent = options?.indent ?? ''
    return new ErrorReport(level, data, header, indent)
  }

  get '0' (): ErrorReport<T> | undefined {
    const config = Config.get().exceptions
    const data = runPreReport(config, this) // update the cache
    exceptionMap.set(this, data)
    if (!data.hasException.error) return

    const header = this.header ?? ''
    return new ErrorReport('error', data, header)
  }

  get '1' (): WarningReport<T> | undefined {
    const data = getCachedPreReport(this)
    if (!data.hasException.warn) return

    const header = this.header ?? ''
    return new WarningReport('warn', data, header)
  }

  get '2' (): InfoReport<T> | undefined {
    const data = getCachedPreReport(this)
    if (!data.hasException.info) return

    const header = this.header ?? ''
    return new InfoReport('info', data, header)
  }

  get '3' (): IgnoredReport<T> | undefined {
    const data = getCachedPreReport(this)
    if (!data.hasException.ignore) return

    const header = this.header ?? ''
    return new IgnoredReport('ignore', data, header)
  }

  get error (): ErrorReport<T> | undefined {
    return getReportByType('error', this)
  }

  get hasError (): boolean {
    return this.error !== undefined
  }

  get ignored (): IgnoredReport<T> | undefined {
    return getReportByType('ignore', this)
  }

  get length (): 4 {
    return 4
  }

  get info (): InfoReport<T> | undefined {
    return getReportByType('info', this)
  }

  get warning (): WarningReport<T> | undefined {
    return getReportByType('warn', this)
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

// overwrite exception iterator, use array iterator
ExceptionBase.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

export class ExceptionReport<T extends ExceptionBase<T>> {
  public readonly message: string
  public readonly exceptions: ExceptionReportDetailsItem[]

  constructor (level: Level, data: PreReport<T>, header: string, indent = '') {
    const { exceptions: config } = Config.get()
    this.message = 'Nothing to report'
    this.exceptions = []
    const extra = { footnotes: '' }
    const reportMessage = getReport(this, level, data, indent + '  ', false, [], extra)
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
      this.message = indent + header + reportMessage
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

export class ErrorReport<T extends ExceptionBase<T>> extends ExceptionReport<T> {}
export class WarningReport<T extends ExceptionBase<T>> extends ExceptionReport<T> {}
export class InfoReport<T extends ExceptionBase<T>> extends ExceptionReport<T> {}
export class IgnoredReport<T extends ExceptionBase<T>> extends ExceptionReport<T> {}

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

function getCachedPreReport<T extends ExceptionBase<T>> (exception: ExceptionBase<T>): PreReport<T> {
  const config = Config.get().exceptions
  const existing = exceptionMap.get(exception)
  const data = existing ?? runPreReport(config, exception)
  if (existing === undefined) exceptionMap.set(exception, data)
  return data
}

function getReportByType<T extends ExceptionBase<T>> (level: Level, exception: ExceptionBase<T>): ExceptionReport<T> | undefined {
  const config = Config.get().exceptions
  const data = runPreReport(config, exception)
  if (!data.hasException[level]) return

  const header = exception.header ?? ''
  return new ErrorReport(level, data, header)
}

function runPreReport<T extends ExceptionBase<T>> (fullConfig: Required<Config.ExceptionConfiguration>, context: ExceptionBase<T>): PreReport<T> {
  const data = context.data
  const result: PreReport<T> = {
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

function getReport<T extends ExceptionBase<T>> (report: ExceptionReport<T>, level: Level, data: PreReport<T>, indent: string, isContinue: boolean, path: string[], extra: { footnotes: string }): string {
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
        const details = message.exception.report('error', { indent, includeHeader: false })?.toString()
        if (details !== undefined) result += details
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

function getMessagesByCode (exception: ExceptionBase<any>, store: Record<string, Message[]>): void {
  const at = exception.data.at
  Object.keys(at).forEach(key => {
    getMessagesByCode(at[key], store)
  })

  exception.data.messages.forEach(message => {
    if (store[message.code] === undefined) store[message.code] = []
    store[message.code].push(message)
  })
}
