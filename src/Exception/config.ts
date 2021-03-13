import util from 'util'

interface ExceptionData {
  fixedLevel: boolean
  message: string
  level: Level
  reference?: string
}

interface ExceptionCodes {
  [key: string]: ExceptionData
}

export type Level = 'ignore' | 'opinion' | 'warn' | 'error'

const config: ExceptionCodes = {

  // media type
  'MEDTYP': { 
    fixedLevel: false,
    level: 'warn',
    message: 'Media type appears invalid: %s'
  },

  // parameter codes
  'COOKXP': {
    fixedLevel: true,
    level: 'error',
    message: 'Cookies do not support exploded values for schemas of type array or object.'
  },
  'PATREQ': {
    fixedLevel: true,
    level: 'error',
    message: 'Required must be true for "path" parameters.'
  },
  'STYSCH': {
    fixedLevel: true,
    level: 'error',
    message: 'Style %s is incompatible with schema type: %s'
  },

  // Operation
  'OPRBDY': {
    fixedLevel: false,
    level: 'warn',
    message: 'Including a request body with a %s request is against the REST specification'
  },

  // PathItem
  'NOMTHD': {
    fixedLevel: false,
    level: 'warn',
    message: 'No methods defined.'
  },

  // Paths
  'PTHESH': {
    fixedLevel: false,
    level: 'opinion',
    message: 'Paths should not end with a slash.'
  },
  'PTHSSH': {
    fixedLevel: true,
    level: 'error',
    message: 'Path must begin with a single forward slash.',
    reference: 'https://tools.ietf.org/html/rfc3986#section-3.3'
  },
  
  // Schema
  'DEFREQ': {
    fixedLevel: false,
    level: 'warn',
    message: 'Setting a "default" value and setting "required" to true means the "default" value will never be used.'
  },
  'MAXMIN': {
    fixedLevel: true,
    level: 'error',
    message: 'Property %s must be less than %s.'
  },
  'TYPFRM': {
    fixedLevel: false,
    level: 'warn',
    message: 'Non-standard format used: %s. %s'
  }
}

let displayLevel: Level = 'warn'

// change the exception levels per code
export function configureExceptions (data: { [code: string]: 'ignore' | 'warn' | 'error' }) {
  Object.keys(data).forEach(code => {
    const item = config[code]
    const newLevel = data[code]
    if (newLevel !== item.level) {
      if (item.fixedLevel) throw Error('Cannot modify exception level for exception ' + code)
      item.level = newLevel
    }
  })
}

export function getAlert (code: string, ...args: any[]): { level: Level, message: string, reference: string } {
  const data: ExceptionData = config[code]
  if (!data) throw Error('Invalid message code: ' + code)
  
  return {
    level: data.level,
    message: util.format(data.message, ...args),
    reference: data.reference || ''
  }
}