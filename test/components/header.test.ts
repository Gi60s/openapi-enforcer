import { Header, Header2, Header3, HeaderDefinition2 } from '../../src'
import { expect } from 'chai'

describe.only('Header component', () => {
  describe('build', () => {
    it('can build', () => {
      const component = new Header({})
      expect(component).to.be.instanceof(Header)
    })

    it('will default collectionFormat to csv if type is array', () => {
      expect(new Header({ type: 'string' }).collectionFormat).to.equal(undefined)
      expect(new Header({ type: 'array' }).collectionFormat).to.equal('csv')
    })
  })

  describe('validate', () => {
    describe('v2', () => {
      it('has required properties', function () {
        // @ts-expect-error
        const [error] = Header2.validate({})
        expect(error).to.match(/Missing required property: type/)
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
        expect(error).to.match(/Property "items" not allowed. Data type must be an array./)
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
        expect(error).to.match(/Property "collectionFormat" not allowed. Data type must be an array./)
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

      it.skip('value must match the schema', () => {
        const [error] = Header2.validate({ type: 'string', default: 1 })
        expect(error).to.match(/Value does not match schema/)
      })

      it('will warn if default does not match schema', () => {

      })
    })
  })
})
