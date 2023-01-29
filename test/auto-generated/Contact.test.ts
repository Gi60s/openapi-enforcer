/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Contact - Auto Generated Tests', () => {
  describe('v2', () => {
    const Contact = E.Contact2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Contact.createDefinition()
        // @ts-expect-error
        const es = Contact.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: name', () => {

      it('can be a string', () => {
        const def = Contact.createDefinition({
          name: 'value'
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          name: true
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          name: 0
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
            name: ['value']
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          name: { x: 'value' }
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: url', () => {

      it('can be a string', () => {
        const def = Contact.createDefinition({
          url: 'value'
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          url: true
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          url: 0
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
            url: ['value']
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          url: { x: 'value' }
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: email', () => {

      it('can be a string', () => {
        const def = Contact.createDefinition({
          email: 'value'
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          email: true
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          email: 0
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
            email: ['value']
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          email: { x: 'value' }
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })

  describe('v3', () => {
    const Contact = E.Contact3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Contact.createDefinition()
        const es = Contact.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Contact.createDefinition()
        // @ts-expect-error
        const es = Contact.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: name', () => {

      it('can be a string', () => {
        const def = Contact.createDefinition({
          name: 'value'
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          name: true
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          name: 0
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
            name: ['value']
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          name: { x: 'value' }
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: url', () => {

      it('can be a string', () => {
        const def = Contact.createDefinition({
          url: 'value'
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          url: true
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          url: 0
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
            url: ['value']
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          url: { x: 'value' }
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: email', () => {

      it('can be a string', () => {
        const def = Contact.createDefinition({
          email: 'value'
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          email: true
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          email: 0
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
            email: ['value']
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Contact.createDefinition({
          // @ts-expect-error
          email: { x: 'value' }
        })
        const es = Contact.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
