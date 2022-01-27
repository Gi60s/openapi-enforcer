import { Info } from '../../src/v2'
import { expect } from 'chai'

describe('Component: Info', () => {
  describe('build', () => {
    it('can build', function () {
      const contact = new Info({ title: '', version: '' })
      expect(contact).to.be.instanceOf(Info)
    })
  })

  describe('validate', () => {
    it('has required properties', function () {
      // @ts-expect-error
      const [error] = Info.validate({})
      expect(error).to.match(/Missing required properties: "title", "version"/)
    })

    it('allows extensions', () => {
      const [, warn] = Info.validate({ 'x-foo': 'foo', title: '', version: '' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = Info.validate({
        // @ts-expect-error
        foo: 'invalid',
        title: '',
        version: ''
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: title', function () {
      it('can be a string', function () {
        const [error] = Info.validate({ title: 'Bob', version: '' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = Info.validate({
          // @ts-expect-error
          title: 12,
          version: ''
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    // describe('property: url', function () {
    //   it('can be a valid url', function () {
    //     const [error] = Contact.validate({ url: 'http://foo.com' })
    //     expect(error).to.equal(undefined)
    //   })

    //   it('will warn if an invalid url', function () {
    //     const [, warn] = Contact.validate({ url: 'not-url' })
    //     expect(warn).to.match(/Value does not appear to be a valid URL/)
    //   })

    //   it('must be a string', function () {
    //     const [error] = Contact.validate({
    //       // @ts-expect-error
    //       url: 12
    //     })
    //     expect(error).to.match(/Expected a string/)
    //   })
    // })

    // describe('property: email', function () {
    //   it('can be a valid email', function () {
    //     const [error] = Contact.validate({ email: 'email@fake.com' })
    //     expect(error).to.equal(undefined)
    //   })

    //   it('will warn if an invalid url', function () {
    //     const [, warn] = Contact.validate({ email: 'not-email' })
    //     expect(warn).to.match(/Value does not appear to be a valid email address/)
    //   })

    //   it('must be a string', function () {
    //     const [error] = Contact.validate({
    //       // @ts-expect-error
    //       email: 12
    //     })
    //     expect(error).to.match(/Expected a string/)
    //   })
    // })
  })
})
