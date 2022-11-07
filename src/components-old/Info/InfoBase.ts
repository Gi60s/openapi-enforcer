import { IComponentSchemaObject } from '../IComponentSchema'
import rx from '../../rx'
import { ISchemaProcessorData } from '../ISchemaProcessor'
import { IComponentClass } from '../IComponent'
import { urlInvalid } from '../../Exception/methods'

export function getBaseSchema (data: ISchemaProcessorData, Contact: IComponentClass<any, any>, License: IComponentClass<any, any>): IComponentSchemaObject {
  return {
    type: 'object',
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'title',
        required: true,
        schema: { type: 'string' }
      },
      {
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'termsOfService',
        schema: { type: 'string' }
      },
      {
        name: 'contact',
        schema: {
          type: 'component',
          allowsRef: false,
          component: Contact
        }
      },
      {
        name: 'license',
        schema: {
          type: 'component',
          allowsRef: false,
          component: License
        }
      },
      {
        name: 'version',
        required: true,
        schema: { type: 'string' }
      }
    ],
    after (data) {
      if (data.mode === 'validate') {
        const { built, exception } = data

        if (built.termsOfService !== undefined) {
          if (!rx.url.test(built.termsOfService)) {
            exception.add(urlInvalid(data, 'termsOfService'))
          }
        }
      }
    }
  }
}
