/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('OpenAPI - Auto Generated Tests', () => {
  describe('v3', () => {
    const OpenAPI = E.OpenAPI3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = OpenAPI.createDefinition()
        const es = OpenAPI.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = OpenAPI.createDefinition()
        const es = OpenAPI.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = OpenAPI.createDefinition()
        const es = OpenAPI.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = OpenAPI.createDefinition()
        const es = OpenAPI.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = OpenAPI.createDefinition()
        const es = OpenAPI.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = OpenAPI.createDefinition()
        // @ts-expect-error
        const es = OpenAPI.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: openapi', () => {

      it('can equal "3.0.0"', () => {
        const def = OpenAPI.createDefinition({
          openapi: '3.0.0'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "3.0.1"', () => {
        const def = OpenAPI.createDefinition({
          openapi: '3.0.1'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "3.0.2"', () => {
        const def = OpenAPI.createDefinition({
          openapi: '3.0.2'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "3.0.3"', () => {
        const def = OpenAPI.createDefinition({
          openapi: '3.0.3'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: info', () => {
      it('should not be a $ref', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          info: { $ref: '#/' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          info: true
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          info: 0
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          info: 'value'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Info', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
            info: ['value']
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Info', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          info: { x: 'value' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: servers', () => {
      it('should not be a $ref', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          servers: [{ $ref: '#/' }]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an array of  boolean', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          servers: [true]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          servers: [0]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          servers: ['value']
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Server', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          servers: { x: ['value'] }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: paths', () => {
      it('should not be a $ref', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          paths: { $ref: '#/' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          paths: true
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          paths: 0
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          paths: 'value'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Paths', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
            paths: ['value']
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Paths', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          paths: { x: 'value' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: components', () => {
      it('should not be a $ref', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          components: { $ref: '#/' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          components: true
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          components: 0
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          components: 'value'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Components', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
            components: ['value']
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Components', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          components: { x: 'value' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: security', () => {
      it('should not be a $ref', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          security: [{ $ref: '#/' }]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an array of  boolean', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          security: [true]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          security: [0]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          security: ['value']
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped SecurityRequirement', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          security: { x: ['value'] }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: tags', () => {
      it('should not be a $ref', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          tags: [{ $ref: '#/' }]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an array of  boolean', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          tags: [true]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          tags: [0]
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          tags: ['value']
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Tag', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          tags: { x: ['value'] }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: externalDocs', () => {
      it('should not be a $ref', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          externalDocs: { $ref: '#/' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          externalDocs: true
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          externalDocs: 0
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          externalDocs: 'value'
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of ExternalDocumentation', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
            externalDocs: ['value']
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped ExternalDocumentation', () => {
        const def = OpenAPI.createDefinition({
          // @ts-expect-error
          externalDocs: { x: 'value' }
        })
        const es = OpenAPI.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
