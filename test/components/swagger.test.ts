import { Swagger } from '../../src/components/Swagger'
import { initTestLoader, registerContent } from '../util/helpers'
import { expect } from 'chai'
import { server } from '../util/helpers'

before(async () => {
  await server.start()
})
after(() => {
  server.stop()
})

const swagger = '2.0'
const info = { title: '', version: '' }
const paths = {}

describe('Swagger component', () => {
  describe('build', () => {
    it('can build', function () {
      // @ts-expect-error
      const component = new Swagger({})
      expect(component).to.be.instanceOf(Swagger)
    })
  })

  describe('load', () => {
    before(() => {
      initTestLoader()
      registerContent('swagger.json', { swagger: '2.4', info: {} })
    })

    it('can load a document without validating', async () => {
      const [loaded] = await Swagger.load('swagger.json', { validate: false })
      expect(loaded.swagger).to.equal('2.4')
    })

    it('will validate a loaded document by default', async () => {
      const { error } = await Swagger.load('swagger.json')
      expect(error).to.match(/One or more errors found while validating Swagger object/)
      expect(error?.count).to.equal(3)
    })
  })

  describe('validate', () => {
    it('requires properties: swagger, info, and paths', function () {
      // @ts-expect-error
      const [error] = Swagger.validate({})
      expect(error).to.match(/Missing required properties: info, paths, swagger/)
    })

    it('allows extensions', () => {
      const exception = Swagger.validate({ swagger, info, paths, 'x-foo': 'foo' })
      const { warning } = exception
      expect(warning?.count).to.equal(1)
      expect(warning?.messageDetails[0].data.code).not.to.equal('DVOEXT')
    })

    it('cannot have invalid properties', function () {
      const [error] = Swagger.validate({ swagger, info, paths, foo: 'invalid' })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: swagger', () => {
      it('is required', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ info, paths })
        expect(error).to.match(/Missing required property: swagger/)
      })

      it('swagger can equal "2.0"', function () {
        const [error] = Swagger.validate({ swagger, info, paths })
        expect(error).to.equal(undefined)
      })

      it('swagger must equal "2.0"', function () {
        const [error] = Swagger.validate({
          // @ts-expect-error
          swagger: '2.0.0',
          info,
          paths
        })
        expect(error).to.match(/Value must equal: "2.0"/)
      })
    })

    describe('property: info', () => {
      it('is required', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, paths })
        expect(error).to.match(/Missing required property: info/)
      })

      it('can be a valid info object', function () {
        const [error] = Swagger.validate({ swagger, info, paths })
        expect(error).to.equal(undefined)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const exception = Swagger.validate({ swagger, info: { $ref: '' }, paths })
        const { warning } = exception
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[0].data.code).to.equal('DVCREF')
      })
    })

    describe('property: host', () => {
      it('it can be a string', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'foo.com' })
        expect(error).to.equal(undefined)
      })

      it('it can include the port', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'foo.com:4000' })
        expect(error).to.equal(undefined)
      })

      it('it must be a string', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, host: 5 })
        expect(error).to.match(/Expected a string/)
      })

      it('it must not include http', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'http://foo.com' })
        expect(error).to.match(/The host must not include the scheme: http/)
      })

      it('it must not include https', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'https://foo.com' })
        expect(error).to.match(/The host must not include the scheme: https/)
      })

      it('it must not include ws', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'ws://foo.com' })
        expect(error).to.match(/The host must not include the scheme: ws/)
      })

      it('it must not include wss', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'wss://foo.com' })
        expect(error).to.match(/The host must not include the scheme: wss/)
      })

      it('it must not include a subpath', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'foo.com/bar' })
        expect(error).to.match(/The host must not include sub path: \/bar/)
      })

      it('it must not include path templating', function () {
        const [error] = Swagger.validate({ swagger, info, paths, host: 'foo{bar}.com' })
        expect(error).to.match(/The host does not support path templating/)
      })
    })

    describe('property: basePath', () => {
      it('can be a string', function () {
        const [error] = Swagger.validate({ swagger, info, paths, basePath: '/bar/baz' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, basePath: 5 })
        expect(error).to.match(/Expected a string/)
      })

      it('must start with a forward slash', function () {
        const [error] = Swagger.validate({ swagger, info, paths, basePath: 'bar' })
        expect(error).to.match(/The base path must start with a forward slash: bar/)
      })

      it('it must not include path templating', function () {
        const [error] = Swagger.validate({ swagger, info, paths, basePath: '/{bar}' })
        expect(error).to.match(/The base path does not support path templating/)
      })
    })

    describe('property: schemes', () => {
      it('can be [http]', function () {
        const [error] = Swagger.validate({ swagger, info, paths, schemes: ['http'] })
        expect(error).to.equal(undefined)
      })

      it('can be [https]', function () {
        const [error] = Swagger.validate({ swagger, info, paths, schemes: ['https'] })
        expect(error).to.equal(undefined)
      })

      it('can be [ws]', function () {
        const [error] = Swagger.validate({ swagger, info, paths, schemes: ['ws'] })
        expect(error).to.equal(undefined)
      })

      it('can be [wss]', function () {
        const [error] = Swagger.validate({ swagger, info, paths, schemes: ['wss'] })
        expect(error).to.equal(undefined)
      })

      it('can be [http, https, ws, wss]', function () {
        const [error] = Swagger.validate({ swagger, info, paths, schemes: ['http', 'https', 'ws', 'wss'] })
        expect(error).to.equal(undefined)
      })

      it('cannot be another string within the array', function () {
        const [error] = Swagger.validate({ swagger, info, paths, schemes: ['foo'] })
        expect(error).to.match(/Value must be one of: "http", "https", "ws", "wss"/)
      })

      it('must be an array', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, schemes: 'https' })
        expect(error).to.match(/Expected an array/)
      })
    })

    describe('property: consumes', () => {
      it('can be an array of strings', () => {
        const [error] = Swagger.validate({ swagger, info, paths, consumes: ['application/json'] })
        expect(error).to.equal(undefined)
      })

      it('must be an array', () => {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, consumes: 'application/json' })
        expect(error).to.match(/Expected an array/)
      })

      it('must be an array of strings', () => {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, consumes: [5] })
        expect(error).to.match(/Expected a string/)
      })

      it('will warn for potentially invalid mime types', () => {
        // two valid, two invalid
        const { warning } = Swagger.validate({ swagger, info, paths, consumes: ['application/json', 'foo/bar', 'text/plain', 'cow/bell'] })
        expect(warning?.count).to.equal(3)
        expect(warning?.messageDetails.filter(item => item.data.code === 'MEDTYP').length).to.equal(2)
      })
    })

    describe('property: produces', () => {
      it('can be an array of strings', () => {
        const [error] = Swagger.validate({ swagger, info, paths, produces: ['application/json'] })
        expect(error).to.equal(undefined)
      })

      it('must be an array', () => {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, produces: 'application/json' })
        expect(error).to.match(/Expected an array/)
      })

      it('must be an array of strings', () => {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, produces: [5] })
        expect(error).to.match(/Expected a string/)
      })

      it('will warn for potentially invalid mime types', () => {
        // two valid, two invalid
        const { warning } = Swagger.validate({ swagger, info, paths, produces: ['application/json', 'foo/bar', 'text/plain', 'cow/bell'] })
        expect(warning?.count).to.equal(3)
        expect(warning?.messageDetails.filter(item => item.data.code === 'MEDTYP').length).to.equal(2)
      })
    })

    describe('property: paths', () => {
      it('is required', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info })
        expect(error).to.match(/Missing required property: paths/)
      })

      it('can be an object', function () {
        const [error] = Swagger.validate({ swagger, info, paths })
        expect(error).to.equal(undefined)
      })

      it('must be an object', function () {
        const [error] = Swagger.validate({ swagger, info, paths: [] })
        expect(error).to.match(/Expected a non-null object/)
      })

      it('will warn if no paths are defined', () => {
        const { warning } = Swagger.validate({ swagger, info, paths })
        expect(warning?.count).to.equal(1)
        expect(warning?.messageDetails[0].data.code).to.equal('PTHSND')
      })

      it('will warn if $ref is used', () => {
        const { warning } = Swagger.validate({ swagger, info, paths: { $ref: '' } })
        expect(warning?.count).to.equal(1)
        expect(warning?.messageDetails[0].data.code).to.equal('DVCREF')
      })
    })

    describe('property: definitions', () => {
      it('can be an object', function () {
        const [error] = Swagger.validate({ swagger, info, paths, definitions: {} })
        expect(error).to.equal(undefined)
      })

      it('must be an object', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, definitions: [] })
        expect(error).to.match(/Expected a non-null object/)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const { warning } = Swagger.validate({ swagger, info, paths, definitions: { $ref: '' } })
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[0].data.code).to.equal('DVCREF')
      })
    })

    describe('property: parameters', () => {
      it('can be an object', function () {
        const [error] = Swagger.validate({ swagger, info, paths, parameters: {} })
        expect(error).to.equal(undefined)
      })

      it('must be an object', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, parameters: [] })
        expect(error).to.match(/Expected a non-null object/)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const { warning } = Swagger.validate({ swagger, info, paths, parameters: { $ref: '' } })
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[0].data.code).to.equal('DVCREF')
      })
    })

    describe('property: responses', () => {
      it('can be an object', function () {
        const [error] = Swagger.validate({ swagger, info, paths, responses: {} })
        expect(error).to.equal(undefined)
      })

      it('must be an object', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, responses: [] })
        expect(error).to.match(/Expected a non-null object/)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const { warning } = Swagger.validate({ swagger, info, paths, responses: { $ref: '' } })
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[1].data.code).to.equal('DVCREF')
      })
    })

    describe('property: securityDefinitions', () => {
      it('can be an object', function () {
        const [error] = Swagger.validate({ swagger, info, paths, securityDefinitions: {} })
        expect(error).to.equal(undefined)
      })

      it('must be an object', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, securityDefinitions: [] })
        expect(error).to.match(/Expected a non-null object/)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const { warning } = Swagger.validate({ swagger, info, paths, securityDefinitions: { $ref: '' } })
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[1].data.code).to.equal('DVCREF')
      })
    })

    describe('property: security', () => {
      it('can be an array', function () {
        const [error] = Swagger.validate({ swagger, info, paths, security: [] })
        expect(error).to.equal(undefined)
      })

      it('must be an array', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, security: {} })
        expect(error).to.match(/Expected an array/)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const { warning } = Swagger.validate({ swagger, info, paths, security: { $ref: '' } })
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[1].data.code).to.equal('DVCREF')
      })
    })

    describe('property: tags', () => {
      it('can be an array', function () {
        const [error] = Swagger.validate({ swagger, info, paths, tags: [] })
        expect(error).to.equal(undefined)
      })

      it('must be an array', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, tags: {} })
        expect(error).to.match(/Expected an array/)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const { warning } = Swagger.validate({ swagger, info, paths, tags: { $ref: '' } })
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[1].data.code).to.equal('DVCREF')
      })
    })

    describe('property: externalDocs', () => {
      it('can be an object', function () {
        const [error] = Swagger.validate({ swagger, info, paths, externalDocs: { url: '' } })
        expect(error).to.equal(undefined)
      })

      it('must be an object', function () {
        // @ts-expect-error
        const [error] = Swagger.validate({ swagger, info, paths, externalDocs: [] })
        expect(error).to.match(/Expected a non-null object/)
      })

      it('will warn if $ref is used', () => {
        // @ts-expect-error
        const { warning } = Swagger.validate({ swagger, info, paths, externalDocs: { $ref: '' } })
        expect(warning?.count).to.equal(2)
        expect(warning?.messageDetails[0].data.code).to.equal('DVCREF')
      })
    })
  })
})
