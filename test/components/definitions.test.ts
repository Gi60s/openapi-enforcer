import { Definitions } from '../../src/v2'
import { expect } from 'chai'
import { minimal } from '../../test-copy/helpers'

describe('Definitions component', () => {
  describe('build', () => {
    it('can build', function () {
      const definitions = new Definitions({})
      expect(definitions).to.be.instanceOf(Definitions)
    })
  })

  describe('validate', () => {
    it('has no required properties', function () {
      const [error] = Definitions.validate({})
      expect(error).to.equal(undefined)
    })

    it('does not allow extensions', () => {
      // @ts-expect-error
      const [, warn] = Definitions.validate({ 'x-foo': 'foo' })
      expect(warn).to.match(/Schema extensions not allowed here/)
    })

    it('cannot have invalid properties', function () {
      const [error] = Definitions.validate({
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Expected a non-null object/)
    })

    it('can define schemas as properties', () => {
      const [error] = Definitions.validate({
        foo: minimal('Schema')
      })
      expect(error).to.equal(undefined)
    })
  })
})
