import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('OAuthFlows', () => {
    describe('v3', () => {
      const OAuthFlows = E.OAuthFlows3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = OAuthFlows.createDefinition()
          const { hasErrorByCode } = OAuthFlows.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = OAuthFlows.createDefinition()
          const { hasErrorByCode } = OAuthFlows.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = OAuthFlows.createDefinition()
          const { hasErrorByCode } = OAuthFlows.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = OAuthFlows.createDefinition()
          const { hasErrorByCode } = OAuthFlows.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = OAuthFlows.createDefinition()
          const { hasErrorByCode } = OAuthFlows.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = OAuthFlows.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = OAuthFlows.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: implicit', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            implicit: { $ref: '#/' }
          })
          const { hasWarningByCode } = OAuthFlows.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            implicit: true
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            implicit: 0
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            implicit: 'value'
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            implicit: ['value']
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            implicit: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: password', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            password: { $ref: '#/' }
          })
          const { hasWarningByCode } = OAuthFlows.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            password: true
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            password: 0
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            password: 'value'
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            password: ['value']
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            password: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: clientCredentials', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            clientCredentials: { $ref: '#/' }
          })
          const { hasWarningByCode } = OAuthFlows.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            clientCredentials: true
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            clientCredentials: 0
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            clientCredentials: 'value'
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            clientCredentials: ['value']
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            clientCredentials: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: authorizationCode', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            authorizationCode: { $ref: '#/' }
          })
          const { hasWarningByCode } = OAuthFlows.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            authorizationCode: true
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            authorizationCode: 0
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            authorizationCode: 'value'
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            authorizationCode: ['value']
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped OAuth Flow', () => {
          const def = OAuthFlows.createDefinition({
            // @ts-expect-error
            authorizationCode: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlows.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
