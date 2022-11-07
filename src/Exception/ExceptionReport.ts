import { IException, IExceptionReportItem } from './IException'
import { once } from '../Events/Events'

export class ExceptionReportLevel {
  public exceptions: IException[]
  public header: string
  public reportItems: IExceptionReportItem[]

  constructor (header?: string) {
    this.exceptions = []
    this.header = header ?? 'Exception found:'
    this.reportItems = []
  }

  toString (): string {
    return ''
  }
}

once('adapter-ready', adapter => {
  const eol = adapter.eol

  ExceptionReportLevel.prototype.toString = function (): string {
    if (this.exceptions.length === 0) return 'No exceptions exist'

    let result: string = this.header + eol
    this.reportItems.forEach(item => {
      const breadcrumbCount = item.breadcrumbs.length
      let exceptionIndent = '    '

      if (breadcrumbCount === 1) {
        result += '  at: ' + item.breadcrumbs[0] + eol
      } else if (breadcrumbCount > 1) {
        exceptionIndent += '  '
        result += '  at ' + String(breadcrumbCount) + ' locations:' + eol
        item.breadcrumbs.forEach((breadcrumb, index) => {
          result += '    ' + String(index + 1) + '. ' + breadcrumb + eol
        })
      }

      item.exceptions.forEach(exception => {
        result += exceptionIndent + '[' + exception.id + '] ' + exception.message
        if (exception.reference !== '') result += ' (' + exception.reference + ')'
        result += eol
      })
    })

    return result.trim()
  }

  // @ts-expect-error
  ExceptionReportLevel.prototype[adapter.inspect] = function (): string {
    return this.toString()
  }
})

export class ErrorReport extends ExceptionReportLevel {}
export class WarningReport extends ExceptionReportLevel {}
export class InfoReport extends ExceptionReportLevel {}
export class IgnoredReport extends ExceptionReportLevel {}
