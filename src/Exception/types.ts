import { Location } from 'json-to-ast'

export type Level = 'ignore' | 'opinion' | 'warn' | 'error'

export interface LocationInput {
  node: any
  key?: string | number
  type?: 'value' | 'key' | 'both'
}

export interface ExceptionMessageData {
  active?: () => boolean
  alternateLevels: Level[]
  code: string
  definition?: any
  id: string
  level: Level
  locations: Location[]
  message: string
  metadata: Record<string, any>
  reference: string
}

export interface ExceptionMessageDataInput {
  active?: () => boolean
  alternateLevels: Level[]
  code: string
  definition: any
  id: string
  level: Level
  locations: LocationInput[]
  message: string
  metadata: Record<string, any>
  reference: string
}
