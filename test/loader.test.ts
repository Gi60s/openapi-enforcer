import { expect } from 'chai'
import { load, loadAsync, getLocation, loadAndThrow } from '../src/Loader'
import path from 'path'
import fs from 'fs'
import http from 'http'
import '../src/Adapter/index.node'
import { describe } from 'mocha'

export interface StaticFileServer {
  port: string
  stop: () => void
}

const resourcesDirectory = path.resolve(__dirname, '../../test-resources')
const loaderResources = path.resolve(resourcesDirectory, 'loader')

describe('loader', () => {
  describe('loadAsync', () => {
    describe('object', () => {
      it('can load from an in memory object', async () => {
        const filePath = path.resolve(loaderResources, 'all-types.json')
        const [object] = await loadAsync({
          foo: { $ref: filePath + '#/object' }
        })
        expect(object.foo.x).to.equal(1)
      })
    })

    describe('json', () => {
      it('can load a valid json file', async function () {
        const filePath = path.resolve(loaderResources, 'all-types.json')
        const [object] = await loadAsync(filePath)
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        expect(object).to.deep.equal(json)
      })

      it('will produce errors for an invalid json file', async function () {
        const filePath = path.resolve(loaderResources, 'invalid.json')
        let count = 0
        try {
          await loadAsync(filePath)
        } catch (e) {
          count++
        }
        expect(count).to.equal(1)
      })
    })

    describe('yaml', () => {
      it('can load a valid yaml file', async function () {
        try {
          await loadAsync(path.resolve(loaderResources, 'all-types.yaml'))
          throw Error('Expected error')
        } catch (e) {
          expect(e).to.match(/Expected error/)
        }
      })

      it('will produce errors for an invalid yaml file', async function () {
        const filePath = path.resolve(loaderResources, 'invalid.yml')
        let count = 0
        try {
          await loadAsync(filePath)
        } catch (e) {
          count++
        }
        expect(count).to.equal(1)
      })
    })

    describe('dereference', () => {
      describe('file system', () => {
        it('can dereference within a file and outside a file', async function () {
          const [node] = await loadAsync(path.resolve(resourcesDirectory, 'refs/openapi.yml'))
          expect(node.paths['/employees'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('employee')
          expect(node.paths['/students'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('student')
        })

        it('will not reference the same object for non-circular references', async () => {
          const [node, err] = await loadAsync(path.resolve(resourcesDirectory, 'refs/references.yaml'))
          console.log(err)
          const a = node.paths['/'].get.responses
          const b = node.paths['/foo'].get.responses

          expect(a).to.be.an('object')
          expect(b).to.be.an('object')
          expect(a).not.to.equal(b)
          expect(a).to.deep.equal(b)
        })

        it('will copy primitive values', async () => {
          const [node] = await loadAsync(path.resolve(resourcesDirectory, 'refs/references.yaml'))
          const a = node.components.schemas.A
          expect(a.properties.type).to.equal(a.properties.number.type)
        })

        it('will reference the same object for circular references', async () => {
          const [node] = await loadAsync(path.resolve(resourcesDirectory, 'refs/references.yaml'))
          const a = node.components.schemas.A
          const o1 = a.properties.object1
          const o2 = a.properties.object2

          expect(a).to.equal(a.properties.circular)
          expect(o1).not.to.equal(o2)
          expect(o1).to.deep.equal(o2)
        })
      })

      describe('internet', () => {
        let server: StaticFileServer

        before(async () => {
          server = await runStaticFileServerAsync(resourcesDirectory)
        })

        after(() => {
          server.stop()
        })

        it('can dereference within a file and outside a file', async function () {
          const result = await loadAsync(`http://localhost:${server.port}/refs/openapi.yml`)
          const [node] = result
          expect(node.paths['/employees'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('employee')
          expect(node.paths['/students'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('student')
        })
      })
    })
  })

  describe('load (not async)', () => {
    it('can load from an in memory object', () => {
      const [node] = load({
        a: { type: 'string' },
        b: { type: 'object', propertes: { x: { type: 'number' } } },
        c: { $ref: '#/b' }
      })
      expect(node.c.type).to.equal('object')
      expect(node.b).not.to.equal(node.c)
      expect(node.b).to.deep.equal(node.c)
    })

    it('cannot load outside of itself', () => {
      const result = load({
        c: { $ref: 'https://foo.com' }
      })
      expect(result.exceptionStore?.hasErrorByCode('REF_NOT_RESOLVED')).to.equal(true)
    })

    it('will reference the same object for circular references', () => {
      const [node] = load({
        A: {
          type: 'object',
          properties: {
            object1: {
              type: 'object',
              properties: {
                x: { type: 'string' }
              }
            },
            object2: { $ref: '#/A/properties/object1' },
            circular: { $ref: '#/A' }
          }
        }
      })
      const a = node.A
      const o1 = a.properties.object1
      const o2 = a.properties.object2

      expect(a).to.equal(a.properties.circular)
      expect(o1).not.to.equal(o2)
      expect(o1).to.deep.equal(o2)
    })
  })

  describe('getLocation', () => {
    describe('json', () => {
      it('can correctly locate an array', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.json'))
        const result = getLocation(object.array)
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(2)
        expect(result.start?.column).to.equal(12)
        expect(result.end?.line).to.equal(2)
        expect(result.end?.column).to.equal(15)
        expect(result.root.source?.endsWith('all-types.json')).to.equal(true)
        expect(result.path).to.equal('#/array')
      })

      it('can correctly locate an array index', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.json'))
        const result = getLocation(object.array, 0)
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(2)
        expect(result.start?.column).to.equal(13)
        expect(result.end?.line).to.equal(2)
        expect(result.end?.column).to.equal(14)
        expect(result.path).to.equal('#/array/0')
      })

      it('can correctly locate an object property', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.json'))
        const result = getLocation(object, 'boolean')
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(3)
        expect(result.start?.column).to.equal(3)
        expect(result.end?.line).to.equal(3)
        expect(result.end?.column).to.equal(18)
        expect(result.path).to.equal('#/boolean')
      })

      it('can correctly locate an object property key', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.json'))
        const result = getLocation(object, 'boolean', 'key')
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(3)
        expect(result.start?.column).to.equal(3)
        expect(result.end?.line).to.equal(3)
        expect(result.end?.column).to.equal(12)
        expect(result.path).to.equal('#/boolean')
      })

      it('can correctly locate an object property value', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.json'))
        const result = getLocation(object, 'boolean', 'value')
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(3)
        expect(result.start?.column).to.equal(14)
        expect(result.end?.line).to.equal(3)
        expect(result.end?.column).to.equal(18)
        expect(result.path).to.equal('#/boolean')
      })

      it('can resolve circular reference path', async () => {
        const [object] = await loadAsync(path.resolve(loaderResources, 'circular.json'))
        expect(object.y).to.equal(object.y.y)
        expect(getLocation(object.y, 'y')?.path).to.equal('#/y/y')
        expect(getLocation(object.y.y, 'y')?.path).to.equal('#/y/y')
      })
    })

    describe('yaml', () => {
      it('can correctly locate an array', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.yaml'))
        const result = getLocation(object.array)
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(2)
        expect(result.start?.column).to.equal(3)
        expect(result.end?.line).to.equal(3)
        expect(result.end?.column).to.equal(1)
        expect(result.root.source?.endsWith('all-types.yaml')).to.equal(true)
        expect(result.path).to.equal('#/array')
      })

      it('can correctly locate an array index', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.yaml'))
        const result = getLocation(object.array, 0)
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(2)
        expect(result.start?.column).to.equal(5)
        expect(result.end?.line).to.equal(2)
        expect(result.end?.column).to.equal(6)
        expect(result.path).to.equal('#/array/0')
      })

      it('can correctly locate an object property', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.yaml'))
        const result = getLocation(object, 'boolean')
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(3)
        expect(result.start?.column).to.equal(1)
        expect(result.end?.line).to.equal(3)
        expect(result.end?.column).to.equal(14)
        expect(result.path).to.equal('#/boolean')
      })

      it('can correctly locate an object property key', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.yaml'))
        const result = getLocation(object, 'boolean', 'key')
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(3)
        expect(result.start?.column).to.equal(1)
        expect(result.end?.line).to.equal(3)
        expect(result.end?.column).to.equal(8)
        expect(result.path).to.equal('#/boolean')
      })

      it('can correctly locate an object property value', async function () {
        const [object] = await loadAsync(path.resolve(loaderResources, 'all-types.yaml'))
        const result = getLocation(object, 'boolean', 'value')
        if (result === undefined) throw Error('Should have found reference')

        expect(result.start?.line).to.equal(3)
        expect(result.start?.column).to.equal(10)
        expect(result.end?.line).to.equal(3)
        expect(result.end?.column).to.equal(14)
        expect(result.path).to.equal('#/boolean')
      })
    })

    describe('in memory', () => {
      it('can correctly locate an array', () => {
        const object = loadAndThrow({
          array: []
        })
        const result = getLocation(object.array)
        expect(result?.path).to.equal('#/array')
      })

      it('can correctly locate an array index', async function () {
        const object = loadAndThrow({
          array: ['item-1']
        })
        const result = getLocation(object.array, 0)
        expect(result?.path).to.equal('#/array/0')
      })

      it('can correctly locate an object property', async function () {
        const object = loadAndThrow({
          boolean: false
        })
        const result = getLocation(object, 'boolean')
        expect(result?.path).to.equal('#/boolean')
      })

      it('can correctly locate an object property key', async function () {
        const object = loadAndThrow({
          boolean: false
        })
        const result = getLocation(object, 'boolean', 'key')
        expect(result?.path).to.equal('#/boolean')
      })

      it('can correctly locate an object property value', async function () {
        const object = loadAndThrow({
          boolean: false
        })
        const result = getLocation(object, 'boolean', 'value')
        expect(result?.path).to.equal('#/boolean')
      })

      it('can resolve circular reference path', () => {
        const object = loadAndThrow({
          x: 1,
          y: {
            b: true,
            y: { $ref: '#/y' }
          }
        })
        expect(object.y).to.equal(object.y.y)
        expect(getLocation(object.y, 'y')?.path).to.equal('#/y/y')
        expect(getLocation(object.y.y, 'y')?.path).to.equal('#/y/y')
      })
    })
  })

  // describe.only('lookup', () => {
  //   it('can find the file and location for a loaded object', async () => {
  //     const [node] = await load(path.resolve(resourcesDirectory, 'refs/openapi.yml'))
  //
  //     const internalObject = node.paths['/employees'].get.responses[200].content['application/json'].schema.items
  //     const externalObject = node.paths['/students'].get.responses[200].content['application/json'].schema.items
  //
  //     expect(node.paths['/employees'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('employee')
  //     expect(node.paths['/students'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('student')
  //   })
  // })
})

async function runStaticFileServerAsync (directory: string): Promise<StaticFileServer> {
  let listener: any

  const server = http.createServer(function (req, res) {
    const filePath = path.resolve(directory, (req.url ?? '/').substring(1))
    const rs = fs.createReadStream(filePath, 'utf8')
    rs.pipe(res)
  })

  return await new Promise((resolve, reject) => {
    // @ts-expect-error
    listener = server.listen(23245, (err) => {
      if (err !== null && err !== undefined) return reject(err)
      resolve({
        port: String(listener.address().port),
        stop () {
          listener.close()
        }
      })
    })
  })
}
