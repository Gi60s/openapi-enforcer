import http from 'http'
import path from 'path'
import fs from 'fs'
import { ExceptionReport } from '../src/DefinitionException'

export interface StaticFileServer {
  port: string
  stop: () => void
}

export function exceptionHasCode (exceptionReport: ExceptionReport | undefined, code: string, throwError: boolean): boolean {
  if (exceptionReport === undefined) {
    if (throwError) throw new Error('DefinitionException report is empty. Expected to find code: ' + code)
    return false
  }
  const exceptions = exceptionReport.exceptions
  const length = exceptions.length
  for (let i = 0; i < length; i++) {
    if (exceptions[i].code === code) return true
  }
  if (throwError) throw new Error('DefinitionException report expected to find code: ' + code)
  return false
}

export const resourcesDirectory = path.resolve(__dirname, '..', 'test-resources')

export async function staticFileServer (directory: string): Promise<StaticFileServer> {
  let listener: any

  const server = http.createServer(function (req, res) {
    const filePath = path.resolve(directory, (req.url ?? '/').substring(1))
    const rs = fs.createReadStream(filePath, 'utf8')
    rs.pipe(res)
  })

  return await new Promise((resolve, reject) => {
    // @ts-expect-error
    listener = server.listen(23245, (err) => {
      if (err !== null && err !== undefined) return reject(err)
      resolve({
        port: String(listener.address().port),
        stop () {
          listener.close()
        }
      })
    })
  })
}
