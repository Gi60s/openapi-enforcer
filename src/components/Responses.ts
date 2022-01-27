import { OASComponent } from './index'
import { Component, ComponentSchema } from './helpers/builder-validator-types'
import * as E from '../DefinitionException/methods'
import {
  Response2 as ResponseDefinition2,
  Response3 as ResponseDefinition3
} from './helpers/definition-types'

const rxCode = /^[1-5]\d{2}$/
const rxLocation = /^location$/i
const rxRange = /^[1-5]X{2}$/

type ResponseDefinition = ResponseDefinition2 | ResponseDefinition3

export function schemaGenerator (components: { Response: Component }): ComponentSchema {
  return new ComponentSchema<any, any>({
    allowsSchemaExtensions: false,
    additionalProperties: {
      namespace: 'response',
      schema: {
        type: 'component',
        allowsRef: false,
        component: components.Response
      }
    },
    validator: {
      after (data) {
        const { built, definition, exception, key: method } = data.context
        const { major } = data.root
        const responses = built

        const codes = Object.keys(responses)
        let has2xxResponseCode: boolean = false

        codes.forEach(code => {
          // if the code is not within the valid range then produce an error
          if (!rxCode.test(code) && !rxRange.test(code) && code !== 'default') {
            const invalidResponseCode = E.invalidResponseCode(data, { key: code, type: 'key' }, code)
            exception.message(invalidResponseCode)
          } else {
            const response: ResponseDefinition = responses[code]
            if (code.startsWith('2')) has2xxResponseCode = true

            // if a POST 201 response then warn if missing location header
            if (method === 'post' && code === '201') {
              const locationHeaderKey = response.headers !== undefined && Object.keys(response.headers).filter(v => rxLocation.test(v))[0]
              if (locationHeaderKey === undefined) {
                const responseShouldIncludeLocationHeader = E.responseShouldIncludeLocationHeader(data, { key: code, type: 'value' })
                exception.message(responseShouldIncludeLocationHeader)
              }

              // if a 204 then there should be no response body (or schema)
            } else if (code === '204') {
              if (major === 2 && 'schema' in response) {
                const responseBodyNotAllowed = E.responseBodyNotAllowed(data, { node: definition[code], key: 'responseBody', type: 'value' }, 'schema')
                exception.message(responseBodyNotAllowed)
              } else if (major === 3 && 'content' in response) {
                const responseBodyNotAllowed = E.responseBodyNotAllowed(data, { node: definition[code], key: 'responseBody', type: 'value' }, 'content')
                exception.message(responseBodyNotAllowed)
              }
            }
          }
        })

        // if no response codes then it's an error
        if (codes.length === 0) {
          const responseRequired = E.responseRequired(data, { node: definition })
          exception.message(responseRequired)

          // if no success codes then it's a warning
        } else if (!has2xxResponseCode && !('default' in responses)) {
          const responsesShouldIncludeSuccess = E.responsesShouldIncludeSuccess(data, { node: definition })
          exception.message(responsesShouldIncludeSuccess)
        }
      }
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Responses extends OASComponent {
  extensions!: Record<string, any>
  response!: {
    [code: string]: any
  }
}
