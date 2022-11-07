import { ILoaderMatch } from './ILoader'
import { Adapter } from '../Adapter/Adapter'
import { define } from './Loader'
import rx from '../rx'

// add http(s) GET loader
define('http-get', async function (path, data) {
  if (!rx.http.test(path)) {
    return { loaded: false, reason: 'Path does not appear to be a URL.' }
  }

  try {
    const res = await Adapter.request(path)
    const contentType = res.headers['content-type']
    if (res.status < 200 || res.status >= 300) {
      const reason = 'Unexpected response code: ' + String(res.status)
      // @ts-expect-error // todo fix this
      data?.exception?.add.loaderFailedToLoadResource(path, reason)
      return { loaded: false, reason }
    } else {
      const result: ILoaderMatch = {
        loaded: true,
        content: res.data
      }

      if (typeof contentType === 'string') {
        if (/^application\/json/.test(contentType)) result.type = 'json'
        if (/^(?:text|application)\/(?:x-)?yaml/.test(contentType)) result.type = 'yaml'
      }
      return result
    }
  } catch (err: any) {
    const reason = 'Unexpected error: ' + (err.toString() as string)
    // @ts-expect-error // todo fix this
    data?.exception?.add.loaderFailedToLoadResource(path, reason)
    return { loaded: false, reason }
  }
})
