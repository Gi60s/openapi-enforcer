import { Header as Header2, HeaderDefinition as HeaderDefinition2 } from '../../src/v2'
import { Header as Header3, HeaderDefinition as HeaderDefinition3 } from '../../src/v3'
import { expect } from 'chai'

describe('Component: Header', () => {
  describe('v2', () => {
    describe('build', () => {
      it('can build', () => {
        const component = new Header2({ type: 'string' })
        expect(component).to.be.instanceof(Header2)
      })

      it('will default collectionFormat to csv if type is array', () => {
        expect(new Header2({ type: 'string' }).collectionFormat).to.equal(undefined)
        expect(new Header2({ type: 'array' }).collectionFormat).to.equal('csv')
      })
    })

    describe('validate', () => {
      it('has required properties', function () {
        // @ts-expect-error
        const [error] = Header2.validate({})
        expect(error).to.match(/Missing required property: "type"/)
      })

      it('allows extensions', () => {
        const [, warn] = Header2.validate({ type: 'string', 'x-foo': 'foo' })
        expect(warn).to.equal(undefined)
      })

      it('cannot have invalid properties', function () {
        const [error] = Header2.validate({
          type: 'string',
          // @ts-expect-error
          foo: 'invalid'
        })
        expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
      })

      it('can have schema properties', () => {
        const [error] = Header2.validate({
          type: 'string',
          maxLength: 5
        })
        expect(error).to.equal(undefined)
      })

      describe('property: description', () => {
        it('can be a string', function () {
          const [error] = Header2.validate({ type: 'string', description: 'Bob' })
          expect(error).to.equal(undefined)
        })

        it('must be a string', function () {
          const [error] = Header2.validate({
            type: 'string',
            // @ts-expect-error
            description: 12
          })
          expect(error).to.match(/Expected a string/)
        })
      })

      describe('property: type', () => {
        it('can be "string"', function () {
          const [error] = Header2.validate({ type: 'string' })
          expect(error).to.equal(undefined)
        })

        it('can be "number"', function () {
          const [error] = Header2.validate({ type: 'number' })
          expect(error).to.equal(undefined)
        })

        it('can be "integer"', function () {
          const [error] = Header2.validate({ type: 'integer' })
          expect(error).to.equal(undefined)
        })

        it('can be "boolean"', function () {
          const [error] = Header2.validate({ type: 'boolean' })
          expect(error).to.equal(undefined)
        })

        it('can be "array"', function () {
          const [error] = Header2.validate({ type: 'array', items: { type: 'string' } })
          expect(error).to.equal(undefined)
        })

        it('must match enum', function () {
          const [error] = Header2.validate({
            // @ts-expect-error
            type: 'foo'
          })
          expect(error).to.match(/Value must be one of: "array", "boolean", "integer", "number", "string"\./)
        })
      })

      describe('property: format', () => {
        it('can be a string', function () {
          const [error] = Header2.validate({ type: 'string', format: 'binary' })
          expect(error).to.equal(undefined)
        })

        it('must be a string', function () {
          const [error] = Header2.validate({
            type: 'string',
            // @ts-expect-error
            format: 12
          })
          expect(error).to.match(/Expected a string/)
        })

        it('will warn if format is non-standard and not defined', function () {
          const { warning } = Header2.validate({
            type: 'string',
            format: 'foo'
          })
          expect(warning).to.match(/Non-standard format "foo" used for type "string"/)
        })
      })

      describe('property: items', () => {
        it('is allowed if type is array', function () {
          const [error] = Header2.validate({ type: 'array', items: { type: 'string' } })
          expect(error).to.equal(undefined)
        })

        it('is required if type is array', function () {
          const [error] = Header2.validate({ type: 'array' })
          expect(error).to.match(/Missing required property: items/)
        })

        it('is not allowed if type is not array', function () {
          const [error] = Header2.validate({ type: 'string', items: { type: 'string' } })
          expect(error).to.match(/Property "items" not allowed. Property "type" must equal "array" to use property "items"./)
        })
      })

      describe('property: collectionFormat', () => {
        const type = 'array'
        const items: HeaderDefinition2 = { type: 'string' }

        it('is allowed if type is array', function () {
          const [error] = Header2.validate({ type, items, collectionFormat: 'csv' })
          expect(error).to.equal(undefined)
        })

        it('is not allowed if type is not array', function () {
          const [error] = Header2.validate({ type: 'string', collectionFormat: 'csv' })
          expect(error).to.match(/Property "collectionFormat" not allowed. Property "type" must equal "array" to use "collectionFormat"./)
        })

        it('can equal "csv"', function () {
          const [error] = Header2.validate({ type, items, collectionFormat: 'csv' })
          expect(error).to.equal(undefined)
        })

        it('can equal "ssv"', function () {
          const [error] = Header2.validate({ type, items, collectionFormat: 'ssv' })
          expect(error).to.equal(undefined)
        })

        it('can equal "tsv"', function () {
          const [error] = Header2.validate({ type, items, collectionFormat: 'tsv' })
          expect(error).to.equal(undefined)
        })

        it('can equal "pipes"', function () {
          const [error] = Header2.validate({ type, items, collectionFormat: 'pipes' })
          expect(error).to.equal(undefined)
        })

        it('cannot equal another string', function () {
          const [error] = Header2.validate({
            type,
            items,
            // @ts-expect-error
            collectionFormat: 'foo'
          })
          expect(error).to.match(/Value must be one of: "csv", "ssv", "tsv", "pipes"\./)
        })
      })

      describe('property: default', () => {
        it('value can match the schema', () => {
          const [error] = Header2.validate({ type: 'string', default: 'foo' })
          expect(error).to.equal(undefined)
        })

        it('value must match the schema', () => {
          const [error] = Header2.validate({ type: 'string', default: 1 })
          expect(error).to.match(/Default value .+ does not match its associated schema/)
        })
      })
    })
  })

  describe.only('v3', () => {
    describe('build', () => {
      it('can build', () => {
        const component = new Header3({ schema: { type: 'string' } })
        expect(component).to.be.instanceof(Header3)
      })

      it('will default style to "simple"', () => {
        const component = new Header3({})
        expect(component.style).to.equal('simple')
      })

      it('will default deprecated to false', () => {
        const component = new Header3({})
        expect(component.deprecated).to.equal(false)
      })
    })

    describe('validate', () => {
      let schema: any
      beforeEach(() => {
        schema = { type: 'string' }
      })

      it('has no required properties', function () {
        const [error] = Header3.validate({ schema })
        expect(error).to.equal(undefined)
      })

      it('allows extensions', () => {
        const [, warn] = Header3.validate({ 'x-foo': 'foo', schema })
        expect(warn).to.equal(undefined)
      })

      it('cannot have invalid properties', function () {
        const [error] = Header3.validate({
          // @ts-expect-error
          type: 'string',
          foo: 'invalid'
        })
        expect(error).to.match(/Property "type" not allowed. OpenAPI specification version 3.0.3 does not allow the "type" property/)
        expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
      })

      describe('property: description', () => {
        it('can be a string', () => {
          const [error] = Header3.validate({ description: '', schema })
          expect(error).to.equal(undefined)
        })

        it('must be a string', () => {
          // @ts-expect-error
          const [error] = Header3.validate({ description: true, schema })
          expect(error).to.match(/Expected a string/)
        })
      })

      describe('property: required', () => {
        it('can be true', () => {
          const [error] = Header3.validate({ required: true, schema })
          expect(error).to.equal(undefined)
        })

        it('can be false', () => {
          const [error] = Header3.validate({ required: true, schema })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean', () => {
          const [error] = Header3.validate({
            schema,
            // @ts-expect-error
            required: 'yes'
          })
          expect(error).to.match(/Expected a boolean/)
        })
      })

      describe('property: deprecated', () => {
        it('can be a boolean', () => {
          const [error] = Header3.validate({ deprecated: true, schema })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean', () => {
          // @ts-expect-error
          const [error] = Header3.validate({ deprecated: '', schema })
          expect(error).to.match(/Expected a boolean/)
        })
      })

      describe('property: allowEmptyValue', () => {
        it('is not allowed', () => {
          // @ts-expect-error
          const [error] = Header3.validate({ allowEmptyValue: true, schema })
          expect(error).to.match(/Property "allowEmptyValue" not allowed/)
        })
      })

      describe('property: style', () => {
        it('can equal "simple"', () => {
          const [error] = Header3.validate({ style: 'simple', schema })
          expect(error).to.equal(undefined)
        })

        it('must equal "simple"', () => {
          // @ts-expect-error
          const [error] = Header3.validate({ style: '', schema })
          expect(error).to.match(/Value must equal: "simple"/)
        })
      })

      describe('property: explode', () => {
        it('can be a boolean', () => {
          const [error] = Header3.validate({ explode: true, schema })
          expect(error).to.equal(undefined)
        })

        it('must be a boolean"', () => {
          // @ts-expect-error
          const [error] = Header3.validate({ explode: '', schema })
          expect(error).to.match(/Expected a boolean/)
        })
      })

      describe('property: allowReserved', () => {
        it('is not allowed', () => {
          // @ts-expect-error
          const [error] = Header3.validate({ allowReserved: true, schema })
          expect(error).to.match(/Property "allowReserved" not allowed/)
        })
      })

      describe('property: schema', () => {
        it('can be a schema definition', () => {
          const [error] = Header3.validate({ schema: { type: 'string' } })
          expect(error).to.equal(undefined)
        })

        it('must be a schema definition"', () => {
          // @ts-expect-error
          const [error] = Header3.validate({ schema: false })
          expect(error).to.match(/Expected a non-null object/)
        })

        it('is mutually exclusive of the "content" property', () => {
          const [error] = Header3.validate({
            schema: { type: 'string' },
            content: { 'text/plain': {} }
          })
          expect(error).to.match(/The following properties are mutually exclusive: "content", "schema"/)
        })
      })

      describe('property: example', () => {
        it('can exist with a matching schema', () => {
          const [error, warning] = Header3.validate({ example: true, schema: { type: 'boolean' } })
          expect(error).to.equal(undefined)
          expect(warning).to.equal(undefined)
        })

        it('will warn if not matching the schema', () => {
          const [error, warning] = Header3.validate({ example: true, schema: { type: 'string' } })
          expect(error).to.equal(undefined)
          expect(warning).to.match(/Example is not valid when compared against the schema/)
        })

        it('is mutually exclusive of "examples" property', () => {
          const [error] = Header3.validate({ example: '', examples: { a: { value: true } } })
          expect(error).to.match(/The following properties are mutually exclusive: "example", "examples"/)
        })
      })

      describe('property: examples', () => {
        let examples: any
        beforeEach(() => {
          examples = { a: { value: true } }
        })

        it('can exist with a matching schema', () => {
          const [error, warning] = Header3.validate({ examples, schema: { type: 'boolean' } })
          expect(error).to.equal(undefined)
          expect(warning).to.equal(undefined)
        })

        it('will warn if not matching the schema', () => {
          const [error, warning] = Header3.validate({ examples, schema: { type: 'string' } })
          expect(error).to.equal(undefined)
          expect(warning).to.match(/Example is not valid when compared against the schema/)
        })
      })

      describe('property: content', () => {
        it('can contain a media type definition', () => {
          const [error, warning] = Header3.validate({ content: { 'text/plain': {} } })
          expect(error).to.equal(undefined)
          expect(warning).to.equal(undefined)
        })

        it('must contain one media type definition', () => {
          const [error, warning] = Header3.validate({ content: {} })
          expect(error).to.match(/The "content" property must define exactly one media type./)
          expect(warning).to.equal(undefined)
        })

        it('cannot contain two media type definitions', () => {
          const [error, warning] = Header3.validate({ content: { 'text/plain': {}, 'application/json': {} } })
          expect(error).to.match(/The "content" property must define exactly one media type./)
          expect(warning).to.equal(undefined)
        })
      })
    })
  })
})
