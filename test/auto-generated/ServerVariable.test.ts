import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('ServerVariable', () => {
    describe('v3', () => {
      const ServerVariable = E.ServerVariable3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = ServerVariable.createDefinition()
          const { hasErrorByCode } = ServerVariable.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = ServerVariable.createDefinition()
          const { hasErrorByCode } = ServerVariable.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = ServerVariable.createDefinition()
          const { hasErrorByCode } = ServerVariable.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = ServerVariable.createDefinition()
          const { hasErrorByCode } = ServerVariable.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = ServerVariable.createDefinition()
          const { hasErrorByCode } = ServerVariable.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = ServerVariable.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = ServerVariable.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: enum', () => {
        it('should not be a $ref', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            enum: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = ServerVariable.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an array of  string', () => {
          const def = ServerVariable.createDefinition({
            enum: ['value']
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an array of  boolean', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            enum: [true]
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            enum: [0]
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            enum: { x: ['value'] }
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: default', () => {
        it('should not be a $ref', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            default: { $ref: '#/' }
          })
          const { hasWarningByCode } = ServerVariable.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = ServerVariable.createDefinition({
            default: 'value'
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            default: true
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            default: 0
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            default: ['value']
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            default: { x: 'value' }
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = ServerVariable.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = ServerVariable.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = ServerVariable.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = ServerVariable.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
