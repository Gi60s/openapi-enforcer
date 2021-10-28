import http from 'http'
import path from 'path'
import fs from 'fs'

export interface StaticFileServer {
  port: string
  stop: () => void
}

export async function staticFileServer (directory: string): Promise<StaticFileServer> {
  let listener: any

  const server = http.createServer(function (req, res) {
    const filePath = path.resolve(directory, (req.url ?? '/').substring(1))
    const rs = fs.createReadStream(filePath, 'utf8')
    rs.pipe(res)
  })

  return await new Promise((resolve, reject) => {
    // @ts-expect-error
    listener = server.listen(0, (err) => {
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
