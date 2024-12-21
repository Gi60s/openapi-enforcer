import { dirnameUrl, resolvePathFilter, resolveUrlPath, setEnvironment } from './Adapter'
import '../Loader/loaders/loader.http-get'
import '../Loader/loaders/loader.fs'

import Http, { IncomingMessage } from 'http'
import Https from 'https'
import os from 'os'
import Path from 'path'
import rx from '../rx'
import Util from 'util'
import { getMessage } from '../i18n/i18n'

// initialize the adapter for NodeJS
setEnvironment({
  context: 'nodejs',
  cwd: process.cwd(),
  eol: os.EOL,
  inspect: Util.inspect?.custom ?? 'inspect',
  path: {
    dirname (path: string): string {
      if (rx.http.test(path)) {
        return dirnameUrl(path)
      } else {
        return Path.dirname(path)
      }
    },
    resolve (...path: string[]): string {
      const paths = resolvePathFilter(Path.sep, ...path)
      const topPath = paths[0]
      if (topPath !== undefined && rx.http.test(topPath)) {
        return resolveUrlPath(...paths)
      } else {
        return Path.resolve(...path)
      }
    }
  },
  async request (url: string) {
    if (!rx.http.test(url)) throw Error(getMessage('URL_INVALID'))
    return await new Promise((resolve, reject) => {
      const mode = url.startsWith('https') ? Https : Http
      const req = mode.request(url, {}, (res: IncomingMessage) => {
        let data: string = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          data += chunk as string
        })
        res.on('end', () => {
          resolve({
            data,
            headers: res.headers as Record<string, string | string[]>,
            status: res.statusCode as number
          })
        })
      })
      req.on('error', reject)
      req.end()
    })
  },
  sep: Path.sep
})
