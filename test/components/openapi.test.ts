import { OpenAPI } from '../../src/components/OpenAPI'
import { Reference } from '../../src/components/Reference'
import { Schema } from '../../src/components/Schema'
import { expect } from 'chai'
import path from 'path'
import { resourcesDirectory } from '../util/helpers'

describe('OpenAPI component', function () {
  describe('load', () => {
    it('can load and dereference', async () => {
      const filePath = path.resolve(resourcesDirectory, 'discriminator', 'one-of.yml')
      const result = await OpenAPI.load(filePath)
      const [openapi] = result
      expect(openapi?.components?.schemas?.Pet.oneOf[0]).to.be.instanceof(Schema)
      expect(openapi?.components?.schemas?.Pet.oneOf[1]).to.be.instanceof(Schema)
      expect(openapi?.components?.schemas?.Pet.oneOf[2]).to.be.instanceof(Schema)
      expect(openapi?.components?.schemas?.Pet.oneOf[3]).to.be.instanceof(Schema)
    })

    it('can load without dereference', async () => {
      const filePath = path.resolve(resourcesDirectory, 'discriminator', 'one-of.yml')
      const [openapi] = await OpenAPI.load(filePath, { dereference: false })
      expect(openapi?.components?.schemas?.Pet.oneOf[0]).to.be.instanceof(Reference)
      expect(openapi?.components?.schemas?.Pet.oneOf[1]).to.be.instanceof(Reference)
      expect(openapi?.components?.schemas?.Pet.oneOf[2]).to.be.instanceof(Reference)
      expect(openapi?.components?.schemas?.Pet.oneOf[3]).to.be.instanceof(Reference)
    })
  })
})
