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
export { Callback as Callback3a } from './Callback/Callback3a'
export * from './Components/IComponents'
export { Components as Components3 } from './Components/Components3'
export { Components as Components3a } from './Components/Components3a'
export * from './Contact/IContact'
export { Contact as Contact2 } from './Contact/Contact2'
export { Contact as Contact3 } from './Contact/Contact3'
export { Contact as Contact3a } from './Contact/Contact3a'
export * from './Discriminator/IDiscriminator'
export { Discriminator as Discriminator3 } from './Discriminator/Discriminator3'
export { Discriminator as Discriminator3a } from './Discriminator/Discriminator3a'
export * from './Encoding/IEncoding'
export { Encoding as Encoding3 } from './Encoding/Encoding3'
export { Encoding as Encoding3a } from './Encoding/Encoding3a'
export * from './Example/IExample'
export { Example as Example2 } from './Example/Example2'
export { Example as Example3 } from './Example/Example3'
export { Example as Example3a } from './Example/Example3a'
export * from './ExternalDocumentation/IExternalDocumentation'
export { ExternalDocumentation as ExternalDocumentation2 } from './ExternalDocumentation/ExternalDocumentation2'
export { ExternalDocumentation as ExternalDocumentation3 } from './ExternalDocumentation/ExternalDocumentation3'
export { ExternalDocumentation as ExternalDocumentation3a } from './ExternalDocumentation/ExternalDocumentation3a'
export * from './Header/IHeader'
export { Header as Header2 } from './Header/Header2'
export { Header as Header3 } from './Header/Header3'
export { Header as Header3a } from './Header/Header3a'
export * from './Info/IInfo'
export { Info as Info2 } from './Info/Info2'
export { Info as Info3 } from './Info/Info3'
export { Info as Info3a } from './Info/Info3a'
export * from './Items/IItems'
export { Items as Items2 } from './Items/Items2'
export { Items as Items3a } from './Items/Items3a'
export * from './License/ILicense'
export { License as License2 } from './License/License2'
export { License as License3 } from './License/License3'
export { License as License3a } from './License/License3a'
export * from './Link/ILink'
export { Link as Link3 } from './Link/Link3'
export { Link as Link3a } from './Link/Link3a'
export * from './MediaType/IMediaType'
export { MediaType as MediaType3 } from './MediaType/MediaType3'
export { MediaType as MediaType3a } from './MediaType/MediaType3a'
export * from './OAuthFlow/IOAuthFlow'
export { OAuthFlow as OAuthFlow3 } from './OAuthFlow/OAuthFlow3'
export { OAuthFlow as OAuthFlow3a } from './OAuthFlow/OAuthFlow3a'
export * from './OAuthFlows/IOAuthFlows'
export { OAuthFlows as OAuthFlows3 } from './OAuthFlows/OAuthFlows3'
export { OAuthFlows as OAuthFlows3a } from './OAuthFlows/OAuthFlows3a'
export * from './OpenAPI/IOpenAPI'
export { OpenAPI as OpenAPI3 } from './OpenAPI/OpenAPI3'
export { OpenAPI as OpenAPI3a } from './OpenAPI/OpenAPI3a'
export * from './Operation/IOperation'
export { Operation as Operation2 } from './Operation/Operation2'
export { Operation as Operation3 } from './Operation/Operation3'
export { Operation as Operation3a } from './Operation/Operation3a'
export * from './Parameter/IParameter'
export { Parameter as Parameter2 } from './Parameter/Parameter2'
export { Parameter as Parameter3 } from './Parameter/Parameter3'
export { Parameter as Parameter3a } from './Parameter/Parameter3a'
export * from './PathItem/IPathItem'
export { PathItem as PathItem2 } from './PathItem/PathItem2'
export { PathItem as PathItem3 } from './PathItem/PathItem3'
export { PathItem as PathItem3a } from './PathItem/PathItem3a'
export * from './Paths/IPaths'
export { Paths as Paths2 } from './Paths/Paths2'
export { Paths as Paths3 } from './Paths/Paths3'
export { Paths as Paths3a } from './Paths/Paths3a'
export * from './Reference/IReference'
export { Reference as Reference2 } from './Reference/Reference2'
export { Reference as Reference3 } from './Reference/Reference3'
export { Reference as Reference3a } from './Reference/Reference3a'
export * from './RequestBody/IRequestBody'
export { RequestBody as RequestBody3 } from './RequestBody/RequestBody3'
export { RequestBody as RequestBody3a } from './RequestBody/RequestBody3a'
export * from './Response/IResponse'
export { Response as Response2 } from './Response/Response2'
export { Response as Response3 } from './Response/Response3'
export { Response as Response3a } from './Response/Response3a'
export * from './Responses/IResponses'
export { Responses as Responses2 } from './Responses/Responses2'
export { Responses as Responses3 } from './Responses/Responses3'
export { Responses as Responses3a } from './Responses/Responses3a'
export * from './Schema/ISchema'
export { Schema as Schema2 } from './Schema/Schema2'
export { Schema as Schema3 } from './Schema/Schema3'
export { Schema as Schema3a } from './Schema/Schema3a'
export * from './SecurityRequirement/ISecurityRequirement'
export { SecurityRequirement as SecurityRequirement2 } from './SecurityRequirement/SecurityRequirement2'
export { SecurityRequirement as SecurityRequirement3 } from './SecurityRequirement/SecurityRequirement3'
export { SecurityRequirement as SecurityRequirement3a } from './SecurityRequirement/SecurityRequirement3a'
export * from './SecurityScheme/ISecurityScheme'
export { SecurityScheme as SecurityScheme2 } from './SecurityScheme/SecurityScheme2'
export { SecurityScheme as SecurityScheme3 } from './SecurityScheme/SecurityScheme3'
export { SecurityScheme as SecurityScheme3a } from './SecurityScheme/SecurityScheme3a'
export * from './Server/IServer'
export { Server as Server3 } from './Server/Server3'
export { Server as Server3a } from './Server/Server3a'
export * from './ServerVariable/IServerVariable'
export { ServerVariable as ServerVariable3 } from './ServerVariable/ServerVariable3'
export { ServerVariable as ServerVariable3a } from './ServerVariable/ServerVariable3a'
export * from './Swagger/ISwagger'
export { Swagger as Swagger2 } from './Swagger/Swagger2'
export * from './Tag/ITag'
export { Tag as Tag2 } from './Tag/Tag2'
export { Tag as Tag3 } from './Tag/Tag3'
export { Tag as Tag3a } from './Tag/Tag3a'
export * from './Xml/IXml'
export { Xml as Xml2 } from './Xml/Xml2'
export { Xml as Xml3 } from './Xml/Xml3'
export { Xml as Xml3a } from './Xml/Xml3a'

export type ICallback = I.ICallback3 | I.ICallback3a
export type ICallbackDefinition = I.ICallback3Definition | I.ICallback3aDefinition
export type ICallbackSchemaProcessor = SchemaProcessor<I.ICallback3Definition, I.ICallback3> | SchemaProcessor<I.ICallback3aDefinition, I.ICallback3a>
export type IComponents = I.IComponents3 | I.IComponents3a
export type IComponentsDefinition = I.IComponents3Definition | I.IComponents3aDefinition
export type IComponentsSchemaProcessor = SchemaProcessor<I.IComponents3Definition, I.IComponents3> | SchemaProcessor<I.IComponents3aDefinition, I.IComponents3a>
export type IContact = I.IContact2 | I.IContact3 | I.IContact3a
export type IContactDefinition = I.IContact2Definition | I.IContact3Definition | I.IContact3aDefinition
export type IContactSchemaProcessor = SchemaProcessor<I.IContact2Definition, I.IContact2> | SchemaProcessor<I.IContact3Definition, I.IContact3> | SchemaProcessor<I.IContact3aDefinition, I.IContact3a>
export type IDiscriminator = I.IDiscriminator3 | I.IDiscriminator3a
export type IDiscriminatorDefinition = I.IDiscriminator3Definition | I.IDiscriminator3aDefinition
export type IDiscriminatorSchemaProcessor = SchemaProcessor<I.IDiscriminator3Definition, I.IDiscriminator3> | SchemaProcessor<I.IDiscriminator3aDefinition, I.IDiscriminator3a>
export type IEncoding = I.IEncoding3 | I.IEncoding3a
export type IEncodingDefinition = I.IEncoding3Definition | I.IEncoding3aDefinition
export type IEncodingSchemaProcessor = SchemaProcessor<I.IEncoding3Definition, I.IEncoding3> | SchemaProcessor<I.IEncoding3aDefinition, I.IEncoding3a>
export type IExample = I.IExample2 | I.IExample3 | I.IExample3a
export type IExampleDefinition = I.IExample2Definition | I.IExample3Definition | I.IExample3aDefinition
export type IExampleSchemaProcessor = SchemaProcessor<I.IExample2Definition, I.IExample2> | SchemaProcessor<I.IExample3Definition, I.IExample3> | SchemaProcessor<I.IExample3aDefinition, I.IExample3a>
export type IExternalDocumentation = I.IExternalDocumentation2 | I.IExternalDocumentation3 | I.IExternalDocumentation3a
export type IExternalDocumentationDefinition = I.IExternalDocumentation2Definition | I.IExternalDocumentation3Definition | I.IExternalDocumentation3aDefinition
export type IExternalDocumentationSchemaProcessor = SchemaProcessor<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> | SchemaProcessor<I.IExternalDocumentation3Definition, I.IExternalDocumentation3> | SchemaProcessor<I.IExternalDocumentation3aDefinition, I.IExternalDocumentation3a>
export type IHeader = I.IHeader2 | I.IHeader3 | I.IHeader3a
export type IHeaderDefinition = I.IHeader2Definition | I.IHeader3Definition | I.IHeader3aDefinition
export type IHeaderSchemaProcessor = SchemaProcessor<I.IHeader2Definition, I.IHeader2> | SchemaProcessor<I.IHeader3Definition, I.IHeader3> | SchemaProcessor<I.IHeader3aDefinition, I.IHeader3a>
export type IInfo = I.IInfo2 | I.IInfo3 | I.IInfo3a
export type IInfoDefinition = I.IInfo2Definition | I.IInfo3Definition | I.IInfo3aDefinition
export type IInfoSchemaProcessor = SchemaProcessor<I.IInfo2Definition, I.IInfo2> | SchemaProcessor<I.IInfo3Definition, I.IInfo3> | SchemaProcessor<I.IInfo3aDefinition, I.IInfo3a>
export type IItems = I.IItems2 | I.IItems3a
export type IItemsDefinition = I.IItems2Definition | I.IItems3aDefinition
export type IItemsSchemaProcessor = SchemaProcessor<I.IItems2Definition, I.IItems2> | SchemaProcessor<I.IItems3aDefinition, I.IItems3a>
export type ILicense = I.ILicense2 | I.ILicense3 | I.ILicense3a
export type ILicenseDefinition = I.ILicense2Definition | I.ILicense3Definition | I.ILicense3aDefinition
export type ILicenseSchemaProcessor = SchemaProcessor<I.ILicense2Definition, I.ILicense2> | SchemaProcessor<I.ILicense3Definition, I.ILicense3> | SchemaProcessor<I.ILicense3aDefinition, I.ILicense3a>
export type ILink = I.ILink3 | I.ILink3a
export type ILinkDefinition = I.ILink3Definition | I.ILink3aDefinition
export type ILinkSchemaProcessor = SchemaProcessor<I.ILink3Definition, I.ILink3> | SchemaProcessor<I.ILink3aDefinition, I.ILink3a>
export type IMediaType = I.IMediaType3 | I.IMediaType3a
export type IMediaTypeDefinition = I.IMediaType3Definition | I.IMediaType3aDefinition
export type IMediaTypeSchemaProcessor = SchemaProcessor<I.IMediaType3Definition, I.IMediaType3> | SchemaProcessor<I.IMediaType3aDefinition, I.IMediaType3a>
export type IOAuthFlow = I.IOAuthFlow3 | I.IOAuthFlow3a
export type IOAuthFlowDefinition = I.IOAuthFlow3Definition | I.IOAuthFlow3aDefinition
export type IOAuthFlowSchemaProcessor = SchemaProcessor<I.IOAuthFlow3Definition, I.IOAuthFlow3> | SchemaProcessor<I.IOAuthFlow3aDefinition, I.IOAuthFlow3a>
export type IOAuthFlows = I.IOAuthFlows3 | I.IOAuthFlows3a
export type IOAuthFlowsDefinition = I.IOAuthFlows3Definition | I.IOAuthFlows3aDefinition
export type IOAuthFlowsSchemaProcessor = SchemaProcessor<I.IOAuthFlows3Definition, I.IOAuthFlows3> | SchemaProcessor<I.IOAuthFlows3aDefinition, I.IOAuthFlows3a>
export type IOpenAPI = I.IOpenAPI3 | I.IOpenAPI3a
export type IOpenAPIDefinition = I.IOpenAPI3Definition | I.IOpenAPI3aDefinition
export type IOpenAPISchemaProcessor = SchemaProcessor<I.IOpenAPI3Definition, I.IOpenAPI3> | SchemaProcessor<I.IOpenAPI3aDefinition, I.IOpenAPI3a>
export type IOperation = I.IOperation2 | I.IOperation3 | I.IOperation3a
export type IOperationDefinition = I.IOperation2Definition | I.IOperation3Definition | I.IOperation3aDefinition
export type IOperationSchemaProcessor = SchemaProcessor<I.IOperation2Definition, I.IOperation2> | SchemaProcessor<I.IOperation3Definition, I.IOperation3> | SchemaProcessor<I.IOperation3aDefinition, I.IOperation3a>
export type IParameter = I.IParameter2 | I.IParameter3 | I.IParameter3a
export type IParameterDefinition = I.IParameter2Definition | I.IParameter3Definition | I.IParameter3aDefinition
export type IParameterSchemaProcessor = SchemaProcessor<I.IParameter2Definition, I.IParameter2> | SchemaProcessor<I.IParameter3Definition, I.IParameter3> | SchemaProcessor<I.IParameter3aDefinition, I.IParameter3a>
export type IPathItem = I.IPathItem2 | I.IPathItem3 | I.IPathItem3a
export type IPathItemDefinition = I.IPathItem2Definition | I.IPathItem3Definition | I.IPathItem3aDefinition
export type IPathItemSchemaProcessor = SchemaProcessor<I.IPathItem2Definition, I.IPathItem2> | SchemaProcessor<I.IPathItem3Definition, I.IPathItem3> | SchemaProcessor<I.IPathItem3aDefinition, I.IPathItem3a>
export type IPaths = I.IPaths2 | I.IPaths3 | I.IPaths3a
export type IPathsDefinition = I.IPaths2Definition | I.IPaths3Definition | I.IPaths3aDefinition
export type IPathsSchemaProcessor = SchemaProcessor<I.IPaths2Definition, I.IPaths2> | SchemaProcessor<I.IPaths3Definition, I.IPaths3> | SchemaProcessor<I.IPaths3aDefinition, I.IPaths3a>
export type IReference = I.IReference2 | I.IReference3 | I.IReference3a
export type IReferenceDefinition = I.IReference2Definition | I.IReference3Definition | I.IReference3aDefinition
export type IReferenceSchemaProcessor = SchemaProcessor<I.IReference2Definition, I.IReference2> | SchemaProcessor<I.IReference3Definition, I.IReference3> | SchemaProcessor<I.IReference3aDefinition, I.IReference3a>
export type IRequestBody = I.IRequestBody3 | I.IRequestBody3a
export type IRequestBodyDefinition = I.IRequestBody3Definition | I.IRequestBody3aDefinition
export type IRequestBodySchemaProcessor = SchemaProcessor<I.IRequestBody3Definition, I.IRequestBody3> | SchemaProcessor<I.IRequestBody3aDefinition, I.IRequestBody3a>
export type IResponse = I.IResponse2 | I.IResponse3 | I.IResponse3a
export type IResponseDefinition = I.IResponse2Definition | I.IResponse3Definition | I.IResponse3aDefinition
export type IResponseSchemaProcessor = SchemaProcessor<I.IResponse2Definition, I.IResponse2> | SchemaProcessor<I.IResponse3Definition, I.IResponse3> | SchemaProcessor<I.IResponse3aDefinition, I.IResponse3a>
export type IResponses = I.IResponses2 | I.IResponses3 | I.IResponses3a
export type IResponsesDefinition = I.IResponses2Definition | I.IResponses3Definition | I.IResponses3aDefinition
export type IResponsesSchemaProcessor = SchemaProcessor<I.IResponses2Definition, I.IResponses2> | SchemaProcessor<I.IResponses3Definition, I.IResponses3> | SchemaProcessor<I.IResponses3aDefinition, I.IResponses3a>
export type ISchema = I.ISchema2 | I.ISchema3 | I.ISchema3a
export type ISchemaDefinition = I.ISchema2Definition | I.ISchema3Definition | I.ISchema3aDefinition
export type ISchemaSchemaProcessor = SchemaProcessor<I.ISchema2Definition, I.ISchema2> | SchemaProcessor<I.ISchema3Definition, I.ISchema3> | SchemaProcessor<I.ISchema3aDefinition, I.ISchema3a>
export type ISecurityRequirement = I.ISecurityRequirement2 | I.ISecurityRequirement3 | I.ISecurityRequirement3a
export type ISecurityRequirementDefinition = I.ISecurityRequirement2Definition | I.ISecurityRequirement3Definition | I.ISecurityRequirement3aDefinition
export type ISecurityRequirementSchemaProcessor = SchemaProcessor<I.ISecurityRequirement2Definition, I.ISecurityRequirement2> | SchemaProcessor<I.ISecurityRequirement3Definition, I.ISecurityRequirement3> | SchemaProcessor<I.ISecurityRequirement3aDefinition, I.ISecurityRequirement3a>
export type ISecurityScheme = I.ISecurityScheme2 | I.ISecurityScheme3 | I.ISecurityScheme3a
export type ISecuritySchemeDefinition = I.ISecurityScheme2Definition | I.ISecurityScheme3Definition | I.ISecurityScheme3aDefinition
export type ISecuritySchemeSchemaProcessor = SchemaProcessor<I.ISecurityScheme2Definition, I.ISecurityScheme2> | SchemaProcessor<I.ISecurityScheme3Definition, I.ISecurityScheme3> | SchemaProcessor<I.ISecurityScheme3aDefinition, I.ISecurityScheme3a>
export type IServer = I.IServer3 | I.IServer3a
export type IServerDefinition = I.IServer3Definition | I.IServer3aDefinition
export type IServerSchemaProcessor = SchemaProcessor<I.IServer3Definition, I.IServer3> | SchemaProcessor<I.IServer3aDefinition, I.IServer3a>
export type IServerVariable = I.IServerVariable3 | I.IServerVariable3a
export type IServerVariableDefinition = I.IServerVariable3Definition | I.IServerVariable3aDefinition
export type IServerVariableSchemaProcessor = SchemaProcessor<I.IServerVariable3Definition, I.IServerVariable3> | SchemaProcessor<I.IServerVariable3aDefinition, I.IServerVariable3a>
export type ISwagger = I.ISwagger2
export type ISwaggerDefinition = I.ISwagger2Definition
export type ISwaggerSchemaProcessor = SchemaProcessor<I.ISwagger2Definition, I.ISwagger2>
export type ITag = I.ITag2 | I.ITag3 | I.ITag3a
export type ITagDefinition = I.ITag2Definition | I.ITag3Definition | I.ITag3aDefinition
export type ITagSchemaProcessor = SchemaProcessor<I.ITag2Definition, I.ITag2> | SchemaProcessor<I.ITag3Definition, I.ITag3> | SchemaProcessor<I.ITag3aDefinition, I.ITag3a>
export type IXml = I.IXml2 | I.IXml3 | I.IXml3a
export type IXmlDefinition = I.IXml2Definition | I.IXml3Definition | I.IXml3aDefinition
export type IXmlSchemaProcessor = SchemaProcessor<I.IXml2Definition, I.IXml2> | SchemaProcessor<I.IXml3Definition, I.IXml3> | SchemaProcessor<I.IXml3aDefinition, I.IXml3a>

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
