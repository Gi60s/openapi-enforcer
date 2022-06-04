import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import { DefinitionException, Exception } from '../../Exception'
import { OASComponent, componentValidate, LoaderOptions, loadRoot, normalizeLoaderOptions } from '../index'
import { Components } from './Components'
import { ExternalDocumentation } from '../ExternalDocumentation'
import { Info } from '../Info'
import { Operation } from './Operation'
import { Paths } from './Paths'
import { SecurityRequirement } from '../SecurityRequirement'
import { Server } from './Server'
import { Tag } from '../Tag'
import { Result } from '../../utils/Result'
import { OpenAPI3 as Definition } from '../helpers/definition-types'
import {
  Method,
  GetOperationOptions,
  GetOperationResult,
  OpenAPIMakeRequestInput,
  OpenAPIMakeRequestOptions,
  OpenAPIMakeRequestOutput, PathsFindPathResult,
  SerializedParameterMap
} from '../helpers/function-interfaces'
import { PathItem } from './PathItem'

const rxVersion = /^\d+\.\d+\.\d+$/
let openapiSchema: ComponentSchema<Definition>

export class OpenAPI extends OASComponent {
  extensions!: Record<string, any>
  components?: Components
  externalDocs?: ExternalDocumentation
  info!: Info
  openapi!: string
  paths!: Paths
  security?: SecurityRequirement[]
  servers!: Server[]
  tags?: Tag[]

  constructor (definition: Definition, version?: Version) {
    super(OpenAPI, definition, version, arguments[2])
  }

  findOperation (method: Method, path: string, options?: GetOperationOptions): GetOperationResult<Operation, PathItem> | undefined {
    return this.paths.findOperation(method, path, options)
  }

  findPath (path: string): Array<PathsFindPathResult<Operation, PathItem>> {
    return this.paths.findPaths(path)
  }

  getOperationById (operationId: string): Operation | undefined {
    return this.enforcer.metadata.operationIdMap[operationId] as Operation
  }

  /**
   *
   * @param req The request object.
   * @param [req.body] Optional, the body as a string, array, or object. The body should have already passed through a body parser / deserializer.
   * @param [req.cookies] Optional, an object mapping cookies names to a value or an array of values.
   * @param [req.headers] Optional, an object mapping header names to a value or array of values.
   * @param req.method The lowercase HTTP method name.
   * @param req.path The path as a string. If the path includes query parameters then those will be added to anything already in the query property.
   * @param [req.query] Optional, an object mapping query parameter names to a value or array of values.
   * @param [options] Optional, configuration options.
   */
  formatRequest (req: OpenAPIMakeRequestInput, options?: OpenAPIMakeRequestOptions): Result<OpenAPIMakeRequestOutput> {
    const exception = new Exception('Unable to format request')
    const [rawPath, rawQuery] = req.path.split('?')
    const match = this.findOperation(req.method, rawPath)
    if (match === undefined) {
      // if we can't find the path then the problem is with the path, otherwise it's with the method
      if (this.findPath(rawPath) === undefined) {
        exception.add.pathNotFound(rawPath)
      } else {
        exception.add.operationNotFound(req.method, rawPath)
      }
      return new Result(null, exception)
    } else {
      const result: OpenAPIMakeRequestOutput = {
        cookies: {},
        headers: {},
        operation: match.operation,
        params: {},
        path: match.path,
        query: {}
      }

      // get lowercase headers map
      const lowerCaseHeaders: SerializedParameterMap = {}
      Object.entries(req.headers ?? {}).forEach(entry => {
        lowerCaseHeaders[entry[0].toLowerCase()] = entry[1]
      })

      // extract cookies from headers and merge with passed in cookies object
      const cookies: SerializedParameterMap = req.cookies ?? {}
      if (lowerCaseHeaders.cookie !== undefined) {
        const cookieData: string[] = typeof lowerCaseHeaders.cookie === 'string'
          ? [lowerCaseHeaders.cookie]
          : lowerCaseHeaders.cookie
        cookieData.forEach(cookieString => {
          cookieString.split(/; +/).forEach((cookie: string) => {
            const [name, value] = cookie.split('=')
            if (cookies[name] === undefined) cookies[name] = []
            ;(cookies[name] as string[]).push(value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent))
          })
        })
      }

      // extract query parameters from the URL
      const query: SerializedParameterMap = req.query ?? {}
      if (rawQuery !== undefined && rawQuery.length > 0) {
        const querySearch = new URLSearchParams(rawQuery)
        // @ts-expect-error
        const keys = Array.from(new Set(querySearch.keys())) as string[]
        for (const key of keys) {
          const values = querySearch.getAll(key)
          if (key in query) {
            const value: string | string[] | undefined = query[key]
            if (typeof value === 'string') {
              query[key] = [value]
            } else if (value === undefined) {
              query[key] = []
            } else if (!Array.isArray(value)) {
              throw Error('Unexpected query parameter value for key: ' + String(key) + '. Expected a string, string array, or undefined. Received: ' + String(value))
            }
            (query[key] as string[]).push(...values)
          } else {
            query[key] = values
          }
        }
      }

      // parse path parameters
      const operation = match.operation
      parseParametersByType(operation, exception, 'cookie', cookies, result.cookies)
      parseParametersByType(operation, exception, 'header', req.headers, result.headers)
      parseParametersByType(operation, exception, 'path', match.params, result.params)
      parseParametersByType(operation, exception, 'query', query, result.query)

      return new Result(result, exception)
    }
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#openapi-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#openapi-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#openapi-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#openapi-object'
  }

  static async load (path: string, options?: LoaderOptions): Promise<Result<OpenAPI>> {
    options = normalizeLoaderOptions(options)
    return await loadRoot<OpenAPI>(OpenAPI, path, options)
  }

  static get schema (): ComponentSchema<Definition> {
    if (openapiSchema === undefined) {
      openapiSchema = new ComponentSchema<Definition>({
        allowsSchemaExtensions: true,
        properties: [
          {
            name: 'components',
            schema: {
              type: 'component',
              allowsRef: false,
              component: Components
            }
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
            name: 'info',
            required: true,
            schema: {
              type: 'component',
              allowsRef: false,
              component: Info
            }
          },
          {
            name: 'openapi',
            required: true,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'paths',
            required: true,
            schema: {
              type: 'component',
              allowsRef: false,
              component: Paths
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
            name: 'tags',
            schema: {
              type: 'array',
              items: {
                type: 'component',
                allowsRef: false,
                component: Tag
              }
            }
          }
        ],
        builder: {
          after (data) {
            const { built } = data.context

            if (built.servers === undefined) built.servers = []
            if (built.servers.length === 0) built.servers.push({ url: '/' })
          }
        },
        validator: {
          before (data) {
            const { definition, exception } = data.context

            if (definition.openapi !== undefined) {
              const openapiVersion = definition.openapi
              if (!rxVersion.test(openapiVersion)) {
                exception.at('openapi').add.invalidSemanticVersionNumber(data, { key: 'openapi', type: 'value' }, openapiVersion)
                return false
              }
              if (openapiVersion.split('.')[0] !== '3') {
                exception.at('openapi').add.invalidOpenApiVersionNumber(data, { key: 'openapi', type: 'value' }, openapiVersion)
                return false
              }
            }

            return true
          }
        }
      })
    }
    return openapiSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}

function parseParametersByType (operation: Operation, exception: Exception, location: 'cookie' | 'header' | 'path' | 'query', input: Record<string, string | string[] | undefined> | undefined, target: Record<string, unknown>): void {
  if (input !== undefined) {
    const valuesMap: Record<string, string[] | Record<string, string> | undefined> = {}

    Object.entries(input)
      .forEach(([key, value]) => {
        if (value === undefined) {
          valuesMap[key] = undefined
        } else {
          const match = /^(.+?)\[(.+)]/.exec(key)
          if (match === null) {
            valuesMap[key] = Array.isArray(value) ? value : [value]
          } else {
            const name: string = match[1]
            const parameter = operation.enforcer.parameters[location]?.[name]
            if (parameter !== undefined && parameter.style === 'deepObject') {
              const property: string = match[2]
              const val: string = Array.isArray(value) ? value[0] : value
              if (valuesMap[name] === undefined) {
                valuesMap[name] = {
                  [property]: val
                }
              } else {
                (valuesMap[name] as Record<string, string>)[property] = val
              }
            } else {
              valuesMap[key] = Array.isArray(value) ? value : [value]
            }
          }
        }
      })

    Object.entries(valuesMap).forEach(([key, value]) => {
      const parameter = operation.enforcer.parameters[location]?.[key]
      if (parameter === undefined || value === undefined) {
        target[key] = value
      } else {
        const pv = parameter.parseValue(Array.isArray(value) ? value : [value])
        if (pv.error === undefined) {
          target[key] = pv.value
        } else {
          exception.at(key).add.detailedError(pv.exception as Exception)
        }
      }
    })
  }
}
