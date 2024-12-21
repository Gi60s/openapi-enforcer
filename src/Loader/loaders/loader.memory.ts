import { define } from '../loader-async'
import { getMessage } from '../../i18n/i18n'

let store: Record<string, string | undefined> = {}
const suffix = 'mem'

export function clearMemory (): void {
  store = {}
}

export function putInMemory<T = string | object | undefined> (name: string, content?: T, spaces = 2): T {
  if (!name.endsWith(suffix)) {
    throw Error(getMessage('LOADER_IN_MEMORY_NAME_INVALID', { name, suffix }))
  } else if (typeof content === 'string') {
    store[name] = content
  } else if (typeof content === 'object' && content !== null) {
    store[name] = JSON.stringify(content, null, spaces)
  } else {
    store[name] = undefined
  }
  return content as T
}

define('in-memory-loader', async function (path: string, data) {
  return await new Promise(resolve => {
    // TODO: The "reason" for all loaders should be made into an i18n string
    if (!path.endsWith(suffix)) {
      resolve({ loaded: false, reason: 'Missing suffix: ' + suffix })
    } else if (typeof store[path] !== 'string') {
      resolve({ loaded: false, reason: 'Not found in memory' })
    } else {
      resolve({
        loaded: true,
        content: store[path] as string
      })
    }
  })
})
