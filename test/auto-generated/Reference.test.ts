import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Reference', () => {
    describe('v2', () => {
      const Reference = E.Reference2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Reference.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Reference.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: $ref', () => {
        it('should not be a $ref', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: { $ref: '#/' }
          })
          const { hasWarningByCode } = Reference.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Reference.createDefinition({
            $ref: 'value'
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: true
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: 0
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: ['value']
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: { x: 'value' }
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const Reference = E.Reference3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Reference.createDefinition()
          const { hasErrorByCode } = Reference.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Reference.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Reference.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: $ref', () => {
        it('should not be a $ref', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: { $ref: '#/' }
          })
          const { hasWarningByCode } = Reference.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Reference.createDefinition({
            $ref: 'value'
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: true
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: 0
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: ['value']
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Reference.createDefinition({
            // @ts-expect-error
            $ref: { x: 'value' }
          })
          const { hasErrorByCode } = Reference.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
