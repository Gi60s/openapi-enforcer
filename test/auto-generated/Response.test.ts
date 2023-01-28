import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Response', () => {
    describe('v2', () => {
      const Response = E.Response2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = Response.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Response.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Response.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: schema', () => {
        it('can be a $ref', () => {
          const def = Response.createDefinition({
            schema: { $ref: '#/' }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be a boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            schema: true
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            schema: 0
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            schema: 'value'
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            schema: ['value']
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Schema', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            schema: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: headers', () => {
        it('should not be a $ref', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: { x: true }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: { x: 0 }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Header', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: examples', () => {
        it('should not be a $ref', () => {
          const def = Response.createDefinition({
            examples: { $ref: '#/' }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            examples: true
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            examples: 0
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            examples: 'value'
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Example', () => {
          const def = Response.createDefinition({
            examples: ['value']
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped Example', () => {
          const def = Response.createDefinition({
            examples: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const Response = E.Response3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Response.createDefinition()
          const { hasErrorByCode } = Response.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Response.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Response.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = Response.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: headers', () => {
        it('can be a $ref', () => {
          const def = Response.createDefinition({
            headers: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: { x: true }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: { x: 0 }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Header', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            headers: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: content', () => {
        it('should not be a $ref', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            content: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            content: { x: true }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            content: { x: 0 }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            content: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of MediaType', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            content: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: links', () => {
        it('can be a $ref', () => {
          const def = Response.createDefinition({
            links: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Response.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            links: { x: true }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            links: { x: 0 }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            links: { x: 'value' }
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Link', () => {
          const def = Response.createDefinition({
            // @ts-expect-error
            links: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Response.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
