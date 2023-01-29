/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Example - Auto Generated Tests', () => {
  describe('v2', () => {
    const Example = E.Example2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Example.createDefinition()
        // @ts-expect-error
        const es = Example.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })
  })

  describe('v3', () => {
    const Example = E.Example3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Example.createDefinition()
        const es = Example.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Example.createDefinition()
        // @ts-expect-error
        const es = Example.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: summary', () => {

      it('can be a string', () => {
        const def = Example.createDefinition({
          summary: 'value'
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          summary: true
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          summary: 0
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
            summary: ['value']
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          summary: { x: 'value' }
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Example.createDefinition({
          description: 'value'
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: value', () => {

      it('can be a boolean', () => {
        const def = Example.createDefinition({
          value: true
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Example.createDefinition({
          value: 0
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Example.createDefinition({
          value: 'value'
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Example.createDefinition({
          value: []
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Example.createDefinition({
          value: {}
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: externalValue', () => {

      it('can be a string', () => {
        const def = Example.createDefinition({
          externalValue: 'value'
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          externalValue: true
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          externalValue: 0
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
            externalValue: ['value']
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Example.createDefinition({
          // @ts-expect-error
          externalValue: { x: 'value' }
        })
        const es = Example.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
