import { componentValidate, EnforcerData } from '../'
import { BuilderData, ComponentSchema, ValidatorData, Version } from '../helpers/builder-validator-types'
import { DefinitionException } from '../../DefinitionException'
import * as Core from '../Operation'
import { Parameter } from './Parameter'
import { Operation2 as Definition } from '../helpers/definition-types'
import { Responses } from '../v3/Responses'
import { Swagger } from './Swagger'
import { Result } from '../../utils/Result'
import * as EC from '../../utils/error-codes'
import { MediaTypeParser } from '../../utils/MediaTypeParser'

let operationSchema: ComponentSchema<Definition>

export class Operation extends Core.Operation {
  enforcer!: EnforcerData<Operation> & Core.EnforcerOperationData2

  consumes?: string[]
  parameters?: Parameter[]
  produces?: string[]
  schemes?: string[]

  constructor (definition: Definition, version?: Version) {
    super(Operation, definition, version, arguments[2])
  }

  request (request: Core.RequestInput, options?: Partial<Core.RequestOptions>): Result<Core.RequestOutput> {
    const { exception, result } = Core.preRequest(request, this, options)
    const parameters = this.enforcer.parameters
    const requiredParametersMap = this.enforcer.requiredParameters

    // TODO: is there a rule to make sure that formData and body are mutually exclusive? If not then add it.

    // process body
    if (parameters.body !== undefined) {
      if (result.body !== undefined) {
        const [value, error] = parameters.body.parse([result.body as string])
        if (error !== undefined) {
          exception.at('body').push(error)
        } else {
          result.body = value
        }
      } else if (requiredParametersMap.body) {
        exception.message(...EC.operationMissingRequiredParameters('body', []))
      }
    // process form-data
    } else if (parameters.formData !== undefined) {
      const missingRequired = requiredParametersMap.formData.slice(0)
      if (result.body !== undefined) {
        Object.keys(result.body).forEach(key => {
          const parameter = parameters.formData?.[key]
          if (parameter !== undefined) {
            const [value, error] = parameter.parse(result.body[key])
            if (error !== undefined) {
              exception.at('body').at(key).push(error)
            } else {
              result.body[key] = value
            }
          }
        })
      } else if (requiredParametersMap.body) {
        exception.message(...EC.operationMissingRequiredParameters('body', []))
      } else if (missingRequired.length > 0) {
        exception.message(...EC.operationMissingRequiredParameters('formData', missingRequired))
      }
    }

    return new Result(result, exception)
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#operation-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (operationSchema === undefined) {
      operationSchema = Core.schemaGenerator({
        Parameter: Parameter,
        Responses: Responses
      }) as ComponentSchema<Definition>

      operationSchema.hook('after-build', (data: BuilderData) => {
        const built = data.context.built as unknown as Operation
        data.root.lastly.push(() => {
          const swagger: any = built.enforcer.findAncestor(Swagger) ?? {}
          built.requestContentTypes = (swagger?.consumes ?? []).concat(built.consumes ?? []).map((mediaType: string) => new MediaTypeParser(mediaType))

          built.responseContentTypes = {}
          const produces: string[] = (swagger?.produces ?? []).concat(built.produces ?? [])
          Object.keys(built.responses).forEach(code => {
            built.responseContentTypes[code] = produces.map(mediaType => new MediaTypeParser(mediaType))
          })
        })
      })
    }
    return operationSchema
  }

  static validate (definition: Definition, version?: Version, data?: ValidatorData): DefinitionException {
    return componentValidate(this, definition, version, data)
  }
}
