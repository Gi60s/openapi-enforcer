import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Components', () => {
    describe('v3', () => {
      const Components = E.Components3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Components.createDefinition()
          const { hasErrorByCode } = Components.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Components.createDefinition()
          const { hasErrorByCode } = Components.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Components.createDefinition()
          const { hasErrorByCode } = Components.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Components.createDefinition()
          const { hasErrorByCode } = Components.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Components.createDefinition()
          const { hasErrorByCode } = Components.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Components.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Components.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: schemas', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            schemas: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            schemas: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            schemas: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            schemas: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Schema', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            schemas: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: responses', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            responses: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            responses: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            responses: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            responses: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Response', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            responses: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: parameters', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            parameters: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            parameters: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            parameters: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            parameters: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Parameter', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            parameters: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: examples', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            examples: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            examples: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            examples: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            examples: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Example', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            examples: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: requestBodies', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            requestBodies: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            requestBodies: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            requestBodies: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            requestBodies: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of RequestBody', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            requestBodies: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: headers', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            headers: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            headers: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            headers: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            headers: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Header', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            headers: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: securitySchemes', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            securitySchemes: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            securitySchemes: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            securitySchemes: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            securitySchemes: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of SecurityScheme', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            securitySchemes: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: links', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            links: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            links: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            links: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            links: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Link', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            links: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: callbacks', () => {
        it('can be a $ref', () => {
          const def = Components.createDefinition({
            callbacks: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = Components.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
        })

        it('cannot be an object of mapped boolean', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            callbacks: { x: true }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            callbacks: { x: 0 }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            callbacks: { x: 'value' }
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of Callback', () => {
          const def = Components.createDefinition({
            // @ts-expect-error
            callbacks: [{ x: 'value' }]
          })
          const { hasErrorByCode } = Components.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
