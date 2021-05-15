export type Level = 'ignore' | 'opinion' | 'warn' | 'error'

export interface ExceptionMessageData {
  active?: boolean
  code: string
  level: Level
  message: string
  metadata: Record<string, any>
  reference: string
}
