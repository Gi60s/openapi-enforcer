import { ISchemaProcessor } from './components/ISchemaProcessor'
import { Chain } from './Chain/Chain'

/**
 * If a function has been deprecated, use this function to provide a console message once every 10 minutes when
 * called.
 * @param oldName The name of the old function.
 * @param newName The name of the new function
 * @param fn The deprecated function
 */
export function deprecated<F extends Function> (oldName: string, newName: string, fn: F): F {
  let lastRun = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (lastRun < now - 600000) {
      console.warn('The function ' + oldName + ' has been deprecated. Please start using ' + newName)
      lastRun = now
    }
    return fn(...args)
  } as unknown as F
}

/**
 * Takes a value and converts it to a string, optionally adding quotation marks around string values.
 * @param value The value to convert to a string.
 * @param options
 * @param [options.addQuotationMarksToStrings] Set to true to wrap string values in quotation marks.
 * @param [options.wrapArray] Set to true to put square brackets around arrays.
 */
export function smart (value: any, options?: { addQuotationMarksToStrings?: boolean, wrapArray?: boolean }): string {
  const addQuotationMarksToStrings = options?.addQuotationMarksToStrings ?? true
  const wrapArray = options?.wrapArray ?? false

  if (typeof value === 'string') {
    return addQuotationMarksToStrings
      ? '"' + value.replace(/"/g, '\\"') + '"'
      : value
  } else if (value instanceof Date) {
    return isNaN(+value) ? 'invalid date object' : value.toISOString()
  } else if (Array.isArray(value)) {
    const result = value.map(v => smart(v, options)).join(', ')
    return wrapArray ? '[' + result + ']' : result
  } else {
    return String(value)
  }
}
