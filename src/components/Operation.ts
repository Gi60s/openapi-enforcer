import { OASComponent, EnforcerData } from './'
import { BuilderData, Component, ComponentSchema, ValidatorData, Version } from './helpers/builder-validator-types'
import { MediaTypeParser } from '../utils/MediaTypeParser'
import { Callback } from './v3/Callback'
import { ExternalDocumentation } from './ExternalDocumentation'
import { RequestBody } from './v3/RequestBody'
import { Responses } from './Responses'
import { SecurityRequirement } from './SecurityRequirement'
import { Server } from './v3/Server'
import {
  Operation2 as Definition2,
  Operation3 as Definition3,
  Parameter2 as ParameterDefinition2,
  Parameter3 as ParameterDefinition3
} from './helpers/definition-types'
import { Result } from '../utils/Result'
import { Exception } from '../Exception'
import { arrayRemoveItem, parseQueryString } from '../utils/util'
import { Parameter as Parameter2 } from './v2/Parameter'
import { Parameter as Parameter3 } from './v3/Parameter'
import { normalizer, N } from '../utils/input-normalizer'
import { Method, OperationMakeRequestInput } from './helpers/function-interfaces'
import { LocationInput } from '../Exception/DefinitionException'
import rx from '../utils/rx'

type Definition = Definition2 | Definition3

interface ComponentsMap {
  Parameter: Component
  Responses: Component
}

type EnforcerOperationData = EnforcerDataOperation2 | EnforcerDataOperation3

export interface EnforcerDataOperation2 {
  method: Method
  path: string
  parameters: {
    body?: Parameter2
    formData?: Record<string, Parameter2>
    header?: Record<string, Parameter2>
    path?: Record<string, Parameter2>
    query?: Record<string, Parameter2>
  }
  requiredParameters: {
    body: boolean
    formData: string[]
    header: string[]
    path: string[]
    query: string[]
  }
}

export interface EnforcerDataOperation3 {
  method: Method
  path: string
  parameters: {
    cookie?: Record<string, Parameter3>
    header?: Record<string, Parameter3>
    path?: Record<string, Parameter3>
    query?: Record<string, Parameter3>
  }
  requiredParameters: {
    cookie: string[]
    header: string[]
    path: string[]
    query: string[]
  }
}

type RecordArray = Record<string, string[]>

export type RequestInput = OperationMakeRequestInput

export const RequestInputNormalizer = normalizer(N.Object({
  properties: {
    body: N.OneOf(N.String(), N.Object({ nullable: true })),
    cookie: N.Record(N.String()),
    header: N.Record(N.String(), N.Array(N.String()), N.Undefined()),
    path: N.Record(N.String())
  }
}))

export interface RequestOptions {
  allowOtherQueryParameters?: boolean | string[]
  decodeCookieUriComponents?: boolean
  decodeQueryStringUriComponents?: boolean
  validateInput?: boolean
}

export const RequestOptionsNormalizer = normalizer(N.Object({
  properties: {
    allowOtherQueryParameters: N.OneOf(N.Boolean(), N.Array(N.String())),
    decodeCookieUriComponents: N.Boolean({ default: false }),
    decodeQueryStringUriComponents: N.Boolean({ default: false }),
    validateInput: N.Boolean({ default: true })
  }
}))

export interface RequestOutput {
  body?: any
  cookie: Record<string, any>
  header: Record<string, any>
  path: Record<string, any>
  query: Record<string, any>
}

export function schemaGenerator (components: ComponentsMap): ComponentSchema<Definition> {
  return new ComponentSchema<Definition>({
    allowsSchemaExtensions: true,
    properties: [
      {
        name: 'callbacks',
        versions: ['3.x.x'],
        schema: {
          type: 'object',
          allowsSchemaExtensions: false,
          additionalProperties: {
            schema: {
              type: 'component',
              allowsRef: true,
              component: Callback
            }
          }
        }
      },
      {
        name: 'consumes',
        versions: ['2.x'],
        schema: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      {
        name: 'deprecated',
        schema: {
          type: 'boolean',
          default: false
        }
      },
      {
        name: 'description',
        schema: { type: 'string' }
      },
      {
        name: 'externalDocs',
        schema: {
          type: 'component',
          allowsRef: false,
          component: ExternalDocumentation
        }
      },
      {
        name: 'operationId',
        schema: {
          type: 'string'
        }
      },
      {
        name: 'parameters',
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: true,
            component: components.Parameter
          }
        }
      },
      {
        name: 'produces',
        versions: ['2.x'],
        schema: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      {
        name: 'requestBody',
        versions: ['3.x.x'],
        schema: {
          type: 'component',
          allowsRef: true,
          component: RequestBody
        }
      },
      {
        name: 'responses',
        required: true,
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Responses
        }
      },
      {
        name: 'schemes',
        versions: ['2.x'],
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['http', 'https', 'ws', 'wss']
          }
        }
      },
      {
        name: 'security',
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: false,
            component: SecurityRequirement
          }
        }
      },
      {
        name: 'servers',
        versions: ['3.x.x'],
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: false,
            component: Server
          }
        }
      },
      {
        name: 'summary',
        schema: {
          type: 'string'
        }
      },
      {
        name: 'tags',
        schema: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    ],
    builder: {
      after (data) {
        const built = data.context.built as Operation
        const { key, chain } = data.context
        const { metadata, lastly } = data.root
        if (metadata.operationIdMap === undefined) metadata.operationIdMap = {}
        metadata.operationIdMap[key] = built

        built.enforcer.method = (key as Method) ?? ''
        built.enforcer.path = chain[0]?.context.key ?? ''

        built.enforcer.parameters = {}
        built.enforcer.requiredParameters = data.root.major === 2
          ? {
              body: false,
              formData: [],
              header: [],
              path: [],
              query: []
            }
          : {
              cookie: [],
              header: [],
              path: [],
              query: []
            }
        if (built.parameters !== undefined) {
          built.parameters.forEach(parameter => {
            addParameterToOperation(built, parameter)
          })
        }
      }
    },
    validator: {
      after (data) {
        const { built, definition, exception, key } = data.context

        // operation metadata set up
        const { metadata, lastly } = data.root
        const { operationId } = built
        if (metadata.operationIdMap === undefined) metadata.operationIdMap = {}

        // store metadata about operation id
        if (operationId !== undefined) {
          if (metadata.operationIdMap[operationId] === undefined) metadata.operationIdMap[operationId] = []
          metadata.operationIdMap[operationId].push(data)
        }

        // store metadata about parameters

        // check that if request body is specified that it is valid for the method
        if ('requestBody' in built) {
          const method = key.toLowerCase()
          if (method === 'get' || method === 'trace') {
            exception.at('requestBody').add.operationMethodShouldNotHaveBody(data, { key: 'requestBody', type: 'key' }, method)
          } else if (method === 'delete') {
            exception.at('requestBody').add.operationMethodShouldNotHaveBody(data, { key: 'requestBody', type: 'key' }, method)
          }
        }

        // check that the summary length is valid
        if (built.summary !== undefined) {
          if (built.summary.length >= 120) {
            exception.add.exceedsSummaryLength(data, { key: 'summary', type: 'value' }, built.summary)
          }
        }

        if (built.consumes !== undefined) {
          built.consumes.forEach((consumes: string) => {
            if (!rx.mediaType.test(consumes)) {
              exception.add.invalidMediaType(data, { node: definition, key: 'consumes', type: 'value' }, consumes)
            }
          })
        }

        if (built.produces !== undefined) {
          built.produces.forEach((produces: string) => {
            if (!rx.mediaType.test(produces)) {
              exception.add.invalidMediaType(data, { node: definition, key: 'produces', type: 'value' }, produces)
            }
          })
        }

        if (built.parameters !== undefined) {
          reportParameterNamespaceConflicts(data, built, built.parameters)
        }

        // only add this check once to the "lastly" array
        if (!lastly.includes(reportNonUniqueOperationIds)) {
          lastly.push(reportNonUniqueOperationIds)
        }
      }
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class Operation extends OASComponent {
  enforcer!: EnforcerData<Operation> & EnforcerOperationData

  extensions!: Record<string, any>
  requestContentTypes!: MediaTypeParser[] // acceptable request content types
  responseContentTypes!: { // acceptable response content types per response code
    [code: string | number]: MediaTypeParser[]
  }

  deprecated?: boolean
  description?: string
  externalDocs?: ExternalDocumentation
  operationId?: string
  parameters?: any[] // overwritten by inheriting classes: Parameter.Parameter<HasReference>
  responses!: Responses
  security?: SecurityRequirement[]
  summary?: string
  tags?: string[]

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  protected constructor (Component: Component, definition: Definition2 | Definition3, version?: Version, data?: BuilderData) {
    super(Component, definition, version, data)
  }

  getRequestContentTypeMatch (mediaType: string): string | undefined {
    const m = new MediaTypeParser(mediaType)
    return m.findBestMatch(this.requestContentTypes)
  }

  // get a list of all possible response types, sorted by best match
  // getResponseContentTypeMatches (code: string | number, accepts: string): Result<string[]> {
  //   const exception = new Exception('Unable to determine acceptable response content types')
  //   const supportedTypes = this.responseContentTypes[code]
  //   if (supportedTypes === undefined) {
  //     exception.message(...EC.operationResponseCodeInvalid(String(code), Object.keys(this.responseContentTypes)))
  //     return new Result([], exception)
  //   } else if (supportedTypes.length === 0) {
  //     exception.message('OPER_CONT_NO_TYPES_SPECIFIED', 'Response mime types not defined.', { code, response: this.responses.response[code] })
  //     return new Result([], exception)
  //   } else {
  //     const matches = findMediaMatch(accepts, supportedTypes)
  //     if (matches.length === 0) {
  //       exception.message('OPER_CONT_NO_MATCH', 'Operation does not produce an acceptable type.', { code, supportedTypes })
  //       return new Result([], exception)
  //     } else {
  //       return new Result(matches)
  //     }
  //   }
  // }

  abstract makeRequest (request: RequestInput, options?: RequestOptions): Result<RequestOutput>
}

export function addParameterToOperation (operation: Operation, parameter: Parameter2 | Parameter3): void {
  let { in: at, name } = parameter
  if (at === 'header') name = name.toLowerCase()

  if (!(at in operation.enforcer.parameters)) {
    if (at === 'body') {
      // @ts-expect-error
      operation.enforcer.parameters.body = parameter
    } else {
      // @ts-expect-error
      operation.enforcer.parameters[at] = {}
    }
  }
  // @ts-expect-error
  operation.enforcer.parameters[at][name] = parameter

  if (parameter.required === true) {
    if (at === 'body') {
      // @ts-expect-error
      operation.enforcer.requiredParameters.body = true
    } else {
      // @ts-expect-error
      operation.enforcer.requiredParameters[at].push(name)
    }
  }
}

export function preRequest (request: RequestInput, operation: Operation, options?: RequestOptions): {
  contentType: string
  exception: Exception
  opts: Required<RequestOptions>
  result: RequestOutput
} {
  let selectedContentType: string = ''

  // normalize options
  const optionsException = new Exception('Invalid options specified')
  const opts = RequestOptionsNormalizer(options ?? {}, optionsException) as Required<RequestOptions>
  if (optionsException.hasError) throw new Error(optionsException.error?.toString())
  if (Array.isArray(opts.allowOtherQueryParameters) && opts.allowOtherQueryParameters.length === 0) opts.allowOtherQueryParameters = false

  // normalize request
  const exception = new Exception('Request has one or more errors')
  if (opts.validateInput) {
    const normalizedRequest = RequestInputNormalizer(request ?? {}, exception)
    request = normalizedRequest
  }

  // create a map of required parameters
  const requiredParametersMap = operation.enforcer.requiredParameters
  const missingRequired = {
    body: 'body' in requiredParametersMap ? requiredParametersMap.body : false,
    cookie: 'cookie' in requiredParametersMap ? requiredParametersMap.cookie.slice(0) : [],
    header: requiredParametersMap.header.slice(0),
    path: requiredParametersMap.path.slice(0),
    query: requiredParametersMap.query.slice(0)
  }

  const result: RequestOutput = {
    cookie: {},
    header: {},
    path: {},
    query: {}
  }

  // get lower case version of header names
  let cookieString: string = ''
  if (request.header !== undefined) {
    Object.keys(request.header).forEach(key => {
      const lowerKey = key.toLowerCase()
      const value: string | string[] = request.header?.[key] ?? ''
      arrayRemoveItem(missingRequired.header, lowerKey)
      if (lowerKey === 'cookie') {
        cookieString = typeof value === 'string' ? value : value[value.length - 1] ?? ''
      } else {
        result.header[lowerKey] = typeof value === 'string' ? [value] : value
      }
    })
  }

  // parse cookies into map of strings
  if (cookieString !== '') {
    cookieString.split(';')
      .forEach(set => {
        const [name, value] = set.split('=').map(v => v.trim())
        arrayRemoveItem(missingRequired.cookie, name)
        if (opts.decodeCookieUriComponents) {
          result.cookie[decodeURIComponent(name)] = [decodeURIComponent(value)]
        } else {
          result.cookie[name] = [value]
        }
      })
  }

  if (request.params !== undefined) {
    Object.keys(request.params).forEach(key => {
      arrayRemoveItem(missingRequired.path, key)
      result.path[key] = [request.params?.[key] as string]
    })
  }

  // parse query into map of string arrays
  const query: RecordArray = parseQueryString(request.query ?? '', { decodeUriComponents: opts.decodeQueryStringUriComponents })
  Object.keys(query).forEach(key => {
    arrayRemoveItem(missingRequired.query, key)
    result.query[key] = Array.isArray(query[key]) ? query[key] : [query[key]]
  })

  if ('body' in request && request.body !== '' && request.body !== undefined) {
    missingRequired.body = false
    result.body = request.body

    // if the operation has specified accepted content types then determine which content type to use
    if (operation.requestContentTypes.length > 0) {
      const contentType = result.header['content-type']?.[0]
      if (contentType === undefined) {
        exception.at('header').add.operationRequestContentTypeNotProvided()
        selectedContentType = operation.requestContentTypes[0].definition
      } else {
        const best = operation.getRequestContentTypeMatch(contentType)
        if (best === undefined) {
          exception.at('header').add.operationRequestContentTypeNotValid(contentType, operation.requestContentTypes.map(m => m.definition))
        } else {
          selectedContentType = best
        }
      }
    }
  }

  // check on missing required values
  ;(['cookie', 'header', 'path', 'query'] as ['cookie', 'header', 'path', 'query']).forEach(at => {
    const missing = missingRequired[at]
    if (missing.length > 0) exception.at(at).add.operationMissingRequiredParameters(at, missing)
  })

  if (!exception.hasError) {
    const parameters = operation.enforcer.parameters
    ;(['header', 'path', 'query'] as ['header', 'path', 'query']).forEach(key => {
      const data = result[key] ?? {}
      Object.keys(data).forEach(name => {
        const parameter = parameters[key]?.[name]
        if (parameter !== undefined) {
          const parsed = parameter.parse(data[name])
          if (parsed.error !== undefined) {
            exception.at(key).at(name).add.detailedError(parsed.exception as Exception)
          } else {
            data[name] = parsed.value
          }
        }
      })
    })
  }

  return {
    contentType: selectedContentType,
    exception,
    opts,
    result
  }
}

export function reportParameterNamespaceConflicts (data: ValidatorData, operation: Definition, parameters: Array<ParameterDefinition2 | ParameterDefinition3>): void {
  const { exception } = data.context
  const parametersMap: Array<{ name: string, in: string }> = []
  let bodyParameter: ParameterDefinition2 | undefined
  const formDataParameter: ParameterDefinition2[] = []

  parameters
    .filter(parameter => typeof parameter === 'object' && parameter !== null && parameter.in !== undefined)
    .forEach(parameter => {
      if (parameter.in === 'body') bodyParameter = parameter
      if (parameter.in === 'formData') formDataParameter.push(parameter)

      const index = parametersMap.findIndex(p => p.in === parameter.in && p.name === parameter.name)
      if (index !== -1) {
        exception.add.parameterNamespaceConflict(data, [{ node: parameter }, { node: parametersMap[index] }], parameter.name, parameter.in)
      } else {
        parametersMap.push({ name: parameter.name, in: parameter.in })
      }
    })

  if (bodyParameter !== undefined && formDataParameter.length > 0) {
    const locations: LocationInput[] = [{ node: bodyParameter }, ...formDataParameter.map(p => { return { node: p } })]
    exception.add.parameterBodyFormDataConflict(data, locations)
  }
}

function reportNonUniqueOperationIds (data: ValidatorData): void {
  const map = data.root.metadata.operationIdMap
  Object.keys(map)
    .filter(operationId => map[operationId].length > 1)
    .forEach(operationId => {
      const locations: LocationInput[] = map[operationId].map(data => {
        const { definition } = data.context
        return {
          node: definition,
          key: 'operationId',
          type: 'value'
        }
      })
      data.context.exception.add.operationIdMustBeUnique(data, locations, operationId, map[operationId])
    })
}

// the "store" parameter is a list of possible media type matches and must not include the quality number
// function findMediaMatch (input: string, store: string[]): string[] {
//   // TODO: use MediaTypeParser
//
//   // @ts-expect-error
//   const accepts: Array<{ extension: string, index: number, quality: number, subType: string, type: string }> = input
//     .split(/, */)
//     .map((value, index) => {
//       const set = value.split(';')
//       const match = rxMediaType.exec(set[0])
//       const q = rxMediaTypeQuality.exec(set[1])
//       if (match === null) return null
//       return {
//         extension: match[2] ?? '*',
//         index: index,
//         quality: q === null ? 1 : +q[1],
//         subType: match[3],
//         type: match[1]
//       }
//     })
//     .filter(v => v !== null)
//
//   // populate matches
//   const matches: Array<{ index: number, order: number, quality: number, score: number, value: string }> = []
//   accepts.forEach(accept => {
//     store.forEach((value, order) => {
//       const match = rxMediaType.exec(value)
//       if (match !== null) {
//         const type = match[1]
//         const subType = match[3]
//         const extension = match[2] ?? '*'
//         const typeMatch = ((accept.type === type || accept.type === '*' || type === '*') &&
//           (accept.subType === subType || accept.subType === '*' || subType === '*') &&
//           (accept.extension === extension || accept.extension === '*' || extension === '*'))
//         if (typeMatch) {
//           matches.push({
//             index: accept.index,
//             order,
//             quality: accept.quality,
//             score: (accept.type === type ? 1 : 0) + (accept.subType === subType ? 1 : 0) + (accept.extension === extension ? 1 : 0),
//             value
//           })
//         }
//       }
//     })
//   })
//
//   // sort matches
//   matches.sort((a, b) => {
//     if (a.quality < b.quality) return 1
//     if (a.quality > b.quality) return -1
//     if (a.score < b.score) return 1
//     if (a.score > b.score) return -1
//     if (a.index < b.index) return 1
//     if (a.index > b.index) return -1
//     return a.order < b.order ? -1 : 1
//   })
//
//   // make results unique
//   const unique: string[] = []
//   matches.forEach(item => {
//     const value = item.value
//     if (!unique.includes(value)) unique.push(value)
//   })
//
//   return unique
// }
