import { Schema2, Schema3 } from '../../src/components'
import { expect } from 'chai'
import { testMultipleComponents } from '../../test-resources/test-utils'
import '../../test-resources/chai-exception-store'

const { test } = testMultipleComponents([Schema2, Schema3])

describe.only('Schema', () => {
  describe('definition', () => {
    it('allows a valid schema', () => {
      test(Schema => {
        const es = Schema.validate({ type: 'string' })
        expect(es).not.to.have.exceptionError()
      })
    })

    describe('property: additionalProperties', () => {
      it('is valid if type is explicitly set to "object"', () => {
        test(Schema => {
          const es = Schema.validate({ type: 'object', additionalProperties: true })
          expect(es).not.to.have.exceptionErrorCode('PROPERTY_NOT_ALLOWED_UNLESS_OBJECT')
        })
      })

      it('is not valid if type is explicitly set to something other than "object"', () => {
        test(Schema => {
          const es = Schema.validate({ type: 'string', additionalProperties: true })
          expect(es).to.have.exceptionErrorCode('PROPERTY_NOT_ALLOWED_UNLESS_OBJECT')
        })
      })

      it('can be a boolean', () => {
        test(Schema => {
          const es = Schema.validate({ type: 'object', additionalProperties: false })
          expect(es).not.to.have.exceptionErrorCode('VALUE_TYPE_INVALID')
        })
      })

      it('can be an object', () => {
        test(Schema => {
          const es = Schema.validate({ type: 'object', additionalProperties: { type: 'string' } })
          expect(es).not.to.have.exceptionErrorCode('ENUM_NOT_MET')
        })
      })

      it('cannot be a string', () => {
        test(Schema => {
          // @ts-expect-error
          const es = Schema.validate({ type: 'object', additionalProperties: 'yes' })

          expect(es).to.have.exceptionErrorCode('VALUE_TYPE_INVALID')
        })
      })

      it('will validate sub definition', () => {
        test(Schema => {
          const es = Schema.validate({ type: 'object', additionalProperties: { type: 'not-a-type' } })
          expect(es).to.have.exceptionErrorCode('ENUM_NOT_MET')
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
