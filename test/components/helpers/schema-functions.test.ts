import { expect } from 'chai'
import { Exception } from '../../../src'
import { Schema } from '../../../src/components/v3/Schema'
import { deserialize, MapStore } from '../../../src/components/helpers/schema-functions'

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

  describe.only('deserialize', () => {
    it('can deserialize a boolean', () => {
      const schema = new Schema({ type: 'boolean' })
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, true, new MapStore<any>(), exception)
      expect(result).to.equal(true)
    })

    it('can deserialize a number', () => {
      const schema = new Schema({ type: 'number' })
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, '1', new MapStore<any>(), exception)
      expect(result).to.equal(1)
    })

    it('can deserialize a string', () => {
      const schema = new Schema({ type: 'string' })
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, '1', new MapStore<any>(), exception)
      expect(result).to.equal('1')
    })

    it('can deserialize a date', () => {
      const schema = new Schema({ type: 'string', format: 'date' })
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, '2000-01-01', new MapStore<any>(), exception)
      expect(result).to.be.an.instanceof(Date)
    })

    it('can deserialize a simple array', () => {
      const schema = new Schema({ type: 'array', items: { type: 'number' } })
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, ['1', '2'], new MapStore<any>(), exception)
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
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, [['1', '2'], [3], [4, '5']], new MapStore<any>(), exception)
      expect(result).to.deep.equal([[1, 2], [3], [4, 5]])
    })

    it('can deserialize a simple object with additionalProperties: true', () => {
      const schema = new Schema({ type: 'object', additionalProperties: true })
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, { a: 1, b: '2' }, new MapStore<any>(), exception)
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
      const exception = new Exception('Unable to deserialize')
      const { result } = deserialize(schema, { a: '1', b: '2' }, new MapStore<any>(), exception)
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
      const exception = new Exception('Unable to deserialize')
      const value = {
        n: '1',
        a: ['1', 2, 3.5],
        o: { d: '2000-01-01' }
      }
      const { result } = deserialize(schema, value, new MapStore<any>(), exception)
      expect(result.n).to.equal(1)
      expect(result.a).to.deep.equal([1, 2, 3.5])
      expect(result.o.d).to.be.an.instanceof(Date)
    })

    describe('allOf', () => {
      it('can deserialize allOf with single item', () => {
        const schema = new Schema({
          allOf: [{ type: 'number' }]
        })
        const exception = new Exception('Unable to deserialize')
        const { result } = deserialize(schema, '1', new MapStore<any>(), exception)
        expect(result).to.equal(1)
      })

      it('can deserialize allOf with multiple items of same type', () => {
        const schema = new Schema({
          allOf: [
            { maximum: 15 },
            { minimum: 5 }
          ]
        })
        const exception = new Exception('Unable to deserialize')
        const { result } = deserialize(schema, '10', new MapStore<any>(), exception)
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
        const exception = new Exception('Unable to deserialize')
        const { result } = deserialize(schema, '10', new MapStore<any>(), exception)
        expect(result).to.equal(10)
      })
    })

    describe('oneOf', () => {
      it('can select correct type based on value', () => {
        const schema = new Schema({
          oneOf: [
            { type: 'string' },
            { type: 'number' }
          ]
        })
        const exception = new Exception('Unable to deserialize')
        const { result } = deserialize(schema, '10', new MapStore<any>(), exception)
        expect(result).to.equal(10)
      })
    })
  })
})
