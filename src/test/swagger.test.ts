import { Swagger } from '../components/Swagger'
import { exceptionLevel } from '../test-utils'
import { expect } from 'chai'

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

  describe('validate', () => {
    it('requires properties: swagger, info, and paths', function () {
      // @ts-expect-error
      const error = Swagger.validate({})
      expect(error).to.match(/Missing one or more required properties: info, paths, swagger/)
    })

    describe('property: swagger', () => {
      it('is required', function () {
        // @ts-expect-error
        const error = Swagger.validate({ info, paths })
        expect(error).to.match(/Missing one or more required properties: swagger/)
      })

      it('swagger can equal "2.0"', function () {
        const error = Swagger.validate({ swagger, info, paths })
        expect(error.count).to.equal(0)
      })

      it('swagger must equal "2.0"', function () {
        const error = Swagger.validate({
          // @ts-expect-error
          swagger: '2.0.0',
          info,
          paths
        })
        expect(error).to.match(/Value must equal: 2.0/)
      })
    })

    describe('property: info', () => {
      it('is required', function () {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, paths })
        expect(error).to.match(/Missing one or more required properties: info/)
      })

      it('can be a valid info object', function () {
        const error = Swagger.validate({ swagger, info, paths })
        expect(error.count).to.equal(0)
      })

      it('will warn if $ref is used', () => {
        exceptionLevel(['warn'], () => {
          // @ts-expect-error
          const error = Swagger.validate({ swagger, info: { $ref: '' }, paths })
          expect(error.count).to.equal(2)
          expect(error.messageDetails[0].data.code).to.equal('DVCREF')
        })
      })
    })

    describe('property: host', () => {
      it('it can be a string', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'foo.com' })
        expect(error.count).to.equal(0)
      })

      it('it can include the port', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'foo.com:4000' })
        expect(error.count).to.equal(0)
      })

      it('it must be a string', function () {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info, paths, host: 5 })
        expect(error).to.match(/Expected a string./)
      })

      it('it must not include http', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'http://foo.com' })
        expect(error).to.match(/The host must not include the scheme: http/)
      })

      it('it must not include https', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'https://foo.com' })
        expect(error).to.match(/The host must not include the scheme: https/)
      })

      it('it must not include ws', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'ws://foo.com' })
        expect(error).to.match(/The host must not include the scheme: ws/)
      })

      it('it must not include wss', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'wss://foo.com' })
        expect(error).to.match(/The host must not include the scheme: wss/)
      })

      it('it must not include a subpath', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'foo.com/bar' })
        expect(error).to.match(/The host must not include sub path: \/bar/)
      })

      it('it must not include path templating', function () {
        const error = Swagger.validate({ swagger, info, paths, host: 'foo{bar}.com' })
        expect(error).to.match(/The host does not support path templating/)
      })
    })

    describe('property: basePath', () => {
      it('can be a string', function () {
        const error = Swagger.validate({ swagger, info, paths, basePath: '/bar/baz' })
        expect(error.count).to.equal(0)
      })

      it('must be a string', function () {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info, paths, basePath: 5 })
        expect(error).to.match(/Expected a string/)
      })

      it('must start with a forward slash', function () {
        const error = Swagger.validate({ swagger, info, paths, basePath: 'bar' })
        expect(error).to.match(/The base path must start with a forward slash: bar/)
      })

      it('it must not include path templating', function () {
        const error = Swagger.validate({ swagger, info, paths, basePath: '/{bar}' })
        expect(error).to.match(/The base path does not support path templating/)
      })
    })

    describe('property: schemes', () => {
      it('can be [http]', function () {
        const error = Swagger.validate({ swagger, info, paths, schemes: ['http'] })
        expect(error.count).to.equal(0)
      })

      it('can be [https]', function () {
        const error = Swagger.validate({ swagger, info, paths, schemes: ['https'] })
        expect(error.count).to.equal(0)
      })

      it('can be [ws]', function () {
        const error = Swagger.validate({ swagger, info, paths, schemes: ['ws'] })
        expect(error.count).to.equal(0)
      })

      it('can be [wss]', function () {
        const error = Swagger.validate({ swagger, info, paths, schemes: ['wss'] })
        expect(error.count).to.equal(0)
      })

      it('can be [http, https, ws, wss]', function () {
        const error = Swagger.validate({ swagger, info, paths, schemes: ['http', 'https', 'ws', 'wss'] })
        expect(error.count).to.equal(0)
      })

      it('cannot be another string within the array', function () {
        const error = Swagger.validate({ swagger, info, paths, schemes: ['foo'] })
        expect(error).to.match(/Value must be one of: http, https, ws, wss/)
      })

      it('must be an array', function () {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info, paths, schemes: 'https' })
        expect(error).to.match(/Expected an array/)
      })
    })

    describe('property: consumes', () => {
      it('can be an array of strings', () => {
        const error = Swagger.validate({ swagger, info, paths, consumes: ['application/json'] })
        expect(error.count).to.equal(0)
      })

      it('must be an array', () => {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info, paths, consumes: 'application/json' })
        expect(error).to.match(/Expected an array/)
      })

      it('must be an array of strings', () => {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info, paths, consumes: [5] })
        expect(error).to.match(/Expected a string/)
      })

      it('will warn for potentially invalid mime types', () => {
        exceptionLevel(['warn'], () => {
          // two valid, two invalid
          const error = Swagger.validate({ swagger, info, paths, consumes: ['application/json', 'foo/bar', 'text/plain', 'cow/bell'] })
          expect(error.count).to.equal(3)
          expect(error.countDetails.warn).to.equal(3)
          expect(error.messageDetails.filter(item => item.data.code === 'MEDTYP').length).to.equal(2)
        })
      })
    })

    describe('property: produces', () => {
      it('can be an array of strings', () => {
        const error = Swagger.validate({ swagger, info, paths, produces: ['application/json'] })
        expect(error.count).to.equal(0)
      })

      it('must be an array', () => {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info, paths, produces: 'application/json' })
        expect(error).to.match(/Expected an array/)
      })

      it('must be an array of strings', () => {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info, paths, produces: [5] })
        expect(error).to.match(/Expected a string/)
      })

      it('will warn for potentially invalid mime types', () => {
        exceptionLevel(['warn'], () => {
          // two valid, two invalid
          const error = Swagger.validate({ swagger, info, paths, produces: ['application/json', 'foo/bar', 'text/plain', 'cow/bell'] })
          expect(error.count).to.equal(3)
          expect(error.countDetails.warn).to.equal(3)
          expect(error.messageDetails.filter(item => item.data.code === 'MEDTYP').length).to.equal(2)
        })
      })
    })

    describe('property: paths', () => {
      it('is required', function () {
        // @ts-expect-error
        const error = Swagger.validate({ swagger, info })
        expect(error).to.match(/Missing one or more required properties: paths/)
      })

      it('can be an object', function () {
        const error = Swagger.validate({ swagger, info, paths })
        expect(error.count).to.equal(0)
      })

      it('must be an object', function () {
        const error = Swagger.validate({ swagger, info, paths: [] })
        expect(error).to.match(/Expected an object/)
      })

      it('will warn if no paths are defined', () => {
        exceptionLevel(['warn'], () => {
          const error = Swagger.validate({ swagger, info, paths })
          expect(error.count).to.equal(1)
          expect(error.messageDetails[0].data.code).to.equal('PTHSND')
        })
      })

      it('will warn if $ref is used', () => {
        exceptionLevel(['warn'], () => {
          const error = Swagger.validate({ swagger, info, paths: { $ref: '' } })
          expect(error.count).to.equal(1)
          expect(error.messageDetails[0].data.code).to.equal('DVCREF')
        })
      })
    })
  })
})
