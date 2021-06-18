import { Example } from '../../src'
import { expect } from 'chai'

describe('Example component', () => {
  describe('build', () => {
    it('can build', () => {
      const component = new Example({})
      expect(component).to.be.instanceof(Example)
    })
  })

  describe('validate', () => {

  })
})