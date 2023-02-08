import { expect } from 'chai'
import { EnforcerComponent } from '../src/components/Component'
import { IComponentSpec, IVersion } from '../src/components/IComponent'
import { ISchemaDefinition, IProperty } from '../src/ComponentSchemaDefinition/IComponentSchemaDefinition'
import { SchemaProcessor } from '../src/ComponentSchemaDefinition/SchemaProcessor'

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

  describe('named properties', () => {

  })

  describe('additional properties', () => {

  })

  describe('one time validation per definition schema', () => {

  })
})
