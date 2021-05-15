import { Swagger } from '../components/Swagger'
import { expect } from 'chai'

describe('Contact component', () => {
  describe('build', () => {
    it('can build', function () {
      // @ts-expect-error
      const component = new Swagger({})
      expect(component).to.be.instanceOf(Swagger)
    })
  })

  describe.only('validate', () => {
    it('requires properties: swagger, info, and paths', function () {
      // @ts-expect-error
      const [error] = Swagger.validate({})
      expect(error).to.match(/Missing one or more required properties: info, paths, swagger/)
    })
  })
})
