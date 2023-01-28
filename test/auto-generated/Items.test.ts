import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Items', () => {
    describe('v2', () => {
      const Items = E.Items2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Items.createDefinition()
          const { hasErrorByCode } = Items.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Items.createDefinition()
          const { hasErrorByCode } = Items.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Items.createDefinition()
          const { hasErrorByCode } = Items.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Items.createDefinition()
          const { hasErrorByCode } = Items.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Items.createDefinition()
          const { hasErrorByCode } = Items.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Items.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Items.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: type', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            type: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "array"', () => {
          const def = Items.createDefinition({
            type: 'array'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "boolean"', () => {
          const def = Items.createDefinition({
            type: 'boolean'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "integer"', () => {
          const def = Items.createDefinition({
            type: 'integer'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "number"', () => {
          const def = Items.createDefinition({
            type: 'number'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "string"', () => {
          const def = Items.createDefinition({
            type: 'string'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: format', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            format: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Items.createDefinition({
            format: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            format: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            format: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            format: ['value']
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            format: { x: 'value' }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: items', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            items: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            items: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            items: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            items: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Items', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            items: ['value']
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Items', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            items: { x: 'value' }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: collectionFormat', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            collectionFormat: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "csv"', () => {
          const def = Items.createDefinition({
            collectionFormat: 'csv'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "ssv"', () => {
          const def = Items.createDefinition({
            collectionFormat: 'ssv'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "tsv"', () => {
          const def = Items.createDefinition({
            collectionFormat: 'tsv'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "pipes"', () => {
          const def = Items.createDefinition({
            collectionFormat: 'pipes'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: default', () => {
        it('can be a $ref', () => {
          const def = Items.createDefinition({
            default: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Items.createDefinition({
            default: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            default: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Items.createDefinition({
            default: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Items.createDefinition({
            default: []
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Items.createDefinition({
            default: {}
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: maximum', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maximum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            maximum: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maximum: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maximum: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maximum: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maximum: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: exclusiveMaximum', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Items.createDefinition({
            exclusiveMaximum: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: [true]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: { x: true }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minimum', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minimum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            minimum: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minimum: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minimum: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minimum: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minimum: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: exclusiveMinimum', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            exclusiveMinimum: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxLength', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxLength: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            maxLength: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxLength: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxLength: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxLength: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxLength: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minLength', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minLength: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            minLength: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minLength: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minLength: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minLength: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minLength: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: pattern', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            pattern: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Items.createDefinition({
            pattern: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            pattern: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            pattern: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            pattern: ['value']
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            pattern: { x: 'value' }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxItems', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            maxItems: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxItems: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxItems: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxItems: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            maxItems: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minItems', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            minItems: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minItems: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minItems: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minItems: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            minItems: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: uniqueItems', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            uniqueItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Items.createDefinition({
            uniqueItems: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            uniqueItems: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            uniqueItems: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            uniqueItems: [true]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            uniqueItems: { x: true }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: enum', () => {
        it('can be a $ref', () => {
          const def = Items.createDefinition({
            enum: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Items.createDefinition({
            enum: [true]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            enum: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Items.createDefinition({
            enum: ['value']
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Items.createDefinition({
            enum: [[]]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Items.createDefinition({
            enum: [{}]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: multipleOf', () => {
        it('should not be a $ref', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            multipleOf: { $ref: '#/' }
          })
          const { hasWarningByCode } = Items.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Items.createDefinition({
            multipleOf: 0
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            multipleOf: true
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            multipleOf: 'value'
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            multipleOf: [0]
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Items.createDefinition({
            // @ts-expect-error
            multipleOf: { x: 0 }
          })
          const { hasErrorByCode } = Items.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
