import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('OpenAPI', () => {
    describe('v3', () => {
      const OpenAPI = E.OpenAPI3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = OpenAPI.createDefinition()
          const { hasErrorByCode } = OpenAPI.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = OpenAPI.createDefinition()
          const { hasErrorByCode } = OpenAPI.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = OpenAPI.createDefinition()
          const { hasErrorByCode } = OpenAPI.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = OpenAPI.createDefinition()
          const { hasErrorByCode } = OpenAPI.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = OpenAPI.createDefinition()
          const { hasErrorByCode } = OpenAPI.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = OpenAPI.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = OpenAPI.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: openapi', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            openapi: { $ref: '#/' }
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "3.0.0"', () => {
          const def = OpenAPI.createDefinition({
            openapi: '3.0.0'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "3.0.1"', () => {
          const def = OpenAPI.createDefinition({
            openapi: '3.0.1'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "3.0.2"', () => {
          const def = OpenAPI.createDefinition({
            openapi: '3.0.2'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "3.0.3"', () => {
          const def = OpenAPI.createDefinition({
            openapi: '3.0.3'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: info', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            info: { $ref: '#/' }
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            info: true
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            info: 0
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            info: 'value'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Info', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            info: ['value']
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Info', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            info: { x: 'value' }
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: servers', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            servers: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an array of  boolean', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            servers: [true]
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            servers: [0]
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            servers: ['value']
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Server', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            servers: { x: ['value'] }
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: paths', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            paths: { $ref: '#/' }
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            paths: true
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            paths: 0
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            paths: 'value'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Paths', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            paths: ['value']
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Paths', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            paths: { x: 'value' }
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: components', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            components: { $ref: '#/' }
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            components: true
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            components: 0
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            components: 'value'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Components', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            components: ['value']
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Components', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            components: { x: 'value' }
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: security', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            security: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an array of  boolean', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            security: [true]
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            security: [0]
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            security: ['value']
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped SecurityRequirement', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            security: { x: ['value'] }
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: tags', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            tags: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an array of  boolean', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            tags: [true]
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            tags: [0]
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            tags: ['value']
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Tag', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            tags: { x: ['value'] }
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: externalDocs', () => {
        it('should not be a $ref', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            externalDocs: { $ref: '#/' }
          })
          const { hasWarningByCode } = OpenAPI.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            externalDocs: true
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            externalDocs: 0
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            externalDocs: 'value'
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ExternalDocumentation', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            externalDocs: ['value']
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped ExternalDocumentation', () => {
          const def = OpenAPI.createDefinition({
            // @ts-expect-error
            externalDocs: { x: 'value' }
          })
          const { hasErrorByCode } = OpenAPI.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
