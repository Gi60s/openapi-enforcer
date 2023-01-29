/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Parameter - Auto Generated Tests', () => {
  describe('v2', () => {
    const Parameter = E.Parameter2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Parameter.createDefinition()
        // @ts-expect-error
        const es = Parameter.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: name', () => {

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          name: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          name: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          name: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            name: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          name: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: in', () => {

      it('can equal "body"', () => {
        const def = Parameter.createDefinition({
          in: 'body'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "formData"', () => {
        const def = Parameter.createDefinition({
          in: 'formData'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "header"', () => {
        const def = Parameter.createDefinition({
          in: 'header'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "path"', () => {
        const def = Parameter.createDefinition({
          in: 'path'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "query"', () => {
        const def = Parameter.createDefinition({
          in: 'query'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          description: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: required', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          required: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          required: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          required: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            required: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          required: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: schema', () => {
      it('should not be a $ref', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: { $ref: '#/' }
        })
        const es = Parameter.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            schema: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: type', () => {

      it('can equal "array"', () => {
        const def = Parameter.createDefinition({
          type: 'array'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "boolean"', () => {
        const def = Parameter.createDefinition({
          type: 'boolean'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "file"', () => {
        const def = Parameter.createDefinition({
          type: 'file'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "integer"', () => {
        const def = Parameter.createDefinition({
          type: 'integer'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "number"', () => {
        const def = Parameter.createDefinition({
          type: 'number'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "string"', () => {
        const def = Parameter.createDefinition({
          type: 'string'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: format', () => {

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          format: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          format: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          format: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            format: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          format: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allowEmptyValue', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          allowEmptyValue: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowEmptyValue: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowEmptyValue: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            allowEmptyValue: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowEmptyValue: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: items', () => {
      it('should not be a $ref', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          items: { $ref: '#/' }
        })
        const es = Parameter.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          items: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          items: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          items: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Items', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            items: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Items', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          items: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: collectionFormat', () => {

      it('can equal "csv"', () => {
        const def = Parameter.createDefinition({
          collectionFormat: 'csv'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "ssv"', () => {
        const def = Parameter.createDefinition({
          collectionFormat: 'ssv'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "tsv"', () => {
        const def = Parameter.createDefinition({
          collectionFormat: 'tsv'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "pipes"', () => {
        const def = Parameter.createDefinition({
          collectionFormat: 'pipes'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "multi"', () => {
        const def = Parameter.createDefinition({
          collectionFormat: 'multi'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: default', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          default: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          default: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          default: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Parameter.createDefinition({
          default: []
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Parameter.createDefinition({
          default: {}
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: maximum', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          maximum: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maximum: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maximum: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            maximum: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maximum: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMaximum', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          exclusiveMaximum: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            exclusiveMaximum: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minimum', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          minimum: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minimum: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minimum: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            minimum: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minimum: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMinimum', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          exclusiveMinimum: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            exclusiveMinimum: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxLength', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          maxLength: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maxLength: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maxLength: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            maxLength: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maxLength: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minLength', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          minLength: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minLength: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minLength: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            minLength: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minLength: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: pattern', () => {

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          pattern: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          pattern: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          pattern: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            pattern: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          pattern: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxItems', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          maxItems: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maxItems: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maxItems: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            maxItems: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          maxItems: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minItems', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          minItems: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minItems: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minItems: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            minItems: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          minItems: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: uniqueItems', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          uniqueItems: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          uniqueItems: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          uniqueItems: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            uniqueItems: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          uniqueItems: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: enum', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          enum: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          enum: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          enum: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Parameter.createDefinition({
          enum: [[]]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Parameter.createDefinition({
          enum: [{}]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: multipleOf', () => {

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          multipleOf: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          multipleOf: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          multipleOf: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            multipleOf: [0]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          multipleOf: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })

  describe('v3', () => {
    const Parameter = E.Parameter3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Parameter.createDefinition()
        const es = Parameter.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Parameter.createDefinition()
        // @ts-expect-error
        const es = Parameter.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: name', () => {

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          name: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          name: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          name: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            name: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          name: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: in', () => {

      it('can equal "cookie"', () => {
        const def = Parameter.createDefinition({
          in: 'cookie'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "header"', () => {
        const def = Parameter.createDefinition({
          in: 'header'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "path"', () => {
        const def = Parameter.createDefinition({
          in: 'path'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "query"', () => {
        const def = Parameter.createDefinition({
          in: 'query'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          description: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: required', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          required: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          required: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          required: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            required: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          required: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: deprecated', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          deprecated: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          deprecated: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          deprecated: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            deprecated: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          deprecated: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allowEmptyValue', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          allowEmptyValue: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowEmptyValue: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowEmptyValue: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            allowEmptyValue: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowEmptyValue: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: style', () => {

      it('can equal "deepObject"', () => {
        const def = Parameter.createDefinition({
          style: 'deepObject'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "form"', () => {
        const def = Parameter.createDefinition({
          style: 'form'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "label"', () => {
        const def = Parameter.createDefinition({
          style: 'label'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "matrix"', () => {
        const def = Parameter.createDefinition({
          style: 'matrix'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "pipeDelimited"', () => {
        const def = Parameter.createDefinition({
          style: 'pipeDelimited'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "simple"', () => {
        const def = Parameter.createDefinition({
          style: 'simple'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can equal "spaceDelimited"', () => {
        const def = Parameter.createDefinition({
          style: 'spaceDelimited'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: explode', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          explode: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          explode: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          explode: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            explode: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          explode: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allowReserved', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          allowReserved: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowReserved: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowReserved: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            allowReserved: [true]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          allowReserved: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: schema', () => {
      it('can be a $ref', () => {
        const def = Parameter.createDefinition({
          schema: { $ref: '#/' }
        })
        const es = Parameter.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be a boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            schema: ['value']
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          schema: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: example', () => {

      it('can be a boolean', () => {
        const def = Parameter.createDefinition({
          example: true
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Parameter.createDefinition({
          example: 0
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Parameter.createDefinition({
          example: 'value'
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Parameter.createDefinition({
          example: []
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Parameter.createDefinition({
          example: {}
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: examples', () => {
      it('can be a $ref', () => {
        const def = Parameter.createDefinition({
          examples: { x: { $ref: '#/' } }
        })
        const es = Parameter.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          examples: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          examples: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          examples: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Example', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            examples: [{ x: 'value' }]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: content', () => {
      it('should not be a $ref', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          content: { x: { $ref: '#/' } }
        })
        const es = Parameter.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          content: { x: true }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          content: { x: 0 }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
          content: { x: 'value' }
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of MediaType', () => {
        const def = Parameter.createDefinition({
          // @ts-expect-error
            content: [{ x: 'value' }]
        })
        const es = Parameter.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
