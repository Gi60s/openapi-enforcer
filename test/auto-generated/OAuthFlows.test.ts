/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('OAuthFlows - Auto Generated Tests', () => {
  describe('v3', () => {
    const OAuthFlows = E.OAuthFlows3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = OAuthFlows.createDefinition()
        const es = OAuthFlows.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = OAuthFlows.createDefinition()
        const es = OAuthFlows.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = OAuthFlows.createDefinition()
        const es = OAuthFlows.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = OAuthFlows.createDefinition()
        const es = OAuthFlows.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = OAuthFlows.createDefinition()
        const es = OAuthFlows.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = OAuthFlows.createDefinition()
        // @ts-expect-error
        const es = OAuthFlows.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: implicit', () => {
      it('should not be a $ref', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          implicit: { $ref: '#/' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          implicit: true
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          implicit: 0
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          implicit: 'value'
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
            implicit: ['value']
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          implicit: { x: 'value' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: password', () => {
      it('should not be a $ref', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          password: { $ref: '#/' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          password: true
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          password: 0
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          password: 'value'
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
            password: ['value']
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          password: { x: 'value' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: clientCredentials', () => {
      it('should not be a $ref', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          clientCredentials: { $ref: '#/' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          clientCredentials: true
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          clientCredentials: 0
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          clientCredentials: 'value'
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
            clientCredentials: ['value']
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          clientCredentials: { x: 'value' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: authorizationCode', () => {
      it('should not be a $ref', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          authorizationCode: { $ref: '#/' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          authorizationCode: true
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          authorizationCode: 0
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          authorizationCode: 'value'
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
            authorizationCode: ['value']
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped OAuth Flow', () => {
        const def = OAuthFlows.createDefinition({
          // @ts-expect-error
          authorizationCode: { x: 'value' }
        })
        const es = OAuthFlows.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
