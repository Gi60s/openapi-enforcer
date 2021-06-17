import { OpenAPI } from '../../src/components/OpenAPI'
import { Discriminator } from '../../src/components/Discriminator'
import { expect } from 'chai'
import path from 'path'
import { resourcesDirectory } from '../util/helpers'
import { server } from '../util/helpers'

before(async () => {
  await server.start()
})
after(() => {
  server.stop()
})

describe('Discriminator component', () => {
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

      it('will resolve mappings with load', async function () {
        const filePath = path.resolve(resourcesDirectory, 'discriminator', 'one-of.yml')
        const [openapi] = await OpenAPI.load(filePath)

        const mapping = openapi.components.schemas.Pet.discriminator.mapping
        const oneOf = openapi.components.schemas.Pet.oneOf
        expect(oneOf.includes(mapping.cat)).to.equal(true)
        expect(oneOf.includes(mapping.dog)).to.equal(true)
        expect(oneOf.includes(mapping.lizard)).to.equal(true)
        expect(oneOf.includes(mapping.cow)).to.equal(true)
      })

      it('will warn of unresolvable mappings', async function () {
        const filePath = path.resolve(resourcesDirectory, 'discriminator', 'one-of.yml')
        const [error] = await OpenAPI.load(filePath)
        // console.log(error)
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
