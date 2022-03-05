import * as Loader from '../src/utils/loader'
import { merge } from '../src/utils/util'
import path from 'path'
import { Version } from '../src/components/helpers/builder-validator-types'

const testLoaderRegistry: Record<string, string> = {}
const testResourcesDirectory = path.resolve(__dirname, '..', 'resources')
let testLoaderInitialized = false

type ComponentHandler<T> = (component: T, version: Version) => void

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

export function eachComponent<T> (components: T[]): (handler: ComponentHandler<T>) => void {
  return function (handler: ComponentHandler<T>) {
    components.forEach(component => {
      // @ts-expect-error
      const key = Object.keys(component.spec).pop()
      handler(component, key as Version)
    })
  }
}

// get the minimum valid definition for a component
export function minimal (component: any, version: '2.x' | '3.x', overwrite?: any): any {
  const name = typeof component === 'function' && component.name !== undefined ? component.name : component
  let result: any
  switch (name) {
    case 'Callback':
      result = {
        get: {
          responses: {
            200: {
              description: 'ok'
            }
          }
        }
      }
      break
    case 'Example':
      result = {}
      break
    case 'Header':
      result = version === '2.x'
        ? { type: 'string' }
        : { schema: minimal('Schema', version) }
      break
    case 'Info':
      result = { title: '', version: '' }
      break
    case 'Link':
      result = {
        operationId: 'my-op'
      }
      break
    case 'Operation':
      result = {
        responses: {
          200: { description: 'ok' }
        }
      }
      break
    case 'Parameter':
      result = version === '2.x'
        ? {
            name: 'param',
            in: 'query',
            type: 'string'
          }
        : {
            name: 'param',
            in: 'query',
            schema: minimal('Schema', version, { type: 'array', items: { type: 'string' } })
          }
      break
    case 'PathItem':
      result = {
        get: minimal('Operation', version)
      }
      break
    case 'RequestBody':
      result = {
        content: {
          'application/json': {}
        }
      }
      break
    case 'Response':
      result = { description: '' }
      break
    case 'Responses':
      result = { 200: minimal('Response', version) }
      break
    case 'Schema':
      result = { type: 'string' }
      break
    case 'SecurityRequirement':
      result = { name: [] }
      break
    case 'SecurityScheme':
      result = {
        type: 'apiKey',
        name: 'apiKey',
        in: 'query'
      }
      break
    case 'Server':
      result = { url: '/' }
      break
    case 'Tag':
      result = { name: 'Tag1' }
      break
  }

  if (overwrite !== undefined) {
    return merge(overwrite, result)
  } else {
    return result
  }
}
