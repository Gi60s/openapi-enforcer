import * as Loader from './loader'
import fs from 'fs'
import path from 'path'
import http from 'http'

const testLoaderRegistry: Record<string, string> = {}
const testResourcesDirectory = path.resolve(__dirname, '..', 'test-resources')
let testLoaderInitialized = false

export function registerContent (path: string, data: object): string {
  testLoaderRegistry[path] = JSON.stringify(data, null, 2)
  return testLoaderRegistry[path]
    .split(/\r\n|\r|\n/)
    .map((v: string, i: number) => String(i + 1) + ': ' + v)
    .join('\n')
}

export const resourcesDirectory = testResourcesDirectory

export function initTestLoader (): void {
  if (!testLoaderInitialized) {
    testLoaderInitialized = true
    Loader.define(async (path: string) => {
      const content = testLoaderRegistry[path]
      if (content !== undefined) {
        return {
          loaded: true,
          content,
          type: 'json'
        }
      } else {
        return { loaded: false }
      }
    })
  }
}

// get the minimum valid definition for a component
export function minimal (component: any, version?: '2.x' | '3.x'): any {
  const name = typeof component === 'function' && component.name !== undefined ? component.name : component
  switch (name) {
    case 'Callback':
      return {
        get: {
          responses: {
            200: {
              description: 'ok'
            }
          }
        }
      }
    case 'Example':
      return {}
    case 'Header':
      return version === '2.x'
        ? {
          type: 'string'
        }
        : {
          schema: minimal('Schema')
        }
    case 'Link':
      return {}
    case 'Parameter':
      return version === '2.x'
        ? {
          name: 'param',
          in: 'query',
          type: 'string'
        }
        : {
          name: 'param',
          in: 'query',
          schema: minimal('Schema')
        }
    case 'RequestBody':
      return { content: {} }
    case 'Response':
      return { description: '' }
    case 'Schema':
      return { type: 'string' }
    case 'SecurityScheme':
      return {
        type: 'apiKey',
        name: 'apiKey',
        in: 'query'
      }
  }
}

let listener: any
export const server = {
  async start (): Promise<void> {
    if (listener === undefined) {
      const server = http.createServer(function (req, res) {
        const filePath = path.resolve(testResourcesDirectory, (req.url ?? '/').substring(1))
        const rs = fs.createReadStream(filePath, 'utf8')
        rs.pipe(res)
      })
      return new Promise((resolve, reject) => {
        // @ts-expect-error
        listener = server.listen(23245, (err) => {
          if (err !== null && err !== undefined) return reject(err)
          resolve()
        })
      })
    }
  },
  stop () {
    if (listener !== undefined) {
      listener.close()
      listener = undefined
    }
  }
}
