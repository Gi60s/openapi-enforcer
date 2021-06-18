import { Header } from '../../src'
import { expect } from 'chai'

describe('Header component', () => {
  describe('build', () => {
    it('can build', () => {
      const component = new Header({})
      expect(component).to.be.instanceof(Header)
    })
  })

  describe('validate', () => {

  })
})