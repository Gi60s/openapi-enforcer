import { expect } from 'chai'
import { Schema } from '../../../src/components/v3/Schema'
import { Schema3 as Definition } from '../../../src/components/helpers/definition-types'
import { deserialize, serialize } from '../../../src/components/helpers/schema-functions'

describe('schema-functions', () => {
  describe('deserialize', () => {
    it('can deserialize a boolean', () => {
      const schema = new Schema({ type: 'boolean' })
      const [result] = deserialize(schema, true)
      expect(result).to.equal(true)
    })

    it('can deserialize a number', () => {
      const schema = new Schema({ type: 'number' })
      const [result] = deserialize(schema, '1')
      expect(result).to.equal(1)
    })

    it('can deserialize a string', () => {
      const schema = new Schema({ type: 'string' })
      const [result] = deserialize(schema, '1')
      expect(result).to.equal('1')
    })

    it('can deserialize a date', () => {
      const schema = new Schema({ type: 'string', format: 'date' })
      const [result] = deserialize(schema, '2000-01-01')
      expect(result).to.be.an.instanceof(Date)
    })

    it('can deserialize a simple array', () => {
      const schema = new Schema({ type: 'array', items: { type: 'number' } })
      const [result] = deserialize(schema, ['1', '2'])
      expect(result).to.deep.equal([1, 2])
    })

    it('can deserialize a nested array', () => {
      const schema = new Schema({
        type: 'array',
        items: {
          type: 'array',
          items: { type: 'number' }
        }
      })
      const [result] = deserialize(schema, [['1', '2'], [3], [4, '5']])
      expect(result).to.deep.equal([[1, 2], [3], [4, 5]])
    })

    it('can deserialize a simple object with additionalProperties: true', () => {
      const schema = new Schema({ type: 'object', additionalProperties: true })
      const [result] = deserialize(schema, { a: 1, b: '2' })
      expect(result).to.deep.equal({ a: 1, b: '2' })
    })

    it('can deserialize a simple object with specific properties', () => {
      const schema = new Schema({
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'string' }
        }
      })
      const [result] = deserialize(schema, { a: '1', b: '2' })
      expect(result).to.deep.equal({ a: 1, b: '2' })
    })

    it('can deserialize a nested object', () => {
      const schema = new Schema({
        type: 'object',
        properties: {
          n: { type: 'number' },
          a: {
            type: 'array',
            items: { type: 'number' }
          },
          o: {
            type: 'object',
            properties: {
              d: { type: 'string', format: 'date' }
            }
          }
        }
      })
      const value = {
        n: '1',
        a: ['1', 2, 3.5],
        o: { d: '2000-01-01' }
      }
      const [result] = deserialize(schema, value)
      expect(result.n).to.equal(1)
      expect(result.a).to.deep.equal([1, 2, 3.5])
      expect(result.o.d).to.be.an.instanceof(Date)
    })

    it('can deserialize a recursive value', () => {
      const def: Definition = {
        type: 'object',
        properties: {
          b: { type: 'number' }
        }
      }
      if (def.properties !== undefined) def.properties.a = def
      const value: any = { b: '1' }
      value.a = value

      const schema = new Schema(def)
      const [result] = deserialize(schema, value)
      expect(result.a).to.equal(result)
      expect(result.b).to.equal(1)
    })

    describe('allOf', () => {
      it('can deserialize allOf with single item', () => {
        const schema = new Schema({
          allOf: [{ type: 'number' }]
        })
        const [result] = deserialize(schema, '1')
        expect(result).to.equal(1)
      })

      it('can deserialize allOf with multiple items of same type', () => {
        const schema = new Schema({
          allOf: [
            { maximum: 15 },
            { minimum: 5 }
          ]
        })
        const [result] = deserialize(schema, '10')
        expect(result).to.equal(10)
      })

      it('can deserialize allOf with nested oneOf', () => {
        const schema = new Schema({
          allOf: [
            {
              oneOf: [{ type: 'number' }]
            }
          ]
        })
        const [result] = deserialize(schema, '10')
        expect(result).to.equal(10)
      })
    })

    describe('oneOf', () => {
      it('will prefer number over string based on value type', () => {
        const schema = new Schema({
          oneOf: [
            { type: 'string' },
            { type: 'number' }
          ]
        })
        const [result] = deserialize(schema, '10')
        expect(result).to.equal(10)
      })

      it('will prefer Date over string based on value type', () => {
        const schema = new Schema({
          oneOf: [
            { type: 'string' },
            { type: 'string', format: 'date' }
          ]
        })
        const [result] = deserialize(schema, '2000-01-01')
        expect(result).to.be.an.instanceof(Date)
      })
    })
  })

  describe('merge', () => {
    describe('allOf', () => {
      it('will merge all schemas that match', () => {
        const schema = new Schema({
          allOf: [
            { minimum: 5 },
            { maximum: 5 },
            { minItems: 5 }
          ]
        })
        const schema2 = schema.enforcer.schema
        expect(schema2.type).to.equal('number')
        expect(schema2.minimum).to.equal(5)
        expect(schema2.maximum).to.equal(5)
        expect(schema2.minItems).to.equal(undefined)
      })
    })

    describe('anyOf', () => {
      it('will merge matching schemas', () => {
        const schema = new Schema({
          anyOf: [
            { minimum: 5 },
            { maximum: 5 },
            { minItems: 5 }
          ]
        })
        const schema2 = schema.enforcer.schema
        expect(schema2.type).to.equal('number')
        expect(schema2.minimum).to.equal(5)
        expect(schema2.minItems).to.equal(undefined)
      })
    })

    describe('oneOf', () => {
      it('will merge first matching schema', () => {
        const schema = new Schema({
          oneOf: [
            { minimum: 5 },
            { maximum: 5 },
            { minItems: 5 }
          ]
        })
        const schema2 = schema.enforcer.schema
        expect(schema2.type).to.equal('number')
        expect(schema2.minimum).to.equal(5)
        expect(schema2.maximum).to.equal(undefined)
        expect(schema2.minItems).to.equal(undefined)
      })
    })
  })

  describe('populate', () => {
    describe('default', () => {
      it('can populate number from default', () => {
        const schema = new Schema({ type: 'number', default: 10 })
        const [result] = schema.populate()
        expect(result).to.equal(10)
      })

      it('can populate date from default', () => {
        const schema = new Schema({ type: 'string', format: 'date-time', default: '2000-01-01T00:00:00.000Z' })
        const [result] = schema.populate()
        expect(result).to.be.an.instanceof(Date)
        expect(+result).to.equal(+new Date('2000-01-01T00:00:00.000Z'))
      })

      it('can populate object from default', () => {
        const schema = new Schema({ type: 'object', default: { foo: 'bar' } })
        const [result] = schema.populate()
        expect(result).to.deep.equal({ foo: 'bar' })
      })

      it('can populate object properties from default', () => {
        const schema = new Schema({
          type: 'object',
          properties: {
            a: { default: 'foo' },
            b: { default: 1 }
          }
        })
        const [result] = schema.populate()
        expect(result).to.deep.equal({ a: 'foo', b: 1 })
      })

      it('can populate object properties from default with initial value', () => {
        const schema = new Schema({
          type: 'object',
          properties: {
            a: { default: 'foo' },
            b: { default: 1 },
            c: { type: 'string' }
          }
        })
        const [result] = schema.populate({ c: 'c' })
        expect(result).to.deep.equal({ a: 'foo', b: 1, c: 'c' })
      })

      it('can populate object from default and add properties from default', () => {
        const schema = new Schema({
          type: 'object',
          default: { a: 'a' },
          properties: {
            a: { default: 'foo' },
            b: { default: 1 }
          }
        })
        const [result] = schema.populate()
        expect(result).to.deep.equal({ a: 'a', b: 1 })
      })

      it('can populate an object from additional properties', () => {
        const schema = new Schema({
          additionalProperties: {
            type: 'object',
            properties: {
              a: { default: 'a' },
              b: { type: 'number' }
            }
          }
        })
        const [result] = schema.populate({ x: { b: 1 } })
        expect(result).to.deep.equal({ x: { a: 'a', b: 1 } })
      })

      it('can populate array with undefined items', () => {
        const schema = new Schema({
          type: 'array',
          items: {
            default: 0
          }
        })
        const [result] = schema.populate(new Array(3))
        expect(result).to.deep.equal([0, 0, 0])
      })

      it('can populate array with defined items', () => {
        const schema = new Schema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              a: { default: 'a' }
            }
          }
        })
        const [result] = schema.populate([{}])
        expect(result).to.deep.equal([{ a: 'a' }])
      })

      it('can have defaults disabled via an option', () => {
        const schema = new Schema({ default: 'hello' })
        const [result] = schema.populate(null, {}, { useDefaults: false })
        expect(result).to.equal(undefined)
      })

      it('can have defaults disabled via an extension', () => {
        const schema = new Schema({
          default: 'hello',
          'x-enforcer': {
            populate: { useDefault: false }
          }
        })
        const [result] = schema.populate()
        expect(result).to.equal(undefined)
      })

      it('will use parameters with defaults (by default)', () => {
        const schema = new Schema({
          type: 'string',
          default: '{firstName} {lastName}'
        })
        const [result] = schema.populate(null, { firstName: 'Bob', lastName: 'Jones' })
        expect(result).to.equal('Bob Jones')
      })

      it('will not use parameters with defaults (via options)', () => {
        const schema = new Schema({
          type: 'string',
          default: '{firstName} {lastName}'
        })
        const [result] = schema.populate(null, { firstName: 'Bob', lastName: 'Jones' }, { replacement: 'none' })
        expect(result).to.equal('{firstName} {lastName}')
      })

      it('will use x-enforcer populate default over default', () => {
        const schema = new Schema({
          type: 'string',
          default: 'default',
          'x-enforcer': {
            populate: {
              default: 'x-default'
            }
          }
        })
        const [result] = schema.populate()
        expect(result).to.equal('x-default')
      })
    })

    describe('parameters', () => {
      it('will replace parameters using the current key value', function () {
        const schema = new Schema({
          type: 'object',
          properties: {
            a: { type: 'string' },
            b: { type: 'number' }
          }
        })
        const [result] = schema.populate({ b: 1 }, { a: 'a' })
        expect(result).to.deep.equal({ a: 'a', b: 1 })
      })

      it('will replace parameters using the current enforcer populate id over the property name', function () {
        const schema = new Schema({
          type: 'object',
          properties: {
            a: {
              type: 'string',
              'x-enforcer': {
                populate: {
                  id: 'first'
                }
              }
            }
          }
        })
        const [result] = schema.populate({}, { a: 'a', first: 'first' })
        expect(result).to.deep.equal({ a: 'first' })
      })

      it('will replace the parameter with value exactly as is', () => {
        const schema = new Schema({
          type: 'object',
          properties: {
            num: { type: 'number' }
          }
        })
        const s = Symbol('nan')
        const [result] = schema.populate({}, { num: s })
        expect(result.num).to.equal(s)
      })
    })
  })

  describe('random', () => {
    it('can generate a random boolean', () => {
      const schema = new Schema({ type: 'boolean' })
      const [result] = schema.random()
      expect(result).to.be.oneOf([true, false])
    })

    it('can generate a random integer', () => {
      const schema = new Schema({ type: 'integer' })
      const [result] = schema.random()
      expect(result).to.be.a('number')
      expect(result % 1).to.equal(0)
    })

    it('can generate a random string', () => {
      const schema = new Schema({ type: 'string' })
      const [result] = schema.random()
      expect(result).to.be.a('string')
    })

    it('will not overwrite existing primitive value', () => {
      const schema = new Schema({ type: 'string' })
      const [result] = schema.random('hello')
      expect(result).to.equal('hello')
    })

    describe('array', () => {
      it('can generate a random array of number', () => {
        const schema = new Schema({ type: 'array', minItems: 1, items: { type: 'number' } })
        const [result] = schema.random()
        expect(result).to.be.an('array')
        result.forEach((item: number) => expect(item).to.be.a('number'))
      })

      it('will populate a passed in array', () => {
        const schema = new Schema({ type: 'array', items: { type: 'number' } })
        const ar: number[] = []
        const [result] = schema.random(ar)
        expect(result).to.equal(ar)
      })

      it('will provide values for undefined items in the array', () => {
        const schema = new Schema({ type: 'array', maxItems: 5, items: { type: 'number' } })
        const ar: any[] = Array(5)
        const [result] = schema.random(ar)
        expect(result.length).to.equal(5)
        result.forEach((item: number) => expect(item).to.be.a('number'))
      })

      it('can populate a sub-array', () => {
        const schema = new Schema({
          type: 'array',
          minItems: 1,
          items: {
            type: 'array',
            minItems: 1,
            items: { type: 'number' }
          }
        })
        const [result] = schema.random()
        expect(result[0]).to.be.an('array')
        expect(result[0][0]).to.be.a('number')
      })

      it('can populate a sub-object', () => {
        const schema = new Schema({
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            minProperties: 1
          }
        })
        const [result] = schema.random()
        expect(result[0]).to.be.an('object')
        expect(Object.keys(result[0]).length).to.be.greaterThan(0)
      })
    })

    describe('object', () => {
      it('will generate random values for required properties', () => {
        const schema = new Schema({
          type: 'object',
          required: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
          properties: {
            a: { type: 'string' },
            b: { type: 'integer' },
            c: { type: 'string', format: 'date-time' }
          }
        })
        const [result] = schema.random()
        expect(result.a).to.be.a('string')
        expect(result.b).to.be.a('number')
        expect(result.b % 1).to.equal(0)
        expect(result.c).to.be.an.instanceof(Date)
        expect(result).to.haveOwnProperty('d')
        expect(result).to.haveOwnProperty('e')
        expect(result).to.haveOwnProperty('f')
        expect(result).to.haveOwnProperty('g')
      })

      it('will generate random values for some optional properties', () => {
        const schema = new Schema({
          type: 'object',
          properties: {
            a: { type: 'string' },
            b: { type: 'integer' },
            c: { type: 'string', format: 'date-time' }
          }
        })
        const [result] = schema.random()
        if ('a' in result) expect(result.a).to.be.a('string')
        if ('b' in result) {
          expect(result.b).to.be.a('number')
          expect(result.b % 1).to.equal(0)
        }
        if ('c' in result) expect(result.c).to.be.an.instanceof(Date)
      })

      it('can specify to not add additional properties', () => {
        const schema = new Schema({
          additionalProperties: false
        })
        const [result] = schema.random()
        expect(result).to.deep.equal({})
      })

      it('can have a nested object', () => {
        const schema = new Schema({
          type: 'object',
          required: ['a'],
          properties: {
            a: {
              type: 'object',
              required: ['b'],
              properties: {
                b: { type: 'number' }
              }
            }
          }
        })
        const [result] = schema.random()
        expect(result.a.b).to.be.a('number')
      })

      it('can have a nested array', () => {
        const schema = new Schema({
          type: 'object',
          required: ['a'],
          properties: {
            a: {
              type: 'array',
              minItems: 1,
              items: { type: 'number' }
            }
          }
        })
        const [result] = schema.random()
        expect(result.a[0]).to.be.a('number')
      })

      it('will populate a passed in object', () => {
        const schema = new Schema({
          type: 'object',
          required: ['a', 'b'],
          properties: {
            a: { type: 'string' },
            b: { type: 'integer' }
          }
        })
        const obj: any = { a: 'hello' }
        const [result] = schema.random(obj)
        expect(result.a).to.equal('hello')
        expect(result.b).to.be.a('number')
      })
    })

    describe('allOf', () => {
      it('will take into account multiple schemas', () => {
        const schema = new Schema({
          allOf: [
            { minimum: 5 },
            { maximum: 5 }
          ]
        })
        const [result] = schema.random()
        expect(result).to.equal(5)
      })
    })
  })

  describe('serialize', () => {
    it('can serialize a boolean', () => {
      const schema = new Schema({ type: 'boolean' })
      const [result] = serialize(schema, true)
      expect(result).to.equal(true)
    })

    it('can serialize a number', () => {
      const schema = new Schema({ type: 'number' })
      const [result] = serialize(schema, 1)
      expect(result).to.equal(1)
    })

    it('can serialize a string', () => {
      const schema = new Schema({ type: 'string' })
      const [result] = serialize(schema, '1')
      expect(result).to.equal('1')
    })

    it('can serialize a date', () => {
      const schema = new Schema({ type: 'string', format: 'date' })
      const [result] = serialize(schema, new Date())
      expect(result).to.match(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('can serialize a simple array', () => {
      const schema = new Schema({ type: 'array', items: { type: 'number' } })
      const [result] = serialize(schema, [1, 2])
      expect(result).to.deep.equal([1, 2])
    })

    it('can serialize a simple object with additionalProperties: true', () => {
      const schema = new Schema({ type: 'object', additionalProperties: true })
      const [result] = serialize(schema, { a: 1, b: '2' })
      expect(result).to.deep.equal({ a: 1, b: '2' })
    })

    it('can serialize a simple object with specific properties', () => {
      const schema = new Schema({
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'string' }
        }
      })
      const [result] = deserialize(schema, { a: 1, b: '2' })
      expect(result).to.deep.equal({ a: 1, b: '2' })
    })

    it('can serialize a recursive value', () => {
      const def: Definition = {
        type: 'object',
        properties: {
          b: { type: 'number' }
        }
      }
      if (def.properties !== undefined) def.properties.a = def
      const value: any = { b: 1 }
      value.a = value

      const schema = new Schema(def)
      const [result] = serialize(schema, value)
      expect(result.a).to.equal(result)
      expect(result.b).to.equal(1)
    })

    describe('allOf', () => {
      it('can serialize allOf with single item', () => {
        const schema = new Schema({
          allOf: [{ type: 'number' }]
        })
        const [result] = deserialize(schema, 1)
        expect(result).to.equal(1)
      })

      it('can serialize allOf with multiple items of same type', () => {
        const schema = new Schema({
          allOf: [
            { maximum: 15 },
            { minimum: 5 }
          ]
        })
        const [result] = deserialize(schema, 10)
        expect(result).to.equal(10)
      })

      it('can serialize allOf with nested oneOf', () => {
        const schema = new Schema({
          allOf: [
            {
              oneOf: [{ type: 'number' }]
            }
          ]
        })
        const [result] = deserialize(schema, 10)
        expect(result).to.equal(10)
      })
    })

    describe('oneOf', () => {
      it('will prefer number over string based on value type', () => {
        const schema = new Schema({
          oneOf: [
            { type: 'string' },
            { type: 'number' }
          ]
        })
        const [result] = serialize(schema, 10)
        expect(result).to.equal(10)
      })

      it('will prefer Date over string based on value type', () => {
        const schema = new Schema({
          oneOf: [
            { type: 'string' },
            { type: 'string', format: 'date' }
          ]
        })
        const [result] = serialize(schema, new Date())
        expect(result).to.match(/^\d{4}-\d{2}-\d{2}$/)
        expect(typeof result).to.equal('string')
      })
    })
  })
})
