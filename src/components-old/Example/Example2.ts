import { IExample2, IExample2Definition } from './IExample'
import { EnforcerComponent } from '../Component'
import { ExceptionStore, IComponentSchemaObject, IComponentSpec, ISchemaProcessorData, IVersion } from '../IComponent'
import rx from '../../rx'
import { mediaTypeInvalid } from '../../Exception/methods'

let exampleSchema: IComponentSchemaObject

export class Example extends EnforcerComponent implements IExample2 {
  [mimeType: string]: any

  constructor (definition: IExample2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#example-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static validate (definition: IExample2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static getSchema (data: ISchemaProcessorData): IComponentSchemaObject {
    if (exampleSchema === undefined) {
      exampleSchema = {
        type: 'object',
        allowsSchemaExtensions: false,
        additionalProperties: {
          type: 'any'
        },
        after (data) {
          const { definition, exception } = data
          if (data.mode === 'validate') {
            Object.keys(definition)
              .filter(key => !rx.extension.test(key))
              .forEach(key => {
                if (!rx.extension.test(key) && !rx.contentType.test(key)) {
                  exception.add(mediaTypeInvalid(data, key, key, 'key'))
                }
              })
          }
        }
      }
    }
    return exampleSchema
  }
}
