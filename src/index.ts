import { generateComponents, normalizeOptions, ComponentOptions, v2 as Iv2, v3 as Iv3 } from './components'
import { Exception } from 'exception-tree'
import * as Callback from './components/Callback'
import * as Components from './components/Components'
import * as Contact from './components/Contact'
import * as Encoding from './components/Encoding'
import * as Example from './components/Example'
import * as ExternalDocumentation from './components/ExternalDocumentation'
import * as Header from './components/Header'
import * as Info from './components/Info'
import * as License from './components/License'
import * as Link from './components/Link'
import * as MediaType from './components/MediaType'
import * as OAuthFlow from './components/OAuthFlow'
import * as OAuthFlows from './components/OAuthFlows'
import * as OpenAPI from './components/OpenAPI'
// import * as Operation from './components/Operation'
// import * as Parameter from './components/Parameter'
import * as PathItem from './components/PathItem'
// import * as Paths from './components/Paths'
// import * as RequestBody from './components/RequestBody'
// import * as Response from './components/Response'
// import * as Responses from './components/Responses'
import * as Schema from './components/Schema'
// import * as SecurityRequirement from './components/SecurityRequirement'
// import * as SecurityScheme from './components/SecurityScheme'
// import * as Swagger from './components/Swagger'
import * as Server from './components/Server'
import * as ServerVariable from './components/ServerVariable'
// import * as Tag from './components/Tag'
import * as Xml from './components/Xml'

interface EnforcerFactoryResult {
  validate: (definition: object) => Exception
  v2: Iv2
  v3: Iv3
}

export function OpenAPIEnforcer (options?: ComponentOptions): EnforcerFactoryResult {
  const opts = normalizeOptions(options)
  const v2 = generateComponents(2, opts) as Iv2
  const v3 = generateComponents(3, opts) as Iv3

  return {
    validate (definition: object): Exception {
      if ('swagger' in definition) {
        return v2.Swagger.validate(definition)
      } else {
        return v3.OpenAPI.validate(definition)
      }
    },
    v2,
    v3
  }
}

// TODO: implement load - load a path with optional dereferencing
export async function load (path: string): Promise<any> {
  return true
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace v2 {

  export type ContactClass = Contact.Class
  export type ContactDefinition = Contact.Definition
  export type ContactObject = Contact.Object

  export type ExternalDocumentationClass = ExternalDocumentation.Class
  export type ExternalDocumentationDefinition = ExternalDocumentation.Definition
  export type ExternalDocumentationObject = ExternalDocumentation.Object

  export type HeaderClass = Header.Class
  export type HeaderDefinition = Header.Definition
  export type HeaderObject = Header.Object

  export type InfoClass = Info.Class
  export type InfoDefinition = Info.Definition
  export type InfoObject = Info.Object

  export type LicenseClass = License.Class
  export type LicenseDefinition = License.Definition
  export type LicenseObject = License.Object

  // export type OperationClass = Operation.Class
  // export type OperationDefinition = Operation.Definition
  // export type OperationObject = Operation.Object

  // export type ParameterClass = Parameter.Class
  // export type ParameterDefinition = Parameter.Definition
  // export type ParameterObject = Parameter.Object

  export type PathItemClass = PathItem.Class
  export type PathItemDefinition = PathItem.Definition
  export type PathItemObject = PathItem.Object

  // export type PathsClass = Paths.Class
  // export type PathsDefinition = Paths.Definition
  // export type PathsObject = Paths.Object

  // export type ResponseClass = Response.Class
  // export type ResponseDefinition = Response.Definition
  // export type ResponseObject = Response.Object

  // export type ResponsesClass = Responses.Class
  // export type ResponsesDefinition = Responses.Definition
  // export type ResponsesObject = Responses.Object

  export type SchemaClass = Schema.Class
  export type SchemaDefinition = Schema.Definition
  export type SchemaObject = Schema.Object

  // export type SecurityRequirementClass = SecurityRequirement.Class
  // export type SecurityRequirementDefinition = SecurityRequirement.Definition
  // export type SecurityRequirementObject = SecurityRequirement.Object

  // export type SecuritySchemeClass = SecurityScheme.Class
  // export type SecuritySchemeDefinition = SecurityScheme.Definition
  // export type SecuritySchemeObject = SecurityScheme.Object

  // export type SwaggerClass = Swagger.Class
  // export type SwaggerDefinition = Swagger.Definition
  // export type SwaggerObject = Swagger.Object

  // export type TagClass = Tag.Class
  // export type TagDefinition = Tag.Definition
  // export type TagObject = Tag.Object

  export type XmlClass = Xml.Class
  export type XmlDefinition = Xml.Definition
  export type XmlObject = Xml.Object

}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace v3 {
  export type CallbackClass = Callback.Class
  export type CallbackDefinition = Callback.Definition
  export type CallbackObject = Callback.Object

  export type ComponentsClass = Components.Class
  export type ComponentsDefinition = Components.Definition
  export type ComponentsObject = Components.Object

  export type ContactClass = Contact.Class
  export type ContactDefinition = Contact.Definition
  export type ContactObject = Contact.Object

  export type EncodingClass = Encoding.Class
  export type EncodingDefinition = Encoding.Definition
  export type EncodingObject = Encoding.Object

  export type ExampleClass = Example.Class
  export type ExampleDefinition = Example.Definition
  export type ExampleObject = Example.Object

  export type ExternalDocumentationClass = ExternalDocumentation.Class
  export type ExternalDocumentationDefinition = ExternalDocumentation.Definition
  export type ExternalDocumentationObject = ExternalDocumentation.Object

  export type HeaderClass = Header.Class
  export type HeaderDefinition = Header.Definition
  export type HeaderObject = Header.Object

  export type InfoClass = Info.Class
  export type InfoDefinition = Info.Definition
  export type InfoObject = Info.Object

  export type LicenseClass = License.Class
  export type LicenseDefinition = License.Definition
  export type LicenseObject = License.Object

  export type LinkClass = Link.Class
  export type LinkDefinition = Link.Definition
  export type LinkObject = Link.Object

  export type MediaTypeClass = MediaType.Class
  export type MediaTypeDefinition = MediaType.Definition
  export type MediaTypeObject = MediaType.Object

  export type OAuthFlowClass = OAuthFlow.Class
  export type OAuthFlowDefinition = OAuthFlow.Definition
  export type OAuthFlowObject = OAuthFlow.Object

  export type OAuthFlowsClass = OAuthFlows.Class
  export type OAuthFlowsDefinition = OAuthFlows.Definition
  export type OAuthFlowsObject = OAuthFlows.Object

  export type OpenAPIClass = OpenAPI.Class
  export type OpenAPIDefinition = OpenAPI.Definition
  export type OpenAPIObject = OpenAPI.Object

  // export type OperationClass = Operation.Class
  // export type OperationDefinition = Operation.Definition
  // export type OperationObject = Operation.Object

  // export type ParameterClass = Parameter.Class
  // export type ParameterDefinition = Parameter.Definition
  // export type ParameterObject = Parameter.Object

  export type PathItemClass = PathItem.Class
  export type PathItemDefinition = PathItem.Definition
  export type PathItemObject = PathItem.Object

  // export type PathsClass = Paths.Class
  // export type PathsDefinition = Paths.Definition
  // export type PathsObject = Paths.Object

  // export type RequestBodyClass = RequestBody.Class
  // export type RequestBodyDefinition = RequestBody.Definition
  // export type RequestBodyObject = RequestBody.Object

  // export type ResponseClass = Response.Class
  // export type ResponseDefinition = Response.Definition
  // export type ResponseObject = Response.Object

  // export type ResponsesClass = Responses.Class
  // export type ResponsesDefinition = Responses.Definition
  // export type ResponsesObject = Responses.Object

  export type SchemaClass = Schema.Class
  export type SchemaDefinition = Schema.Definition
  export type SchemaObject = Schema.Object

  // export type SecurityRequirementClass = SecurityRequirement.Class
  // export type SecurityRequirementDefinition = SecurityRequirement.Definition
  // export type SecurityRequirementObject = SecurityRequirement.Object

  // export type SecuritySchemeClass = SecurityScheme.Class
  // export type SecuritySchemeDefinition = SecurityScheme.Definition
  // export type SecuritySchemeObject = SecurityScheme.Object

  export type ServerClass = Server.Class
  export type ServerDefinition = Server.Definition
  export type ServerObject = Server.Object

  export type ServerVariableClass = ServerVariable.Class
  export type ServerVariableDefinition = ServerVariable.Definition
  export type ServerVariableObject = ServerVariable.Object

  // export type TagClass = Tag.Class
  // export type TagDefinition = Tag.Definition
  // export type TagObject = Tag.Object

  export type XmlClass = Xml.Class
  export type XmlDefinition = Xml.Definition
  export type XmlObject = Xml.Object
}
