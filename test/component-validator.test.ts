import { expect } from 'chai'
import { EnforcerComponent } from '../src/components/Component'
import { IComponentSpec, IVersion } from '../src/components/IComponent'
import { ISchemaDefinition, IProperty } from '../src/ComponentSchemaDefinition/IComponentSchemaDefinition'
import { SchemaProcessor } from '../src/ComponentSchemaDefinition/SchemaProcessor'
import exp from 'constants'

class Foo extends EnforcerComponent<any> {
  constructor (definition: any, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'FOO'

  static spec: IComponentSpec = {
    '2.0': '',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (data: SchemaProcessor): ISchemaDefinition<any, any> {
    return this.customValidator(data)
  }

  static customValidator = function (data: SchemaProcessor): ISchemaDefinition<any, any> {
    return {
      type: 'object',
      allowsSchemaExtensions: true
    }
  }
}

describe.only('component validator', () => {
  let schema: ISchemaDefinition<any, any> = {
    type: 'object',
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'x',
        schema: { type: 'any' }
      }
    ]
  }
  let x: IProperty = schema.properties?.[0] as IProperty

  beforeEach(() => {
    schema = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        {
          name: 'x',
          schema: { type: 'any' }
        }
      ]
    }
    x = schema.properties?.[0] as IProperty
    Foo.customValidator = () => schema
  })

  describe('spec version support', () => {
    it('supports version 2.0', () => {
      const def = {}
      const es = Foo.validate(def, '2.0')
      expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
      expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
      expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
    })

    it('does not support version 3.0.0', () => {
      const def = {}
      const es = Foo.validate(def, '3.0.0')
      expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
    })

    it('does not support version 3.0.1', () => {
      const def = {}
      const es = Foo.validate(def, '3.0.1')
      expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
    })

    it('does not support version 3.0.2', () => {
      const def = {}
      const es = Foo.validate(def, '3.0.2')
      expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
    })

    it('does not support version 3.0.3', () => {
      const def = {}
      const es = Foo.validate(def, '3.0.3')
      expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
    })

    it('does not support version X.Y.Z', () => {
      const def = {}
      // @ts-expect-error
      const es = Foo.validate(def, 'X.Y.Z')
      expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
    })
  })

  describe('common validations', () => {

    describe('allowed', () => {
      it('will produce an error if the property is not allowed', () => {
        x.schema.notAllowed = 'Not allowed because I said so.'
        const es = Foo.validate({ x: true })
        expect(es.hasErrorByCode('PROPERTY_NOT_ALLOWED')).to.equal(true)
      })

      it('will produce an error if the property is allowed but not specified with no additional properties', () => {
        const es = Foo.validate({ y: true })
        expect(es.hasErrorByCode('PROPERTY_UNKNOWN')).to.equal(true)
      })

      it('will produce an error if the property is not allowed but allowed via additional properties', () => {
        schema.additionalProperties = { type: 'any' }
        x.schema.notAllowed = 'Not allowed because I said so'
        const es = Foo.validate({ x: true })
        expect(es.hasErrorByCode('PROPERTY_NOT_ALLOWED')).to.equal(true)
      })

      it('will not produce an error if the property is not specified but allows additional properties', () => {
        schema.additionalProperties = { type: 'any' }
        const es = Foo.validate({ y: true })
        expect(es.hasErrorByCode('PROPERTY_NOT_ALLOWED')).to.equal(false)
      })
    })

    describe('enum', () => {
      it('is valid if enum value is met', () => {
        schema.additionalProperties = { type: 'string', enum: ['a', 'b'] }
        const es = Foo.validate({ y: 'a' })
        expect(es.hasErrorByCode('ENUM_NOT_MET')).to.equal(false)
      })

      it('is not valid if enum value is not met', () => {
        schema.additionalProperties = { type: 'string', enum: ['a', 'b'] }
        const es = Foo.validate({ y: 'c' })
        expect(es.hasErrorByCode('ENUM_NOT_MET')).to.equal(true)
      })
    })

    describe('ignored', () => {
      it('can be valid if ignored', () => {
        schema.additionalProperties = { type: 'string', ignored: true }
        const es = Foo.validate({ y: 'a' })
        expect(es.hasError).to.equal(false)
      })

      it('can be invalid if ignored', () => {
        schema.additionalProperties = { type: 'string', ignored: true }
        const es = Foo.validate({ y: true })
        expect(es.hasError).to.equal(false)
      })
    })

    describe('nullable', () => {
      it('can be null if nullable', () => {
        schema.additionalProperties = { type: 'string', nullable: true }
        const es = Foo.validate({ y: null })
        expect(es.hasErrorByCode('ENUM_NOT_MET')).to.equal(false)
      })

      it('cannot be null if not nullable', () => {
        schema.additionalProperties = { type: 'string', nullable: false }
        const es = Foo.validate({ y: null })
        expect(es.hasErrorByCode('NULL_INVALID')).to.equal(true)
      })
    })
  })

  describe('boolean', () => {
    it('can be true', () => {
      schema.additionalProperties = { type: 'boolean' }
      const es = Foo.validate({ y: true })
      expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
    })

    it('can be false', () => {
      schema.additionalProperties = { type: 'boolean' }
      const es = Foo.validate({ y: false })
      expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(false)
    })

    it('cannot be a string', () => {
      schema.additionalProperties = { type: 'boolean' }
      const es = Foo.validate({ y: 'foo' })
      expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
    })

    it('cannot be ref', () => {
      schema.additionalProperties = { type: 'boolean' }
      const es = Foo.validate({ y: { $ref: '#' } })
      expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
    })
  })

  describe('component', () => {
    it('can be ref when allowed', () => {
      schema.additionalProperties = { type: 'component', allowsRef: true, component: Foo }
      const es = Foo.validate({ y: { $ref: '#' } })
      expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(false)
    })

    it('cannot be ref when not allowed', () => {
      schema.additionalProperties = { type: 'component', allowsRef: false, component: Foo }
      const es = Foo.validate({ y: { $ref: '#' } })
      expect(es.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
    })

    it('can have valid definition', () => {
      schema.additionalProperties = { type: 'component', allowsRef: true, component: Foo }
      const es = Foo.validate({ y: { x: true } })
      expect(es.hasError).to.equal(false)
    })

    it('cannot have invalid definition', () => {
      x.schema = { type: 'string' }
      schema.additionalProperties = { type: 'component', allowsRef: true, component: Foo }
      const es = Foo.validate({ y: { x: true } })
      expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
    })
  })

  describe('number', () => {
    it('can be a number', () => {
      x.schema = { type: 'number' }
      const es = Foo.validate({ x: 1.5 })
      expect(es.hasError).to.equal(false)
    })

    it('cannot be a boolean', () => {
      x.schema = { type: 'number' }
      const es = Foo.validate({ x: true })
      expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
    })

    it('can be constrained by minimum', () => {
      x.schema = { type: 'number', minimum: 10 }
      const es = Foo.validate({ x: 1 })
      expect(es.hasErrorByCode('VALUE_OUT_OF_RANGE_MIN')).to.equal(true)
    })

    it('can be constrained by maximum', () => {
      x.schema = { type: 'number', maximum: 10 }
      const es = Foo.validate({ x: 11 })
      expect(es.hasErrorByCode('VALUE_OUT_OF_RANGE_MAX')).to.equal(true)
    })

    it('can be constrained to integer', () => {
      x.schema = { type: 'number', integer: true }
      const es = Foo.validate({ x: 1.5 })
      expect(es.hasErrorByCode('VALUE_TYPE_INVALID')).to.equal(true)
    })
  })

  describe('oneOf', () => {
    it('can distinguish correct schema', () => {
      x.schema = {
        type: 'oneOf',
        oneOf: [
          {
            condition: d => typeof d.definition === 'string',
            schema: { type: 'string' }
          },
          {
            condition: d => typeof d.definition === 'number',
            schema: { type: 'number' }
          }
        ]
      }
      expect(Foo.validate({ x: 'foo' }).hasError).to.equal(false)
      expect(Foo.validate({ x: 1 }).hasError).to.equal(false)
      expect(Foo.validate({ x: false }).hasErrorByCode('SCHEMA_NOT_MET')).to.equal(true)
    })

    it('can determine correct $ref allow state', () => {
      schema.properties?.push({
        name: 'y',
        schema: {
          type: 'oneOf',
          oneOf: [
            {
              condition: d => true,
              schema: { type: 'component', allowsRef: true, component: Foo }
            }
          ]
        }
      })

      schema.properties?.push({
        name: 'z',
        schema: {
          type: 'oneOf',
          oneOf: [
            {
              condition: d => true,
              schema: { type: 'component', allowsRef: false, component: Foo }
            }
          ]
        }
      })

      const xResult = Foo.validate({ x: { $ref: '#' } })
      expect(xResult.hasError).to.equal(false)
      expect(xResult.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)

      const yResult = Foo.validate({ y: { $ref: '#' } })
      expect(yResult.hasError).to.equal(false)
      expect(yResult.hasError).to.equal(false)

      const zResult = Foo.validate({ z: { $ref: '#' } })
      expect(zResult.hasError).to.equal(false)
      expect(zResult.hasWarningByCode('REF_NOT_ALLOWED')).to.equal(true)
    })
  })

  describe('object', () => {
    describe('named properties', () => {

    })

    describe('additional properties', () => {

    })
  })

  describe('one time validation per definition schema', () => {

  })
})
