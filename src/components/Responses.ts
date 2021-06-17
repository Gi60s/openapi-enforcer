import { OASComponent, initializeData, SchemaObject, SpecMap, Version, Exception } from './'
import { addExceptionLocation, adjustExceptionLevel, no } from '../util'
import * as E from '../Exception/methods'
import * as Response from './Response'
import { lookupLocation } from '../loader'

const rxCode = /^[1-5]\d{2}$/
const rxLocation = /^location$/i
const rxRange = /^[1-5]X{2}$/

export interface Definition {
  [code: string]: Response.Definition
}

export class Responses extends OASComponent {
  readonly [code: string]: Response.Response | any

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Responses object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'https://spec.openapis.org/oas/v2.0#responses-object',
      '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#responses-object',
      '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#responses-object',
      '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#responses-object',
      '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#responses-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: no,
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: Response.Response
      },
      after ({ built, exception, major, reference }, def) {
        const codes = Object.keys(built)
        const method = def.key
        let has2xxResponseCode: boolean = false

        codes.forEach(code => {
          // test that the code is valid
          if (!rxCode.test(code) && !rxRange.test(code) && code !== 'default') {
            const invalidResponseCode = E.invalidResponseCode(code)
            addExceptionLocation(invalidResponseCode, lookupLocation(def, code, 'key'))
            exception.message(invalidResponseCode)
          } else {
            const response: Response.Response = built[code]
            if (code.startsWith('2')) has2xxResponseCode = true

            // if a POST 201 response then warn if missing location header
            if (method === 'post' && code === '201') {
              const locationHeaderKey = response.headers !== undefined && Object.keys(response.headers).filter(v => rxLocation.test(v))[0]
              if (locationHeaderKey === undefined) {
                const responseShouldIncludeLocationHeader = E.responseShouldIncludeLocationHeader()
                adjustExceptionLevel(def, responseShouldIncludeLocationHeader)
                addExceptionLocation(responseShouldIncludeLocationHeader, lookupLocation(def, code, 'value'))
                exception.message(responseShouldIncludeLocationHeader)
              }

              // if a 204 then there should be no response body (or schema)
            } else if (code === '204') {
              if (major === 2 && 'schema' in response) {
                const responseBodyNotAllowed = E.responseBodyNotAllowed('schema')
                adjustExceptionLevel(def, responseBodyNotAllowed)
                addExceptionLocation(responseBodyNotAllowed, lookupLocation(def[code], 'responseBody', 'value'))
                exception.message(responseBodyNotAllowed)
              } else if (major === 3 && 'content' in response) {
                const responseBodyNotAllowed = E.responseBodyNotAllowed('content')
                adjustExceptionLevel(def, responseBodyNotAllowed)
                addExceptionLocation(responseBodyNotAllowed, lookupLocation(def[code], 'responseBody', 'value'))
                exception.message(responseBodyNotAllowed)
              }
            }
          }
        })

        // if no response codes then it's an error
        if (codes.length === 0) {
          const responseRequired = E.responseRequired(reference)
          addExceptionLocation(responseRequired, lookupLocation(def))
          exception.message(responseRequired)

          // if no success codes then it's a warning
        } else if (!has2xxResponseCode && !('default' in built)) {
          const responsesShouldIncludeSuccess = E.responsesShouldIncludeSuccess(reference)
          addExceptionLocation(responsesShouldIncludeSuccess, lookupLocation(def))
          exception.message(responsesShouldIncludeSuccess)
        }
      }
    }
  }

  static validate (definition: Definition, version?: Version): Exception {
    return super.validate(definition, version, arguments[2])
  }
}
