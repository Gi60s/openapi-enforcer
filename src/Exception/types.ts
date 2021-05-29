import { Location } from 'json-to-ast'

export type Level = 'ignore' | 'opinion' | 'warn' | 'error'

export interface ExceptionMessageData {
  active?: boolean
  code: string
  level: Level
  locations?: Location[]
  message: string
  metadata: Record<string, any>
  reference: string
}
