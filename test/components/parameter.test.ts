import { expect } from 'chai'
import { Parameter2 as Parameter2Definition, Parameter3 as Parameter3Definition } from '../../src/components/helpers/definition-types'
import { Operation as Operation2, Parameter as Parameter2 } from '../../src/v2'
import { Parameter as Parameter3 } from '../../src/v3'
import { minimal } from '../helpers'

const Parameters: [{ Parameter: typeof Parameter2, version: '2.x' }, { Parameter: typeof Parameter3, version: '3.x' }] = [
  { Parameter: Parameter2, version: '2.x' },
  { Parameter: Parameter3, version: '3.x' }
]

describe.only('Component: Parameter', () => {
  describe('build', () => {
    describe('v2', () => {
      it('can build', () => {
        const parameter2 = new Parameter2({
          name: 'foo',
          in: 'query',
          type: 'string'
        })
        expect(parameter2).to.be.instanceOf(Parameter2)
      })

      describe('property: allowEmptyValue', () => {
        it('will default to false if in "query"', () => {
          const parameter2 = new Parameter2({
            name: 'foo',
            in: 'query',
            type: 'string'
          })
          expect(parameter2.allowEmptyValue).to.equal(false)
        })

        it('will default to false if in "formData"', () => {
          const parameter2 = new Parameter2({
            name: 'foo',
            in: 'query',
            type: 'string'
          })
          expect(parameter2.allowEmptyValue).to.equal(false)
        })

        it('will not have default if not in "query" nor "formData"', () => {
          const parameter2 = new Parameter2({
            name: 'foo',
            in: 'path',
            type: 'string'
          })
          expect(parameter2.allowEmptyValue).to.equal(undefined)
        })
      })
    })

    describe('v3', () => {
      it('can build', () => {
        const parameter3 = new Parameter3({
          name: 'foo',
          in: 'query',
          schema: { type: 'string' }
        })
        expect(parameter3).to.be.instanceOf(Parameter3)
      })
    })
  })

  describe('validate', () => {
    describe('property: description', () => {
      it('can be a string', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version)
          config.description = ''
          const [error] = Parameter.validate(config)
          expect(error).to.equal(undefined)
        })
      })

      it('must be a string', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version)
          config.description = 5
          const [error] = Parameter.validate(config)
          expect(error).to.match(/Expected a string/)
        })
      })
    })

    describe('property: required', () => {
      it('can be true', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version)
          config.required = true
          const [error] = Parameter.validate(config)
          expect(error).to.equal(undefined)
        })
      })

      it('can be false', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version)
          config.required = false
          const [error] = Parameter.validate(config)
          expect(error).to.equal(undefined)
        })
      })

      it('must be a boolean', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version)
          config.required = 5
          const [error] = Parameter.validate(config)
          expect(error).to.match(/Expected a boolean/)
        })
      })

      it('must be set to true if "in" is path', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version, { in: 'path' })
          const [error] = Parameter.validate(config)
          expect(error).to.match(/Path parameters must be marked as required/)
        })
      })
    })

    describe('v2', () => {
      it('has required properties', () => {
        // @ts-expect-error
        const [error] = Parameter2.validate({})
        expect(error).to.match(/Missing required properties: "name", "in", "type"/)
      })

      it('requires a schema if "in" is body', () => {
        const [error] = Parameter2.validate({
          name: 'foo',
          in: 'body'
        })
        expect(error).to.match(/Missing required property: "schema"/)
      })

      describe('property: name', () => {
        it('can be a string', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'string'
          })
          expect(error).to.equal(undefined)
        })

        it('must be a string', () => {
          const [error] = Parameter2.validate({
            // @ts-expect-error
            name: 5,
            in: 'query'
          })
          expect(error).to.match(/Expected a string/)
        })
      })

      describe('property: in', () => {
        it('can be "body"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'body',
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('cannot be "cookie"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            // @ts-expect-error
            in: 'cookie',
            type: 'string'
          })
          expect(error).to.match(/Value must be one of: "body", "formData", "header", "path", "query"/)
        })

        it('can be "formData"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'formData',
            type: 'string'
          })
          expect(error).to.equal(undefined)
        })

        it('can be "header"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'header',
            type: 'string'
          })
          expect(error).to.equal(undefined)
        })

        it('can be "path"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'path',
            required: true,
            type: 'string'
          })
          expect(error).to.equal(undefined)
        })

        it('can be "query"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'string'
          })
          expect(error).to.equal(undefined)
        })

        it('must be a string', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            // @ts-expect-error
            in: 5,
            type: 'string'
          })
          expect(error).to.match(/Expected a string/)
        })
      })

      describe('property: schema', () => {
        it('is required if "in" is body', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'body'
          })
          expect(error).to.match(/Missing required property: "schema"/)
        })

        it('is not required if "in" is query', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'string'
          })
          expect(error).to.equal(undefined)
        })

        it('is not allowed if "in" is query', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' }
          })
          expect(error).to.match(/Property only allowed if "in" is set to "body"/)
        })

        it('can be a schema definition', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'body',
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('must be a schema definition', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'body',
            // @ts-expect-error
            schema: 5
          })
          expect(error).to.match(/Expected a Schema object definition/)
        })
      })

      describe('property: type', () => {
        it('is required if "in" is not body', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query'
          })
          expect(error).to.match(/Missing required property: "type"/)
        })

        it('is not required if "in" is body', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'body',
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('is not allowed if "in" is body', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'body',
            schema: { type: 'string' },
            type: 'string'
          })
          expect(error).to.match(/The "type" property can only be used when "in" is not set to "body"/)
        })

        it('can be set to "string"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'string'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "number"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'number'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "integer"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'integer'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "boolean"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'boolean'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "array"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "file" if "consumes" is "multipart/form-data"', () => {
          const [error] = Operation2.validate({
            parameters: [
              {
                name: 'foo',
                in: 'formData',
                type: 'file'
              }
            ],
            consumes: ['multipart/form-data'],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "file" if "consumes" is "application/x-www-form-urlencoded"', () => {
          const [error] = Operation2.validate({
            parameters: [
              {
                name: 'foo',
                in: 'formData',
                type: 'file'
              }
            ],
            consumes: ['application/x-www-form-urlencoded'],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.equal(undefined)
        })

        it('cannot be set to "file" if "consumes" is "application/json"', () => {
          const [error] = Operation2.validate({
            parameters: [
              {
                name: 'foo',
                in: 'formData',
                type: 'file'
              }
            ],
            consumes: ['application/json'],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Parameter of type "file" can only be used when/)
        })

        it('cannot be set to "file" if not in "formData"', () => {
          const [error] = Operation2.validate({
            parameters: [
              {
                name: 'foo',
                in: 'query',
                type: 'file'
              }
            ],
            consumes: ['application/x-www-form-urlencoded'],
            responses: { 200: { description: 'ok' } }
          })
          expect(error).to.match(/Parameter of type "file" can only be used when/)
        })

        it('cannot be "fake-type"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            // @ts-expect-error
            type: 'fake-type'
          })
          expect(error).to.match(/Value must be one of: "array", "boolean", "integer", "number", "string"/)
        })
      })

      describe('property: allowEmptyValue', () => {
        it('can be set to true', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'string',
            allowEmptyValue: true
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to false', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'formData',
            type: 'string',
            allowEmptyValue: false
          })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'formData',
            type: 'string',
            // @ts-expect-error
            allowEmptyValue: 5
          })
          expect(error).to.match(/Expected a boolean/)
        })

        it('cannot be set if in "path"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'path',
            type: 'string',
            allowEmptyValue: false
          })
          expect(error).to.match(/Only allowed if "in" is "query" or "formData"/)
        })
      })

      describe('property: items', () => {
        it('is required if type is "array"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array'
          })
          expect(error).to.match(/Missing required property: "items"/)
        })

        it('is not allowed if type is not "array"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'string',
            items: { type: 'string' }
          })
          expect(error).to.match(/Property "items" not allowed/)
        })

        it('can be an items schema', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('must be an items schema', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            // @ts-expect-error
            items: 5
          })
          expect(error).to.match(/Expected an Items object definition/)
        })
      })

      describe('property: collectionFormat', () => {
        it('todo', () => {
          throw new Error('todo')
        })
      })
    })
  })

  describe('parse', () => {
    describe('v3', () => {
      it('must have a schema to be parsed', () => {
        const def: Parameter3Definition = { name: 'user', in: 'cookie' }
        const [value, error] = new Parameter3(def).parse(['12345'])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to parse value without a schema/)
      })

      it('must have a value to be parsed', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: { type: 'string' } }
        const [value, error] = new Parameter3(def).parse([])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to parse because there is no value to parse/)
      })

      it('must have a determinable schema', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: { not: { type: 'string' } } }
        const [value, error] = new Parameter3(def).parse(['foo'])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to determine schema for operation: parse/)
      })

      it('must have a determined type', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: {} }
        const [value, error] = new Parameter3(def).parse(['foo'])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to perform operation "parse" because the schema has no type/)
      })
    })
  })
})
