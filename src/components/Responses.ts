import {
  OASComponent,
  Version,
  Exception,
  Dereferenced,
  ComponentSchema
} from './'
import * as E from '../Exception/methods'
import * as Response from './Response'

const rxCode = /^[1-5]\d{2}$/
const rxLocation = /^location$/i
const rxRange = /^[1-5]X{2}$/

export interface Definition {
  [key: `x-${string}`]: any
  [code: string | number]: Response.Definition
}

const schemaResponses: ComponentSchema<Definition> = {
  allowsSchemaExtensions: false,
  additionalProperties: {
    type: 'component',
    allowsRef: false,
    component: Response.Response
  },
  validator: {
    after (data) { // } ({ built, exception, major, reference }, def) {
      const { built, definition, exception, key: method } = data.context
      const { reference } = data.component
      const { major } = data.root

      const codes = Object.keys(built)
      let has2xxResponseCode: boolean = false

      codes.forEach(code => {
        // if the code is not within the valid range then produce an error
        if (!rxCode.test(code) && !rxRange.test(code) && code !== 'default') {
          const invalidResponseCode = E.invalidResponseCode(code, {
            definition,
            locations: [{ node: definition, key: code, type: 'key' }]
          })
          exception.message(invalidResponseCode)
        } else {
          const response: Response.Definition = built[code]
          if (code.startsWith('2')) has2xxResponseCode = true

          // if a POST 201 response then warn if missing location header
          if (method === 'post' && code === '201') {
            const locationHeaderKey = response.headers !== undefined && Object.keys(response.headers).filter(v => rxLocation.test(v))[0]
            if (locationHeaderKey === undefined) {
              const responseShouldIncludeLocationHeader = E.responseShouldIncludeLocationHeader({
                definition,
                locations: [{ node: definition, key: code, type: 'value' }]
              })
              exception.message(responseShouldIncludeLocationHeader)
            }

          // if a 204 then there should be no response body (or schema)
          } else if (code === '204') {
            if (major === 2 && 'schema' in response) {
              const responseBodyNotAllowed = E.responseBodyNotAllowed('schema', {
                definition,
                locations: [{ node: definition[code], key: 'responseBody', type: 'value' }]
              })
              exception.message(responseBodyNotAllowed)
            } else if (major === 3 && 'content' in response) {
              const responseBodyNotAllowed = E.responseBodyNotAllowed('content', {
                definition,
                locations: [{ node: definition[code], key: 'responseBody', type: 'value' }]
              })
              exception.message(responseBodyNotAllowed)
            }
          }
        }
      })

      // if no response codes then it's an error
      if (codes.length === 0) {
        const responseRequired = E.responseRequired({
          definition,
          locations: [{ node: definition }],
          reference
        })
        exception.message(responseRequired)

      // if no success codes then it's a warning
      } else if (!has2xxResponseCode && !('default' in built)) {
        const responsesShouldIncludeSuccess = E.responsesShouldIncludeSuccess({
          definition,
          locations: [{ node: definition }],
          reference
        })
        exception.message(responsesShouldIncludeSuccess)
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Responses<HasReference=Dereferenced> extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly [code: string]: Response.Response<HasReference>

  constructor (definition: Definition, version?: Version) {
    super(Responses, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#responses-object',
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#responses-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#responses-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#responses-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#responses-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return schemaResponses
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
