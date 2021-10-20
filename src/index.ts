import * as loader from './loader'
import * as config from './config'

export {
  config,
  loader
}

// export exception class and interfaces
export {
  Exception,
  ErrorReport as ExceptionErrorReport,
  WarningReport as ExceptionWarningReport,
  OpinionReport as ExceptionOpinionReport,
  IgnoredReport as ExceptionIgnoredReport
} from './Exception'
export { Level as ExceptionLevel, ExceptionMessageData } from './Exception/types'

// export result interface
export { Result } from './Result'

// export definition interfaces
export { Definition as CallbackDefinition } from './components/Callback'
export { Definition as ComponentsDefinition } from './components/Components'
export { Definition as ContactDefinition } from './components/Contact'
export { Definition as DefinitionDefinition } from './components/Definitions'
export { Definition as DiscriminatorDefinition } from './components/Discriminator'
export { Definition as EncodingDefinition } from './components/Encoding'
export { Definition as ExampleDefinition } from './components/Example'
export { Definition as ExternalDocumentationDefinition } from './components/ExternalDocumentation'
export { Definition as HeaderDefinition, Definition2 as HeaderDefinition2, Definition3 as HeaderDefinition3 } from './components/Header'
export { Definition as InfoDefinition } from './components/Info'
export { Definition as ItemsDefinition } from './components/Items'
export { Definition as LicenseDefinition } from './components/License'
export { Definition as LinkDefinition } from './components/Link'
export { Definition as MediaTypeDefinition } from './components/MediaType'
export { Definition as OAuthFlowDefinition } from './components/OAuthFlow'
export { Definition as OAuthFlowsDefinition } from './components/OAuthFlows'
export { Definition as OpenAPIDefinition } from './components/OpenAPI'
export { Definition as OperationDefinition } from './components/Operation'
export { Definition as ParameterDefinition } from './components/Parameter'
export { Definition as PathItemDefinition } from './components/PathItem'
export { Definition as PathsDefinition } from './components/Paths'
export { Definition as ReferenceDefinition } from './components/Reference'
export { Definition as RequestBodyDefinition } from './components/RequestBody'
export { Definition as ResponseDefinition } from './components/Response'
export { Definition as ResponsesDefinition } from './components/Responses'
export { Definition as SchemaDefinition, Definition2 as SchemaDefinition2, Definition3 as SchemaDefinition3 } from './components/Schema'
export { Definition as SecurityRequirementDefinition } from './components/SecurityRequirement'
export { Definition as SecuritySchemeDefinition } from './components/SecurityScheme'
export { Definition as ServerDefinition } from './components/Server'
export { Definition as ServerVariableDefinition } from './components/ServerVariable'
export { Definition as SwaggerDefinition } from './components/Swagger'
export { Definition as TagDefinition } from './components/Tag'
export { Definition as XmlDefinition } from './components/Xml'

// export component constructors
export { Callback } from './components/Callback'
export { Components } from './components/Components'
export { Contact } from './components/Contact'
export { Definitions } from './components/Definitions'
export { Discriminator } from './components/Discriminator'
export { Encoding } from './components/Encoding'
export { Example } from './components/Example'
export { ExternalDocumentation } from './components/ExternalDocumentation'
export { Header, Header2, Header3 } from './components/Header'
export { Info } from './components/Info'
export { Items } from './components/Items'
export { License } from './components/License'
export { Link } from './components/Link'
export { MediaType } from './components/MediaType'
export { OAuthFlow } from './components/OAuthFlow'
export { OAuthFlows } from './components/OAuthFlows'
export { OpenAPI } from './components/OpenAPI'
export { Operation } from './components/Operation'
export { Parameter } from './components/Parameter'
export { PathItem } from './components/PathItem'
export { Paths } from './components/Paths'
export { Dereferenced, Reference, Referenced, ReferencedUnknown } from './components/Reference'
export { RequestBody } from './components/RequestBody'
export { Response } from './components/Response'
export { Responses } from './components/Responses'
export { Schema } from './components/Schema'
export { SecurityRequirement } from './components/SecurityRequirement'
export { SecurityScheme } from './components/SecurityScheme'
export { Server } from './components/Server'
export { ServerVariable } from './components/ServerVariable'
export { Swagger } from './components/Swagger'
export { Tag } from './components/Tag'
export { Xml } from './components/Xml'

// take an object and bundle it so that it can be converted to a JSON string
export function bundle (object: any): any {

}

// load a file and optionally dereference it
export async function load (path: string, options?: loader.Options): Promise<unknown> {
  return await loader.load(path, options)
}
