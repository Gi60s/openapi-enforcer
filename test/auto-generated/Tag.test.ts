import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Tag', () => {
    describe('v2', () => {
      const Tag = E.Tag2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Tag.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Tag.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: name', () => {
        it('should not be a $ref', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: { $ref: '#/' }
          })
          const { hasWarningByCode } = Tag.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Tag.createDefinition({
            name: 'value'
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: true
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: 0
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: ['value']
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: { x: 'value' }
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Tag.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Tag.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: externalDocs', () => {
        it('should not be a $ref', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: { $ref: '#/' }
          })
          const { hasWarningByCode } = Tag.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: true
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: 0
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: 'value'
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ExternalDocumentation', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: ['value']
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped ExternalDocumentation', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: { x: 'value' }
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const Tag = E.Tag3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Tag.createDefinition()
          const { hasErrorByCode } = Tag.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Tag.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Tag.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: name', () => {
        it('should not be a $ref', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: { $ref: '#/' }
          })
          const { hasWarningByCode } = Tag.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Tag.createDefinition({
            name: 'value'
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: true
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: 0
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: ['value']
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            name: { x: 'value' }
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Tag.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Tag.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: externalDocs', () => {
        it('should not be a $ref', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: { $ref: '#/' }
          })
          const { hasWarningByCode } = Tag.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: true
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: 0
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: 'value'
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ExternalDocumentation', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: ['value']
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped ExternalDocumentation', () => {
          const def = Tag.createDefinition({
            // @ts-expect-error
            externalDocs: { x: 'value' }
          })
          const { hasErrorByCode } = Tag.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
