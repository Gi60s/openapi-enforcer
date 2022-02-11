import { adapter } from '../../src/utils/adapter'
import { expect } from 'chai'
import * as Config from '../../src/utils/config'
import { DefinitionException, ExceptionLevel as Level } from '../../src'

const { eol } = adapter

describe('Exception', () => {
  describe('code level modifiers', () => {
    // normally and example not matching the schema produces a warning
    it('can make an example not matching schema produce an error', () => {
      throw Error('TODO: Test level modify for example matching schema')
    })
  })

  describe('report formatting', () => {
    describe('details: none', () => {
      before(() => {
        Config.set({
          exceptions: {
            details: 'none',
            message: 'text'
          }
        })
      })

      it('only one child message', function () {
        new X()
          .add('First message')
          .test(['  First message'])
      })

      it('only two child messages', function () {
        new X()
          .add('First message')
          .add('Second message')
          .test([
            '  First message',
            '  Second message'
          ])
      })

      it('single at with one message', function () {
        new X()
          .at('a')
          .add('First message')
          .test([
            '  at: a',
            '    First message'
          ])
      })

      it('single at with two messages', function () {
        new X()
          .at('a')
          .add('First message')
          .add('Second message')
          .test([
            '  at: a',
            '    First message',
            '    Second message'
          ])
      })

      it('two ats with two messages', function () {
        new X()
          .at('a')
          .add('First message a')
          .add('Second message a')
          .up()
          .at('b')
          .add('First message b')
          .add('Second message b')
          .test([
            '  at: a',
            '    First message a',
            '    Second message a',
            '  at: b',
            '    First message b',
            '    Second message b'
          ])
      })

      it('double nested at with one message', function () {
        new X()
          .at('a')
          .at('b')
          .add('First message')
          .test([
            '  at: a > b',
            '    First message'
          ])
      })

      it('double nested single message with single nested warning', function () {
        new X()
          .at('a')
          .add('Warning message', 'warn')
          .at('b')
          .add('First message')
          .test([
            '  at: a > b',
            '    First message'
          ])
      })

      it('double nested single message with nested warning', function () {
        new X()
          .at('a')
          .add('Warning message', 'warn')
          .at('b')
          .add('Warning', 'warn')
          .add('First message')
          .test([
            '  at: a > b',
            '    First message'
          ])
      })

      it('double nested with two nested children one of which is a warning', function () {
        new X()
          .at('parameters').at('x')
          .at('foo').up()
          .at('name').add('name error').up()
          .at('in').add('in warning', 'warn').up()
          .up().up()
          .add('top error')
          .test([
            '  at: parameters > x > name',
            '    name error',
            '  top error'
          ])
      })

      it('double nested with two nested children', function () {
        new X()
          .at('parameters').at('x')
          .at('foo').up()
          .at('name').add('name error').up()
          .at('in').add('in error').up()
          .up().up()
          .add('top error')
          .test([
            '  at: parameters > x',
            '    at: name',
            '      name error',
            '    at: in',
            '      in error',
            '  top error'
          ])
      })

      it('child with no messages', function () {
        new X()
          .at('a').up()
          .at('b').add('First message').up()
          .test([
            '  at: b',
            '    First message'
          ])
      })

      it('complex 1', function () {
        new X()
          .at('a')
          .at('b')
          .add('First message b')
          .add('Second message b')
          .at('c')
          .at('d')
          .add('First message d')
          .up().up()
          .at('e')
          .add('First message e')
          .test([
            '  at: a > b',
            '    at: c > d',
            '      First message d',
            '    at: e',
            '      First message e',
            '    First message b',
            '    Second message b'
          ])
      })
    })

    describe('details: all', () => {
      before(() => {
        Config.set({
          exceptions: {
            details: 'all',
            message: 'text'
          }
        })
      })

      it('only one child message', function () {
        new X()
          .add('First message')
          .test([
            '  First message',
            '    breadcrumbs: /',
            '    code: CODE',
            '    locations:',
            '      my-file.txt:20:6',
            '    reference: REF'
          ])
      })

      it('only two child messages', function () {
        new X()
          .add('First message')
          .add('Second message')
          .test([
            '  First message',
            '    breadcrumbs: /',
            '    code: CODE',
            '    locations:',
            '      my-file.txt:20:6',
            '    reference: REF',
            '  Second message',
            '    breadcrumbs: /',
            '    code: CODE',
            '    locations:',
            '      my-file.txt:20:6',
            '    reference: REF'
          ])
      })

      it('single at with one message', function () {
        new X()
          .at('a')
          .add('First message')
          .test([
            '  at: a',
            '    First message',
            '      breadcrumbs: / > a',
            '      code: CODE',
            '      locations:',
            '        my-file.txt:20:6',
            '      reference: REF'
          ])
      })

      it('complex 1', function () {
        new X()
          .at('a')
          .at('b')
          .add('First message b')
          .add('Second message b')
          .at('c')
          .at('d')
          .add('First message d')
          .up().up()
          .at('e')
          .add('First message e')
          .test([
            '  at: a > b',
            '    at: c > d',
            '      First message d',
            '        breadcrumbs: / > a > b > c > d',
            '        code: CODE',
            '        locations:',
            '          my-file.txt:20:6',
            '        reference: REF',
            '    at: e',
            '      First message e',
            '        breadcrumbs: / > a > b > e',
            '        code: CODE',
            '        locations:',
            '          my-file.txt:20:6',
            '        reference: REF',
            '    First message b',
            '      breadcrumbs: / > a > b',
            '      code: CODE',
            '      locations:',
            '        my-file.txt:20:6',
            '      reference: REF',
            '    Second message b',
            '      breadcrumbs: / > a > b',
            '      code: CODE',
            '      locations:',
            '        my-file.txt:20:6',
            '      reference: REF'
          ])
      })
    })

    describe('details: breadcrumbs', () => {
      before(() => {
        Config.set({
          exceptions: {
            details: 'breadcrumbs',
            message: 'text'
          }
        })
      })

      it('only one child message', function () {
        new X()
          .add('First message')
          .test([
            '  First message',
            '    breadcrumbs: /'
          ])
      })

      it('only two child messages', function () {
        new X()
          .add('First message')
          .add('Second message')
          .test([
            '  First message',
            '    breadcrumbs: /',
            '  Second message',
            '    breadcrumbs: /'
          ])
      })

      it('single at with one message', function () {
        new X()
          .at('a')
          .add('First message')
          .test([
            '  at: a',
            '    First message',
            '      breadcrumbs: / > a'
          ])
      })

      it('complex 1', function () {
        new X()
          .at('a')
          .at('b')
          .add('First message b')
          .add('Second message b')
          .at('c')
          .at('d')
          .add('First message d')
          .up().up()
          .at('e')
          .add('First message e')
          .test([
            '  at: a > b',
            '    at: c > d',
            '      First message d',
            '        breadcrumbs: / > a > b > c > d',
            '    at: e',
            '      First message e',
            '        breadcrumbs: / > a > b > e',
            '    First message b',
            '      breadcrumbs: / > a > b',
            '    Second message b',
            '      breadcrumbs: / > a > b'
          ])
      })
    })

    describe('details: code', () => {
      before(() => {
        Config.set({
          exceptions: {
            details: 'code',
            message: 'text'
          }
        })
      })

      it('only one child message', function () {
        new X()
          .add('First message')
          .test(['  First message [CODE]'])
      })

      it('only two child messages', function () {
        new X()
          .add('First message')
          .add('Second message')
          .test([
            '  First message [CODE]',
            '  Second message [CODE]'
          ])
      })

      it('single at with one message', function () {
        new X()
          .at('a')
          .add('First message')
          .test([
            '  at: a',
            '    First message [CODE]'
          ])
      })
    })

    describe('details: locations', () => {
      before(() => {
        Config.set({
          exceptions: {
            details: 'locations',
            message: 'text'
          }
        })
      })

      it('only one child message', function () {
        new X()
          .add('First message')
          .test(['  First message (my-file.txt:20:6)'])
      })

      it('only two child messages', function () {
        new X()
          .add('First message')
          .add('Second message')
          .test([
            '  First message (my-file.txt:20:6)',
            '  Second message (my-file.txt:20:6)'
          ])
      })

      it('single at with one message', function () {
        new X()
          .at('a')
          .add('First message')
          .test([
            '  at: a',
            '    First message (my-file.txt:20:6)'
          ])
      })
    })
  })
})

class X {
  private readonly exception: DefinitionException
  private readonly parent: X | null

  constructor (exception?: DefinitionException, parent?: X) {
    this.exception = exception ?? new DefinitionException('Header')
    this.parent = parent ?? null
  }

  get report (): string[] {
    return this.exception.error?.toString().split(eol) ?? []
  }

  add (message: string, level: Level = 'error'): X {
    const data = this.exception.message({
      alternateLevels: [],
      code: 'CODE',
      definition: null,
      level,
      locations: [],
      message,
      metadata: {},
      reference: 'REF'
    })
    data.locations = [{ start: { line: 20, column: 6, offset: 65 }, end: { line: 20, column: 8, offset: 67 }, source: 'my-file.txt' }]
    return this
  }

  at (key: string): X {
    return new X(this.exception.at(key), this)
  }

  up (): X {
    if (this.parent === null) throw Error('Cannot go up. No parent')
    return this.parent
  }

  test (expected: string[]): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let top: X = this
    while (top.parent !== null) top = top.parent
    const report = top.report
    report.shift() // pull off the header
    // expect(report.length).to.equal(expected.length)
    // expected.forEach((message: string, index: number) => {
    //   expect(report[index]).to.equal(message)
    // })
    expect(report.join(eol)).to.equal(expected.join(eol))
  }
}
