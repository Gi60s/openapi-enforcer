import { ICallback3, ICallback3Definition } from '../Callback/ICallback'
import { IExample3, IExample3Definition } from '../interfaces2/IExample'
import { IHeader3, IHeader3Definition } from '../Header/IHeader'
import { ILink3, ILink3Definition } from '../interfaces2/ILink'
import { IParameter3, IParameter3Definition } from '../interfaces2/IParameter'
import { IRequestBody3, IRequestBody3Definition } from '../interfaces2/IRequestBody'
import { IResponse3, IResponse3Definition } from '../interfaces2/IResponse'
import { ISchema3, ISchema3Definition } from '../interfaces2/ISchema'
import { ISecurityScheme3, ISecurityScheme3Definition } from '../interfaces2/ISecurityScheme'
import { IReferenceDefinition } from '../interfaces2/IReference'
import { IEnforcerExtensionDefinition } from '../interfaces2/IIndex'

export interface IComponents3 {
  extensions: Record<string, any>
  callbacks?: Record<string, ICallback3>
  examples?: Record<string, IExample3>
  headers?: Record<string, IHeader3>
  links?: Record<string, ILink3>
  parameters?: Record<string, IParameter3>
  requestBodies?: Record<string, IRequestBody3>
  responses?: Record<string, IResponse3>
  schemas?: Record<string, ISchema3>
  securitySchemes?: Record<string, ISecurityScheme3>
}

export interface IComponents3Definition {
  [key: `x-${string}`]: any
  'x-enforcer'?: IEnforcerExtensionDefinition
  callbacks?: Record<string, ICallback3Definition | IReferenceDefinition>
  examples?: Record<string, IExample3Definition | IReferenceDefinition>
  headers?: Record<string, IHeader3Definition | IReferenceDefinition>
  links?: Record<string, ILink3Definition | IReferenceDefinition>
  parameters?: Record<string, IParameter3Definition | IReferenceDefinition>
  requestBodies?: Record<string, IRequestBody3Definition | IReferenceDefinition>
  responses?: Record<string, IResponse3Definition | IReferenceDefinition>
  schemas?: Record<string, ISchema3Definition | IReferenceDefinition>
  securitySchemes?: Record<string, ISecurityScheme3Definition | IReferenceDefinition>
}
