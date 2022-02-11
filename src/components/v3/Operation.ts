import { EnforcerData, componentValidate } from '../'
import { ComponentSchema, ValidatorData, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../Exception'
import * as Core from '../Operation'
import { Callback } from './Callback'
import { RequestBody } from './RequestBody'
import { Server } from './Server'
import { Parameter } from './Parameter'
import { Responses } from './Responses'
import { Operation3 as Definition } from '../helpers/definition-types'
import { Result } from '../../utils/Result'
import { MediaTypeParser } from '../../utils/MediaTypeParser'

let operationSchema: ComponentSchema<Definition>

export class Operation extends Core.Operation {
  enforcer!: EnforcerData<Operation> & Core.EnforcerOperationData3

  callbacks?: Record<string, Callback>
  parameters?: Parameter[]
  requestBody?: RequestBody
  servers?: Server[]

  constructor (definition: Definition, version?: Version) {
    super(Operation, definition, version, arguments[2])
  }

  request (request: Core.RequestInput, options?: Core.RequestOptions): Result<Core.RequestOutput> {
    const { exception, result } = Core.preRequest(request, this, options)

    if (result.body !== undefined) {
      if (this.requestBody === undefined) {
        exception.add.operationRequestBodyNotAllowed()
      } else {
        // the Core.preRequest will have already determined if this content type is acceptable
        const contentType = result.header['content-type'] as string
        const mediaType = this.requestBody?.content[contentType]
        const schema = mediaType?.schema
        if (schema !== undefined) {
          const [data, error] = schema.deserialize(result.body)
          if (error !== undefined) {
            exception.at('body').push(error)
          } else {
            result.body = data
          }
        }
      }
    }

    return new Result(result, exception)
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#operation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#operation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#operation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#operation-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (operationSchema === undefined) {
      operationSchema = Core.schemaGenerator({
        Parameter: Parameter,
        Responses: Responses
      }) as ComponentSchema<Definition>

      operationSchema.hook('after-build', data => {
        const built = data.context.built as Operation
        built.requestContentTypes = Object.keys(built.requestBody?.content ?? {}).map(mediaType => new MediaTypeParser(mediaType))
        built.responseContentTypes = {}
        Object.keys(built.responses.response).forEach(code => {
          built.responseContentTypes[code] = Object.keys(built.responses.response[code].content ?? {}).map(mediaType => new MediaTypeParser(mediaType))
        })
      })
    }
    return operationSchema
  }

  static validate (definition: Definition, version?: Version, data?: ValidatorData): DefinitionException {
    return componentValidate(this, definition, version, data)
  }
}
