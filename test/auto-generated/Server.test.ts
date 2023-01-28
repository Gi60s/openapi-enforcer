import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Server', () => {
    describe('v3', () => {
      const Server = E.Server3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Server.createDefinition()
          const { hasErrorByCode } = Server.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Server.createDefinition()
          const { hasErrorByCode } = Server.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Server.createDefinition()
          const { hasErrorByCode } = Server.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Server.createDefinition()
          const { hasErrorByCode } = Server.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Server.createDefinition()
          const { hasErrorByCode } = Server.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Server.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Server.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: url', () => {
        it('should not be a $ref', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            url: { $ref: '#/' }
          })
          const { hasWarningByCode } = Server.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Server.createDefinition({
            url: 'value'
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            url: true
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            url: 0
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            url: ['value']
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            url: { x: 'value' }
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Server.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Server.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: variables', () => {
        it('should not be a $ref', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            variables: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Server.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            variables: { x: true }
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            variables: { x: 0 }
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            variables: { x: 'value' }
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ServerVariable', () => {
          const def = Server.createDefinition({
            // @ts-expect-error
            variables: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Server.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
