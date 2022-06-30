/**
 * This file is intended to contain only the types and interfaces that are related the functions or properties of
 * components that will be exported with the library so that they can be reused outside the library.
 */

// import { PathItem } from '../PathItem'
// import { PathItem as PathItem2 } from '../v2/PathItem'
// // import { PathItem as PathItem3 } from '../v3/PathItem'
// import { Operation } from '../Operation'
// import { Operation as Operation2 } from '../v2/Operation'
// import { Operation as Operation3 } from '../v3/Operation'

/**
 * General Types
 */

// export type Method = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'trace'
// export type SerializedParameterMap = Record<string, string | string[] | undefined>

/**
 * OpenAPI
 */

// export interface GetOperationResult<O extends Operation, P extends PathItem<O>> {
//   operation: O
//   params: Record<string, string>
//   path: string
//   pathItem: P
// }

// export interface GetOperationOptions {
//   normalizePath?: boolean // default: true
// }

// export interface OpenAPIMakeRequestInput {
//   body?: string | any[] | Record<string, any>
//   cookies?: SerializedParameterMap
//   headers?: SerializedParameterMap
//   method: Method
//   path: string
//   query?: SerializedParameterMap
// }

// export type OpenAPIMakeRequestOptions = OperationMakeRequestOptions

// export interface OpenAPIMakeRequestOutput {
//   body?: unknown
//   cookies: Record<string, unknown>
//   headers: Record<string, unknown>
//   operation: Operation2 | Operation3
//   params: Record<string, unknown> // path parameters
//   path: string
//   query: Record<string, unknown>
// }

/**
 * Operation
 */

// export interface OperationMakeRequestInput {
//   /**
//    * Body format:
//    * - application/json - The body should be a JSON parsed body
//    * - application/x-www-form-urlencoded - Record<string, string | string[]>
//    * - multipart/form-data - Record<string, string | string[]>
//    * - other - string
//    */
//   body?: string | any[] | object | undefined
//   cookie?: Record<string, string> // if included then these will be merged with cookies in the headers too
//   header?: Record<string, string | string[] | undefined>
//   params?: Record<string, string> // path parameter names mapped to string values
//   query?: string
// }

// export interface OperationMakeRequestOptions {
//   allowOtherQueryParameters?: boolean | string[]
//   decodeCookieUriComponents?: boolean
//   decodeQueryStringUriComponents?: boolean
//   validateInput?: boolean
// }

/**
 * Paths
 */

// export interface PathsFindPathResult<O extends Operation, P extends PathItem<O>> {
//   params: Record<string, string>
//   path: string
//   pathItem: P
// }

/**
 * SWAGGER
 */
//
// export type SwaggerGetOperationResult = GetOperationResult<Operation2, PathItem2>
// export type SwaggerMakeRequestInput = OpenAPIMakeRequestInput
// export type SwaggerMakeRequestOptions = OpenAPIMakeRequestOptions
// export type SwaggerMakeRequestOutput = OpenAPIMakeRequestOutput
