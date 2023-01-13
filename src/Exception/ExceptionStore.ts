import {
  IExceptionData,
  IExceptionLevel,
  IExceptionReportConfiguration
} from './IException'
import { Exception } from './Exception'
import {
  ErrorReport,
  ExceptionReportLevel,
  IgnoredReport,
  InfoReport,
  WarningReport
} from './ExceptionReport'
import { getMessage } from '../i18n/i18n'

interface ICache {
  report: IExceptionReport | null
}

type IExceptionReport = Record<IExceptionLevel, ExceptionReportLevel>

const defaultHeader = 'One or more <level> exceptions exist:'

export class ExceptionStore {
  public exceptions: Exception[]
  public configuration: Required<IExceptionReportConfiguration>
  private readonly cache: ICache

  constructor (configuration?: IExceptionReportConfiguration) {
    this.configuration = {
      header: configuration?.header ?? defaultHeader,
      overwrite: Object.assign({}, configuration?.overwrite)
    }
    this.exceptions = []
    this.cache = {
      report: null
    }
  }

  add (data: IExceptionData): ExceptionStore {
    const exception = new Exception(data)
    this.exceptions.push(exception)

    // invalidate the report cache because we have a new exception
    this.cache.report = null

    return this
  }

  get '0' (): ErrorReport | undefined {
    return this.error
  }

  get error (): ErrorReport | undefined {
    return this.createReport().error
  }

  get '1' (): WarningReport | undefined {
    return this.warning
  }

  get warning (): WarningReport | undefined {
    return this.createReport().warn
  }

  get '2' (): InfoReport | undefined {
    return this.info
  }

  get info (): InfoReport | undefined {
    return this.createReport().info
  }

  get '3' (): IgnoredReport | undefined {
    return this.ignored
  }

  get ignored (): IgnoredReport | undefined {
    return this.createReport().ignore
  }

  get hasError (): boolean {
    return this.error !== undefined
  }

  get hasWarning (): boolean {
    return this.warning !== undefined
  }

  get hasInfo (): boolean {
    return this.info !== undefined
  }

  get hasIgnored (): boolean {
    return this.ignored !== undefined
  }

  get length (): 4 {
    return 4
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error(getMessage('NOT_IMPLEMENTED'))
  }

  private createReport (): IExceptionReport {
    // check for a cached report first
    if (this.cache.report !== null) {
      return this.cache.report
    }

    const header = this.configuration.header ?? defaultHeader
    const overwrite = this.configuration.overwrite ?? {}

    const reports: IExceptionReport = {
      error: new ExceptionReportLevel(header.replace(/<level>/g, 'error')),
      warn: new ExceptionReportLevel(header.replace(/<level>/g, 'warn')),
      info: new ExceptionReportLevel(header.replace(/<level>/g, 'info')),
      ignore: new ExceptionReportLevel(header.replace(/<level>/g, 'ignore'))
    }

    // organize into level groups
    const levelGroups: Record<IExceptionLevel, Exception[]> = {
      error: [],
      warn: [],
      info: [],
      ignore: []
    }
    this.exceptions.forEach(exception => {
      const id = exception.id
      exception.locations.forEach(location => {
        const level: IExceptionLevel = exception.levelOverwritten
          ? exception.level
          : overwrite[id] ?? exception.level
        levelGroups[level].push(exception)
      })
    })

    // generate report groups
    ;(['error', 'warn', 'info', 'ignore'] as IExceptionLevel[]).forEach(level => {
      levelGroups[level].forEach(exception => {
        const report = reports[level]
        const reportItems = report.reportItems
        report.exceptions.push(exception)

        // create locations strings (breadcrumbs + source)
        const bcrumbs: string[] = exception.locations
          .map(loc => {
            const breadcrumbs = loc.breadcrumbs ?? ''
            const source = loc.source ?? ''
            return breadcrumbs + (source.length > 0 ? ' (' + source + ')' : '')
          })
        bcrumbs.sort()

        // find and add to a group or create a group if not found
        const found = reportItems.find(r => {
          const length = r.breadcrumbs.length
          if (length !== bcrumbs.length) return false
          for (let i = 0; i < length; i++) {
            if (r.breadcrumbs[i] !== bcrumbs[i]) return false
          }
          return true
        })
        if (found === undefined) {
          reportItems.push({
            breadcrumbs: bcrumbs,
            exceptions: [exception]
          })
        } else if (found.exceptions.find(e => e === exception) === undefined) {
          found.exceptions.push(exception)
        }
      })
    })

    this.cache.report = reports
    return reports
  }
}

ExceptionStore.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
