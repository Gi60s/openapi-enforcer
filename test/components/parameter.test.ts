import { expect } from 'chai'
import { Parameter2 as Parameter2Definition, Parameter3 as Parameter3Definition } from '../../src/components/helpers/definition-types'
import { DefinitionException, Operation as Operation2, Parameter as Parameter2 } from '../../src/v2'
import { Parameter as Parameter3 } from '../../src/v3'
import { minimal } from '../helpers'

const Parameters: [{ Parameter: typeof Parameter2, version: '2.x' }, { Parameter: typeof Parameter3, version: '3.x' }] = [
  { Parameter: Parameter2, version: '2.x' },
  { Parameter: Parameter3, version: '3.x' }
]

// this function is for testing that the schema or content media type schema both produce the same results
function twoSchemas (definition: any, schema: any, callback: ((e: DefinitionException) => void)): void {
  callback(Parameter3.validate(Object.assign({}, definition, {
    schema
  })))

  callback(Parameter3.validate(Object.assign({}, definition, {
    content: {
      'application/json': { schema }
    }
  })))
}

describe('Component: Parameter', () => {
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

      describe('property: collectionFormat', () => {
        it('will default to "csv" if type is array', () => {
          const parameter2 = new Parameter2({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' }
          })
          expect(parameter2.collectionFormat).to.equal('csv')
        })

        it('will default to undefined if type is not array', () => {
          const parameter2 = new Parameter2({
            name: 'foo',
            in: 'query',
            type: 'string'
          })
          expect(parameter2.collectionFormat).to.equal(undefined)
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

      describe('property: allowReserved', () => {
        it('will default to false if in "query"', () => {
          const parameter = new Parameter3({
            name: 'foo',
            in: 'query'
          })
          expect(parameter.allowReserved).to.equal(false)
        })

        it('will default to undefined if type is not array', () => {
          const parameter = new Parameter3({
            name: 'foo',
            in: 'path',
            required: true
          })
          expect(parameter.allowReserved).to.equal(undefined)
        })
      })

      describe('property: style', () => {
        it('defaults to "form" if in "query"', () => {
          const parameter = new Parameter3({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' }
          })
          expect(parameter.style).to.equal('form')
        })

        it('defaults to "simple" if in "path"', () => {
          const parameter = new Parameter3({
            name: 'foo',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          })
          expect(parameter.style).to.equal('simple')
        })

        it('defaults to "simple" if in "header"', () => {
          const parameter = new Parameter3({
            name: 'foo',
            in: 'header',
            schema: { type: 'string' }
          })
          expect(parameter.style).to.equal('simple')
        })

        it('defaults to "form" if in "cookie"', () => {
          const parameter = new Parameter3({
            name: 'foo',
            in: 'cookie',
            schema: { type: 'string' }
          })
          expect(parameter.style).to.equal('form')
        })
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

    describe('property: name', () => {
      it('can be a string', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version)
          config.name = 'foo'
          const [error] = Parameter.validate(config)
          expect(error).to.equal(undefined)
        })
      })

      it('must be a string', () => {
        Parameters.forEach(({ Parameter, version }) => {
          const config = minimal('Parameter', version)
          config.name = 5
          const [error] = Parameter.validate(config)
          expect(error).to.match(/Expected a string/)
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
        it('can be set to "csv"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' },
            collectionFormat: 'csv'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "ssv"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' },
            collectionFormat: 'ssv'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "tsv"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' },
            collectionFormat: 'tsv'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "pipes"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' },
            collectionFormat: 'pipes'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "multi" if type is "query"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            type: 'array',
            items: { type: 'string' },
            collectionFormat: 'multi'
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to "multi" if type is "formData"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'formData',
            type: 'array',
            items: { type: 'string' },
            collectionFormat: 'multi'
          })
          expect(error).to.equal(undefined)
        })

        it('cannot be set to "multi" if type is not "query" and not "formData"', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'path',
            required: true,
            type: 'array',
            items: { type: 'string' },
            collectionFormat: 'multi'
          })
          expect(error).to.match(/The collection format property can only be set to "multi" when the parameter is in "query" or "formData"/)
        })
      })
    })

    describe('v3', () => {
      it('has required properties', () => {
        // @ts-expect-error
        const [error] = Parameter3.validate({})
        expect(error).to.match(/Missing required properties: "name", "in"/)
      })

      describe('property: in', () => {
        it('cannot be "body"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            // @ts-expect-error
            in: 'body',
            schema: { type: 'string' }
          })
          expect(error).to.match(/Value must be one of: "cookie", "header", "path", "query"/)
        })

        it('can be "cookie"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'cookie',
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('cannot be "formData"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            // @ts-expect-error
            in: 'formData',
            schema: { type: 'string' }
          })
          expect(error).to.match(/Value must be one of: "cookie", "header", "path", "query"/)
        })

        it('can be "header"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'header',
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('can be "path"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('can be "query"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('must be a string', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            // @ts-expect-error
            in: 5,
            schema: { type: 'string' }
          })
          expect(error).to.match(/Expected a string/)
        })
      })

      describe('property: allowEmptyValue', () => {
        it('can be set to true', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            allowEmptyValue: true
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to false', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            allowEmptyValue: false
          })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean', () => {
          const [error] = Parameter2.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            // @ts-expect-error
            allowEmptyValue: 5
          })
          expect(error).to.match(/Expected a boolean/)
        })

        it('cannot be set if in "path"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'path',
            schema: { type: 'string' },
            allowEmptyValue: false
          })
          expect(error).to.match(/Only allowed if "in" is "query"/)
        })
      })

      describe('property: allowReserved', () => {
        it('can be true', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            allowReserved: true,
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('can be false', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            allowReserved: false,
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            // @ts-expect-error
            allowReserved: 5
          })
          expect(error).to.match(/Expected a boolean/)
        })

        it('can only be specified if in "query"', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'path',
            required: true,
            allowReserved: true
          })
          expect(error).to.match(/Property only allowed for "query" parameters/)
        })
      })

      describe('property: content', () => {
        it('can be a valid content object', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {
              'text/plain': {
                schema: { type: 'string' }
              }
            }
          })
          expect(error).to.equal(undefined)
        })

        it('cannot contain zero properties', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {}
          })
          expect(error).to.match(/The "content" property must define exactly one media type./)
        })

        it('cannot contain more than one property', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {
              'text/plain': {
                schema: { type: 'string' }
              },
              'application/json': {
                schema: { type: 'string' }
              }
            }
          })
          expect(error).to.match(/The "content" property must define exactly one media type./)
        })

        it('must contain a valid media type object', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {
              // @ts-expect-error
              'text/plain': 5
            }
          })
          expect(error).to.match(/Expected a MediaType object definition/)
        })
      })

      describe('property: deprecated', () => {
        it('can be true', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            deprecated: true,
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('can be false', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            deprecated: false,
            schema: { type: 'string' }
          })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            // @ts-expect-error
            deprecated: 5
          })
          expect(error).to.match(/Expected a boolean/)
        })
      })

      describe('property: example', () => {
        it('can match the schema', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'number' },
            example: 5
          })
          expect(error).to.equal(undefined)
          expect(warning).to.equal(undefined)
        })

        it('can match the content media type schema', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {
              'text/plain': {
                schema: { type: 'number' }
              }
            },
            example: 5
          })
          expect(error).to.equal(undefined)
          expect(warning).to.equal(undefined)
        })

        it('will warn if there is a schema that the example does not match', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'number' },
            example: 'hello'
          })
          expect(error).to.equal(undefined)
          expect(warning).to.match(/Example is not valid when compared against the schema/)
        })

        it('will warn if there is a content media type schema that the example does not match', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {
              'text/plain': {
                schema: { type: 'number' }
              }
            },
            example: 'hello'
          })
          expect(error).to.equal(undefined)
          expect(warning).to.match(/Example is not valid when compared against the schema/)
        })

        it('is mutually exclusive from "examples" property', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'number' },
            example: 5,
            examples: {
              Example1: { value: 5 }
            }
          })
          expect(error).to.match(/The following properties are mutually exclusive: "example", "examples"/)
        })
      })

      describe('property: examples', () => {
        it('can be an empty object', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            examples: {}
          })
          expect(error).to.equal(undefined)
        })

        it('can use a valid example object', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            examples: {
              Example1: { value: 5 }
            }
          })
          expect(error).to.equal(undefined)
        })

        it('must use a valid example object', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'number' },
            examples: {
              // @ts-expect-error
              Example1: 5
            }
          })
          expect(error).to.match(/Expected an Example object definition/)
        })

        it('can match the schema', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'number' },
            examples: {
              Example1: { value: 5 }
            }
          })
          expect(error).to.equal(undefined)
          expect(warning).to.equal(undefined)
        })

        it('can match the content media type schema', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {
              'text/plain': {
                schema: { type: 'number' }
              }
            },
            examples: {
              Example1: { value: 5 }
            }
          })
          expect(error).to.equal(undefined)
          expect(warning).to.equal(undefined)
        })

        it('will warn if there is a schema that the example does not match', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'number' },
            examples: {
              Example1: { value: 'hello' }
            }
          })
          expect(error).to.equal(undefined)
          expect(warning).to.match(/Example is not valid when compared against the schema/)
        })

        it('will warn if there is a content media type schema that the example does not match', () => {
          const [error, warning] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            content: {
              'text/plain': {
                schema: { type: 'number' }
              }
            },
            examples: {
              Example1: { value: 'hello' }
            }
          })
          expect(error).to.equal(undefined)
          expect(warning).to.match(/Example is not valid when compared against the schema/)
        })
      })

      describe('property: schema', () => {
        it('can be a valid schema definition', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'number' }
          })
          expect(error).to.equal(undefined)
        })

        it('must be a valid schema definition', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            // @ts-expect-error
            schema: 5
          })
          expect(error).to.match(/Expected a Schema object definition/)
        })
      })

      describe('property: style', () => {
        describe('deepObject', () => {
          it('can be in "query" with type "object"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'deepObject'
            }
            twoSchemas(definition, { type: 'object' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('must be in "query"', () => {
            const definition = {
              name: 'foo',
              in: 'cookie',
              style: 'deepObject'
            }
            twoSchemas(definition, { type: 'object' }, ([error]) => {
              expect(error).to.match(/Style "deepObject" is incompatible with "cookie" parameter/)
            })
          })

          it('must have schema type as object', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'deepObject'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.match(/Style "deepObject" is incompatible with schema type "string"/)
            })
          })
        })

        describe('form', () => {
          it('can be in "cookie" with type "string"', () => {
            const definition = {
              name: 'foo',
              in: 'cookie',
              style: 'form'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "query" with type "string"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'form'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be an "array"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'form'
            }
            twoSchemas(definition, { type: 'object' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be an "object"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'form'
            }
            twoSchemas(definition, { type: 'object' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('must be in "cookie" or "query"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              style: 'form'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.match(/Style "form" is incompatible with "path" parameter/)
            })
          })
        })

        describe('label', () => {
          it('can be in "path" with type "string"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "path" with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "path" with type "object"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'label'
            }
            twoSchemas(definition, { type: 'object' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('must be in "path"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'label'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.match(/Style "label" is incompatible with "query" parameter/)
            })
          })
        })

        describe('matrix', () => {
          it('can be in "path" with type "string"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "path" with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "path" with type "object"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'matrix'
            }
            twoSchemas(definition, { type: 'object' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('must be in "path"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'matrix'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.match(/Style "matrix" is incompatible with "query" parameter/)
            })
          })
        })

        describe('pipeDelimited', () => {
          it('can be in "query" with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'pipeDelimited'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('must be with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'pipeDelimited'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.match(/Style "pipeDelimited" is incompatible with schema type "string"/)
            })
          })

          it('must be in "query"', () => {
            const definition = {
              name: 'foo',
              in: 'header',
              style: 'pipeDelimited'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.match(/Style "pipeDelimited" is incompatible with "header" parameter/)
            })
          })
        })

        describe('simple', () => {
          it('can be in "path" with type "string"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "path" with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "path" with type "object"', () => {
            const definition = {
              name: 'foo',
              in: 'path',
              required: true,
              style: 'simple'
            }
            twoSchemas(definition, { type: 'object' }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('can be in "header" with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'header',
              style: 'simple'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('must be in "path" or "header"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'simple'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.match(/Style "simple" is incompatible with "query" parameter/)
            })
          })
        })

        describe('spaceDelimited', () => {
          it('can be in "query" with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'spaceDelimited'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.equal(undefined)
            })
          })

          it('must be in "query"', () => {
            const definition = {
              name: 'foo',
              in: 'header',
              style: 'spaceDelimited'
            }
            twoSchemas(definition, { type: 'array', items: { type: 'string' } }, ([error]) => {
              expect(error).to.match(/Style "spaceDelimited" is incompatible with "header" parameter/)
            })
          })

          it('must be with type "array"', () => {
            const definition = {
              name: 'foo',
              in: 'query',
              style: 'spaceDelimited'
            }
            twoSchemas(definition, { type: 'string' }, ([error]) => {
              expect(error).to.match(/Style "spaceDelimited" is incompatible with schema type "string"/)
            })
          })
        })
      })

      describe('property: explode', () => {
        it('can be set to true', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            explode: true
          })
          expect(error).to.equal(undefined)
        })

        it('can be set to false', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            explode: false
          })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean', () => {
          const [error] = Parameter3.validate({
            name: 'foo',
            in: 'query',
            schema: { type: 'string' },
            // @ts-expect-error
            explode: 5
          })
          expect(error).to.match(/Expected a boolean/)
        })
      })
    })
  })

  describe('parseValue', () => {
    describe('v3', () => {
      it('must have a schema to be parsed', () => {
        const def: Parameter3Definition = { name: 'user', in: 'cookie' }
        const [value, error] = new Parameter3(def).parseValue(['12345'])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to parse value without a schema/)
      })

      it('must have a value to be parsed', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: { type: 'string' } }
        const [value, error] = new Parameter3(def).parseValue([])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to parse because there is no value to parse/)
      })

      it('must have a determinable schema', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: { not: { type: 'string' } } }
        const [value, error] = new Parameter3(def).parseValue(['foo'])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to determine schema for operation: parse/)
      })

      it('must have a determined type', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: {} }
        const [value, error] = new Parameter3(def).parseValue(['foo'])
        expect(value).to.equal(undefined)
        expect(error).to.match(/Unable to perform operation "parseValue" because the schema has no type/)
      })
    })
  })
})
