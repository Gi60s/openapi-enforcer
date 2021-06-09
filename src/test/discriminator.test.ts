import { OpenAPI } from '../components/OpenAPI'
import { Discriminator } from '../components/Discriminator'
import { expect } from 'chai'
import path from 'path'
import { resourcesDirectory, server } from '../test-utils'

describe.only('Discriminator component', () => {
  describe('build', () => {
    it('can build', function () {
      // @ts-expect-error
      const contact = new Discriminator({})
      expect(contact).to.be.instanceOf(Discriminator)
    })
  })

  describe('validate', () => {
    it('has required property: propertyName', function () {
      // @ts-expect-error
      const [error] = Discriminator.validate({})
      expect(error).to.match(/Missing required property: propertyName/)
    })

    it('does not allow extensions', () => {
      // @ts-expect-error
      const [, warn] = Discriminator.validate({ 'x-foo': 'foo' })
      expect(warn).to.match(/Schema extensions not allowed here/)
    })

    it('cannot have invalid properties', function () {
      // @ts-expect-error
      const [error] = Discriminator.validate({
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    describe('property: propertyName', function () {
      it('can be a string', function () {
        const [error] = Discriminator.validate({ propertyName: 'petType' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = Discriminator.validate({
          // @ts-expect-error
          propertyName: 12
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: mapping', function () {
      it('can be an object', function () {
        const [error] = Discriminator.validate({ propertyName: 'petType', mapping: {} })
        expect(error).to.equal(undefined)
      })

      it('must be a non-null object', function () {
        // @ts-expect-error
        const [error] = Discriminator.validate({ propertyName: 'petType', mapping: 12 })
        expect(error).to.match(/Expected a non-null object/)
      })

      it.only('will warn of unresolvable mappings', async function () {
        const filePath = path.resolve(resourcesDirectory, 'discriminator', 'one-of.yml')
        const [openapi, error, warn] = await OpenAPI.load(filePath)
        // const [, warn] = Discriminator.validate({
        //   propertyName: 'petType',
        //   mapping: {
        //     dog: '#/components/schemas/Dog'
        //   }
        // })
        expect(warn).to.match(/Expected a non-null object/)
      })

      // it('must be a string', function () {
      //   const [error] = Contact.validate({
      //     // @ts-expect-error
      //     url: 12
      //   })
      //   expect(error).to.match(/Expected a string/)
      // })
    })
  })
})
