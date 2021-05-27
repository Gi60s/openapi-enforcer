import { Contact } from '../components/Contact'
import { expect } from 'chai'
import { exceptionLevel } from '../test-utils'
import { Swagger } from '../components/Swagger'

describe('Contact component', () => {
  describe('build', () => {
    it('can build', function () {
      const contact = new Contact({})
      expect(contact).to.be.instanceOf(Contact)
    })
  })

  describe('validate', () => {
    it('has no required properties', function () {
      const error = Contact.validate({})
      expect(error.count).to.equal(0)
    })

    it('allows extensions', () => {
      exceptionLevel(['warn'], () => {
        const error = Contact.validate({ 'x-foo': 'foo' })
        expect(error).to.match(/No problems detected/)
      })
    })

    it('cannot have invalid properties', function () {
      const error = Contact.validate({
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: name', function () {
      it('can be a string', function () {
        const error = Contact.validate({ name: 'Bob' })
        expect(error).to.match(/No problems detected/)
      })

      it('must be a string', function () {
        const error = Contact.validate({
          // @ts-expect-error
          name: 12
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: url', function () {
      it('can be a valid url', function () {
        const error = Contact.validate({ url: 'http://foo.com' })
        expect(error).to.match(/No problems detected/)
      })

      it('will warn if an invalid url', function () {
        exceptionLevel(['error', 'warn'], () => {
          const error = Contact.validate({ url: 'not-url' })
          expect(error).to.match(/Value does not appear to be a valid URL/)
        })
      })

      it('must be a string', function () {
        const error = Contact.validate({
          // @ts-expect-error
          url: 12
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: email', function () {
      it('can be a valid email', function () {
        const error = Contact.validate({ email: 'email@fake.com' })
        expect(error).to.match(/No problems detected/)
      })

      it('will warn if an invalid url', function () {
        exceptionLevel(['error', 'warn'], () => {
          const error = Contact.validate({ email: 'not-email' })
          expect(error).to.match(/Value does not appear to be a valid email address/)
        })
      })

      it('must be a string', function () {
        const error = Contact.validate({
          // @ts-expect-error
          email: 12
        })
        expect(error).to.match(/Expected a string/)
      })
    })
  })
})
