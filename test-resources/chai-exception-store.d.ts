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
      exceptionErrorCode(code: II18nMessageCode, exclusive?: boolean): void
      exceptionWarningCode(code: II18nMessageCode, exclusive?: boolean): void
      exceptionInfoCode(code: II18nMessageCode, exclusive?: boolean): void
      exceptionIgnoredCode(code: II18nMessageCode, exclusive?: boolean): void
    }
  }
}

