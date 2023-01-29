/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Swagger - Auto Generated Tests', () => {
  describe('v2', () => {
    const Swagger = E.Swagger2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Swagger.createDefinition()
        const es = Swagger.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Swagger.createDefinition()
        const es = Swagger.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Swagger.createDefinition()
        const es = Swagger.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Swagger.createDefinition()
        const es = Swagger.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Swagger.createDefinition()
        const es = Swagger.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Swagger.createDefinition()
        // @ts-expect-error
        const es = Swagger.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: swagger', () => {

      it('can equal "2.0"', () => {
        const def = Swagger.createDefinition({
          swagger: '2.0'
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: info', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          info: { $ref: '#/' }
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          info: true
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          info: 0
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          info: 'value'
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Info', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            info: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Info', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          info: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: host', () => {

      it('can be a string', () => {
        const def = Swagger.createDefinition({
          host: 'value'
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          host: true
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          host: 0
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            host: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          host: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: basePath', () => {

      it('can be a string', () => {
        const def = Swagger.createDefinition({
          basePath: 'value'
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          basePath: true
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          basePath: 0
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            basePath: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          basePath: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: schemes', () => {

      it('can equal ["http"]', () => {
        const def = Swagger.createDefinition({
          schemes: ['http']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal ["https"]', () => {
        const def = Swagger.createDefinition({
          schemes: ['https']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal ["ws"]', () => {
        const def = Swagger.createDefinition({
          schemes: ['ws']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal ["wss"]', () => {
        const def = Swagger.createDefinition({
          schemes: ['wss']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: consumes', () => {

      it('can be an array of  string', () => {
        const def = Swagger.createDefinition({
          consumes: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be an array of  boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          consumes: [true]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          consumes: [0]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          consumes: { x: ['value'] }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: produces', () => {

      it('can be an array of  string', () => {
        const def = Swagger.createDefinition({
          produces: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be an array of  boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          produces: [true]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          produces: [0]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          produces: { x: ['value'] }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: paths', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          paths: { $ref: '#/' }
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          paths: true
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          paths: 0
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          paths: 'value'
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Paths', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            paths: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Paths', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          paths: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: definitions', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          definitions: { x: { $ref: '#/' } }
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          definitions: { x: true }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          definitions: { x: 0 }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          definitions: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            definitions: [{ x: 'value' }]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: parameters', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          parameters: { x: { $ref: '#/' } }
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          parameters: { x: true }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          parameters: { x: 0 }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          parameters: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Parameter', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            parameters: [{ x: 'value' }]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: responses', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          responses: { x: { $ref: '#/' } }
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          responses: { x: true }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          responses: { x: 0 }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          responses: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Response', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            responses: [{ x: 'value' }]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: securityDefinitions', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          securityDefinitions: { x: { $ref: '#/' } }
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          securityDefinitions: { x: true }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          securityDefinitions: { x: 0 }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          securityDefinitions: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of SecurityScheme', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            securityDefinitions: [{ x: 'value' }]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: security', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          security: [{ $ref: '#/' }]
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an array of  boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          security: [true]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          security: [0]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          security: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped SecurityRequirement', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          security: { x: ['value'] }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: tags', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          tags: [{ $ref: '#/' }]
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an array of  boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          tags: [true]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          tags: [0]
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          tags: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Tag', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          tags: { x: ['value'] }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: externalDocs', () => {
      it('should not be a $ref', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          externalDocs: { $ref: '#/' }
        })
        const es = Swagger.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          externalDocs: true
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          externalDocs: 0
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          externalDocs: 'value'
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of ExternalDocumentation', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
            externalDocs: ['value']
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped ExternalDocumentation', () => {
        const def = Swagger.createDefinition({
          // @ts-expect-error
          externalDocs: { x: 'value' }
        })
        const es = Swagger.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
