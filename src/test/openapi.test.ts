import { OpenAPI } from '../components/OpenAPI'
import { Reference } from '../components/Reference'
import { Schema } from '../components/Schema'
import { expect } from 'chai'
import path from 'path'
import { resourcesDirectory } from '../test-utils'

describe('OpenAPI component', function () {
  describe.only('load', () => {
    it('can load and dereference', async () => {
      const filePath = path.resolve(resourcesDirectory, 'discriminator', 'one-of.yml')
      const [openapi] = await OpenAPI.load(filePath)
      expect(openapi?.components?.schemas?.Pet.oneOf[0]).to.be.instanceof(Schema)
      expect(openapi?.components?.schemas?.Pet.oneOf[1]).to.be.instanceof(Schema)
      expect(openapi?.components?.schemas?.Pet.oneOf[2]).to.be.instanceof(Schema)
      expect(openapi?.components?.schemas?.Pet.oneOf[3]).to.be.instanceof(Schema)
    })

    it('can load without dereference', async () => {
      const filePath = path.resolve(resourcesDirectory, 'discriminator', 'one-of.yml')
      const [openapi, error] = await OpenAPI.load(filePath, { dereference: false })
      expect(openapi?.components?.schemas?.Pet.oneOf[0]).to.be.instanceof(Reference)
      expect(openapi?.components?.schemas?.Pet.oneOf[1]).to.be.instanceof(Reference)
      expect(openapi?.components?.schemas?.Pet.oneOf[2]).to.be.instanceof(Reference)
      expect(openapi?.components?.schemas?.Pet.oneOf[3]).to.be.instanceof(Reference)
    })
  })
})
