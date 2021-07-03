import Adapter from '../src/adapter'
import { expect } from 'chai'
import { Exception } from '../src'
import { Level } from '../src/Exception/types'

const { eol } = Adapter()

describe('Exception', () => {
  describe('report formatting', () => {
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
})

class X {
  private readonly exception: Exception
  private readonly parent: X | null

  constructor (exception?: Exception, parent?: X) {
    this.exception = exception ?? new Exception('Header')
    this.parent = parent ?? null
  }

  get report (): string[] {
    return this.exception.error?.toString().split(eol) ?? []
  }

  add (message: string, level: Level = 'error'): X {
    this.exception.message({
      level,
      code: 'code',
      message,
      metadata: {},
      reference: ''
    })
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
    expect(report.length).to.equal(expected.length)
    expected.forEach((message: string, index: number) => {
      expect(report[index]).to.equal(message)
    })
  }
}
