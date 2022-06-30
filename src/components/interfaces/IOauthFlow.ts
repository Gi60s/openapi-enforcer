
export interface IOAuthFlow {
  extensions: Record<string, any>
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}
