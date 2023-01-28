import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Schema', () => {
    describe('v2', () => {
      const Schema = E.Schema2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Schema.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Schema.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: format', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            format: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: title', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            title: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: default', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            default: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            default: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            default: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            default: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Schema.createDefinition({
            default: []
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Schema.createDefinition({
            default: {}
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: maximum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maximum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: exclusiveMaximum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            exclusiveMaximum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minimum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minimum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: exclusiveMinimum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            exclusiveMinimum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxLength', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maxLength: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minLength', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minLength: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: pattern', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            pattern: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxItems', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maxItems: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minItems', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minItems: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxProperties', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maxProperties: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minProperties', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minProperties: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: uniqueItems', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            uniqueItems: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: enum', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            enum: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            enum: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            enum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            enum: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Schema.createDefinition({
            enum: [[]]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Schema.createDefinition({
            enum: [{}]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: multipleOf', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            multipleOf: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: required', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an array of  string', () => {
          const def = Schema.createDefinition({
            required: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an array of  boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: { x: ['value'] }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: type', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            type: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: items', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: allOf', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            allOf: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: { x: ['value'] }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: properties', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            properties: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: additionalProperties', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            additionalProperties: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })



        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            additionalProperties: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: discriminator', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            discriminator: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: readOnly', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            readOnly: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: xml', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Xml', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Xml', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: externalDocs', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ExternalDocumentation', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped ExternalDocumentation', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: example', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            example: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            example: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            example: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            example: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Schema.createDefinition({
            example: []
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Schema.createDefinition({
            example: {}
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })
    })

    describe('v3', () => {
      const Schema = E.Schema3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Schema.createDefinition()
          const { hasErrorByCode } = Schema.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Schema.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Schema.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: type', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            type: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            type: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: allOf', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            allOf: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            allOf: { x: ['value'] }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: oneOf', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            oneOf: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            oneOf: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            oneOf: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            oneOf: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            oneOf: { x: ['value'] }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: anyOf', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            anyOf: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            anyOf: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            anyOf: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            anyOf: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            anyOf: { x: ['value'] }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: not', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            not: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            not: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            not: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            not: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            not: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            not: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: title', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            title: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            title: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maximum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maximum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maximum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: exclusiveMaximum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            exclusiveMaximum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMaximum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minimum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minimum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minimum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: exclusiveMinimum', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            exclusiveMinimum: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            exclusiveMinimum: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxLength', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maxLength: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxLength: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minLength', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minLength: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minLength: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: pattern', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            pattern: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            pattern: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxItems', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maxItems: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxItems: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minItems', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minItems: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minItems: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: maxProperties', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            maxProperties: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            maxProperties: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: minProperties', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            minProperties: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            minProperties: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: uniqueItems', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            uniqueItems: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            uniqueItems: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: enum', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            enum: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            enum: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            enum: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            enum: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Schema.createDefinition({
            enum: [[]]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Schema.createDefinition({
            enum: [{}]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: multipleOf', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            multipleOf: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            multipleOf: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: required', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an array of  string', () => {
          const def = Schema.createDefinition({
            required: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an array of  boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: [0]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            required: { x: ['value'] }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: items', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            items: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            items: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: properties', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            properties: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: { x: 0 }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            properties: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: additionalProperties', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            additionalProperties: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })



        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            additionalProperties: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            additionalProperties: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: format', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            format: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            format: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: default', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            default: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            default: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            default: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            default: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Schema.createDefinition({
            default: []
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Schema.createDefinition({
            default: {}
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: nullable', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            nullable: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            nullable: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            nullable: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            nullable: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            nullable: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            nullable: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: discriminator', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Discriminator', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Discriminator', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            discriminator: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: readOnly', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            readOnly: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            readOnly: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: writeOnly', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            writeOnly: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            writeOnly: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            writeOnly: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            writeOnly: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            writeOnly: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            writeOnly: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: xml', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Xml', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Xml', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            xml: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: externalDocs', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ExternalDocumentation', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: ['value']
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped ExternalDocumentation', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            externalDocs: { x: 'value' }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: example', () => {
        it('can be a $ref', () => {
          const def = Schema.createDefinition({
            example: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            example: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Schema.createDefinition({
            example: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Schema.createDefinition({
            example: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Schema.createDefinition({
            example: []
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Schema.createDefinition({
            example: {}
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: deprecated', () => {
        it('should not be a $ref', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            deprecated: { $ref: '#/' }
          })
          const { hasWarningByCode } = Schema.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Schema.createDefinition({
            deprecated: true
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            deprecated: 0
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            deprecated: 'value'
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            deprecated: [true]
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Schema.createDefinition({
            // @ts-expect-error
            deprecated: { x: true }
          })
          const { hasErrorByCode } = Schema.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
