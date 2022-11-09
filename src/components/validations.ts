import rx from '../rx'
import { urlInvalid } from '../Exception/methods'
import { getLocation } from '../Locator/Locator'
import { ISchemaProcessor } from './ISchemaProcessor'
import { smart } from '../util'

export function isUrl (key: string, data: ISchemaProcessor): void {
  const { exception } = data.root
  const { definition, id, reference } = data.cmp
  const url = definition[key]
  if (url !== undefined && !rx.url.test(url)) {
    exception.add({
      id: id + '_URL_INVALID',
      level: 'warn',
      locations: [getLocation(definition, key, 'value')],
      message: 'URL appears to be invalid: ' + smart(url),
      metadata: {
        url: url
      },
      reference
    })
  }
}

export function mutuallyExclusiveProperties (properties: string[], data: ISchemaProcessor): void {
  const { exception } = data.root
  const { definition, id, reference } = data.cmp
  const propertiesFound: string[] = []
  properties.forEach(property => {
    if (definition[property] !== undefined) {
      propertiesFound.push(property)
    }
  })

  if (propertiesFound.length > 1) {
    exception.add({
      id: id + '_PROPERTY_CONFLICT',
      level: 'error',
      locations: propertiesFound.map(p => getLocation(definition, p, 'key')),
      message: 'These properties are mutually exclusive: ' + smart(propertiesFound),
      metadata: { properties: propertiesFound },
      reference
    })
  }
}

/*

export function propertiesMutuallyExclusive (data: Data, properties: string[]): IExceptionData {
  const { componentId, definition, reference } = data
  return {
    id: componentId + '_PROPERTY_CONFLICT',
    level: 'error',
    locations: properties.map(p => getLocation(definition, p, 'key')),
    message: 'These properties are mutually exclusive: ' + smart(properties),
    metadata: { properties },
    reference
  }
}
 */
