/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Xml - Auto Generated Tests', () => {
  describe('v2', () => {
    const Xml = E.Xml2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Xml.createDefinition()
        // @ts-expect-error
        const es = Xml.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: name', () => {

      it('can be a string', () => {
        const def = Xml.createDefinition({
          name: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          name: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          name: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            name: ['value']
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          name: { x: 'value' }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: namespace', () => {

      it('can be a string', () => {
        const def = Xml.createDefinition({
          namespace: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          namespace: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          namespace: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            namespace: ['value']
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          namespace: { x: 'value' }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: prefix', () => {

      it('can be a string', () => {
        const def = Xml.createDefinition({
          prefix: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          prefix: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          prefix: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            prefix: ['value']
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          prefix: { x: 'value' }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: attribute', () => {

      it('can be a boolean', () => {
        const def = Xml.createDefinition({
          attribute: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          attribute: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          attribute: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            attribute: [true]
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          attribute: { x: true }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: wrapped', () => {

      it('can be a boolean', () => {
        const def = Xml.createDefinition({
          wrapped: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          wrapped: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          wrapped: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            wrapped: [true]
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          wrapped: { x: true }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })

  describe('v3', () => {
    const Xml = E.Xml3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Xml.createDefinition()
        const es = Xml.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Xml.createDefinition()
        // @ts-expect-error
        const es = Xml.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: name', () => {

      it('can be a string', () => {
        const def = Xml.createDefinition({
          name: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          name: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          name: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            name: ['value']
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          name: { x: 'value' }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: namespace', () => {

      it('can be a string', () => {
        const def = Xml.createDefinition({
          namespace: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          namespace: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          namespace: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            namespace: ['value']
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          namespace: { x: 'value' }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: prefix', () => {

      it('can be a string', () => {
        const def = Xml.createDefinition({
          prefix: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          prefix: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          prefix: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            prefix: ['value']
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          prefix: { x: 'value' }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: attribute', () => {

      it('can be a boolean', () => {
        const def = Xml.createDefinition({
          attribute: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          attribute: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          attribute: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            attribute: [true]
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          attribute: { x: true }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: wrapped', () => {

      it('can be a boolean', () => {
        const def = Xml.createDefinition({
          wrapped: true
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          wrapped: 0
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          wrapped: 'value'
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
            wrapped: [true]
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Xml.createDefinition({
          // @ts-expect-error
          wrapped: { x: true }
        })
        const es = Xml.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
