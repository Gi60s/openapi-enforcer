import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Encoding', () => {
    describe('v3', () => {
      const Encoding = E.Encoding3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Encoding.createDefinition()
          const { hasErrorByCode } = Encoding.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Encoding.createDefinition()
          const { hasErrorByCode } = Encoding.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Encoding.createDefinition()
          const { hasErrorByCode } = Encoding.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Encoding.createDefinition()
          const { hasErrorByCode } = Encoding.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Encoding.createDefinition()
          const { hasErrorByCode } = Encoding.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Encoding.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Encoding.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: contentType', () => {
        it('should not be a $ref', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            contentType: { $ref: '#/' }
          })
          const { hasWarningByCode } = Encoding.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Encoding.createDefinition({
            contentType: 'value'
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            contentType: true
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            contentType: 0
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            contentType: ['value']
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            contentType: { x: 'value' }
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: headers', () => {
        it('can be a $ref', () => {
          const def = Encoding.createDefinition({
            headers: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Encoding.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            headers: { x: true }
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            headers: { x: 0 }
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            headers: { x: 'value' }
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Header', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            headers: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: style', () => {
        it('should not be a $ref', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            style: { $ref: '#/' }
          })
          const { hasWarningByCode } = Encoding.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Encoding.createDefinition({
            style: 'value'
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            style: true
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            style: 0
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            style: ['value']
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            style: { x: 'value' }
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: explode', () => {
        it('should not be a $ref', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            explode: { $ref: '#/' }
          })
          const { hasWarningByCode } = Encoding.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Encoding.createDefinition({
            explode: true
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            explode: 0
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            explode: 'value'
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            explode: [true]
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            explode: { x: true }
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: allowReserved', () => {
        it('should not be a $ref', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            allowReserved: { $ref: '#/' }
          })
          const { hasWarningByCode } = Encoding.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Encoding.createDefinition({
            allowReserved: true
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            allowReserved: 0
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            allowReserved: 'value'
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            allowReserved: [true]
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Encoding.createDefinition({
            // @ts-expect-error
            allowReserved: { x: true }
          })
          const { hasErrorByCode } = Encoding.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
