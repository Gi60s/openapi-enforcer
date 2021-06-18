import { ExternalDocumentation } from '../../src'
import { expect } from 'chai'

describe('ExternalDocumentation component', () => {
  describe('build', () => {
    it('can build', () => {
      const component = new ExternalDocumentation({ url: '' })
      expect(component).to.be.instanceof(ExternalDocumentation)
    })
  })

  describe('validate', () => {

  })
})