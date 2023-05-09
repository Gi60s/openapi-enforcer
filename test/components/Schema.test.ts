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
          // @ts-expect-error
          const es = Schema.validate({ type: 'object', additionalProperties: { type: 'not-a-type' } })
          expect(es).to.have.exceptionErrorCode('ENUM_NOT_MET')
        })
      })
    })

    describe.only('property: allOf', () => {
      it('does not need a type specified', () => {
        test(Schema => {
          const es = Schema.validate({ allOf: [] })
          expect(es).not.to.have.exceptionError()
        })
      })

      it('must be an array', () => {
        test(Schema => {
          // @ts-expect-error
          const es = Schema.validate({ allOf: {} })
          expect(es).to.have.exceptionErrorCode('VALUE_TYPE_INVALID')
        })
      })

      it('will warn of an empty array', () => {
        test(Schema => {
          const es = Schema.validate({ allOf: [] })
          expect(es).to.have.exceptionWarningCode('ARRAY_EMPTY')
        })
      })

      it('validates all items', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              { x: 5, default: true }, // property "x" is unknown
              { type: 'string', maximum: 5 } // type is string, "maximum" requires a numeric type/format
            ]
          })
          expect(es).to.have.exceptionErrorCode('PROPERTY_UNKNOWN', false)
          expect(es).to.have.exceptionErrorCode('PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC', false)
        })
      })

      it('will find explicit conflicts for "type"', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              { type: 'string' },
              { type: 'number' }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALL_CONFLICT', true)

          const metadata = es.exceptions[0]?.metadata ?? {}
          expect(metadata.propertyName).to.equal('type')
          expect(metadata.values).to.deep.equal(['string', 'number'])
        })
      })

      it('will find implicit conflicts for "type"', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              { maxLength: 5 },
              { maximum: 5 }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALL_CONFLICT', true)

          const metadata = es.exceptions.find(ex => ex.code === 'SCHEMA_ALL_CONFLICT')?.metadata ?? {}
          expect(metadata.propertyName).to.equal('type')
          expect(metadata.values).to.deep.equal(['string', 'number'])
        })
      })

      it('will find object property conflicts', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              {
                properties: {
                  a: { type: 'string' }
                }
              },
              {
                properties: {
                  a: { type: 'number' }
                }
              }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALL_CONFLICT', true)
          const metadata = es.exceptions.find(ex => ex.code === 'SCHEMA_ALL_CONFLICT')?.metadata ?? {}
          expect(metadata.propertyName).to.equal('type')
          expect(metadata.values).to.deep.equal(['string', 'number'])
        })
      })

      it('will find conflicts for "minimum" and "maximum"', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              { minimum: 5, maximum: 10 },
              { type: 'number', minimum: 12 }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALL_CONFLICT', true)
        })
      })

      it('will find object property conflicts for "minimum" and "maximum"', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              {
                properties: {
                  a: { minimum: 10 }
                }
              },
              {
                properties: {
                  a: { maximum: 5 }
                }
              }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALL_CROSS_CONFLICT', true)
          const metadata = es.exceptions[0]?.metadata ?? {}
          expect(metadata.propertyName1).to.equal('minimum')
          expect(metadata.value1).to.equal(10)
          expect(metadata.propertyName2).to.equal('maximum')
          expect(metadata.value2).to.equal(5)
        })
      })

      it('cannot be combined with anyOf', () => {

      })

      it('cannot be combined with oneOf', () => {

      })

      it('cannot be combined with not', () => {

      })

      it('validates that all items are of the same format', () => {

      })

      it('handles nested allOf schemas', () => {

      })
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
      it('will warn if the schema type is not specified', () => {
        test(Schema => {
          const es = Schema.validate({ additionalProperties: true })
          expect(es).to.have.exceptionWarningCode('SCHEMA_TYPE_NOT_SPECIFIED')
        })
      })

      it('will produce an error if schema type is indeterminate', () => {
        test(Schema => {
          const es = Schema.validate({})
          expect(es).to.have.exceptionErrorCode('SCHEMA_TYPE_INDETERMINATE')
        })
      })

      it('requires a valid type', () => {
        test(Schema => {
          // @ts-expect-error
          const es = Schema.validate({ type: 'foo' })
          expect(es).to.have.exceptionErrorCode('ENUM_NOT_MET')
        })
      })
    })

    describe('property: uniqueItems', () => {

    })

    describe('property: writeonly', () => {

    })
  })
})
