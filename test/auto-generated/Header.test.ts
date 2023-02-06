/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Header - Auto Generated Tests', () => {
  describe('v2', () => {
    const Header = E.Header2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Header.createDefinition()
        // @ts-expect-error
        const es = Header.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Header.createDefinition({
          description: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: type', () => {

      it('can equal "array"', () => {
        const def = Header.createDefinition({
          type: 'array'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "boolean"', () => {
        const def = Header.createDefinition({
          type: 'boolean'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "integer"', () => {
        const def = Header.createDefinition({
          type: 'integer'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "number"', () => {
        const def = Header.createDefinition({
          type: 'number'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "string"', () => {
        const def = Header.createDefinition({
          type: 'string'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: format', () => {

      it('can be a string', () => {
        const def = Header.createDefinition({
          format: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          format: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          format: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            format: ['value']
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          format: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: items', () => {
      it('should not be a $ref', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          items: { $ref: '#/' }
        })
        const es = Header.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          items: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          items: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          items: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Items', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            items: ['value']
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Items', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          items: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: collectionFormat', () => {

      it('can equal "csv"', () => {
        const def = Header.createDefinition({
          collectionFormat: 'csv'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "ssv"', () => {
        const def = Header.createDefinition({
          collectionFormat: 'ssv'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "tsv"', () => {
        const def = Header.createDefinition({
          collectionFormat: 'tsv'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "pipes"', () => {
        const def = Header.createDefinition({
          collectionFormat: 'pipes'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: default', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          default: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Header.createDefinition({
          default: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Header.createDefinition({
          default: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Header.createDefinition({
          default: []
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Header.createDefinition({
          default: {}
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: maximum', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          maximum: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maximum: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maximum: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            maximum: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maximum: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMaximum', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          exclusiveMaximum: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            exclusiveMaximum: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minimum', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          minimum: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minimum: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minimum: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            minimum: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minimum: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMinimum', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          exclusiveMinimum: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            exclusiveMinimum: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxLength', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          maxLength: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maxLength: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maxLength: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            maxLength: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maxLength: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minLength', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          minLength: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minLength: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minLength: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            minLength: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minLength: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: pattern', () => {

      it('can be a string', () => {
        const def = Header.createDefinition({
          pattern: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          pattern: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          pattern: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            pattern: ['value']
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          pattern: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxItems', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          maxItems: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maxItems: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maxItems: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            maxItems: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          maxItems: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minItems', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          minItems: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minItems: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minItems: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            minItems: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          minItems: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: uniqueItems', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          uniqueItems: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          uniqueItems: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          uniqueItems: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            uniqueItems: [true]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          uniqueItems: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: enum', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          enum: [true]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Header.createDefinition({
          enum: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Header.createDefinition({
          enum: ['value']
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Header.createDefinition({
          enum: [[]]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Header.createDefinition({
          enum: [{}]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: multipleOf', () => {

      it('can be a number', () => {
        const def = Header.createDefinition({
          multipleOf: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          multipleOf: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          multipleOf: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            multipleOf: [0]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          multipleOf: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })

  describe('v3', () => {
    const Header = E.Header3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Header.createDefinition()
        const es = Header.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Header.createDefinition()
        // @ts-expect-error
        const es = Header.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Header.createDefinition({
          description: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: required', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          required: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          required: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          required: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            required: [true]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          required: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: deprecated', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          deprecated: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          deprecated: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          deprecated: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            deprecated: [true]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          deprecated: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allowEmptyValue', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          allowEmptyValue: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          allowEmptyValue: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          allowEmptyValue: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            allowEmptyValue: [true]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          allowEmptyValue: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: style', () => {

      it('can equal "simple"', () => {
        const def = Header.createDefinition({
          style: 'simple'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: explode', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          explode: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          explode: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          explode: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            explode: [true]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          explode: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allowReserved', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          allowReserved: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          allowReserved: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          allowReserved: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            allowReserved: [true]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          allowReserved: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: schema', () => {
      it('can be a $ref', () => {
        const def = Header.createDefinition({
          schema: { $ref: '#/' }
        })
        const es = Header.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be a boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          schema: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          schema: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          schema: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            schema: ['value']
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          schema: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: example', () => {

      it('can be a boolean', () => {
        const def = Header.createDefinition({
          example: true
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Header.createDefinition({
          example: 0
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Header.createDefinition({
          example: 'value'
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Header.createDefinition({
          example: []
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Header.createDefinition({
          example: {}
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: examples', () => {
      it('can be a $ref', () => {
        const def = Header.createDefinition({
          examples: { x: { $ref: '#/' } }
        })
        const es = Header.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          examples: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          examples: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          examples: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Example', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            examples: [{ x: 'value' }]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: content', () => {
      it('should not be a $ref', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          content: { x: { $ref: '#/' } }
        })
        const es = Header.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          content: { x: true }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          content: { x: 0 }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
          content: { x: 'value' }
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of MediaType', () => {
        const def = Header.createDefinition({
          // @ts-expect-error
            content: [{ x: 'value' }]
        })
        const es = Header.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
