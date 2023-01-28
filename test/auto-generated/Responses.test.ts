import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Responses', () => {
    describe('v2', () => {
      const Responses = E.Responses2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Responses.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Responses.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: default', () => {
        it('can be a $ref', () => {
          const def = Responses.createDefinition({
            default: { $ref: '#/' }
          })
          const { hasWarningByCode } = Responses.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be a boolean', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: true
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: 0
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: 'value'
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Response', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: ['value']
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Response', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: { x: 'value' }
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const Responses = E.Responses3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Responses.createDefinition()
          const { hasErrorByCode } = Responses.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Responses.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Responses.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: default', () => {
        it('can be a $ref', () => {
          const def = Responses.createDefinition({
            default: { $ref: '#/' }
          })
          const { hasWarningByCode } = Responses.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be a boolean', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: true
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: 0
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: 'value'
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Response', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: ['value']
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Response', () => {
          const def = Responses.createDefinition({
            // @ts-expect-error
            default: { x: 'value' }
          })
          const { hasErrorByCode } = Responses.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
