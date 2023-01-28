import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Operation', () => {
    describe('v2', () => {
      const Operation = E.Operation2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Operation.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Operation.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: tags', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an array of  string', () => {
          const def = Operation.createDefinition({
            tags: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: summary', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Operation.createDefinition({
            summary: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Operation.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: externalDocs', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ExternalDocumentation', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped ExternalDocumentation', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: operationId', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Operation.createDefinition({
            operationId: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: consumes', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            consumes: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an array of  string', () => {
          const def = Operation.createDefinition({
            consumes: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            consumes: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            consumes: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            consumes: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: produces', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            produces: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an array of  string', () => {
          const def = Operation.createDefinition({
            produces: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            produces: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            produces: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            produces: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: parameters', () => {
        it('can be a $ref', () => {
          const def = Operation.createDefinition({
            parameters: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Parameter', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: responses', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Responses', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Responses', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: schemes', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            schemes: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal ["http"]', () => {
          const def = Operation.createDefinition({
            schemes: ['http']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal ["https"]', () => {
          const def = Operation.createDefinition({
            schemes: ['https']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal ["ws"]', () => {
          const def = Operation.createDefinition({
            schemes: ['ws']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal ["wss"]', () => {
          const def = Operation.createDefinition({
            schemes: ['wss']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: deprecated', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Operation.createDefinition({
            deprecated: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: { x: true }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: security', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped SecurityRequirement', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const Operation = E.Operation3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Operation.createDefinition()
          const { hasErrorByCode } = Operation.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Operation.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Operation.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: tags', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an array of  string', () => {
          const def = Operation.createDefinition({
            tags: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            tags: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: summary', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Operation.createDefinition({
            summary: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            summary: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Operation.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: externalDocs', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of ExternalDocumentation', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped ExternalDocumentation', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            externalDocs: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: operationId', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Operation.createDefinition({
            operationId: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            operationId: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: parameters', () => {
        it('can be a $ref', () => {
          const def = Operation.createDefinition({
            parameters: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Parameter', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            parameters: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: requestBody', () => {
        it('can be a $ref', () => {
          const def = Operation.createDefinition({
            requestBody: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            requestBody: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            requestBody: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            requestBody: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of RequestBody', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            requestBody: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped RequestBody', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            requestBody: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: responses', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Responses', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Responses', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            responses: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: callbacks', () => {
        it('can be a $ref', () => {
          const def = Operation.createDefinition({
            callbacks: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            callbacks: { x: true }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            callbacks: { x: 0 }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            callbacks: { x: 'value' }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Callback', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            callbacks: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: deprecated', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: { $ref: '#/' }
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a boolean', () => {
          const def = Operation.createDefinition({
            deprecated: true
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: 0
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: 'value'
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            deprecated: { x: true }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: security', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped SecurityRequirement', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            security: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: servers', () => {
        it('should not be a $ref', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            servers: [{ $ref: '#/' }]
          })
          const { hasWarningByCode } = Operation.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an array of  boolean', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            servers: [true]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  number', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            servers: [0]
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of  string', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            servers: ['value']
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Server', () => {
          const def = Operation.createDefinition({
            // @ts-expect-error
            servers: { x: ['value'] }
          })
          const { hasErrorByCode } = Operation.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
