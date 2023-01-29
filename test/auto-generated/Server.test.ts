/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Server - Auto Generated Tests', () => {
  describe('v3', () => {
    const Server = E.Server3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Server.createDefinition()
        const es = Server.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Server.createDefinition()
        const es = Server.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Server.createDefinition()
        const es = Server.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Server.createDefinition()
        const es = Server.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Server.createDefinition()
        const es = Server.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Server.createDefinition()
        // @ts-expect-error
        const es = Server.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: url', () => {

      it('can be a string', () => {
        const def = Server.createDefinition({
          url: 'value'
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          url: true
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          url: 0
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
            url: ['value']
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          url: { x: 'value' }
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Server.createDefinition({
          description: 'value'
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: variables', () => {
      it('should not be a $ref', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          variables: { x: { $ref: '#/' } }
        })
        const es = Server.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          variables: { x: true }
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          variables: { x: 0 }
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
          variables: { x: 'value' }
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of ServerVariable', () => {
        const def = Server.createDefinition({
          // @ts-expect-error
            variables: [{ x: 'value' }]
        })
        const es = Server.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
