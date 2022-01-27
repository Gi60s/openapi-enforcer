import {
  Callback,
  Components,
  Example,
  Header,
  Link,
  Parameter,
  RequestBody,
  Response,
  Schema,
  SecurityScheme
} from '../../src/v3'
import { expect } from 'chai'
import { minimal } from '../helpers'

describe('Component: Components', () => {
  describe('build', () => {
    it('can build', function () {
      const components = new Components({})
      expect(components).to.be.instanceOf(Components)
    })

    it('can define schemas', function () {
      const components = new Components({
        schemas: {
          Name: minimal(Schema, '3.x')
        }
      })
      expect(components.schemas?.Name).to.be.instanceOf(Schema)
    })

    it('can define responses', function () {
      const components = new Components({
        responses: {
          Success: minimal(Response, '3.x')
        }
      })
      expect(components.responses?.Success).to.be.instanceOf(Response)
    })

    it('can define parameters', function () {
      const components = new Components({
        parameters: {
          Foo: minimal(Parameter, '3.x')
        }
      })
      expect(components.parameters?.Foo).to.be.instanceOf(Parameter)
    })

    it('can define examples', function () {
      const components = new Components({
        examples: {
          Foo: minimal(Example, '3.x')
        }
      })
      expect(components.examples?.Foo).to.be.instanceOf(Example)
    })

    it('can define RequestBodies', function () {
      const components = new Components({
        requestBodies: {
          Foo: minimal(RequestBody, '3.x')
        }
      })
      expect(components.requestBodies?.Foo).to.be.instanceOf(RequestBody)
    })

    it('can define Headers', function () {
      const components = new Components({
        headers: {
          Foo: minimal(Header, '3.x')
        }
      })
      expect(components.headers?.Foo).to.be.instanceOf(Header)
    })

    it('can define SecuritySchemes', function () {
      const components = new Components({
        securitySchemes: {
          Foo: minimal(SecurityScheme, '3.x')
        }
      })
      expect(components.securitySchemes?.Foo).to.be.instanceOf(SecurityScheme)
    })

    it('can define Links', function () {
      const components = new Components({
        links: {
          Foo: minimal(Link, '3.x')
        }
      })
      expect(components.links?.Foo).to.be.instanceOf(Link)
    })

    it('can define Callback', function () {
      const components = new Components({
        callbacks: {
          Foo: minimal(Callback, '3.x')
        }
      })
      expect(components.callbacks?.Foo).to.be.instanceOf(Callback)
    })
  })

  describe('validate', () => {
    it('has no required properties', function () {
      const [error] = Components.validate({})
      expect(error).to.equal(undefined)
    })

    it('allows extensions', () => {
      const [, warn] = Components.validate({ 'x-foo': 'foo' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = Components.validate({
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: schemas', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          schemas: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid schemas', function () {
        const [error] = Components.validate({
          schemas: {
            Name: minimal(Schema, '3.x')
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid schemas', function () {
        const [error] = Components.validate({
          schemas: {
            // @ts-expect-error
            Name: { type: 'foo' }
          }
        })
        expect(error).to.match(/Value must be one of: "array", "boolean", "integer", "number", "string", "object"/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          schemas: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: responses', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          responses: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid responses', function () {
        const [error] = Components.validate({
          responses: {
            Success: minimal(Response, '3.x')
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid responses', function () {
        const [error] = Components.validate({
          responses: {
            // @ts-expect-error
            Success: {}
          }
        })
        expect(error).to.match(/Missing required property: description/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          responses: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: parameters', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          parameters: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid parameters', function () {
        const definition = {
          parameters: {
            MyParam: minimal(Parameter, '3.x')
          }
        }
        const [error] = Components.validate(definition)
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid parameters', function () {
        const [error] = Components.validate({
          parameters: {
            // @ts-expect-error
            MyParam: {}
          }
        })
        expect(error).to.match(/Missing required properties: "name", "in"/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          parameters: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: examples', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          examples: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid examples', function () {
        const [error] = Components.validate({
          examples: {
            Example1: minimal(Example, '3.x')
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid examples', function () {
        const [error] = Components.validate({
          examples: {
            // @ts-expect-error
            Example1: { foo: 'bar' }
          }
        })
        expect(error).to.match(/Property "foo" not allowed/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          examples: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: requestBodies', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          requestBodies: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid requestBodies', function () {
        const [error] = Components.validate({
          requestBodies: {
            Body1: minimal(RequestBody, '3.x')
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid requestBodies', function () {
        const [error] = Components.validate({
          requestBodies: {
            // @ts-expect-error
            Body1: {}
          }
        })
        expect(error).to.match(/Missing required property: content/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          requestBodies: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: headers', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          headers: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid headers', function () {
        const [error] = Components.validate({
          headers: {
            Header1: minimal(Header, '3.x')
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid headers', function () {
        const [error] = Components.validate({
          headers: {
            // @ts-expect-error
            Header1: { foo: 'bar' }
          }
        })
        expect(error).to.match(/Property "foo" not allowed/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          headers: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: securitySchemes', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          securitySchemes: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid securitySchemes', function () {
        const definition = {
          securitySchemes: {
            MyScheme: minimal(SecurityScheme, '3.x')
          }
        }
        const [error] = Components.validate(definition)
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid securitySchemes', function () {
        const [error] = Components.validate({
          securitySchemes: {
            // @ts-expect-error
            MyScheme: {}
          }
        })
        expect(error).to.match(/Missing required property: type/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          securitySchemes: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: links', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          links: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid links', function () {
        const [error] = Components.validate({
          links: {
            MyLink: minimal(Link, '3.x')
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid links', function () {
        const [error] = Components.validate({
          links: {
            // @ts-expect-error
            MyLink: { foo: 'bar' }
          }
        })
        expect(error).to.match(/Property "foo" not allowed/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          links: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: callbacks', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          callbacks: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid callbacks', function () {
        const [error] = Components.validate({
          callbacks: {
            MyCallback: minimal(Link, '3.x')
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid callbacks', function () {
        const [error] = Components.validate({
          callbacks: {
            // @ts-expect-error
            MyCallback: { foo: 'bar' }
          }
        })
        expect(error).to.match(/Expected a non-null object. Received: "bar"/)
      })

      it('can accept a reference', function () {
        const [error] = Components.validate({
          callbacks: {
            Foo: { $ref: 'foo' }
          }
        })
        expect(error).to.equal(undefined)
      })
    })

    // TODO: at tests for $ref cases
    // TODO: add build tests for component maps
  })
})
