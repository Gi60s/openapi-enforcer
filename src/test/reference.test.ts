import { Reference } from '../components'
import { expect } from 'chai'

describe('Reference component', () => {
  describe('build', () => {
    it('can build', function () {
      // @ts-expect-error
      const reference = new Reference({})
      expect(reference).to.be.instanceOf(Reference)
    })
  })

  describe('validate', () => {
    it('must have $ref', function () {
      // @ts-expect-error
      const [error] = Reference.validate({})
      expect(error).to.match(/Missing required property: \$ref/)
    })

    it('can have valid $ref', function () {
      const [error] = Reference.validate({
        $ref: 'foo'
      })
      expect(error).to.equal(undefined)
    })

    it('cannot have invalid $ref', function () {
      const [error] = Reference.validate({
        // @ts-expect-error
        $ref: true
      })
      expect(error).to.match(/Expected a string./)
    })
  })
})
