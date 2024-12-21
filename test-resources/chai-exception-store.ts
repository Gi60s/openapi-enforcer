import chai from 'chai'
import { ExceptionStore } from '../src/Exception/ExceptionStore'
import { II18nMessageCode } from '../src/i18n/i18n'
import { EOL } from 'os'
import AssertionStatic = Chai.AssertionStatic
import { IExceptionLevel } from '../src/Exception/IException'

chai.use(function (_chai, utils) {
  const Assertion = chai.Assertion

  Assertion.addMethod('exceptionError', function () {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasType(this, 'error')
  })

  Assertion.addMethod('exceptionWarning', function () {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasType(this, 'error')
  })

  Assertion.addMethod('exceptionInfo', function () {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasType(this, 'error')
  })

  Assertion.addMethod('exceptionIgnored', function () {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasType(this, 'error')
  })

  Assertion.addMethod('exceptionErrorCode', function (code: II18nMessageCode, exclusive: boolean = true) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasCodes(this, code, 'error', exclusive)
  })

  Assertion.addMethod('exceptionWarningCode', function (code: II18nMessageCode, exclusive: boolean = true) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasCodes(this, code, 'warn', exclusive)
  })

  Assertion.addMethod('exceptionInfoCode', function (code: II18nMessageCode, exclusive: boolean = true) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasCodes(this, code, 'info', exclusive)
  })

  Assertion.addMethod('exceptionIgnoredCode', function (code: II18nMessageCode, exclusive: boolean = true) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasCodes(this, code, 'ignore', exclusive)
  })

  Assertion.addMethod('exceptionErrorId', function (id: string, metadata?: Record<string, any>) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasErrorId(this, 'error', id, metadata)
  })

  Assertion.addMethod('exceptionWarningId', function (id: string, metadata?: Record<string, any>) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasErrorId(this, 'warn', id, metadata)
  })

  Assertion.addMethod('exceptionInfoId', function (id: string, metadata?: Record<string, any>) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasErrorId(this, 'info', id, metadata)
  })

  Assertion.addMethod('exceptionIgnoredId', function (id: string, metadata?: Record<string, any>) {
    new Assertion(this._obj).to.be.instanceof(ExceptionStore)
    assertHasErrorId(this, 'ignore', id, metadata)
  })
})

function assertHasCodes (context: AssertionStatic, code: II18nMessageCode, level: IExceptionLevel, exclusive: boolean): void {
  const obj = context._obj as ExceptionStore

  const codes: II18nMessageCode[] = []
  const otherCodes: II18nMessageCode[] = []
  let codeCount = 0
  obj.exceptions.forEach(ex => {
    if (ex.level === level) {
      if (!codes.includes(ex.code)) codes.push(ex.code)
      if (ex.code === code) {
        codeCount++
      } else if (!otherCodes.includes(ex.code)) {
        otherCodes.push(ex.code)
      }
    }
  })
  codes.sort()
  otherCodes.sort()

  // code not found assertion
  if (codeCount === 0) {
    const message = codes.length > 0
      ? codesToMessage(codes) + '.' + EOL + (obj.error?.toString() ?? '')
      : ''
    context.assert(
      false,
      `expected #{this} to have error code '${code}'` + (codes.length > 0 ? ` but only has ${message}.` : '.'),
      `expected #{this} not to have error code '${code}'.`,
      [code],
      codes
    )
  }

  if (exclusive) {
    let report = obj.error
    if (level === 'warn') report = obj.warning
    if (level === 'info') report = obj.info
    if (level === 'ignore') report = obj.ignored

    // other codes found assertion
    if (otherCodes.length > 0) {
      const message = codesToMessage(otherCodes) + '.' + EOL + (report?.toString() ?? '')
      context.assert(
        false,
        `expected #{this} to only have error code '${code}' but also has ${message}`,
        'expected #{this} to not only have error code #{exp}',
        [code],
        codes
      )
    } else if (codeCount > 1) {
      context.assert(
        false,
        `expected #{this} to only have one instance of error code '${code}' but it has ${codeCount} instances.` + EOL + (report?.toString() ?? ''),
        'expected #{this} to not only have error code #{exp}',
        [code],
        codes
      )
    }
  }
}

function assertHasErrorId (context: AssertionStatic, level: IExceptionLevel, id: string, metadata?: Record<string, any>): void {
  const es = context._obj as ExceptionStore
  const match = es.exceptions.find(ex => {
    if (ex.level !== level) return false
    if (ex.id !== id) return false
    if (metadata !== undefined) {
      const m = ex.metadata
      const keys = Object.keys(metadata)
      const length = keys.length
      for (let i = 0; i < length; i++) {
        const key = keys[i]
        if (m[key] !== metadata[key]) return false
      }
    }
    return true
  })

  if (match === undefined) {
    if (metadata === undefined) {
      context.assert(
        false,
        `expected #{this} to have an exception with id matching '${id}'.`,
        `expected #{this} not to have an exception with id matching '${id}'`,
        [id]
      )
    } else {
      context.assert(
        false,
        `expected #{this} to have an exception with id matching '${id}' and metadata matching ${JSON.stringify(metadata)}.`,
        `expected #{this} not to have an exception with id matching '${id}' and metadata matching ${JSON.stringify(metadata)}.`,
        [id, metadata]
      )
    }
  }
}

function assertHasType (context: AssertionStatic, level: IExceptionLevel): void {
  const obj = context._obj as ExceptionStore

  context.assert(
    obj.exceptions.find(ex => ex.level === level) !== undefined,
    'expected #{this} to have an error.',
    'expected #{this} not to have an error.',
    [],
    obj.exceptions.filter(ex => ex.level === level)
  )
}

function codesToMessage (codes: string[]): string {
  const lastCode = codes.pop() ?? ''
  return codes.length > 0
    ? "'" + codes.join(', ') + "', and '" + lastCode + "'"
    : "'" + lastCode + "'"
}
