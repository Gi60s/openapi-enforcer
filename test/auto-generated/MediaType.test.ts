/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('MediaType - Auto Generated Tests', () => {
  describe('v3', () => {
    const MediaType = E.MediaType3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = MediaType.createDefinition()
        const es = MediaType.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = MediaType.createDefinition()
        const es = MediaType.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = MediaType.createDefinition()
        const es = MediaType.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = MediaType.createDefinition()
        const es = MediaType.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = MediaType.createDefinition()
        const es = MediaType.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = MediaType.createDefinition()
        // @ts-expect-error
        const es = MediaType.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: schema', () => {
      it('can be a $ref', () => {
        const def = MediaType.createDefinition({
          schema: { $ref: '#/' }
        })
        const es = MediaType.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be a boolean', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          schema: true
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          schema: 0
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          schema: 'value'
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
            schema: ['value']
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          schema: { x: 'value' }
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: example', () => {

      it('can be a boolean', () => {
        const def = MediaType.createDefinition({
          example: true
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = MediaType.createDefinition({
          example: 0
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = MediaType.createDefinition({
          example: 'value'
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = MediaType.createDefinition({
          example: []
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = MediaType.createDefinition({
          example: {}
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: examples', () => {
      it('can be a $ref', () => {
        const def = MediaType.createDefinition({
          examples: { x: { $ref: '#/' } }
        })
        const es = MediaType.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          examples: { x: true }
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          examples: { x: 0 }
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          examples: { x: 'value' }
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Example', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
            examples: [{ x: 'value' }]
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: encoding', () => {
      it('should not be a $ref', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          encoding: { x: { $ref: '#/' } }
        })
        const es = MediaType.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          encoding: { x: true }
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          encoding: { x: 0 }
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
          encoding: { x: 'value' }
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Encoding', () => {
        const def = MediaType.createDefinition({
          // @ts-expect-error
            encoding: [{ x: 'value' }]
        })
        const es = MediaType.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
