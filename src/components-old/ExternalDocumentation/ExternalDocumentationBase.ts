import rx from '../../rx'
import { ISchemaProcessorData } from '../ISchemaProcessor'
import { IComponentSchemaObject } from '../IComponentSchema'
import { urlInvalid } from '../../Exception/methods'
import { getLocation } from '../../Locator/Locator'
import { smart } from '../../util'

const externalDocumentationSchema: IComponentSchemaObject = {
  type: 'object',
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'description',
      schema: { type: 'string' }
    },
    {
      name: 'url',
      required: true,
      schema: {
        type: 'string'
      }
    }
  ],
  after (data) {
    if (data.mode === 'validate') {
      const { definition, exception } = data

      const url = definition.url
      if (url !== undefined) {
        if (!rx.url.test(url)) {
          exception.add(urlInvalid(data, 'url'))
        }
      }
    }
  }
}

export function getSchema (data: ISchemaProcessorData): IComponentSchemaObject {
  return externalDocumentationSchema
}
