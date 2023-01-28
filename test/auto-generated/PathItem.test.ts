import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('PathItem', () => {
    describe('v2', () => {
      const PathItem = E.PathItem2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = PathItem.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = PathItem.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: $ref', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = PathItem.createDefinition({
            $ref: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: get', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: put', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: post', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: delete', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: options', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: head', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: patch', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: parameters', () => {
        it('can be a $ref', () => {
          const def = PathItem.createDefinition({
            parameters: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: [true]
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: [0]
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Parameter', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: { x: ['value'] }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const PathItem = E.PathItem3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = PathItem.createDefinition()
          const { hasErrorByCode } = PathItem.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = PathItem.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = PathItem.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: $ref', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = PathItem.createDefinition({
            $ref: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            $ref: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: summary', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            summary: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = PathItem.createDefinition({
            summary: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            summary: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            summary: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            summary: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            summary: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = PathItem.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: get', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            get: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: put', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            put: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: post', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            post: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: delete', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            delete: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: options', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            options: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: head', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            head: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: patch', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            patch: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: trace', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            trace: { $ref: '#/' }
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            trace: true
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            trace: 0
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            trace: 'value'
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            trace: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Operation', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            trace: { x: 'value' }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: servers', () => {
        it('should not be a $ref', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            servers: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an array of  boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            servers: [true]
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            servers: [0]
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            servers: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Server', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            servers: { x: ['value'] }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: parameters', () => {
        it('can be a $ref', () => {
          const def = PathItem.createDefinition({
            parameters: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = PathItem.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: [true]
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: [0]
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: ['value']
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Parameter', () => {
          const def = PathItem.createDefinition({
            // @ts-expect-error
            parameters: { x: ['value'] }
          })
          const { hasErrorByCode } = PathItem.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
