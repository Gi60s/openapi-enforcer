import { Version } from './components'

interface CodesMap {
  DEFREQ: ExceptionLevel
  ENCMED: ExceptionLevel
  EXNOSC: ExceptionLevel
  EXSCNS: ExceptionLevel
  EXSCNV: ExceptionLevel
  MEDTYP: ExceptionLevel
  NOMTHD: ExceptionLevel
  OPRBDY: ExceptionLevel
  OPRSUM: ExceptionLevel
  PTHESH: ExceptionLevel
  PTHINC: ExceptionLevel
  RESNBD: ExceptionLevel
  RESNOS: ExceptionLevel
  RESPHD: ExceptionLevel
  TYPFRM: ExceptionLevel
}

export interface Configuration {
  exceptions?: ExceptionConfiguration
  production?: boolean
  version?: Version
}

export interface ExceptionConfiguration {
  codes?: CodesMap
  include?: Array<'opinion'|'warn'|'error'>
  lineDelimiter?: string
}

export interface FullConfiguration {
  exceptions: Required<ExceptionConfiguration>
  production: boolean
  version: Version
}

type ExceptionLevel = 'ignore' | 'opinion' | 'warn' | 'error'

let current: FullConfiguration = {
  exceptions: {
    codes: {
      DEFREQ: 'warn',
      ENCMED: 'warn',
      EXNOSC: 'opinion',
      EXSCNS: 'warn',
      EXSCNV: 'warn',
      MEDTYP: 'warn',
      NOMTHD: 'warn',
      OPRBDY: 'warn',
      OPRSUM: 'warn',
      PTHESH: 'opinion',
      PTHINC: 'warn',
      RESNBD: 'warn',
      RESNOS: 'warn',
      RESPHD: 'warn',
      TYPFRM: 'warn'
    },
    include: ['error', 'warn'],
    lineDelimiter: '\r' // TODO: how does windows handle this instead of \r\n?
  },
  production: process.env.NODE_ENV === 'production',
  version: '3.0.0'
}

const codeSchema = {
  type: 'string',
  enum: ['ignore', 'warn', 'error']
}

const schema = {
  type: 'object',
  properties: {
    exceptions: {
      type: 'object',
      properties: {
        codes: {
          type: 'object',
          properties: {
            DEFREQ: codeSchema,
            ENCMED: codeSchema,
            EXNOSC: codeSchema,
            EXSCNS: codeSchema,
            EXSCNV: codeSchema,
            MEDTYP: codeSchema,
            NOMTHD: codeSchema,
            OPRBDY: codeSchema,
            OPRSUM: codeSchema,
            PTHESH: codeSchema,
            PTHINC: codeSchema,
            RESNBD: codeSchema,
            RESNOS: codeSchema,
            RESPHD: codeSchema,
            TYPFRM: codeSchema
          }
        },
        opinions: {
          type: 'boolean'
        }
      }
    },
    production: {
      type: 'boolean'
    }
  }
}

export function setConfig (configuration: Configuration): void {
  current = update(schema, configuration, current, '')
}

export function getConfig (): FullConfiguration {
  return current
}

function update (schema: any, source: any, original: any, path: string): any {
  const { type } = schema
  const sType = typeof source

  if (type === 'boolean') {
    if (sType !== 'boolean') throw Error('Invalid type at ' + path + '. Expected a boolean.')
    return source
  } else if (type === 'string') {
    if (sType !== 'string') throw Error('Invalid type at ' + path + '. Expected a string.')
    if ('enum' in schema && schema.enum.includes(source) === false) throw Error('Invalid value at ' + path + '. Expected on of: ' + (schema.enum.join(', ') as string))
    return source
  } else if (type === 'object') {
    if (source === null || sType !== 'object') throw Error('Invalid type at ' + path + '. Expected a non-null object.')

    const result: any = Object.assign({}, original)
    if ('properties' in schema) {
      Object.keys(schema.properties).forEach(propName => {
        if (propName in source) {
          const subSchema = schema.properties[propName]
          result[propName] = update(subSchema, source[propName], original[propName], path + ' > ' + propName)
        }
      })
    }
  }
}
