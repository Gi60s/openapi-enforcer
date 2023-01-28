import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('MediaType', () => {
    describe('v3', () => {
      const MediaType = E.MediaType3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = MediaType.createDefinition()
          const { hasErrorByCode } = MediaType.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = MediaType.createDefinition()
          const { hasErrorByCode } = MediaType.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = MediaType.createDefinition()
          const { hasErrorByCode } = MediaType.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = MediaType.createDefinition()
          const { hasErrorByCode } = MediaType.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = MediaType.createDefinition()
          const { hasErrorByCode } = MediaType.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = MediaType.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = MediaType.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: schema', () => {
        it('can be a $ref', () => {
          const def = MediaType.createDefinition({
            schema: { $ref: '#/' }
          })
          const { hasWarningByCode } = MediaType.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be a boolean', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            schema: true
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            schema: 0
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            schema: 'value'
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            schema: ['value']
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            schema: { x: 'value' }
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: example', () => {
        it('can be a $ref', () => {
          const def = MediaType.createDefinition({
            example: { $ref: '#/' }
          })
          const { hasWarningByCode } = MediaType.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = MediaType.createDefinition({
            example: true
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = MediaType.createDefinition({
            example: 0
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = MediaType.createDefinition({
            example: 'value'
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = MediaType.createDefinition({
            example: []
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = MediaType.createDefinition({
            example: {}
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: examples', () => {
        it('can be a $ref', () => {
          const def = MediaType.createDefinition({
            examples: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = MediaType.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            examples: { x: true }
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            examples: { x: 0 }
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            examples: { x: 'value' }
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Example', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            examples: [{ x: 'value' }]
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: encoding', () => {
        it('should not be a $ref', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            encoding: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = MediaType.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            encoding: { x: true }
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            encoding: { x: 0 }
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            encoding: { x: 'value' }
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Encoding', () => {
          const def = MediaType.createDefinition({
            // @ts-expect-error
            encoding: [{ x: 'value' }]
          })
          const { hasErrorByCode } = MediaType.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
