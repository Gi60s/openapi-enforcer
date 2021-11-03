import { adapter } from './adapter'
const { inspect, eol } = adapter()

interface ExceptionData {
  at: Record<string, Exception>
  messages: string[]
  nests: Exception[]
}

interface Report {
  at: Record<string, Report>
  exception: Exception
  messages: string[]
  nests: Report[]
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

  public message (message: string): Exception {
    this.data.messages.push(message)
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

  toString (): string {
    const report = getReport(this)
    return toString(report, '', true)
  }

  [inspect] (): string {
    if (this.hasException) {
      const report = getReport(this)
      return '[ EnforcerException: ' + toString(report, '  ', true) + ' ]'
    } else {
      return '[ EnforcerException ]'
    }
  }
}

function getReport (exception: Exception): Report {
  const { at, messages, nests } = exception.data
  const messagesLength = messages.length
  const result: Report = {
    at: {},
    exception,
    messages,
    nests: [],
    ownCount: messagesLength,
    totalCount: messagesLength
  }

  nests.forEach(nest => {
    const r = getReport(nest)
    if (r.totalCount > 0) {
      result.totalCount += r.totalCount
      result.nests.push(r)
    }
  })

  Object.keys(at).forEach(key => {
    const r = getReport(at[key])
    if (r.totalCount > 0) {
      result.totalCount += r.totalCount
      result.at[key] = r
    }
  })

  return result
}

function toString (report: Report, prefix: string, top: boolean): string {
  const { at, exception, nests } = report
  const { messages } = exception.data
  const prefixPlus = prefix + '  '
  let result = ''

  if (exception.header !== undefined) {
    result += (top ? '' : prefix) + exception.header
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

  messages.forEach(message => {
    result += eol + prefixPlus + message
  })

  return result
}
