import {
  Encoding,
  RequestBody,
  SchemaDefinition,
  RequestBodyDefinition,
  EncodingDefinition
} from '../../src/v3'
import { expect } from 'chai'

describe('Component: Encoding', () => {
  describe('build', () => {
    it('can build', () => {
      const encoding = new Encoding({})
      expect(encoding).to.be.instanceof(Encoding)
    })

    describe('property: contentType', () => {
      describe('defaults', () => {
        let def: RequestBodyDefinition
        let properties: Record<string, SchemaDefinition>

        beforeEach(() => {
          properties = {}
          def = {
            content: {
              'application/x-www-form-urlencoded': {
                schema: {
                  type: 'object',
                  properties
                },
                encoding: {
                  x: {}
                }
              }
            }
          }
        })

        it('will default to application/octet stream for schema type "string" with format "binary"', () => {
          properties.x = { type: 'string', format: 'binary' }
          const body = new RequestBody(def)
          expect(body.content['application/x-www-form-urlencoded'].encoding?.x?.contentType).to.equal('application/octet-stream')
        })

        it('will default to text/plain for schema type "boolean"', () => {
          properties.x = { type: 'number' }
          const body = new RequestBody(def)
          expect(body.content['application/x-www-form-urlencoded'].encoding?.x?.contentType).to.equal('text/plain')
        })

        it('will default to text/plain for schema type "integer"', () => {
          properties.x = { type: 'integer' }
          const body = new RequestBody(def)
          expect(body.content['application/x-www-form-urlencoded'].encoding?.x?.contentType).to.equal('text/plain')
        })

        it('will default to text/plain for schema type "number"', () => {
          properties.x = { type: 'number' }
          const body = new RequestBody(def)
          expect(body.content['application/x-www-form-urlencoded'].encoding?.x?.contentType).to.equal('text/plain')
        })

        it('will default to application/json for schema type "object"', () => {
          properties.x = { type: 'object' }
          const body = new RequestBody(def)
          expect(body.content['application/x-www-form-urlencoded'].encoding?.x?.contentType).to.equal('application/json')
        })

        it('will default to text/plain for schema type "array" with items as string', () => {
          properties.x = { type: 'array', items: { type: 'string' } }
          const body = new RequestBody(def)
          expect(body.content['application/x-www-form-urlencoded'].encoding?.x?.contentType).to.equal('text/plain')
        })

        it('will default to application/json for schema type "array" with items as object', () => {
          properties.x = { type: 'array', items: { type: 'object' } }
          const body = new RequestBody(def)
          expect(body.content['application/x-www-form-urlencoded'].encoding?.x?.contentType).to.equal('application/json')
        })
      })
    })

    describe('property: style', () => {
      it('will default to "form"', () => {
        const body = new RequestBody({
          content: {
            'application/x-www-form-urlencoded': {
              encoding: { x: {} }
            }
          }
        })
        expect(body.content['application/x-www-form-urlencoded']?.encoding?.x?.style).to.equal('form')
      })

      it('will be ignored if the request body media type is not application/x-www-form-urlencoded', () => {
        const body = new RequestBody({
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { x: { type: 'string' } }
              },
              encoding: {
                x: { style: 'form' }
              }
            }
          }
        })
        expect(body.content['application/json']?.encoding?.x?.style).to.equal(undefined)
      })
    })

    describe('property: explode', () => {
      it('will default to true if style is "form"', () => {
        const body = new RequestBody({
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: { x: { type: 'string' } }
              },
              encoding: {
                x: { style: 'form' }
              }
            }
          }
        })
        expect(body.content['application/x-www-form-urlencoded']?.encoding?.x?.explode).to.equal(true)
      })

      it('will be ignored if the request body media type is not application/x-www-form-urlencoded', () => {
        const body = new RequestBody({
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { x: { type: 'string' } }
              },
              encoding: {
                x: { explode: true }
              }
            }
          }
        })
        expect(body.content['application/json']?.encoding?.x?.explode).to.equal(undefined)
      })
    })

    describe('property: allowReserved', () => {
      it('will default to false', () => {
        const body = new RequestBody({
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: { x: { type: 'string' } }
              },
              encoding: {
                x: {}
              }
            }
          }
        })
        expect(body.content['application/x-www-form-urlencoded']?.encoding?.x?.allowReserved).to.equal(false)
      })

      it('will be ignored if the request body media type is not application/x-www-form-urlencoded', () => {
        const body = new RequestBody({
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { x: { type: 'string' } }
              },
              encoding: {
                x: { allowReserved: true }
              }
            }
          }
        })
        expect(body.content['application/json']?.encoding?.x?.allowReserved).to.equal(undefined)
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

      it('will warn if the content type looks invalid', () => {
        const { warning } = Encoding.validate({
          contentType: 'foo'
        })
        expect(warning).to.match(/Media type appears invalid: "foo"/)
      })
    })

    describe('property: headers', () => {
      let encoding: Record<string, EncodingDefinition>
      let def: RequestBodyDefinition

      beforeEach(() => {
        encoding = {}
        def = {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  x: { type: 'string' }
                }
              },
              encoding
            }
          }
        }
      })

      it('can be an object of headers', () => {
        encoding.x = { headers: {} }
        const { error } = RequestBody.validate(def)
        expect(error).to.equal(undefined)
      })

      it('must be an object of headers', () => {
        // @ts-expect-error
        encoding.x = { headers: '' }
        const { error } = RequestBody.validate(def)
        expect(error).to.match(/Expected a non-null object/)
      })

      it('should not include content-type header', () => {
        encoding.x = { headers: { 'Content-Type': { schema: { type: 'string' } } } }
        const { warning } = RequestBody.validate(def)
        expect(warning).to.match(/Encoding headers should not include Content-Type/)
      })
    })

    describe('property: style', function () {
      let xSchema: SchemaDefinition
      let encoding: Record<string, EncodingDefinition>
      let def: RequestBodyDefinition

      beforeEach(() => {
        encoding = {}
        xSchema = { type: 'string' }
        def = {
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  x: xSchema
                }
              },
              encoding
            }
          }
        }
      })

      it('can be "form"', () => {
        encoding.x = { style: 'form' }
        const { error } = RequestBody.validate(def)
        expect(error).to.equal(undefined)
      })

      it('can be "spaceDelimited"', () => {
        xSchema.type = 'array'
        xSchema.items = { type: 'string' }
        encoding.x = { style: 'spaceDelimited' }
        const { error } = RequestBody.validate(def)
        expect(error).to.equal(undefined)
      })

      it('can be "pipeDelimited"', () => {
        xSchema.type = 'array'
        xSchema.items = { type: 'string' }
        encoding.x = { style: 'pipeDelimited' }
        const { error } = RequestBody.validate(def)
        expect(error).to.equal(undefined)
      })

      it('can be "deepObject"', () => {
        xSchema.type = 'object'
        encoding.x = { style: 'deepObject' }
        const { error } = RequestBody.validate(def)
        expect(error).to.equal(undefined)
      })

      it('must be a valid string', () => {
        // @ts-expect-error
        encoding.x = { style: 'foo' }
        const { error } = RequestBody.validate(def)
        expect(error).to.match(/Value must be one of/)
      })

      it('will warn about the value being ignored if not within application/x-www-form-urlencoded', () => {
        def.content['text/plain'] = def.content['application/x-www-form-urlencoded']
        delete def.content['application/x-www-form-urlencoded']
        encoding.x = { style: 'form' }
        const { warning } = RequestBody.validate(def)
        expect(warning).to.match(/Property ignored: "style"/)
        expect(warning?.count).to.equal(1)
      })
    })

    describe('property: explode', () => {
      let encoding: Record<string, EncodingDefinition>
      let def: RequestBodyDefinition

      beforeEach(() => {
        encoding = {}
        def = {
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  x: { type: 'string' }
                }
              },
              encoding
            }
          }
        }
      })

      it('can be a boolean', () => {
        encoding.x = { explode: true }
        const { error } = RequestBody.validate(def)
        expect(error).to.equal(undefined)
      })

      it('must be a boolean', () => {
        // @ts-expect-error
        encoding.x = { explode: '' }
        const { error } = RequestBody.validate(def)
        expect(error).to.match(/Expected a boolean/)
      })
    })
  })
})
