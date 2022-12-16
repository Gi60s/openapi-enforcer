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
import { ISchemaProcessor } from '../ComponentSchemaDefinition/ISchemaProcessor'

export * from './'

export type ICallback = I.ICallback3
export type ICallbackDefinition = I.ICallback3Definition
export type ICallbackSchemaProcessor = ISchemaProcessor<I.ICallback3Definition, I.ICallback3>
export type IComponents = I.IComponents3
export type IComponentsDefinition = I.IComponents3Definition
export type IComponentsSchemaProcessor = ISchemaProcessor<I.IComponents3Definition, I.IComponents3>
export type IContact = I.IContact2 | I.IContact3
export type IContactDefinition = I.IContact2Definition | I.IContact3Definition
export type IContactSchemaProcessor = ISchemaProcessor<I.IContact2Definition, I.IContact2> | ISchemaProcessor<I.IContact3Definition, I.IContact3>
export type IDiscriminator = I.IDiscriminator3
export type IDiscriminatorDefinition = I.IDiscriminator3Definition
export type IDiscriminatorSchemaProcessor = ISchemaProcessor<I.IDiscriminator3Definition, I.IDiscriminator3>
export type IEncoding = I.IEncoding3
export type IEncodingDefinition = I.IEncoding3Definition
export type IEncodingSchemaProcessor = ISchemaProcessor<I.IEncoding3Definition, I.IEncoding3>
export type IExample = I.IExample2 | I.IExample3
export type IExampleDefinition = I.IExample2Definition | I.IExample3Definition
export type IExampleSchemaProcessor = ISchemaProcessor<I.IExample2Definition, I.IExample2> | ISchemaProcessor<I.IExample3Definition, I.IExample3>
export type IExternalDocumentation = I.IExternalDocumentation2 | I.IExternalDocumentation3
export type IExternalDocumentationDefinition = I.IExternalDocumentation2Definition | I.IExternalDocumentation3Definition
export type IExternalDocumentationSchemaProcessor = ISchemaProcessor<I.IExternalDocumentation2Definition, I.IExternalDocumentation2> | ISchemaProcessor<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>
export type IHeader = I.IHeader2 | I.IHeader3
export type IHeaderDefinition = I.IHeader2Definition | I.IHeader3Definition
export type IHeaderSchemaProcessor = ISchemaProcessor<I.IHeader2Definition, I.IHeader2> | ISchemaProcessor<I.IHeader3Definition, I.IHeader3>
export type IInfo = I.IInfo2 | I.IInfo3
export type IInfoDefinition = I.IInfo2Definition | I.IInfo3Definition
export type IInfoSchemaProcessor = ISchemaProcessor<I.IInfo2Definition, I.IInfo2> | ISchemaProcessor<I.IInfo3Definition, I.IInfo3>
export type IItems = I.IItems2
export type IItemsDefinition = I.IItems2Definition
export type IItemsSchemaProcessor = ISchemaProcessor<I.IItems2Definition, I.IItems2>
export type ILicense = I.ILicense2 | I.ILicense3
export type ILicenseDefinition = I.ILicense2Definition | I.ILicense3Definition
export type ILicenseSchemaProcessor = ISchemaProcessor<I.ILicense2Definition, I.ILicense2> | ISchemaProcessor<I.ILicense3Definition, I.ILicense3>
export type ILink = I.ILink3
export type ILinkDefinition = I.ILink3Definition
export type ILinkSchemaProcessor = ISchemaProcessor<I.ILink3Definition, I.ILink3>
export type IMediaType = I.IMediaType3
export type IMediaTypeDefinition = I.IMediaType3Definition
export type IMediaTypeSchemaProcessor = ISchemaProcessor<I.IMediaType3Definition, I.IMediaType3>
export type IOAuthFlow = I.IOAuthFlow3
export type IOAuthFlowDefinition = I.IOAuthFlow3Definition
export type IOAuthFlowSchemaProcessor = ISchemaProcessor<I.IOAuthFlow3Definition, I.IOAuthFlow3>
export type IOAuthFlows = I.IOAuthFlows3
export type IOAuthFlowsDefinition = I.IOAuthFlows3Definition
export type IOAuthFlowsSchemaProcessor = ISchemaProcessor<I.IOAuthFlows3Definition, I.IOAuthFlows3>
export type IOpenAPI = I.IOpenAPI3
export type IOpenAPIDefinition = I.IOpenAPI3Definition
export type IOpenAPISchemaProcessor = ISchemaProcessor<I.IOpenAPI3Definition, I.IOpenAPI3>
export type IOperation = I.IOperation2 | I.IOperation3
export type IOperationDefinition = I.IOperation2Definition | I.IOperation3Definition
export type IOperationSchemaProcessor = ISchemaProcessor<I.IOperation2Definition, I.IOperation2> | ISchemaProcessor<I.IOperation3Definition, I.IOperation3>
export type IParameter = I.IParameter2 | I.IParameter3
export type IParameterDefinition = I.IParameter2Definition | I.IParameter3Definition
export type IParameterSchemaProcessor = ISchemaProcessor<I.IParameter2Definition, I.IParameter2> | ISchemaProcessor<I.IParameter3Definition, I.IParameter3>
export type IPathItem = I.IPathItem2 | I.IPathItem3
export type IPathItemDefinition = I.IPathItem2Definition | I.IPathItem3Definition
export type IPathItemSchemaProcessor = ISchemaProcessor<I.IPathItem2Definition, I.IPathItem2> | ISchemaProcessor<I.IPathItem3Definition, I.IPathItem3>
export type IPaths = I.IPaths2 | I.IPaths3
export type IPathsDefinition = I.IPaths2Definition | I.IPaths3Definition
export type IPathsSchemaProcessor = ISchemaProcessor<I.IPaths2Definition, I.IPaths2> | ISchemaProcessor<I.IPaths3Definition, I.IPaths3>
export type IReference = I.IReference2 | I.IReference3
export type IReferenceDefinition = I.IReference2Definition | I.IReference3Definition
export type IReferenceSchemaProcessor = ISchemaProcessor<I.IReference2Definition, I.IReference2> | ISchemaProcessor<I.IReference3Definition, I.IReference3>
export type IRequestBody = I.IRequestBody3
export type IRequestBodyDefinition = I.IRequestBody3Definition
export type IRequestBodySchemaProcessor = ISchemaProcessor<I.IRequestBody3Definition, I.IRequestBody3>
export type IResponse = I.IResponse2 | I.IResponse3
export type IResponseDefinition = I.IResponse2Definition | I.IResponse3Definition
export type IResponseSchemaProcessor = ISchemaProcessor<I.IResponse2Definition, I.IResponse2> | ISchemaProcessor<I.IResponse3Definition, I.IResponse3>
export type IResponses = I.IResponses2 | I.IResponses3
export type IResponsesDefinition = I.IResponses2Definition | I.IResponses3Definition
export type IResponsesSchemaProcessor = ISchemaProcessor<I.IResponses2Definition, I.IResponses2> | ISchemaProcessor<I.IResponses3Definition, I.IResponses3>
export type ISchema = I.ISchema2 | I.ISchema3
export type ISchemaDefinition = I.ISchema2Definition | I.ISchema3Definition
export type ISchemaSchemaProcessor = ISchemaProcessor<I.ISchema2Definition, I.ISchema2> | ISchemaProcessor<I.ISchema3Definition, I.ISchema3>
export type ISecurityRequirement = I.ISecurityRequirement2 | I.ISecurityRequirement3
export type ISecurityRequirementDefinition = I.ISecurityRequirement2Definition | I.ISecurityRequirement3Definition
export type ISecurityRequirementSchemaProcessor = ISchemaProcessor<I.ISecurityRequirement2Definition, I.ISecurityRequirement2> | ISchemaProcessor<I.ISecurityRequirement3Definition, I.ISecurityRequirement3>
export type ISecurityScheme = I.ISecurityScheme2 | I.ISecurityScheme3
export type ISecuritySchemeDefinition = I.ISecurityScheme2Definition | I.ISecurityScheme3Definition
export type ISecuritySchemeSchemaProcessor = ISchemaProcessor<I.ISecurityScheme2Definition, I.ISecurityScheme2> | ISchemaProcessor<I.ISecurityScheme3Definition, I.ISecurityScheme3>
export type IServer = I.IServer3
export type IServerDefinition = I.IServer3Definition
export type IServerSchemaProcessor = ISchemaProcessor<I.IServer3Definition, I.IServer3>
export type IServerVariable = I.IServerVariable3
export type IServerVariableDefinition = I.IServerVariable3Definition
export type IServerVariableSchemaProcessor = ISchemaProcessor<I.IServerVariable3Definition, I.IServerVariable3>
export type ISwagger = I.ISwagger2
export type ISwaggerDefinition = I.ISwagger2Definition
export type ISwaggerSchemaProcessor = ISchemaProcessor<I.ISwagger2Definition, I.ISwagger2>
export type ITag = I.ITag2 | I.ITag3
export type ITagDefinition = I.ITag2Definition | I.ITag3Definition
export type ITagSchemaProcessor = ISchemaProcessor<I.ITag2Definition, I.ITag2> | ISchemaProcessor<I.ITag3Definition, I.ITag3>
export type IXml = I.IXml2 | I.IXml3
export type IXmlDefinition = I.IXml2Definition | I.IXml3Definition
export type IXmlSchemaProcessor = ISchemaProcessor<I.IXml2Definition, I.IXml2> | ISchemaProcessor<I.IXml3Definition, I.IXml3>

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
