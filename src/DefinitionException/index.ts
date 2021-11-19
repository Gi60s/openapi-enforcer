import { adapter } from '../utils/adapter'
import { ExceptionMessageData, ExceptionMessageDataInput, Level } from './types'
import * as Config from '../utils/config'
import { lookupLocation } from '../utils/loader'
import { Location } from 'json-to-ast'
import { getExceptionMessageData } from './error-codes'

const { inspect, eol } = adapter
const exceptionMap = new WeakMap<DefinitionException, ExceptionPreReport>()
const levels: Level[] = ['error', 'warn', 'opinion', 'ignore']

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
  exception: DefinitionException
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

type ExceptionReportDetailsItem = ExceptionMessageData & {
  breadcrumbs: string[]
}

export class DefinitionException {
  public header: string | undefined
  public data: ExceptionData<DefinitionException> = { at: {}, messages: [] }

  constructor (header?: string) {
    this.header = header
  }

  public at (key: string | number): DefinitionException {
    const at = this.data.at
    if (!(key in at)) {
      at[key] = new DefinitionException()
    }
    return at[key]
  }

  public message (data: ExceptionMessageDataInput): ExceptionMessageData {
    // create initial message object
    const messageData: ExceptionMessageData = {
      alternateLevels: data.alternateLevels ?? [],
      code: data.code,
      definition: typeof data.definition === 'object' && data.definition !== null ? data.definition : undefined,
      id: data.id,
      level: data.level,
      locations: (data.locations ?? []).map(v => lookupLocation(v.node, v.key, v.type)).filter(v => v !== undefined) as Location[],
      message: data.message,
      metadata: data.metadata ?? {},
      reference: data.reference ?? ''
    }

    // make sure that the current level is included in the alternate levels
    if (!messageData.alternateLevels.includes(data.level)) messageData.alternateLevels.push(data.level)

    // check to see if the exception level should be changed based on either
    // 1. the definition x-enforcer directive or
    // 2. by global configuration
    const configLevels = Config.get().exceptions?.levels
    let invalidLevelChange: { level: Level, newLevel: Level, id: string, code: string, allowedLevels: string, alternateLevels: Level[] } | null = null
    const directive = messageData.definition?.['x-enforcer']?.exceptions
    const newLevel: Level | undefined = directive?.[messageData.code] ?? configLevels?.[messageData.code]
    if (newLevel !== undefined && newLevel !== data.level) {
      if (messageData.alternateLevels.includes(newLevel)) {
        messageData.level = newLevel
      } else {
        invalidLevelChange = {
          allowedLevels: messageData.alternateLevels.join(', '),
          alternateLevels: messageData.alternateLevels.slice(0),
          code: data.code,
          id: data.id,
          level: data.level,
          newLevel
        }
      }
    }

    // store the exception data (with possibly modified level)
    this.data.messages.push(messageData)

    // if there was an attempt to modify the level and it failed then add another exception message about the failure
    if (invalidLevelChange !== null && data.id !== 'EXCEPTION_LEVEL_CHANGE_INVALID') {
      this.message(getExceptionMessageData('EXCEPTION_LEVEL_CHANGE_INVALID', invalidLevelChange, {
        definition: messageData.definition,
        locations: directive !== undefined ? [{ node: directive, key: messageData.code, type: 'value' }] : []
      }))
    }

    return messageData
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
DefinitionException.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

export class ExceptionReport {
  public readonly message: string
  public readonly exceptions: ExceptionReportDetailsItem[]

  constructor (level: Level, data: ExceptionPreReport, header: string) {
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
        case 'opinion':
          header = header.replace('[TYPE]', 'opinions')
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
export class OpinionReport extends ExceptionReport {}
export class IgnoredReport extends ExceptionReport {}

function getCachedPreReport (exception: DefinitionException): ExceptionPreReport {
  const config = Config.get().exceptions
  const existing = exceptionMap.get(exception)
  const data = existing ?? runPreReport(config, exception)
  if (existing === undefined) exceptionMap.set(exception, data)
  return data
}

function getReportByType (level: Level, exception: DefinitionException): ExceptionReport | undefined {
  const config = Config.get().exceptions
  const data = runPreReport(config, exception)
  if (!data.hasException[level]) return

  const header = exception.header ?? ''
  return new ErrorReport(level, data, header)
}

function runPreReport (fullConfig: Required<Config.ExceptionConfiguration>, context: DefinitionException): ExceptionPreReport {
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

function getReport (report: ExceptionReport, level: Level, data: ExceptionPreReport, indent: string, isContinue: boolean, path: string[], extra: { footnotes: string }): string {
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
      } else if (config.details === 'id') {
        result += ' [' + message.id + ']'
      } else if (config.details === 'locations') {
        if (message.locations.length > 0) {
          result += ' (' + message.locations.map(l => {
            let s = ''
            if (l.source !== null) s += l.source + ':'
            s += String(l.start.line) + ':' + String(l.start.column)
            return s
          }).join(', ') + ')'
        }
      }

      // TODO: add for details equals 'locations', 'detailed', 'breadcrumbs', 'all', 'index'

      report.exceptions.push(Object.assign({}, message, { breadcrumbs: path }))
    })
  }

  return result
}

function getExceptionDetailsReport (indent: string, path: string[], message: ExceptionMessageData): string {
  let result = ''

  // indent not added to first line only
  result += 'breadcrumbs: /' + (path.length > 0 ? ' > ' : '') + path.join(' > ') + eol +
    indent + 'code: ' + message.code + eol +
    indent + 'id: ' + message.id
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
