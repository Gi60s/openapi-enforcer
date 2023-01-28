import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Example', () => {
    describe('v2', () => {
      const Example = E.Example2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Example.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Example.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const Example = E.Example3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Example.createDefinition()
          const { hasErrorByCode } = Example.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Example.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Example.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: summary', () => {
        it('should not be a $ref', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            summary: { $ref: '#/' }
          })
          const { hasWarningByCode } = Example.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Example.createDefinition({
            summary: 'value'
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            summary: true
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            summary: 0
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            summary: ['value']
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            summary: { x: 'value' }
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Example.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Example.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: value', () => {
        it('can be a $ref', () => {
          const def = Example.createDefinition({
            value: { $ref: '#/' }
          })
          const { hasWarningByCode } = Example.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Example.createDefinition({
            value: true
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Example.createDefinition({
            value: 0
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Example.createDefinition({
            value: 'value'
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Example.createDefinition({
            value: []
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Example.createDefinition({
            value: {}
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: externalValue', () => {
        it('should not be a $ref', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            externalValue: { $ref: '#/' }
          })
          const { hasWarningByCode } = Example.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Example.createDefinition({
            externalValue: 'value'
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            externalValue: true
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            externalValue: 0
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            externalValue: ['value']
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Example.createDefinition({
            // @ts-expect-error
            externalValue: { x: 'value' }
          })
          const { hasErrorByCode } = Example.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
