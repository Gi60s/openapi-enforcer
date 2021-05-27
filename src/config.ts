import { Version } from './components'

export type CodesMap = Record<string, ExceptionLevel>

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
    codes: {},
    include: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
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
        include: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['error', 'warn', 'opinion']
          }
        },
        lineDelimiter: {
          type: 'string'
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

  if (type === 'array') {
    if (!Array.isArray(source)) throw Error('Invalid type at ' + path + '. Expected an array.')
    return source.map((s, i) => update(schema.items, s, original[i], path + ' > ' + String(i)))
  } else if (type === 'boolean') {
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
    return result
  }
}
