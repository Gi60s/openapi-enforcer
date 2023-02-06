/*
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!   IMPORTANT   !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *  A portion of this file has been created from a template. You can only edit
 *  content in some regions within this file. Look for a region that begins with
 *  // <!# Custom Content Begin: *** #!>
 *  and ends with
 *  // <!# Custom Content End: *** #!>
 *  where the *** is replaced by a string of some value. Within these custom
 *  content regions you can edit the file without worrying about a loss of your
 *  code.
 */

import * as I from './'
import { SchemaProcessor } from '../ComponentSchemaDefinition/SchemaProcessor'

export * from './Callback/ICallback'
export { Callback as Callback3 } from './Callback/Callback3'
export * from './Components/IComponents'
export { Components as Components3 } from './Components/Components3'
export * from './Contact/IContact'
export { Contact as Contact2 } from './Contact/Contact2'
export { Contact as Contact3 } from './Contact/Contact3'
export * from './Discriminator/IDiscriminator'
export { Discriminator as Discriminator3 } from './Discriminator/Discriminator3'
export * from './Encoding/IEncoding'
export { Encoding as Encoding3 } from './Encoding/Encoding3'
export * from './Example/IExample'
export { Example as Example2 } from './Example/Example2'
export { Example as Example3 } from './Example/Example3'
export * from './ExternalDocumentation/IExternalDocumentation'
export { ExternalDocumentation as ExternalDocumentation2 } from './ExternalDocumentation/ExternalDocumentation2'
export { ExternalDocumentation as ExternalDocumentation3 } from './ExternalDocumentation/ExternalDocumentation3'
export * from './Header/IHeader'
export { Header as Header2 } from './Header/Header2'
export { Header as Header3 } from './Header/Header3'
export * from './Info/IInfo'
export { Info as Info2 } from './Info/Info2'
export { Info as Info3 } from './Info/Info3'
export * from './Items/IItems'
export { Items as Items2 } from './Items/Items2'
export * from './License/ILicense'
export { License as License2 } from './License/License2'
export { License as License3 } from './License/License3'
export * from './Link/ILink'
export { Link as Link3 } from './Link/Link3'
export * from './MediaType/IMediaType'
export { MediaType as MediaType3 } from './MediaType/MediaType3'
export * from './OAuthFlow/IOAuthFlow'
export { OAuthFlow as OAuthFlow3 } from './OAuthFlow/OAuthFlow3'
export * from './OAuthFlows/IOAuthFlows'
export { OAuthFlows as OAuthFlows3 } from './OAuthFlows/OAuthFlows3'
export * from './OpenAPI/IOpenAPI'
export { OpenAPI as OpenAPI3 } from './OpenAPI/OpenAPI3'
export * from './Operation/IOperation'
export { Operation as Operation2 } from './Operation/Operation2'
export { Operation as Operation3 } from './Operation/Operation3'
export * from './Parameter/IParameter'
export { Parameter as Parameter2 } from './Parameter/Parameter2'
export { Parameter as Parameter3 } from './Parameter/Parameter3'
export * from './PathItem/IPathItem'
export { PathItem as PathItem2 } from './PathItem/PathItem2'
export { PathItem as PathItem3 } from './PathItem/PathItem3'
export * from './Paths/IPaths'
export { Paths as Paths2 } from './Paths/Paths2'
export { Paths as Paths3 } from './Paths/Paths3'
export * from './Reference/IReference'
export { Reference as Reference2 } from './Reference/Reference2'
export { Reference as Reference3 } from './Reference/Reference3'
export * from './RequestBody/IRequestBody'
export { RequestBody as RequestBody3 } from './RequestBody/RequestBody3'
export * from './Response/IResponse'
export { Response as Response2 } from './Response/Response2'
export { Response as Response3 } from './Response/Response3'
export * from './Responses/IResponses'
export { Responses as Responses2 } from './Responses/Responses2'
export { Responses as Responses3 } from './Responses/Responses3'
export * from './Schema/ISchema'
export { Schema as Schema2 } from './Schema/Schema2'
export { Schema as Schema3 } from './Schema/Schema3'
export * from './SecurityRequirement/ISecurityRequirement'
export { SecurityRequirement as SecurityRequirement2 } from './SecurityRequirement/SecurityRequirement2'
export { SecurityRequirement as SecurityRequirement3 } from './SecurityRequirement/SecurityRequirement3'
export * from './SecurityScheme/ISecurityScheme'
export { SecurityScheme as SecurityScheme2 } from './SecurityScheme/SecurityScheme2'
export { SecurityScheme as SecurityScheme3 } from './SecurityScheme/SecurityScheme3'
export * from './Server/IServer'
export { Server as Server3 } from './Server/Server3'
export * from './ServerVariable/IServerVariable'
export { ServerVariable as ServerVariable3 } from './ServerVariable/ServerVariable3'
export * from './Swagger/ISwagger'
export { Swagger as Swagger2 } from './Swagger/Swagger2'
export * from './Tag/ITag'
export { Tag as Tag2 } from './Tag/Tag2'
export { Tag as Tag3 } from './Tag/Tag3'
export * from './Xml/IXml'
export { Xml as Xml2 } from './Xml/Xml2'
export { Xml as Xml3 } from './Xml/Xml3'

export type ICallback = I.ICallback3
export type ICallbackDefinition = I.ICallback3Definition
export type ICallbackSchemaProcessor = SchemaProcessor<I.ICallback3Definition, I.ICallback3>
export type IComponents = I.IComponents3
export type IComponentsDefinition = I.IComponents3Definition
export type IComponentsSchemaProcessor = SchemaProcessor<I.IComponents3Definition, I.IComponents3>
export type IContact = I.IContact2 | I.IContact3
export type IContactDefinition = I.IContact2Definition | I.IContact3Definition
export type IContactSchemaProcessor = SchemaProcessor<I.IContact2Definition, I.IContact2> | SchemaProcessor<I.IContact3Definition, I.IContact3>
export type IDiscriminator = I.IDiscriminator3
export type IDiscriminatorDefinition = I.IDiscriminator3Definition
export type IDiscriminatorSchemaProcessor = SchemaProcessor<I.IDiscriminator3Definition, I.IDiscriminator3>
export type IEncoding = I.IEncoding3
export type IEncodingDefinition = I.IEncoding3Definition
export type IEncodingSchemaProcessor = SchemaProcessor<I.IEncoding3Definition, I.IEncoding3>
export type IExample = I.IExample2 | I.IExample3
export type IExampleDefinition = I.IExample2Definition | I.IExample3Definition
export type IExampleSchemaProcessor = SchemaProcessor<I.IExample2Definition, I.IExample2> | SchemaProcessor<I.IExample3Definition, I.IExample3>
export type IExternalDocumentation = I.IExternalDocumentation2 | I.IExternalDocumentation3
export type IExternalDocumentationDefinition = I.IExternalDocumentation2Definition | I.IExternalDocumentation3Definition
export type IExternalDocumentationSchemaProcessor = SchemaProcessor<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> | SchemaProcessor<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>
export type IHeader = I.IHeader2 | I.IHeader3
export type IHeaderDefinition = I.IHeader2Definition | I.IHeader3Definition
export type IHeaderSchemaProcessor = SchemaProcessor<I.IHeader2Definition, I.IHeader2> | SchemaProcessor<I.IHeader3Definition, I.IHeader3>
export type IInfo = I.IInfo2 | I.IInfo3
export type IInfoDefinition = I.IInfo2Definition | I.IInfo3Definition
export type IInfoSchemaProcessor = SchemaProcessor<I.IInfo2Definition, I.IInfo2> | SchemaProcessor<I.IInfo3Definition, I.IInfo3>
export type IItems = I.IItems2
export type IItemsDefinition = I.IItems2Definition
export type IItemsSchemaProcessor = SchemaProcessor<I.IItems2Definition, I.IItems2>
export type ILicense = I.ILicense2 | I.ILicense3
export type ILicenseDefinition = I.ILicense2Definition | I.ILicense3Definition
export type ILicenseSchemaProcessor = SchemaProcessor<I.ILicense2Definition, I.ILicense2> | SchemaProcessor<I.ILicense3Definition, I.ILicense3>
export type ILink = I.ILink3
export type ILinkDefinition = I.ILink3Definition
export type ILinkSchemaProcessor = SchemaProcessor<I.ILink3Definition, I.ILink3>
export type IMediaType = I.IMediaType3
export type IMediaTypeDefinition = I.IMediaType3Definition
export type IMediaTypeSchemaProcessor = SchemaProcessor<I.IMediaType3Definition, I.IMediaType3>
export type IOAuthFlow = I.IOAuthFlow3
export type IOAuthFlowDefinition = I.IOAuthFlow3Definition
export type IOAuthFlowSchemaProcessor = SchemaProcessor<I.IOAuthFlow3Definition, I.IOAuthFlow3>
export type IOAuthFlows = I.IOAuthFlows3
export type IOAuthFlowsDefinition = I.IOAuthFlows3Definition
export type IOAuthFlowsSchemaProcessor = SchemaProcessor<I.IOAuthFlows3Definition, I.IOAuthFlows3>
export type IOpenAPI = I.IOpenAPI3
export type IOpenAPIDefinition = I.IOpenAPI3Definition
export type IOpenAPISchemaProcessor = SchemaProcessor<I.IOpenAPI3Definition, I.IOpenAPI3>
export type IOperation = I.IOperation2 | I.IOperation3
export type IOperationDefinition = I.IOperation2Definition | I.IOperation3Definition
export type IOperationSchemaProcessor = SchemaProcessor<I.IOperation2Definition, I.IOperation2> | SchemaProcessor<I.IOperation3Definition, I.IOperation3>
export type IParameter = I.IParameter2 | I.IParameter3
export type IParameterDefinition = I.IParameter2Definition | I.IParameter3Definition
export type IParameterSchemaProcessor = SchemaProcessor<I.IParameter2Definition, I.IParameter2> | SchemaProcessor<I.IParameter3Definition, I.IParameter3>
export type IPathItem = I.IPathItem2 | I.IPathItem3
export type IPathItemDefinition = I.IPathItem2Definition | I.IPathItem3Definition
export type IPathItemSchemaProcessor = SchemaProcessor<I.IPathItem2Definition, I.IPathItem2> | SchemaProcessor<I.IPathItem3Definition, I.IPathItem3>
export type IPaths = I.IPaths2 | I.IPaths3
export type IPathsDefinition = I.IPaths2Definition | I.IPaths3Definition
export type IPathsSchemaProcessor = SchemaProcessor<I.IPaths2Definition, I.IPaths2> | SchemaProcessor<I.IPaths3Definition, I.IPaths3>
export type IReference = I.IReference2 | I.IReference3
export type IReferenceDefinition = I.IReference2Definition | I.IReference3Definition
export type IReferenceSchemaProcessor = SchemaProcessor<I.IReference2Definition, I.IReference2> | SchemaProcessor<I.IReference3Definition, I.IReference3>
export type IRequestBody = I.IRequestBody3
export type IRequestBodyDefinition = I.IRequestBody3Definition
export type IRequestBodySchemaProcessor = SchemaProcessor<I.IRequestBody3Definition, I.IRequestBody3>
export type IResponse = I.IResponse2 | I.IResponse3
export type IResponseDefinition = I.IResponse2Definition | I.IResponse3Definition
export type IResponseSchemaProcessor = SchemaProcessor<I.IResponse2Definition, I.IResponse2> | SchemaProcessor<I.IResponse3Definition, I.IResponse3>
export type IResponses = I.IResponses2 | I.IResponses3
export type IResponsesDefinition = I.IResponses2Definition | I.IResponses3Definition
export type IResponsesSchemaProcessor = SchemaProcessor<I.IResponses2Definition, I.IResponses2> | SchemaProcessor<I.IResponses3Definition, I.IResponses3>
export type ISchema = I.ISchema2 | I.ISchema3
export type ISchemaDefinition = I.ISchema2Definition | I.ISchema3Definition
export type ISchemaSchemaProcessor = SchemaProcessor<I.ISchema2Definition, I.ISchema2> | SchemaProcessor<I.ISchema3Definition, I.ISchema3>
export type ISecurityRequirement = I.ISecurityRequirement2 | I.ISecurityRequirement3
export type ISecurityRequirementDefinition = I.ISecurityRequirement2Definition | I.ISecurityRequirement3Definition
export type ISecurityRequirementSchemaProcessor = SchemaProcessor<I.ISecurityRequirement2Definition, I.ISecurityRequirement2> | SchemaProcessor<I.ISecurityRequirement3Definition, I.ISecurityRequirement3>
export type ISecurityScheme = I.ISecurityScheme2 | I.ISecurityScheme3
export type ISecuritySchemeDefinition = I.ISecurityScheme2Definition | I.ISecurityScheme3Definition
export type ISecuritySchemeSchemaProcessor = SchemaProcessor<I.ISecurityScheme2Definition, I.ISecurityScheme2> | SchemaProcessor<I.ISecurityScheme3Definition, I.ISecurityScheme3>
export type IServer = I.IServer3
export type IServerDefinition = I.IServer3Definition
export type IServerSchemaProcessor = SchemaProcessor<I.IServer3Definition, I.IServer3>
export type IServerVariable = I.IServerVariable3
export type IServerVariableDefinition = I.IServerVariable3Definition
export type IServerVariableSchemaProcessor = SchemaProcessor<I.IServerVariable3Definition, I.IServerVariable3>
export type ISwagger = I.ISwagger2
export type ISwaggerDefinition = I.ISwagger2Definition
export type ISwaggerSchemaProcessor = SchemaProcessor<I.ISwagger2Definition, I.ISwagger2>
export type ITag = I.ITag2 | I.ITag3
export type ITagDefinition = I.ITag2Definition | I.ITag3Definition
export type ITagSchemaProcessor = SchemaProcessor<I.ITag2Definition, I.ITag2> | SchemaProcessor<I.ITag3Definition, I.ITag3>
export type IXml = I.IXml2 | I.IXml3
export type IXmlDefinition = I.IXml2Definition | I.IXml3Definition
export type IXmlSchemaProcessor = SchemaProcessor<I.IXml2Definition, I.IXml2> | SchemaProcessor<I.IXml3Definition, I.IXml3>

export type IComponent =
ICallback |
IComponents |
IContact |
IDiscriminator |
IEncoding |
IExample |
IExternalDocumentation |
IHeader |
IInfo |
IItems |
ILicense |
ILink |
IMediaType |
IOAuthFlow |
IOAuthFlows |
IOpenAPI |
IOperation |
IParameter |
IPathItem |
IPaths |
IReference |
IRequestBody |
IResponse |
IResponses |
ISchema |
ISecurityRequirement |
ISecurityScheme |
IServer |
IServerVariable |
ISwagger |
ITag |
IXml

export type IDefinition =
ICallbackDefinition |
IComponentsDefinition |
IContactDefinition |
IDiscriminatorDefinition |
IEncodingDefinition |
IExampleDefinition |
IExternalDocumentationDefinition |
IHeaderDefinition |
IInfoDefinition |
IItemsDefinition |
ILicenseDefinition |
ILinkDefinition |
IMediaTypeDefinition |
IOAuthFlowDefinition |
IOAuthFlowsDefinition |
IOpenAPIDefinition |
IOperationDefinition |
IParameterDefinition |
IPathItemDefinition |
IPathsDefinition |
IReferenceDefinition |
IRequestBodyDefinition |
IResponseDefinition |
IResponsesDefinition |
ISchemaDefinition |
ISecurityRequirementDefinition |
ISecuritySchemeDefinition |
IServerDefinition |
IServerVariableDefinition |
ISwaggerDefinition |
ITagDefinition |
IXmlDefinition
