import rx from '../../rx'
import { urlInvalid } from '../../Exception/methods'
import { getLocation } from '../../Locator/Locator'
import { ISchemaProcessor } from '../ISchemaProcessor'

export const after = function (data: ISchemaProcessor<any, any>, mode: 'build' | 'validate'): void {
  const { exception } = data.root
  const { definition } = data.cmp
  if (mode === 'validate') {
    const url = definition.url
    if (url !== undefined && !rx.url.test(url)) {
      exception.add(urlInvalid(data.cmp, url, [getLocation(definition, 'url', 'value')]))
    }
  }
}
