import { Callback } from '../components/Callback'
import { Components } from '../components/Components'
import { Example } from '../components/Example'
import { Header } from '../components/Header'
import { Link } from '../components/Link'
import { Parameter } from '../components/Parameter'
// import { PathItem } from '../components/PathItem'  // version 3.1.0
import { RequestBody } from '../components/RequestBody'
import { Response } from '../components/Response'
import { Schema } from '../components/Schema'
import { SecurityScheme } from '../components/SecurityScheme'
import { expect } from 'chai'
import { minimal } from '../test-utils'

describe.only('Components component', () => {
  describe('build', () => {
    it('can build', function () {
      const components = new Components({})
      expect(components).to.be.instanceOf(Components)
    })

    it('can define schemas', function () {
      const components = new Components({
        schemas: {
          Name: minimal(Schema)
        }
      })
      expect(components.schemas?.Name).to.be.instanceOf(Schema)
    })

    it('can define responses', function () {
      const components = new Components({
        responses: {
          Success: minimal(Response)
        }
      })
      expect(components.responses?.Success).to.be.instanceOf(Response)
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
            Name: minimal(Schema)
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
        expect(error).to.match(/Value must be one of: "array", "boolean", "integer", "number", "string"/)
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
            Success: minimal(Response)
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
    })

    describe('property: parameters', () => {
      it('can be an empty object', function () {
        const [error] = Components.validate({
          parameters: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can define valid parameters', function () {
        const [error] = Components.validate({
          parameters: {
            MyParam: minimal(Parameter)
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot define invalid parameters', function () {
        const [error] = Components.validate({
          parameters: {
            // @ts-expect-error
            MyParam: {}
          }
        })
        expect(error).to.match(/Missing required properties: name, in/)
      })
    })
  })
})
