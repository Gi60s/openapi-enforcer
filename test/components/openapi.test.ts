import { OpenAPI } from '../../src/v3'
import { minimal } from '../helpers'
import { expect } from 'chai'

describe('OpenAPI component', function () {
  describe('build', () => {
    it('can build', () => {
      const openapi = new OpenAPI({
        openapi: '3.0.0',
        info: minimal('Info', '3.x'),
        paths: {}
      })
      expect(openapi).to.be.instanceof(OpenAPI)
    })

    it('will default servers array to object with url', () => {
      const openapi = new OpenAPI({
        openapi: '3.0.0',
        info: minimal('Info', '3.x'),
        paths: {}
      })
      expect(openapi.servers).to.be.an('array')
      expect(openapi.servers[0]?.url).to.equal('/')
    })

    describe('getOperation', () => {
      it.skip('todo', () => {
        throw Error('to do')
      })
    })

    describe('getOperationById', () => {
      it.skip('todo', () => {
        throw Error('to do')
      })
    })

    describe('makeRequest', () => {
      it.skip('todo', () => {
        throw Error('to do')
      })
    })
  })

  describe('load', () => {
    it.skip('todo', () => {
      throw Error('to do')
    })
  })

  describe('validate', () => {
    it('has required properties', function () {
      // @ts-expect-error
      const [error] = OpenAPI.validate({})
      expect(error).to.match(/Missing required properties: "info", "openapi", "paths"/)
    })

    it('allows extensions', () => {
      const [, warn] = OpenAPI.validate({
        'x-foo': 'foo',
        openapi: '3.0.3',
        info: minimal('Info', '3.x'),
        paths: {}
      })
      expect(warn?.hasCode('OAE-DEXNOAL')).to.equal(false)
    })

    it('cannot have invalid properties', function () {
      const [error] = OpenAPI.validate({
        // @ts-expect-error
        foo: 'invalid',
        openapi: '3.0.3',
        info: minimal('Info', '3.x'),
        paths: {}
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: openapi', () => {
      it('can be a valid semantic version number', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {}
        })
        expect(error).to.equal(undefined)
      })

      it('must be a valid semantic version number', () => {
        const [error] = OpenAPI.validate({
          // @ts-expect-error
          openapi: '1.0.0',
          info: minimal('Info', '3.x'),
          paths: {}
        })
        expect(error).to.match(/OpenAPI specification version not supported/)
      })

      it('must be a string', () => {
        const [error] = OpenAPI.validate({
          // @ts-expect-error
          openapi: 3,
          info: minimal('Info', '3.x'),
          paths: {}
        })
        expect(error).to.match(/Value must be a semantic version number/)
      })
    })

    describe('property: info', () => {
      it('can be a valid info object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {}
        })
        expect(error).to.equal(undefined)
      })

      it('must be a valid info object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          // @ts-expect-error
          info: 5,
          paths: {}
        })
        expect(error).to.match(/Expected an Info object definition/)
      })
    })

    describe('property: servers', () => {
      it('can be an empty array', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          servers: []
        })
        expect(error).to.equal(undefined)
      })

      it('can be an array of valid server objects', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          servers: [minimal('Server', '3.x')]
        })
        expect(error).to.equal(undefined)
      })

      it('must be an array of valid server objects', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          // @ts-expect-error
          servers: [5]
        })
        expect(error).to.match(/Expected a Server object definition/)
      })
    })

    describe('property: paths', () => {
      it('can be a valid paths object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {}
        })
        expect(error).to.equal(undefined)
      })

      it('must be a valid paths object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          // @ts-expect-error
          paths: 5
        })
        expect(error).to.match(/Expected a Paths object definition/)
      })
    })

    describe('property: components', () => {
      it('can be a valid components object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          components: {}
        })
        expect(error).to.equal(undefined)
      })

      it('must be a valid components object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          // @ts-expect-error
          components: 5
        })
        expect(error).to.match(/Expected a Components object definition/)
      })
    })

    describe('property: security', () => {
      it('can be an empty array', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          security: []
        })
        expect(error).to.equal(undefined)
      })

      it('can be an array of valid security requirement objects', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          security: [{ name: [] }],
          components: {
            securitySchemes: {
              name: minimal('SecurityScheme', '3.x')
            }
          }
        })
        expect(error).to.equal(undefined)
      })

      it('can contain an empty security requirement object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          security: [{}]
        })
        expect(error).to.equal(undefined)
      })

      it('must be an array of valid security requirement objects', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          // @ts-expect-error
          security: [5]
        })
        expect(error).to.match(/Expected a SecurityRequirement object definition/)
      })
    })

    describe('property: tags', () => {
      it('can be an empty array', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          tags: []
        })
        expect(error).to.equal(undefined)
      })

      it('can be an array of valid tag objects', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          tags: [minimal('Tag', '3.x')]
        })
        expect(error).to.equal(undefined)
      })

      it('must be an array of valid tag objects', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          // @ts-expect-error
          tags: [5]
        })
        expect(error).to.match(/Expected a Tag object definition/)
      })
    })

    describe('property: externalDocs', () => {
      it('can be a valid external documentation object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          externalDocs: { url: 'http://fake.com' }
        })
        expect(error).to.equal(undefined)
      })

      it('must be a valid external documentation object', () => {
        const [error] = OpenAPI.validate({
          openapi: '3.0.3',
          info: minimal('Info', '3.x'),
          paths: {},
          // @ts-expect-error
          externalDocs: 5
        })
        expect(error).to.match(/Expected an ExternalDocumentation object definition/)
      })
    })
  })
})
