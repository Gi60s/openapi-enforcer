import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('RequestBody', () => {
    describe('v3', () => {
      const RequestBody = E.RequestBody3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = RequestBody.createDefinition()
          const { hasErrorByCode } = RequestBody.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = RequestBody.createDefinition()
          const { hasErrorByCode } = RequestBody.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = RequestBody.createDefinition()
          const { hasErrorByCode } = RequestBody.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = RequestBody.createDefinition()
          const { hasErrorByCode } = RequestBody.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = RequestBody.createDefinition()
          const { hasErrorByCode } = RequestBody.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = RequestBody.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = RequestBody.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = RequestBody.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = RequestBody.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: content', () => {
        it('should not be a $ref', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            content: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = RequestBody.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            content: { x: true }
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            content: { x: 0 }
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            content: { x: 'value' }
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of MediaType', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            content: [{ x: 'value' }]
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: required', () => {
        it('should not be a $ref', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            required: { $ref: '#/' }
          })
          const { hasWarningByCode } = RequestBody.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = RequestBody.createDefinition({
            required: true
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            required: 0
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            required: 'value'
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            required: [true]
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = RequestBody.createDefinition({
            // @ts-expect-error
            required: { x: true }
          })
          const { hasErrorByCode } = RequestBody.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
