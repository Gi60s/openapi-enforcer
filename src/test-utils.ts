import * as Loader from './loader'

const testLoaderRegistry: Record<string, string> = {}
let testLoaderInitialized = false

export function registerContent (path: string, data: object): string {
  testLoaderRegistry[path] = JSON.stringify(data, null, 2)
  return testLoaderRegistry[path]
    .split(/\r\n|\r|\n/)
    .map((v: string, i: number) => String(i + 1) + ': ' + v)
    .join('\n')
}

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
export function minimal (component: any): any {
  const name = typeof component === 'function' && component.name !== undefined ? component.name : component
  switch (name) {
    case 'Parameter':
      return {
        name: 'param',
        in: 'query',
        schema: minimal('Schema')
      }
    case 'Response':
      return { description: '' }
    case 'Schema':
      return { type: 'string' }
  }
}
