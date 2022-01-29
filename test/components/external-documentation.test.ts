import { ExternalDocumentation } from '../../src/v2'
import { expect } from 'chai'

describe('Component: ExternalDocumentation', () => {
  describe('build', () => {
    it('can build', () => {
      const component = new ExternalDocumentation({ url: '' })
      expect(component).to.be.instanceof(ExternalDocumentation)
    })
  })

  describe('validate', () => {
    it('has required properties', function () {
      // @ts-expect-error
      const [error] = ExternalDocumentation.validate({})
      expect(error).to.match(/Missing required property: "url"/)
    })

    it('allows extensions', () => {
      const [, warn] = ExternalDocumentation.validate({ url: 'https://fake.com', 'x-foo': 'foo' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = ExternalDocumentation.validate({
        url: '',
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: description', function () {
      it('can be a string', function () {
        const [error] = ExternalDocumentation.validate({ url: 'https://fake.com', description: 'Bob' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = ExternalDocumentation.validate({
          url: 'https://fake.com',
          // @ts-expect-error
          description: 12
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: url', function () {
      it('can be a string', function () {
        const [error] = ExternalDocumentation.validate({ url: 'https://fake.com' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = ExternalDocumentation.validate({
          // @ts-expect-error
          url: 12
        })
        expect(error).to.match(/Expected a string/)
      })

      it('will warn if not a url', function () {
        const [error] = ExternalDocumentation.validate({ url: 'not a url' })
        expect(error).to.match(/Value does not appear to be a valid URL/)
      })
    })
  })
})
