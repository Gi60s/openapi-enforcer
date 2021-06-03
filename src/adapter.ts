import * as Path from 'path'
import util from 'util'

const rxHttp = /^https?:\/\//
const rxUrlParts = /^(https?):\/\/(.+?)(?:\/|$)(.*)/

export interface Adapter {
  cwd: string
  inspect: any
  path: {
    dirname: (path: string) => string
    resolve: (...path: string[]) => string
  }
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
    inspect: 'inspect',
    path: {
      dirname (path: string): string {
        return dirnameUrl(path)
      },
      resolve (...path: string[]): string {
        const paths = resolvePathFilter(...path)
        return resolveUrlPath(...paths)
      }
    },
    sep: '/'
  }
}

function node (): Adapter {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Path = require('path')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Util = require('util')
  return {
    cwd: process.cwd(),
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
        const paths = resolvePathFilter(...path)
        const topPath = paths[0]
        if (topPath !== undefined && rxHttp.test(topPath)) {
          return resolveUrlPath(...paths)
        } else {
          return Path.resolve(...path)
        }
      }
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

function resolvePathFilter (...path: string[]): string[] {
  // find last absolute path index
  let lastAbsolutePathIndex: number = 0
  path.forEach((pathItem, index) => {
    if (rxHttp.test(pathItem) || pathItem === Path.sep) {
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
