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
      const [error] = Contact.validate({})
      expect(error).to.equal(null)
    })

    it('can have valid properties with valid values', function () {
      const [error] = Contact.validate({
        name: 'Bob',
        url: 'https://fake.com',
        email: 'email@email.com'
      })
      expect(error).to.equal(null)
    })

    it('cannot have invalid properties', function () {
      const [error] = Contact.validate({
        foo: 'invalid'
      })
      expect(error).to.match(/foo - Property not part of the specification/)
    })

    it('cannot have wrong type for valid property', function () {
      const [error] = Contact.validate({
        // @ts-expect-error
        name: 12
      })
      expect(error).to.match(/Expected a string/)
    })
  })
})
