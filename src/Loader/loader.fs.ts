import fs from 'fs'
import { ILoaderMatch } from './ILoader'
import { define } from './loader-async'

// add file loader
define('file-system-loader', async function (path, data) {
  return await new Promise((resolve) => {
    fs.readFile(path, 'utf8', (err: any, content: string) => {
      if (err === null || err === undefined) {
        const result: ILoaderMatch = {
          loaded: true,
          content
        }
        resolve(result)
      } else {
        if (err.code === 'ENOENT') {
          resolve({ loaded: false, reason: 'File not found.' })
        } else {
          const reason = 'File could not load' + (err.code !== undefined ? ': ' + String(err.code) : '')
          // @ts-expect-error // todo fix this
          data?.exceptionStore?.add.loaderFailedToLoadResource(path, reason)
          resolve({ loaded: false, reason })
        }
      }
    })
  })
})
