import { Link, OpenAPI } from '../../src/v3'
import { expect } from 'chai'
import { ExceptionLevel as Level } from '../../src'

const xEnforcer: { exceptions: Record<string, Level>} = {
  exceptions: {
    'OAE-DLIOINF': 'ignore'
  }
}

describe('Component: Link', () => {
  describe('build', () => {
    it('can build', () => {
      const link = new Link({})
      expect(link).to.be.instanceOf(Link)
    })
  })

  describe('validate', () => {
    it('has required properties', function () {
      const [error] = Link.validate({})
      expect(error).to.match(/A link object must include either the "operationId" or the "operationRef" property./)
    })

    it('allows extensions', () => {
      const [, warn] = Link.validate({ 'x-foo': 'foo', operationId: '' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = Link.validate({
        // @ts-expect-error
        foo: 'invalid',
        operationId: ''
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: operationRef', () => {
      it('can be a URL string', () => {
        const [error] = Link.validate({ operationRef: 'https://fake.com' })
        expect(error).to.equal(undefined)
      })

      it('can be a local reference', () => {
        const [error] = Link.validate({ operationRef: '#/paths/~1home/get', 'x-enforcer': { exceptions: { 'OAE-DLIOINF': 'ignore' } } })
        expect(error).to.equal(undefined)
      })

      it('must be a string', () => {
        // @ts-expect-error
        const [error] = Link.validate({ operationRef: 5 })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: operationId', () => {
      it('can be a string', () => {
        const [error] = Link.validate({ operationId: '', 'x-enforcer': xEnforcer })
        expect(error).to.equal(undefined)
      })

      it('must be a string', () => {
        // @ts-expect-error
        const [error] = Link.validate({ operationId: 5 })
        expect(error).to.match(/Expected a string/)
      })

      it('must have an associated operation with the same operationId', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: { title: '', version: '' },
          paths: {
            '/': {
              get: {
                responses: {
                  200: { description: 'ok' }
                }
              }
            }
          },
          components: {
            links: {
              LinkA: { operationId: 'missing' }
            }
          }
        })
        expect(error).to.match(/The operation object associated with the operationId .+ could not be found/)
      })
    })

    describe('property: parameters', () => {
      it('can be a map of any values', () => {
        const [error] = Link.validate({
          'x-enforcer': xEnforcer,
          operationId: '',
          parameters: {
            a: 'a',
            b: 5
          }
        })
        expect(error).to.equal(undefined)
      })

      it('must be a map', () => {
        const [error] = Link.validate({
          'x-enforcer': xEnforcer,
          operationId: '',
          // @ts-expect-error
          parameters: 5
        })
        expect(error).to.match(/Expected a non-null object/)
      })
    })

    describe('property: requestBody', () => {
      it('can be any value', () => {
        const [error] = Link.validate({
          'x-enforcer': xEnforcer,
          operationId: '',
          requestBody: true
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: description', () => {
      it('can be a string', () => {
        const [error] = Link.validate({
          'x-enforcer': xEnforcer,
          operationId: '',
          description: ''
        })
        expect(error).to.equal(undefined)
      })

      it('must be a string', () => {
        const [error] = Link.validate({
          'x-enforcer': xEnforcer,
          operationId: '',
          // @ts-expect-error
          description: 5
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: server', () => {
      it('can be a server object', () => {
        const [error] = Link.validate({
          'x-enforcer': xEnforcer,
          operationId: '',
          server: { url: 'https://fake.com' }
        })
        expect(error).to.equal(undefined)
      })

      it('must be a server object', () => {
        const [error] = Link.validate({
          'x-enforcer': xEnforcer,
          operationId: '',
          // @ts-expect-error
          server: {}
        })
        expect(error).to.match(/Missing required property: "url"/)
      })
    })
  })
})
