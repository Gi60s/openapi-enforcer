import { IAdapter } from './IAdapter'
import { emit } from '../Events/Events'
import rx from '../rx'

/* @ts-expect-error This will be populated by the startup script. */
export const Adapter: IAdapter = {}

export function dirnameUrl (path: string): string {
  const [, protocol, domain] = rx.urlParts.exec(path) ?? [null, '', '']
  const urlPath = path
    .replace(/^https?:\/\/.+?(?:\/|$)/, '') // remove protocol and domain
    .replace(/\/$/, '') // remove leading slash
    .replace(/\?.*$/, '') // remove querystring
  const ar = urlPath.split('/')
  ar.pop()
  return (String(protocol) + '://' + String(domain) + '/' + ar.join('/')).replace(/\/$/, '')
}

export function resolvePathFilter (separator: string, ...path: string[]): string[] {
  // find last absolute path index
  let lastAbsolutePathIndex: number = 0
  path.forEach((pathItem, index) => {
    if (rx.http.test(pathItem) || pathItem === separator) {
      lastAbsolutePathIndex = index
    }
  })

  return path.slice(lastAbsolutePathIndex)
}

export function resolveUrlPath (...paths: string[]): string {
  const topPath = paths.shift() ?? ''
  const [,protocol, domain, path, querystring] = rx.urlParts.exec(topPath) ?? ['', '', '', '', '']

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

export function setEnvironment (adapter: IAdapter): void {
  Object.assign(Adapter, adapter)
  emit('adapter-ready', Adapter)
}
