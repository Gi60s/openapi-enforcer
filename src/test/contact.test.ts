import { Contact } from '../components/Contact'
import { expect } from 'chai'

describe('Contact component', () => {
  describe('build', () => {
    it('can build', function () {
      const contact = new Contact({})
      expect(contact).to.be.instanceOf(Contact)
    })
  })

  describe('validate', () => {
    it('can have no properties', function () {
      const error = Contact.validate({})
      expect(error.count).to.equal(0)
    })

    it('can have valid properties with valid values', function () {
      const error = Contact.validate({
        name: 'Bob',
        url: 'https://fake.com',
        email: 'email@email.com'
      })
      expect(error.count).to.equal(0)
    })

    it('cannot have invalid properties', function () {
      const error = Contact.validate({
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    it('cannot have wrong type for valid property', function () {
      const error = Contact.validate({
        // @ts-expect-error
        name: 12
      })
      expect(error).to.match(/Expected a string/)
    })
  })
})
