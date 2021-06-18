import { Encoding } from '../../src'
import { expect } from 'chai'

describe('Encoding component', () => {
  describe('build', () => {
    it('can build', () => {
      const encoding = new Encoding({})
      expect(encoding).to.be.instanceof(Encoding)
    })
  })

  describe('validate', () => {

  })
})