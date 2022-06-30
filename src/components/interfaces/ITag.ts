import { IExternalDocumentation } from './IExternalDocumentation'

export interface ITag {
  extensions: Record<string, any>
  name: string
  description?: string
  externalDocs?: IExternalDocumentation
}
