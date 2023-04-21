import { Schema2, Schema3 } from '../../src/components'
import { expect } from 'chai'
import { testMultipleComponents } from '../../test-resources/test-utils'

const { test } = testMultipleComponents([Schema2, Schema3])

describe('Schema', () => {
  describe('definition', () => {
    it('allows a valid schema', () => {
      test(Schema => {
        const result = Schema.validate({ type: 'string' })
        expect(result.hasError).to.equal(false)
      })
    })

    describe('property: additionalProperties', () => {
      it('is valid for objects', () => {
        test(Schema => {
          const result = Schema.validate({ type: 'object', additionalProperties: true })
          expect(result.hasErrorByCode('PROPERTY_NOT_ALLOWED')).to.equal(false)
        })
      })

      it('is not valid for non-objects', () => {
        test(Schema => {
          const result = Schema.validate({ type: 'string', additionalProperties: true })
          expect(result.hasErrorByCode('PROPERTY_NOT_ALLOWED')).to.equal(true)
        })
      })

      it('can be a boolean', () => {
        test(Schema => {
          const result = Schema.validate({ type: 'object', additionalProperties: false })
          expect(result.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      it('can be an object', () => {
        test(Schema => {
          const result = Schema.validate({ type: 'object', additionalProperties: { type: 'string' } })
          expect(result.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
          expect(result.hasErrorByCode('ENUM_NOT_MET')).to.equal(false)
        })
      })

      it('cannot be a string', () => {
        test(Schema => {
          // @ts-expect-error
          const result = Schema.validate({ type: 'object', additionalProperties: 'yes' })
          expect(result.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      it('will validate sub definition', () => {
        test(Schema => {
          const result = Schema.validate({ type: 'object', additionalProperties: { type: 'not-a-type' } })
          expect(result.hasErrorByCode('ENUM_NOT_MET')).to.equal(true)
        })
      })
    })

    describe('property: allOf', () => {

    })

    describe('property: anyOf', () => {

    })

    describe('property: default', () => {

    })

    describe('property: deprecated', () => {

    })

    describe('property: description', () => {

    })

    describe('property: discriminator', () => {

    })

    describe('property: enum', () => {

    })

    describe('property: example', () => {

    })

    describe('property: exclusiveMaximum', () => {

    })

    describe('property: exclusiveMinimum', () => {

    })

    describe('property: format', () => {

    })

    describe('property: items', () => {

    })

    describe('property: maximum', () => {

    })

    describe('property: minimum', () => {

    })

    describe('property: maxItems', () => {

    })

    describe('property: minItems', () => {

    })

    describe('property: maxLength', () => {

    })

    describe('property: minLength', () => {

    })

    describe('property: maxProperties', () => {

    })

    describe('property: minProperties', () => {

    })

    describe('property: not', () => {

    })

    describe('property: nullable', () => {

    })

    describe('property: oneOf', () => {

    })

    describe('property: pattern', () => {

    })

    describe('property: properties', () => {

    })

    describe('property: readonly', () => {

    })

    describe('property: required', () => {

    })

    describe('property: type', () => {
      it('will warn if schema type is indeterminate', () => {
        test(Schema => {
          const result = Schema.validate({})
          expect(result.hasWarningByCode('SCHEMA_TYPE_INDETERMINATE')).to.equal(true)
        })
      })

      it('requires a valid type', () => {
        test(Schema => {
          const result = Schema.validate({ type: 'foo' })
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('Schema2', () => {
        it('allows top level schema to be of type "file" for v2', () => {
          const result = Schema2.validate({ type: 'file' })
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID')).to.be.equal(false)
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID_FILE')).to.be.equal(false)
        })

        it('does not allow nested schema to be of type "file" for nested schema', () => {
          const result = Schema2.validate({
            type: 'object',
            properties: {
              file: { type: 'file' }
            }
          })
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID')).to.be.equal(false)
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID_FILE')).to.be.equal(true)
        })
      })

      describe('Schema3', () => {
        it('does not allow type "file" for v3', () => {
          const result = Schema3.validate({ type: 'file' })
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID')).to.be.equal(true)
        })
      })
    })

    describe('property: uniqueItems', () => {

    })

    describe('property: writeonly', () => {

    })
  })
})
