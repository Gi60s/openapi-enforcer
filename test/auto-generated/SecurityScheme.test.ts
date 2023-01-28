import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('SecurityScheme', () => {
    describe('v2', () => {
      const SecurityScheme = E.SecurityScheme2

      describe('spec version support', () => {
        it('supports version 2.0', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version 3.0.0', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.1', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.2', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version 3.0.3', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('does not support version X.Y.Z', () => {
          const def = SecurityScheme.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = SecurityScheme.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: type', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            type: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "basic"', () => {
          const def = SecurityScheme.createDefinition({
            type: 'basic'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "apiKey"', () => {
          const def = SecurityScheme.createDefinition({
            type: 'apiKey'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "oauth2"', () => {
          const def = SecurityScheme.createDefinition({
            type: 'oauth2'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: name', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            name: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: in', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            in: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "query"', () => {
          const def = SecurityScheme.createDefinition({
            in: 'query'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "header"', () => {
          const def = SecurityScheme.createDefinition({
            in: 'header'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: flow', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            flow: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "implicit"', () => {
          const def = SecurityScheme.createDefinition({
            flow: 'implicit'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "password"', () => {
          const def = SecurityScheme.createDefinition({
            flow: 'password'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "application"', () => {
          const def = SecurityScheme.createDefinition({
            flow: 'application'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "accessCode"', () => {
          const def = SecurityScheme.createDefinition({
            flow: 'accessCode'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: authorizationUrl', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            authorizationUrl: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            authorizationUrl: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            authorizationUrl: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            authorizationUrl: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            authorizationUrl: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            authorizationUrl: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: tokenUrl', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            tokenUrl: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            tokenUrl: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            tokenUrl: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            tokenUrl: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            tokenUrl: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            tokenUrl: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: scopes', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scopes: { x: { $ref: '#/' } }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            scopes: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be an object of mapped boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scopes: { x: true }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scopes: { x: 0 }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scopes: [{ x: 'value' }]
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })

    describe('v3', () => {
      const SecurityScheme = E.SecurityScheme3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = SecurityScheme.createDefinition()
          const { hasErrorByCode } = SecurityScheme.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = SecurityScheme.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = SecurityScheme.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })

      describe('property: type', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            type: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "apiKey"', () => {
          const def = SecurityScheme.createDefinition({
            type: 'apiKey'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "http"', () => {
          const def = SecurityScheme.createDefinition({
            type: 'http'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "oauth2"', () => {
          const def = SecurityScheme.createDefinition({
            type: 'oauth2'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "openIdConnect"', () => {
          const def = SecurityScheme.createDefinition({
            type: 'openIdConnect'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: description', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            description: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            description: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: name', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            name: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            name: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: in', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            in: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can equal "query"', () => {
          const def = SecurityScheme.createDefinition({
            in: 'query'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "header"', () => {
          const def = SecurityScheme.createDefinition({
            in: 'header'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })

        it('can equal "cookie"', () => {
          const def = SecurityScheme.createDefinition({
            in: 'cookie'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
      })

      describe('property: scheme', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scheme: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            scheme: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scheme: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scheme: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scheme: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            scheme: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: bearerFormat', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            bearerFormat: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            bearerFormat: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            bearerFormat: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            bearerFormat: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            bearerFormat: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            bearerFormat: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: flows', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            flows: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            flows: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            flows: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            flows: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of OAuthFlows', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            flows: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped OAuthFlows', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            flows: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })

      describe('property: openIdConnectUrl', () => {
        it('should not be a $ref', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            openIdConnectUrl: { $ref: '#/' }
          })
          const { hasWarningByCode } = SecurityScheme.validate(def)
          expect(hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
        })

        it('can be a string', () => {
          const def = SecurityScheme.createDefinition({
            openIdConnectUrl: 'value'
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
        })
        it('cannot be a boolean', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            openIdConnectUrl: true
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be a number', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            openIdConnectUrl: 0
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an array of string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            openIdConnectUrl: ['value']
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })

        it('cannot be an object of mapped string', () => {
          const def = SecurityScheme.createDefinition({
            // @ts-expect-error
            openIdConnectUrl: { x: 'value' }
          })
          const { hasErrorByCode } = SecurityScheme.validate(def)
          expect(hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
        })
      })
    })
  })
})
