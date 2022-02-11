import { Info } from '../../src/v2'
import { expect } from 'chai'

describe('Component: Info', () => {
  describe('build', () => {
    it('can build', function () {
      const info = new Info({ title: '', version: '' })
      expect(info).to.be.instanceOf(Info)
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

    describe('property: description', function () {
      it('can be a string', function () {
        const [error] = Info.validate({ title: '', version: '', description: '' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = Info.validate({
          title: '',
          version: '',
          // @ts-expect-error
          description: true
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: termsOfService', function () {
      it('can be a url', function () {
        const [error] = Info.validate({ title: '', version: '', termsOfService: 'https://terms.foo.com' })
        expect(error).to.equal(undefined)
      })

      it('will warn if it does not look like a URL', function () {
        const [error] = Info.validate({ title: '', version: '', termsOfService: 'terms.foo.com' })
        expect(error).to.match(/Value does not appear to be a valid URL/)
      })

      it('must be a string', function () {
        const [error] = Info.validate({
          title: '',
          version: '',
          // @ts-expect-error
          description: true
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: contact', function () {
      it('can be a contact object', function () {
        const [error] = Info.validate({ title: '', version: '', contact: { email: '' } })
        expect(error).to.equal(undefined)
      })

      it('must be a contact object', function () {
        const [error] = Info.validate({
          title: '',
          version: '',
          // @ts-expect-error
          contact: true
        })
        expect(error).to.match(/Expected a Contact object definition/)
      })
    })

    describe('property: license', function () {
      it('can be a license object', function () {
        const [error] = Info.validate({ title: '', version: '', license: { name: '' } })
        expect(error).to.equal(undefined)
      })

      it('must be a license object', function () {
        const [error] = Info.validate({
          title: '',
          version: '',
          // @ts-expect-error
          license: true
        })
        expect(error).to.match(/Expected a License object definition/)
      })
    })

    describe('property: version', function () {
      it('can be a string', function () {
        const [error] = Info.validate({ title: '', version: '' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = Info.validate({
          title: '',
          // @ts-expect-error
          version: true
        })
        expect(error).to.match(/Expected a string/)
      })
    })
  })
})
