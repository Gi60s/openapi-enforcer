
export interface Contact {
  [key: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface Callback3 {
  [key: `x-${string}`]: any
  [pathItem: string]: PathItem3
}

export interface Components3 {
  [key: `x-${string}`]: any
  callbacks?: Record<string, Callback3 | Reference>
  examples?: Record<string, Example3 | Reference>
  headers?: Record<string, Header3 | Reference>
  links?: Record<string, Link3 | Reference>
  parameters?: Record<string, Parameter3 | Reference>
  requestBodies?: Record<string, RequestBody3 | Reference>
  responses?: Record<string, Response3 | Reference>
  schemas?: Record<string, Schema3 | Reference>
  securitySchemes?: Record<string, SecurityScheme3 | Reference>
}

export interface Definitions2 {
  [name: string]: Schema2
}

export interface Discriminator3 {
  propertyName: string
  mapping?: Record<string, string>
}

export interface Encoding3 {
  [key: `x-${string}`]: any
  allowReserved?: boolean
  contentType?: string
  explode?: boolean
  headers?: Record<string, Header3 | Reference>
  style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
}

export interface Example3 {
  [key: `x-${string}`]: any
  description?: string
  externalValue?: string
  summary?: string
  value?: any
}

export interface ExternalDocumentation {
  [key: `x-${string}`]: any
  description?: string
  url: string
}

export interface Header2 extends PartialSchema<Header2>{
  [key: `x-${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  description?: string
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface Header3 {
  [key: `x-${string}`]: any
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example3 | Reference>
  explode?: boolean
  required?: boolean
  schema?: Schema3 | Reference
  style?: 'simple'
}

export interface Info {
  [key: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: Contact
  license?: License
  version: string
}

export interface Items2 extends PartialSchema<Items2>{
  [key: `x-${string}`]: any
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string'
}

export interface License {
  [key: `x-${string}`]: any
  name: string
  url?: string
}

export interface Link3 {
  [key: `x-${string}`]: any
  description?: string
  operationId?: string
  operationRef?: string
  parameters?: Record<string, Parameter3>
  requestBody?: any
  server?: Server3
}

export interface OpenAPI3 {
  [key: `x-${string}`]: any
  components?: Components3
  externalDocs?: ExternalDocumentation
  info: Info
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  paths: Paths3
  security?: SecurityRequirement[]
  servers?: Server3[]
  tags?: Tag[]
}

interface OperationBase {
  [key: `x-${string}`]: any
  deprecated?: boolean
  description?: string
  externalDocs?: ExternalDocumentation
  operationId?: string
  parameters?: Parameter2 | Parameter3
  responses: Responses2 | Responses3
  security?: SecurityRequirement[]
  summary?: string
  tags?: string[]
}

export interface Operation2 extends OperationBase {
  consumes?: string[]
  parameters?: Parameter2
  produces?: string[]
  responses: Responses2
  schemes?: string[]
}

export interface Operation3 extends OperationBase {
  callbacks?: Record<string, Callback3 | Reference>
  parameters?: Parameter3
  requestBody?: RequestBody3 | Reference
  responses: Responses3
  servers?: Server3[]
}

export interface MediaType3 {
  [key: `x-${string}`]: any
  encoding?: Record<string, Encoding3 | Reference>
  example?: any
  examples?: Record<string, Example3 | Reference>
  schema?: Schema3 | Reference
}

export interface OAuthFlow3 {
  [key: `x-${string}`]: any
  authorizationUrl?: string
  refreshUrl?: string
  scopes: string[]
  tokenUrl?: string
}

export interface OAuthFlows3 {
  [key: `x-${string}`]: any
  authorizationCode?: OAuthFlows3
  clientCredentials?: OAuthFlows3
  implicit?: OAuthFlows3
  password?: OAuthFlows3
}

export interface Parameter2 extends PartialSchema<Items2> {
  [key: `x-${string}`]: any
  name: string
  in: 'body' | 'formData' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv'
  description?: string
  required?: boolean
  schema?: Schema2
  type?: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string'
}

export interface Parameter3 {
  [key: `x-${string}`]: any
  name: string
  in: 'cookie' | 'header' | 'path' | 'query'
  allowEmptyValue?: boolean
  allowReserved?: boolean
  deprecated?: boolean // defaults to false
  description?: string
  example?: any
  examples?: Record<string, Example3 | Reference>
  explode?: boolean
  required?: boolean
  schema?: Schema3 | Reference
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'simple' | 'spaceDelimited' | 'pipeDelimited'
}

interface PartialSchema<Items> {
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number | string
  minimum?: number | string
  multipleOf?: number
  pattern?: string
  type?: string
  uniqueItems?: boolean
}

interface PathItemBase<OperationDefinition, ParameterDefinition> {
  [key: `x-${string}`]: any
  delete?: OperationDefinition
  description?: string
  get?: OperationDefinition
  head?: OperationDefinition
  options?: OperationDefinition
  parameters?: Array<ParameterDefinition | Reference>
  patch?: OperationDefinition
  put?: OperationDefinition
  post?: OperationDefinition
  trace?: OperationDefinition
}

export interface PathItem2 extends PathItemBase<Operation2, Parameter2> {}

export interface PathItem3 extends PathItemBase<Operation3, Parameter3> {
  servers?: Server3[]
  summary?: string
}

interface PathsBase<PathItemDefinition> {
  [key: `x-${string}`]: any
  [path: string]: PathItemDefinition
}

export interface Paths2 extends PathsBase<PathItem2> {}

export interface Paths3 extends PathsBase<PathItem3> {}

export interface Reference {
  $ref: string
}

export interface RequestBody3 {
  [key: `x-${string}`]: any
  description?: string
  content: Record<string, MediaType3>
  required?: boolean
}

interface ResponseBase {
  [key: `x-${string}`]: any
  description: string
}

export interface Response2 extends ResponseBase {
  examples?: Record<string, any>
  headers?: Record<string, Header2>
  schema?: Schema2 | Reference
}

export interface Response3 extends ResponseBase {
  content?: Record<string, MediaType3>
  headers?: Record<string, Header3 | Reference>
  links?: Record<string, Link3 | Reference>
}

export interface Responses2 {
  [key: `x-${string}`]: any
  [code: string | number]: Response2
}

export interface Responses3 {
  [key: `x-${string}`]: any
  [code: string | number]: Response3
}

interface SchemaBase<SchemaDefinition> extends PartialSchema<SchemaDefinition> {
  [key: `x-${string}`]: any
  additionalProperties?: SchemaDefinition | boolean
  allOf?: Array<SchemaDefinition | Reference>
  description?: string
  example?: any
  externalDocs?: ExternalDocumentation
  maxProperties?: number
  minProperties?: number
  properties?: Record<string, SchemaDefinition | Reference>
  readOnly?: boolean
  required?: string[]
  title?: string
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
  xml?: Xml
}

export interface Schema2 extends SchemaBase<Schema2> {
  discriminator?: string
}

export interface Schema3 extends SchemaBase<Schema3> {
  anyOf?: Array<Schema3 | Reference>
  deprecated?: boolean
  discriminator?: Discriminator3
  not?: Schema3 | Reference
  nullable?: boolean
  oneOf?: Array<Schema3 | Reference>
  writeOnly?: boolean
}

export interface SecurityRequirement {
  [key: `x-${string}`]: any
  [name: string]: string[]
}

interface SecuritySchemeBase {
  [key: `x-${string}`]: any
  description?: string
  in: string
  name: string
  type: string
}

export interface SecurityScheme2 extends SecuritySchemeBase {
  authorizationUrl: string
  flow: string
  scopes: Record<string, string>
  tokenUrl: string
}

export interface SecurityScheme3 extends SecuritySchemeBase {
  bearerFormat?: string
  flows: string
  openIdConnectUrl: string
  scheme: string
}

export interface Server3 {
  [key: `x-${string}`]: any
  description?: string
  url: string
  variables?: Record<string, ServerVariable3>
}

export interface ServerVariable3 {
  [key: `x-${string}`]: any
  enum?: string[]
  default: string
  description?: string
}

export interface Swagger {
  [key: `x-${string}`]: any
  basePath?: string
  consumes?: string[]
  definitions?: Definitions2
  externalDocs?: ExternalDocumentation
  host?: string
  info: Info
  parameters?: Record<string, Parameter2>
  paths: Paths2
  produces?: string[]
  responses?: Record<string, Response2>
  security?: SecurityRequirement[]
  securityDefinitions?: Record<string, SecurityScheme2>
  schemes?: string[]
  swagger: '2.0'
  tags?: Tag[]
}

export interface Tag {
  [key: `x-${string}`]: any
  name: string
  description?: string
  externalDocs?: ExternalDocumentation
}

export interface Xml {
  [key: `x-${string}`]: any
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}
