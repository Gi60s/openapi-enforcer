import { License } from '../../src/v2'
import { expect } from 'chai'

describe('Component: License', () => {
  describe('build', () => {
    it('can build', () => {
      const license = new License({ name: 'Apache-2.0' })
      expect(license).to.be.instanceOf(License)
    })
  })

  describe('validate', () => {
    it('has required properties', function () {
      // @ts-expect-error
      const [error] = License.validate({})
      expect(error).to.match(/Missing required property: "name"/)
    })

    it('allows extensions', () => {
      const [, warn] = License.validate({ 'x-foo': 'foo', name: '' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = License.validate({
        // @ts-expect-error
        foo: 'invalid',
        name: ''
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: name', () => {
      it('can be a string', () => {
        const [error] = License.validate({ name: '' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', () => {
        // @ts-expect-error
        const [error] = License.validate({ name: 5 })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: url', () => {
      it('can be a string', () => {
        const [error] = License.validate({ name: '', url: 'https://fake.com' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', () => {
        // @ts-expect-error
        const [error] = License.validate({ name: '', url: 5 })
        expect(error).to.match(/Expected a string/)
      })

      it('must be formatted as a valid url', () => {
        const [error] = License.validate(({ name: '', url: '' }))
        expect(error).to.match(/Value does not appear to be a valid URL/)
      })
    })
  })
})
