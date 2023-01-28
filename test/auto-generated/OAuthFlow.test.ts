import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('OAuthFlow', () => {
    describe('v3', () => {
      const OAuthFlow = E.OAuthFlow3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = OAuthFlow.createDefinition()
          const { hasErrorByCode } = OAuthFlow.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = OAuthFlow.createDefinition()
          const { hasErrorByCode } = OAuthFlow.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = OAuthFlow.createDefinition()
          const { hasErrorByCode } = OAuthFlow.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = OAuthFlow.createDefinition()
          const { hasErrorByCode } = OAuthFlow.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = OAuthFlow.createDefinition()
          const { hasErrorByCode } = OAuthFlow.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = OAuthFlow.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = OAuthFlow.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: authorizationUrl', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            authorizationUrl: { $ref: '#/' }
          })
          const { hasWarningByCode } = OAuthFlow.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = OAuthFlow.createDefinition({
            authorizationUrl: 'value'
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            authorizationUrl: true
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            authorizationUrl: 0
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            authorizationUrl: ['value']
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            authorizationUrl: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: tokenUrl', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            tokenUrl: { $ref: '#/' }
          })
          const { hasWarningByCode } = OAuthFlow.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = OAuthFlow.createDefinition({
            tokenUrl: 'value'
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            tokenUrl: true
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            tokenUrl: 0
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            tokenUrl: ['value']
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            tokenUrl: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: refreshUrl', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            refreshUrl: { $ref: '#/' }
          })
          const { hasWarningByCode } = OAuthFlow.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = OAuthFlow.createDefinition({
            refreshUrl: 'value'
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            refreshUrl: true
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            refreshUrl: 0
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            refreshUrl: ['value']
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            refreshUrl: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: scopes', () => {
        it('should not be a $ref', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            scopes: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = OAuthFlow.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an object of mapped string', () => {
          const def = OAuthFlow.createDefinition({
            scopes: { x: 'value' }
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an object of mapped boolean', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            scopes: { x: true }
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            scopes: { x: 0 }
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = OAuthFlow.createDefinition({
            // @ts-expect-error
            scopes: [{ x: 'value' }]
          })
          const { hasErrorByCode } = OAuthFlow.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
