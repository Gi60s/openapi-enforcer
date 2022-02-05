import { Items } from '../../src/v2'
import { expect } from 'chai'

describe('Component: Items', () => {
  describe('build', () => {
    it('can build', function () {
      const item = new Items({ type: 'string' })
      expect(item).to.be.instanceOf(Items)
    })
  })

  describe('validate', () => {
    it('has required properties', function () {
      // @ts-expect-error
      const [error] = Items.validate({})
      expect(error).to.match(/Missing required property: "type"/)
    })

    it('allows extensions', () => {
      const [, warn] = Items.validate({ 'x-foo': 'foo', type: 'string' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = Items.validate({
        // @ts-expect-error
        foo: 'invalid',
        type: 'string'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: type', () => {
      it('cannot equal "array"', () => {
        const [error] = Items.validate({ type: 'string' })
        expect(error).to.equal(undefined)
      })

      it('can equal "boolean"', () => {
        const [error] = Items.validate({ type: 'boolean' })
        expect(error).to.equal(undefined)
      })

      it('can equal "integer"', () => {
        const [error] = Items.validate({ type: 'integer' })
        expect(error).to.equal(undefined)
      })

      it('can equal "number"', () => {
        const [error] = Items.validate({ type: 'number' })
        expect(error).to.equal(undefined)
      })

      it('can equal "string"', () => {
        const [error] = Items.validate({ type: 'string' })
        expect(error).to.equal(undefined)
      })

      it('cannot equal "file"', () => {
        const [error] = Items.validate({
          // @ts-expect-error
          type: 'file'
        })
        expect(error).to.match(/Value must be one of/)
      })
    })

    describe('property: format', () => {
      it('can be a string', () => {
        const [error, warning] = Items.validate({ type: 'string', format: 'date-time' })
        expect(error).to.equal(undefined)
        expect(warning).to.equal(undefined)
      })

      it('must be a string', () => {
        const [error, warning] = Items.validate({
          type: 'string',
          // @ts-expect-error
          format: true
        })
        expect(error).to.match(/Expected a string/)
        expect(warning).to.equal(undefined)
      })

      it('will warn if format is not registered', () => {
        const [error, warning] = Items.validate({
          type: 'string',
          format: 'yes'
        })
        expect(error).to.equal(undefined)
        expect(warning).to.match(/Unregistered format/)
      })
    })

    describe('property: items', () => {
      it('is allowed if type is array', function () {
        const [error] = Items.validate({ type: 'array', items: { type: 'string' } })
        expect(error).to.equal(undefined)
      })

      it('is required if type is array', function () {
        const [error] = Items.validate({ type: 'array' })
        expect(error).to.match(/Missing required property: "items"/)
      })

      it('is not allowed if type is not array', function () {
        const [error] = Items.validate({ type: 'string', items: { type: 'string' } })
        expect(error).to.match(/Property "items" not allowed. Property "type" must equal "array" to use property "items"./)
      })
    })

    describe('property: collectionFormat', () => {
      const type = 'array'
      const items: any = { type: 'string' }

      it('is allowed if type is array', function () {
        const [error] = Items.validate({ type, items, collectionFormat: 'csv' })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is not array', function () {
        const [error] = Items.validate({ type: 'string', collectionFormat: 'csv' })
        expect(error).to.match(/The "collectionFormat" can only be applied with the type is "array"./)
      })

      it('can equal "csv"', function () {
        const [error] = Items.validate({ type, items, collectionFormat: 'csv' })
        expect(error).to.equal(undefined)
      })

      it('can equal "ssv"', function () {
        const [error] = Items.validate({ type, items, collectionFormat: 'ssv' })
        expect(error).to.equal(undefined)
      })

      it('can equal "tsv"', function () {
        const [error] = Items.validate({ type, items, collectionFormat: 'tsv' })
        expect(error).to.equal(undefined)
      })

      it('can equal "pipes"', function () {
        const [error] = Items.validate({ type, items, collectionFormat: 'pipes' })
        expect(error).to.equal(undefined)
      })

      it('cannot equal another string', function () {
        const [error] = Items.validate({
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
        const [error] = Items.validate({ type: 'string', default: 'foo' })
        expect(error).to.equal(undefined)
      })

      it('value must match the schema', () => {
        const [error] = Items.validate({ type: 'string', default: 1 })
        expect(error).to.match(/Default value .+ does not match its associated schema/)
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: maximum', () => {
      it('is allowed if type is "integer"', () => {
        const [error] = Items.validate({ type: 'integer', maximum: 10 })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "number"', () => {
        const [error] = Items.validate({ type: 'number', maximum: 10.5 })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "string" and format is "date"', () => {
        const [error] = Items.validate({ type: 'string', format: 'date', maximum: '2000-01-01' })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is "string"', () => {
        const [error] = Items.validate({ type: 'string', maximum: 10 })
        expect(error).to.match(/Property "type" must be numeric to use property "maximum"/)
      })

      it('can be equal to the minimum', () => {
        const [error] = Items.validate({ type: 'number', minimum: 10, maximum: 10 })
        expect(error).to.equal(undefined)
      })

      it('must be greater than or equal to the minimum', () => {
        const [error] = Items.validate({ type: 'number', minimum: 15, maximum: 10 })
        expect(error).to.match(/Property "minimum" .+ must be less than "maximum"/)
      })

      it('date can be greater than the minimum', () => {
        const [error] = Items.validate({ type: 'string', format: 'date', minimum: '2000-01-01', maximum: '2000-02-01' })
        expect(error).to.equal(undefined)
      })

      it('date must be greater than or equal to the minimum', () => {
        const [error] = Items.validate({ type: 'string', format: 'date', minimum: '2000-03-01', maximum: '2000-02-01' })
        expect(error).to.match(/Property "minimum" .+ must be less than "maximum"/)
      })
    })

    describe('property: minimum', () => {
      it('is allowed if type is "integer"', () => {
        const [error] = Items.validate({ type: 'integer', minimum: 10 })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "number"', () => {
        const [error] = Items.validate({ type: 'number', minimum: 10.5 })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "string" and format is "date"', () => {
        const [error] = Items.validate({ type: 'string', format: 'date', minimum: '2000-01-01' })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is "string"', () => {
        const [error] = Items.validate({ type: 'string', minimum: 10 })
        expect(error).to.match(/Property "type" must be numeric to use property "minimum"/)
      })
    })

    describe('property: exclusiveMaximum', () => {
      it('is allowed if type is "integer"', () => {
        const [error] = Items.validate({ type: 'integer', exclusiveMaximum: true })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "number"', () => {
        const [error] = Items.validate({ type: 'number', exclusiveMaximum: true })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "string" and format is "date"', () => {
        const [error] = Items.validate({ type: 'string', format: 'date', exclusiveMaximum: true })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is "string"', () => {
        const [error] = Items.validate({ type: 'string', exclusiveMaximum: true })
        expect(error).to.match(/Property "type" must be numeric to use property "exclusiveMaximum"/)
      })

      it('maximum must be greater than (not equal to) the minimum', () => {
        const [error] = Items.validate({ type: 'number', exclusiveMaximum: true, minimum: 10, maximum: 10 })
        expect(error).to.match(/Property "minimum" .+ must be less than or equal to "maximum"/)
      })
    })

    describe('property: exclusiveMinimum', () => {
      it('is allowed if type is "integer"', () => {
        const [error] = Items.validate({ type: 'integer', exclusiveMinimum: true })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "number"', () => {
        const [error] = Items.validate({ type: 'number', exclusiveMinimum: true })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "string" and format is "date"', () => {
        const [error] = Items.validate({ type: 'string', format: 'date', exclusiveMinimum: true })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is "string"', () => {
        const [error] = Items.validate({ type: 'string', exclusiveMinimum: true })
        expect(error).to.match(/Property "type" must be numeric to use property "exclusiveMinimum"/)
      })

      it('maximum must be greater than (not equal to) the minimum', () => {
        const [error] = Items.validate({ type: 'number', exclusiveMinimum: true, minimum: 10, maximum: 10 })
        expect(error).to.match(/Property "minimum" .+ must be less than or equal to "maximum"/)
      })
    })

    describe('property: maxLength', () => {
      it('is allowed if type is string', () => {
        const [error] = Items.validate({ type: 'string', maxLength: 25 })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is not string', () => {
        const [error] = Items.validate({ type: 'number', maxLength: 25 })
        expect(error).to.match(/Property "type" must equal "string" to use property "maxLength"/)
      })

      it('must be greater than or equal to zero', () => {
        const [error] = Items.validate({ type: 'string', maxLength: -1 })
        expect(error).to.match(/Value must be greater than or equal to 0/)
      })

      it('can be greater than to "minLength"', () => {
        const [error] = Items.validate({ type: 'string', maxLength: 25, minLength: 10 })
        expect(error).to.equal(undefined)
      })

      it('can be equal to "minLength"', () => {
        const [error] = Items.validate({ type: 'string', maxLength: 25, minLength: 25 })
        expect(error).to.equal(undefined)
      })

      it('must be greater than or equal to "minLength"', () => {
        const [error] = Items.validate({ type: 'string', maxLength: 25, minLength: 26 })
        expect(error).to.match(/Property "minLength" .+ must be less than "maxLength"/)
      })
    })

    describe('property: minLength', () => {
      it('is allowed if type is string', () => {
        const [error] = Items.validate({ type: 'string', minLength: 25 })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is not string', () => {
        const [error] = Items.validate({ type: 'number', minLength: 25 })
        expect(error).to.match(/Property "type" must equal "string" to use property "minLength"/)
      })

      it('must be greater than or equal to zero', () => {
        const [error] = Items.validate({ type: 'string', minLength: -1 })
        expect(error).to.match(/Value must be greater than or equal to 0/)
      })
    })

    describe('property: pattern', () => {
      it('is allowed if type is string', () => {
        const [error] = Items.validate({ type: 'string', pattern: '[0-9A-F]+' })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is not string', () => {
        const [error] = Items.validate({ type: 'number', pattern: '[0-9A-F]+' })
        expect(error).to.match(/Property "type" must equal "string" to use property "pattern"/)
      })
    })

    describe('property: maxItems', () => {
      it('is allowed if type is array', () => {
        const [error] = Items.validate({ type: 'array', maxItems: 5, items: { type: 'string' } })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is not array', () => {
        const [error] = Items.validate({ type: 'number', maxItems: 5 })
        expect(error).to.match(/Property "type" must equal "array" to use property "maxItems"/)
      })

      it('must be a number', () => {
        const [error] = Items.validate({
          type: 'array',
          // @ts-expect-error
          maxItems: 'five',
          items: { type: 'string' }
        })
        expect(error).to.match(/Expected a number/)
      })

      it('must be greater than or equal to zero', () => {
        const [error] = Items.validate({ type: 'array', maxItems: -1, items: { type: 'string' } })
        expect(error).to.match(/Value must be greater than or equal to 0/)
      })

      it('can be greater than to "minItems"', () => {
        const [error] = Items.validate({ type: 'array', maxItems: 5, minItems: 3, items: { type: 'string' } })
        expect(error).to.equal(undefined)
      })

      it('can be equal to "minItems"', () => {
        const [error] = Items.validate({ type: 'array', maxItems: 5, minItems: 5, items: { type: 'string' } })
        expect(error).to.equal(undefined)
      })

      it('must be greater than or equal to "minItems"', () => {
        const [error] = Items.validate({ type: 'array', maxItems: 5, minItems: 6, items: { type: 'string' } })
        expect(error).to.match(/Property "minItems" .+ must be less than "maxItems"/)
      })
    })

    describe('property: minItems', () => {
      it('is allowed if type is array', () => {
        const [error] = Items.validate({ type: 'array', minItems: 5, items: { type: 'string' } })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is not array', () => {
        const [error] = Items.validate({ type: 'number', minItems: 5 })
        expect(error).to.match(/Property "type" must equal "array" to use property "minItems"/)
      })

      it('must be a number', () => {
        const [error] = Items.validate({
          type: 'array',
          // @ts-expect-error
          minItems: 'five',
          items: { type: 'string' }
        })
        expect(error).to.match(/Expected a number/)
      })

      it('must be greater than or equal to zero', () => {
        const [error] = Items.validate({ type: 'array', minItems: -1, items: { type: 'string' } })
        expect(error).to.match(/Value must be greater than or equal to 0/)
      })
    })

    describe('property: uniqueItems', () => {
      it('is allowed if type is array', () => {
        const [error] = Items.validate({ type: 'array', uniqueItems: true, items: { type: 'string' } })
        expect(error).to.equal(undefined)
      })

      it('is not allowed if type is not array', () => {
        const [error] = Items.validate({ type: 'number', uniqueItems: true })
        expect(error).to.match(/Property "type" must equal "array" to use property "uniqueItems"/)
      })

      it('must be a boolean', () => {
        const [error] = Items.validate({
          type: 'array',
          // @ts-expect-error
          uniqueItems: 'yes',
          items: { type: 'string' }
        })
        expect(error).to.match(/Expected a boolean/)
      })
    })

    describe('property: enum', () => {
      it('can be an array of values', () => {
        const [error] = Items.validate({ type: 'string', enum: [''] })
        expect(error).to.equal(undefined)
      })

      it('must be an array of values', () => {
        const [error] = Items.validate({
          type: 'string',
          // @ts-expect-error
          enum: 5
        })
        expect(error).to.match(/Expected an array/)
      })

      it('must have at least one element', () => {
        const [error] = Items.validate({ type: 'string', enum: [] })
        expect(error).to.match(/Array must have at least 1 item./)
      })

      it('requires values to match schema', () => {
        const [error] = Items.validate(({ type: 'string', enum: [5] }))
        expect(error).to.match(/Enum value .+ does not match its associated schema/)
        expect(error).to.match(/Expected a string/)
      })

      it('requires values to match schema attributes', () => {
        const [error] = Items.validate(({ type: 'number', minimum: 5, enum: [3, 4, 5] }))
        expect(error).to.match(/Enum value 3 does not match its associated schema/)
        expect(error).to.match(/Enum value 4 does not match its associated schema/)
      })
    })

    describe('property: multipleOf', () => {
      it('is allowed if type is "integer"', () => {
        const [error] = Items.validate({ type: 'integer', multipleOf: 10 })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "number"', () => {
        const [error] = Items.validate({ type: 'number', multipleOf: 0.1 })
        expect(error).to.equal(undefined)
      })

      it('is allowed if type is "string" and format is "date"', () => {
        const [error] = Items.validate({ type: 'string', format: 'date', multipleOf: '2000-01-01' })
        expect(error).to.equal(undefined)
      })

      it('must be greater than zero', () => {
        const [error] = Items.validate({ type: 'number', multipleOf: 0 })
        expect(error).to.match(/Value must be greater than 0/)
      })

      it('is not allowed if type is "string"', () => {
        const [error] = Items.validate({ type: 'string', multipleOf: 10 })
        expect(error).to.match(/Property "type" must be numeric to use property "multipleOf"/)
      })

      it('will warn if the minimum is not a multiple', () => {
        const [error, warning] = Items.validate({ type: 'number', minimum: 1, multipleOf: 2 })
        expect(error).to.equal(undefined)
        expect(warning).to.match(/Minimum value 1 is not a multiple of 2/)
      })

      it('will warn if the maximum is not a multiple', () => {
        const [error, warning] = Items.validate({ type: 'number', maximum: 11, multipleOf: 2 })
        expect(error).to.equal(undefined)
        expect(warning).to.match(/Maximum value 11 is not a multiple of 2/)
      })
    })
  })
})
