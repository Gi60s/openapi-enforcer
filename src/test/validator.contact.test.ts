/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai'
import { OpenAPIEnforcer, v2 } from '../index'

describe('Contact', function () {
  let Contact: v2.ContactClass

  before(() => {
    Contact = OpenAPIEnforcer().v2.Contact
  })

  describe('validator', function () {
    it('can have a name as a string', function () {
      const [value, error, warning] = Contact.validate({ name: 'foo' })
      expect(value).to.deep.equal({ name: 'foo' })
      expect(error).to.be.undefined
      expect(warning).to.be.undefined
    })

    it('cannot have a name as a number', function () {
      // @ts-expect-error
      const [value, error, warning] = Contact.validate({ name: 1 })
      expect(value).to.be.undefined
      expect(error).to.match(/Expected a string/)
      expect(warning).to.be.undefined
    })
  })
})
