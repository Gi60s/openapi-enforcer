import { Callback } from '../../src'
import { expect } from 'chai'

describe('Callback component', () => {
  describe('build', () => {
    it('can build', () => {
      const callback = new Callback({})
      expect(callback).to.be.instanceof(Callback)
    })
  })

  describe('validate', () => {
    it('has no required properties', function () {
      const [error] = Callback.validate({})
      expect(error).to.equal(undefined)
    })

    it('allows extensions', () => {
      const [, warn] = Callback.validate({ 'x-foo': {} })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = Callback.validate({
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Expected a non-null object/)
    })
  })
})