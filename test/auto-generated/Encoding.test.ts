/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Encoding - Auto Generated Tests', () => {
  describe('v3', () => {
    const Encoding = E.Encoding3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Encoding.createDefinition()
        const es = Encoding.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Encoding.createDefinition()
        const es = Encoding.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Encoding.createDefinition()
        const es = Encoding.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Encoding.createDefinition()
        const es = Encoding.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Encoding.createDefinition()
        const es = Encoding.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Encoding.createDefinition()
        // @ts-expect-error
        const es = Encoding.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: contentType', () => {

      it('can be a string', () => {
        const def = Encoding.createDefinition({
          contentType: 'value'
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          contentType: true
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          contentType: 0
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
            contentType: ['value']
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          contentType: { x: 'value' }
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: headers', () => {
      it('can be a $ref', () => {
        const def = Encoding.createDefinition({
          headers: { x: { $ref: '#/' } }
        })
        const es = Encoding.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          headers: { x: true }
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          headers: { x: 0 }
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          headers: { x: 'value' }
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Header', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
            headers: [{ x: 'value' }]
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: style', () => {

      it('can be a string', () => {
        const def = Encoding.createDefinition({
          style: 'value'
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          style: true
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          style: 0
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
            style: ['value']
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          style: { x: 'value' }
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: explode', () => {

      it('can be a boolean', () => {
        const def = Encoding.createDefinition({
          explode: true
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          explode: 0
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          explode: 'value'
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
            explode: [true]
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          explode: { x: true }
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allowReserved', () => {

      it('can be a boolean', () => {
        const def = Encoding.createDefinition({
          allowReserved: true
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          allowReserved: 0
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          allowReserved: 'value'
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
            allowReserved: [true]
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Encoding.createDefinition({
          // @ts-expect-error
          allowReserved: { x: true }
        })
        const es = Encoding.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
