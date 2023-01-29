/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Info - Auto Generated Tests', () => {
  describe('v2', () => {
    const Info = E.Info2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Info.createDefinition()
        // @ts-expect-error
        const es = Info.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: title', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          title: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          title: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          title: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            title: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          title: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          description: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: termsOfService', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          termsOfService: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          termsOfService: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          termsOfService: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            termsOfService: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          termsOfService: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: contact', () => {
      it('should not be a $ref', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: { $ref: '#/' }
        })
        const es = Info.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Contact', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            contact: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Contact', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: license', () => {
      it('should not be a $ref', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: { $ref: '#/' }
        })
        const es = Info.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of License', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            license: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped License', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: version', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          version: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          version: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          version: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            version: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          version: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })

  describe('v3', () => {
    const Info = E.Info3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Info.createDefinition()
        const es = Info.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Info.createDefinition()
        // @ts-expect-error
        const es = Info.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: title', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          title: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          title: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          title: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            title: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          title: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          description: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: termsOfService', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          termsOfService: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          termsOfService: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          termsOfService: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            termsOfService: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          termsOfService: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: contact', () => {
      it('should not be a $ref', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: { $ref: '#/' }
        })
        const es = Info.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Contact', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            contact: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Contact', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          contact: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: license', () => {
      it('should not be a $ref', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: { $ref: '#/' }
        })
        const es = Info.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of License', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            license: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped License', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          license: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: version', () => {

      it('can be a string', () => {
        const def = Info.createDefinition({
          version: 'value'
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          version: true
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          version: 0
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
            version: ['value']
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Info.createDefinition({
          // @ts-expect-error
          version: { x: 'value' }
        })
        const es = Info.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
