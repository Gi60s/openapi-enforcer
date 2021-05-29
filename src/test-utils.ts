import { getConfig, setConfig } from './config'
import * as Loader from './loader'
import { sep } from 'path'

const testLoaderRegistry: Record<string, string> = {}
let testLoaderInitialized = false

export function exceptionLevel (levels: Array<'opinion'|'warn'|'error'>, handler: () => void): void {
  const include = getConfig().exceptions.include
  setConfig({
    exceptions: { include: levels }
  })
  handler()
  setConfig({
    exceptions: { include }
  })
}

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
