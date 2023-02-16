import { expect } from 'chai'
import { load } from '../src/Loader/Loader'
import path from 'path'
import fs from 'fs'
import http from 'http'
import '../src/Adapter/index.node'

export interface StaticFileServer {
  port: string
  stop: () => void
}

const resourcesDirectory = path.resolve(__dirname, '../../test-resources')
const loaderResources = path.resolve(resourcesDirectory, 'loader')

describe('loader', () => {
  describe('object', () => {
    it('can load from an in memory object', () => {
      // TODO: pass in an object with references that need to be loaded
      throw Error('not implemented')
    })
  })

  describe('json', () => {
    it('can load a valid json file', async function () {
      const filePath = path.resolve(loaderResources, 'all-types.json')
      const [object] = await load(filePath)
      const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      expect(object).to.deep.equal(json)
    })

    it('will produce errors for an invalid json file', async function () {
      const filePath = path.resolve(loaderResources, 'invalid.json')
      let count = 0
      try {
        await load(filePath)
      } catch (e) {
        count++
      }
      expect(count).to.equal(1)
    })
  })

  describe('yaml', () => {
    it('can load a valid yaml file', async function () {
      try {
        await load(path.resolve(loaderResources, 'all-types.yaml'))
        throw Error('Expected error')
      } catch (e) {
        expect(e).to.match(/Expected error/)
      }
    })

    it('will produce errors for an invalid yaml file', async function () {
      const filePath = path.resolve(loaderResources, 'invalid.yml')
      let count = 0
      try {
        await load(filePath)
      } catch (e) {
        count++
      }
      expect(count).to.equal(1)
    })
  })

  describe('dereference', () => {
    describe('file system', () => {
      it('can dereference within a file and outside a file', async function () {
        const [node] = await load(path.resolve(resourcesDirectory, 'refs/openapi.yml'))
        expect(node.paths['/employees'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('employee')
        expect(node.paths['/students'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('student')
      })
    })

    describe('internet', () => {
      let server: StaticFileServer

      before(async () => {
        server = await staticFileServer(resourcesDirectory)
      })

      after(() => {
        server.stop()
      })

      it('can dereference within a file and outside a file', async function () {
        const result = await load(`http://localhost:${server.port}/refs/openapi.yml`)
        const [node] = result
        expect(node.paths['/employees'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('employee')
        expect(node.paths['/students'].get.responses[200].content['application/json'].schema.items['x-id']).to.equal('student')
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

async function staticFileServer (directory: string): Promise<StaticFileServer> {
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
