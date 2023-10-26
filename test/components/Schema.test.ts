import { Schema2, Schema3 } from '../../src/components'
import { expect } from 'chai'
import { testMultipleComponents } from '../../test-resources/test-utils'
import '../../test-resources/chai-exception-store'
import { putInMemory } from '../../src/Loader/loaders/loader.memory'
import { loadAsync } from '../../src/Loader'

const { test, testAsync } = testMultipleComponents([Schema2, Schema3])

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

      it('can specify a type', () => {
        test(Schema => {
          const es = Schema.validate({ type: 'string', allOf: [] })
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
          expect(es).to.have.exceptionWarningCode('SCHEMA_ALLOF_EMPTY_ARRAY')
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

      describe('type conflicts', () => {
        it('will validate that parent defined types match allOf types', () => {
          test(Schema => {
            const es = Schema.validate({
              type: 'string',
              allOf: [{ type: 'boolean' }]
            })
            expect(es).to.have.exceptionErrorId('schema.allOf.type.conflict', { propertyName: 'type' })
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
            expect(es).to.have.exceptionErrorId('schema.allOf.type.conflict', { propertyName: 'type' })
          })
        })

        it('will not find implicit conflicts for "type"', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                { maxLength: 5 },
                { maximum: 5 }
              ]
            })
            expect(es).not.to.have.exceptionErrorId('schema.allOf.type.conflict')
          })
        })
      })

      describe('format conflicts', () => {
        it('will validate that parent defined format matches allOf formats', () => {
          test(Schema => {
            const es = Schema.validate({
              format: 'date',
              allOf: [{ format: 'date-time' }]
            })
            expect(es).to.have.exceptionErrorId('schema.allOf.format.conflict', { propertyName: 'format' })
          })
        })

        it('will find sibling conflicts for "format"', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                { format: 'binary' },
                { format: 'date' }
              ]
            })
            expect(es).to.have.exceptionErrorId('schema.allOf.format.conflict', { propertyName: 'format' })
          })
        })
      })

      describe('minimum/maximum conflicts', () => {
        it('will validate that parent defined minimum does not exceed child maximum', () => {
          test(Schema => {
            const es = Schema.validate({
              minimum: 5,
              allOf: [{ maximum: 2 }]
            })
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', { propertyName1: 'maximum', propertyName2: 'minimum' })
          })
        })

        it('will validate that parent defined maximum does not exceed child minimum', () => {
          test(Schema => {
            const es = Schema.validate({
              maximum: 2,
              allOf: [{ minimum: 5 }]
            })
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', { propertyName1: 'maximum', propertyName2: 'minimum' })
          })
        })

        it('will find sibling conflicts', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                { maximum: 2 },
                { minimum: 5 }
              ]
            })
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', { propertyName1: 'maximum', propertyName2: 'minimum' })
          })
        })

        it('will only report locations on conflicted values', async () => {
          return await testAsync(async (Schema) => {
            putInMemory('x.mem', {
              minimum: 0, // conflict with maximum = -5
              allOf: [
                { maximum: 10 },
                { maximum: -5 } // conflict with minimum = 2
              ]
            })
            const def = await loadAsync('x.mem')

            const es = Schema.validate(def.value)
            console.log(es.error)
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', { propertyName1: 'maximum', propertyName2: 'minimum' })
            const exception = es.exceptions.find(ex => ex.id === 'schema.allOf.maxMin.crossConflict')
            expect(exception?.locations.length).to.equal(2)
            console.log(es.error)
          })
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
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
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
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
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
