import { Method, OpenAPI, OpenAPIDefinition, OperationDefinition, ParameterDefinition, PathItemDefinition } from '../../src/v3'
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
      describe('find path', () => {
        it('can find the correct path when there are two similar paths with different operations', () => {
          const openapi = new OpenAPI({
            openapi: '3.0.0',
            info: { title: '', version: '' },
            paths: {
              '/{x}': {
                get: {
                  parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
                  responses: { 200: { description: 'ok' }}
                }
              },
              '/{y}': {
                get: {
                  parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
                  responses: { 200: { description: 'ok' } }
                }
              }
            }
          })
          throw Error('to do: finish writing this test')
          throw Error('to do, make sure validators allow this')
        })
      })

      describe('path parameters', () => {
        it('can parse: simple false primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/5' })
          expect(value.params.foo).to.equal(5)
        })

        it('can parse: simple false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/3,4,5' })
          expect(value.params.foo).to.deep.equal([3,4,5])
        })

        it('can parse: simple false object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple',
              explode: false,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/age,25,name,Bob' })
          expect(value.params.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: simple true primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple',
              explode: true,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/5' })
          expect(value.params.foo).to.equal(5)
        })

        it('can parse: simple true array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple',
              explode: true,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/3,4,5' })
          expect(value.params.foo).to.deep.equal([3,4,5])
        })

        it('can parse: simple true object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple',
              explode: true,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/age=25,name=Bob' })
          expect(value.params.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: label false primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/.5' })
          expect(value.params.foo).to.equal(5)
        })

        it('can parse: label false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/.3,4,5' })
          expect(value.params.foo).to.deep.equal([3,4,5])
        })

        it('can parse: label false object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label',
              explode: false,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/.age,25,name,Bob' })
          expect(value.params.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: label true primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label',
              explode: true,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/.5' })
          expect(value.params.foo).to.equal(5)
        })

        it('can parse: label true array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label',
              explode: true,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/.3.4.5' })
          expect(value.params.foo).to.deep.equal([3,4,5])
        })

        it('can parse: label true object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label',
              explode: true,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/.age=25.name=Bob' })
          expect(value.params.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: matrix false primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/;foo=5' })
          expect(value.params.foo).to.equal(5)
        })

        it('can parse: matrix false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/;foo=3,4,5' })
          expect(value.params.foo).to.deep.equal([3,4,5])
        })

        it('can parse: matrix false object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix',
              explode: false,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/;foo=age,25,name,Bob' })
          expect(value.params.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: matrix true primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix',
              explode: true,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/;foo=5' })
          expect(value.params.foo).to.equal(5)
        })

        it('can parse: matrix true array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix',
              explode: true,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/;foo=3;foo=4;foo=5' })
          expect(value.params.foo).to.deep.equal([3,4,5])
        })

        it('can parse: matrix true object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix',
              explode: true,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/;age=25;name=Bob' })
          expect(value.params.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })
      })

      describe('query parameters', () => {
        it('can parse: form true primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'form',
              explode: true,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=5' })
          expect(value.query.foo).to.equal(5)
        })

        it('can parse: form true array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'form',
              explode: true,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=3&foo=4&foo=5' })
          expect(value.query.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: form true object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/{foo}', [
            {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'form',
              explode: true,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/age=25&name=Bob' })
          expect(value.params.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: form false primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'form',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=5' })
          expect(value.query.foo).to.equal(5)
        })

        it('can parse: form false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'form',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=3,4,5' })
          expect(value.query.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: form false object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'form',
              explode: false,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value,error] = openapi.formatRequest({ method: 'get', path: '/?foo=age,25,name,Bob' })
          expect(value.query.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: spaceDelimited true array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'spaceDelimited',
              explode: true,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=3&foo=4&foo=5' })
          expect(value.query.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: spaceDelimited false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'spaceDelimited',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=3%204%205' })
          expect(value.query.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: pipeDelimited true array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'pipeDelimited',
              explode: true,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=3&foo=4&foo=5' })
          expect(value.query.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: pipeDelimited false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'pipeDelimited',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/?foo=3|4|5' })
          expect(value.query.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: deepObject true object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'query',
              style: 'deepObject',
              explode: true,
              schema:  {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value, error] = openapi.formatRequest({ method: 'get', path: '/?foo[name]=Bob&foo[age]=25' })
          expect(value.query.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        // TODO: working here, space delimited, pipe delimited, deep object
      })

      describe('header parameters', () => {
        it('can parse: simple false primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'header',
              style: 'simple',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', headers: { foo: '5' } })
          expect(value.headers.foo).to.equal(5)
        })

        it('can parse: simple false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'header',
              style: 'simple',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', headers: { foo: '3,4,5' } })
          expect(value.headers.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: simple false object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'header',
              style: 'simple',
              explode: false,
              schema:  {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', headers: { foo: 'name,Bob,age,25' } })
          expect(value.headers.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })

        it('can parse: simple true primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'header',
              style: 'simple',
              explode: true,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', headers: { foo: '5' } })
          expect(value.headers.foo).to.equal(5)
        })

        it('can parse: simple true array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'header',
              style: 'simple',
              explode: true,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', headers: { foo: '3,4,5' } })
          expect(value.headers.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: simple true object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'header',
              style: 'simple',
              explode: true,
              schema:  {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', headers: { foo: 'name=Bob,age=25' } })
          expect(value.headers.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })
      })

      describe('cookie parameters', () => {
        it('can parse cookie from header', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'cookie',
              style: 'form',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', headers: { cookie: 'foo=5' } })
          expect(value.cookies.foo).to.equal(5)
        })

        it('can parse: form true primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'cookie',
              style: 'form',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', cookies: { foo: '5' } })
          expect(value.cookies.foo).to.equal(5)
        })

        it('can parse: simple false primitive', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'cookie',
              style: 'form',
              explode: false,
              schema: { type: 'number' }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', cookies: { foo: '5' } })
          expect(value.cookies.foo).to.equal(5)
        })

        it('can parse: simple false array', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'cookie',
              style: 'form',
              explode: false,
              schema: { type: 'array', items: { type: 'number' } }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', cookies: { foo: '3,4,5' } })
          expect(value.cookies.foo).to.deep.equal([3, 4, 5])
        })

        it('can parse: simple false object', () => {
          const openapi = createOpenAPIForMakeRequest('get', '/', [
            {
              name: 'foo',
              in: 'cookie',
              style: 'form',
              explode: false,
              schema:  {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'number' }
                }
              }
            }
          ])
          const [value] = openapi.formatRequest({ method: 'get', path: '/', cookies: { foo: 'name,Bob,age,25' } })
          expect(value.cookies.foo).to.deep.equal({ name: 'Bob', age: 25 })
        })
      })

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

function createOpenAPIForMakeRequest (method: Method, path: `/${string}`, parameters: ParameterDefinition[]): OpenAPI {
  const openapiDef: OpenAPIDefinition = {
    openapi: '3.0.3',
    info: { title: '', version: '' },
    paths: {}
  }

  const operationDef: OperationDefinition = {
    responses: {
      200: { description: 'ok' }
    }
  }
  if (parameters.length > 0) operationDef.parameters = parameters

  openapiDef.paths[path] = {}
  openapiDef.paths[path][method] = operationDef

  return new OpenAPI(openapiDef)
}
