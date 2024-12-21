import { dirnameUrl, resolvePathFilter, resolveUrlPath, setEnvironment } from './Adapter'
import '../Loader/loaders/loader.http-get'

const [url] = window.location.href.split('?')

setEnvironment({
  context: 'browser',
  cwd: /\.[a-z0-9]+$/.test(url) ? dirnameUrl(url) : url,
  eol: navigator.userAgent.includes('Win') ? '\r\n' : '\n',
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
  async request (url: string) {
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
})
