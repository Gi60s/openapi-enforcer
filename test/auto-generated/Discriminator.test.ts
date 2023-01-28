import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Discriminator', () => {
    describe('v3', () => {
      const Discriminator = E.Discriminator3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Discriminator.createDefinition()
          const { hasErrorByCode } = Discriminator.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Discriminator.createDefinition()
          const { hasErrorByCode } = Discriminator.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Discriminator.createDefinition()
          const { hasErrorByCode } = Discriminator.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Discriminator.createDefinition()
          const { hasErrorByCode } = Discriminator.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Discriminator.createDefinition()
          const { hasErrorByCode } = Discriminator.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Discriminator.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Discriminator.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: propertyName', () => {
        it('should not be a $ref', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            propertyName: { $ref: '#/' }
          })
          const { hasWarningByCode } = Discriminator.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Discriminator.createDefinition({
            propertyName: 'value'
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            propertyName: true
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            propertyName: 0
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            propertyName: ['value']
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            propertyName: { x: 'value' }
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: mapping', () => {
        it('should not be a $ref', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            mapping: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Discriminator.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an object of mapped string', () => {
          const def = Discriminator.createDefinition({
            mapping: { x: 'value' }
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an object of mapped boolean', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            mapping: { x: true }
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            mapping: { x: 0 }
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Discriminator.createDefinition({
            // @ts-expect-error
            mapping: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Discriminator.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
