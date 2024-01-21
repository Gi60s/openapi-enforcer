import { Schema2, Schema3 } from '../../src/components'
import { expect } from 'chai'
import { testMultipleComponents } from '../../test-resources/test-utils'
import '../../test-resources/chai-exception-store'
import { getMinMaxConflicts } from '../../src/components/Schema/Schema'

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
          const es = Schema.validate({
            type: 'object',
            additionalProperties: true
          })
          expect(es).not.to.have.exceptionErrorCode('PROPERTY_NOT_ALLOWED_UNLESS_OBJECT')
        })
      })

      it('is not valid if type is explicitly set to something other than "object"', () => {
        test(Schema => {
          const es = Schema.validate({
            type: 'string',
            additionalProperties: true
          })
          expect(es).to.have.exceptionErrorCode('PROPERTY_NOT_ALLOWED_UNLESS_OBJECT')
        })
      })

      it('can be a boolean', () => {
        test(Schema => {
          const es = Schema.validate({
            type: 'object',
            additionalProperties: false
          })
          expect(es).not.to.have.exceptionErrorCode('VALUE_TYPE_INVALID')
        })
      })

      it('can be an object', () => {
        test(Schema => {
          const es = Schema.validate({
            type: 'object',
            additionalProperties: { type: 'string' }
          })
          expect(es).not.to.have.exceptionErrorCode('ENUM_NOT_MET')
        })
      })

      it('cannot be a string', () => {
        test(Schema => {
          const es = Schema.validate({
            type: 'object',
            // @ts-expect-error
            additionalProperties: 'yes'
          })
          expect(es).to.have.exceptionErrorCode('VALUE_TYPE_INVALID')
        })
      })

      it('will validate sub definition', () => {
        test(Schema => {
          const es = Schema.validate({
            type: 'object',
            // @ts-expect-error
            additionalProperties: { type: 'not-a-type' }
          })
          expect(es).to.have.exceptionErrorCode('ENUM_NOT_MET')
        })
      })
    })

    describe.only('property: allOf', () => {
      it('does not need a type specified as sibling to "allOf"', () => {
        test(Schema => {
          const es = Schema.validate({ allOf: [{ type: 'string' }] })
          expect(es).not.to.have.exceptionError()
        })
      })

      it('can specify a type', () => {
        test(Schema => {
          const es = Schema.validate({
            type: 'string',
            allOf: [{ type: 'string' }]
          })
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

      it('will error if an empty array', () => {
        test(Schema => {
          const es = Schema.validate({ allOf: [] })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_EMPTY_ARRAY')
        })
      })

      it('validates all items', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              {
                x: 5,
                default: true
              }, // property "x" is unknown
              {
                type: 'string',
                maximum: 5
              } // type is string, "maximum" requires a numeric type/format
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
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofConflict', { propertyName: 'type' })
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
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofConflict', { propertyName: 'type' })
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
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofConflict', { propertyName: 'format' })
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
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofConflict', { propertyName: 'format' })
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
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', {
              propertyName1: 'minimum',
              propertyName2: 'maximum'
            })
          })
        })

        it('will validate that parent defined maximum does not exceed child minimum', () => {
          test(Schema => {
            const es = Schema.validate({
              maximum: 2,
              allOf: [{ minimum: 5 }]
            })
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', {
              propertyName1: 'minimum',
              propertyName2: 'maximum'
            })
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
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', {
              propertyName1: 'minimum',
              propertyName2: 'maximum'
            })
          })
        })

        it('will only report locations on conflicted values', () => {
          test((Schema) => {
            const es = Schema.validate({
              minimum: 0, // conflict with maximum = -5
              allOf: [
                { maximum: 10 },
                { maximum: -5 } // conflict with minimum = 2
              ]
            })
            console.log(es.error)
            expect(es).to.have.exceptionErrorId('schema.allOf.schemaAllofCrossConflict', {
              propertyName1: 'minimum',
              propertyName2: 'maximum'
            })
            const exception = es.exceptions.find(ex => ex.id === 'schema.allOf.schemaAllofCrossConflict')
            expect(exception?.locations.length).to.equal(2)
            console.log(es.error)
          })
        })
      })

      it('will find conflicts for "minimum" and "maximum"', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              {
                minimum: 5,
                maximum: 10
              },
              {
                type: 'number',
                minimum: 12
              }
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
          const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CROSS_CONFLICT')?.metadata ?? {}
          expect(metadata.propertyName1).to.equal('minimum')
          expect(metadata.value1).to.equal(10)
          expect(metadata.propertyName2).to.equal('maximum')
          expect(metadata.value2).to.equal(5)
        })
      })

      it('will find additionalProperties property conflicts for "minimum" and "maximum"', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              {
                additionalProperties: { minimum: 10 }
              },
              {
                additionalProperties: { maximum: 5 }
              }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
          const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CROSS_CONFLICT')?.metadata ?? {}
          expect(metadata.propertyName1).to.equal('minimum')
          expect(metadata.value1).to.equal(10)
          expect(metadata.propertyName2).to.equal('maximum')
          expect(metadata.value2).to.equal(5)
        })
      })

      it('will find item property conflicts for "minimum" and "maximum"', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              {
                items: { minimum: 10 }
              },
              {
                items: { maximum: 5 }
              }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
          const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CROSS_CONFLICT')?.metadata ?? {}
          expect(metadata.propertyName1).to.equal('minimum')
          expect(metadata.value1).to.equal(10)
          expect(metadata.propertyName2).to.equal('maximum')
          expect(metadata.value2).to.equal(5)
        })
      })

      it('cannot be combined with anyOf', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [{ type: 'string' }],
            anyOf: [{ type: 'string' }]
          })
          if (Schema === Schema2) {
            expect(es).to.have.exceptionErrorCode('PROPERTY_UNKNOWN', true)
            const metadata = es.exceptions.find(e => e.code === 'PROPERTY_UNKNOWN')?.metadata ?? {}
            expect(metadata.propertyName).to.equal('anyOf')
          } else {
            expect(es).to.have.exceptionErrorCode('SCHEMA_APPLICATOR_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_APPLICATOR_CONFLICT')?.metadata ?? {}
            expect(metadata.applicators).to.deep.equal(['allOf', 'anyOf'])
          }
        })
      })

      it('cannot be combined with oneOf', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [{ type: 'string' }],
            oneOf: [{ type: 'string' }]
          })
          if (Schema === Schema2) {
            expect(es).to.have.exceptionErrorCode('PROPERTY_UNKNOWN', true)
            const metadata = es.exceptions.find(e => e.code === 'PROPERTY_UNKNOWN')?.metadata ?? {}
            expect(metadata.propertyName).to.equal('oneOf')
          } else {
            expect(es).to.have.exceptionErrorCode('SCHEMA_APPLICATOR_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_APPLICATOR_CONFLICT')?.metadata ?? {}
            expect(metadata.applicators).to.deep.equal(['allOf', 'oneOf'])
          }
        })
      })

      it('cannot be combined with not', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [{ type: 'string' }],
            not: { type: 'boolean' }
          })
          if (Schema === Schema2) {
            expect(es).to.have.exceptionErrorCode('PROPERTY_UNKNOWN', true)
            const metadata = es.exceptions.find(e => e.code === 'PROPERTY_UNKNOWN')?.metadata ?? {}
            expect(metadata.propertyName).to.equal('not')
          } else {
            expect(es).to.have.exceptionErrorCode('SCHEMA_APPLICATOR_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_APPLICATOR_CONFLICT')?.metadata ?? {}
            expect(metadata.applicators).to.deep.equal(['allOf', 'not'])
          }
        })
      })

      it('validates that all items are of the same format', () => {
        test(Schema => {
          const es = Schema.validate({
            allOf: [
              {
                type: 'string',
                format: 'date'
              },
              {
                type: 'string',
                format: 'date-time'
              }
            ]
          })
          expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CONFLICT', true)
          const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CONFLICT')?.metadata ?? {}
          expect(metadata.propertyName).to.equal('format')
        })
      })

      describe('nested allOf schemas', () => {
        it('validates types for single nested schema', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                {
                  allOf: [
                    {
                      type: 'string',
                      maxLength: 20
                    },
                    {
                      type: 'string',
                      maxLength: 15
                    }
                  ]
                },
                { type: 'boolean' }
              ]
            })
            expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CONFLICT')?.metadata ?? {}
            expect(metadata.propertyName).to.equal('type')
          })
        })

        it('validates types for multiple nested schemas', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                {
                  allOf: [
                    {
                      type: 'string',
                      maxLength: 20
                    },
                    {
                      type: 'string',
                      maxLength: 15
                    }
                  ]
                },
                {
                  allOf: [
                    { type: 'boolean' }
                  ]
                }
              ]
            })
            expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CONFLICT')?.metadata ?? {}
            expect(metadata.propertyName).to.equal('type')
          })
        })

        it('validates formats for single nested schema', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                {
                  allOf: [
                    {
                      type: 'string',
                      format: 'date'
                    }
                  ]
                },
                {
                  type: 'string',
                  format: 'date-time'
                }
              ]
            })
            expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CONFLICT')?.metadata ?? {}
            expect(metadata.propertyName).to.equal('format')
          })
        })

        it.only('validates maximum and minimum for single nested schema', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                {
                  allOf: [
                    {
                      type: 'number',
                      minimum: 0,
                      maximum: 5
                    }
                  ]
                },
                {
                  type: 'number',
                  minimum: 10
                }
              ]
            })
            expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CROSS_CONFLICT')?.metadata ?? {}
            expect(metadata.propertyName1).to.equal('minimum')
            expect(metadata.propertyName2).to.equal('maximum')
          })
        })

        it('validates maximum and minimum length for single nested schema', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                {
                  allOf: [
                    {
                      type: 'string',
                      minLength: 0,
                      maxLength: 5
                    }
                  ]
                },
                {
                  type: 'string',
                  minLength: 10
                }
              ]
            })
            expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CROSS_CONFLICT')?.metadata ?? {}
            expect(metadata.propertyName1).to.equal('minLength')
            expect(metadata.propertyName2).to.equal('maxLength')
          })
        })

        it('validates maximum and minimum items for single nested schema', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                {
                  allOf: [
                    {
                      type: 'array',
                      minItems: 0,
                      maxItems: 5,
                      items: { type: 'string' }
                    }
                  ]
                },
                {
                  type: 'array',
                  minItems: 10,
                  items: { type: 'string' }
                }
              ]
            })
            expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CROSS_CONFLICT')?.metadata ?? {}
            expect(metadata.propertyName1).to.equal('minItems')
            expect(metadata.propertyName2).to.equal('maxItems')
          })
        })

        it('validates maximum and minimum properties for single nested schema', () => {
          test(Schema => {
            const es = Schema.validate({
              allOf: [
                {
                  allOf: [
                    {
                      type: 'object',
                      minProperties: 0,
                      maxProperties: 5
                    }
                  ]
                },
                {
                  type: 'object',
                  minProperties: 10
                }
              ]
            })
            expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
            const metadata = es.exceptions.find(e => e.code === 'SCHEMA_ALLOF_CROSS_CONFLICT')?.metadata ?? {}
            expect(metadata.propertyName1).to.equal('minProperties')
            expect(metadata.propertyName2).to.equal('maxProperties')
          })
        })

        // TODO: allOf tests for items, additionalProperites, and properties
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

  describe('getMinMaxConflicts', () => {
    it('will return all locations regardless of conflicts', () => {
      const data = getMinMaxConflicts(
        [
          { node: { minimum: 5 }, key: 'minimum', filter: 'value' },
          { node: { minimum: 10 }, key: 'minimum', filter: 'value' }
        ],
        [
          { node: { maximum: 8 }, key: 'maximum', filter: 'value' }
        ]
      )
      expect(data.locations).to.have.length(3)
    })

    it('will not return conflict related data if there are no conflicts', () => {
      const data = getMinMaxConflicts(
        [
          { node: { minimum: 5 }, key: 'minimum', filter: 'value' }
        ],
        [
          { node: { maximum: 8 }, key: 'maximum', filter: 'value' }
        ]
      )
      expect(data.hasConflict).to.equal(false)
      expect(data).not.to.haveOwnProperty('lowestMaximum')
      expect(data).not.to.haveOwnProperty('highestMinimum')
      expect(data).not.to.haveOwnProperty('conflictingMinimumLocations')
      expect(data).not.to.haveOwnProperty('conflictingMaximumLocations')
    })

    it('will return conflict related data if there are conflicts', () => {
      const data = getMinMaxConflicts(
        [
          { node: { minimum: 5 }, key: 'minimum', filter: 'value' },
          { node: { minimum: 10 }, key: 'minimum', filter: 'value' }
        ],
        [
          { node: { maximum: 8 }, key: 'maximum', filter: 'value' }
        ]
      )
      expect(data.hasConflict).to.equal(true)
      expect(data).to.haveOwnProperty('lowestMaximum')
      expect(data).to.haveOwnProperty('highestMinimum')
      expect(data).to.haveOwnProperty('conflictingMinimumLocations')
      expect(data).to.haveOwnProperty('conflictingMaximumLocations')
    })

    it('will identify the highest minimum and lowest maximum without exclusives', () => {
      const data = getMinMaxConflicts(
        [
          { node: { minimum: 9 }, key: 'minimum', filter: 'value' },
          { node: { minimum: 10 }, key: 'minimum', filter: 'value' },
          { node: { minimum: 5 }, key: 'minimum', filter: 'value' }
        ],
        [
          { node: { maximum: 8 }, key: 'maximum', filter: 'value' },
          { node: { maximum: 8 }, key: 'maximum', filter: 'value' },
          { node: { maximum: 18 }, key: 'maximum', filter: 'value' }
        ]
      )
      expect(data.hasConflict).to.equal(true)
      expect(data.highestMinimum?.value).to.equal(10)
      expect(data.highestMinimum?.exclusive).to.equal(false)
      expect(data.lowestMaximum?.value).to.equal(8)
      expect(data.lowestMaximum?.exclusive).to.equal(false)
    })

    it('will identify the highest minimum and lowest maximum with exclusives', () => {
      const data = getMinMaxConflicts(
        [
          { node: { minimum: 7 }, key: 'minimum', filter: 'value' },
          { node: { minimum: 10 }, key: 'minimum', filter: 'value' },
          { node: { minimum: 10, exclusiveMinimum: true }, key: 'minimum', filter: 'value' },
          { node: { minimum: 5 }, key: 'minimum', filter: 'value' }
        ],
        [
          { node: { maximum: 8 }, key: 'maximum', filter: 'value' },
          { node: { maximum: 8, exclusiveMaximum: true }, key: 'maximum', filter: 'value' },
          { node: { maximum: 18 }, key: 'maximum', filter: 'value' }
        ]
      )
      expect(data.hasConflict).to.equal(true)
      expect(data.highestMinimum?.value).to.equal(10)
      expect(data.highestMinimum?.exclusive).to.equal(true)
      expect(data.highestMinimum?.definition).to.deep.equal({ minimum: 10, exclusiveMinimum: true })
      expect(data.lowestMaximum?.value).to.equal(8)
      expect(data.lowestMaximum?.exclusive).to.equal(true)
      expect(data.lowestMaximum?.definition).to.deep.equal({ maximum: 8, exclusiveMaximum: true })
    })
  })
})
