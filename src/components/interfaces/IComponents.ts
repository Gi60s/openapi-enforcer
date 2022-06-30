import { ICallback } from './ICallback'
import { IExample } from './IExample'
import { IHeader3 } from './IHeader'
import { ILink } from './ILink'
import { IParameter3 } from './IParameter'
import { IRequestBody } from './IRequestBody'
import { IResponse3 } from './IResponse'
import { ISchema3 } from './ISchema'
import { ISecurityScheme3 } from './ISecurityScheme'

export interface IComponents {
  extensions: Record<string, any>
  callbacks?: Record<string, ICallback>
  examples?: Record<string, IExample>
  headers?: Record<string, IHeader3>
  links?: Record<string, ILink>
  parameters?: Record<string, IParameter3>
  requestBodies?: Record<string, IRequestBody>
  responses?: Record<string, IResponse3>
  schemas?: Record<string, ISchema3>
  securitySchemes?: Record<string, ISecurityScheme3>
}
