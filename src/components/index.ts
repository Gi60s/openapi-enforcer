import { getAlert } from '../Exception/config'
import * as Callback from './Callback'
import * as Components from './Components'
import * as Contact from './Contact'
import * as Discriminator from './Discriminator'
import * as Encoding from './Encoding'
import * as Example from './Example'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Header from './Header'
import * as Info from './Info'
import * as Item from './Item'
import * as License from './License'
import * as Link from './Link'
import * as MediaType from './MediaType'
import * as OAuthFlow from './OAuthFlow'
import * as OAuthFlows from './OAuthFlows'
import * as OpenAPI from './OpenAPI'
import * as Operation from './Operation'
import * as Parameter from './Parameter'
import * as PathItem from './PathItem'
// import * as Paths from './Paths'
// import * as RequestBody from './RequestBody'
// import * as Response from './Response'
// import * as Responses from './Responses'
import * as Schema from './Schema'
// import * as SecurityRequirement from './SecurityRequirement'
// import * as SecurityScheme from './SecurityScheme'
// import * as Swagger from './Swagger'
import * as Server from './Server'
import * as ServerVariable from './ServerVariable'
// import * as Tag from './Tag'
import * as Xml from './Xml'

import { Exception } from 'exception-tree'
import Result from 'result-value-exception'
import * as Validator from '../definition-validator'
import { smart } from '../util'
import { BuildMapper } from '../BuildMapper'
import * as Version from '../component-registry'

const ComponentMapper: WeakMap<EnforcerComponent<any, any>, ComponentMapItem<any, any>> = new WeakMap()

export type AnyComponent =
  Callback.Class |
  Components.Class |
  Contact.Class |
  Discriminator.Class |
  Encoding.Class |
  Example.Class |
  ExternalDocumentation.Class |
  Header.Class |
  Info.Class |
  Item.Class |
  License.Class |
  Link.Class |
  MediaType.Class |
  OAuthFlow.Class |
  OAuthFlows.Class |
  // OpenAPI.Class |
  Operation.Class |
  Parameter.Class<Parameter.Definition, Parameter.Object> |
  PathItem.Class |
  // Paths.Class |
  // RequestBody.Class |
  // Response.Class |
  // Responses.Class |
  Schema.Class |
  // SecurityRequirement.Class |
  // SecurityScheme.Class |
  // Swagger.Class |
  Server.Class |
  ServerVariable.Class |
  // Tag.Class |
  Xml.Class

export interface v2 {
  $version: '2'
  Contact: Contact.Class
  ExternalDocumentation: ExternalDocumentation.Class
  Header: Header.Class
  Info: Info.Class
  Item: Item.Class
  License: License.Class
  Operation: Operation.Class
  Parameter: Parameter.Class<Parameter.Definition2, Parameter.Object2>
  PathItem: PathItem.Class
  // Paths: Paths.Class
  // Response: Response.Class
  // Responses: Responses.Class
  Schema: Schema.Class
  // SecurityRequirement: SecurityRequirement.Class
  // SecurityScheme: SecurityScheme.Class
  // Swagger: Swagger.Class
  // Tag: Tag.Class
  Xml: Xml.Class
}

export interface v3 {
  $version: '3'
  Callback: Callback.Class
  Components: Components.Class
  Contact: Contact.Class
  Discriminator: Discriminator.Class
  Encoding: Encoding.Class
  Example: Example.Class
  ExternalDocumentation: ExternalDocumentation.Class
  Header: Header.Class
  Info: Info.Class
  License: License.Class
  Link: Link.Class
  MediaType: MediaType.Class
  OAuthFlow: OAuthFlow.Class
  OAuthFlows: OAuthFlows.Class
  OpenAPI: OpenAPI.Class
  Operation: Operation.Class
  Parameter: Parameter.Class<Parameter.Definition3, Parameter.Object3>
  PathItem: PathItem.Class
  // Paths: Paths.Class
  // RequestBody: RequestBody.Class
  // Response: Response.Class
  // Responses: Responses.Class
  Schema: Schema.Class
  // SecurityRequirement: SecurityRequirement.Class
  // SecurityScheme: SecurityScheme.Class
  Server: Server.Class
  ServerVariable: ServerVariable.Class
  // Tag: Tag.Class
  Xml: Xml.Class
}

export interface ComponentMapItem<Definition, Built> {
  builder: {
    component: AnyComponent
    extensions: Array<ExtensionFunction<Definition, Built>>
  }
  components: v2 | v3
  definition: {
    extensions: Array<ExtensionFunction<Definition, Built>>
    validator: DefinitionValidatorFactory<Definition, Built>
  }
  name: string
  options: ComponentOptionsFixed
  reference: {
    [version: string]: string
  }
  version: Version.Details
}

export interface ComponentOptions {
  disablePathNormalization?: boolean
  requestBodyAllowedMethods?: {
    get?: boolean
    post?: boolean
    put?: boolean
    delete?: boolean
    options?: boolean
    head?: boolean
    patch?: boolean
    trace?: boolean
  }
  exceptions?: {
    [code: string]: ExceptionMode
  }
}

export interface ComponentOptionsFixed {
  disablePathNormalization: boolean
  requestBodyAllowedMethods: {
    get: boolean
    post: boolean
    put: boolean
    delete: boolean
    options: boolean
    head: boolean
    patch: boolean
    trace: boolean
  }
  exceptions: {
    [code: string]: ExceptionMode
  }
}

type ExceptionMode = 'ignore' | 'warn' | 'error'

export interface ExtensionData<Definition, Built> {
  built: Built | undefined
  components: v2 | v3
  definition: Definition
  error: Exception
  key: string | number
  warning: Exception
}

type ExtensionFunction<Definition, Built> = (data: ExtensionData<Definition, Built>) => undefined

type DefinitionValidatorFactory<Definition, Built> = (data: Validator.Data<Definition, Built>) => Validator.SchemaObject

export interface Statics<Definition, Built> {
  extend: (type: 'builder' | 'validator', extension: ExtensionFunction<Definition, Built>) => undefined
  validate: (definition: Definition) => Result<Built>
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EnforcerComponent<Definition, Built> {
  [key: string]: any

  constructor (definition: Definition) {
    const data = initializeValidatorData<Definition, Built>(this, definition,
      'Unable to build OpenAPI Enforcer ' + this.constructor.name + ' component',
      'One or more warnings encountered while building your ' + this.constructor.name + ' component')
    data.built = (this as unknown) as Built
    Validator.buildComponent(data)
  }

  static extend<Definition, Built> (type: 'builder' | 'validator', extension: ExtensionFunction<Definition, Built>): undefined {
    const key = type === 'builder'
      ? 'builder'
      : type === 'validator' ? 'definition' : ''
    if (key === '') throw Error('Invalid extension type. Expected either "builder" or "validator". Received: ' + type)

    const data = getComponentData(this)
    if (data === undefined) throw Error('Invalid component context.')

    if (typeof extension === 'function') {
      data[key].extensions.push(extension)
    } else {
      throw Error('Invalid extension. Expected a function. Received: ' + smart(extension))
    }

    return undefined
  }


  static validate<Definition, Built> (definition: Definition): Result<Built> {
    const data = initializeValidatorData<Definition, Built>(this, definition,
      'Invalid ' + this.name + ' definition',
      'One or more warnings exist for your ' + this.name + ' definition')
    Validator.validateDefinition(data)
    return new Result(data.built, data.error, data.warning)
  }

  static get versions (): Version.Reference {
    return {}
  }
}

function initializeValidatorData<Definition, Built> (component: EnforcerComponent<Definition, Built>, definition: Definition, errorHeading: string, warningHeading: string): Validator.Data<Definition, Built> {
  const { components, name, options, reference, version } = getComponentData(component)

  // build data object
  const data: Validator.Data<Definition, Built> = {
    // unchanging values
    components,
    map: BuildMapper(),
    metadata: {},
    options,

    // changing per component values
    component,
    reference: reference[version.name],

    // changing values
    built: undefined,
    chain: [],
    definition,
    error: new Exception(errorHeading),
    key: '',
    schema: {
      type: 'component',
      allowsRef: true,
      component: component as AnyComponent
    },
    version,
    warning: new Exception(warningHeading)
  }

  if (!data.reference) throw Error('Component "' + name + '" not supported for specification version ' + version.name)

  return data
}
