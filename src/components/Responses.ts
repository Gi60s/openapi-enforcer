import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { no } from '../util'
import * as E from '../Exception/methods'
import * as Response from './Response'

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
      '2.0': 'http://spec.openapis.org/oas/v2.0#responses-object',
      '3.0.0': 'http://spec.openapis.org/oas/v3.0.0#responses-object',
      '3.0.1': 'http://spec.openapis.org/oas/v3.0.1#responses-object',
      '3.0.2': 'http://spec.openapis.org/oas/v3.0.2#responses-object',
      '3.0.3': 'http://spec.openapis.org/oas/v3.0.3#responses-object'
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
      after ({ built, exception, major, reference }, { key: method }) {
        const codes = Object.keys(built)
        let has2xxResponseCode: boolean = false

        codes.forEach(code => {
          // test that the code is valid
          if (!rxCode.test(code) && !rxRange.test(code) && code !== 'default') {
            exception.message(E.invalidResponseCode(code))
          } else {
            const response: Response.Response = built[code]
            if (code.startsWith('2')) has2xxResponseCode = true

            // if a POST 201 response then warn if missing location header
            if (method === 'post' && code === '201') {
              const locationHeaderKey = response.headers !== undefined && Object.keys(response.headers).filter(v => rxLocation.test(v))[0]
              if (locationHeaderKey === undefined) exception.message(E.responseShouldIncludeLocationHeader())

              // if a 204 then there should be no response body (or schema)
            } else if (code === '204') {
              if (major === 2 && 'schema' in response) {
                exception.message(E.responseBodyNotAllowed('schema'))
              } else if (major === 3 && 'content' in response) {
                exception.message(E.responseBodyNotAllowed('content'))
              }
            }
          }
        })

        // if no response codes then it's an error
        if (codes.length === 0) {
          exception.message(E.responseRequired(reference))

          // if no success codes then it's a warning
        } else if (!has2xxResponseCode && !('default' in built)) {
          exception.message(E.responsesShouldIncludeSuccess(reference))
        }
      }
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}
