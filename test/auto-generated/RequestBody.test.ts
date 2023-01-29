/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('RequestBody - Auto Generated Tests', () => {
  describe('v3', () => {
    const RequestBody = E.RequestBody3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = RequestBody.createDefinition()
        const es = RequestBody.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = RequestBody.createDefinition()
        const es = RequestBody.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = RequestBody.createDefinition()
        const es = RequestBody.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = RequestBody.createDefinition()
        const es = RequestBody.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = RequestBody.createDefinition()
        const es = RequestBody.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = RequestBody.createDefinition()
        // @ts-expect-error
        const es = RequestBody.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = RequestBody.createDefinition({
          description: 'value'
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: content', () => {
      it('should not be a $ref', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          content: { x: { $ref: '#/' } }
        })
        const es = RequestBody.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          content: { x: true }
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          content: { x: 0 }
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          content: { x: 'value' }
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of MediaType', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
            content: [{ x: 'value' }]
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: required', () => {

      it('can be a boolean', () => {
        const def = RequestBody.createDefinition({
          required: true
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          required: 0
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          required: 'value'
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
            required: [true]
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = RequestBody.createDefinition({
          // @ts-expect-error
          required: { x: true }
        })
        const es = RequestBody.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
