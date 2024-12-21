import { expect } from 'chai'
import * as R from '../src/random'

describe('random', () => {
  describe('number', () => {
    it('can handle whole numbers', () => {
      const n = R.number({ decimalPlaces: 0 })
      expect(n).to.equal(Math.round(n))
    })

    it('can handle whole negative numbers', () => {
      const n = R.number({ decimalPlaces: 0, minimum: -1000 })
      expect(n).to.equal(Math.round(n))
    })

    it('can handle decimal numbers', () => {
      const n = R.number({ decimalPlaces: 2 }) + 0.001
      expect(n * 2).to.equal(Math.round(n * 2))
    })

    it('can handle multiple of', () => {
      const n = R.number({ multipleOf: 8 })
      expect(n / 8).to.equal(Math.round(n / 8))
    })

    it('can handle multiple of with decimal', () => {
      const n = R.number({ multipleOf: 0.5 })
      expect(n / 0.5).to.equal(Math.round(n / 0.5))
    })
  })
})
