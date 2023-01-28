import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('ExternalDocumentation', () => {
    describe('v2', () => {
      const ExternalDocumentation = E.ExternalDocumentation2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = ExternalDocumentation.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = ExternalDocumentation.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = ExternalDocumentation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = ExternalDocumentation.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: url', () => {
        it('should not be a $ref', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: { $ref: '#/' }
          })
          const { hasWarningByCode } = ExternalDocumentation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = ExternalDocumentation.createDefinition({
            url: 'value'
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: true
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: 0
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: ['value']
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: { x: 'value' }
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const ExternalDocumentation = E.ExternalDocumentation3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = ExternalDocumentation.createDefinition()
          const { hasErrorByCode } = ExternalDocumentation.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = ExternalDocumentation.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = ExternalDocumentation.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = ExternalDocumentation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = ExternalDocumentation.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: url', () => {
        it('should not be a $ref', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: { $ref: '#/' }
          })
          const { hasWarningByCode } = ExternalDocumentation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = ExternalDocumentation.createDefinition({
            url: 'value'
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: true
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: 0
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: ['value']
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = ExternalDocumentation.createDefinition({
            // @ts-expect-error
            url: { x: 'value' }
          })
          const { hasErrorByCode } = ExternalDocumentation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
