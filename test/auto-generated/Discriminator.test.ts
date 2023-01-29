/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Discriminator - Auto Generated Tests', () => {
  describe('v3', () => {
    const Discriminator = E.Discriminator3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Discriminator.createDefinition()
        const es = Discriminator.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Discriminator.createDefinition()
        const es = Discriminator.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Discriminator.createDefinition()
        const es = Discriminator.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Discriminator.createDefinition()
        const es = Discriminator.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Discriminator.createDefinition()
        const es = Discriminator.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Discriminator.createDefinition()
        // @ts-expect-error
        const es = Discriminator.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: propertyName', () => {

      it('can be a string', () => {
        const def = Discriminator.createDefinition({
          propertyName: 'value'
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Discriminator.createDefinition({
          // @ts-expect-error
          propertyName: true
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Discriminator.createDefinition({
          // @ts-expect-error
          propertyName: 0
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Discriminator.createDefinition({
          // @ts-expect-error
            propertyName: ['value']
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Discriminator.createDefinition({
          // @ts-expect-error
          propertyName: { x: 'value' }
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: mapping', () => {

      it('can be an object of mapped string', () => {
        const def = Discriminator.createDefinition({
          mapping: { x: 'value' }
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be an object of mapped boolean', () => {
        const def = Discriminator.createDefinition({
          // @ts-expect-error
          mapping: { x: true }
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Discriminator.createDefinition({
          // @ts-expect-error
          mapping: { x: 0 }
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Discriminator.createDefinition({
          // @ts-expect-error
            mapping: [{ x: 'value' }]
        })
        const es = Discriminator.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
