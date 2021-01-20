import * as Callback from './Callback'
import * as Components from './Components'
import * as Contact from './Contact'
import * as Encoding from './Encoding'
import * as Example from './Example'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Header from './Header'
import * as Info from './Info'
import * as License from './License'
import * as Link from './Link'
// import * as MediaType from './MediaType'
// import * as OAuthFlow from './OAuthFlow'
// import * as OAuthFlows from './OAuthFlows'
// import * as OpenAPI from './OpenAPI'
// import * as Operation from './Operation'
// import * as Parameter from './Parameter'
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
import * as Validator from '../Validator'
import { smart } from '../util'
import { BuildMapper } from '../BuildMapper'

const ComponentMapper: WeakMap<EnforcerComponent<any, any>, ComponentMapItem<any, any>> = new WeakMap()

export type AnyComponent =
Callback.Class |
Components.Class |
Contact.Class |
Encoding.Class |
Example.Class |
ExternalDocumentation.Class |
Header.Class |
Info.Class |
License.Class |
Link.Class |
// MediaType.Class |
// OAuthFlow.Class |
// OAuthFlows.Class |
// OpenAPI.Class |
// Operation.Class |
// Parameter.Class |
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
  major: '2'
  Contact: Contact.Class
  ExternalDocumentation: ExternalDocumentation.Class
  Header: Header.Class
  Info: Info.Class
  License: License.Class
  // Operation: Operation.Class
  // Parameter: Parameter.Class
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
  major: '3'
  Callback: Callback.Class
  Components: Components.Class
  Contact: Contact.Class
  Encoding: Encoding.Class
  Example: Example.Class
  ExternalDocumentation: ExternalDocumentation.Class
  Header: Header.Class
  Info: Info.Class
  License: License.Class
  Link: Link.Class
  // MediaType: MediaType.Class
  // OAuthFlow: OAuthFlow.Class
  // OAuthFlows: OAuthFlows.Class
  // OpenAPI: OpenAPI.Class
  // Operation: Operation.Class
  // Parameter: Parameter.Class
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

interface ComponentMapItem<Definition, Built> {
  components: v2 | v3
  extensions: {
    builder: Array<ExtensionFunction<Definition, Built>>
    validator: Array<ExtensionFunction<Definition, Built>>
  }
  schema: FactorySchema<Definition, Built>
  options: ComponentOptionsFixed
}

export interface ComponentOptions {
  disablePathNormalization?: boolean
  exceptions?: {
    [code: string]: ExceptionMode
  }
}

interface ComponentOptionsFixed {
  disablePathNormalization: boolean
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

export interface FactoryResult<Definition, Built> {
  component: AnyComponent
  schema: FactorySchema<Definition, Built>
}

type FactorySchema<Definition, Built> = (data: Validator.Data<Definition, Built>) => Validator.SchemaObject

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
    const { extensions } = getComponentData(this)
    if (type in extensions) {
      if (typeof extension === 'function') {
        extensions[type].push(extension)
      } else {
        throw Error('Invalid extension. Expected a function. Received: ' + smart(extension))
      }
    } else {
      throw Error('Invalid extension type. Expected one of: ' + Object.keys(extensions).join(', ') + '. Received: ' + smart(type))
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
}

export function generateComponents (version: 2 | 3, options: ComponentOptionsFixed): v2 | v3 {
  if (version === 2) {
    // @ts-expect-error
    const v2: v2 = {}
    generateComponent('Contact', v2, Contact.Factory, options)
    generateComponent('Contact', v2, Contact.Factory, options)
    generateComponent('ExternalDocumentation', v2, ExternalDocumentation.Factory, options)
    generateComponent('Header', v2, Header.Factory, options)
    generateComponent('Info', v2, Info.Factory, options)
    generateComponent('PathItem', v2, PathItem.Factory, options)
    generateComponent('License', v2, License.Factory, options)
    // generateComponent('Operation', v2, Operation.Factory, options)
    // generateComponent('Parameter', v2, Parameter.Factory, options)
    generateComponent('PathItem', v2, PathItem.Factory, options)
    // generateComponent('Paths', v2,Paths.Factory, options)
    // generateComponent('Response', v2, Response.Factory, options)
    // generateComponent('Responses', v2, Responses.Factory, options)
    generateComponent('Schema', v2, Schema.Factory2, options)
    // generateComponent('SecurityRequirement', v2, SecurityRequirement.Factory, options)
    // generateComponent('SecurityScheme', v2, SecurityScheme.Factory, options)
    // generateComponent('Swagger', v2, Swagger.Factory, options)
    // generateComponent('Tag', v2, Tag.Factory, options)
    generateComponent('Xml', v2, Xml.Factory, options)
    return v2
  } else if (version === 3) {
    // @ts-expect-error
    const v3: Iv3 = {}
    generateComponent('Callback', v3, Callback.Factory, options)
    generateComponent('Contact', v3, Contact.Factory, options)
    generateComponent('Components', v3, Components.Factory, options)
    generateComponent('Encoding', v3, Encoding.Factory, options)
    generateComponent('Example', v3, Example.Factory, options)
    generateComponent('ExternalDocumentation', v3, ExternalDocumentation.Factory, options)
    generateComponent('Header', v3, Header.Factory, options)
    generateComponent('Info', v3, Info.Factory, options)
    generateComponent('PathItem', v3, PathItem.Factory, options)
    generateComponent('License', v3, License.Factory, options)
    generateComponent('Link', v3, Link.Factory, options)
    // generateComponent('MediaType', v3, MediaType.Factory, options)
    // generateComponent('OAuthFlow', v3, OAuthFlow.Factory, options)
    // generateComponent('OAuthFlows', v3, OAuthFlows.Factory, options)
    // generateComponent('OpenAPI', v3, OpenAPI.Factory, options)
    // generateComponent('Operation', v3, Operation.Factory, options)
    // generateComponent('Parameter', v3, Parameter.Factory, options)
    generateComponent('PathItem', v3, PathItem.Factory, options)
    // generateComponent('Paths', v3, Paths.Factory, options)
    // generateComponent('RequestBody', v3, RequestBody.Factory, options)
    // generateComponent('Response', v3, Response.Factory, options)
    // generateComponent('Responses', v3, Responses.Factory, options)
    generateComponent('Schema', v3, Schema.Factory3, options)
    // generateComponent('SecurityRequirement', v3, SecurityRequirement.Factory, options)
    // generateComponent('SecurityScheme', v3, SecurityScheme.Factory, options)
    generateComponent('Server', v3, Server.Factory, options)
    generateComponent('ServerVariable', v3, ServerVariable.Factory, options)
    // generateComponent('Tag', v3, Tag.Factory, options)
    generateComponent('Xml', v3, Xml.Factory, options)
    return v3
  } else {
    throw Error('Invalid version specified')
  }
}

export function generateComponent<Definition, Built> (name: string, components: v2 | v3, factory: () => FactoryResult<Definition, Built>, options: ComponentOptionsFixed): AnyComponent {
  const { component, schema } = factory()
  // @ts-expect-error
  components[name] = component
  ComponentMapper.set(component, {
    components: components,
    extensions: { builder: [], validator: [] },
    schema,
    options
  })
  return component
}

export function getComponentData<Definition, Built> (component: EnforcerComponent<Definition, Built>): ComponentMapItem<Definition, Built> {
  const data = ComponentMapper.get(component)
  if (data === undefined) throw Error('Invalid component context')
  return data
}

export function normalizeOptions (options?: ComponentOptions): ComponentOptionsFixed {
  // normalize options
  if (options === undefined) options = {}
  if (typeof options !== 'object' || options === null) throw Error('Invalid configuration options specified.')
  if (!('disablePathNormalization' in options)) options.disablePathNormalization = false
  if (!('exceptions' in options)) options.exceptions = {}
  return options as ComponentOptionsFixed
}

function initializeValidatorData<Definition, Built> (component: EnforcerComponent<Definition, Built>, definition: Definition, errorHeading: string, warningHeading: string): Validator.Data<Definition, Built> {
  const { components, options } = getComponentData(component)

  // build data object
  const data: Validator.Data<Definition, Built> = {
    // unchanging values
    /*
     * Which mode should you choose when specifying an alert:
     *
     * Is the alert critical (systems cannot continue) -> 'error'
     * Is the alert a MUST (or MUST NOT) from the OpenAPI spec -> 'error'
     * Everything else -> 'warn'
     *
     * An "error" cannot be downgraded to warn or ignore, but a warning or ignore can be moved to "error" or "ignore"
     */
    alert (mode: ExceptionMode, code: string, message: string): undefined {
      if (mode !== 'error' && code in options.exceptions) mode = options.exceptions[code]
      switch (mode) {
        case 'error':
          data.error.message(message, code)
          break
        case 'warn':
          data.warning.message(message, code)
          break
      }
      return undefined
    },
    components,
    map: BuildMapper(),

    // changing values
    built: undefined,
    chain: [],
    definition,
    error: new Exception(errorHeading),
    key: '',
    schema: {
      type: 'component',
      component: component as AnyComponent
    },
    warning: new Exception(warningHeading)
  }
  return data
}
