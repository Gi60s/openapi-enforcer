import { Location } from 'json-to-ast'

export type Level = 'ignore' | 'opinion' | 'warn' | 'error'

export interface LocationInput {
  node?: any // if node is not provided then the component definition is used for the node
  key?: string | number
  type?: 'value' | 'key' | 'both'
}

export interface ExceptionMessageData {
  alternateLevels: Level[]
  code: string
  definition?: any
  level: Level
  locations: Location[]
  message: string
  metadata: Record<string, any>
  reference: string
}

export interface ExceptionMessageDataInput {
  alternateLevels: Level[]
  code: string
  definition: any
  level: Level
  locations: LocationInput[]
  message: string
  metadata: Record<string, any>
  reference: string
}
