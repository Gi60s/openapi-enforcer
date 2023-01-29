/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('ServerVariable - Auto Generated Tests', () => {
  describe('v3', () => {
    const ServerVariable = E.ServerVariable3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = ServerVariable.createDefinition()
        const es = ServerVariable.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = ServerVariable.createDefinition()
        const es = ServerVariable.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = ServerVariable.createDefinition()
        const es = ServerVariable.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = ServerVariable.createDefinition()
        const es = ServerVariable.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = ServerVariable.createDefinition()
        const es = ServerVariable.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = ServerVariable.createDefinition()
        // @ts-expect-error
        const es = ServerVariable.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: enum', () => {

      it('can be an array of  string', () => {
        const def = ServerVariable.createDefinition({
          enum: ['value']
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be an array of  boolean', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          enum: [true]
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          enum: [0]
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          enum: { x: ['value'] }
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: default', () => {

      it('can be a string', () => {
        const def = ServerVariable.createDefinition({
          default: 'value'
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          default: true
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          default: 0
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
            default: ['value']
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          default: { x: 'value' }
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = ServerVariable.createDefinition({
          description: 'value'
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = ServerVariable.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = ServerVariable.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
