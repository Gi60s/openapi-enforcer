import { Paths as Paths2 } from '../../src/components/v2/Paths'
import { Paths as Paths3 } from '../../src/components/v3/Paths'
import { expect } from 'chai'

describe('paths', () => {
  describe('validate', () => {
    it('can have two distinct paths with the same variables when methods differ', () => {
      const [error] = Paths3.validate({
        '/{x}': {
          get: {
            parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'ok' } }
          }
        },
        '/{y}': {
          put: {
            parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'ok' } }
          }
        }
      })
      expect(error).to.equal(undefined)
    })

    it('cannot have two distinct paths with the same variables when methods are the same', () => {
      const [error] = Paths3.validate({
        '/a/{x}': {
          get: {
            parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'ok' } }
          }
        },
        '/a/{y}': {
          get: {
            parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'ok' } }
          }
        },
        '/b/{x}': {
          get: {
            parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'ok' } }
          }
        },
        '/b/{y}': {
          get: {
            parameters: [{ name: 'x', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'ok' } }
          }
        }
      })
      expect(error?.exceptions.length).to.equal(2)
      expect(error?.exceptions[0].message).to.match(/Paths are in conflict/)
      expect(error?.exceptions[1].message).to.match(/Paths are in conflict/)
    })
  })
})
