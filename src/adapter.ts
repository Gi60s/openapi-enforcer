import { IncomingMessage } from 'http'

const rxHttp = /^https?:\/\//
const rxUrlParts = /^(https?):\/\/(.+?)(?:\/|$)(.*)/

export interface Adapter {
  cwd: string
  eol: string
  inspect: any
  path: {
    dirname: (path: string) => string
    resolve: (...path: string[]) => string
  }
  request: (url: string) => Promise<{ data: string, headers: Record<string, string | string[]>, status: number }>
  sep: string
}

export default function adapter (): Adapter {
  if (typeof XMLHttpRequest !== 'undefined') {
    return browser()
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    return node()
  } else {
    throw Error('Unknown runtime environment')
  }
}

function browser (): Adapter {
  const [url] = window.location.href.split('?')
  return {
    cwd: /\.[a-z0-9]+$/.test(url) ? dirnameUrl(url) : url,
    eol: navigator.appVersion.includes('Win') ? '\r\n' : '\n',
    inspect: 'inspect',
    path: {
      dirname (path: string): string {
        return dirnameUrl(path)
      },
      resolve (...path: string[]): string {
        const paths = resolvePathFilter('/', ...path)
        return resolveUrlPath(...paths)
      }
    },
    async request (url) {
      const res = await fetch(url)
      const data = await res.text()
      const headers: Record<string, string | string[]> = {}
      res.headers.forEach((value, key) => {
        headers[key] = value
      })
      return {
        data,
        headers,
        status: res.status
      }
    },
    sep: '/'
  }
}

function node (): Adapter {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Http = require('http')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Https = require('https')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const os = require('os')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Path = require('path')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Util = require('util')

  return {
    cwd: process.cwd(),
    eol: os.EOL,
    inspect: Util.inspect.custom ?? 'inspect',
    path: {
      dirname (path: string): string {
        if (rxHttp.test(path)) {
          return dirnameUrl(path)
        } else {
          return Path.dirname(path)
        }
      },
      resolve (...path: string[]): string {
        const paths = resolvePathFilter(Path.sep, ...path)
        const topPath = paths[0]
        if (topPath !== undefined && rxHttp.test(topPath)) {
          return resolveUrlPath(...paths)
        } else {
          return Path.resolve(...path)
        }
      }
    },
    async request (url) {
      if (!rxHttp.test(url)) throw Error('Invalid URL: ' + url)
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
  }
}

function dirnameUrl (path: string): string {
  const [, protocol, domain] = rxUrlParts.exec(path) ?? [null, '', '']
  const urlPath = path
    .replace(/^https?:\/\/.+?(?:\/|$)/, '') // remove protocol and domain
    .replace(/\/$/, '') // remove leading slash
    .replace(/\?.*$/, '') // remove querystring
  const ar = urlPath.split('/')
  ar.pop()
  return (String(protocol) + '://' + String(domain) + '/' + ar.join('/')).replace(/\/$/, '')
}

function resolvePathFilter (separator: string, ...path: string[]): string[] {
  // find last absolute path index
  let lastAbsolutePathIndex: number = 0
  path.forEach((pathItem, index) => {
    if (rxHttp.test(pathItem) || pathItem === separator) {
      lastAbsolutePathIndex = index
    }
  })

  return path.slice(lastAbsolutePathIndex)
}

function resolveUrlPath (...paths: string[]): string {
  const topPath = paths.shift() ?? ''
  const [,protocol, domain, path, querystring] = rxUrlParts.exec(topPath) ?? ['', '', '', '', '']

  // gather all paths and querystrings
  const pathItems: string[] = path.split('/')
  const qs: string[] = [querystring]
  paths.forEach(p => {
    const [path, querystring] = p.split('?')
    pathItems.push(...path.split('/'))
    if (querystring !== undefined) qs.push(querystring)
  })

  // build result path
  const resultPath: string[] = []
  pathItems.forEach(pathItem => {
    if (pathItem === '..') {
      resultPath.pop()
    } else if (pathItem !== '' && pathItem !== '.') {
      resultPath.push(pathItem)
    }
  })

  const resultQs = qs.filter(s => s !== undefined && s.length > 0)
  return (protocol + '://' + domain + '/' + resultPath.join('/')).replace(/\/$/, '') +
    (resultQs.length > 0 ? '?' + resultQs.join('&') : '')
}
