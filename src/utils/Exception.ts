import { adapter } from './adapter'
const { inspect, eol } = adapter

interface Message {
  code: string
  message: string
  metadata: Record<string, any>
}

interface MessageCrumbs extends Message {
  breadcrumbs: string[]
}

interface ExceptionData {
  at: Record<string, Exception>
  messages: Message[]
  nests: Exception[]
}

interface Report {
  at: Record<string, Report>
  codes: Record<string, MessageCrumbs[]>
  exception: Exception
  hasException: boolean
  hasCode: (code: string) => boolean
  messages: MessageCrumbs[]
  nests: Report[]
  ownCodes: Record<string, MessageCrumbs[]>
  ownCount: number
  totalCount: number
}

export class Exception {
  public header: string | undefined
  public data: ExceptionData = { at: {}, messages: [], nests: [] }

  constructor (header?: string) {
    this.header = typeof header === 'string' && header.length === 0 ? undefined : header
  }

  public at (key: string | number): Exception {
    const at = this.data.at
    if (!(key in at)) at[key] = new Exception()
    return at[key]
  }

  public message (code: string, message: string, metadata?: Record<string, any>): Exception {
    this.data.messages.push({ code, message, metadata: metadata ?? {} })
    return this
  }

  public nest (header: string): Exception {
    const exception = new Exception(header)
    this.push(exception)
    return exception
  }

  public push (exception: Exception): Exception {
    this.data.nests.push(exception)
    return this
  }

  get count (): number {
    const { at, messages, nests } = this.data
    let count = messages.length

    nests.forEach(nest => {
      count += nest.count
    })

    Object.keys(at).forEach(key => {
      count += at[key].count
    })

    return count
  }

  get hasException (): boolean {
    const { at, messages, nests } = this.data

    if (messages.length > 0) return true

    const nestsLength = nests.length
    for (let i = 0; i < nestsLength; i++) {
      if (nests[i].hasException) return true
    }

    const atKeys = Object.keys(at)
    const atLength = atKeys.length
    for (let i = 0; i < atLength; i++) {
      if (at[atKeys[i]].hasException) return true
    }

    return false
  }

  get report (): Report {
    return getReport(this)
  }

  toString (): string {
    const report = getReport(this)
    const config: { prefix: string, skipTop: boolean, top: boolean } = arguments[0] ?? { prefix: '', skipTop: false, top: true }
    return toString(report, config.prefix, config.top, config.skipTop)
  }

  [inspect] (): string {
    if (this.hasException) {
      const report = getReport(this)
      return '[ EnforcerException: ' + toString(report, '  ', true, false) + ' ]'
    } else {
      return '[ EnforcerException ]'
    }
  }
}

function getReport (exception: Exception, breadcrumbs: string[] = []): Report {
  const { at, messages, nests } = exception.data
  const messagesLength = messages.length
  const messageCrumbs = messages.map(m => Object.assign({ breadcrumbs }, m))
  const result: Report = {
    at: {},
    codes: {},
    exception,
    hasException: false,
    hasCode,
    messages: messageCrumbs,
    nests: [],
    ownCodes: {},
    ownCount: messagesLength,
    totalCount: messagesLength
  }

  for (let i = 0; i < messagesLength; i++) {
    const message = messageCrumbs[i]
    const code = message.code
    if (code !== '') {
      if (result.ownCodes[code] === undefined) result.ownCodes[code] = []
      result.ownCodes[code].push(message)
    }
  }
  Object.assign(result.codes, result.ownCodes)

  nests.forEach(nest => {
    const r = getReport(nest, breadcrumbs)
    if (r.totalCount > 0) {
      result.nests.push(r)
      applyChildReport(result, r)
    }
  })

  Object.keys(at).forEach(key => {
    const r = getReport(at[key], breadcrumbs.concat([key]))
    if (r.totalCount > 0) {
      result.at[key] = r
      applyChildReport(result, r)
    }
  })

  result.hasException = result.totalCount > 0

  return result
}

function applyChildReport (parent: Report, child: Report): void {
  parent.totalCount += child.totalCount
  Object.keys(child.codes).forEach(code => {
    if (code !== '') {
      if (parent.codes[code] === undefined) parent.codes[code] = []
      parent.codes[code] = parent.codes[code].concat(child.codes[code])
    }
  })
}

function hasCode (this: Report, code: string): boolean {
  return this.codes[code] !== undefined && this.codes[code].length > 0
}

function toString (report: Report, prefix: string, top: boolean, skipTopHeader = false): string {
  const { at, exception, nests } = report
  const { messages } = exception.data
  const prefixPlus = prefix + '  '
  let result = ''

  if (exception.header !== undefined) {
    if (top) {
      if (!skipTopHeader) result += exception.header
    } else {
      result += prefix + exception.header
    }
  }

  const atKeys = Object.keys(at)
  const singleAtKey = atKeys.length === 1
  atKeys.forEach(key => {
    const r = at[key]
    const { exception, ownCount } = r
    if (exception.header !== undefined || !singleAtKey || ownCount > 0) {
      result += eol + prefixPlus + 'at: ' + key + toString(r, prefixPlus, false)
    } else {
      result += ' > ' + key + toString(r, prefix, false)
    }
  })

  nests.forEach(nest => {
    result += eol + toString(nest, prefixPlus, false)
  })

  messages.forEach(({ code, message }) => {
    result += eol + prefixPlus + message
    if (code !== '') result += ' [' + code + ']'
  })

  return result
}
