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

import { ISchemaProcessor } from './ISchemaProcessor'
export type ICallback = I.ICallback3
export type ICallbackDefinition = I.ICallback3Definition
export type ICallbackSchemaProcessor = ISchemaProcessor<ICallbackDefinition, ICallback>
export type IComponents = I.IComponents3
export type IComponentsDefinition = I.IComponents3Definition
export type IComponentsSchemaProcessor = ISchemaProcessor<IComponentsDefinition, IComponents>
export type IContact = I.IContact2 | I.IContact3
export type IContactDefinition = I.IContact2Definition | I.IContact3Definition
export type IContactSchemaProcessor = ISchemaProcessor<IContactDefinition, IContact> | ISchemaProcessor<IContactDefinition, IContact>
export type IDiscriminator = I.IDiscriminator3
export type IDiscriminatorDefinition = I.IDiscriminator3Definition
export type IDiscriminatorSchemaProcessor = ISchemaProcessor<IDiscriminatorDefinition, IDiscriminator>
export type IEncoding = I.IEncoding3
export type IEncodingDefinition = I.IEncoding3Definition
export type IEncodingSchemaProcessor = ISchemaProcessor<IEncodingDefinition, IEncoding>
export type IExample = I.IExample2 | I.IExample3
export type IExampleDefinition = I.IExample2Definition | I.IExample3Definition
export type IExampleSchemaProcessor = ISchemaProcessor<IExampleDefinition, IExample> | ISchemaProcessor<IExampleDefinition, IExample>
export type IExternalDocumentation = I.IExternalDocumentation2 | I.IExternalDocumentation3
export type IExternalDocumentationDefinition = I.IExternalDocumentation2Definition | I.IExternalDocumentation3Definition
export type IExternalDocumentationSchemaProcessor = ISchemaProcessor<IExternalDocumentationDefinition, IExternalDocumentation> | ISchemaProcessor<IExternalDocumentationDefinition, IExternalDocumentation>
export type IHeader = I.IHeader2 | I.IHeader3
export type IHeaderDefinition = I.IHeader2Definition | I.IHeader3Definition
export type IHeaderSchemaProcessor = ISchemaProcessor<IHeaderDefinition, IHeader> | ISchemaProcessor<IHeaderDefinition, IHeader>
export type IInfo = I.IInfo2 | I.IInfo3
export type IInfoDefinition = I.IInfo2Definition | I.IInfo3Definition
export type IInfoSchemaProcessor = ISchemaProcessor<IInfoDefinition, IInfo> | ISchemaProcessor<IInfoDefinition, IInfo>
export type IItems = I.IItems2
export type IItemsDefinition = I.IItems2Definition
export type IItemsSchemaProcessor = ISchemaProcessor<IItemsDefinition, IItems>
export type ILicense = I.ILicense2 | I.ILicense3
export type ILicenseDefinition = I.ILicense2Definition | I.ILicense3Definition
export type ILicenseSchemaProcessor = ISchemaProcessor<ILicenseDefinition, ILicense> | ISchemaProcessor<ILicenseDefinition, ILicense>
export type ILink = I.ILink3
export type ILinkDefinition = I.ILink3Definition
export type ILinkSchemaProcessor = ISchemaProcessor<ILinkDefinition, ILink>
export type IMediaType = I.IMediaType3
export type IMediaTypeDefinition = I.IMediaType3Definition
export type IMediaTypeSchemaProcessor = ISchemaProcessor<IMediaTypeDefinition, IMediaType>
export type IOAuthFlow = I.IOAuthFlow3
export type IOAuthFlowDefinition = I.IOAuthFlow3Definition
export type IOAuthFlowSchemaProcessor = ISchemaProcessor<IOAuthFlowDefinition, IOAuthFlow>
export type IOAuthFlows = I.IOAuthFlows3
export type IOAuthFlowsDefinition = I.IOAuthFlows3Definition
export type IOAuthFlowsSchemaProcessor = ISchemaProcessor<IOAuthFlowsDefinition, IOAuthFlows>
export type IOpenAPI = I.IOpenAPI3
export type IOpenAPIDefinition = I.IOpenAPI3Definition
export type IOpenAPISchemaProcessor = ISchemaProcessor<IOpenAPIDefinition, IOpenAPI>
export type IOperation = I.IOperation2 | I.IOperation3
export type IOperationDefinition = I.IOperation2Definition | I.IOperation3Definition
export type IOperationSchemaProcessor = ISchemaProcessor<IOperationDefinition, IOperation> | ISchemaProcessor<IOperationDefinition, IOperation>
export type IParameter = I.IParameter2 | I.IParameter3
export type IParameterDefinition = I.IParameter2Definition | I.IParameter3Definition
export type IParameterSchemaProcessor = ISchemaProcessor<IParameterDefinition, IParameter> | ISchemaProcessor<IParameterDefinition, IParameter>
export type IPathItem = I.IPathItem2 | I.IPathItem3
export type IPathItemDefinition = I.IPathItem2Definition | I.IPathItem3Definition
export type IPathItemSchemaProcessor = ISchemaProcessor<IPathItemDefinition, IPathItem> | ISchemaProcessor<IPathItemDefinition, IPathItem>
export type IPaths = I.IPaths2 | I.IPaths3
export type IPathsDefinition = I.IPaths2Definition | I.IPaths3Definition
export type IPathsSchemaProcessor = ISchemaProcessor<IPathsDefinition, IPaths> | ISchemaProcessor<IPathsDefinition, IPaths>
export type IReference = I.IReference2 | I.IReference3
export type IReferenceDefinition = I.IReference2Definition | I.IReference3Definition
export type IReferenceSchemaProcessor = ISchemaProcessor<IReferenceDefinition, IReference> | ISchemaProcessor<IReferenceDefinition, IReference>
export type IRequestBody = I.IRequestBody3
export type IRequestBodyDefinition = I.IRequestBody3Definition
export type IRequestBodySchemaProcessor = ISchemaProcessor<IRequestBodyDefinition, IRequestBody>
export type IResponse = I.IResponse2 | I.IResponse3
export type IResponseDefinition = I.IResponse2Definition | I.IResponse3Definition
export type IResponseSchemaProcessor = ISchemaProcessor<IResponseDefinition, IResponse> | ISchemaProcessor<IResponseDefinition, IResponse>
export type IResponses = I.IResponses2 | I.IResponses3
export type IResponsesDefinition = I.IResponses2Definition | I.IResponses3Definition
export type IResponsesSchemaProcessor = ISchemaProcessor<IResponsesDefinition, IResponses> | ISchemaProcessor<IResponsesDefinition, IResponses>
export type ISchema = I.ISchema2 | I.ISchema3
export type ISchemaDefinition = I.ISchema2Definition | I.ISchema3Definition
export type ISchemaSchemaProcessor = ISchemaProcessor<ISchemaDefinition, ISchema> | ISchemaProcessor<ISchemaDefinition, ISchema>
export type ISecurityRequirement = I.ISecurityRequirement2 | I.ISecurityRequirement3
export type ISecurityRequirementDefinition = I.ISecurityRequirement2Definition | I.ISecurityRequirement3Definition
export type ISecurityRequirementSchemaProcessor = ISchemaProcessor<ISecurityRequirementDefinition, ISecurityRequirement> | ISchemaProcessor<ISecurityRequirementDefinition, ISecurityRequirement>
export type ISecurityScheme = I.ISecurityScheme2 | I.ISecurityScheme3
export type ISecuritySchemeDefinition = I.ISecurityScheme2Definition | I.ISecurityScheme3Definition
export type ISecuritySchemeSchemaProcessor = ISchemaProcessor<ISecuritySchemeDefinition, ISecurityScheme> | ISchemaProcessor<ISecuritySchemeDefinition, ISecurityScheme>
export type IServer = I.IServer3
export type IServerDefinition = I.IServer3Definition
export type IServerSchemaProcessor = ISchemaProcessor<IServerDefinition, IServer>
export type IServerVariable = I.IServerVariable3
export type IServerVariableDefinition = I.IServerVariable3Definition
export type IServerVariableSchemaProcessor = ISchemaProcessor<IServerVariableDefinition, IServerVariable>
export type ISwagger = I.ISwagger2
export type ISwaggerDefinition = I.ISwagger2Definition
export type ISwaggerSchemaProcessor = ISchemaProcessor<ISwaggerDefinition, ISwagger>
export type ITag = I.ITag2 | I.ITag3
export type ITagDefinition = I.ITag2Definition | I.ITag3Definition
export type ITagSchemaProcessor = ISchemaProcessor<ITagDefinition, ITag> | ISchemaProcessor<ITagDefinition, ITag>
export type IXml = I.IXml2 | I.IXml3
export type IXmlDefinition = I.IXml2Definition | I.IXml3Definition
export type IXmlSchemaProcessor = ISchemaProcessor<IXmlDefinition, IXml> | ISchemaProcessor<IXmlDefinition, IXml>

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
