import { getConfig, setConfig } from './config'

export function exceptionLevel (levels: Array<'opinion'|'warn'|'error'>, handler: () => void): void {
  const include = getConfig().exceptions.include
  setConfig({
    exceptions: { include: levels }
  })
  handler()
  setConfig({
    exceptions: { include }
  })
}
