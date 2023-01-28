import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Link', () => {
    describe('v3', () => {
      const Link = E.Link3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Link.createDefinition()
          const { hasErrorByCode } = Link.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Link.createDefinition()
          const { hasErrorByCode } = Link.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Link.createDefinition()
          const { hasErrorByCode } = Link.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Link.createDefinition()
          const { hasErrorByCode } = Link.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Link.createDefinition()
          const { hasErrorByCode } = Link.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Link.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Link.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: operationRef', () => {
        it('should not be a $ref', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationRef: { $ref: '#/' }
          })
          const { hasWarningByCode } = Link.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Link.createDefinition({
            operationRef: 'value'
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationRef: true
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationRef: 0
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationRef: ['value']
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationRef: { x: 'value' }
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: operationId', () => {
        it('should not be a $ref', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationId: { $ref: '#/' }
          })
          const { hasWarningByCode } = Link.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Link.createDefinition({
            operationId: 'value'
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationId: true
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationId: 0
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationId: ['value']
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            operationId: { x: 'value' }
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: parameters', () => {
        it('can be a $ref', () => {
          const def = Link.createDefinition({
            parameters: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Link.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Link.createDefinition({
            parameters: { x: true }
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Link.createDefinition({
            parameters: { x: 0 }
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Link.createDefinition({
            parameters: { x: 'value' }
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Link.createDefinition({
            parameters: []
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Link.createDefinition({
            parameters: {}
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: requestBody', () => {
        it('can be a $ref', () => {
          const def = Link.createDefinition({
            requestBody: { $ref: '#/' }
          })
          const { hasWarningByCode } = Link.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('can be a boolean', () => {
          const def = Link.createDefinition({
            requestBody: true
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a number', () => {
          const def = Link.createDefinition({
            requestBody: 0
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can be a string', () => {
          const def = Link.createDefinition({
            requestBody: 'value'
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an array', () => {
          const def = Link.createDefinition({
            requestBody: []
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('can be an object', () => {
          const def = Link.createDefinition({
            requestBody: {}
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Link.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Link.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: server', () => {
        it('should not be a $ref', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            server: { $ref: '#/' }
          })
          const { hasWarningByCode } = Link.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            server: true
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            server: 0
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            server: 'value'
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Server', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            server: ['value']
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Server', () => {
          const def = Link.createDefinition({
            // @ts-expect-error
            server: { x: 'value' }
          })
          const { hasErrorByCode } = Link.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
