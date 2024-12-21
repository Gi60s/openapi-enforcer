import { Assertion } from 'chai'
import { II18nMessageCode } from '../src/i18n/i18n'

declare global {
  export namespace Chai
  {
    interface Assertion
    {
      exceptionError(): void
      exceptionWarning(): void
      exceptionInfo(): void
      exceptionIgnored(): void
      exceptionErrorCode(code: string, exclusive?: boolean): void
      exceptionWarningCode(code: string, exclusive?: boolean): void
      exceptionInfoCode(code: string, exclusive?: boolean): void
      exceptionIgnoredCode(code: string, exclusive?: boolean): void
      exceptionErrorId(id: string, metadata?: Record<string, any>): void
      exceptionWarningId(id: string, metadata?: Record<string, any>): void
      exceptionInfoId(id: string, metadata?: Record<string, any>): void
      exceptionIgnoredId(id: string, metadata?: Record<string, any>): void
    }
  }
}

