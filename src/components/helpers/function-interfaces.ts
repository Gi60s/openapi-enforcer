import { Operation as Operation2 } from '../v2/Operation'
import { Operation as Operation3 } from '../v3/Operation'

export type SwaggerGetOperationResult = OpenAPIGetOperationResult
export type SwaggerMakeRequestInput = OpenAPIMakeRequestInput
export type SwaggerMakeRequestOptions = OpenAPIMakeRequestOptions
export type SwaggerMakeRequestResult = OpenAPIMakeRequestResult

export interface OpenAPIGetOperationResult {
  operation: Operation2 | Operation3
  params: Record<string, string>
}

export interface OpenAPIMakeRequestInput {
  body?: string | any[] | Record<string, any>
  headers?: Record<string, string | string[] | undefined>
  method: 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'trace'
  path: string
  query?: Record<string, string | string[] | undefined>
}

export interface OpenAPIMakeRequestOptions {
  allowOtherQueryParameters?: boolean
}

export interface OpenAPIMakeRequestResult {
  body?: unknown
  cookies: Record<string, unknown>
  headers: Record<string, unknown>
  operation: Operation2 | Operation3
  params: Record<string, unknown> // path parameters
  path: string
  query: Record<string, unknown>
  response: () => void // TODO: update to use operation response signature
}
