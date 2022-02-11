import { MediaType, RequestBody } from '../../src/v3'
import { expect } from 'chai'

describe('Component: MediaType', () => {
  describe('build', () => {
    it('can build', () => {
      const mt = new MediaType({})
      expect(mt).to.be.instanceOf(MediaType)
    })
  })

  describe('validator', () => {
    it('has no required properties', () => {
      const [error] = MediaType.validate({})
      expect(error).to.equal(undefined)
    })

    it('allows extensions', () => {
      const [error] = MediaType.validate({ 'x-foo': 'foo' })
      expect(error).to.equal(undefined)
    })

    it('cannot have invalid properties', () => {
      const [error] = MediaType.validate({
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: schema', () => {
      it('can be a schema object', () => {
        const [error] = MediaType.validate({
          schema: { type: 'string' }
        })
        expect(error).to.equal(undefined)
      })

      it('can be a reference', () => {
        const [error] = MediaType.validate({
          schema: { $ref: '#/components/schemas/Foo' }
        })
        expect(error).to.equal(undefined)
      })

      it('must be a schema or a reference', () => {
        const [error] = MediaType.validate({
          // @ts-expect-error
          schema: { x: 'yes' }
        })
        expect(error).to.match(/Property "x" not allowed/)
      })
    })

    describe('property: example', () => {
      it('can be any value', () => {
        const [error] = MediaType.validate({
          schema: { type: 'string' },
          example: 'hello'
        })
        expect(error).to.equal(undefined)
      })

      it('does not need a schema', () => {
        const [error] = MediaType.validate({
          example: 'hello'
        })
        expect(error).to.equal(undefined)
      })

      it('will warn if the schema is provided but not met', () => {
        const [error, warning] = MediaType.validate({
          schema: { type: 'string' },
          example: 5
        })
        expect(error).to.equal(undefined)
        expect(warning).to.match(/Example is not valid when compared against the schema/)
        expect(warning).to.match(/Expected a string/)
      })

      it('is mutually exclusive from "examples" property', () => {
        const [error] = MediaType.validate({
          schema: { type: 'string' },
          example: 'hello',
          examples: {
            Greet: { value: 'hello' }
          }
        })
        expect(error).to.match(/The following properties are mutually exclusive: "example", "examples"/)
      })
    })

    describe('property: examples', () => {
      it('can be a map of example objects', () => {
        const [error] = MediaType.validate({
          schema: { type: 'string' },
          examples: {
            Cat: { value: 'cat' },
            Dog: { value: 'dog' }
          }
        })
        expect(error).to.equal(undefined)
      })

      it('must be an object map', () => {
        const [error] = MediaType.validate({
          schema: { type: 'string' },
          // @ts-expect-error
          examples: 5
        })
        expect(error).to.match(/Expected a non-null object/)
      })

      it('must be an object map of example objects', () => {
        const [error] = MediaType.validate({
          schema: { type: 'string' },
          examples: {
            // @ts-expect-error
            Cat: 'cat'
          }
        })
        expect(error).to.match(/Expected an Example object definition/)
      })
    })

    describe('property: encoding', () => {
      it('will be ignored if not part of a request body', () => {
        const [error] = MediaType.validate({
          schema: {
            type: 'object',
            properties: {
              a: { type: 'string' }
            }
          },
          encoding: {
            a: {
              // @ts-expect-error
              contentType: 5
            }
          }
        })
        expect(error).to.equal(undefined) // no error because it was ignored
      })

      it('will be ignored if using application/json', () => {
        const [error] = RequestBody.validate({
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                }
              },
              encoding: {
                a: {
                  // @ts-expect-error
                  contentType: 5
                }
              }
            }
          }
        })
        expect(error).to.equal(undefined)
      })

      it('will not be ignored if not using application/x-www-form-urlencoded', () => {
        const [error] = RequestBody.validate({
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                }
              },
              encoding: {
                a: {
                  // @ts-expect-error
                  contentType: 5
                }
              }
            }
          }
        })
        expect(error).to.match(/Expected a string/)
      })

      it('will not be ignored if not using multipart', () => {
        const [error] = RequestBody.validate({
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                }
              },
              encoding: {
                a: {
                  // @ts-expect-error
                  contentType: 5
                }
              }
            }
          }
        })
        expect(error).to.match(/Expected a string/)
      })

      it('can provide property encodings for a schema', () => {
        const [error] = RequestBody.validate({
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                }
              },
              encoding: {
                a: {
                  contentType: 'text/plain'
                }
              }
            }
          }
        })
        expect(error).to.equal(undefined)
      })

      it('requires a schema', () => {
        const [error] = RequestBody.validate({
          content: {
            'application/x-www-form-urlencoded': {
              encoding: {
                a: {
                  contentType: 'text/plain'
                }
              }
            }
          }
        })
        expect(error).to.match(/Encoding can only be used when the Media Type definition also contains a schema./)
      })

      it('requires the schema to be of type object', () => {
        const [error] = RequestBody.validate({
          content: {
            'application/x-www-form-urlencoded': {
              schema: { type: 'string' },
              encoding: {
                a: {
                  contentType: 'text/plain'
                }
              }
            }
          }
        })
        expect(error).to.match(/MediaType schema must be of type "object" when using the "encoding" property./)
      })
    })
  })
})
