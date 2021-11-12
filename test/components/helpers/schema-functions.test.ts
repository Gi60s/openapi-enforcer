import { expect } from 'chai'
import { Schema } from '../../../src/components/v3/Schema'
import { Schema3 as Definition } from '../../../src/components/helpers/DefinitionTypes'
import { deserialize, serialize } from '../../../src/components/helpers/schema-functions'

describe('schema-functions', () => {
  // describe('combinations', () => {
  //   it('will return a single schema if there are no additional combinations', () => {
  //     const results = combinations({ type: 'string' })
  //     expect(results.length).to.equal(1)
  //     expect(results[0]).to.deep.equal({ type: 'string' })
  //   })
  //
  //   describe('allOf', () => {
  //     it('will merge single layer allOf items into one', () => {
  //       const results = combinations({
  //         allOf: [
  //           { type: 'string' },
  //           { minLength: 10 }
  //         ]
  //       })
  //       expect(results.length).to.equal(1)
  //       expect(results[0]).to.deep.equal({ type: 'string', minLength: 10 })
  //     })
  //   })
  //
  //   describe('oneOf', () => {
  //     it('will find all combos in a single layer oneOf', () => {
  //       const results = combinations({
  //         oneOf: [
  //           { type: 'string' },
  //           { type: 'number' }
  //         ]
  //       })
  //       expect(results.length).to.equal(2)
  //       expect(results[0]).to.deep.equal({ type: 'string' })
  //       expect(results[1]).to.deep.equal({ type: 'number' })
  //     })
  //
  //     it('oneOf with nested allOf', () => {
  //       const results = combinations({
  //         oneOf: [
  //           {
  //             allOf: [
  //               { type: 'string' },
  //               { minLength: 10 }
  //             ]
  //           },
  //           { type: 'number' }
  //         ]
  //       })
  //       expect(results.length).to.equal(2)
  //       expect(results[0]).to.deep.equal({ type: 'number' })
  //       expect(results[1]).to.deep.equal({ type: 'string', minLength: 10 })
  //     })
  //   })
  // })

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
