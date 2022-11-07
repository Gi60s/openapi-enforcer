import { IExample3, IExample3Definition } from './IExample'
import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISchemaProcessorData } from '../ISchemaProcessor'
import { IComponentSchemaObject } from '../IComponentSchema'
import rx from '../../rx'
import { urlInvalid, propertiesMutuallyExclusive } from '../../Exception/methods'

export class Example extends EnforcerComponent<IExample3Definition, Example> implements IExample3 {
  [key: `x${string}`]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any

  constructor (definition: IExample3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#example-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#example-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#example-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#example-object'
  }

  static validate (definition: IExample3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema (data: ISchemaProcessorData): IComponentSchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        {
          name: 'summary',
          schema: { type: 'string' }
        },
        {
          name: 'description',
          schema: { type: 'string' }
        },
        {
          name: 'value',
          schema: {
            type: 'any'
          }
        },
        {
          name: 'externalValue',
          schema: {
            type: 'string'
          }
        }
      ],
      after (data) {
        if (data.mode === 'validate') {
          const { definition, exception } = data

          if (definition.value !== undefined && definition.externalValue !== undefined) {
            exception.add(propertiesMutuallyExclusive(data, ['externalValue', 'value']))
          }

          if (definition.externalValue !== undefined) {
            if (!rx.url.test(definition.externalValue)) {
              exception.add(urlInvalid(data, 'externalValue'))
            }
          }
        }
      }
    }
  }
}
