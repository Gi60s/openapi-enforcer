export type Level = 'ignore' | 'opinion' | 'warn' | 'error'

export type ExceptionMessageData = ExceptionMessageError | ExceptionMessageWarn

interface ExceptionMessageBase {
  active?: boolean
  code: string
  level: Level
  message: string
  metadata: Record<string, any>
  reference: string
}

interface ExceptionMessageError extends ExceptionMessageBase{
  level: 'error'
}

interface ExceptionMessageWarn extends ExceptionMessageBase {
  level: 'ignore' | 'opinion' | 'warn'
  xEnforcer: string
}
