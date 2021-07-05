import { Encoding, MediaType, Reference } from '../../src'
import { expect } from 'chai'

describe.only('Encoding component', () => {
  describe('build', () => {
    it('can build', () => {
      const encoding = new Encoding({})
      expect(encoding).to.be.instanceof(Encoding)
    })

    describe('property: contentType', () => {
      describe('defaults', () => {
        it.only('will default to application/octet stream for media type "string" with format "binary"', () => {
          const mediaType = new MediaType<Reference>({
            schema: {
              type: 'object',
              properties: {
                x: { type: 'string', format: 'binary' }
              }
            },
            encoding: {
              x: {}
            }
          })
          expect(mediaType.encoding?.x?.contentType).to.equal('application/octet-stream')
        })
      })
    })
  })

  describe('validate', () => {
    it('has no required properties', function () {
      const [error] = Encoding.validate({})
      expect(error).to.equal(undefined)
    })

    it('allows extensions', () => {
      const [, warn] = Encoding.validate({ 'x-foo': {} })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = Encoding.validate({
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed/)
    })

    describe('property: contentType', function () {
      it('can be a string', () => {
        const [error] = Encoding.validate({
          contentType: ''
        })
        expect(error).to.equal(undefined)
      })

      it('must be a string', () => {
        const [error] = Encoding.validate({
          // @ts-expect-error
          contentType: {}
        })
        expect(error).to.match(/Expected a string/)
      })
    })
  })
})
