import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('License', () => {
    describe('v2', () => {
      const License = E.License2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = License.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = License.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: name', () => {
        it('should not be a $ref', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: { $ref: '#/' }
          })
          const { hasWarningByCode } = License.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = License.createDefinition({
            name: 'value'
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: true
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: 0
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: ['value']
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: { x: 'value' }
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: url', () => {
        it('should not be a $ref', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: { $ref: '#/' }
          })
          const { hasWarningByCode } = License.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = License.createDefinition({
            url: 'value'
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: true
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: 0
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: ['value']
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: { x: 'value' }
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const License = E.License3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = License.createDefinition()
          const { hasErrorByCode } = License.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = License.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = License.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: name', () => {
        it('should not be a $ref', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: { $ref: '#/' }
          })
          const { hasWarningByCode } = License.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = License.createDefinition({
            name: 'value'
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: true
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: 0
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: ['value']
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            name: { x: 'value' }
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: url', () => {
        it('should not be a $ref', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: { $ref: '#/' }
          })
          const { hasWarningByCode } = License.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = License.createDefinition({
            url: 'value'
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: true
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: 0
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: ['value']
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = License.createDefinition({
            // @ts-expect-error
            url: { x: 'value' }
          })
          const { hasErrorByCode } = License.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
