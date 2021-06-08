declare module 'openapi-enforcer' {
  export = OpenApiEnforcer

  export function OpenApiEnforcer (doc: unknown, options?: Options): Promise<OpenAPI>

  export namespace OpenApiEnforcer {
    export function bundle(doc: unknown): Record<string, unknown>
    export function dereference(doc: unknown): Record<string, unknown>
  }

  export interface Options {
    fullResult?: boolean
    hideWarnings?: boolean
    componentOptions?: {
      apiSuggestions?: boolean
      disablePathNormalization?: boolean
      exceptionSkipCodes?: string[]
      exceptionEscalateCodes?: string[]
      requestBodyAllowedMethods?: {
        [key: string]: boolean
      }
      production?: boolean
    }
  }

  export class OpenAPI {
    path(method: string, path: string): any
    request(config: unknown): any
    toObject(): any
  }
}