import { expect } from 'chai'
import { load, saveObjectLocationData } from '../src/Loader/Loader'
import { getLocation } from '../src/Locator/Locator'
import path from 'path'
import '../src/Adapter/index.node'

export interface StaticFileServer {
  port: string
  stop: () => void
}

const resourcesDirectory = path.resolve(__dirname, '../../test-resources')
const loaderResources = path.resolve(resourcesDirectory, 'loader')

describe('locator', () => {
  describe('json', () => {
    it('can correctly locate an array', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.json'))
      const result = getLocation(object.array)
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(2)
      expect(result.start?.column).to.equal(12)
      expect(result.end?.line).to.equal(2)
      expect(result.end?.column).to.equal(15)
      expect(result.source?.endsWith('all-types.json')).to.equal(true)
      expect(result.breadcrumbs).to.equal('array')
    })

    it('can correctly locate an array index', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.json'))
      const result = getLocation(object.array, 0)
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(2)
      expect(result.start?.column).to.equal(13)
      expect(result.end?.line).to.equal(2)
      expect(result.end?.column).to.equal(14)
      expect(result.breadcrumbs).to.equal('array > 0')
    })

    it('can correctly locate an object property', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.json'))
      const result = getLocation(object, 'boolean')
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(3)
      expect(result.start?.column).to.equal(3)
      expect(result.end?.line).to.equal(3)
      expect(result.end?.column).to.equal(18)
      expect(result.breadcrumbs).to.equal('boolean')
    })

    it('can correctly locate an object property key', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.json'))
      const result = getLocation(object, 'boolean', 'key')
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(3)
      expect(result.start?.column).to.equal(3)
      expect(result.end?.line).to.equal(3)
      expect(result.end?.column).to.equal(12)
      expect(result.breadcrumbs).to.equal('boolean')
    })

    it('can correctly locate an object property value', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.json'))
      const result = getLocation(object, 'boolean', 'value')
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(3)
      expect(result.start?.column).to.equal(14)
      expect(result.end?.line).to.equal(3)
      expect(result.end?.column).to.equal(18)
      expect(result.breadcrumbs).to.equal('boolean')
    })
  })

  describe('yaml', () => {
    it('can correctly locate an array', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.yaml'))
      const result = getLocation(object.array)
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(2)
      expect(result.start?.column).to.equal(3)
      expect(result.end?.line).to.equal(3)
      expect(result.end?.column).to.equal(1)
      expect(result.source?.endsWith('all-types.yaml')).to.equal(true)
      expect(result.breadcrumbs).to.equal('array')
    })

    it('can correctly locate an array index', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.yaml'))
      const result = getLocation(object.array, 0)
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(2)
      expect(result.start?.column).to.equal(5)
      expect(result.end?.line).to.equal(2)
      expect(result.end?.column).to.equal(6)
      expect(result.breadcrumbs).to.equal('array > 0')
    })

    it('can correctly locate an object property', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.yaml'))
      const result = getLocation(object, 'boolean')
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(3)
      expect(result.start?.column).to.equal(1)
      expect(result.end?.line).to.equal(3)
      expect(result.end?.column).to.equal(14)
      expect(result.breadcrumbs).to.equal('boolean')
    })

    it('can correctly locate an object property key', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.yaml'))
      const result = getLocation(object, 'boolean', 'key')
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(3)
      expect(result.start?.column).to.equal(1)
      expect(result.end?.line).to.equal(3)
      expect(result.end?.column).to.equal(8)
      expect(result.breadcrumbs).to.equal('boolean')
    })

    it('can correctly locate an object property value', async function () {
      const [object] = await load(path.resolve(loaderResources, 'all-types.yaml'))
      const result = getLocation(object, 'boolean', 'value')
      if (result === undefined) throw Error('Should have found reference')

      expect(result.start?.line).to.equal(3)
      expect(result.start?.column).to.equal(10)
      expect(result.end?.line).to.equal(3)
      expect(result.end?.column).to.equal(14)
      expect(result.breadcrumbs).to.equal('boolean')
    })
  })

  describe('in memory', () => {
    it('can correctly locate an array', () => {
      const object = {
        array: []
      }
      saveObjectLocationData(object)
      const result = getLocation(object.array)
      expect(result?.breadcrumbs).to.equal('array')
    })

    it('can correctly locate an array index', async function () {
      const object = {
        array: ['item-1']
      }
      saveObjectLocationData(object)
      const result = getLocation(object.array, 0)
      expect(result?.breadcrumbs).to.equal('array > 0')
    })

    it('can correctly locate an object property', async function () {
      const object = {
        boolean: false
      }
      saveObjectLocationData(object)
      const result = getLocation(object, 'boolean')
      expect(result?.breadcrumbs).to.equal('boolean')
    })

    it('can correctly locate an object property key', async function () {
      const object = {
        boolean: false
      }
      saveObjectLocationData(object)
      const result = getLocation(object, 'boolean', 'key')
      expect(result?.breadcrumbs).to.equal('boolean')
    })

    it('can correctly locate an object property value', async function () {
      const object = {
        boolean: false
      }
      saveObjectLocationData(object)
      const result = getLocation(object, 'boolean', 'value')
      expect(result?.breadcrumbs).to.equal('boolean')
    })
  })
})
