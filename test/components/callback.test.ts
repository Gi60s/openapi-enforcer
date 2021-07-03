import { Callback } from '../../src'
import { expect } from 'chai'
import { minimal } from '../util/helpers'

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

    it('can have a valid path item definition', function () {
      const [error] = Callback.validate({
        foo: minimal('PathItem', '3.x')
      })
      expect(error).to.equal(undefined)
    })

    it('cannot have a $ref', function () {
      const { warning } = Callback.validate({
        // @ts-expect-error
        foo: { $ref: '' }
      })
      expect(warning).to.match(/Reference not allowed here/)
    })
  })
})
