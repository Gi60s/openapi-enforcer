import { ExceptionMessageData } from './types'
import { getConfig, ExceptionConfiguration } from '../config'
import * as util from 'util'

const inspect = util.inspect.custom ?? 'inspect'

interface ExceptionData<T> {
  at: Record<string, T>
  messages: ExceptionMessageData[]
}

interface ExceptionPreReport {
  children: Array<{
    at: string
    data: ExceptionPreReport
  }>
  count: number
  countDetails: {
    error: number
    warn: number
    opinion: number
    ignore: number
  }
  messages: ExceptionMessageData[]
  parent: ExceptionPreReport | null
}

export interface ExceptionReport {
  count: number
  countDetails: {
    error: number
    warn: number
    opinion: number
    ignore: number
  }
  hasException: boolean
  message: string
  messageDetails: Array<{
    data: ExceptionMessageData
    path: string[]
  }>
  toString: () => string
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

  public report (config: ExceptionConfiguration = {}): ExceptionReport {
    const c = getConfig().exceptions
    const indentLength: number = arguments.length === 2 ? arguments[1] : 0
    const fullConfig: Required<ExceptionConfiguration> = {
      codes: Object.assign({}, c.codes, config.codes),
      include: config.include !== undefined ? config.include : c.include,
      lineDelimiter: config.lineDelimiter !== undefined ? config.lineDelimiter : c.lineDelimiter
    }

    // TODO: validate that only allowed codes are included in the fullConfig.codes

    const result: ExceptionReport = {
      count: 0,
      countDetails: {
        error: 0,
        warn: 0,
        opinion: 0,
        ignore: 0
      },
      get hasException () { return this.count > 0 },
      message: '',
      messageDetails: [],

      toString (): string { return this.message },
      [inspect] (): string {
        if (this.hasException) {
          return '[ EnforcerException: ' + this.message + ' ]'
        } else {
          return '[ EnforcerException ]'
        }
      }
    }

    // run pre report
    const data = runPreReport(fullConfig, this, null)
    result.countDetails = data.countDetails
    if (data.count === 0) return result

    result.message = (this.header as string) + fullConfig.lineDelimiter + getReport(result, fullConfig, data, ' '.repeat(indentLength + 2), [])
    return result
  }

  public toString (): string {
    return this.report().message
  }

  [inspect] (): string {
    // @ts-expect-error
    const report = this.report({}, 2)
    if (report.hasException) {
      return '[ EnforcerException: ' + report.message + ' ]'
    } else {
      return '[ EnforcerException ]'
    }
  }
}

// export class Exception {
//   public header: string
//   public data: {
//     at: {
//       [key: string]: Exception
//     }
//     nest: Exception[]
//     messages: ExceptionMessageData[]
//   } = { at: {}, nest: [], messages: [] }
//
//   constructor (header: string) {
//     this.header = header
//   }
//
//   public at (key: string | number): Exception {
//     const at = this.data.at
//     if (!(key in at)) at[key] = new Exception('')
//     return at[key]
//   }
//
//   public get hasException (): boolean {
//     const children = this.data
//     if (children.messages.length > 0) return true
//
//     const nest = children.nest
//     const length = nest.length
//     for (let i = 0; i < length; i++) {
//       if (nest[i].hasException) return true
//     }
//
//     const keys = Object.keys(children.at)
//     const length2 = keys.length
//     for (let i = 0; i < length2; i++) {
//       if (children.at[keys[i]].hasException) return true
//     }
//
//     return false
//   }
//
//   public message (code: string, reference: string, message: string): Exception {
//     this.data.messages.push({
//       code,
//       message,
//       reference
//     })
//     return this
//   }
//
//   public nest (header: string): Exception {
//     const exception = new Exception(header)
//     this.push(exception)
//     return exception
//   }
//
//   public push (exception: Exception): Exception {
//     this.data.nest.push(exception)
//     return exception
//   }
//
//   public toString (): string {
//     return toString(this, null, '')
//   }
//
//   [inspect] (): string {
//     if (this.hasException) {
//       return '[ EnforcerException: ' + toString(this, null, '  ') + ' ]'
//     } else {
//       return '[ EnforcerException ]'
//     }
//   }
// }

function runPreReport (fullConfig: Required<ExceptionConfiguration>, context: Exception, parent: ExceptionPreReport | null): ExceptionPreReport {
  const data = context.data
  const result: ExceptionPreReport = {
    children: [],
    count: 0,
    countDetails: parent !== null ? parent.countDetails : {
      error: 0,
      warn: 0,
      opinion: 0,
      ignore: 0
    },
    messages: [],
    parent
  }

  // filter out the messages that this exception will produce
  const messages = data.messages
    .map(message => {
      const code = message.code
      // @ts-expect-error
      if (fullConfig?.codes?.[code] !== undefined) {
        // @ts-expect-error
        message.level = fullConfig.codes[code]
      }
      result.countDetails[message.level]++
      return message
    })
    .filter(message => {
      if (message.active === false) return false
      // @ts-expect-error
      return fullConfig.include.includes(message.level)
    })
  result.messages.push(...messages)
  result.count = result.messages.length

  // filter out the children that have messages
  const at = data.at
  Object.keys(at).forEach(key => {
    const r = runPreReport(fullConfig, at[key], result)
    if (r.count > 0) {
      result.children.push({
        at: key,
        data: r
      })
      result.count += r.count
    }
  })

  return result
}

function getReport (report: ExceptionReport, fullConfig: Required<ExceptionConfiguration>, data: ExceptionPreReport, prefix: string, path: string[]): string {
  const prefixPlus = prefix + '  '
  let result: string = ''

  const { children, messages, parent } = data
  children.forEach(child => {
    const at = child.at
    if (parent?.children.length === 1) {
      result += ' > '
    } else {
      result += fullConfig.lineDelimiter + prefixPlus + 'at: '
    }
    result += at + ' ' + getReport(report, fullConfig, child.data, prefixPlus, path.concat([at]))
  })

  messages.forEach(message => {
    result += fullConfig.lineDelimiter + prefixPlus + message.message
    report.count++
    report.messageDetails.push({
      data: message,
      path: path
    })
  })

  return result
}

// function toString (context: Exception, parent: Exception | null, prefix: string): string {
//   if (!context.hasException) return ''
//
//   const prefixPlus = prefix + '  '
//   const children = context.data
//   let result = ''
//
//   if (context.header !== '') result += ((parent != null) ? prefix : '') + context.header
//
//   const at = children.at
//   const atKeys = Object.keys(at).filter(key => at[key].hasException)
//   const singleAtKey = atKeys.length === 1
//   atKeys.forEach(key => {
//     const exception = children.at[key]
//     if (context.header !== '' || !singleAtKey || children.nest.length > 0 || children.messages.length > 0) {
//       result += '\n' + prefixPlus + 'at: ' + key + toString(exception, context, prefixPlus)
//     } else {
//       result += ' > ' + key + toString(exception, context, prefix)
//     }
//   })
//
//   children.nest.forEach(exception => {
//     if (exception.hasException) result += '\n' + toString(exception, context, prefixPlus)
//   })
//
//   children.messages.forEach(message => {
//     result += '\n' + prefixPlus + message.message
//   })
//
//   return result
// }
