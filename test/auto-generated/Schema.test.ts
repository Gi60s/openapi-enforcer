/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Schema - Auto Generated Tests', () => {
  describe('v2', () => {
    const Schema = E.Schema2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = Schema.createDefinition()
        // @ts-expect-error
        const es = Schema.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: format', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          format: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          format: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          format: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            format: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          format: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: title', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          title: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          title: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          title: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            title: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          title: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          description: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: default', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          default: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Schema.createDefinition({
          default: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Schema.createDefinition({
          default: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Schema.createDefinition({
          default: []
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Schema.createDefinition({
          default: {}
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: maximum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maximum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maximum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maximum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maximum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maximum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMaximum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          exclusiveMaximum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            exclusiveMaximum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minimum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minimum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minimum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minimum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minimum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minimum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMinimum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          exclusiveMinimum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            exclusiveMinimum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxLength', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maxLength: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxLength: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxLength: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maxLength: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxLength: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minLength', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minLength: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minLength: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minLength: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minLength: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minLength: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: pattern', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          pattern: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          pattern: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          pattern: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            pattern: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          pattern: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxItems', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maxItems: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxItems: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxItems: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maxItems: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxItems: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minItems', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minItems: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minItems: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minItems: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minItems: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minItems: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxProperties', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maxProperties: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxProperties: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxProperties: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maxProperties: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxProperties: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minProperties', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minProperties: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minProperties: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minProperties: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minProperties: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minProperties: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: uniqueItems', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          uniqueItems: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          uniqueItems: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          uniqueItems: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            uniqueItems: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          uniqueItems: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: enum', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          enum: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Schema.createDefinition({
          enum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Schema.createDefinition({
          enum: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Schema.createDefinition({
          enum: [[]]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Schema.createDefinition({
          enum: [{}]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: multipleOf', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          multipleOf: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          multipleOf: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          multipleOf: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            multipleOf: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          multipleOf: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: required', () => {

      it('can be an array of  string', () => {
        const def = Schema.createDefinition({
          required: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be an array of  boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          required: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          required: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          required: { x: ['value'] }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: type', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          type: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          type: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          type: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            type: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          type: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: items', () => {
      it('should not be a $ref', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            items: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allOf', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          allOf: [{ $ref: '#/' }]
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an array of  boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: { x: ['value'] }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: properties', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          properties: { x: { $ref: '#/' } }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          properties: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          properties: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          properties: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            properties: [{ x: 'value' }]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: additionalProperties', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          additionalProperties: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })



      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          additionalProperties: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          additionalProperties: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          additionalProperties: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            additionalProperties: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          additionalProperties: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: discriminator', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          discriminator: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            discriminator: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: readOnly', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          readOnly: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          readOnly: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          readOnly: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            readOnly: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          readOnly: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: xml', () => {
      it('should not be a $ref', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Xml', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            xml: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Xml', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: externalDocs', () => {
      it('should not be a $ref', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of ExternalDocumentation', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            externalDocs: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped ExternalDocumentation', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: example', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          example: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Schema.createDefinition({
          example: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Schema.createDefinition({
          example: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Schema.createDefinition({
          example: []
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Schema.createDefinition({
          example: {}
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })
  })

  describe('v3', () => {
    const Schema = E.Schema3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Schema.createDefinition()
        const es = Schema.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Schema.createDefinition()
        // @ts-expect-error
        const es = Schema.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })

    describe('property: type', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          type: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          type: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          type: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            type: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          type: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: allOf', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          allOf: [{ $ref: '#/' }]
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an array of  boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          allOf: { x: ['value'] }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: oneOf', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          oneOf: [{ $ref: '#/' }]
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an array of  boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          oneOf: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          oneOf: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          oneOf: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          oneOf: { x: ['value'] }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: anyOf', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          anyOf: [{ $ref: '#/' }]
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an array of  boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          anyOf: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          anyOf: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          anyOf: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          anyOf: { x: ['value'] }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: not', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          not: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          not: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          not: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          not: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            not: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          not: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: title', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          title: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          title: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          title: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            title: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          title: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maximum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maximum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maximum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maximum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maximum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maximum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMaximum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          exclusiveMaximum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            exclusiveMaximum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMaximum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minimum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minimum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minimum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minimum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minimum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minimum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: exclusiveMinimum', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          exclusiveMinimum: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            exclusiveMinimum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          exclusiveMinimum: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxLength', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maxLength: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxLength: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxLength: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maxLength: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxLength: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minLength', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minLength: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minLength: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minLength: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minLength: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minLength: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: pattern', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          pattern: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          pattern: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          pattern: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            pattern: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          pattern: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxItems', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maxItems: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxItems: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxItems: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maxItems: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxItems: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minItems', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minItems: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minItems: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minItems: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minItems: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minItems: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: maxProperties', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          maxProperties: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxProperties: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxProperties: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            maxProperties: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          maxProperties: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: minProperties', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          minProperties: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minProperties: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minProperties: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            minProperties: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          minProperties: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: uniqueItems', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          uniqueItems: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          uniqueItems: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          uniqueItems: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            uniqueItems: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          uniqueItems: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: enum', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          enum: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Schema.createDefinition({
          enum: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Schema.createDefinition({
          enum: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Schema.createDefinition({
          enum: [[]]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Schema.createDefinition({
          enum: [{}]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: multipleOf', () => {

      it('can be a number', () => {
        const def = Schema.createDefinition({
          multipleOf: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          multipleOf: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          multipleOf: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            multipleOf: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          multipleOf: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: required', () => {

      it('can be an array of  string', () => {
        const def = Schema.createDefinition({
          required: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be an array of  boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          required: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of  number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          required: [0]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          required: { x: ['value'] }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: items', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          items: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            items: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          items: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: properties', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          properties: { x: { $ref: '#/' } }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          properties: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          properties: { x: 0 }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          properties: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            properties: [{ x: 'value' }]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: additionalProperties', () => {
      it('can be a $ref', () => {
        const def = Schema.createDefinition({
          additionalProperties: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
      })



      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          additionalProperties: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          additionalProperties: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          additionalProperties: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            additionalProperties: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Schema', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          additionalProperties: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: description', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          description: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          description: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          description: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            description: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          description: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: format', () => {

      it('can be a string', () => {
        const def = Schema.createDefinition({
          format: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          format: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          format: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            format: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          format: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: default', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          default: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Schema.createDefinition({
          default: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Schema.createDefinition({
          default: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Schema.createDefinition({
          default: []
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Schema.createDefinition({
          default: {}
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: nullable', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          nullable: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          nullable: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          nullable: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            nullable: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          nullable: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: discriminator', () => {
      it('should not be a $ref', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Discriminator', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            discriminator: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Discriminator', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          discriminator: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: readOnly', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          readOnly: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          readOnly: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          readOnly: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            readOnly: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          readOnly: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: writeOnly', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          writeOnly: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          writeOnly: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          writeOnly: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            writeOnly: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          writeOnly: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: xml', () => {
      it('should not be a $ref', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of Xml', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            xml: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped Xml', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          xml: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: externalDocs', () => {
      it('should not be a $ref', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: { $ref: '#/' }
        })
        const es = Schema.validate(def)
        expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
      })

      it('cannot be a boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of ExternalDocumentation', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            externalDocs: ['value']
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped ExternalDocumentation', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          externalDocs: { x: 'value' }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })

    describe('property: example', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          example: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a number', () => {
        const def = Schema.createDefinition({
          example: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })

      it('can be a string', () => {
        const def = Schema.createDefinition({
          example: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an array', () => {
        const def = Schema.createDefinition({
          example: []
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('can be an object', () => {
        const def = Schema.createDefinition({
          example: {}
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
    })

    describe('property: deprecated', () => {

      it('can be a boolean', () => {
        const def = Schema.createDefinition({
          deprecated: true
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
      })
      it('cannot be a number', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          deprecated: 0
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be a string', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          deprecated: 'value'
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an array of boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
            deprecated: [true]
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })

      it('cannot be an object of mapped boolean', () => {
        const def = Schema.createDefinition({
          // @ts-expect-error
          deprecated: { x: true }
        })
        const es = Schema.validate(def)
        expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
      })
    })
  })
})
